import { SearchIcon } from '@chakra-ui/icons'
import { Image } from '@chakra-ui/image'
import { Box, Flex, HStack, Spacer, Text, VStack, Wrap, WrapItem } from '@chakra-ui/layout'
import React, { useEffect, useState } from 'react'
import { AiOutlineRight } from 'react-icons/ai'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useLocation, useParams } from 'react-router'
import { InputBox } from '../../Components/InputBox'
import { bilingualText } from '../../utils/Helper'
import { MoveFolderModal } from "./MoveFolderModal";
import { ContentPopover } from '../../Components/ContentPopover'
import { CONTENT_TYPE } from '../../Constants'
import { CircularProgress, CircularProgressLabel, Progress } from '@chakra-ui/progress'
import { Tag } from '@chakra-ui/tag'
import { Button } from '@chakra-ui/button'
import _ from 'lodash'
import { getSubjContentAction } from '../../redux/reducers/courses'
import { ErrorChecker } from '../../Components/ErrorChecker'
import { Avatar } from '@chakra-ui/avatar'
import { useLoginModal } from '../../App/useLoginModal'
import { useIsAuthenticated } from '../../App/Context'
import { Input } from '@chakra-ui/react'



export const AudioFiles = ({defaultData, course, subjectContent}) => {
    const params = useParams()
    const history = useHistory()

    const [selectedSubj, setSelectedSubj] = useState()
    const [audioList, setAudio] = useState([])

    useEffect(() => {
        if(params.subjectId && course){
            setSelectedSubj(_.find(course.subjects,s => s.content._id == params.subjectId))
        }
    }, [params, course])

    useEffect(() => {
        let sbj = subjectContent?.data.length && params.subjectId ? _.find(subjectContent.data,s => s.contentId === params.subjectId ) : null
        if(sbj)
            setAudio(sbj.audios)
    }, [params.subjectId, subjectContent])

    const filterAudio = (e) => {
        if(selectedSubj){
            let data = _.filter(selectedSubj.content.audios, d => _.includes(_.toLower(d.name), _.toLower(e.target.value)))
            setAudio(data)
        }
    }

    const selectSubject = (subj) => {
        setSelectedSubj(subj)
    }

    return(
        <Box>
            <br/>
            <HStack align='start' w='100%'>
                
                <SubjectsList course={course} type='audios' selectedSubject={selectSubject}/>
                
                <ErrorChecker status={subjectContent.status}>
                {selectedSubj ? 
                    <Box paddingLeft='20px' background='white' p={4} w='75%'>
                        <HStack justifyContent='space-between' mb={4}>
                            <Text fontSize='heading' fontWeight=''>{selectedSubj.displayName}</Text>
                            <HStack>
                                <Box>
                                    <InputBox onChange={filterAudio} icon={<SearchIcon/>} placeholder='Search' />
                                </Box>
                            </HStack>
                        </HStack>
                        {selectedSubj.template?.chapters?.length ? 
                            _.orderBy(selectedSubj.template.chapters, ['order'], ['asc']).map(ch => 
                                <Box key={ch._id}>
                                    <HStack justify='space-between' p={2} boxShadow='0px 1px 2px #00000040' bg='white'>
                                        <Text fontSize='md'>{bilingualText(ch.chapterId.name)}</Text>
                                        {/* <HStack spacing={1}>
                                            <Button borderRadius='2px' size='sm' background='brand.green' color='white'>Practice Test</Button>
                                            <Button borderRadius='2px' size='sm' background='brand.blue' color='white'>Courses Progress</Button>   
                                        </HStack> */}
                                    </HStack>
                                    <br/>
                                    <Flex align='stretch' flexWrap='wrap' spacing={1} px={4}>
                                        {audioList?.length && _.filter(audioList,v => v.chapterId == ch.chapterId._id).length ?  
                                            _.orderBy(_.filter(audioList,v => v.chapterId == ch.chapterId._id), 'order', 'asc').map(audio => 
                                                <AudioCard key={audio._id} course={course} audio={audio} 
                                                    subject={_.findIndex(defaultData.subjects,s => s._id == selectedSubj.subject) != -1 ? 
                                                            {..._.find(defaultData.subjects,s => s._id == selectedSubj.subject), content:selectedSubj.content}
                                                            :
                                                            null
                                                        }
                                                />
                                            )
                                            :
                                            <Text color='gray.400'>Empty</Text>
                                        }
                                    </Flex>
                                    {/* <Divider marginY='30px'/> */}
                                    <br/><br/>
                                </Box>
                            )
                            :
                            <Text>No data added</Text>
                        }
                    </Box>
                    :
                    null
                }
                </ErrorChecker>
            </HStack>
        </Box>
    )
}

export const SubjectsList = ({course, selectedSubject, type}) => {
    const history = useHistory()
    const params = useParams()
    const dispatch = useDispatch()
    const [searchData, changeSearchData] = useState("")
    const [filterdata, setFilterData] = useState()

    const {trackings, subjectContent} = useSelector(state => ({
        trackings:state.tracking.trackings,
        subjectContent:{data:state.course.subjectContent, status:state.course.getSubjContentStatus}
    }))

    const checkSubjectContent = (id) => {
        if(subjectContent?.data?.length){
            return _.findIndex(subjectContent.data,s => s.contentId === id ) != -1
        }
    }

    useEffect(() => {
        if(!checkSubjectContent(params.subjectId))
            dispatch(getSubjContentAction({id:params.subjectId}))
    }, [params.subjectId])
    
    const selectSubject = (sub) => {
        history.push('/dashboard/courses/'+ params.courseId +'/'+type+'/'+sub.content._id)
        
        if(!checkSubjectContent(params.subjectId))
            dispatch(getSubjContentAction({id:sub.content._id}))
    }

    useEffect( () => {
        const newFilterData = _.orderBy(course.subjects, ['order'], ['asc'])
        .filter(f =>
        _.includes
            (
            _.toUpper(f.displayName),
            _.toUpper(searchData)))
        setFilterData( newFilterData)
    },[ searchData])

    return(
        <VStack bg='white' pb={5} px={2} pos='sticky' top={5} borderRadius='15px' align='stretch' w='25%' boxShadow='rgba(149, 157, 165, 0.1) 0px 2px 24px'>
            <Text fontSize='heading' fontWeight='' py={2}>
                {course.name}
            </Text>
            <Flex jusstifyContent={'flex-end'}>
              <Input
                placeholder="Search"
                style={{ width: "100%", padding:'10px', marginBottom:'10px',marginInline:'10px' }}
                onChange={(e) => changeSearchData(e.target.value)}
              />
            </Flex>
            <VStack maxHeight='50vh' align='stretch' overflow='auto' pr={2} id='scroll-bar'>
                {course.subjects?.length ? 
                    _.map(filterdata, sub =>
                            {
                                let active = params.subjectId == sub.content._id
                                // let profress = CheckSubjProgress({content:sub.content[type], type})
                                return(
                                    <HStack key={sub._id} cursor='pointer' onClick={() => selectSubject(sub)} borderRadius='15px' p='12px'
                                        bg={active ? 'brand.green' : '#F4F7F9'}
                                        color={active ? 'white' : ''}
                                    >
                                        {/* <Box>
                                            <CircularProgress size='40px' color="brand.red" trackColor='yellow.400' background='white' borderRadius='50%' value={profress}>
                                                <CircularProgressLabel color='black'>{_.round(profress) || 0}%</CircularProgressLabel>
                                            </CircularProgress>
                                        </Box> */}
                                        <Box>
                                            <Text fontSize='sm'> 
                                                {sub.displayName}
                                            </Text>
                                            {type == 'audios' ?
                                                <Text fontSize='xs' color={active ? 'white' : '#85929E'}>Total audio: {sub.content.audios?.length || 0}</Text>
                                                :type == 'videos' ?
                                                    <Text fontSize='xs' color={active ? 'white' : '#85929E'}>Total video: {sub.content.videos?.length || 0}</Text>
                                                    :type == 'documents' ?
                                                        <Text fontSize='xs' color={active ? 'white' : '#85929E'}>Total document: {sub.content.documents?.length || 0}</Text>
                                                        : null
                                            }
                                        </Box>
                                        <Spacer/>
                                        <AiOutlineRight fontSize='heading'/>
                                    </HStack>
                                )
                            }
                    ) 
                    :
                    <Text color='gray.400'>No chapters added</Text>
                }
            </VStack>
        </VStack>
    )
} 

export const CheckSubjProgress = ( {content, type} ) => {
    const params = useParams()
    const {trackings} = useSelector(state => ({
        trackings:state.tracking.trackings
    }))
       
    let contentType = CONTENT_TYPE[type === 'audios' ? 'AUDIO' :type === 'videos' ? 'VIDEO' :type === 'documents' ? 'DOCUMENT' : '']
    let contentList = trackings?.[params.courseId]?.[contentType]
    let trackedContentList = trackings?.[params.courseId]?.[contentType] ? 
        _.filter(trackings?.[params.courseId]?.[contentType],d => _.last(d?.objectrackinglogs)?.properties.current) : []
    let skipedContent = _.size(content) - trackedContentList.length
    
    if(contentList && content?.length){
        let trackedData = _.map(content, (a) => contentList[a.data._id])
        let progress  = trackedData?.length ? _.chain(trackedData).map(d => _.last(d?.objectrackinglogs)?.properties).sumBy(d => d?.current).value() : 0
        let total  = trackedData?.length ? _.chain(trackedData).map(d => _.last(d?.objectrackinglogs)?.properties).sumBy(d => d?.size).value() : 0 
        let totalProgress = (_.round(progress)/total)*(100 - (skipedContent ? (((skipedContent)/content.length)*100) : 0))
        
        return totalProgress 
    }
}

export const AudioCard = ({audio, subject, library, bookmark, course, demo}) => {
    const dispatch = useDispatch()
    const history = useHistory()
    const location = useLocation()
    const params = useParams()

    const [currentAudio, setCurrentAudio] = useState()
    const [moveFileModal, toggleMoveFileModal] = useState()
    const [inLibrary, setInLibrary] = useState()
    const [inBkmrk, setInBkmrk] = useState()

    const {libFiles, bkmrkFiles} = useSelector(state => ({
        libFiles:state.library?.libFiles,
        bkmrkFiles:state.bookmark.bkmrkFiles,
    }))

    useEffect(() => {
        if(libFiles){
            let id = audio.data ? audio.data._id : audio.fileDataId?._id
            setInLibrary(checkLibContent( id, libFiles))
        }

        if(bkmrkFiles){
            let id = audio.data ? audio.data._id : audio.fileDataId?._id
            setInBkmrk(checkLibContent( id, bkmrkFiles))
        }
    }, [libFiles, bkmrkFiles])
    
    const addToLibrary =(data) => {
        toggleMoveFileModal(moveFileModal ? null : {...data, subject})
    }

    let courseId = params.courseId || audio.courseId
    let subjectId = params.subjectId || audio.contentId
    
    const trackings = useSelector(s => s.tracking.trackings);

    const audioTrackings = trackings?.[courseId]?.[CONTENT_TYPE.AUDIO]

    const thisTracking = audioTrackings?.[audio._id];
    let finalLog;
    finalLog = thisTracking;
    
    const { toggleLoginModal } = useLoginModal();
    const isAuthenticated = useIsAuthenticated();

    const openAudio = () => {

        if(isAuthenticated){
            let search = null
            if(audio.libType)
                search =  `?courseId=${audio.courseId}&subjectId=${audio.contentId}`
            else if(demo){
                search = `?demoPackageId=${params.packageId}`
                let currentAudio = audio.libType ? audio.fileDataId : audio.data
                return history.push({pathname:'/dashboard/package-demo/audio/'+currentAudio?._id, search})
                // search = `?demoCourseId=${courseId}&packageId=${params.packageId}&subjectId=${params.subjectId}`
            }
            else
                search = `?courseId=${courseId}&subjectId=${subjectId}`
        
            let currentAudio = audio.libType ? audio.fileDataId : audio.data
            history.push({pathname:'/dashboard/audio/'+currentAudio?._id, search})
        }else{
            toggleLoginModal()
        }
        
        // let search = audio.libType ?
        //     `?courseId=${audio.courseId}&subjectId=${audio.contentId}` 
        //         : demo ? `?demoCourseId=${courseId}&packageId=${params.packageId}&subjectId=${subjectId}`
        //             : `?courseId=${courseId}&subjectId=${subjectId}`
        
        // let currentAudio = audio.libType ? audio.fileDataId : audio.data
        // history.push({pathname:'/dashboard/audio/'+currentAudio?._id, search})
    }

    const current = finalLog?.properties?.current || 0;
    const total = finalLog?.properties?.size || 1;

    // let inLibrary = libraryContent?.audios?.length && _.findIndex(libraryContent.audios,v => v.data._id == audio.data._id) != -1
    let daysLeft = course && parseInt((new Date(course?.endDate) - new Date()) / (1000 * 60 * 60 * 24), 10)
    daysLeft = daysLeft ? daysLeft < 1 ? 0 : daysLeft : 0
    return(
        <VStack w='14.93vw' m='0 1.17vw 1.75px 0' bg='white' align='stretch' borderRadius='8px' justifyContent='space-between'
            boxShadow={currentAudio == audio._id ? '0pt 10pt 20pt rgba(0, 0, 0, 0.14)' : '0pt 3pt 6pt rgba(221, 230, 237, 0.8)'}
        >
            <Box>
                <HStack mb={2} onClick={openAudio} cursor='pointer' background='#F4F6F6' justifyContent='center' p={6}>
                    {audioIcon(60)}
                </HStack>
                <HStack px={3} justifyContent='space-between' alignItems='start'>
                    <Text style={{wordWrap:'break-word', width:'10.54vw'}} fontSize={{base:'sm', md: "sm", lg: "md"}}>{audio.name}</Text>
                    {!demo ?
                        <Box>
                            <ContentPopover bookmarkId={inBkmrk} libraryId={inLibrary} course={params.courseId} library={library} bookmark={bookmark} type='audios' subject={subject?.content?._id} data={audio}/>
                        </Box> : null
                    }
                </HStack>
                <br/>
            </Box>
            <Box>
                {subject ?
                    <Box px={3} mb={4}>
                        <Tag fontSize='xs' p={1} background='#F0F4F7' borderRadius='1px' fontWeight='md'>{bilingualText(subject.name)}</Tag>
                    </Box>
                    : audio.subjectId ?
                        <Box px={3} mb={4}>
                            <Tag fontSize='xs' p={1} background='#F0F4F7' borderRadius='1px' fontWeight='md'>{bilingualText(audio.subjectId.name)}</Tag>
                        </Box>
                        :
                        null
                }
                {demo || audio.libType ? null : 
                    <Box p={3} bg='#F7F9F9' fontSize='sm'>
                        <HStack justifyContent='space-between' width='100%'>
                            <Text>{parseInt(((current / total) * 100) > 95 ? 100 : (current / total) * 100)}%</Text>
                            <Text fontWeight='bold' color='green.500'>
                                {finalLog ? finalLog.action == 'PROGRESS' ? ' In Progress' : _.capitalize(finalLog.action) : 'Not Started'}
                            </Text>
                            <Text>Progress</Text>
                        </HStack>
                        <Progress my={1} value={((current / total) * 100).toFixed(1)} borderRadius={10} size="xs" colorScheme="green" />
                        {/* <HStack justifyContent='space-between'>
                            <Text fontSize='12px'>{finalLog ? new Date(finalLog?.createdAt).toLocaleString('en-GB', { timeZone: 'UTC' }) : '00:00:00'}</Text>
                            <Text fontSize='12px'>{course ? (daysLeft + ' Days Left') : null} </Text>
                        </HStack> */}
                    </Box>
                }
            </Box>
        </VStack>
    )
}

export const audioIcon = (size = 50) => {
    return(
        <HStack align='center' justifyContent='center' borderRadius='50%' width={size+'px'} h={size+'px'} bg='brand.redAccent' p={3}>
            <Image src='/images/musical-note.png'/>
        </HStack>
    )
}

export const checkLibContent = (id, libContent) => {
    return libContent?.length && _.findIndex(libContent,f => f.fileDataId === id || f.fileDataId?._id === id ) !== -1 ? 
        _.find(libContent,f => f.fileDataId === id || f.fileDataId?._id === id )._id 
        : false
}