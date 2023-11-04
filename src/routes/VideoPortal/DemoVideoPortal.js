import { SearchIcon } from '@chakra-ui/icons'
import { HStack, Text, VStack, Tag, Progress, Image} from '@chakra-ui/react'
import { Box } from '@chakra-ui/layout'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useLocation, useParams } from 'react-router'
import { ErrorChecker } from '../../Components/ErrorChecker'
import { STATUS } from '../../App/Constants'
import _ from 'lodash'
import { InputBox } from '../../Components/InputBox'
import {VideoPlayer} from '../../Components/VideoPlayer'
import { SectionHeader } from '../../Components/SectionHeader'
import { bilingualText } from '../../utils/Helper'
import { getJwVideoThumbnail, getVideoThumbnailById, getVimeoThumb } from '../Contents/VideoFiles'
import {  } from '@chakra-ui/image'
import { useTrackContent } from '../../Components/useTrackContent'
import moment from 'moment'
import { getPackageDemoAction } from '../../redux/reducers/packages'

export const DemoVideoPortal = () => {
    const dispatch = useDispatch()
    const params = useParams()
    const location = useLocation()

    const {getPackageDemoStatus, packageDemoContent} = useSelector((state) => ({
        getPackageDemoStatus:state.package.getPackageDemoStatus,
        packageDemoContent:state.package.packageDemoContent?.[0]
    }))

    let [currentVideo, setCurrentVideo] = useState()
    const [suggestions, setSuggestions] = useState([])

    const urlSearchParams = new URLSearchParams(location.search)
    let demoCourseId = urlSearchParams.get('demoCourseId')
    let demoPackageId = urlSearchParams.get('demoPackageId')

    useEffect(() => {
        if(demoPackageId)
            dispatch(getPackageDemoAction({id:demoPackageId}))
    }, [demoPackageId, dispatch])

    useEffect(() => {
        if(getPackageDemoStatus === STATUS.SUCCESS && packageDemoContent){
            let video = _.find(packageDemoContent.demoContent.videos,v => v.data._id === params.contentId)
            setCurrentVideo(video)
            setSuggestions([video, ..._.filter(packageDemoContent.demoContent.videos,d => d.data._id !== params.contentId)])
        }
    }, [getPackageDemoStatus, packageDemoContent, params.contentId])

    const breadcrumbs = [
        { title: "Home", link: "/" },
        { title:packageDemoContent ? bilingualText(packageDemoContent.name) : null, link: "/package?id=" + demoPackageId},
        { title: 'Demo', link: '/package-demo/'+demoPackageId},
        { title: currentVideo?.name, link: '#'},
    ]

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
            <ErrorChecker status={getPackageDemoStatus}>
                {getPackageDemoStatus === STATUS.SUCCESS && currentVideo ? 
                    <HStack align='stretch' spacing={4}>
                        <Box bg='white' w='70%' p ={3} pos='relative' boxShadow='0pt 3pt 6pt rgba(221, 230, 237, 0.6)'>
                                <VideoPlayer video={currentVideo}/>
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
        </Box>
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
        history.push(`/dashboard/package-demo/video/${id}${location.search}`)
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
