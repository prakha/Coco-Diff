import React, { useReducer, useState, useEffect } from "react";
import { apis } from "../../services/api/apis";
import { useDispatch, useSelector } from 'react-redux'
import { 
    Avatar, 
    Box,
    VStack,
    Text,
    Button,
    Drawer,
    DrawerBody,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    useDisclosure,
    FormControl,
    FormLabel,
    FormErrorMessage,
    FormHelperText,
    Input,
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
    NumberInput,
    NumberInputField,
    HStack,
    Select,
    Spacer
} from "@chakra-ui/react";
import { SectionHeader } from "../../Components/SectionHeader";
import { updateUserProfileAction } from "../../redux/reducers/user";
import { Link } from "react-router-dom";
import { ButtonX } from '../../Components/ButtonX'

export const ProfilePage = () => {
	const dispatch = useDispatch()

    const {user} = useSelector((s)=>({
        user : s.user.user,
    }))
    
    return user && (
        <Box>
            <SectionHeader title="My Profile" breadcrumbs={[{title : "Home", link: "/"}, {title : "My Profile", link: "#"}]} />
            <Box display="flex" justifyContent="center">
            	<Box width="50%" boxShadow="lg" borderRadius="xl" bg="#fff">
                    <VStack p="3rem 7rem" spacing="3rem">
                        <ProfilePictureComponent user={user} />
                        <UserDetailsComponent user={user}/>
                    </VStack>
                </Box>
            </Box>
        </Box>
    )
}

const ProfilePictureComponent = ({user}) => {
    return(
        <Box display="flex" justifyContent="center" alignItems="center" >
            <Avatar name={user.name} src={user.avatar} bg="blue.500" color="white" size="2xl" boxShadow="lg" border="3px solid #EFF3F6" />
        </Box>
    )
}

const UserDetailsComponent = ({user}) => {
    
    const { isOpen, onOpen, onClose } = useDisclosure()
    const btnRef = React.useRef()
  

    const DetailItem = ({title, value}) => (
        <Box display="flex" justifyContent="space-between" m="0.5rem 0">
            <Box width="auto" mr={4}>
                <Text color="text.300" fontSize="sm" >{title}:</Text>
            </Box>
            <Box width="auto">
                <Text color="#3C4043B9" fontSize="sm">{value}</Text>
            </Box>
        </Box>
    )
    return(
        <Box display="flex" justifyContent="center" alignItems="center" mb="2rem" width="auto">
            <Box width="auto">
                <DetailItem title="Username" value={user.username} />
                <DetailItem title="Full Name" value={user.name} />
                <DetailItem title="Mobile Number" value={user.contact} />
                <DetailItem title="Email ID" value={user.email} />
                <Link to='/dashboard/settings'><ButtonX width="100%" mt="3rem" fontWeight="light" ref={btnRef} >Edit Profile</ButtonX></Link>
            </Box>
            <UpdateProfileDrawer isOpen={isOpen} onClose={onClose} btnRef={btnRef} user={user}/>
            

        </Box>
    )
}


const UpdateProfileDrawer = ({isOpen, onClose, btnRef, user}) => {

    const dispatch = useDispatch();

    const [isOpenAlert, setIsOpenAlert] = React.useState(false)
    const onCloseAlert = () => setIsOpenAlert(false)
    const cancelRef = React.useRef()

    const [detailsChanged, setDetailsChanged] = useState(false)
    


    const handleSubmit = (data) => {
        //console.log('data', data.contact)
        if(data.contact.length !== 10) {
            //put a toast or something here
        }
        else {
            let updatedData = {...data, id: user._id}
            dispatch(updateUserProfileAction(updatedData))
            onClose();
        }
    }

    const handleDrawerClose = () => {
        if(detailsChanged){
            setIsOpenAlert(true);
        }else{
            onClose();
        }
    }
    return (
            <Drawer
                size="sm"
                placement="right"
                isOpen={isOpen}
                onClose={handleDrawerClose}
                finalFocusRef={btnRef}
                onOverlayClick={handleDrawerClose}
            >
                <DrawerOverlay />
                <DrawerContent>
                <DrawerCloseButton />
                <DrawerHeader>Edit Your Profile</DrawerHeader>

                <DrawerBody>
                    <UpdateProfileForm onChange={()=>setDetailsChanged(true)} handleSubmit={handleSubmit} onClose={onClose} user={user} />
                    <AlertDialog
                        isOpen={isOpenAlert}
                        leastDestructiveRef={cancelRef}
                        onClose={onCloseAlert}
                    >
                        <AlertDialogOverlay>
                        <AlertDialogContent>
                            <AlertDialogHeader fontSize="lg" fontWeight="bold">
                                Are you sure you want to leave?
                            </AlertDialogHeader>

                            <AlertDialogBody>
                                Any changes made will be lost.
                            </AlertDialogBody>

                            <AlertDialogFooter>
                            <Button ref={cancelRef} onClick={onCloseAlert}>
                                Stay Here
                            </Button>
                            <Button colorScheme="blue" onClick={onClose} ml={3}>
                                Yes
                            </Button>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                        </AlertDialogOverlay>
                    </AlertDialog>
                </DrawerBody>
                </DrawerContent>
            </Drawer>
    )
}

const UpdateProfileForm = ({handleSubmit, user}) => {


    const [userName, setUserName] = useState(user ? user.name : null);
    const [userEmail, setUserEmail] = useState(user ? user.email : null);
    const [userContact, setUserContact] = useState(user ? user.contact : null);
    const [stateCityData, setStateCityData] = useState(null);
    const [userState, setUserState] = useState(null);
    const [cityData, setCityData] = useState(null);
    const [userAddress, setUserAddress] = useState(null);
    const [userCity, setUserCity] = useState(null);  
    const [inputCorrect, changeInputStatus] = useState(true);
    const [submitIsDisabled, setSubmitIsDisabled] = useState(false) 
    const [disableSave, setDisableSave] = useState(false)
    const fetchStateCityData = async () => {
        //console.log("8888 API Call Started");
        const response = await apis.fetchStateCityDataApi();
        const { ok, data, status } = response;
        if (ok && data) {
          setStateCityData(data);
        } else {
          console.log("API Call Failed : ", data);
        }
    };
    const validateNumber = (value) => {
        //console.log('value', value)
        setUserContact(value)
        if(value.length !== 10) {
            changeInputStatus(false);
            setDisableSave(true);
        }
        else {
            setDisableSave(false);
            changeInputStatus(true);
        }
      };
    useEffect(() => {
    fetchStateCityData();
    }, []);

    // const handleStateValueChange = (e) => {
    //     let cities = stateCityData.find((s) => s.name === e.target.value).cities;
    //     document.getElementById("citySelector").selectedIndex = 0;
    //     setUserState(e.target.value);
    //     setCityData(cities);
    //   };
    

    const getFormData = () => ({
        name : userName,
        email : userEmail,
        contact : userContact,
        city: userCity,
        state: userState,
        address: userAddress
    })
    return user && (
        <Box>
            <form onSubmit={(e)=>{e.preventDefault();handleSubmit(getFormData());}}>
                <Box>
                    <Text mb="1rem" bg="#EFF3F6A8" py="0.3rem" pl="0.5rem"  borderLeft="3px solid" borderLeftColor="primaryBlue.400" >Personal Details</Text>
                    <Box p="0.5rem">
                        <FormControl py="0.3rem" id="name">
                            <FormLabel fontSize="sm" >Full Name</FormLabel>
                            <Input size="sm" type="text" onChange={(e)=>setUserName(e.target.value)} defaultValue={user.name} />
                        </FormControl>
                        <FormControl py="0.3rem" id="contact">
                            <FormLabel fontSize="sm" >Phone Number</FormLabel>
                            {/* <Input size="sm" type="tel" onChange={(e)=>setUserContact(e.target.value)} defaultValue={user.contact}/> */}
                            <NumberInput defaultValue={user.contact}  onChange={(value)=>validateNumber(value)} clampValueOnBlur={false} max={9999999999}>
                              <NumberInputField />
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
                        </FormControl>
                        <FormControl py="0.3rem" id="email">
                            <FormLabel fontSize="sm" >Email Address</FormLabel>
                            <Input size="sm" type="email" onChange={(e)=>setUserEmail(e.target.value)} defaultValue={user.email} />
                        </FormControl>
                    </Box>
                </Box>
                <Box>
                    {/*    <Text mb="1rem" bg="#EFF3F6A8" py="0.3rem" pl="0.5rem"  borderLeft="3px solid" borderLeftColor="primaryBlue.400" >Address Details</Text>
                        <Box p="0.5rem">
                        <FormControl id="name">
                            <FormLabel fontSize="xs" >State</FormLabel>
                            <Input size="xs" type="text" onChange={(e)=>setUserName(e.target.value)} />
                        </FormControl>
                        <FormControl id="email">
                            <FormLabel fontSize="xs" >City</FormLabel>
                            <Input size="xs" type="email" onChange={(e)=>setUserEmail(e.target.value)} />
                        </FormControl>
                        <FormControl id="contact">
                            <FormLabel fontSize="xs" >Address</FormLabel>
                            <Input size="xs" type="tel" onChange={(e)=>setUserContact(e.target.value)} />
                        </FormControl>
                    </Box>  */}
                    {/* {stateCityData ? (
                        <Box p='0.5rem'>
                            <HStack width="100%">
                            <FormControl py="0.3rem" variant="filled" id="state">
                                <FormLabel>State</FormLabel>
                                <Select
                                    size = 'sm'
                                    onChange={handleStateValueChange}
                                    defaultValue={null}
                                    placeholder="Select Your State"
                                    bg="white"
                                    name = 'state'
                                >
                                    {stateCityData.map((state, i) => (
                                        <option value={state.name}>{state.name}</option>
                                    ))}
                                </Select>
                            </FormControl>
                            <FormControl py="0.3rem" variant="filled" id="city">
                                <FormLabel>City</FormLabel>
                                <Select
                                    size = 'sm'
                                    name='city'
                                    disabled={!userState}
                                    defaultValue={null}
                                    id="citySelector"
                                    onChange={(e) => setUserCity(e.target.value)}
                                    placeholder="Select Your City"
                                    bg="white"
                                >
                                    {cityData?.map((city, i) => (
                                        <option value={city.name}>{city.name}</option>
                                    ))}
                                </Select>
                            </FormControl>
                        </HStack>
                        <FormControl id="address">
                        <FormLabel >Address</FormLabel>
                        <Input size = 'sm' name='address' type="tel" onChange={(e)=>setUserAddress(e.target.value)} />
                    </FormControl>
                        </Box>
                    ) : null} */}
                </Box>
                <Button mt="25px" isDisabled={disableSave} colorScheme="blue" type="submit" width="100%" >Save</Button>
            </form>
        </Box>
    )
}