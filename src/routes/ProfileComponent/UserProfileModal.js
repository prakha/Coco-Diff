import moment from "moment";
import {
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody
} from "@chakra-ui/react";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {resetUserStatusAction} from '../../redux/reducers/user'
import _ from "lodash";
import {BasicDetailsForm} from '../BasicDetailsComponent'

export const UserProfileModal = (props) => {
  const dispatch = useDispatch();
  const {user} = useSelector((state) => ({
    user: state.user
  }))

  useEffect(() => {
    if (user.updateUserStatus === "SUCCESS") {
      dispatch(resetUserStatusAction());
      props.closeModal?.();
    }
  }, [dispatch, props, user.updateUserStatus]);

  return (
    <Modal isOpen={props.userProfileModal} onClose={props.closeModal} size='xl'>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <div>
            Edit Profile
          </div>
          <hr style={{marginTop: '10px'}}/>
        </ModalHeader>
        <ModalBody>
          <BasicDetailsForm/>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
