import { SearchIcon } from '@chakra-ui/icons'
import { Divider, Heading, HStack, List, ListItem, Text, VStack, Tag, Button, IconButton, Progress, Image, Tooltip, 
    Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay
} from '@chakra-ui/react'
import { Box } from '@chakra-ui/layout'
import React, { useEffect, useMemo, useState } from 'react'
import ReactPlayer from 'react-player'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useLocation, useParams } from 'react-router'
import {  getCommentsAction, getContentReactionAction, getPublicContentAction, getSubjContentAction, reactContentAction } from '../../redux/reducers/courses'
import { AiFillDislike, AiFillLike, AiFillVideoCamera, AiOutlineEye, AiOutlineFilePdf } from 'react-icons/ai'
import { ErrorChecker } from '../../Components/ErrorChecker'
import { STATUS } from '../../App/Constants'
import _ from 'lodash'
import { InputBox } from '../../Components/InputBox'
import {VideoPlayer} from '../../Components/VideoPlayer'
import { getLibraryAction } from '../../redux/reducers/library'
import { getBkmrkFilesAction, getBookmarkAction } from '../../redux/reducers/bookmarks'
import { DiscussionComments } from '../DiscussionCommunity/DiscussionComments'
import { HiThumbDown, HiThumbUp } from "react-icons/hi";
import { CgSortAz } from "react-icons/cg";
import { Popover, PopoverBody, PopoverContent, PopoverTrigger } from '@chakra-ui/popover'
import { SectionHeader } from '../../Components/SectionHeader'
import { bilingualText } from '../../utils/Helper'
import { VscFilePdf } from 'react-icons/vsc'
import { getJwVideoThumbnail, getVideoThumbnailById, getVimeoThumb } from '../Contents/VideoFiles'
import {  } from '@chakra-ui/image'
import { useTrackContent } from '../../Components/useTrackContent'
import moment from 'moment'
import { BsBookmark, BsFillBookmarkFill } from 'react-icons/bs'
import { MoveToBookmarkModal } from '../Contents/MoveToBookmarkModal'
import { removeFromBkmrkAction } from '../../redux/reducers/bookmarks'
import { checkLibContent } from '../Contents/AudioFiles'
import { BiNotepad } from "react-icons/bi";
import { NotesModal } from '../../Components/NotesModal'

export const VideoPortal = () => {
    const dispatch = useDispatch()
    const params = useParams()
    const location = useLocation()
    const history = useHistory()

    const {user, courseList, getPkgContentsStatus, getContentReactionStatus, contentReactions, packagesList, subjectContent,
        reactContentStatus, getLibraryStatus, getPublicContentStatus, libraryContent, getBookmarkStatus, 
        bookmarkContent, publicContent, getBkmrkFilesStatus, bkmrkFiles, removeFromBkmrkStatus, addToBookmarkStatus
    } = useSelector((state) => ({
        courseList:state.package.packageContents?.courses,
        getPkgContentsStatus:state.package.getPkgContentsStatus,
        user:state.user, getBkmrkFilesStatus:state.bookmark.getBkmrkFilesStatus,
        getContentReactionStatus:state.course.getContentReactionStatus,
        bkmrkFiles:state.bookmark.bkmrkFiles,
        contentReactions:state.course.contentReactions,
        reactContentStatus:state.course.reactContentStatus,
        getLibraryStatus:state.library.getLibraryStatus,
        libraryContent:state.library.libraryContent,
        getBookmarkStatus:state.bookmark.getBookmarkStatus,
        bookmarkContent:state.bookmark.bookmarkContent,
        getPublicContentStatus:state.course.getPublicContentStatus,
        publicContent:state.course.publicContent,
        packagesList:state.package.packagesList,
        subjectContent:{data:state.course.subjectContent, status:state.course.getSubjContentStatus},
        removeFromBkmrkStatus:state.bookmark.removeFromBkmrkStatus,
        addToBookmarkStatus:state.bookmark.addToBookmarkStatus
    }))

    const [currentSubj, setCurrentSubj] = useState()
    const [currentCourse, setCurrentCourse] = useState()
    let [currentVideo, setCurrentVideo] = useState()
    const [suggestions, setSuggestions] = useState([])

    const urlSearchParams = new URLSearchParams(location.search)
    let courseId = urlSearchParams.get('courseId')
    let subjectId = urlSearchParams.get('subjectId')
    // let libraryId = urlSearchParams.get('libraryId')
    // let bookmarkId = urlSearchParams.get('bookmarkId')
    let folderId = urlSearchParams.get('folderId') == 'undefined' || urlSearchParams.get('folderId') == 'null' ? null : urlSearchParams.get('folderId')
    let fileId = urlSearchParams.get('fileId')
    let libType = urlSearchParams.get('libType')
    let mediaType = urlSearchParams.get('type')
    let demoCourseId = urlSearchParams.get('demoCourseId')
    let packageId = urlSearchParams.get('packageId')

    const checkSubjectContent = (id) => {
        if(subjectContent?.data?.length){
            return _.findIndex(subjectContent.data,s => s.contentId === id ) != -1
        }
    }

    useEffect(() => {
        if(getBkmrkFilesStatus != STATUS.SUCCESS)
            dispatch(getBkmrkFilesAction({libType: 'Bookmark'}))
    }, [getBkmrkFilesStatus])

    useEffect(() => {
        if(libType){
            if(libType == 'Library')
                dispatch(getLibraryAction({folderId:folderId}))
            else
                dispatch(getBookmarkAction({folderId:folderId}))
        }
    }, [libType, dispatch])

    useEffect(() => {
        if(demoCourseId){
            dispatch(getPublicContentAction({courseIds:[demoCourseId]}))
        }else if(subjectId && courseId){
                    
            if(!checkSubjectContent(subjectId))
                dispatch(getSubjContentAction({id:subjectId}))
            
            if(courseList?.length){
                let crc = _.find(courseList,c => c._id == courseId)
                setCurrentSubj(_.find(crc.subjects,s => s.content._id == subjectId))
                setCurrentCourse(crc)
            }
        }
    }, [courseId, folderId, courseList, dispatch, subjectId, demoCourseId])

    useEffect(() => {
        let video = null
        if(subjectContent.status === STATUS.SUCCESS && subjectContent?.data?.length){
            let subj = _.find(subjectContent.data,d => d.contentId == subjectId)
            video = subj && subj.videos?.length ? _.find(subj.videos,v => v.data?._id === params.videoId) : null 
            setSuggestions(subj?.videos)   
            setCurrentVideo(video)
        }
    }, [subjectId, params.videoId, courseId, subjectContent?.status, subjectContent?.data])

    useEffect(() => {
        let video = null
        if(libType && (getLibraryStatus === STATUS.SUCCESS || getBookmarkStatus === STATUS.SUCCESS) ){
            let data = libType == 'Library' ? libraryContent : bookmarkContent
            video = data?.files?.length && _.findIndex(data.files,v => v._id == fileId) != -1 ?_.find(data.files,v => v._id == fileId) : null
            video = {...video, data:video?.fileDataId}
            setCurrentVideo(video)
        }
    }, [getLibraryStatus, getBookmarkStatus, libType, fileId, libraryContent, bookmarkContent])

    useEffect(() => {
        let video = null
        if(demoCourseId && subjectId && getPublicContentStatus === STATUS.SUCCESS){
            let subj = publicContent.subjects?.length ? _.find(publicContent.subjects,s => s.content === subjectId) : null
            video = subj?.videos?.length ? _.find(subj.videos,v => v.data?._id === params.videoId) : null
            setCurrentVideo(video)
        }
    }, [params.videoId, getPublicContentStatus, publicContent])

    useEffect(() => {
        if(currentVideo){
            dispatch(getContentReactionAction({contentId:currentVideo?._id, itemId:courseId || demoCourseId || currentVideo.courseId}))
        }
    }, [courseId, currentVideo, dispatch])

    let likedStatus = contentReactions && _.findIndex(contentReactions.likes,l => l._id == user.user._id) != -1
    let dislikedStatus = contentReactions && _.findIndex(contentReactions.dislikes,l => l._id == user.user._id) != -1

    const likeVideo = () => {
        let data = {itemId:courseId || demoCourseId || currentVideo.courseId, contentId:currentVideo?._id, onModel:'Course', path:'likes', contentModel:'Video'}
        
        if(likedStatus){
            dispatch(reactContentAction({...data, remove:true}))
        }
        else{
            dispatch(reactContentAction(data))                    
        }
    }

    const dislikeVideo = () => {
        let data = {itemId:courseId || demoCourseId || currentVideo.courseId, contentId:currentVideo?._id, onModel:'Course', path:'dislikes', contentModel:'Video'}
        if(dislikedStatus)
            dispatch(reactContentAction({...data, remove:true}))
        else{
            dispatch(reactContentAction(data))
        }
    }

    const [sortType, setSortType] = useState()
    const sortCmnts = (type) => {
        setSortType(type)
    }

    const [breadcrumbs, setBreadCrumbs] = useState([])

    useEffect(() => {
        if(currentCourse && currentSubj && currentVideo){
            let data = [
                {title:'Home', link:'/'},
                {title:'Courses', link:'/dashboard/courses'},
                {title:currentCourse.name, link:'/dashboard/courses/'+currentCourse._id+'/videos/'+currentSubj.content._id},
                {title:currentVideo?.name}
            ]
            setBreadCrumbs(data)
        }else if(demoCourseId && getPublicContentStatus === STATUS.SUCCESS){
            let pkg = _.find(packagesList,p => p._id === packageId)
            let data =[
                {title:'Home', link:'/'},
                {title:bilingualText(pkg ? pkg?.name : {}), link:'/package?id='+packageId},
                {title:publicContent?.name, link:`/demo-content/${packageId}/${demoCourseId}/${subjectId}`},
                {title:currentVideo?.name}
            ]
            setBreadCrumbs(data)
        }
    }, [currentCourse, currentSubj, currentVideo, demoCourseId, packagesList, publicContent])

    useEffect(() => {
        if(currentVideo && (libraryContent || bookmarkContent)){
            let data = []
            if(libType=='Library'){
                let fldrId = folderId || 'root'
                data = [
                    {title:'Home', link:'/'},
                    {title:'Library', link:'/dashboard/Library/root/videos'},
                    {title:currentVideo?.name},
                ]
                
                if(libraryContent?.folder) 
                    data.splice(2, 0, {title:libraryContent.folder.folderName, link:'/dashboard/Library/'+fldrId +'/videos'})
            }else if(libType=='Bookmark'){
                let fldrId = folderId || 'root'
                data = [
                    {title:'Home', link:'/'},
                    {title:'Bookmark', link:'/dashboard/Bookmark/root/videos'},
                    {title:currentVideo?.name},
                ]
    
                if(bookmarkContent?.folder) 
                    data.splice(2, 0, {title:bookmarkContent.folder.folderName, link:'/dashboard/Bookmark/'+folderId+'/videos'})
            }
            setBreadCrumbs(data)
        }
    }, [folderId, currentVideo, libraryContent, bookmarkContent])

    const [docModal, openDocModal] = useState()
    const downloadDoc = () => {
        openDocModal(!docModal)
    }

    const [moveToBookmarkModal, toggleMoveToBookmarkModal] = useState()

    const addToBookmark =() => {
        toggleMoveToBookmarkModal(moveToBookmarkModal ? null : {...currentVideo, subject:subjectId})
    }

    const removeBookmark = () => {
        let id = _.find(bkmrkFiles,f => f.fileDataId === currentVideo.data._id || f.fileDataId?._id === currentVideo.data._id)?._id
        dispatch(removeFromBkmrkAction({fileId:id}))
    }

    const [notesModal, openNotesModal] = useState()

    const handleNotesModal = () => {
        openNotesModal(!notesModal)
    }

    return(
        <Box>
            <SectionHeader title={currentVideo?.name} breadcrumbs={breadcrumbs}/>
            {/* <HStack p={3} justifyContent='space-between' borderRadius='5px' bg='lightGrayBlue'>
                <HStack ml={4}>
                    <Box p={3} color={'white'} bg='white' borderRadius='50%'>
                        <AiFillVideoCamera color='#DB4437' fontSize='26px'/>
                    </Box>
                    <Box pl={2}>
                        <Text fontSize="lg" fontWeight='bold'>Video</Text>
                    </Box>
                </HStack>
            </HStack> */}
            <ErrorChecker status={getPkgContentsStatus || getLibraryStatus || getPublicContentStatus || subjectContent?.status}>
            <ErrorChecker status={getContentReactionStatus}>
            {console.log('status', subjectContent, getContentReactionStatus, currentVideo, getBkmrkFilesStatus)}
            <ErrorChecker status={getBkmrkFilesStatus}>
                {(getPkgContentsStatus === STATUS.SUCCESS || getLibraryStatus === STATUS.SUCCESS || getPublicContentStatus === STATUS.SUCCESS || subjectContent?.status === STATUS.SUCCESS) && 
                    getContentReactionStatus === STATUS.SUCCESS && currentVideo && getBkmrkFilesStatus === STATUS.SUCCESS ? 
                    <HStack align='stretch' spacing={4}>
                        <Box bg='white' w='70%' p ={3} pos='relative' boxShadow='0pt 3pt 6pt rgba(221, 230, 237, 0.6)'>
                            <Box>
                                <VideoPlayer video={currentVideo}/>
                            </Box>
                            <br/>
                            <Box my={1} key={currentVideo._id}>
                                <Heading fontSize='xl'>{currentVideo.name}</Heading>
                                <br/>
                                <HStack justifyContent='space-between'>
                                    <Text ></Text>
                                    <HStack spacing={6}>
                                        <Box>
                                            <Tooltip label='Notes' placement='top'>
                                                <IconButton onClick={handleNotesModal} icon={<BiNotepad fontSize='25px'/>} p={0} variant='ghost'/>
                                            </Tooltip>
                                        </Box>

                                        <ErrorChecker size='sm' status={removeFromBkmrkStatus}>
                                            {checkLibContent(currentVideo.data._id, bkmrkFiles) ? 
                                                <Tooltip label='Remove bookmark' placement='top'>
                                                    <IconButton p={0} onClick={removeBookmark} variant='ghost' isLoading={reactContentStatus == STATUS.FETCHING} 
                                                        icon={<BsFillBookmarkFill cursor='pointer' fontSize='25px'/>} 
                                                        size='xs'
                                                    />
                                                </Tooltip>
                                                :
                                                <Tooltip label='Bookmark' placement='top'>
                                                    <IconButton onClick={addToBookmark} variant='ghost' isLoading={reactContentStatus == STATUS.FETCHING} 
                                                        icon={<BsBookmark cursor='pointer' fontSize='25px'/>} 
                                                    />
                                                </Tooltip>
                                            }
                                        </ErrorChecker>
                                        {currentVideo.docs?.length ? 
                                            <Box>
                                                <Tooltip label='Files' placement='top'>
                                                    <IconButton  p={0} onClick={downloadDoc} variant='ghost' _hover={{color:'red'}}
                                                        icon={<VscFilePdf color="#DC4D4A" cursor='pointer' fontSize='30px' />} 
                                                        size='xs'
                                                    />
                                                </Tooltip> 
                                            </Box>
                                            : null
                                        }
                                        <HStack spacing={5}>
                                            <Tooltip label='Like' placement='top'>
                                                <HStack spacing={1}>
                                                    <IconButton p={0} onClick={likeVideo} variant='ghost' isLoading={reactContentStatus == STATUS.FETCHING} 
                                                        icon={<HiThumbUp cursor='pointer' fontSize='25px' color={contentReactions?.self == 'likes' ? "#3498DB" : '#767676'}/>} 
                                                        size='xs'
                                                    /> 
                                                    <Text fontSize='sm'>{contentReactions?.totalLikes || 0}</Text>
                                                </HStack>
                                            </Tooltip>
                                            <Tooltip label='Dislike' placement='top'>
                                                <HStack spacing={1}>
                                                    <IconButton p={0} onClick={dislikeVideo} variant='ghost' isLoading={reactContentStatus == STATUS.FETCHING} 
                                                        icon={<HiThumbDown cursor='pointer' fontSize='25px' color={contentReactions?.self == 'dislikes' ? "#3498DB" : '#767676'} />} 
                                                        size='xs'
                                                    /> 
                                                    <Text fontSize='sm'>{contentReactions?.totalDislikes || 0}</Text>
                                                </HStack>
                                            </Tooltip>
                                        </HStack>
                                        {/* <HStack><FaShare fontSize='22px'/> <Text>SHARE</Text></HStack> */}
                                    </HStack>
                                </HStack>
                                
                                <Divider my={3}/>
                          
                                <DiscussionComments 
                                    commentsLabel="Discussion Community" 
                                    sortType={sortType} 
                                    showAttachment={true} 
                                    inputStyle="flushed" 
                                    itemId={currentVideo.data?._id}
                                    itemModel={'Video'}
                                    contentId={currentSubj?.content._id}
                                    courseId={courseId}
                                    includeDoubt={1}
                                />

                                {/* <Comments type='video' currentContent={currentVideo}/> */}
                            </Box>
                        </Box>
                        <Box bg='white' w='30%' p={3} borderRadius={12} boxShadow='0pt 3pt 6pt rgba(221, 230, 237, 0.6)'>
                            {suggestions?.length && !demoCourseId ? 
                                <Suggestions videos={_.filter(suggestions,v => v._id != params.videoId)} currentVideo={currentVideo}/>
                                :
                                null
                            }
                        </Box>
                    </HStack>
                    :
                    <Text>Processing...</Text>
                }
            </ErrorChecker>
            </ErrorChecker>
            </ErrorChecker>
            {notesModal ? <NotesModal dataList={suggestions} currentData={currentVideo} visible={notesModal} closeModal={handleNotesModal} /> : null}
            {docModal ? <DocModal visible={docModal} closeModal={downloadDoc} video={currentVideo} /> : null}
            {moveToBookmarkModal ? 
                <MoveToBookmarkModal course={courseId} type={'videos'} 
                    visible={moveToBookmarkModal} file={moveToBookmarkModal} closeModal={addToBookmark}
                /> : null
            }
        </Box>
    )
}

const DocModal = ({visible, closeModal, video}) => {
    return(
        <Modal isOpen={visible} onClose={closeModal} size='2xl'>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Files</ModalHeader>
                <ModalCloseButton />
                <ModalBody px={8} minH='200px'>
                    <List>
                        {video.docs?.length ? 
                            video.docs.map(d => 
                                <ListItem borderRadius={2} mb={1} color='#5D6D7E' background='#F4F6F7' px={2} border='1px solid #D6DBDF' key={d._id}>
                                    <HStack justifyContent='space-between'>
                                        <HStack spacing={3}>
                                            <AiOutlineFilePdf/>
                                            <Text>{d.name}</Text>
                                        </HStack>
                                        <Tooltip label='View' placement='left'>
                                            <IconButton onClick={() => window.open(d.url)} variant='outlined' icon={<AiOutlineEye fontSize='20px'/>}/>
                                        </Tooltip>
                                    </HStack>
                                </ListItem>           
                            ) 
                            : null
                        }
                    </List>
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}

const Suggestions = ({videos, currentVideo}) => {
    let history = useHistory()
    let params = useParams()
    let location = useLocation()
    const urlSearchParams = new URLSearchParams(location.search)

    let courseId = urlSearchParams.get('courseId')
    let subjectId = urlSearchParams.get('subjectId')

    const thumb = (video) => {
        if(video.source ==="jw"){
            return getJwVideoThumbnail(video.value)
        }else if (video.source === 'youtube') {
          return getVideoThumbnailById(video.value);
        } else {
          return getVimeoThumb(video);
        }
    }

    const [videosList, changeVideosList] = useState(videos)
    const openVideo = (id) => {
        history.push(`/dashboard/video/${id}${location.search}`)
    }

    const searchVideo = (e) => {
        let data = _.filter(videos, d => _.includes(_.toLower(d.name), _.toLower(e.target.value)))
        changeVideosList(data)
    }

    let {startTracking} = useTrackContent()

    return(
        <Box>
            <Text fontSize='heading' fontWeight='600'>List of Topics</Text>
            <Box my={2}>
                <InputBox placeholder='Search' key={params.videoId} onChange={searchVideo} icon={<SearchIcon/> }/>
            </Box>
            <br/>

            <VStack spacing={0} align='stretch'>
                <HStack key={currentVideo._id} borderRadius={2} bg='#F0F3F4' p='0.69vw' cursor='pointer' alignItems='stretch'>
                    <Box w='40%'>
                        <Box pos='relative' overflow='hidden'>
                            <Box pos='absolute' top={0} bottom={0} right={0} left={0}></Box>
                            <Image style={{objectFit:'cover'}} src={thumb(currentVideo.data)} fallbackSrc='/images/video-failed.jpg'/>
                            {currentVideo.data.options?.duration ? 
                                <Box pos='absolute' bottom={0} right={0} p={1}>
                                    <Tag size='sm' bg='brand.yellow' p={1} borderRadius={2} color='white' fontWeight='bold'>
                                        <Text fontSize='0.58vw'>{moment.utc(currentVideo.data.options.duration*1000).format('HH:mm:ss')}</Text>
                                    </Tag>
                                </Box>
                                :
                                null
                            }
                        </Box>
                        <Progress size='xs' colorScheme='accent' background='#FCF3CF' borderRadius='10px' value={startTracking(courseId, 'Video', currentVideo._id).progress}/>
                    </Box>
                    <VStack w='60%' justifyContent='space-between' align='stretch'>
                        <Text fontSize='sm' color='#F4BC1E' fontWeight='600'>{currentVideo.name}</Text>
                        {/* <Text fontSize='sm' color='#566573'>1 month ago</Text> */}
                        <Text fontSize='xs' color='brand.green'>Playing...</Text>
                    </VStack>
                </HStack>
                {_.filter(videosList,v => v._id != currentVideo._id).length ? 
                    _.filter(videosList,v => v._id != currentVideo._id).map(vid => 
                        <HStack key={vid._id} borderRadius={2} p='0.69vw' _hover={{background:'#F2F4F4'}} transition='background .3s' cursor='pointer' alignItems='start' 
                            onClick={() => openVideo(vid.data._id)}
                        >
                            <Box w='40%'>
                                <Box pos='relative' overflow='hidden'>
                                    <Box pos='absolute' top={0} bottom={0} right={0} left={0}></Box>
                                    <Image style={{objectFit:'cover'}} src={thumb(vid.data)} fallbackSrc='/images/video-failed.jpg'/>
                                    {vid.data.options?.duration ? 
                                        <Box pos='absolute' bottom={0} right={0} p={1}>
                                            <Tag size='sm' bg='brand.yellow' p={1} borderRadius={2} color='white' fontWeight='bold'>
                                                <Text fontSize='0.58vw'>{moment.utc(vid.data.options.duration*1000).format('HH:mm:ss')}</Text>
                                            </Tag>
                                        </Box>
                                        :
                                        null
                                    }
                                </Box>
                                <Progress colorScheme='accent' background='#FCF3CF' borderRadius='10px' size='xs' value={startTracking(courseId, 'Video', vid._id).progress}/>
                                {/* <ReactPlayer light={true} width='100%' height='100%' url={vid.data.url}/> */}
                            </Box>
                            <Box w='60%'>
                                <Text fontSize='sm'>{vid.name}</Text>
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
