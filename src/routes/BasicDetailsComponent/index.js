import React, { useReducer, useState, useEffect } from "react";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  InputRightElement,
  useToast,
  InputGroup,
  InputLeftElement,
  HStack,
  PinInput,
  PinInputField,
  VStack,
  Center,
  Text,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { FormReducer } from "../../utils/FormReducer";
import { useHistory } from "react-router-dom";
import {
  resetLoginStatus,
  updateUserAction,
  sendOtpRequestAction,
  verifyOtpRequestAction,
} from "../../redux/reducers/user";
import { useAppContext } from "../../App/Context";
import "react-datepicker/dist/react-datepicker.css";
import { AtSignIcon, CheckIcon, EmailIcon, PhoneIcon } from "@chakra-ui/icons";
import { useCheckStatus } from "../../utils/useCheckStatus";
// import STATE_LIST from '../../data/IndiaStateList'
import { STATUS } from "../../App/Constants";

export const BasicDetailsComponent = (props) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(resetLoginStatus());
  }, [dispatch]);

  return (
    <Flex
      alignItems="center"
      justifyContent="center"
      direction="column-reverse"
    >
      <Box w="100%" p={6}>
        <BasicDetailsForm isCompletingProfile={true} />
      </Box>
    </Flex>
  );
};

export const BasicDetailsForm = () => {
  const dispatch = useDispatch();
  const { userData, verifyOtpStatus, updateUserStatus } = useSelector(
    (state) => ({
      userData: state.user,
      verifyOtpStatus: state.user.verifyOtpStatus,
      updateUserStatus: state.user.updateUserStatus,
    })
  );

  const [data, dispatchPropertyChange] = useReducer(FormReducer, {});

  const [contactVerifyState, setContactVerifyState] = useState({
    verified: userData?.user?.contact ? true : false,
    verifying: false,
  });

  const [showOtpInput, setShowOtpInput] = useState(false);

  const [showMoreInputs, setShowMoreInputs] = useState(
    contactVerifyState.verified
  );
  const [emailRequired, setEmailRequired] = useState();

  // const history = useHistory();

  const { user } = useSelector((state) => ({
    user: state.user,
  }));

  const _changeInInput = (type, value) => {
    dispatchPropertyChange({
      type,
      value:
        type === "dob" || type === "gender" || type === "otp"
          ? value
          : value.target.value,
    });
    if (type === "contact" && value.target.value !== userData.user.contact) {
      setContactVerifyState({ ...contactVerifyState, verified: false });
    } else if (
      type === "contact" &&
      value.target.value === userData.user.contact
    ) {
      setContactVerifyState({ ...contactVerifyState, verified: true });
    }
  };
  const toast = useToast();

  const updateUserInfo = (e) => {
    e.preventDefault();
    let updatedData = { ...data, id: user.user._id };

    if (updatedData.email?.endsWith("coco.in")) setEmailRequired(true);
    else {
      setEmailRequired(false);
      dispatch(updateUserAction(updatedData));
    }
  };

  const sendOtpRequest = () => {
    let keyName = /^\d+$/.test(data.contact) ? "contact" : "email";
    dispatch(
      sendOtpRequestAction({ [keyName]: data.contact, addUserContact: true })
    );
  };
  const phoneNumberVerify = (e) => {
    user.otpResponse &&
      dispatch(
        verifyOtpRequestAction({ token: user.otpResponse.token, otp: data.otp })
      );
  };

  useCheckStatus({
    status: updateUserStatus,
    onSuccess: () => {
      toast({
        title: "Profile updated.",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    },
  });

  useCheckStatus({
    status: user.otpStatus,
    onSuccess: () => {
      setShowOtpInput(true);
    },
  });

  useCheckStatus({
    status: verifyOtpStatus,
    onSuccess: () => {
      setShowOtpInput(false);
      setContactVerifyState({ ...contactVerifyState, verified: true });
      setShowMoreInputs(true);
    },
    onError: () => {
      toast({
        status: "error",
        title: "Coupon not valid",
        position: "top",
      });
    },
  });

  const { logout } = useAppContext();

  const _logout = () => {
    logout();
  };

  return (
    <form onSubmit={updateUserInfo}>
      <VStack pb={5}>
        <FormControl id="contact" isRequired>
          <FormLabel>Contact</FormLabel>
          <InputGroup>
            <InputLeftElement
              pointerEvents="none"
              children={<PhoneIcon color="gray.300" />}
            />
            <Input
              isFullWidth
              defaultValue={user.user?.contact ? user.user?.contact : ""}
              value={data.contact}
              onChange={(e) => _changeInInput("contact", e)}
            />
            <InputRightElement width="4.5rem">
              {contactVerifyState.verified ? (
                <CheckIcon color="green.500" />
              ) : showOtpInput ? null : (
                <Button
                  isLoading={userData.otpStatus === STATUS.FETCHING}
                  variant="outline"
                  h="1.75rem"
                  size="sm"
                  px="1.5rem"
                  onClick={sendOtpRequest}
                  colorScheme="gray"
                >
                  {" "}
                  Verify{" "}
                </Button>
              )}
            </InputRightElement>
          </InputGroup>
        </FormControl>
        {showOtpInput ? (
          <FormControl id="otp" isRequired>
            <FormLabel style={{ paddingTop: "10px" }}>Enter OTP</FormLabel>
            <HStack>
              <PinInput
                otp
                placeholder="_"
                onComplete={(e) => _changeInInput("otp", e)}
              >
                <PinInputField />
                <PinInputField />
                <PinInputField />
                <PinInputField />
              </PinInput>
              <Button
                isLoading={verifyOtpStatus === STATUS.FETCHING}
                onClick={phoneNumberVerify}
              >
                {"Verify"}
              </Button>
            </HStack>
          </FormControl>
        ) : null}

        {showMoreInputs ? (
          <>
            <FormControl id="name" isRequired>
              <FormLabel>Name</FormLabel>
              <InputGroup>
                <InputLeftElement
                  pointerEvents="none"
                  children={<AtSignIcon color="gray.300" />}
                />
                <Input
                  placeholder="Enter Your Name"
                  isFullWidth
                  defaultValue={user.user.name ? user.user.name : ""}
                  value={data.name}
                  onChange={(e) => _changeInInput("name", e)}
                />
              </InputGroup>
            </FormControl>
            {/* <FormControl id="fatherName" isRequired>
                    <FormLabel>Father's Name</FormLabel>
                    <InputGroup>
                        <InputLeftElement
                            pointerEvents="none"
                            children={<AtSignIcon color="gray.300" />}
                        />
                        <Input placeholder="Enter Your Father's Name" isFullWidth defaultValue={user.user.fatherName ? user.user.fatherName : ''} value={data.fatherName} onChange={(e) => _changeInInput('fatherName', e)} />
                    </InputGroup>
                </FormControl> */}
            <FormControl id="email" isRequired>
              <FormLabel>Email</FormLabel>
              <InputGroup>
                <InputLeftElement
                  pointerEvents="none"
                  children={<EmailIcon color="gray.300" />}
                />
                <Input
                  placeholder="Enter Your Email Address"
                  type="email"
                  isFullWidth
                  defaultValue={user.user.email ? user.user.email : ""}
                  value={data.email}
                  onChange={(e) => _changeInInput("email", e)}
                />
              </InputGroup>
              {emailRequired ? (
                <Text fontSize={12} color={"#E74C3C"}>
                  Please enter valid email address
                </Text>
              ) : null}
            </FormControl>
            <FormControl id="referral">
              <FormLabel>Referral Code (optional)</FormLabel>
              <InputGroup>
                {/* <InputLeftElement
                            pointerEvents="none"
                            children={<VscReferences color="gray.300" />}
                        /> */}
                <Input
                  placeholder="Enter Referral Code"
                  isFullWidth
                  value={data.referralCode}
                  onChange={(e) => _changeInInput("referralCode", e)}
                />
              </InputGroup>
            </FormControl>
            {/* <FormControl id="state" isRequired>
                    <FormLabel>State</FormLabel>
                    <InputGroup>
                        <Select placeholder="Select Your State" isFullWidth defaultValue={user.user.state ? user.user.state : ''} value={data.state} onChange={(e) => _changeInInput('state', e)} >
                            {
                                STATE_LIST.map((state)=><option value={state.id}>{state.name}</option>)
                            }
                        </Select>
                    </InputGroup>
                </FormControl> */}
            <br />
            <Button
              type="submit"
              isLoading={updateUserStatus === STATUS.FETCHING}
              disabled={!contactVerifyState.verified}
            >
              Submit
            </Button>
          </>
        ) : (
          <Center>
            <Button
              mt={10}
              size={"sm"}
              variant="link"
              colorScheme="red"
              onClick={_logout}
            >
              I don't want to complete my profile
            </Button>
          </Center>
        )}
      </VStack>
    </form>
  );
};
