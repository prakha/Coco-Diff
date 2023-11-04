import { VStack, HStack, Box, Text, Flex } from '@chakra-ui/layout'
import React, { useEffect, useState, useRef, } from 'react'
import { AiOutlineUsergroupAdd } from 'react-icons/ai'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useParams } from 'react-router'
import { STATUS } from '../../App/Constants'
import { ErrorChecker } from '../../Components/ErrorChecker'
import {  Tag, Tabs, TabList, Tab, 
    Breadcrumb, BreadcrumbItem, BreadcrumbLink,  AlertDialog, AlertDialogOverlay, AlertDialogContent, AlertDialogBody, AlertDialogFooter, Button, FormControl, Select, FormLabel, Input, IconButton, Tooltip, Menu, MenuButton, MenuList, MenuItem } from '@chakra-ui/react'
import {AddQuestionDiscussModal} from  '../../Components/AddQuestionDiscussModal'
import {getSingleQuestionAction, resetModalStatus,  selectOptionAction, getTopicAnsAction, resetSelectOptStatus, deleteQueAction} from '../../redux/reducers/questionDiscuss'
import _ from 'lodash'
import Pagination from "@choc-ui/paginator";
import { DiscussionComments } from '../DiscussionCommunity/DiscussionComments'
import { SectionHeader } from '../../Components/SectionHeader'
import moment from 'moment'
import { FiMoreVertical } from "react-icons/fi";
import { ButtonX } from '../../Components/ButtonX'

export const SingleQuestionComponent = (props) => {    
    const dispatch = useDispatch()  
    const params = useParams()
    const history = useHistory()

    const [yourAnswer, addYourAnswer] = useState('')

    const [addQuestionDiscussModal, changeQuestionDiscussModal] = useState(false)
    const [bottomView, changeBottomView] = useState('Chat')
    const [confirmDelete, openConfrimDelete] = useState()

	const { currentQuestionData, questionData, user, getTopicAnsStatus, answersCount, updateQuestionStatus, deleteQueStatus } = useSelector((state) => ({
		currentQuestionData: state.questionDiscuss?.currentQuestionData || null,
        questionData: state.questionDiscuss,
        user:state.user,
        answersCount:state.questionDiscuss.answersCount,
        getTopicAnsStatus:state.questionDiscuss.getTopicAnsStatus,
        updateQuestionStatus:state.questionDiscuss.updateQuestionStatus,
        deleteQueStatus:state.questionDiscuss.deleteQueStatus
	}))


    useEffect(() => {
        if(deleteQueStatus === STATUS.SUCCESS && questionData.currentQuestionData.parentTopic)
            history.push('/dashboard/community-questions/'+questionData.currentQuestionData.parentTopic._id)
            console.log('deleted', questionData.currentQuestionData)
    }, [deleteQueStatus])

	// useEffect(() => {
	// 	dispatch(getSingleQuestionAction({topicId: params?.id}))
    //     // dispatch(getQuestionAnswerComments({itemId: params?.id}))
    //     dispatch(getTopicAnsAction({topicId: params?.id}))
    //     changeBottomView('Chat')
	// }, [dispatch, params?.id])

    useEffect(() => {
    	if(questionData.addNewQuestionDiscussStatus === STATUS.SUCCESS){
	    	changeQuestionDiscussModal(false)
	    	dispatch(resetModalStatus())
    	}
    }, [dispatch, questionData.addNewQuestionDiscussStatus])


    const changeSingleForm = (sub) => {
		history.push('/dashboard/community-questions/'+sub._id)
	}

	const changePage = (e) => {
        dispatch(getSingleQuestionAction({topicId: params?.id, limit:10, page:e}))
    }

  
    useEffect(() => {
        if(questionData.getSingleQuestionDiscussStatus === STATUS.SUCCESS && !questionData.currentQuestionData?.parentTopic){
            changeBottomView('Topic')
        }
    }, [questionData.currentQuestionData?.parentTopic, questionData.getSingleQuestionDiscussStatus])

    useEffect(() => {
        JSON.parse(window.localStorage.getItem("questionRoute"))
    }, [])

    // const [answersCount, setAnswers] = useState();

    const _addYourAnswer = (op) => {
        dispatch(selectOptionAction({topicId: questionData.currentQuestionData?._id, optionId:op}))
    }

    const [alertStatus, openAlert] = useState()

    const _openConfirmAlert = (opId) => {
        openAlert(opId)
    }

    const [sortBy, changeSortBy] = useState(-1)
    const [searchData, changeSearchData] = useState();

    const [finalSearchData , setFinalSearchData] = useState()
    const handleSorting = (value) => {
        changeSortBy(value.target.value)
    }

    const changeSearch = (e) => {
        setFinalSearchData(searchData)
    };

    useEffect(() => {
        if(updateQuestionStatus)
            changeQuestionDiscussModal(false)    
    }, [updateQuestionStatus])

    const handleDelete = (que) => {
        openConfrimDelete(que)
    }

    const handleConfirmDelete = (que) => {
        console.log('delete')
        dispatch(deleteQueAction({topicId:que._id}))
    }

    const handleEditQuestion = (que) => {
        changeQuestionDiscussModal(d => !d ? que : false)
    }

	useEffect(() => {
		dispatch(getSingleQuestionAction({topicId: params?.id, searchByText: finalSearchData, sorting: sortBy }))
        // dispatch(getQuestionAnswerComments({itemId: params?.id}))
        dispatch(getTopicAnsAction({topicId: params?.id}))
        changeBottomView('Chat')
	}, [dispatch, params?.id, sortBy, finalSearchData])


    const localData = (typeof window !== 'undefined') && localStorage.getItem("questionRoute") ? JSON.parse(localStorage.getItem("questionRoute")) : []
   
    let breadcrumbs = [
    {title:'Home', link:'/'},
    {title:'Questions Community', link:'/dashboard/community-questions'},
    ...localData.map(d => ({title:d.topic || 'question', link:'/dashboard/community-questions/'+d._id}))
    ]

    return (
        <Box pos='relative'>
            <Box>
                <SectionHeader title='Questions Community' breadcrumbs={breadcrumbs}/>
                <HStack w="100%" spacing={6} alignItems="stretch">
          <Box w="70%">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                changeSearch(searchData);
              }}
            >
              <Flex>
                 <Flex flex={1}>
                 <Input borderRadius="xl" background='white'
                    placeholder="Search topics"
                    value={searchData}
                    onChange={(e) => changeSearchData(e.target.value)}
                  />
                  <ButtonX ml={2}
                    type="submit"
                    onClick={() => changeSearch(searchData)}
                  >
                    Search
                  </ButtonX>
                 </Flex>
                <Box px={7}>
                  <FormControl>
                    <Select  onChange={handleSorting} background='white' value={sortBy} >
                      <option value={1}>Ascending</option>
                      <option value={-1}>Descending</option>
                    </Select>
                  </FormControl>
                </Box>
              </Flex>
            </form>
            {
                  finalSearchData ? 
                  <Box m={2}>
                      <Text fontSize={"sm"}>Search results for <Text style={{color:"orange"}} as={"span"}>{finalSearchData}</Text></Text> 
                  </Box>  : null
              }
          </Box>
              
             
          {/*<Box w='30%'>
	                    <Button width="100%" leftIcon={<AiOutlineUsergroupAdd fontSize='18pt'/>} bg="primaryBlue.400" color='white' onClick={() => changeAddForumModal(true)}>
	                        Create New Community
	                    </Button>
	                </Box>*/}
        </HStack>
            </Box>
        	{currentQuestionData ? 
        		<>
                    <ErrorChecker size='md' status={questionData.getSingleQuestionDiscussStatus || getTopicAnsStatus}>
                        {questionData.getSingleQuestionDiscussStatus == STATUS.SUCCESS || getTopicAnsStatus == STATUS.SUCCESS ?
        		            <div>                               
                                <br/>
                        		<Box w='100%' p={6} bg='white' borderRadius='12px' boxShadow='rgba(149, 157, 165, 0.1) 0px 4px 12px'>
                                    <div>
                                        <Text fontSize="lg">{questionData.currentQuestionData.topic}</Text>
                                        <Text fontSize="sm" color="gray.500">{questionData.currentQuestionData.body}</Text>
                                        <br/> 
                                    </div>
                                        {questionData.currentQuestionData?.parentTopic ? 
                                            <Tabs width='100%' onChange={(e) => changeBottomView(e === 1 ? 'Topic' : 'Chat')}>
                                                <TabList>
                                                    <Tab value='Chat'>Chat</Tab>
                                                    {/*<Tab value='Topic'>Topic</Tab>*/}
                                                </TabList>
                                            </Tabs>
                                        : null}
                                        {questionData.currentQuestionData.studentsAllowed && !questionData?.currentQuestionData?.parentTopic ? 
                                            <Flex justifyContent="space-between">
                                                <HStack>
                                                    <Text>Questions:</Text> 
                                                    <Text fontWeight='bold' color='brand.yellow'>{questionData.currentQuestionData.subTopics?.total || 0}</Text>
                                                </HStack>
                                                <ButtonX size='sm' mr={10} leftIcon={<AiOutlineUsergroupAdd fontSize='18pt'/>} onClick={() => changeQuestionDiscussModal(true)}>
                                                    Post Question
                                                </ButtonX>
                                            </Flex>
                                        : null}
                                    {bottomView === 'Topic' ? 
                                        <div>
                                            {questionData.currentQuestionData.subTopics.docs.length === 0 ? 
                                                <div style={{padding: '10px', textAlign:'center'}}>
                                                    <Text fontSize="sm" color="gray.300" textAlign="center">No Questions Added</Text>
                                                </div>
                                            : null}

                                            {_.map(questionData.currentQuestionData.subTopics.docs, (sub, subId) => {
                                                return(
                                                        <Box key={subId} cursor='pointer' onClick={() => changeSingleForm(sub)} rounded="md" w={"95%"} style={{backgroundColor: '#ffffff', margin: '20px'}}
                                                            border='1px solid #D6DBDF'
                                                        >
                                                            <div style={{padding: '20px'}}>
                                                                <HStack fontSize={12} justify={'space-between'}>
                                                                    <HStack mb={4}>
                                                                        <Text color={'brand.secondary'}>Added By:</Text>
                                                                        <Text>{sub.userId.name} {sub.userId._id === user.user._id ? '( You )' : '' }</Text> 
                                                                    </HStack>

                                                                    <HStack>
                                                                        <Text color={'brand.secondary'}>
                                                                            {moment(sub.createdAt).format('lll')}
                                                                        </Text>
                                                                            {sub.userId._id === user.user._id ?
                                                                                <Menu>
                                                                                    <MenuButton as={IconButton} size='sm' icon={<FiMoreVertical fontSize={20}/>}
                                                                                        variant='outline' onClick={e => e.stopPropagation()}   
                                                                                    >
                                                                                    </MenuButton>
                                                                                    <MenuList>
                                                                                        {/* <MenuItem onClick={e => e.stopPropagation()}>
                                                                                            Edit
                                                                                        </MenuItem> */}
                                                                                        <MenuItem onClick={e => {e.stopPropagation(); handleDelete(sub)}}>
                                                                                            Delete
                                                                                        </MenuItem>
                                                                                    </MenuList>
                                                                                </Menu>
                                                                                : null
                                                                            }
                                                                    </HStack>
                                                                </HStack>
                                                                <Flex color="gray.600">
                                                                    {/* <Box w="7%" style={{paddingLeft: '5px', display: 'block'}}>
                                                                        <span style={{padding: '9px 14px'}}>
                                                                            <b>{subId+1}.&nbsp;&nbsp;</b>
                                                                        </span>
                                                                    </Box> */}
                                                                    <Box w="90%">
                                                                        <Text color="gray.800" fontSize="md">{sub?.doubtQuestion?.question?.en}</Text>
                                                                        {/* <Text>{sub?.doubtQuestion?.question?.en}</Text> */}

                                                                        {/* <div dangerouslySetInnerHTML={{__html: sub?.doubtQuestion?.question?.en}}/> */}
                                                                        {/* <div dangerouslySetInnerHTML={{__html: sub?.doubtQuestion?.question?.hn}}/> */}
                                                                    </Box>
                                                                </Flex>
                                                            </div>
                                                            <div>
                                                            {_.map(sub?.doubtQuestion?.options, (op, i) => {
                                                                return(
                                                                    <div key={op._id} style={{border: '1px solid #E4E4E495', padding: '20px'}}>
                                                                        <Flex>
                                                                            <Box w="7%" style={{paddingLeft: '5px', display: 'block'}}>
                                                                                <span style={{fontSize:'10px', padding: '9px 12px', borderRadius: '50%', border: false ? '' : '1px solid #e2e1e5', backgroundColor: false ? '#4B37A5' : '', color: false ? 'white' : ''}}>
                                                                                    {op?.key?.en}
                                                                                </span>
                                                                            </Box>
                                                                            <Box w="90%">
                                                                                    <Text fontSize="md" color="gray.600">{op?.body?.en}</Text>
                                                                                    {/* <div dangerouslySetInnerHTML={{__html: op?.body?.en}}/>
                                                                                    <div dangerouslySetInnerHTML={{__html: op?.body?.hn}}/> */}
                                                                            </Box>
                                                                        </Flex>
                                                                    </div>
                                                                )}
                                                            )}   
                                                            </div>
                                                            <br/><br/>
                                                            {/* <hr/> */}
                                                        </Box>
                                                    )}
                                                )}
                                            <div>
                                            {currentQuestionData?.subTopics?.docs.length ? 
                                                <HStack align='center'>
                                                    <Pagination
                                                        current={currentQuestionData?.subTopics?.page}
                                                        total={currentQuestionData?.subTopics?.total}
                                                        pageSize={currentQuestionData?.subTopics?.limit}
                                                        onChange={(page) => changePage(page)}
                                                        paginationProps={{
                                                          display: "flex",
                                                          pos: "absolute",
                                                          left: "50%",
                                                          transform: "translateX(-50%)"
                                                        }}
                                                        colorScheme="blue"
                                                    />
                                                    <br/>
                                                    <br/>
                                                </HStack>
                                                :
                                                null
                                            } 
                                            </div>
                                        </div>
                                    : 
                                        <div>
                                            <Box boxShadow="lg" rounded="md" w={"95%"} style={{backgroundColor: '#ffffff', margin: '20px'}}>
                                                <div style={{padding: '10px'}}> 
                                                    <Flex justifyContent={'space-between'} padding={5} fontSize={13}>
                                                        <HStack>
                                                            <Text color={'brand.secondary'}>Added By:</Text>
                                                            <Text>
                                                                {questionData.currentQuestionData.userId?.name} 
                                                                {questionData.currentQuestionData.userId._id === user.user._id ? '( You )' : '' }
                                                            </Text>
                                                        </HStack>

                                                        <HStack>
                                                            <Text>{moment(questionData.createdAt).format('lll')}</Text>
                                                            {console.log('questionData', questionData, user)}
                                                            {questionData.currentQuestionData.userId._id === user.user._id ?
                                                                    <Menu>
                                                                        <MenuButton as={IconButton} size='sm' icon={<FiMoreVertical fontSize={20}/>}
                                                                            variant='outline' onClick={e => e.stopPropagation()}   
                                                                        >
                                                                        </MenuButton>
                                                                        <MenuList>
                                                                            <MenuItem onClick={e => {e.stopPropagation(); handleEditQuestion(questionData.currentQuestionData)}}>
                                                                                Edit
                                                                            </MenuItem>
                                                                            <MenuItem onClick={e => {e.stopPropagation(); handleDelete(questionData.currentQuestionData)}}>
                                                                                Delete
                                                                            </MenuItem>
                                                                        </MenuList>
                                                                    </Menu>
                                                                    :
                                                                    null
                                                            }
                                                        </HStack>
                                                    </Flex>
                                                    <br/>
                                                    <Flex color="text.100">
                                                        <Box w="7%" style={{paddingLeft: '5px', display: 'block'}}>
                                                            <span style={{padding: '9px 14px'}}>
                                                                <b>1.&nbsp;&nbsp;</b>
                                                            </span>
                                                        </Box>
                                                        <Box w="90%">
                                                            <div dangerouslySetInnerHTML={{__html: questionData.currentQuestionData?.doubtQuestion?.question?.en}}/>
                                                            <div dangerouslySetInnerHTML={{__html: questionData.currentQuestionData?.doubtQuestion?.question?.hn}}/>
                                                        </Box>
                                                    </Flex>
                                                </div>
                                                <div>
                                                    {_.map(questionData.currentQuestionData?.doubtQuestion?.options, (op, i) => {
                                                        const totalAnswers = _.sumBy(answersCount?.answers || [], 'count');
                                                        const answerCounts = _.find(answersCount?.answers || [], a => a._id === op._id,)?.count;
                                                        const percent = answerCounts && totalAnswers  ? ((answerCounts / totalAnswers) * 100).toFixed()+'%' : null
                                                        let answer = answersCount?.self === op._id
                                                        let myAnswer = answersCount?.self
                                                        let correctOption = questionData.currentQuestionData?.doubtQuestion?.correctOption
                                                        let currentOptStatus = answersCount?.self === op._id === correctOption

                                                        return(
                                                            <div key={op._id} style={{margin: '10px'}}>
                                                                <Flex background={myAnswer ? currentOptStatus ? 'green.50' :correctOption == op._id ? 'green.50' :myAnswer == op._id? 'red.50' : '' : ''} style={{padding: '10px', cursor: myAnswer ? '' : 'pointer', border: '1px solid #E4E4E495'}} 
                                                                    onClick={() => myAnswer ? null : _openConfirmAlert(op._id)}
                                                                >
                                                                    <Box w="7%" style={{paddingLeft: '5px', display: 'block'}}>
                                                                        <span style={{padding: '9px 14px', borderRadius: '50%', border: answer ? '' : '1px solid #e2e1e5', backgroundColor: answer ? '#4B37A5' : '', color: answer ? 'white' : ''}}>
                                                                            {op?.key?.en}
                                                                        </span>
                                                                    </Box>
                                                                    <Box w="80%">
                                                                        <span>
                                                                            <div dangerouslySetInnerHTML={{__html: op?.body?.en}}/>
                                                                            <div dangerouslySetInnerHTML={{__html: op?.body?.hn}}/>
                                                                        </span>
                                                                    </Box>
                                                                    {myAnswer ? 
                                                                        <Box w='15%'>
                                                                            <HStack w='100%'>
                                                                                <Box>
                                                                                    {op._id === correctOption ? <Tag colorScheme='teal' style={{fontSize: '10px'}}>Correct Answer</Tag> : null}
                                                                                </Box>
                                                                                <Box>
                                                                                    {op._id === myAnswer ? <Tag colorScheme={correctOption == myAnswer ? 'teal' : 'red'} style={{fontSize: '10px'}}>Your Answer</Tag> : null}
                                                                                </Box>
                                                                                <Box>
                                                                                    {percent && <Text colorScheme='primary' style={{fontSize: '14px'}}>{percent}</Text>}
                                                                                </Box>
                                                                            </HStack>
                                                                        </Box>
                                                                    : null}
                                                                </Flex>
                                                            </div>
                                                        )}
                                                    )}   
                                                </div>
                                                {alertStatus  ? <ConfirmAlert visible={alertStatus} onClose={() => _openConfirmAlert(null)} onConfirm={_addYourAnswer}/> : null}
                                                

                                                <hr/>
                                                <HStack justifyContent='space-between' p={3}>
                                                    <HStack spacing={6}>
                                                        {/* <HStack> 
                                                            <Circle size="30px" bg="#EBF3FF" color="text.300">
                                                                <IconButton onClick={likeVideo} variant='ghost' isLoading={topicReactStatus == STATUS.FETCHING} 
                                                                    icon={_.findIndex(currentQuestionData?.likes || [], l => l._id == user.user._id) != -1 ? 
                                                                        <AiFillLike cursor='pointer' fontSize='23px' />
                                                                    :
                                                                        <AiOutlineLike cursor='pointer' fontSize='23px' />
                                                                    } 
                                                                    size='sm'
                                                                />
                                                            </Circle>
                                                            <Text>{currentQuestionData?.likes.length || 0}</Text>
                                                        </HStack> */}
                                                        <HStack>
                                                            {/* <Circle size="30px" bg="#EBF3FF" color="text.300">
                                                                <IconButton variant='ghost' 
                                                                    icon={<GoComment cursor='pointer' fontSize='23px' color='#5A5A5A' />} 
                                                                    size='sm'
                                                                />
                                                            </Circle>  */}
                                                        </HStack>
                                                    </HStack>
                                                </HStack>
                                                <div>
                                                    <Box style={{backgroundColor: 'white', margin: '10px', padding: '10px', borderRadius: '10px'}}>
                                                        <Box my={2}> 
                                                            {/* {yourAnswer ? 
                                                                <div>
                                                                    YOUR ANSWER:
                                                                    <div style={{background: '#edf2f7', color: '#272045', padding: '5px'}}>
                                                                        <div>{yourAnswer?.body?.en}</div>
                                                                        <div>{yourAnswer?.body?.hn}</div> 
                                                                    </div>
                                                                </div>
                                                            : null}   */}
                                                            <br/>                                     
                                                            <DiscussionComments itemId={currentQuestionData._id} type={"question"} selectedAnswer={yourAnswer}/>
                                                        </Box>
                                                    </Box>
                                                </div>
                                            </Box>
                                        </div>
                                    }
                                </Box>
        			            {addQuestionDiscussModal ? 
                                    <AddQuestionDiscussModal 
                                        defaultQuetion={addQuestionDiscussModal?._id ? addQuestionDiscussModal : null}
                                        visible={addQuestionDiscussModal} 
                                        closeModal={() => changeQuestionDiscussModal(false)}
                                    /> 
                                : null}
        		            </div>
        		        : null}
        		    </ErrorChecker>
                </>
    	    : null}
            {confirmDelete  ? 
                <ConfirmAlert 
                    visible={confirmDelete} 
                    onClose={() => handleDelete(null)} 
                    onConfirm={handleConfirmDelete}
                /> 
                : null
            }
        </Box>
    );
};

const ConfirmAlert = ({visible, onClose, onConfirm}) => {
    let cancelRef = useRef()
    const {selectOptionStatus} = useSelector(state => state.questionDiscuss)
    const dispatch = useDispatch()

    useEffect(() => {
        return () => dispatch(resetSelectOptStatus())
    }, [dispatch])

    return(
        <AlertDialog
            isOpen={visible}
            leastDestructiveRef={cancelRef}
            onClose={onClose}
        >
            <AlertDialogOverlay>
            <AlertDialogContent>
                <AlertDialogBody>
                    Please confirm
                </AlertDialogBody>

                <AlertDialogFooter>
                    <Button size='xs' ref={cancelRef} onClick={onClose}>
                        Cancel
                    </Button>
                    <Button  isLoading={selectOptionStatus === STATUS.FETCHING} size='xs' colorScheme="red" onClick={() => {
                        onConfirm(visible)
                        onClose()
                    }} ml={3}>
                        Confirm
                </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
            </AlertDialogOverlay>
        </AlertDialog>
    )
}
