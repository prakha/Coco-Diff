import moment from "moment";
import {
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, VStack, CheckboxGroup, Checkbox, Box, ModalFooter, Button, Spacer, Flex
} from "@chakra-ui/react";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {resetUserStatusAction} from '../../redux/reducers/user'
import _ from "lodash";
import { AddIcon, CheckIcon } from "@chakra-ui/icons";


export const UserInterestModal = (props) => {
  const dispatch = useDispatch();
  const {examData} = useSelector((state) => ({
    examData: state.lmsConfig
  }))
  const [SelectedItems, setSelectedItems] = useState(examData.defaultData.exams.map((exam)=>({...exam,selected:false})))

  const {user} = useSelector((state) => ({
    user: state.user
  }))



  useEffect(() => {
    if (user.updateUserStatus === "SUCCESS") {
      dispatch(resetUserStatusAction());
      props.closeModal && props.closeModal();
    }
  }, [dispatch, user.updateUserStatus]);

  // console.log('Selected Data Data : ', SelectedItems)

  const changeSelected = (i) =>{
    let changedItem = SelectedItems[i]
    changedItem.selected = !changedItem.selected
    setSelectedItems([...SelectedItems, changedItem])
  }
  return (
    <Modal isOpen={props.userInterestModal} onClose={props.closeModal} size='md' scrollBehavior='inside'>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <div>
            Edit Interests
          </div>
          <hr style={{marginTop: '10px'}}/>
        </ModalHeader>
        <ModalBody>
          <InterestsList interests={examData.defaultData.exams} selected={{items:SelectedItems,set:changeSelected}}/>
        </ModalBody>
        <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={props.closeModal}>
              Close
            </Button>
            <Button variant="ghost" colorScheme="gray" onClick={props.closeModal} >Save</Button>
          </ModalFooter>
      </ModalContent>
    </Modal>
  );
};


const InterestsList = ({interests, selected}) => {


  

  return(
    <VStack
      // divider={<StackDivider borderColor="gray.200" />}
      spacing={4}
      align="stretch"
    >
      {
        interests.map((interest,i)=>(
          <Box  bg={ selected.items[i].selected ? "blue.100" : "gray.50"} p='15px' onClick={()=>selected.set(i)} boxShadow='0px 2px 2px 0px rgba(0,0,0,0.2)' fontWeight='bold' key={i}>
            <Flex>
              <Box>{interest.name.en}</Box>
              <Spacer />
              <Box>{selected.items[i].selected ? <CheckIcon/> : <AddIcon/>}</Box>
            </Flex>
          </Box>
        ))
      }
    </VStack>
  )
  

}
