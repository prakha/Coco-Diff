import { Button, IconButton } from '@chakra-ui/button'
import { SearchIcon } from '@chakra-ui/icons'
import { Input } from '@chakra-ui/input'
import { Divider, HStack, Text, VStack } from '@chakra-ui/layout'
import { Box } from '@chakra-ui/layout'
import React, { useEffect, useState } from 'react'
import ReactPlayer from 'react-player'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useLocation, useParams } from 'react-router'
import { addCommentAction, addLikeAction, getCommentsAction, getContentReactionAction, getRepliesAction, getSingleCourseAction, reactContentAction, removeCmntAction, updateCommentAction } from '../../redux/reducers/courses'
import { AiFillCaretDown, AiFillDislike, AiFillLike, AiFillVideoCamera, AiOutlineCaretUp, AiOutlineDelete, AiOutlineEdit } from 'react-icons/ai'
import { ErrorChecker } from '../../Components/ErrorChecker'
import { STATUS } from '../../App/Constants'
import _ from 'lodash'
import { ModalBody, ModalCloseButton, ModalHeader, Modal, ModalOverlay, ModalContent } from '@chakra-ui/modal'
import ReactPaginate from 'react-paginate'
import { InputBox } from '../../Components/InputBox'
import {VideoPlayer} from '../../Components/VideoPlayer'
import { BsArrowReturnRight } from 'react-icons/bs'
import { Comments } from './Comments'
import { getFoldersAction, getLibraryAction } from '../../redux/reducers/library'
import { HiThumbDown, HiThumbUp } from 'react-icons/hi'

export const VideoPortal = () => {
    const dispatch = useDispatch()
    const params = useParams()
    const location = useLocation()

    const {user, courseList, getPkgContentsStatus, addCommentStatus, commentsList, getCommentsStatus, getContentReactionStatus, contentReactions,
        removeCmntStatus, addLikeStatus, commentRepliesList, getRepliesStatus, updateCommentStatus, reactContentStatus, getLibraryStatus, getFoldersStatus,
        libraryContent, folderContent
    } = useSelector((state) => ({
        courseList:state.package.packageContents?.courses,
        getPkgContentsStatus:state.package.getPkgContentsStatus,
        addCommentStatus:state.course.addCommentStatus,
        commentsList: state.course.commentsList,
        getCommentsStatus:state.course.getCommentsStatus,
        user:state.user,
        removeCmntStatus:state.course.removeCmntStatus,
        addLikeStatus:state.course.addLikeStatus,
        commentRepliesList:state.course.commentRepliesList,
        getRepliesStatus:state.course.getRepliesStatus,
        updateCommentStatus:state.course.updateCommentStatus,
        getContentReactionStatus:state.course.getContentReactionStatus,
        contentReactions:state.course.contentReactions,
        reactContentStatus:state.course.reactContentStatus,
        getLibraryStatus:state.library.getLibraryStatus,
        libraryContent:state.library.libraryContent,
        getFoldersStatus:state.library.getFoldersStatus,
        folderContent:state.library.folderContent,
    }))

    const [currentSubj, setCurrentSubj] = useState()
    const [userComment, changeComment] = useState('')
    const [currentComment, setCurrentCmnt] = useState()
    const [replyComment, setReplyCmnt] = useState()
    const [commentReply, setCmntReply] = useState()
    const [showReply, changeShowReply] = useState([])
    let [allNestedCmnts, changeNestedCmnts] = useState([])
    let [currentVideo, setCurrentVideo] = useState()

    const urlSearchParams = new URLSearchParams(location.search)
    let courseId = urlSearchParams.get('courseId')
    let subjectId = urlSearchParams.get('subjectId')
    let libraryId = urlSearchParams.get('libraryId')
    let folderId = urlSearchParams.get('folderId')
    
    // const currentVideo = currentSubj?.content.videos?.length && _.findIndex(currentSubj.content.videos,v => v._id == params.videoId) != -1 ?
    //     _.find(currentSubj.content.videos,v => v._id == params.videoId) : null

    useEffect(() => {
        if(courseId){
            if(getPkgContentsStatus==STATUS.SUCCESS && courseList?.length){
                let crc = _.find(courseList,c => c._id == courseId)
                setCurrentSubj(_.find(crc.subjects,s => s._id == subjectId))
            }
        }
        else if(folderId){
            dispatch(getFoldersAction({folderId:params.folderId}))
        }
        else{
            dispatch(getLibraryAction())
        }
    }, [courseId, libraryId, folderId])

    useEffect(() => {
        let video = null
        if(currentSubj && courseId){
            video = currentSubj?.content.videos?.length && _.findIndex(currentSubj.content.videos,v => v._id == params.videoId) != -1 ?
                _.find(currentSubj.content.videos,v => v._id == params.videoId) : null
        }else if(libraryId && getLibraryStatus == STATUS.SUCCESS ){
            video = libraryContent?.videos?.length && _.findIndex(libraryContent.videos,v => v._id == params.videoId) != -1 ?_.find(libraryContent.videos,v => v._id == params.videoId) : null
        }else if(folderId && getFoldersStatus == STATUS.SUCCESS){
            video = folderContent?.videos?.length && _.findIndex(folderContent.videos,v => v._id == params.videoId) != -1 ?_.find(folderContent.videos,v => v._id == params.videoId) : null
        }

        setCurrentVideo(video)
    }, [currentSubj, getLibraryStatus, getFoldersStatus, courseId, libraryId, folderId])

    useEffect(() => {
        if(currentVideo){
            dispatch(getContentReactionAction({contentId:currentVideo.data._id, itemId:params.courseId}))
        }
    }, [currentVideo])

    useEffect(() => {
        if(addCommentStatus == STATUS.SUCCESS)
            changeComment('')
    }, [addCommentStatus])

    const _changeComment = (e) => {
        changeComment(e.target.value)
    }

    const submitComment = () => {
        dispatch(addCommentAction({comment:userComment, itemModel:'Video', itemId:currentVideo.data._id}))
        setCurrentCmnt()
    }

    const clearComment = () => {
        changeComment('')
    }

    const _replyComment = (cmnt) => {
        setReplyCmnt(cmnt)
    }

    const changeCmntReply = (e) => {
        setCmntReply(e.target.value)
    }

    const submitCmntReply = (id) => {
        dispatch(addCommentAction({parentComment:id, comment:commentReply, video:currentVideo.data._id}))
        setCurrentCmnt(id)
    }

    const _showReply = (id, active, page) => {
        if(!active)
            dispatch(getRepliesAction({commentId:id, limit:10, page:page || 1}))
        
        let replies = showReply
        replies = _.xor(replies, [id])
        changeShowReply(replies)
    }

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

    const toTree = (data, pid = null) => {
        return data.reduce((r, e) => {
            if (e.parentComment?._id == pid) {
                const obj = { ...e };
                const children = toTree(data, e._id);
                if (children.length) obj.children = children;
                r.push(obj);
            }
            return r
        }, [])
    }

    useEffect(() => {
        if(getCommentsStatus == STATUS.SUCCESS && commentsList){
            if(getRepliesStatus == STATUS.SUCCESS || addCommentStatus == STATUS.SUCCESS || updateCommentStatus == STATUS.SUCCESS || 
                removeCmntStatus == STATUS.SUCCESS || addLikeStatus == STATUS.SUCCESS){
                let data = commentsList ? commentsList.docs : []
                changeNestedCmnts(_.orderBy(toTree(data), ['createdAt'], ['desc']))
            }
        }
    }, [getRepliesStatus, getCommentsStatus, addCommentStatus, commentsList, updateCommentStatus, removeCmntStatus, addLikeStatus])
    
    const loadMoreReplies =(id, page) => {
        dispatch(getRepliesAction({commentId:id, limit:10, page:page || 1}))
    }

    function CommentBox({ cmnt, liked, disliked, active, time, activeReplies }) {
        const nestedComments = (_.orderBy(cmnt.children, ['createdAt'], ['desc']) || []).map(comment => {
            let repliesList =  comment.children?.length ? comment.children : []
            let repTime = convertTime(comment.createdAt)
            let repLiked = comment.likes?.length && _.findIndex(comment.likes,l => l._id == user.user._id) != -1
            let repDisliked = comment.dislikes?.length && _.findIndex(comment.dislikes,l => l._id == user.user._id) != -1
            let repActive = currentComment == comment._id
            let repActiveReplies = _.findIndex(showReply,r => r == comment._id) != -1
            
            return <CommentBox key={comment._id} cmnt={comment} activeReplies={repActiveReplies} type="child" repliesList={repliesList} liked={repLiked} disliked={repDisliked} active={repActive} time={repTime} />
        })
      
        return (
            <Box key={cmnt._id}>
                <Box borderLeft='3px solid #CCD1D1' pl={3}>
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
                    <Text color='#5D6D7E' my='1'>
                        {cmnt.comment}
                    </Text>
                </Box>
                <HStack>
                    <HStack>
                        <Button onClick={() => liked ? rmvCommentLike(cmnt._id) : likeComment(cmnt._id)} variant='ghost' size='sm' isLoading={active && addLikeStatus == STATUS.FETCHING}>
                            <HiThumbUp color={liked ? "primaryBlue.400" : '#767676'} fontSize='16px' cursor='pointer'/> 
                        </Button>
                        <Text>{cmnt.likes.length} &nbsp;</Text>
                    </HStack>
                    <HStack>
                        <Button onClick={() =>disliked ? rmvCommentDislike(cmnt._id) : dislikeComment(cmnt._id)} variant='ghost' size='sm' isLoading={active && addLikeStatus == STATUS.FETCHING}>
                            <HiThumbDown color={disliked ? "primaryBlue.400" : '#767676'} fontSize='16px' cursor='pointer'/> 
                        </Button>
                        <Text>{cmnt.dislikes.length}</Text>
                    </HStack>
                    
                    <HStack>
                        <Button onClick={() => _replyComment(cmnt)} fontWeight='bold' size='sm' color='rgba(118, 118, 118, 1)' variant='ghost'>REPLY</Button>
                        {/* <Text>{cmnt.children?.length || ''}</Text> */}
                    </HStack>
                </HStack>
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
        )
    }

    const changePage = (e) => {
        setCurrentPage(e.selected + 1)
        dispatch(getCommentsAction({type:'video', contentId:currentVideo?._id, limit:10, page:e.selected + 1}))
    }

    let likedStatus = contentReactions && _.findIndex(contentReactions.likes,l => l._id == user.user._id) != -1
    let dislikedStatus = contentReactions && _.findIndex(contentReactions.dislikes,l => l._id == user.user._id) != -1

    const likeVideo = () => {
        let data = {itemId:params.courseId, contentId:currentVideo._id, onModel:'Course', path:'likes'}
        if(likedStatus){
            dispatch(reactContentAction({...data, remove:true}))
        }
        else{
            dispatch(reactContentAction(data))
                    
        }
    }

    const dislikeVideo = () => {
        let data = {itemId:params.courseId, contentId:currentVideo?._id, onModel:'Course', path:'dislikes'}
        if(dislikedStatus)
            dispatch(reactContentAction({...data, remove:true}))
        else{
            dispatch(reactContentAction(data))
        }
    }

    return(
        <Box>
            <HStack p={3} justifyContent='space-between' borderRadius='5px' bg='lightGrayBlue'>
                <HStack ml={4}>
                    <Box p={3} color={'white'} bg='white' borderRadius='50%'>
                        <AiFillVideoCamera color='#DB4437' fontSize='26px'/>
                    </Box>
                    <Box pl={2}>
                        <Text fontSize="lg" fontWeight='bold'>View Video</Text>
                    </Box>
                </HStack>
            </HStack>
            <br/>
            <ErrorChecker status={getPkgContentsStatus}>
            <ErrorChecker status={getContentReactionStatus}>
                {getPkgContentsStatus == STATUS.SUCCESS && getContentReactionStatus == STATUS.SUCCESS && currentVideo? 
                    <HStack align='stretch' spacing={4}>
                        <Box bg='white' w='70%' p ={5} pos='relative' boxShadow='0pt 3pt 6pt rgba(221, 230, 237, 0.6)'>
                            <Box>
                                <VideoPlayer video={currentVideo}/>
                            </Box>
                            <br/>
                            <Box my={2} key={currentVideo._id}>
                                <Text fontWeight='bold' fontSize='25px'>{currentVideo.name}</Text>
                                <br/>
                                <HStack justifyContent='space-between'>
                                    <Text color='#566573'></Text>
                                    <HStack spacing={6}>
                                        <HStack>
                                            <IconButton onClick={likeVideo} variant='ghost' isLoading={reactContentStatus == STATUS.FETCHING} 
                                                icon={<AiFillLike cursor='pointer' fontSize='25px' color={likedStatus ? "primaryBlue.400" : ''}/>} 
                                                size='sm'
                                            /> 
                                            <Text>{contentReactions?.likes.length || 0}</Text>
                                        </HStack>
                                        <HStack>
                                            <IconButton onClick={dislikeVideo} variant='ghost' isLoading={reactContentStatus == STATUS.FETCHING} 
                                                icon={<AiFillDislike cursor='pointer' fontSize='25px' color={dislikedStatus ? "primaryBlue.400" : ''} />} 
                                                size='sm'
                                            /> 
                                            <Text>{contentReactions?.dislikes.length || 0}</Text>
                                        </HStack>
                                        {/* <HStack><FaShare fontSize='22px'/> <Text>SHARE</Text></HStack> */}
                                    </HStack>
                                </HStack>
                                
                                <Divider my={4}/>
                                
                                <Text fontWeight='bold'>{allNestedCmnts.length} COMMENTS</Text>
                                <br/>
                                <Input variant="flushed" value={userComment} onChange={_changeComment} placeholder='Add a public comment...'/>
                                <HStack spacing={4} my={2} justifyContent='flex-end' width='100%'>
                                    <Button variant='outline' size='sm' onClick={clearComment} borderRadius={0} colorScheme='blue'>CANCEL</Button>
                                    <Button variant="solid" size='sm' isLoading={addCommentStatus == STATUS.FETCHING && !replyComment} onClick={submitComment} borderRadius={0} colorScheme='blue'>COMMENT</Button>
                                </HStack>
                                
                                <br/>
                                <Comments type='video' currentContent={currentVideo}/>
                            </Box>
                        </Box>
                        <Box bg='white' w='30%' p ={5} borderRadius={12} boxShadow='0pt 3pt 6pt rgba(221, 230, 237, 0.6)'>
                            <Suggestions videos={_.filter(currentSubj.content.videos,v => v._id != params.videoId)}/>
                        </Box>
                    </HStack>
                    :
                    <Text>Something went wrong</Text>
                }
            </ErrorChecker>
            </ErrorChecker>
        </Box>
    )
}

const Suggestions = ({videos}) => {
    let history = useHistory()
    let params = useParams()

    const [videosList, changeVideosList] = useState(videos)
    const openVideo = (id) => {
        history.push(`/dashboard/courses/${params.courseId}/videos/${params.subjectId}/${id}`)
    }

    const searchVideo = (e) => {
        let data = _.filter(videos, d => _.includes(_.toLower(d.name), _.toLower(e.target.value)))
        changeVideosList(data)
    }

    return(
        <Box>
            <Text fontSize='heading' fontWeight='600'>List of Topics</Text>
            <Box my={2}>
                <InputBox placeholder='Search' key={params.videoId} onChange={searchVideo} icon={<SearchIcon/> }/>
            </Box>
            <br/>

            <VStack spacing={10} align='stretch'>
                {videosList.length ? 
                    videosList.map(vid => 
                        <HStack key={vid._id} cursor='pointer' alignItems='stretch' onClick={() => openVideo(vid._id)}>
                            <Box w='40%' pos='relative'>
                                <Box pos='absolute' top={0} bottom={0} right={0} left={0}></Box>
                                <ReactPlayer light={true} width='100%' height='100%' url={vid.data.url}/>
                            </Box>
                            <Box w='60%'>
                                <b>{vid.name}</b>
                                {/* <Text fontSize='sm' color='#566573'>1 month ago</Text> */}

                            </Box>
                        </HStack>
                    )
                    :
                    null
                }
            </VStack>
        </Box>
    )
}