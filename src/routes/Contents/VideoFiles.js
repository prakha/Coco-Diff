import { SearchIcon } from '@chakra-ui/icons'
import { Flex } from '@chakra-ui/layout'
import { Box, HStack, Text, VStack } from '@chakra-ui/layout'
import { Progress } from '@chakra-ui/progress'
import { Tag } from '@chakra-ui/tag'
import _, { orderBy, sortBy } from 'lodash'
import React, { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { useHistory, useParams } from 'react-router'
import { ContentPopover } from '../../Components/ContentPopover'
import { ErrorChecker } from '../../Components/ErrorChecker'
import { InputBox } from '../../Components/InputBox'
import { CONTENT_TYPE } from '../../Constants'
import { bilingualText } from '../../utils/Helper'
import { checkLibContent, SubjectsList } from './AudioFiles'
import { Image } from '@chakra-ui/image'
import { useLoginModal } from '../../App/useLoginModal'
import { useIsAuthenticated } from '../../App/Context'
import { Tooltip } from '@chakra-ui/tooltip'

export const VideoFiles = ({defaultData, course, subjectContent}) => {
    const params = useParams()

    const [selectedSubj, setSelectedSubj] = useState()
    const [videoList, setVideos] = useState([])

    useEffect(() => {
        if(params.subjectId && course){
            setSelectedSubj(_.find(course.subjects,s => s.content._id === params.subjectId))
        }
    }, [params, course])

    useEffect(() => {
        let sbj = subjectContent?.data.length && params.subjectId ? _.find(subjectContent.data,s => s.contentId === params.subjectId ) : null
        if(sbj)
            setVideos(sbj.videos)
    }, [params.subjectId, subjectContent])

    // const selectSubject = (sub) => {
    //     history.push('/dashboard/courses/'+ params.courseId +'/videos/'+sub._id)
    //     setSelectedSubj(sub)
    // }

    const filterVideo = (e) => {
        if(selectedSubj){
            let data = _.filter(selectedSubj.content.videos,d => _.includes(_.toLower(d.name), _.toLower(e.target.value)))
            setVideos(data)
        }
    }

    return(
        <Box>
            <br/>
            <HStack align='start' w='100%'>
                
                <SubjectsList course={course} type='videos'/>
                
                <ErrorChecker status={subjectContent.status}>
                    {selectedSubj ?
                        <Box paddingLeft='20px' w='75%' background='white' p={4}>
                            <HStack justifyContent='space-between' mb={4}>
                                <Text fontSize='heading' fontWeight=''>{selectedSubj.displayName}</Text>
                                <HStack>
                                    <Box>
                                        <InputBox onChange={filterVideo} icon={<SearchIcon/>} placeholder='Search' />
                                    </Box>
                                </HStack>
                            </HStack>

                            {selectedSubj.template?.chapters?.length ? 
                                orderBy(selectedSubj.template.chapters, ['order'], ['asc']).map(ch => {
                                    let chapterVideos = _.filter(videoList,v => v.chapterId === ch.chapterId._id)
                                    return(
                                        <Box key={ch._id}>
                                            <HStack justify='space-between' p={2} boxShadow='0px 1px 2px #00000040' bg='white'>
                                                <Text fontSize='md'>{bilingualText(ch.chapterId.name)}</Text>
                                            </HStack>
                                            <br/>
                                            <Flex align='stretch' flexWrap='wrap' spacing={1} px={4}>
                                                {chapterVideos.length ?  
                                                    orderBy(chapterVideos, 'order', 'asc').map(video => 
                                                            <VideoCard key={video._id} course={course} video={video} 
                                                                subject={_.findIndex(defaultData.subjects,s => s._id === selectedSubj.subject) !== -1 ? 
                                                                    {..._.find(defaultData.subjects,s => s._id === selectedSubj.subject), content:selectedSubj.content}
                                                                    :
                                                                    null
                                                                }
                                                            />
                                                    )
                                                    :
                                                    <Text color='gray.400'>Empty</Text>
                                                }
                                            </Flex>
                                            {/* <Divider m='10px'/> */}
                                            <br/>
                                        </Box>
                                    )
                                })
                                :
                                <Text>No data added</Text>
                            }
                            {/* {videoList?.length ? 
                                <Box>
                                    {_.map(_.groupBy(videoList,v => v.chapterId._id), (chp, i) => 
                                        <Box key={i}>
                                            <Box p={2} boxShadow='0pt 1pt 2pt #00000040' bg='white'>
                                                <Text fontSize="lg" fontWeight='bold'>{bilingualText(chp[0].chapterId.name)}</Text>
                                            </Box>
                                            <br/>
                                            <Wrap spacing={1}>
                                                {chp.map(video => 
                                                    <WrapItem key={video._id}>
                                                        <VideoCard video={video} subject={_.find(defaultData.subjects,s => s._id === selectedSubj.subject)}/>
                                                    </WrapItem>
                                                )}
                                            </Wrap>
                                            <Divider m='10px'/>
                                        </Box>
                                    )}
                                </Box>
                                :
                                <Text color='red.500'>no video file available</Text>
                            } */}
                        </Box>
                        :
                        null
                    }
                </ErrorChecker>
            </HStack>
        </Box>
    )
}

export const getVimeoThumb = data => {
    const thumbs = data?.options?.pictures?.sizes;
    const thumb =
      thumbs &&
      _.find(thumbs, t => {
        return (
          t.height === 360 ||
          t.height === 166 ||
          t.height === 540 ||
          t.height === 720
        );
      });
  
    return thumb && thumb.link;
};

export const getVideoThumbnailById = id => {
    return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
};

export const getJwVideoThumbnail = id => {
    return `https://cdn.jwplayer.com/v2/media/${id}/poster.jpg?width=480`;
};

export const VideoCard = ({video, subject, library, bookmark, demo, course}) => {
    const history = useHistory()
    const params = useParams()
    const [inLibrary, setInLibrary] = useState()
    const [inBkmrk, setInBkmrk] = useState()

    const {libFiles, bkmrkFiles} = useSelector(state => ({
        libFiles:state.library.libFiles,
        bkmrkFiles:state.bookmark.bkmrkFiles
    }))

    useEffect(() => {
        if(libFiles){
            let id = video.data ? video.data._id : video.fileDataId?._id
            setInLibrary(checkLibContent( id, libFiles))
        }

        if(bkmrkFiles){
            let id = video.data ? video.data._id : video.fileDataId?._id
            setInBkmrk(checkLibContent( id, bkmrkFiles))
        }
    }, [libFiles, bkmrkFiles, video])

    const thumb = useMemo(() => {
        let data = video.data || video.fileDataId
        if(data.source ==="jw"){
            return getJwVideoThumbnail(data.value)
        }else
        if (data.source === 'youtube') {
          return getVideoThumbnailById(data.value);
        } else {
          return getVimeoThumb(data);
        }
    }, [video]);

    const videoData = video.data || video.fileDataId
    let courseId = params.courseId || video.courseId
    let subjectId = params.subjectId || video.contentId
    let packageId = params.packageId
    const trackings = useSelector(s => s.tracking.trackings);
    const videoTrackings = trackings?.[courseId]?.[CONTENT_TYPE.VIDEO]
    const thisTracking = videoTrackings?.[video._id];

    let finalLog;
    finalLog = thisTracking

    const current = finalLog?.properties?.current || 0;
    const total = finalLog?.properties?.size || 0

  const { modalType, isLoginModalOpen, toggleLoginModal } = useLoginModal();
  const isAuthenticated = useIsAuthenticated();

    const showVideo = () => {
        let search = ''

        if(isAuthenticated){
            if(video.libType)
                search =  `?courseId=${video.courseId}&subjectId=${video.contentId}`
            else if(demo){
                search = `?demoPackageId=${params.packageId}`
                let currentVideo = video.libType ? video.fileDataId : video.data
                return history.push({pathname:'/dashboard/package-demo/video/'+currentVideo?._id, search})
                // search = `?demoCourseId=${courseId}&packageId=${params.packageId}&subjectId=${params.subjectId}`
            }else
                search = `?courseId=${courseId}&subjectId=${subjectId}`
        
            let currentVideo = video.libType ? video.fileDataId : video.data
            history.push({pathname:'/dashboard/video/'+currentVideo?._id, search})
        }else{
            toggleLoginModal()
        }
    }

    let daysLeft = course && parseInt((new Date(course?.endDate) - new Date()) / (1000 * 60 * 60 * 24), 10)
    daysLeft = daysLeft ? daysLeft < 1 ? 0 : daysLeft : 0
    return(
        <VStack borderRadius='5px' w='14.93vw' bg='white' boxShadow='0pt 3pt 6pt rgba(221, 230, 237, 0.8)' justifyContent='space-between' m='0 20px 30px 0' align='stretch'>
            <VStack align='stretch'>
                <Box pos='relative' height='7.96vw' overflow='hidden' onClick={showVideo} cursor='pointer'>
                    <Box pos='absolute' top={0} bottom={0} right={0} left={0}></Box>
                    <Image src={thumb} objectFit='cover'/>
                    {/* <ReactPlayer light style={{background:'black'}} width='100%' light height='100%'
                        url={videoData.url}
                    /> */}
                </Box>
                <HStack px={3} mb={2} justifyContent='space-between' alignItems='start'>
                    <Tooltip label={video.name}>
                        <Text fontSize={{base:'sm', md: "sm", lg: "md"}} style={{wordWrap:'break-word', width:'10.54vw'}}>
                            {video.name.length > 40 ?  video.name.substring(0, 40)+'...' : video.name}
                        </Text>
                    </Tooltip>
                    {!demo ? 
                        <ContentPopover bookmarkId={inBkmrk} libraryId={inLibrary} course={courseId} 
                            library={library} bookmark={bookmark} type='videos' subject={subject?.content?._id} data={video}
                        /> : null
                    }
                </HStack>
            </VStack>
            <VStack alignItems='stretch'>
                {subject ?
                    <Box px={3}>
                        <Tag fontSize='xs' bg='#F0F4F7' borderRadius='2px'>{bilingualText(subject.name)}</Tag>
                    </Box>
                    : video.subjectId ?
                        <Box px={3}>
                            <Tag fontSize='xs' background='#F0F4F7' borderRadius='2px'>{bilingualText(video.subjectId.name)}</Tag>
                        </Box>
                        :
                        null
                }

                {demo || video.libType ? null :
                    <Box p={2} bg='#F7F9F9' fontSize='sm'>
                        <HStack justifyContent='space-between' width='100%'>
                            <Text fontSize='xs'>{parseInt((current / total) * 100) || 0}%</Text>
                            <Text fontWeight='bold' color='brand.green' fontSize='xs'>{finalLog ? finalLog.action === 'PROGRESS' ? ' In Progress' : _.capitalize(finalLog.action) : 'Not Started'}</Text>
                            <Text fontSize='xs'>Progress</Text>
                        </HStack>
                        <Progress my={1} value={(parseInt(current / total * 100)) || 0} borderRadius={10} size="xs" colorScheme="green" />
                        {/* <HStack justifyContent='space-between'>
                            <Text fontSize='xs'>{finalLog ? new Date(finalLog?.createdAt).toLocaleString('en-GB', { timeZone: 'UTC' }) : '00:00:00'}</Text>
                            <Text fontSize='xs'>{course ? (daysLeft + ' Days Left') : null} </Text>
                        </HStack> */}
                    </Box>
                }
            </VStack>
        </VStack>
    )
}