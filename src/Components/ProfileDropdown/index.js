import React, { useReducer, useState, useEffect } from "react";
import {
  Box, 
  Text,
  HStack,
  VStack,
  Divider,
  Button,
  useDisclosure,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Avatar,
  Tooltip,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from 'react-redux';
import { FormReducer } from "../../utils/FormReducer";
import { useHistory } from "react-router-dom";
import { FaUserCircle } from 'react-icons/fa';
import { BiChevronDown } from "react-icons/bi";
import { RiDashboardLine, RiLockPasswordLine, RiUser3Line } from "react-icons/ri";
import { ROUTES } from "../../Constants/Routes";
import { useAppContext } from "../../App/Context";

export const ProfileDropdown = (props) => {
  const { isOpen, onOpen, onClose, onToggle	 } = useDisclosure()

    const {user} = useSelector((s)=>({
      user : s.user.user,
    }))

    return user ? (
      <Box position="relative">
        {/* {console.log({user})} */}
        <HStack spacing={2} mx={4} onClick={onToggle} cursor='pointer'>
          <Avatar bg="brand.redAccent" src={user.avatar} size='xs'/>
      <Tooltip label={user.name}>
      <Text fontSize='sm' noOfLines={1} fontWeight='bold'>{user.name}</Text>

      </Tooltip>
          <BiChevronDown fontSize='1.57vw' />
        </HStack>
        {/* <Button 
          variant="ghost" 
          colorScheme="white"
          leftIcon={<FaUserCircle style={{fontSize:"18px"}} />} 
          rightIcon={<BiChevronDown style={{fontSize:"18px"}} />} 
          fontWeight="normal"
          onClick={onToggle} 
          _focus={{boxShadow : "none"}}
          fontSize='15px' 
        >
          {user.name}
        </Button> */}
        {isOpen ? <Dropdown isOpen={isOpen} user={user} close={onClose}/> : null}
      </Box>
   
    ) : null;
};

export const Dropdown = ({isOpen, close,  user}) => {

  const history = useHistory();

  const dropdownStyleProps = {
    width:"250px",
    // padding : "20px",
    bg:"#fff",
    boxShadow:"lg",
    borderRadius:"lg",
    position:"absolute",
    top:"150%",
    right:"0",
    color : "black",
    zIndex : "999",
    // display : isOpen ? "block" : "none"
    transformOrigin : "top",
    transition : "all 0.25s",
    opacity : `${isOpen?"1":"0"}` 
  }

  const buttonStyleProps = {
    colorScheme:"black",
    variant:"ghost",
    width:"100%",
    justifyContent:"flex-start",
    size:"sm",
    p:"15px 10px",
    borderRadius : "0px",
    _hover : {
      backgroundColor : "#0000000F"
    },
    _focus : {
      boxShadow : "none"
    }
  }

  return(
    <Box {...dropdownStyleProps} >
        <Box p="20px" >
          <Text fontWeight="bold" fontSize="sm">{user.name}</Text>
          <Text fontSize="xs" color="#ACACAC">{user.contact}</Text>
        </Box>
        <Box mb="1rem" display="flex" flexDirection="column" alignItems="flex-start">
          <Button {...buttonStyleProps} onClick={()=>{history.push(ROUTES.DASHBOARD);close()}} leftIcon={< RiDashboardLine />} >Dashboard</Button>
          <Button {...buttonStyleProps} onClick={()=>{history.push(ROUTES.PROFILE);close()}} leftIcon={< RiUser3Line />} >My Profile</Button>
          <Button {...buttonStyleProps} onClick={()=>{history.push(ROUTES.SETTINGS+'?type=password');close()}} leftIcon={< RiLockPasswordLine />} >Change Password</Button>
        </Box>
        <LogoutButton />
    </Box>
  )
}


const LogoutButton = () => {
  const {logout} = useAppContext()

  const [isOpen, setIsOpen] = React.useState(false)
  const onClose = () => setIsOpen(false)
  const cancelRef = React.useRef()

  return(
    <>
      <Button 
        colorScheme="green" 
        onClick={() => setIsOpen(true)} 
        width="100%"
        borderRadius="0px"
      >
        Logout
      </Button>
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Logging Out
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to Logout Now?
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={logout} ml={3}>
                Logout
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  )
}