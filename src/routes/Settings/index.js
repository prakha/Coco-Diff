import React, { useState, useEffect } from "react";
import {
  Box,
  Text,
  Button,
  IconButton,
  Flex,
  HStack,
  CheckboxGroup,
  PinInput,
  PinInputField,
  Icon,
  RadioGroup,
  Radio,
  Select,
  Avatar,
  FormLabel,
  Checkbox,
  FormControl,
  Spacer,
  Switch,
  Input,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  Divider,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useToast,
  NumberInput,
  NumberInputField,
} from "@chakra-ui/react";
import { CheckCircleIcon, WarningIcon } from "@chakra-ui/icons";
import { SectionHeader } from "../../Components/SectionHeader";
import { useHistory, useParams } from "react-router";
import { ErrorChecker } from "../../Components/ErrorChecker";
import { useDispatch, useSelector } from "react-redux";
import { apis } from "../../services/api/apis";
import moment from "moment";
import { FormReducer } from "../../utils/FormReducer";
import { STATUS } from "../../App/Constants";
import {
  resetUserPasswordAction,
  sendOtpRequestAction,
  verifyOtpRequestAction,
  resetPasswordChangeStatus,
  resetotpStatus,
} from "../../redux/reducers/settings";
import { getDefaultDataAction } from "../../redux/reducers/lmsConfig";
import {
  requestUserAddressAction,
  userAddressUpdateAction,
  updateUserAddressAction,
} from "../../redux/reducers/address";
import {
  requestUserProfileAction,
  updateUserProfileAction,
  updateAvatarAction,
} from "../../redux/reducers/user";
import { FaEdit, FaLock, FaAddressCard, FaTrash } from "react-icons/fa";
import { BsPersonLinesFill, BsTrash } from "react-icons/bs";
import { CgProfile } from "react-icons/cg";
import { TiContacts } from "react-icons/ti";
import { MdLanguage } from "react-icons/md";
import { ButtonX } from "../../Components/ButtonX";

export const Settings = (props) => {
  const lmsConfigData = useSelector((s) => s.lmsConfig.defaultData);
  const dispatch = useDispatch();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [title, setTitle] = useState("");
  
  let defaultBread = [
    { title: "Home", link: "/" },
    { title: "Settings", link: "#" },
  ];
  
  let [breadcrumbs, changeBreadcrumbs] = useState(defaultBread);

  return (
    <Box>
      <ErrorChecker>
        <Box>
          <SectionHeader title="Settings" breadcrumbs={breadcrumbs} />
          <Box marginLeft="33%">
            <Flex
              mb={6}
              p={2}
              borderBottom="2px solid #d4d4d4"
              borderRadius="5px"
              backgroundColor="white"
              width="50%"
            >
              <Flex alignItems="center">
                <BsPersonLinesFill />
                <Text ml={2}>Profile</Text>
              </Flex>
              <Spacer />
              
              <SettingIconButton
                 onClick={() => {
                  setTitle("Profile");
                  onOpen();
                }}
              />
            </Flex>

            <Flex
              mb={6}
              borderBottom="2px solid #d4d4d4"
              p={2}
              borderRadius="5px"
              backgroundColor="white"
              width="50%"
            >
              <Flex alignItems="center">
                <CgProfile />
                <Text ml={2}>Profile Picture</Text>
              </Flex>
              <Spacer />
              <SettingIconButton
                 onClick={() => {
                  setTitle("Profile Picture");
                  onOpen();
                }}
              />
            </Flex>

            <Flex
              mb={6}
              borderBottom="2px solid #d4d4d4"
              p={2}
              borderRadius="5px"
              backgroundColor="white"
              width="50%"
            >
              <Flex alignItems="center">
                <TiContacts /> <Text ml={2}>Contact Number</Text>
              </Flex>
              <Spacer />
              <SettingIconButton
                 onClick={() => {
                  setTitle("Contact Info");
                  onOpen();
                }}
              />
            </Flex>

            <Flex
              mb={6}
              borderBottom="2px solid #d4d4d4"
              p={2}
              borderRadius="5px"
              backgroundColor="white"
              width="50%"
            >
              <Flex alignItems="center">
                <FaLock /> <Text ml={2}>Password</Text>
              </Flex>
              <Spacer />
              
              <SettingIconButton
                 onClick={() => {
                  setTitle("Change Password");
                  onOpen();
                }}
              />
            </Flex>
            <Flex
              mb={6}
              borderBottom="2px solid #d4d4d4"
              p={2}
              borderRadius="5px"
              backgroundColor="white"
              width="50%"
            >
              <Flex alignItems="center">
                <FaAddressCard /> <Text ml={2}>Address Management</Text>
              </Flex>
              <Spacer />
              
              <SettingIconButton
                onClick={() => {
                  setTitle("Address Management");
                  onOpen();
                }}
              />
            </Flex>
            <Flex
              mb={6}
              borderBottom="2px solid #d4d4d4"
              p={2}
              borderRadius="5px"
              backgroundColor="white"
              width="50%"
            >
              <Flex alignItems="center">
                <MdLanguage />{" "}
                <Text ml={2}>Language &amp; Exam Preference</Text>
              </Flex>
              <Spacer />
              <SettingIconButton
                onClick={() => {
                  setTitle("Exam Preference");
                  onOpen();
                  dispatch(getDefaultDataAction());
                }}
              />
            </Flex>
            {/* <Flex mb={6} borderBottom='2px solid #d4d4d4' p={2} borderRadius='5px' backgroundColor='white' width = '50%'>
                            <Text>Night Mode</Text>
                            <Spacer />
                            <Switch size="md" />
                        </Flex> */}
          </Box>
          <SettingsDrawer
            onOpen={onOpen}
            onClose={onClose}
            isOpen={isOpen}
            title={title}
            lmsData={lmsConfigData}
          />
        </Box>
      </ErrorChecker>
    </Box>
  );
};

const SettingIconButton = (props) => {
  return (
    <ButtonX 
    size="sm"
    {...props}
    ><FaEdit /></ButtonX>
  )
}

function SettingsDrawer({ onClose, isOpen, title, lmsData }) {
  const { user } = useSelector((s) => ({
    user: s.user,
  }));
  //console.log({user: user.user})
  const addressData = useSelector((state) => state.address.userAddress);
 
  const {
    otpResponseToken,
    verifyOtpStatus,
    errorMessage,
    otpStatus,
    updateUserStatus,
    updateAddressStatus,
    addressUpdateStatus,
    passwordChangeStatus,
    updateAvatarStatus,
  } = useSelector((s) => ({
    otpResponseToken: s.settings.otpResponse,
    otpStatus: s.settings.otpStatus,
    updateUserStatus: s.user.updateUserStatus,
    updateAddressStatus: s.address.updateAddressStatus,
    passwordChangeStatus: s.settings.passwordChangeStatus,
    updateAvatarStatus: s.user.updateAvatarStatus,
    addressUpdateStatus: s.address.addressUpdateStatus,
    verifyOtpStatus: s.settings.verifyOtpStatus,
    errorMessage: s.user.errorMessage,
  }));
  const toast = useToast();

  const {
    isOpen: isOpenForEdit,
    onOpen: onOpenForEdit,
    onClose: onCloseForEdit,
  } = useDisclosure();
  
  const {
    isOpen: isOpenForProfPicModal,
    onOpen: onOpenForProfPicModal,
    onClose: onCloseForProfPicModal,
  } = useDisclosure();
  
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [fileUploadState, setFileUploadState] = useState("");
  const [stateCityData, setStateCityData] = useState(null);
  const [profpicSRC, setprofpicSRC] = useState("");
  const [profpic, setProfpic] = useState();
  const [proficpicStatus, setproficpicStatus] = useState(false);
  const [inputCorrect, changeInputStatus] = useState(true);
  const [disableSave, setDisableSave] = useState(true);
  const [contact, setContact] = useState("");
  const [selectedAddress, setSelectedAddress] = useState();
  const [editAddress, seteditAddress] = useState(true);
  const dispatch = useDispatch();
  let dob = user?.user?.dob?.slice(0, user.user.dob.indexOf("T")).split("-");

  useEffect(() => {
    fetchStateCityData();
    // dispatch(requestUserProfileAction());
    dispatch(requestUserAddressAction({ userId: user?.user?._id }));
  }, []);
  
  useEffect(() => {
    if (passwordChangeStatus === STATUS.FAILED) {
      toast({
        title: "Failed",
        description: "Password Change Fail",
        status: "error",
        duration: 1500,
        isClosable: true,
      });
    }
    if (passwordChangeStatus === STATUS.SUCCESS) {
      onClose();
      setNewPassword("");
      setConfirmPassword("");
      toast({
        title: "Success",
        description: "Password Changed Sucessfully",
        status: "success",
        duration: 1500,
        isClosable: true,
      });
      resetPasswordChangeStatus();
    }
  }, [passwordChangeStatus]);

  useEffect(() => {
    if (errorMessage && updateUserStatus === STATUS.FAILED) {
      toast({
        title: "Failed",
        description: errorMessage,
        status: "error",
        duration: 1500,
        isClosable: true,
      });
    } else if (updateUserStatus === STATUS.FAILED) {
      toast({
        title: "Failed",
        description: "User Details Updation Failed",
        status: "error",
        duration: 1500,
        isClosable: true,
      });
    }
    if (updateUserStatus === STATUS.SUCCESS) {
      onClose();
      toast({
        title: "Success",
        description: "User Details Updated Sucessfully",
        status: "success",
        duration: 1500,
        isClosable: true,
      });
    }
  }, [updateUserStatus]);

  useEffect(() => {
    if (verifyOtpStatus === STATUS.SUCCESS) {
      dispatch(updateUserProfileAction({ contact: contact }));
    }
    if (verifyOtpStatus === STATUS.FAILED) {
      //console.log('contact to update nhi ho rha h bro')
    }
  }, [verifyOtpStatus]);

  useEffect(() => {
    if (updateAvatarStatus === STATUS.FAILED) {
      toast({
        title: "Failed",
        description: "Profile Picture Updation Fail",
        status: "error",
        duration: 1500,
        isClosable: true,
      });
    }
    if (updateAvatarStatus === STATUS.SUCCESS) {
      onClose();
      toast({
        title: "Success",
        description: "Profile Picture Updated Successfully",
        status: "success",
        duration: 1500,
        isClosable: true,
      });
    }
  }, [updateAvatarStatus]);
  //console.log({addressUpdateStatus})

  const handleSubmit = (e) => {
    let tryst = "";
    let dataObj = {};
    let examPref = [];
    let langPref = "";
    e.preventDefault();
    if (e.nativeEvent.submitter.name === "profileUpdation") {
      var formData = new FormData(e.target);
      //console.log('events', e.nativeEvent.submitter.name)
      for (var pair of formData.entries()) {
        //console.log(pair)
        if (pair[0] === "date" || pair[0] === "year" || pair[0] === "month") {
          tryst += pair[1] + "-";
        } else {
          dataObj[pair[0]] = pair[1];
        }
      }

      tryst = tryst.substring(0, tryst.length - 1);
      let splitString = tryst.split("-");
      let reverseArray = splitString.reverse();
      tryst = reverseArray.join("-");

      dataObj["dob"] = tryst;

      if (moment(tryst, "YYYY-MM-DD").isValid()) {
        dispatch(updateUserProfileAction(dataObj));
      } else {
        toast({
          title: "Enter a Valid Date",
          description: "Date Of Birth is not valid",
          status: "warning",
          duration: 1500,
          isClosable: true,
        });
      }
    }
    if (e.nativeEvent.submitter.name === "passwordUpdation") {
      if (newPassword !== confirmPassword) {
      } else {
        dispatch(resetUserPasswordAction({ newPassword: newPassword }));
      }
    }
    if (e.nativeEvent.submitter.name === "profilePicture") {
      var formData = new FormData();
      formData.append("avatar", profpic);
      dispatch(updateAvatarAction(formData));
      setproficpicStatus(false);
    }
    if (e.nativeEvent.submitter.name === "enterOTP") {
      dispatch(
        verifyOtpRequestAction({
          updateContact: true,
          token: otpResponseToken,
          otp: otp,
        })
      );
    }
    if (e.nativeEvent.submitter.name === "exampref") {
      var formData = new FormData(e.target);
      for (var pair of formData.entries()) {
        if (pair[0] !== "languagePreference") {
          examPref.push(pair[1]);
        } else {
          langPref = pair[1];
        }
      }

      dispatch(
        updateUserProfileAction({
          examPreference: examPref,
          languagePreference: langPref,
        })
      );
    }
  };

  const fetchStateCityData = async () => {
    //console.log("8888 API Call Started");
    const response = await apis.fetchStateCityDataApi();
    const { ok, data, status } = response;
    if (ok && data) {
      setStateCityData(data);
    } else {
    }
  };

  const fileUploadButton = () => {
    document.getElementById("fileButton").click();
    document.getElementById("fileButton").onchange = () => {
      setFileUploadState(document.getElementById("fileButton").value);
    };
  };
  const handlePictureSelected = (event) => {
    setProfpic(event.target.files[0]);
    setprofpicSRC(URL.createObjectURL(event.target.files[0]));
    setproficpicStatus(true);
  };

  const handleDelete = () => {
    if (profpicSRC) {
      setprofpicSRC("");
      setproficpicStatus(false);
    }
  };

  const contactInfo = (type) => {
    if (type === "contact") {
      dispatch(sendOtpRequestAction({ contact: contact }));
    }
  };

  const [otp, setOtp] = useState();

  const _changeOTP = (value) => {
    setOtp(value);
  };

  const handleEditAddress = (addressEdit) => {
    setSelectedAddress(addressEdit);
    onOpenForEdit();
  };
  const validateNumber = (value) => {
    const pattern = /[2-9]\d{9}/;
    setContact(value);
    if (value.length !== 10 || value.match(pattern) === null) {
      changeInputStatus(false);
      setDisableSave(true);
    } else {
      setDisableSave(false);
      changeInputStatus(true);
    }
  };
  return (
    <>
      <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="lg">
        <DrawerOverlay />
        <DrawerContent overflow="scroll">
          <DrawerCloseButton />
          <DrawerHeader>{title}</DrawerHeader>
          <form
            onSubmit={(e) => {
              handleSubmit(e);
            }}
          >
            {title === "Change Password" ? (
              <>
                <ErrorChecker status={passwordChangeStatus}>
                  <DrawerBody>
                    <FormControl mb={2} isRequired>
                      <FormLabel>Enter Your New Password</FormLabel>
                      <Input
                        width="70%"
                        type={showPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        mb={4}
                        placeholder="New Password"
                      />
                    </FormControl>
                    <FormControl mb={2} isRequired>
                      <FormLabel>Confirm Your New Password</FormLabel>
                      <Input
                        width="70%"
                        type={showPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        mb={4}
                        isInvalid={
                          newPassword === confirmPassword ? false : true
                        }
                        placeholder="Confirm New Password"
                      />
                      {confirmPassword !== "" ? (
                        newPassword === confirmPassword ? (
                          <Icon
                            ml={2}
                            w={6}
                            h={6}
                            as={CheckCircleIcon}
                            color="brand.green"
                          />
                        ) : (
                          <Icon
                            ml={2}
                            w={6}
                            h={6}
                            as={WarningIcon}
                            color="brand.red"
                          />
                        )
                      ) : null}
                    </FormControl>
                    <Checkbox
                      onChange={() => {
                        showPassword
                          ? setShowPassword(false)
                          : setShowPassword(true);
                      }}
                    >
                      Show Password
                    </Checkbox>
                  </DrawerBody>
                  <DrawerFooter>
                    <ButtonX variant="outline" mr={3} onClick={onClose}>
                      Cancel
                    </ButtonX>
                    <ButtonX
                      isLoading={passwordChangeStatus === STATUS.FETCHING}
                      name="passwordUpdation"
                      type="submit"
                    >
                      Save
                    </ButtonX>
                  </DrawerFooter>
                </ErrorChecker>
              </>
            ) : null}
            {title === "Contact Info" ? (
              <>
                <DrawerBody>
                  <FormControl isRequired>
                    <FormLabel>Enter the New Number</FormLabel>
                    <NumberInput
                      width="70%"
                      name="contact"
                      onChange={(value) => validateNumber(value)}
                      defaultValue={user?.user?.contact}
                    >
                      <NumberInputField placeholder="Contact Number" />
                    </NumberInput>
                    {inputCorrect ? null : (
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
                    <ErrorChecker status={otpStatus}>
                      {otpStatus === STATUS.SUCCESS ? (
                        <>
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
                            <ButtonX
                              //disabled={!loginData.otp}
                              disabled={otpStatus === false}
                              type="submit"
                              value="submit"
                              name="enterOTP"
                              //isLoading={loading || user.status === STATUS.FETCHING}
                            >
                              Submit
                            </ButtonX>
                          </HStack>
                        </>
                      ) : (
                        <>
                          <br />
                          <ButtonX
                            onClick={() => contactInfo("contact")}
                            isDisabled={disableSave}
                          >
                            Send OTP &nbsp;&nbsp;
                            {/* {user.otpStatus === STATUS.FETCHING ? (
                                                        <Spinner size="sm" />
                                                    ) : null} */}
                          </ButtonX>
                        </>
                      )}
                    </ErrorChecker>
                  </FormControl>
                </DrawerBody>
              </>
            ) : null}
            {title === "Profile" ? (
              <>
                <DrawerBody>
                  <FormControl mb={2} isRequired>
                    <FormLabel>Name</FormLabel>
                    <Input
                      size="sm"
                      name="name"
                      width="70%"
                      defaultValue={user.user.name}
                      mb={2}
                      placeholder="Name"
                    />
                  </FormControl>
                  <FormControl isRequired mb={2}>
                    <FormLabel>Email</FormLabel>
                    <Input
                      size="sm"
                      name="email"
                      type="email"
                      width="70%"
                      mb={2}
                      defaultValue={user.user.email}
                      placeholder="Email"
                    />
                  </FormControl>
                  <FormControl isRequired mb={2}>
                    <FormLabel>Preferred State</FormLabel>
                    <Select
                      size="sm"
                      width="70%"
                      defaultValue={user?.user?.preferredState}
                      placeholder="Select Your State"
                      bg="white"
                      name="preferredState"
                    >
                      {stateCityData?.map((state, i) => (
                        <option key={i} value={state.name}>
                          {state.name}
                        </option>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl isRequired mb={2}>
                    <FormLabel>Preferred City</FormLabel>
                    <Input
                      size="sm"
                      name="preferredCity"
                      defaultValue={user?.user?.preferredCity}
                      width="70%"
                      mb={2}
                      placeholder="City"
                    />
                  </FormControl>
                  <FormControl isRequired mb={2}>
                    <FormLabel>DOB</FormLabel>
                    <Flex direction="row">
                      <NumberInput
                        clampValueOnBlur={false}
                        min={1}
                        max={31}
                        size="sm"
                        defaultValue={dob?.[2]}
                        width="20%"
                        mb={2}
                        mr={2}
                      >
                        <NumberInputField name="date" placeholder="Date" />
                      </NumberInput>
                      <NumberInput
                        clampValueOnBlur={false}
                        min={1}
                        max={12}
                        size="sm"
                        width="20%"
                        defaultValue={dob?.[1]}
                        mb={2}
                        mr={2}
                      >
                        <NumberInputField name="month" placeholder="Month" />
                      </NumberInput>
                      <NumberInput
                        clampValueOnBlur={false}
                        min={1900}
                        max={9999}
                        size="sm"
                        width="25%"
                        defaultValue={dob?.[0]}
                        mb={2}
                      >
                        <NumberInputField name="year" placeholder="Year" />
                      </NumberInput>
                    </Flex>
                  </FormControl>
                  <FormControl isRequired mb={2}>
                    <FormLabel>Gender</FormLabel>
                    <RadioGroup defaultValue={user?.user?.gender} name="gender">
                      <Radio size="sm" mr={4} value="male">
                        Male
                      </Radio>
                      <Radio size="sm" value="female">
                        Female
                      </Radio>
                    </RadioGroup>
                  </FormControl>
                </DrawerBody>
                <DrawerFooter>
                  <ButtonX variant="outline" mr={3} onClick={onClose}>
                    Cancel
                  </ButtonX>
                  <ButtonX
                    name="profileUpdation"
                    type="submit"
                  >
                    Save
                  </ButtonX>
                </DrawerFooter>
              </>
            ) : null}
            {title === "Profile Picture" ? (
              <>
                <DrawerBody>
                  <Flex alignItems="center" direction="column">
                    <Avatar
                      cursor="pointer"
                      onClick={() => onOpenForProfPicModal()}
                      border="2px solid #d4d4d4"
                      mb={2}
                      size="xl"
                      name={user?.user?.name}
                      src={profpicSRC ? profpicSRC : user?.user?.avatar}
                    />
                    <Flex direction="row">
                      {proficpicStatus ? (
                        <>
                          <Button
                            type="submit"
                            colorScheme="blue"
                            name="profilePicture"
                          >
                            Update
                          </Button>
                          <Button
                            ml={4}
                            onClick={handleDelete}
                            colorScheme="red"
                          >
                            Remove
                          </Button>
                        </>
                      ) : (
                        <>
                          <Input
                            onChange={handlePictureSelected}
                            id="fileButton"
                            type="file"
                            hidden
                          />
                          <ButtonX
                            mr={4}
                            onClick={fileUploadButton}
                          >
                            Upload New
                          </ButtonX>
                        </>
                      )}
                    </Flex>
                  </Flex>
                </DrawerBody>
                <ProfPicModal
                  isOpen={isOpenForProfPicModal}
                  onClose={onCloseForProfPicModal}
                  avatar={user?.user?.avatar}
                />
              </>
            ) : null}
            {title === "Exam Preference" ? (
              <>
                <DrawerBody>
                  <FormControl mb={2} isRequired>
                    <FormLabel>Preferred Language</FormLabel>
                    <RadioGroup
                      name="languagePreference"
                      mb={4}
                      defaultValue={user?.user?.languagePreference}
                    >
                      <Radio mr={4} value="english">
                        English
                      </Radio>
                      <Radio value="hindi">Hindi</Radio>
                    </RadioGroup>
                  </FormControl>
                  <FormControl isRequired mb={2}>
                    <FormLabel>Preferred Exam</FormLabel>
                    <CheckboxGroup
                      defaultValue={user?.user?.examPreference}
                      name="examPreference"
                    >
                      {lmsData?.exams?.map((el, i) => {
                        return (
                          <>
                            <Checkbox
                              name={el.name.en}
                              value={el._id}
                              key={i}
                              mb={1}
                            >
                              {el.name.en}
                            </Checkbox>{" "}
                            <br />{" "}
                          </>
                        );
                      })}
                    </CheckboxGroup>
                  </FormControl>
                </DrawerBody>
                <DrawerFooter>
                  <ButtonX variant="outline" mr={3} onClick={onClose}>
                    Cancel
                  </ButtonX>
                  <ButtonX name="exampref" type="submit" colorScheme="blue">
                    Save
                  </ButtonX>
                </DrawerFooter>
              </>
            ) : null}
            {title === "Address Management" ? (
              <>
                <DrawerBody>
                  {addressData?.map((el, i) => (
                    <Flex
                      mb={6}
                      key={i}
                      p={2}
                      borderTop="1px solid #d4d4d4"
                      borderRight="1px solid #d4d4d4"
                      borderLeft="1px solid #d4d4d4"
                      borderBottom="1px solid #d4d4d4"
                      borderRadius="5px"
                      backgroundColor="white"
                      direction="row"
                    >
                      <Box>
                        <b>
                          <Text>{el.name?.concat(",")}</Text>
                        </b>
                        <Text>
                          {el.address ? el.address?.concat(",") : null}
                        </Text>
                        <Text>
                          {el.landmark ? el.landmark?.concat(",") : null}
                        </Text>
                        <Text>{el.city ? el.city?.concat(",") : null}</Text>
                        <Text>{el.state ? el.state?.concat(",") : null}</Text>
                        <Text>{el.pincode}</Text>
                      </Box>
                      <Spacer />
                      <Box>
                        <IconButton
                          mr={2}
                          icon={<FaEdit />}
                          size="sm"
                          onClick={() => {
                            seteditAddress(true);
                            handleEditAddress(el);
                          }}
                        />
                        {/* <IconButton
                          backgroundColor="gray.200"
                          icon={<FaTrash color="#DB4437" />}
                        /> */}
                      </Box>
                    </Flex>
                  ))}
                </DrawerBody>
                <DrawerFooter>
                  <ButtonX
                    onClick={() => {
                      setSelectedAddress(undefined);
                      seteditAddress(false);
                      onOpenForEdit();
                    }}
                  >
                    New Address
                  </ButtonX>
                  <Spacer />
                  <ButtonX
                    variant="outline"
                    mr={3}
                    onClick={onClose}
                  >
                    Close
                  </ButtonX>
                </DrawerFooter>
              </>
            ) : null}
          </form>
        </DrawerContent>
        <AddressEditModal
          userID={user.user._id}
          stateCityData={stateCityData}
          selectedAddress={selectedAddress}
          isOpen={isOpenForEdit}
          onOpen={onOpenForEdit}
          onClose={onCloseForEdit}
          editAddress={editAddress}
        />
      </Drawer>
    </>
  );
}

function ProfPicModal({ isOpen, onClose, avatar }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Profile Picture</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <img src={avatar} />
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" type="submit" mr={3}>
            Save
          </Button>
          <Button colorScheme="blue" variant="outline" mr={3} onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

function AddressEditModal({
  userID,
  stateCityData,
  selectedAddress,
  isOpen,
  onClose,
  editAddress,
}) {
  const dispatch = useDispatch();
  const [disableSave, setDisableSave] = useState();
  const [pincode, setpincode] = useState(selectedAddress?.pincode);
  const checkInput = (value) => {
    if (value?.length !== 6) {
      setDisableSave(true);
    } else {
      setDisableSave(false);
    }
  };
  useEffect(() => {
    selectedAddress ? setDisableSave(false) : setDisableSave(true);
  }, [selectedAddress]);
  const handleAddressUpdate = (e) => {
    e.preventDefault();
    var formData = new FormData(e.target);
    let dataJSON = {};
    if (editAddress) {
      for (var pair of formData.entries()) {
        //console.log(pair);
        dataJSON[`${pair[0]}`] = pair[1];
      }
      dataJSON["addressId"] = selectedAddress._id;
      dataJSON["userId"] = userID;
      //console.log(dataJSON)
      dispatch(userAddressUpdateAction(dataJSON));
      onClose();
    } else {
      for (var pair of formData.entries()) {
        dataJSON[`${pair[0]}`] = pair[1];
      }
      dataJSON["userId"] = userID;
      if ("type" in dataJSON) {
        dataJSON["type"] = "permanent";
      } else {
        dataJSON["type"] = "temp";
      }
      //console.log(dataJSON)
      dispatch(updateUserAddressAction(dataJSON));
      onClose();
    }
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {editAddress ? "Edit Address" : "Add Address"}
        </ModalHeader>
        <ModalCloseButton />
        <form onSubmit={(e) => handleAddressUpdate(e)}>
          {editAddress === true ? (
            <ModalBody>
              <FormControl isRequired>
                <FormLabel>Address</FormLabel>
                <Input name="address" defaultValue={selectedAddress?.address} />
              </FormControl>
              <FormControl>
                <FormLabel>Landmark</FormLabel>
                <Input
                  name="landmark"
                  width="70%"
                  defaultValue={selectedAddress?.landmark}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>City</FormLabel>
                <Input
                  name="city"
                  width="70%"
                  defaultValue={selectedAddress?.city}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Pincode</FormLabel>
                <NumberInput
                  name="pincode"
                  width="70%"
                  onChange={(value) => checkInput(value)}
                  defaultValue={selectedAddress?.pincode}
                >
                  <NumberInputField />
                </NumberInput>
              </FormControl>
              <FormControl>
                <FormLabel isRequired>State</FormLabel>
                <Select
                  width="70%"
                  defaultValue={selectedAddress?.state?.toUpperCase()}
                  placeholder="Select Your State"
                  bg="white"
                  name="state"
                >
                  {stateCityData?.map((state, i) => (
                    <option key={i} value={state.name}>
                      {state.name}
                    </option>
                  ))}
                </Select>
              </FormControl>
            </ModalBody>
          ) : (
            <ModalBody>
              <FormControl>
                <FormLabel>Address Name</FormLabel>
                <Input name="name" />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Address</FormLabel>
                <Input name="address" />
              </FormControl>
              <FormControl>
                <FormLabel>Landmark</FormLabel>
                <Input name="landmark" width="70%" />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>State</FormLabel>
                <Select
                  width="70%"
                  placeholder="Select Your State"
                  bg="white"
                  name="state"
                >
                  {stateCityData?.map((state, i) => (
                    <option key={i} value={state.name}>
                      {state.name}
                    </option>
                  ))}
                </Select>
              </FormControl>
              <FormControl isRequired>
                <FormLabel>City</FormLabel>
                <Input name="city" width="70%" />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Pincode</FormLabel>
                {/* <Input name='pincode' width='70%' /> */}
                <NumberInput
                  name="pincode"
                  width="70%"
                  onChange={(value) => checkInput(value)}
                >
                  <NumberInputField />
                </NumberInput>
              </FormControl>
              <FormControl display="flex" alignItems="center">
                <FormLabel mb="0">Is this Permanent Address?</FormLabel>
                <Switch name="type" />
              </FormControl>
            </ModalBody>
          )}
          <ModalFooter>
            <ButtonX
              isDisabled={disableSave}
              type="submit"
              mr={3}
            >
              Save
            </ButtonX>
            <ButtonX
              variant="outline"
              mr={3}
              onClick={onClose}
            >
              Close
            </ButtonX>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
