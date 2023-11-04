import { Box, HStack, VStack, Button, Text, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, Tag, Image, ModalBody, Input, IconButton } from '@chakra-ui/react'
import React, { useCallback, useEffect, useState } from 'react'
import { AiFillCaretDown, AiFillDislike, AiFillLike, AiOutlineCaretUp, AiOutlineDelete, AiOutlineEdit } from 'react-icons/ai'
import { BsArrowReturnRight } from 'react-icons/bs'
import ReactPaginate from 'react-paginate'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router'
import { STATUS } from '../../App/Constants'
import { ErrorChecker } from '../../Components/ErrorChecker'
import { addCommentAction, addLikeAction, addReplyAction, getCommentsAction, getContentReactionAction, getRepliesAction, removeCmntAction, resetRepliesAction, updateCommentAction } from '../../redux/reducers/courses'
import {GrAttachment} from 'react-icons/gr'
import Pagination from "@choc-ui/paginator";
import { HiThumbDown, HiThumbUp } from 'react-icons/hi'

export const Comments = ({currentContent, type}) => {
    const dispatch = useDispatch()
    const params = useParams()

    const {user, addCommentStatus, commentsList, getCommentsStatus, addReplyStatus, currentAddedCmnt,
        removeCmntStatus, addLikeStatus, repliesList, getRepliesStatus, updateCommentStatus
    } = useSelector((state) => ({
        addCommentStatus:state.course.addCommentStatus,
        commentsList: state.course.commentsList,
        getCommentsStatus:state.course.getCommentsStatus,
        user:state.user,
        removeCmntStatus:state.course.removeCmntStatus,
        addLikeStatus:state.course.addLikeStatus,
        repliesList:state.course.repliesList,
        getRepliesStatus:state.course.getRepliesStatus,
        updateCommentStatus:state.course.updateCommentStatus,
        addReplyStatus:state.course.addReplyStatus,
        currentAddedCmnt:state.course.currentAddedCmnt
    }))

    const [userComment, changeComment] = useState('')
    const [currentComment, setCurrentCmnt] = useState()
    const [replyComment, setReplyCmnt] = useState()
    const [commentReply, setCmntReply] = useState()
    const [showReply, changeShowReply] = useState()
    const [updateComment, setUpdateComment] = useState()
    let [allComments, changeComments] = useState([])
    let [allNestedCmnts, changeNestedCmnts] = useState([])
    let [currentPage, setCurrentPage] = useState([])

    useEffect(() => {
        if(currentContent){
            dispatch(getCommentsAction({itemId: type == 'Topic' ? currentContent?._id : currentContent?.data?._id, limit:10, page:1}))
        }
    }, [currentContent, dispatch, type])

    useEffect(() => {
        if(getCommentsStatus === STATUS.SUCCESS){
            changeNestedCmnts(commentsList?.docs)
        }
    }, [commentsList?.docs, getCommentsStatus])

    useEffect(() => {
        if(updateCommentStatus === STATUS.SUCCESS)
            setUpdateComment(null)
    }, [updateCommentStatus])

    useEffect(() => {
        if(addCommentStatus === STATUS.SUCCESS){
            setCurrentCmnt('')
            setCmntReply(null) 
            changeComment('')
            setReplyCmnt(null)
        }
    }, [addCommentStatus])

    const toTree = useCallback((data, pid = null) => {
        return data.reduce((r, e) => {
            if (e.parentComment?._id === pid) {
                const obj = { ...e };
                const children = toTree(data, e._id);
                if (children.length) obj.children = children;
                r.push(obj);
            }
            return r
        }, [])
    },[])

    useEffect(() => {
        if(getCommentsStatus == STATUS.SUCCESS && commentsList){
            if(getRepliesStatus == STATUS.SUCCESS || addCommentStatus == STATUS.SUCCESS || updateCommentStatus == STATUS.SUCCESS || 
                removeCmntStatus == STATUS.SUCCESS || addLikeStatus == STATUS.SUCCESS || addReplyStatus == STATUS.SUCCESS){
                let data = commentsList ? commentsList.docs : []
                changeNestedCmnts(_.orderBy(toTree(data), ['createdAt'], ['desc']))
            }
        }
    }, [getRepliesStatus, getCommentsStatus, addCommentStatus, commentsList, updateCommentStatus, removeCmntStatus, addLikeStatus, addReplyStatus, toTree])


    const loadMoreReplies = useCallback((id, page) => {
        dispatch(getRepliesAction({commentId:id, limit:10, page:page || 1}))
    },[dispatch])


    useEffect(() => {
        if(addReplyStatus === STATUS.SUCCESS){
            setReplyCmnt(false)
            if(currentAddedCmnt && showReply !== currentAddedCmnt.parentComment._id){
                loadMoreReplies(currentAddedCmnt.parentComment._id)
                changeShowReply(currentAddedCmnt.parentComment._id)
            }
        }
    }, [addReplyStatus, currentAddedCmnt, loadMoreReplies, showReply])
    

    const convertTime = (d) => {
        let msgDate = new Date(d)
        
        let today = new Date()

        var diffMs = (today - msgDate); 
        var diffHrs = Math.floor((diffMs % 86400000) / 3600000);
        var diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000);

        var diff =(today.getTime() - msgDate.getTime()) / 1000;
        let diffYear = Math.abs(Math.round((diff/(60 * 60 * 24))/365.25))
        let diffMonth = Math.abs(Math.round(diff/(60 * 60 * 24 * 7 * 4)))
        let diffWeeks = Math.abs(Math.round(diff/(60 * 60 * 24 * 7)));
        let diffDays = Math.abs(Math.round(diff/(1000 * 60 * 60 * 24)));
        let time = null

        if(diffYear){
            time = diffYear +' year'
        }else if(diffMonth){
            time = diffMonth +' month'
        }else if(diffWeeks){
            time = diffWeeks +' week'
        }else if(diffDays){
            time = diffDays +' day'
        }else if(diffHrs > 0) {
            time = diffHrs +' hour'
        }else if(diffMins > 0){
            time = diffMins +' minute'
        }else
            time = 'Just Now'

        return time
    }

    // const _showReply = (id, active, page) => {
    //     if(!active)
    //         dispatch(getRepliesAction({commentId:id, limit:10, page:page || 1}))
        
    //     let replies = showReply
    //     replies = _.xor(replies, [id])
    //     changeShowReply(replies)
    // }

    const _showReply = (id, active, page) => {
        let newId = id == showReply ? null : id

        if(newId)
            dispatch(resetRepliesAction())
        if(!active)
            dispatch(getRepliesAction({commentId:id, limit:10, page:page || 1}))
        
        changeShowReply(newId)
    }

    const likeComment =(id) => {
        dispatch(addLikeAction({path:'likes', commentId:id}))
        setCurrentCmnt(id)
    }

    const rmvCommentLike =(id) => {
        dispatch(addLikeAction({path:'likes', remove:true, commentId:id}))
        setCurrentCmnt(id)
    }

    const dislikeComment =(id) => {
        dispatch(addLikeAction({path:'dislikes', commentId:id}))
        setCurrentCmnt(id)
    }

    const rmvCommentDislike =(id) => {
        dispatch(addLikeAction({path:'dislikes', remove:true, commentId:id}))
        setCurrentCmnt(id)
    }

    const removeComment = (id) => {
        dispatch(removeCmntAction({commentId:id}))
        setCurrentCmnt(id)
    }

    const _updateComment = (cnmt) => {
        setUpdateComment(cnmt)
    }

    const _replyComment = (cmnt) => {
        setReplyCmnt(cmnt)
    }

    function CommentBox({ cmnt, liked, disliked, active, time, activeReplies, type }) {
        const nestedComments = (_.orderBy(cmnt.children, ['createdAt'], ['desc']) || []).map(comment => {
            let repliesList =  comment.children?.length ? comment.children : []
            let repTime = convertTime(comment.createdAt)
            let repLiked = comment.self == 'likes'
            let repDisliked = comment.self == 'dislikes'
            let repActive = currentComment == comment._id
            let repActiveReplies = _.findIndex(showReply,r => r == comment._id) != -1
            
            return <CommentBox key={comment._id} cmnt={comment} activeReplies={repActiveReplies} type="child" repliesList={repliesList} liked={repLiked} disliked={repDisliked} active={repActive} time={repTime} />
        })
    
        return (
            <Box key={cmnt._id}>
                <Box pl={3}>
                    <HStack justify='space-between'>
                        <HStack>
                            <Box fontWeight='bold' fontSize="lg" px={3} py={1} borderRadius='50%' bg='rgba(170, 202, 255, 1)'>
                                {_.upperCase(cmnt.user.name.charAt(0)) || 'A'}
                            </Box>
                            <Text fontWeight='bold' fontSize="lg">{cmnt.user.name}</Text>
                            <Box borderLeft='1px solid #CCD1D1' fontSize='sm' color='rgba(66, 133, 244, 1)' pl={4}> {time}</Box>
                        </HStack>
                        {cmnt.user._id == user.user._id ? 
                            <HStack>
                                <Button variant='ghost' size='sm' isLoading={active && removeCmntStatus == STATUS.FETCHING} onClick={() => removeComment(cmnt._id)}>
                                    <AiOutlineDelete cursor='pointer' fontSize='heading'/> 
                                </Button>
                                <Button variant='ghost' size='sm' onClick={() => _updateComment(cmnt)}>
                                    <AiOutlineEdit cursor='pointer' fontSize='heading'/> 
                                </Button>
                            </HStack>
                            : null
                        }
                    </HStack>
                    <div style={{paddingLeft: '4.3%'}}>
                        <Text color='#5D6D7E' my='1'>
                            {cmnt.comment}
                        </Text>
                        <div>
                            {_.map(cmnt.files, f => {
                                return(
                                    f.type === 'images' ?
                                        <Image
                                            key={f._id} 
                                            src={f.url}
                                            alt="attachment"
                                        />
                                    : 
                                        <Tag key={f._id} cursor='pointer' onClick={() => window.open(f.url)}><GrAttachment /> &nbsp;&nbsp;{_.toUpper(f.type)} ATTACHMENT</Tag>

                                )}
                            )}
                        </div>
                    </div>
                </Box>

                <HStack style={{paddingLeft: '5%'}}>
                    <HStack>
                        {/*<Button onClick={() => liked ? rmvCommentLike(cmnt._id) : likeComment(cmnt._id)} variant='ghost' size='sm' isLoading={active && addLikeStatus == STATUS.FETCHING}>*/}
                            <HiThumbUp onClick={() => liked ? rmvCommentLike(cmnt._id) : likeComment(cmnt._id)} color={liked ? "brand.blue" : "#767676"} fontSize='16px' cursor='pointer'/> 
                        {/*</Button>*/}
                        <Text>{cmnt.totalLikes} &nbsp;</Text>
                    </HStack>
                    <HStack>
                        {/*<Button onClick={() =>disliked ? rmvCommentDislike(cmnt._id) : dislikeComment(cmnt._id)} variant='ghost' size='sm' isLoading={active && addLikeStatus == STATUS.FETCHING}>*/}
                            <HiThumbDown onClick={() => disliked ? rmvCommentDislike(cmnt._id) : dislikeComment(cmnt._id)} color={disliked ? "brand.blue" : '#767676'} fontSize='16px' cursor='pointer'/> 
                        {/*</Button>*/}
                        <Text>{cmnt.totalDislikes}</Text>
                    </HStack>
                    {type == 'child' ? null :
                        <HStack>
                            &nbsp;&nbsp;&nbsp;<Text fontSize='14px' cursor='pointer' onClick={() => _replyComment(cmnt)}>Reply</Text>
                            {/*<Button onClick={() => _replyComment(cmnt)} fontWeight='bold' size='sm' color='rgba(118, 118, 118, 1)' variant='ghost'>REPLY</Button>*/}
                            {/* <Text>{cmnt.children?.length || ''}</Text> */}
                        </HStack>
                    }
                </HStack>

                {type == 'child' ? null :
                    <Box style={{paddingLeft: '4.5%'}}>
                        <Button fontSize='12px' color='rgba(66, 133, 244, 1)' onClick={() => _showReply(cmnt._id, activeReplies)} variant='link'>
                            {activeReplies ? <AiOutlineCaretUp/> : <AiFillCaretDown/>}
                            {activeReplies ? 'Hide Replies' : 'View All Replies'}  
                        </Button>
                        {activeReplies ?
                            <ErrorChecker size='md' status={getRepliesStatus}>
                                    {getRepliesStatus == STATUS.SUCCESS ?
                                        <VStack spacing={6} align='stretch' marginTop={2} ml={20}>
                                            {nestedComments}
                                            <Box>
                                                {cmnt.children?.length && cmnt.children[0].pageDetails && cmnt.children[0].pageDetails?.page != cmnt.children[0].pageDetails?.pages ?
                                                    <Button iconSpacing={2} leftIcon={<BsArrowReturnRight/>} color='rgba(66, 133, 244, 1)' fontSize='sm' onClick={() => loadMoreReplies(cmnt._id, cmnt.children[0].pageDetails.page + 1)} variant='link'>
                                                        Show more replies  
                                                    </Button>
                                                    : null
                                                }
                                            </Box>
                                        </VStack>
                                        : null
                                    }
                            </ErrorChecker>
                            :
                            null
                        }
                    </Box>
                }
            </Box>
        )
    }

    const changePage = (e) => {
        setCurrentPage(e)
        dispatch(getCommentsAction({type, itemId: type == 'Topic' ? currentContent?._id : currentContent?.data?._id, limit:10, page:e}))
    }

    return(
        <Box>
            <ErrorChecker status={getCommentsStatus}>
                {getCommentsStatus == STATUS.SUCCESS && allNestedCmnts.length ? 
                    <VStack align='stretch' spacing={6}>
                        {_.filter(_.orderBy(allNestedCmnts, ['createdAt'], ['desc']),c => !c.parentComment).map(cmnt => 
                            {
                                let repliesList =  _.filter(allNestedCmnts,c => c.parentComment && c.parentComment._id == cmnt._id)
                                let time = convertTime(cmnt.createdAt)
                                let liked = cmnt.self == 'likes'
                                let disliked = cmnt.self == 'dislikes'
                                let active = currentComment == cmnt._id
                                let activeReplies = showReply == cmnt._id
                                return(
                                    <CommentBox key={cmnt._id} cmnt={cmnt} activeReplies={activeReplies} 
                                        repliesList={repliesList} time={time}
                                        liked={liked} disliked={disliked} active={active}
                                    />
                                )
                            }
                        )}
                    </VStack>
                    :
                    <Text>No comments added</Text>
                }
            </ErrorChecker>
            {commentsList ? 
                <HStack align='center'>
                    {/*<ReactPaginate previousLabel={"prev"} nextLabel={"next"} breakLabel={"..."} breakClassName={"break-me"}
                        pageCount={commentsList.pages} marginPagesDisplayed={2} pageRangeDisplayed={5}
                        onPageChange={changePage} containerClassName={"pagination"} subContainerClassName={"pages pagination"}
                        activeClassName={"active"} previousClassName={'prevButton'} nextClassName={'nexButton'}
                    />*/}
                    <Pagination
                        current={commentsList.page}
                        total={commentsList.total}
                        pageSize={commentsList.limit}
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

            {replyComment ? <AddCommentModal content={currentContent} type={type} activeComment={showReply} parentComment={replyComment} addReplyStatus={addReplyStatus} closeModal={setReplyCmnt}/> : null} 
            {updateComment ? <UpdateCommentModal updateCommentStatus={updateCommentStatus} comment={updateComment} closeModal={_updateComment} /> : null}   
        </Box>
    )
}

const AddCommentModal = ({parentComment, closeModal, addReplyStatus, activeComment, content, type}) => {
    const dispatch = useDispatch()
    const [currentCmnt, changeComment] = useState()

    // const {addReplyStatus} = useSelector(state => ({
    //     addReplyStatus:state.course.addReplyStatus
    // }))
    
    const _changeComment = (e) => {
        changeComment(e.target.value)
    }

    const submitComment = () => {
        let itemModel = type == 'video' ? 'Video' :type == 'audio' ? 'Audio' : null 
        dispatch(addReplyAction({parentComment:parentComment._id, comment:currentCmnt, itemModel, itemId:content.data._id}))
    }

    const cancelComment = () => {
        closeModal()
    }

    return(
        <Modal isOpen={parentComment} onClose={closeModal} size='4xl'>
            <ModalOverlay/>
            <ModalContent>
                <ModalHeader>Add Reply</ModalHeader>
                <ModalCloseButton/>
                <ModalBody>
                    <Input variant="flushed" value={currentCmnt} onChange={_changeComment}  placeholder='Add reply'/>
                    <HStack spacing={4} my={2} justifyContent='flex-end' width='100%'>
                        <Button variant='outline' size='sm' borderRadius={0} onClick={cancelComment} colorScheme='blue'>CANCEL</Button>
                        <Button variant="solid" isLoading={addReplyStatus == STATUS.FETCHING} size='sm' onClick={submitComment} borderRadius={0} colorScheme='blue'>COMMENT</Button>
                    </HStack>
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}

const UpdateCommentModal = ({comment, closeModal, updateCommentStatus}) => {
    const dispatch = useDispatch()
    const [currentCmnt, changeComment] = useState(comment.comment)

    const _changeComment = (e) => {
        changeComment(e.target.value)
    }

    const submitComment = () => {
        dispatch(updateCommentAction({commentId:comment._id, comment:currentCmnt}))
    }

    const cancelComment = () => {
        closeModal()
    }

    return(
        <Modal isOpen={comment} onClose={closeModal} size='4xl'>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Edit Comment</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Input variant="flushed" value={currentCmnt} onChange={_changeComment}  placeholder='Edit reply'/>
                    <HStack spacing={4} my={2} justifyContent='flex-end' width='100%'>
                        <Button variant='outline' size='sm' borderRadius={0} onClick={cancelComment} colorScheme='blue'>CANCEL</Button>
                        <Button variant="solid" isLoading={updateCommentStatus == STATUS.FETCHING} size='sm' onClick={submitComment} borderRadius={0} colorScheme='blue'>COMMENT</Button>
                    </HStack>
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}