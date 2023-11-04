import React, { useReducer, useState, useEffect } from "react";
import { STATUS } from "../../App/Constants"
import {
  Box, HStack,Image, Avatar, Menu, MenuButton, MenuItem, MenuList, Button, VStack, Text, InputGroup, InputLeftElement, Input, InputRightElement, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, IconButton
} from "@chakra-ui/react";
import { useApiRequest } from "../../services/api/useApiRequest";
import { URIS } from "../../services/api";
import { sendOtpRequestAction, verifyOtpRequestAction, validateGoogleAccountAction } from '../../redux/reducers/user'
import { useAppContext } from "../../App/Context";
import { FormReducer } from "../../utils/FormReducer";
import { GoogleLogin } from 'react-google-login';
import { useDispatch, useSelector } from "react-redux";
import { LoadingRef } from "../../App/AppProvider";
import { useHistory } from "react-router-dom";
import {LoginRoute} from "../../routes/Login";
import { ChevronDownIcon, Search2Icon } from "@chakra-ui/icons";
import { AiOutlineShoppingCart } from "react-icons/ai";


export const ProfileDialog = () => {
    return(
        <Box>
            Hello World
        </Box>
    )
}