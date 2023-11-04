import React, { useState, useEffect } from 'react'
import { Box, Flex, Avatar, Text, Tag, Center, Button, Spinner,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton, 
    Tooltip,
    Input} from '@chakra-ui/react';
import { useDispatch, useSelector } from "react-redux";
import AddDoubtModal from '../../Components/AddDoubtModal'
import { ChatIcon } from '@chakra-ui/icons'
import { DiscussionComments, CommentItem } from '../DiscussionCommunity/DiscussionComments'
import { TimeIcon, CalendarIcon, CheckCircleIcon, DownloadIcon } from '@chakra-ui/icons'
import {
    getAllTeachers, getUserDoubtsAction, getTeacherDoubtsAction, resetTeacherDoubts, resetUserDoubts
  } from "../../redux/reducers/doubt";
  
import { STATUS } from '../../App/Constants';
import _ from 'lodash';
import moment from 'moment';
import { useIsAuthenticated } from '../../App/Context';

export default function StudentDoubtsHome(props) {
    const isAuthenticated = useIsAuthenticated()
    return isAuthenticated ? <StudentDoubtHomeC {...props}/> : (
        <Box>
            Please login to continue
        </Box>
    )
}

const StudentDoubtHomeC = props => {
    
    const dispatch = useDispatch();
    const [showAskQuestionModal, setShowAskQuestionModal] = useState();
    const { doubtsReducer, user } = useSelector((state) => ({doubtsReducer: state.doubts, user : state.user.user,}));
    const { allTeachers, userAskedDoubts, teacherDoubts, getAllTeachersStatus, getUserDoubtStatus, getTeacherDoubtsStatus, getMoreTeacherDoubtStatus, getMoreUserDoubtStatus } = doubtsReducer;
    const [ userDoubts, setUserDoubts ] = useState(null);
    const [ isCurrentAnyActive, setIsCurrentAnyActive ] = useState(true);
    const [ teacherCurPage, setTeacherCurPage ] = useState(1);
    const [ userCurPage, setUserCurPage ] = useState(1);
    const [ publicDoubts, setPublicDoubts ] = useState(null);
    const [ currTeacher, setCurrTeacher ] = useState();
    const [ showDoubtOverview, setShowDoubtOverview ] = useState();
    const [ searchValue, setSearchValue ] = useState()

    useEffect(() => {
        dispatch(getAllTeachers());
        return () => {
            dispatch(resetTeacherDoubts());
            dispatch(resetUserDoubts());
        }
    }, [dispatch])

    useEffect( () => {
        let currentUrlParams = new URLSearchParams(window.location.search);
        const curTeacherId = currentUrlParams.get('teacher');
        setCurrTeacher( _.find(allTeachers, t => t._id === curTeacherId ));
        setUserCurPage(1);
        setTeacherCurPage(1);
        dispatch(resetTeacherDoubts());
        dispatch(resetUserDoubts());
    },[props.location.search,allTeachers,dispatch])

    useEffect( () => {
        setUserDoubts(userAskedDoubts?.docs);
    },[userAskedDoubts])

    useEffect( () => {
        setPublicDoubts(_.filter(teacherDoubts?.docs, d => (d.userId._id !== user?._id && d.public )));
    },[teacherDoubts,user?._id])

    useEffect( () => {
        setIsCurrentAnyActive(true);
        if(userDoubts)
            setIsCurrentAnyActive( _.find(userDoubts , d => d.status === 'Open' ) )
    },[userDoubts])

    useEffect( () => {
        if( currTeacher ){
            dispatch(getUserDoubtsAction({ staff : currTeacher?.user?._id, userId: user?._id, page: userCurPage }));
        }
    },[currTeacher, dispatch, user?._id, userCurPage])

    useEffect( () => {
        if(currTeacher)
            dispatch(getTeacherDoubtsAction({ staff : currTeacher?.user?._id, page: teacherCurPage, public: true }));
    },[teacherCurPage, currTeacher, dispatch])

    const handleTeacherSelect = (t) => {
        let currentUrlParams = new URLSearchParams(window.location.search);
        currentUrlParams.set('teacher', t?._id);
        props.history.push(window.location.pathname + "?" + currentUrlParams.toString());
    }

    const handleSearch = (e) => {
        setSearchValue(e.target.value)
    }

    return (
        <Box py={[4, 8]} paddingLeft={[4, 8]} borderRadius={5} bg='white' minH="100vh" m={4}>
            <Flex flexWrap={['wrap', 'wrap', 'wrap', 'nowrap']}>
                {
                    showDoubtOverview && <ShowDoubtOverview doubt={showDoubtOverview} hideModal = { () => setShowDoubtOverview(null) } />
                }
               <Box flexGrow='1' m='0rem 0.5rem'>
                    {
                        currTeacher ?
                            <>
                                <Box>
                                    {
                                        showAskQuestionModal ? <AddDoubtModal staffId = { currTeacher?.user?._id } hideModal={() => setShowAskQuestionModal(false)} /> : null
                                    }
                                    <Flex justifyContent='space-between' alignItems='center' flexWrap='wrap' >
                                        <Flex>
                                            <Avatar size='lg' name={currTeacher?.user?.name}/>
                                            <Box mx={4}>
                                                <Text noOfLines={'1'} fontWeight='bold' fontSize={20} >{currTeacher?.user?.name}</Text>
                                                <Flex alignItems='center' flexWrap='wrap'>
                                                    <Text noOfLines={'1'} fontSize={12} >
                                                        {currTeacher?.staffDesc} 
                                                    </Text>
                                                    {
                                                        userDoubts && <Tooltip label={"Asked Doubts " + userAskedDoubts.total } ><Box cursor='pointer' ><CalendarIcon mx={3} color="teal.400" />{userAskedDoubts.total}</Box></Tooltip>
                                                    }
                                                </Flex>
                                            </Box>
                                        </Flex>
                                        {
                                           (!isCurrentAnyActive)  &&
                                            <Box mr={2} >
                                                <Button colorScheme='green' size="sm" onClick={() => setShowAskQuestionModal(true)}><ChatIcon mr='0.5rem' />Ask a question</Button>
                                            </Box>
                                        }
                                    </Flex>
                                </Box>
                                {
                                    getUserDoubtStatus === STATUS.SUCCESS ? 
                                        userDoubts?.length > 0 ?
                                            <Box py={10} pl={8} borderRadius='5px' boxShadow='sm' >
                                                {
                                                    _.map(userDoubts, d => <SingleDoubt key={d._id} seeDetails={ () => { setShowDoubtOverview(d) } } doubt = {d} /> )
                                                }
                                                {
                                                    userAskedDoubts?.page !== userAskedDoubts?.pages && getMoreUserDoubtStatus !== STATUS.FETCHING ? 
                                                        <Center>
                                                            <Button variant='ghost' colorScheme='blue' onClick={ () => setUserCurPage(userAskedDoubts?.page+1) } >Show More...</Button>
                                                        </Center>
                                                    :
                                                    getMoreUserDoubtStatus === STATUS.FETCHING && <CustomSpinner />
                                                }
                                            </Box>
                                        :
                                            <Center  py={8}>
                                                No previous doubt history  
                                            </Center>
                                    :
                                        <Center>
                                            { getUserDoubtStatus === STATUS.FETCHING && <CustomSpinner /> }
                                        </Center>
                                    }
                            </>
                            :
                                <Center>
                                    Please Select a teacher!
                                </Center>
                        }
                    </Box>
                <Box flexGrow={{ sm: '1', lg: '0' }} minW='225px' pos="sticky" top="0px" h='fit-content' >
                    <Box fontWeight='bold' color="brand.redAccent" p={2} borderBottom="1px solid">Subject Experts</Box>
                    <Box my={4}>
                        <Input placeholder={'Search expert'} onChange={handleSearch} />
                    </Box>
                    <Box pl={2} pb={4} mt={2} maxH='80vh' overflowY='scroll' css={{ '&::-webkit-scrollbar': { width: '6px' }, '&::-webkit-scrollbar-thumb':{ background: '#6372CA', borderRadius: '10px' } }}>
                        {
                            getAllTeachersStatus ===  STATUS.SUCCESS ?
                                _.map(_.filter(allTeachers, teacher => {
                                    return teacher.staffRole !== 'HEAD_TEACHER' && teacher?.user?.isActive && (searchValue ? _.includes(_.toLower(teacher.user.name), _.toLower(searchValue)) || _.includes(_.toLower(teacher.staffDesc), _.toLower(searchValue)) : true)
                                } ) , t => <OneTeacherProfile key={t?._id} onClick = { () => handleTeacherSelect(t) } staffDesc={t?.staffDesc} name={t?.user?.name} role={t?.staffRole} img={t?.avatar} isSelected = { currTeacher?._id === t?._id } /> ) 
                            : null
                        }
                    </Box>
                </Box>
            </Flex>
            
            {
                currTeacher && 
                    <Box my="3rem">
                        <Box fontWeight='bold' fontSize="1.5rem">
                            Common Doubts section
                        </Box>
                        {
                            getTeacherDoubtsStatus === STATUS.SUCCESS && 
                                <Box>
                                    <Flex my={4} mx={2} flexWrap="wrap" alignItems="stretch">
                                        {
                                            publicDoubts?.length > 0 ?
                                            _.map(publicDoubts, (doubt, i) =>
                                            (
                                                <Box key={ doubt._id } w={{ sm:'100%' }}>
                                                    <Box onClick={ () => setShowDoubtOverview(doubt) } h="100%" cursor="pointer" m="0.5rem 0rem" p={2} pl={3} transition="all 0.3s"  _hover={{ boxShadow:'md' }}>
                                                    <Box>
                                                        <Text noOfLines='3'>
                                                            {
                                                                doubt.doubt
                                                            }
                                                        </Text>
                                                        </Box>
                                                        <Flex fontSize='.8rem' mt={2} alignItems='center' >
                                                            <Box>
                                                                <Text noOfLines='1'>
                                                                    {
                                                                        doubt.userId.name
                                                                    }
                                                                </Text>
                                                            </Box>
                                                            <div style={{ height: '4px', width: '4px', borderRadius: '50%', background: 'gray', margin: '0px 5px' }}></div>
                                                            <Box color='primary.400'>
                                                                { moment(doubt.createdAt).format("DD MMM-YY, hh:mm a") }
                                                            </Box>
                                                        </Flex>
                                                    </Box>
                                                </Box>)
                                            )
                                            :
                                                <Center w="100%" fontWeight='bold' m={4} color="primary.400" >No Doubts!</Center>
                                        }
                                    </Flex>
                                    {
                                        teacherDoubts?.page !== teacherDoubts?.pages && getMoreTeacherDoubtStatus !== STATUS.FETCHING ? 
                                            <Center>
                                                <Button variant='ghost' colorScheme='blue' onClick={ () => setTeacherCurPage(teacherDoubts?.page+1) } >Show More...</Button>
                                            </Center>
                                        :
                                            getMoreTeacherDoubtStatus === STATUS.FETCHING && <CustomSpinner />
                                    }
                                </Box>
                        }
                    </Box>
            }
        </Box>
    )
}

const SingleDoubt = (props) => {
    const { doubt, seeDetails } = props;
    return (
        <Box transition="all 0.3s" role="group" mb={2} pos="relative" borderLeft='1px solid' borderColor={ doubt.status === 'Closed' ? 'orange.400' : 'green.400' } pt={5} cursor = { doubt.status === 'Closed' && 'pointer' } onClick = {  doubt.status === 'Closed' && seeDetails } >
            <Box pos="sticky" top="30px" zIndex='99'>
                <Flex pos="absolute" top="-30px" left={ doubt.status === 'Open' ? '-20px' : '-15px' } bg="#ffffffb8" color={ doubt.status === 'Closed' ? 'orange.400' : "green.400" } alignItems='center'>
                    {
                        doubt.status === 'Closed' ?
                            <TimeIcon fontSize={30} mr={1} boxShadow='md' borderRadius='50%' bg="white"/>
                        :
                            <ChatIcon fontSize={30} mr={1} bg="white" />
                    }
                    
                    {moment(doubt.createdAt).format("DD MMM-YY, hh:mm a")}
                    <Flex justifyContent='space-between' ml={2}>
                        <Tag size='md' variant='solid' colorScheme={ doubt.status === 'Closed' ? 'orange' : 'green' } >
                            {doubt.status}
                        </Tag>
                        {
                            doubt.public === true &&
                            <Tag size='md' ml={1} variant='solid' colorScheme='blue'>
                                Public
                            </Tag>
                        }
                    </Flex>

                </Flex>
            </Box>
            <Box py={6} px={4}>
                <Box fontSize={18} >{doubt.doubt}</Box>
                <Flex>
                    {/*
                        _.map(doubt.files , (f,i) => (
                            <a key={f.url} href={f.url} target="blank">
                                <Button m={2} ml={ i === 0 && '0' } size='xs' colorScheme='teal'>Attacment {i+1}<DownloadIcon mx={1}/></Button>
                            </a>
                        ))
                        */
                    }
                </Flex>
            </Box>
            
            {
                doubt.status === 'Open' && 
                <Box px={4}>
                    <DiscussionComments placeholder = "Add your comment" itemModel={"Topic"} sortType={'desc'} showAttachment={false} inputStyle="flushed" itemId={doubt._id} />
                </Box>
            }
        </Box>
    )
}

const OneTeacherProfile = (props) => {
    const { name, role, img, onClick, isSelected } = props;
    return (
        <Box p={2} cursor='pointer' _hover={{ bg: 'gray.100' }} onClick = { onClick } >
            <Flex>
                <Avatar size='sm' name={name} src={img}/>
                <Box mx={4}>
                    <Text noOfLines={'1'} fontWeight='bold' color={ isSelected ? "blue.600" : null }>{name}</Text>
                    <Text noOfLines={'1'} fontSize='.6rem'>{props.staffDesc}</Text>
                </Box>
            </Flex>
        </Box>
    )
}

const ShowDoubtOverview = (props) => {
    const { hideModal, doubt } = props;
    return (
        
        <Modal size="4xl" isOpen={true} onClose={hideModal}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader color="teal.500">Asked on {moment(doubt.createdAt).format('DD MMM-YY')}</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Box fontSize={23} pl={2} fontWeight="bold">
                        { doubt.doubt }
                    </Box>
                    <Box>
                        <Flex>
                            {
                                /*
                                _.map(doubt.files , (f,i) => (
                                    <a href={f.url} target="blank">
                                        <Button m={2} size='xs' colorScheme='teal'>Attacment {i+1}<DownloadIcon mx={1}/></Button>
                                    </a>
                                ))
                                */
                            }
                        </Flex>
                    </Box>
                        <Box my={4} pl={2}>
                            <DiscussionComments disableComment={ true } disableReply={true} itemModel={"Topic"} sortType={'desc'} showAttachment={false} inputStyle="flushed" itemId={doubt._id} />
                        </Box>
                </ModalBody>
                <ModalFooter>
                    <Button variant='ghost' mr={3} onClick={hideModal}>
                        Close
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}   

const CustomSpinner = () => {
    return (
        <Center marginY={2}>
            <Spinner size='lg' />
        </Center> 
    )
}
