import React, { useState, useEffect } from 'react'
import {addNewForumAction} from '../redux/reducers/discussion'
import {useSelector, useDispatch} from 'react-redux' 
import { 
  Box, Modal, ModalBody, ModalContent, ModalOverlay, ModalHeader, FormControl, Divider, FormLabel, Input, Button, ModalFooter
} from '@chakra-ui/react'
import { addQuestionTopicAction } from '../redux/reducers/questionDiscuss'
import { STATUS } from '../App/Constants'

export const AddNewForumModal = ({visible, closeModal, parentId, question}) => {
    const dispatch = useDispatch()

    const {addQueTopicStatus} = useSelector(state => ({
        addQueTopicStatus:state.questionDiscuss.addQueTopicStatus
    }))

    const [topic, changeTopic] = useState()
    const [body, changeBody] = useState()

    const submitData = () => {
        let data = {topic, body, community:question ? 'question' : 'discussion', active:true, studentsAllowed:true}
        
        if(parentId){
            data = {...data, parentTopic:parentId}
        }

        if(question)
            dispatch(addQuestionTopicAction(data))
        else
            dispatch(addNewForumAction(data))
    }

    return(
         <Modal isOpen={visible} size='2xl' onClose={closeModal}>
            <ModalOverlay />
 	        <ModalContent>
 	        	<ModalHeader>Add New Topic</ModalHeader>
                <Divider/>
                <form onSubmit={submitData}>
                    <ModalBody>
                        <>
                            <FormControl mb={4} id="topic" isRequired>
                                <FormLabel>Topic</FormLabel>
                                <Input placeholder="Topic" value={topic} onChange={(e) => changeTopic(e.target.value)}/>
                            </FormControl>  
                            <FormControl id="body" isRequired>
                                <FormLabel>Body</FormLabel>
                                <Input placeholder="Body" value={body} onChange={(e) => changeBody(e.target.value)}/>
                            </FormControl>  
                        </>                    
                    </ModalBody>
                    <ModalFooter>
                        <Button type='submit' isLoading={addQueTopicStatus === STATUS.FETCHING}>Add</Button>
                    </ModalFooter>
                </form>
            </ModalContent>
        </Modal>
    )
}
