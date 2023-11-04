import React, { useState, useEffect } from 'react'
import {addNewQuestionDiscussAction, updateQuestionAction} from '../redux/reducers/questionDiscuss'
import {useSelector, useDispatch} from 'react-redux' 
import { useHistory, useParams } from 'react-router'
import { 
  Box, Modal, ModalBody, ModalContent, ModalOverlay, ModalHeader, FormControl, Divider, FormLabel, 
  Input, Button, Radio, Flex, Tag, HStack, Textarea, Text, AlertDialog, AlertDialogOverlay, AlertDialogContent, AlertDialogHeader, AlertDialogBody, AlertDialogFooter, VStack
} from '@chakra-ui/react'
import { STATUS } from '../App/Constants'
import { ButtonX } from './ButtonX'

export const AddQuestionDiscussModal = ({visible, closeModal, defaultQuetion}) => {
    const dispatch = useDispatch()
    const params = useParams()
    const lmsConfig = useSelector(state => state.lmsConfig)
    const [answerEn, changeAnswerEn] = useState()
    const [answerHn, changeAnswerHn] = useState()

    const addNewQuestionDiscussStatus = useSelector(state => state.questionDiscuss.addNewQuestionDiscussStatus)
    
    const [body, changeBody] = useState()
    const [topic, changeTopic] = useState()

    const [questionEn, changeQuestionEn] = useState()
    const [questionHn, changeQuestionHn] = useState()
    
    const [optionAEn, changeOptionAEn] = useState()
    const [optionBEn, changeOptionBEn] = useState()
    const [optionCEn, changeOptionCEn] = useState()
    const [optionDEn, changeOptionDEn] = useState()

	const [optionAHn, changeOptionAHn] = useState()
    const [optionBHn, changeOptionBHn] = useState()
    const [optionCHn, changeOptionCHn] = useState()
    const [optionDHn, changeOptionDHn] = useState()


    const [tags, changeTags] = useState()
    const [subjects, changeSubjects] = useState([])
    const [standards, changeStandards] = useState([])
    const [boards, changeBoards] = useState([])
    const [exams, changeExams] = useState([])	

    useEffect(() => {
        if(defaultQuetion){
            let que = defaultQuetion.doubtQuestion
            changeQuestionEn(que.question.en)
            changeOptionAEn(que.options[0].body.en)
            changeOptionBEn(que.options[1].body.en)
            changeOptionCEn(que.options[2].body.en)
            changeOptionDEn(que.options[3].body.en)
            
            let ans = _.find(que.options,o => o._id === que.correctOption)
            changeAnswerEn(ans.key.en)
        }
    }, [defaultQuetion])


    const submitData = () => {

        if(defaultQuetion){
            let que = defaultQuetion.doubtQuestion
            let option = _.find(que.options,o => o.key.en === answerEn)?._id
            let data = {
                question: { en: questionEn, hn: questionHn },
                approved: false,
                correctOption: option,
                options: [
                    {
                        _id:que.options[0]._id,
                        key: { en: 'A', hn: 'A' },
                        body: { en: optionAEn, hn: optionAHn }
                    },
                    {
                        _id:que.options[1]._id,
                        key: { en: 'B', hn: 'B' },
                        body: { en: optionBEn, hn: optionBHn }
                    },
                    {
                        _id:que.options[2]._id,
                        key: { en: 'C', hn: 'C' },
                        body: { en: optionCEn, hn: optionCHn }
                    },
                    {
                        _id:que.options[3]._id,
                        key: { en: 'D', hn: 'D' },
                        body: { en: optionDEn, hn: optionDHn }
                    },
                ]
            }

            console.log('data', data)
            dispatch(updateQuestionAction({...data, topicId:defaultQuetion?._id}))
        }else{
            let data = {
                topic: topic,
                body: body,
                shares: 0,
                
                studentsAllowed: true,
                community: 'question',
                parentTopic: params.id,
                doubtQuestion: {
                    question: { en: questionEn, hn: questionHn },
                    approved: false,
                    correctOption: { key: { en: answerEn}},
                    options: [
                        {
                            key: { en: 'A', hn: 'A' },
                            body: { en: optionAEn, hn: optionAHn }
                        },
                        {
                            key: { en: 'B', hn: 'B' },
                            body: { en: optionBEn, hn: optionBHn }
                        },
                        {
                            key: { en: 'C', hn: 'C' },
                            body: { en: optionCEn, hn: optionCHn }
                        },
                        {
                            key: { en: 'D', hn: 'D' },
                            body: { en: optionDEn, hn: optionDHn }
                        },
                    ]
                },
                // exams: exams,
                // boards: boards,
                // subjects: subjects,
                // standards: standards,
            }
            dispatch(addNewQuestionDiscussAction({...data}))
        }

    }

    const [confirmAlert, showAlert] = useState()
    const cancelRef = React.useRef()
    const handleAlert = () => {
        showAlert(!confirmAlert)
    }


    console.log('addNewQuestionDiscussStatus', answerEn)
    const disable = !optionAEn || !optionBEn || !optionCEn || !optionDEn || !answerEn || !questionEn
    return(
         <Modal isOpen={visible} size='4xl' onClose={closeModal}>
            <ModalOverlay />
 	        <ModalContent>
 	        	<ModalHeader>{defaultQuetion ? 'Update Question' : 'Add New Question'}</ModalHeader>
                <Divider/>
                <ModalBody>
                    <Box p={5}>
                        {/* <FormControl id="Topic">
                            <FormLabel>Topic</FormLabel>
                            <Input mb={3} size='sm' placeholder="Enter Topic" value={topic} onChange={(e) => changeTopic(e.target.value)}/>
                        </FormControl>  
                        <FormControl id="Body">
                            <FormLabel>Body</FormLabel>
                            <Input mb={3} size='sm' placeholder="Enter Body" value={body} onChange={(e) => changeBody(e.target.value)}/>
                        </FormControl>  */}
                        <HStack>
                            <Box flexGrow={1}>
                                <FormControl isRequired id="Question">
                                    <FormLabel>Question (English)</FormLabel>
                                    <Textarea mb={3} rows={5} size='sm' placeholder="Enter Question" value={questionEn} onChange={(e) => changeQuestionEn(e.target.value)}/>
                                </FormControl>
                            </Box>
                          
                        </HStack>  
                        <HStack>
                            <Box flexGrow={1}>
                                <FormControl isRequired id="Option A">
                                    <FormLabel><Radio isChecked={answerEn === 'A'} disabled={!optionAEn} onClick={() => changeAnswerEn('A')}>Option A</Radio></FormLabel>
                                    <Input mb={3} size='sm' placeholder="Enter Option A" value={optionAEn} onChange={(e) => changeOptionAEn(e.target.value)}/>
                                </FormControl> 
                                <FormControl isRequired id="Option B">
                                    <FormLabel><Radio isChecked={answerEn === 'B'} disabled={!optionBEn} onClick={() => changeAnswerEn('B')}>Option B</Radio></FormLabel>
                                    <Input mb={3} size='sm' placeholder="Enter Option B" value={optionBEn} onChange={(e) => changeOptionBEn(e.target.value)}/>
                                </FormControl> 
                                <FormControl isRequired id="Option C">
                                    <FormLabel><Radio isChecked={answerEn === 'C'} disabled={!optionCEn} onClick={() => changeAnswerEn('C')}>Option C</Radio></FormLabel>
                                    <Input mb={3} size='sm' placeholder="Enter Option C" value={optionCEn} onChange={(e) => changeOptionCEn(e.target.value)}/>
                                </FormControl> 
                                <FormControl isRequired id="Option D">
                                    <FormLabel><Radio isChecked={answerEn === 'D'} disabled={!optionDEn} onClick={() => changeAnswerEn('D')}>Option D</Radio></FormLabel>
                                    <Input mb={3} size='sm' placeholder="Enter Option D" value={optionDEn} onChange={(e) => changeOptionDEn(e.target.value)}/>
                                </FormControl>
                                <FormControl isRequired id="Answer">
                                    <FormLabel>Selected Option</FormLabel>
                                    <b>{answerEn ? <Text color={'brand.green'}>{`Option ${answerEn}`}</Text> : <Text color={'#AEB6BF'}>not selected</Text> }</b>

                                </FormControl>
                            </Box>
                        
                        </HStack>  
                       
                    <Flex justifyContent={'flex-end'}>
                    <AlertDialog size='4xl'
                        isOpen={confirmAlert}
                        leastDestructiveRef={cancelRef}
                        onClose={handleAlert}
                    >
                        <AlertDialogOverlay>
                        <AlertDialogContent>
                            <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                                Confirm Add Question
                            </AlertDialogHeader>

                            <AlertDialogBody>
                                <VStack align={'stretch'}>
                                    <Box mb={4} align={'start'}>
                                        <b fontSize={13} fontWeight={'bold'}>Question: </b>&nbsp;&nbsp;
                                        <span>{questionEn}</span>
                                    </Box>
                                    <VStack mb={4} spacing={4} align={'stretch'}>
                                        <Box align={'start'}>
                                            <b fontSize={13} fontWeight={'bold'}>Option A: </b>&nbsp;&nbsp;
                                            <span>{optionAEn}</span>
                                        </Box>
                                        <Box align={'start'}>
                                            <b fontSize={13} fontWeight={'bold'}>Option B: </b>&nbsp;&nbsp;
                                            <span>{optionBEn}</span>
                                        </Box>
                                        <Box align={'start'}>
                                            <b fontSize={13} fontWeight={'bold'}>Option C: </b>&nbsp;&nbsp;
                                            <span>{optionCEn}</span>
                                        </Box>
                                        <Box align={'start'}>
                                            <b fontSize={13} fontWeight={'bold'}>Option D: </b>&nbsp;&nbsp;
                                            <span>{optionDEn}</span>
                                        </Box>
                                    </VStack>
                                    <Box align={'start'}>
                                        <b fontSize={13} fontWeight={'bold'}>Selected Option: </b>&nbsp;&nbsp;
                                        <span style={{color:'#0F9D58'}} >{`Option ${answerEn}`}</span>
                                    </Box>
                                </VStack>
                            </AlertDialogBody>

                            <AlertDialogFooter>
                            <ButtonX vairant='outline' ref={cancelRef} onClick={handleAlert}>
                                Cancel
                            </ButtonX>
                            <ButtonX isLoading={addNewQuestionDiscussStatus === STATUS.FETCHING} onClick={submitData} ml={3}>
                                Confirm
                            </ButtonX>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                        </AlertDialogOverlay>
                    </AlertDialog>
                    <ButtonX disabled={disable} onClick={handleAlert}>{defaultQuetion ? 'Update' : 'Add'} Question</ButtonX>

                    </Flex>

                    </Box> 


                    <br/>
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}
