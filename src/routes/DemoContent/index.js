import { Box, HStack, Spacer, Text, VStack } from '@chakra-ui/layout'
import { param } from 'jquery'
import _ from 'lodash'
import React, { useEffect, useState } from 'react'
import { AiFillFilePdf, AiFillFileText, AiFillVideoCamera, AiOutlineRight } from 'react-icons/ai'
import { BsMusicNote } from 'react-icons/bs'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useLocation, useParams } from 'react-router'
import { STATUS } from '../../App/Constants'
import { ContentNavBar } from '../../Components/ContentNavBar'
import { ErrorChecker } from '../../Components/ErrorChecker'
import { SectionHeader } from '../../Components/SectionHeader'
import { getPublicContentAction } from '../../redux/reducers/courses'
import { bilingualText } from '../../utils/Helper'
import { Audios } from './Audios'
import { Documents } from './Documents'
import { Texts } from './Texts'
import { Videos } from './Videos'

export const DemoContent = ({}) => {
    const dispatch = useDispatch()
    const params = useParams()

    const {getPublicContentStatus, publicContent, packagesList} = useSelector((state) => ({
        getPublicContentStatus:state.course.getPublicContentStatus,
        publicContent:state.course.publicContent,
        packagesList:state.package.packagesList
    }))

    const [currentSubject, setSubject] = useState()

    useEffect(() => {
        if(params.subjectId && publicContent?.subjects?.length){
            let sub = _.find(publicContent.subjects,s => s.content ===params.subjectId)
            if(sub)
                setSubject(sub)
        }
    }, [params.subjectId, publicContent])

    // useEffect(() => {
    //     if(getPublicContentStatus === STATUS.SUCCESS && _.findIndex(publicContent,c => c.courseId._id === params.courseId) != -1){
    //         setCourse(_.find(publicContent,c => c.courseId._id == params.courseId))
    //     }
    // }, [getPublicContentStatus])

    useEffect(() => {
        dispatch(getPublicContentAction({courseIds:[params?.courseId]}))
    }, [dispatch, params])

    let breadcrumbs = publicContent ? [
        {title:'Home', link:'/'},
        {title:bilingualText(_.find(packagesList,p => p._id === params.packageId).name), link:'/package?id='+params.packageId},
        {title:publicContent.name, link:'#'},
    ] : []

    return(
        <Box p={6}>
            <SectionHeader title={bilingualText(_.find(packagesList,p => p._id === params.packageId).name)} breadcrumbs={breadcrumbs}/>

            <ErrorChecker status={getPublicContentStatus}>
                {getPublicContentStatus === STATUS.SUCCESS ?
                    <HStack w='100%' alignItems='stretch'>
                        <SubjectsList course={publicContent}/>
                        {currentSubject ?
                            <Box flexGrow={1} w='75%' background='white' minHeight='300px' p={4}>
                                <Text fontSize='heading' mb={4}>{currentSubject.displayName}</Text>
                                {currentSubject.audios?.length ? <Audios course={currentSubject}/> : null }
                                {currentSubject.videos?.length ? <Videos course={currentSubject}/> : null }
                                {currentSubject.documents?.length ? <Documents course={currentSubject}/> : null }
                                {currentSubject.texts?.length ? <Texts course={currentSubject}/> : null }
                            </Box>
                            :
                            null
                        }
                    </HStack>
                    :
                    <Text></Text>
                }
            </ErrorChecker>
        </Box>
    )
}

export const SubjectsList = ({course, selectedSubject, type}) => {
    const history = useHistory()
    const params = useParams()
    
    const selectSubject = (sub) => {
        history.push(`/demo-content/${params.packageId}/${params.courseId}/`+sub.content)
    }

    return(
        <Box w='25%'>
            <VStack bg='white' pb={5} px={2} align='stretch' borderRadius='15px' boxShadow='sm'>
                <Text fontSize='heading' fontWeight='' py={2}>
                    Subjects
                </Text>
                <VStack maxHeight='70vh' align='stretch' overflow='auto' pr={2} id='scroll-bar'>
                    {course.subjects?.length ? 
                        _.filter(course.subjects,s => _.sum([s.audios.length, s.videos.length, s.texts.length, s.documents.length])).map(sub =>
                                {
                                    let active = params.subjectId == sub.content
                                    let totalContent = _.sum([sub.audios.length, sub.videos.length, sub.documents.length, sub.texts.length])
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
                                                <Text fontSize='xs' color={active ? 'white' : '#85929E'}>Total content: {totalContent || 0}</Text>
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
        </Box>
    )
}

const SubjectContent = ({course}) => {
    let params = useParams()
    let history = useHistory()
    
    const selectTab = (type) => {
        history.push(`/demo-content/${params.packageId}/${params.courseId}/${type}`)
    }

    let currentTab = params.contentType

    let tabs = [
        {id:1, title:'Audio', type:'audios', icon:<BsMusicNote/>, count:'countAudios'},
        {id:2, title:'Video', type:'videos', icon:<AiFillVideoCamera/>, count:'countVideos'},
        {id:3, title:'PDF Books', type:'documents', icon:<AiFillFilePdf/>, count:'countDocs'},
        {id:4, title:'Online Books', type:'texts', icon:<AiFillFileText/>, count:'countTexts'},
    ]

    tabs = _.filter(tabs,t => course?.[t.type]?.length)
    return(
        <Box flexGrow={1}>
            <ContentNavBar tabs={tabs} currentTab={currentTab} selectTab={selectTab}/>
            <Box minH='300px'>
                <Audios course={course}/>
                <Videos course={course}/>
                <Documents course={course}/>
                <Texts course={course}/>
            </Box>
        </Box>
    )
}