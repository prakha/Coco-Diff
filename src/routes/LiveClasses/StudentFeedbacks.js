import React, { useCallback, useEffect, useState, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Avatar, Box, Button, Center, Flex, Heading, HStack, IconButton, Spinner, Text, Textarea, useMenu, VStack } from '@chakra-ui/react'
import { AiFillStar, AiOutlineStar } from 'react-icons/ai'
import { addStaffReviewAction, getStaffReviewAction, getUserStaffReviewAction } from '../../redux/reducers/liveClass';
import { CloseIcon } from '@chakra-ui/icons';
import { filter, map } from 'lodash';
import {
    resetAddReviewStatusAction
  } from "../../redux/reducers/liveClass";
import { StarsReview } from '../Survey';
import { STATUS } from '../../Constants';

export default function StudentFeedbacks({ staffId, handleClose }) {
    const dispatch = useDispatch();
    const [ page, setPage ] = useState(1);
    const { getStaffReviewStatus, staffReviews, staffReviewComments, getUserStaffReviewStatus, userStaffReviews, user } = useSelector( s => ({
        getStaffReviewStatus: s.liveClass.getStaffReviewStatus,
        staffReviews: s.liveClass.staffReviews,
        staffReviewComments: s.liveClass.staffReviewComments,
        getUserStaffReviewStatus: s.liveClass.getUserStaffReviewStatus,
        user: s.user.user,
        userStaffReviews: s.liveClass.userStaffReviews
    }) )
    
    useEffect(() => {
        if(staffId){
            dispatch(getStaffReviewAction({ isHidden: false, staff: staffId, page: page }))
        }
    }, [dispatch, staffId, page])

    useEffect( () => {
        if(staffId){
            dispatch(getUserStaffReviewAction({ staff: staffId, user : user._id }))
        }
    },[staffId, dispatch, user])
    

    const handleLoadMore = useCallback( () => {
        setPage( p => p + 1 );
    },[setPage])

    const onClose = () => {
        handleClose();
        setPage(1);
    }

    const filterComments = useMemo( () => filter(staffReviewComments, c => c.user._id !== user._id ), [staffReviewComments, user]);
    return (
        <Box w={525} top={0} pos='absolute' h="100%" boxShadow='0px 0px 20px -10px #00000080' right={ !staffId ? '-100%' : '0px' } bg='white' borderRadius={5} maxH={700} overflowY='scroll'  transition='all 0.3s'>
        <Box w='100%' p={4}>
            <Flex align='center' justify='space-between'>
                <Heading size='sm'>Students Feedback</Heading>
                <IconButton variant='ghost' size='sm' onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            </Flex>
            <Box mt={4}>
                {
                    (getStaffReviewStatus === STATUS.FETCHING || getUserStaffReviewStatus === STATUS.FETCHING) && page === 1 ?
                    <Center py={20}> 
                        <Spinner />
                    </Center>
                    : 
                    <Box>
                        {
                            userStaffReviews?.length === 0 &&
                            <InputReview staffId={staffId}/>
                        }
                        {
                            filterComments?.length > 0 || userStaffReviews?.length > 0 ?
                                <Box>
                                    <VStack mt={4} spacing={8} align='stretch'>
                                        {
                                            map(userStaffReviews, s => <StudentFeedback review={s} key={s._id}/>)
                                        }
                                        {
                                            map(filterComments, s => <StudentFeedback review={s} key={s._id}/>  )
                                        }
                                        {
                                            staffReviews?.page !== staffReviews?.pages && 
                                            <Center mt={4}><Button isLoading={getStaffReviewStatus === STATUS.FETCHING} onClick={handleLoadMore} size='sm'>Load More</Button></Center>
                                        }
                                    </VStack>
                                </Box>
                            :
                                <Box py={10} textAlign='center'>
                                    No reviews found!
                                </Box>
                        }
                    </Box>
                }
            </Box>
        </Box>
        </Box>
    )
}

const InputReview = ({ staffId }) => {
    const [ review, setReview ] = useState('');
    const [ reviewStarts, setReviewStars ] = useState(1);
    const dispatch = useDispatch();
    const { user, addStaffReviewStatus } = useSelector( s => ({
        user: s.user.user,
        addStaffReviewStatus: s.liveClass.addStaffReviewStatus,
    }) )
    const handleSubmitReview = useCallback( () => {
        const data = {
            user: user._id,
            rating: reviewStarts || 0,
            review,
            staff: staffId
        }
        dispatch(addStaffReviewAction(data));
    },[review, staffId, user, reviewStarts, dispatch]);

    useEffect( () => {
        if(addStaffReviewStatus === STATUS.SUCCESS){
            setReview('');
            setReviewStars(1);
            dispatch(resetAddReviewStatusAction());
        }
    },[addStaffReviewStatus, dispatch]);

    useEffect( () => {
        setReview('');
        setReviewStars(1);
    },[staffId, setReview, setReviewStars])
    return (
        <Box mt={4} mb={8}>
            <Textarea onChange={ e => setReview(e.target.value) } value={review} rows={6} placeholder='type review'/>
            <Box my={4}>
                <StarsReview setReviewStars={setReviewStars} reviewStarts={reviewStarts}/>
            </Box>
            <Flex mt={4} justify='center'>
                <Button w='full' isLoading={addStaffReviewStatus === STATUS.FETCHING} onClick={handleSubmitReview} colorScheme='green'>Submit review</Button>
            </Flex>
        </Box>
    )
}

const StudentFeedback = ({ review }) => {
    return (
        <Box>
            <Flex>
                <Avatar size='sm' name={review.user.name} src={review.user.avatar}/>
                <Box mt={1} ml={2}>
                    <Heading size='sm'><Text noOfLines={1}>{review.user.name}</Text></Heading>
                    <Box fontSize='sm' color='gray.600'>
                        { review.review }
                    </Box>
                    <Box mt={1}>
                        <Rating stars={review.rating} />
                    </Box>
                </Box>
            </Flex>
        </Box>
    )
}

export const Rating = ({ stars }) => {

    const rating = useMemo( () => Math.round(stars || 0), [stars]);
    return (
        <HStack>
            {
                map(new Array(rating), (s, i) => <Box color={'yellow.400'}><AiFillStar key={s}/></Box>)
            }
            {
                map(new Array( 5 - rating), s => <Box color={'gray.300'}><AiFillStar/></Box>)
            }
        </HStack>
    )
}