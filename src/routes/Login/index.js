import React, { useReducer, useState, useEffect, useCallback, useRef } from "react";
import { STATUS } from "../../App/Constants";
import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  InputGroup,
  InputRightElement,
  PinInput,
  PinInputField,
  Spinner,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useApiRequest } from "../../services/api/useApiRequest";
import { URIS } from "../../services/api";
import {
  sendOtpRequestAction,
  verifyCouponCodeAction,
  resetLoginStatus,
} from "../../redux/reducers/user";
import { useAppContext, useIsAuthenticated } from "../../App/Context";
import { FormReducer } from "../../utils/FormReducer";
import { GoogleLogin } from "react-google-login";
import { useDispatch, useSelector } from "react-redux";
import { LoadingRef } from "../../App/AppProvider";
import { useHistory } from "react-router-dom";
import { CheckIcon } from "@chakra-ui/icons";
import { ROUTES } from "../../Constants/Routes";
import { SIGNIN_MODAL_TYPE } from "../../Components/CommonHeader";
import { useLoginModal } from "../../App/useLoginModal";
import { apis } from "../../services/api/apis";

export const LoginRoute = () => {
  const { modalType, isLoginModalOpen, closeLoginModal } = useLoginModal();

  const history = useHistory();
  const dispatch = useDispatch();
  const isAuthenticated = useIsAuthenticated();

  const { loginSuccess } = useAppContext();

  const [loginData, dispatchPropertyChange] = useReducer(FormReducer, {});
  const [inputCorrect, changeInputStatus] = useState(true);

  const [couponVerified, setCouponVerified] = useState({
    verified: false,
    message: "",
  });

  const [showCouponField, setShowCouponField] = useState(false);
  const [validContact, setValidContact] = useState(true);
  const [couponCode, changeCouponCode] = useState("");
  const { user } = useSelector((state) => ({
    user: state.user,
  }));

  useEffect(() => {
    if(user.user?.contact){
      let check = user.user.contact.match(/^[3456789]\d{9}$/);
      setValidContact(check);
    }
  }, [user.user])

  // console.log({user})

  const _changeData = (value) => {
    let check = value.target.value.match(/^[3456789]\d{9}$/);
    setValidContact(check);
    dispatchPropertyChange({ type: "data", value: value.target.value });
  };

  const _changeOTP = (value) => {
    dispatchPropertyChange({ type: "otp", value: value });
  };

  useEffect(() => {
    dispatch(resetLoginStatus());
  }, [dispatch]);

  useEffect(() => {
    return () => dispatch(resetLoginStatus())
  }, [dispatch])

  const toast = useToast();

  useEffect(() => {
    if (user.verifyCouponStatus === STATUS.SUCCESS) {
      // console.log('Coupon Verify : Response : ', user.verifyCouponResponse)
      if (user.verifyCouponResponse?.response?.error) {
        toast({
          status: "error",
          title: "Coupon not valid",
          position: "top",
        });
        setCouponVerified({
          verified: false,
          message: user.verifyCouponResponse?.response?.message,
        });
      } else {
        setTimeout(() => {
          window.location.reload()
        }, 1000);
        
        toast({
          status: "success",
          title: "Congrats, Your coupon is verified Successfully",
          position: "top",
        });
        setCouponVerified({
          verified: true,
          message: "Congrats, Your coupon is verified Successfully",
        });
      }
    }
  }, [toast, user]);


  useEffect(() => {
    if (user.verifyOtpStatus === STATUS.SUCCESS) {
      loginSuccess({ ...user.verifyOtpResponse, type: "student" });
    }
  }, [loginSuccess, user.verifyOtpResponse, user.verifyOtpStatus]);

  const sendLoginRequest = (type) => {
    if (type === "contact") {
      loginData &&
        loginData.data &&
        dispatch(sendOtpRequestAction({ contact: loginData.data }));
    }
  };

  const [loginLimit, setLoginLimit] = useState(false)

  const _success = useCallback((data) => {
    toast({
      status: "success",
      title: "Logged In Successfully..",
      position: "top",
    });
    loginSuccess({ ...data, loginType: modalType });
    dispatch(resetLoginStatus());

  },[dispatch, loginSuccess, modalType, toast])


  const onCompleted  = useCallback( (data) => {
    if(data.error){
      toast({
        status: "warning",
        title: "Login Count exceeded",
        position: "top",
        duration:2000,
      });               
      setLoginLimit(data)                 
    }else{
      _success(data)
    }
  },[_success, toast])


  const onError = useCallback((data, response) => {
    console.log("login failed", response)
    toast({
      status: "error",
      title: "Login failed",
      description: response?.message,
      isClosable: true,
      position: "top",
    });
   
  },[toast])

  const {
    request: loginRequest,
    loading,
  } = useApiRequest(URIS.LOGIN, {
    onCompleted,
    onError,
  });



  const _loginRequest = (data) => {
    loginRequest({ data });
  };

  const handleGoogleLogin = (response) => {
    _loginRequest({ method: "google", data: response });
  };

  const otpLogin = () => {
    user.otpResponse &&
      _loginRequest({
        method: "contact",
        token: user.otpResponse.token,
        otp: loginData.otp,
      });
  };

  const _loginCredentials = (e) => {
    e.preventDefault();

    if (loginData.username && loginData.password) {
      _loginRequest(loginData);
    } else {
      toast({
        status: "error",
        title: "Missing details",
        description: "Username and Password are mandatory",
        isClosable: true,
      });
    }
  };

  const handleSubmit = (e) => {
    if (e.nativeEvent.submitter) {
      let submitter = e.nativeEvent.submitter.name;
      if (submitter === "enterOTP") otpLogin();
      else if (submitter === "verfiyCoupon") verifyCouponCode();
    }
  };

  const handleError = (response) => {
     console.log({"login error google" :  response});
  };

  const verifyCouponCode = () => {
    dispatch(verifyCouponCodeAction({ coupon: couponCode }));
  };

  useEffect(() => {
    setCouponVerified({ verified: false, message: "" });
  }, [isLoginModalOpen]);

  // console.log({loginData})

  const _handleClose = () => {
    setLoginLimit()
  }
  

  return  loginLimit ? 
  <LoginLimit data={loginLimit} closeModal={_handleClose} success={_success} setLoginLimit={setLoginLimit} />  
:
  (
    <Flex
      alignItemonClicks="stretch"
      justifyContent="center"
      h="100%"
      direction="column"
    >
      {modalType === SIGNIN_MODAL_TYPE.COUPON_LOGIN && !isAuthenticated ? (
        <Alert status="info" color="blue">
          <AlertIcon colorScheme="blue" />
          To Continue Verify your Phone Number
        </Alert>
      ) : null}
      <Divider />
      <Tabs>
        <TabList>
          <Tab>
            {modalType === SIGNIN_MODAL_TYPE.COUPON_LOGIN
              ? "Coupon Code"
              : "Phone / Google"}
          </Tab>
          <Tab isDisabled={modalType === SIGNIN_MODAL_TYPE.COUPON_LOGIN}>
            Username
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <Box w="100%" p={6}>
              <form
                action="javascript:chk()"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSubmit(e);
                }}
              >
                <FormControl id="contact" isRequired>
                  <FormLabel>Phone No.</FormLabel>
                  <InputGroup width="100%">
                    <Input
                      onChange={_changeData}
                      type="number"
                      maxLength="10"
                      pattern="/[0-2]{10}/"
                      required
                      disabled={isAuthenticated && user?.user?.contact}
                      defaultValue={
                        isAuthenticated && user?.user?.contact
                          ? user.user.contact
                          : ""
                      }
                    />
                    {isAuthenticated && user?.contact && (
                      <InputRightElement
                        children={<CheckIcon color="green.500" />}
                      />
                    )}
                  </InputGroup>
                </FormControl>
                {console.log('inputCorrect', inputCorrect, validContact)}
                {validContact ? null : (
                  <span
                    style={{
                      color: "red",
                      fontSize: "10px",
                      paddingLeft: "5px",
                    }}
                  >
                    Please Enter Correct Phone No.
                  </span>
                )}
                {user.otpStatus === STATUS.SUCCESS ? (
                  <div>
                    <FormControl id="otp" isRequired>
                      <FormLabel style={{ paddingTop: "10px" }}>
                        Enter OTP
                      </FormLabel>
                      {/* <Input onChange={_changeOTP}/> */}
                      <HStack>
                        <PinInput
                          otp
                          placeholder="_"
                          onComplete={_changeOTP}
                          onChange={_changeOTP}
                        >
                          <PinInputField />
                          <PinInputField />
                          <PinInputField />
                          <PinInputField />
                        </PinInput>
                        <Button
                          disabled={!loginData.otp}
                          // type="submit"
                          // value="submit"
                          name="enterOTP"
                          onClick={otpLogin}
                          isLoading={loading || user.status === STATUS.FETCHING}
                        >
                          {modalType === SIGNIN_MODAL_TYPE.COUPON_LOGIN
                            ? "Verify"
                            : "Login"}
                          {/* &nbsp;&nbsp;
                          {user.verifyOtpStatus === STATUS.FETCHING ? (
                            <Spinner size="sm" />
                          ) : null} */}
                        </Button>
                      </HStack>
                    </FormControl>
                  </div>
                ) : (
                  <div>
                    <br />
                    {!isAuthenticated && user.status !== STATUS.FETCHING ? (
                      <Button
                        disabled={
                          inputCorrect === false ||
                          !loginData.data ||
                          !validContact
                        }
                        onClick={() => sendLoginRequest("contact")}
                      >
                        Send OTP &nbsp;&nbsp;
                        {user.otpStatus === STATUS.FETCHING ? (
                          <Spinner size="sm" />
                        ) : null}
                      </Button>
                    ) : null}
                  </div>
                )}
                {modalType === SIGNIN_MODAL_TYPE.COUPON_LOGIN ? (
                  isAuthenticated && user.user ? (
                    <VStack>
                      <HStack width="100%">
                        <FormControl isRequired>
                          <FormLabel>Coupon Code</FormLabel>
                          <InputGroup size="md" width="100%">
                            <Input
                              pr="4.5rem"
                              type={"text"}
                              placeholder="- - - - - - - - - - -"
                              onChange={(e) =>
                                changeCouponCode(e.target.value.toUpperCase())
                              }
                              required
                              textTransform="uppercase"
                              fontWeight="500"
                              letterSpacing="2px"
                              fontSize="normal"
                              maxLength={12}
                              disabled={couponVerified.verified}
                            />
                            <InputRightElement width="fit-content">
                              {!couponVerified.verified ? (
                                <Button
                                  type="submit"
                                  value="submit"
                                  name="verfiyCoupon"
                                  disabled={
                                    !couponCode.length ||
                                    user.verifyCouponStatus === STATUS.FETCHING
                                  }
                                  h="1.75rem"
                                  size="sm"
                                >
                                  Verify{" "}
                                  {user.verifyCouponStatus ===
                                  STATUS.FETCHING ? (
                                    <Spinner size="sm" />
                                  ) : null}
                                </Button>
                              ) : (
                                <CheckIcon color="green.500" />
                              )}
                            </InputRightElement>
                          </InputGroup>
                        </FormControl>
                      </HStack>
                      {couponVerified?.message ? (
                        <span
                          style={{
                            color: couponVerified.verified ? "green" : "red",
                            fontSize: "10px",
                            paddingLeft: "5px",
                            width: "100%",
                            textAlign: "left",
                          }}
                        >
                          {couponVerified.message}
                        </span>
                      ) : null}
                      {couponVerified.verified ? (
                        <Button
                          onClick={() => {
                            history.push(ROUTES.COURSES);
                            closeLoginModal();
                          }}
                        >
                          View Your Courses
                        </Button>
                      ) : null}
                    </VStack>
                  ) : user.status === STATUS.FETCHING ? (
                    <Text>Please Wait ...</Text>
                  ) : null
                ) : null}

                <span
                  style={{
                    position: "relative",
                    left: "42%",
                    top: "33px",
                    backgroundColor: "white",
                    paddingLeft: "15px",
                    paddingRight: "15px",
                  }}
                >
                  OR
                </span>
                <hr style={{ margin: "20px" }} />
                <div style={{ textAlign: "center", padding: "15px" }}>
                  <GoogleLogin
                    clientId="959635100670-k9bprav11h3d6391hf2cnd2rdj01vft6.apps.googleusercontent.com"
                    buttonText=" Log in with Google"
                    onSuccess={handleGoogleLogin}
                    onFailure={handleError}
                    accessType="offline"
                    cookiePolicy={"single_host_origin"}
                  />
                </div>
                <Divider />
              </form>
            </Box>
          </TabPanel>
          <TabPanel>
            <Box pb={20}>
              <form onSubmit={_loginCredentials}>
                <VStack>
                  <FormControl id="username" isRequired>
                    <FormLabel>Username</FormLabel>
                    <Input
                      onChange={(e) =>
                        dispatchPropertyChange({
                          type: "username",
                          value: e.target.value,
                        })
                      }
                      type="text"
                      required
                    />
                  </FormControl>
                  <FormControl id="password" isRequired>
                    <FormLabel>Password</FormLabel>
                    <Input
                      onChange={(e) =>
                        dispatchPropertyChange({
                          type: "password",
                          value: e.target.value,
                        })
                      }
                      type="password"
                      required
                    />
                  </FormControl>

                  <Flex justify="flex-end">
                    <Button
                      isLoading={loading}
                      onClick={_loginCredentials}
                      type="submit"
                    >
                      Continue
                    </Button>
                  </Flex>
                </VStack>
              </form>
            </Box>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Flex>
  );
};


const LoginLimit = ({data, success, closeModal}) => {
  const [loading,setLoading] = useState(false)
  const toast = useToast()

  const _logoutOthers = async () => {
    setLoading(true)
    const res = await apis.logoutOthers({token:data.token})
    setLoading(false)
    if(res.ok){
      success(res.data)
      closeModal()
    }else{
      toast({
        status:"error",
        title: res?.data?.message || "Not authorized, Please try again..",
        position:"top"
      })
    }  
  }

  return (
    <Flex p={10} flexDirection="column" alignItems="center">
      <Heading  fontSize="lg">Logout others</Heading>
      <Text my={10}>You are already logged in {data.logincount} devices, Please logout other devices to access your account on this device </Text>
      <Button isLoading={loading} colorScheme="red" size="lg" mt={4} onClick={_logoutOthers}>Logout other devices and login here</Button>      
    </Flex>    
  )
}
