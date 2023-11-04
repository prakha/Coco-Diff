import { Box, HStack, Text } from '@chakra-ui/layout'
import React, { useEffect, useState } from 'react'
import { AiFillFilePdf, AiFillFileText, AiFillVideoCamera } from 'react-icons/ai'
import { BsMusicNote } from 'react-icons/bs'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useLocation, useParams } from 'react-router'
import { STATUS } from '../../App/Constants'
import { ContentNavBar } from '../../Components/ContentNavBar'
import { ErrorChecker } from '../../Components/ErrorChecker'
import { SectionHeader } from '../../Components/SectionHeader'
import { ROUTES } from '../../Constants/Routes'
import { getBkmrkFilesAction } from '../../redux/reducers/bookmarks'
import { resetGetSubjContent } from '../../redux/reducers/courses'
import { getUserLibFilesAction } from '../../redux/reducers/library'
import { AudioFiles } from '../Contents/AudioFiles'
import { PdfFiles } from '../Contents/PdfFiles'
import { TextFiles } from '../Contents/TextFiles'
import { VideoFiles } from '../Contents/VideoFiles'

export const CourseContent = ({}) => {
    const dispatch = useDispatch()
    const params = useParams()
    const location = useLocation()

    const {defaultDataStatus, defaultData, filesStatus, courseList, getPkgContentsStatus, subjectContent} = useSelector((state) => ({
        courseList:state.package.packageContents?.courses,
        defaultDataStatus:state.lmsConfig.defaultDataStatus,
        defaultData:state.lmsConfig.defaultData,
        filesStatus:state.library.filesStatus,
        getPkgContentsStatus:state.package.getPkgContentsStatus,
        subjectContent:{data:state.course.subjectContent, status:state.course.getSubjContentStatus}
    }))

    const [currentCourse, setCourse] = useState()

    useEffect(() => {
        dispatch(getUserLibFilesAction({libType: 'Library'}));
        dispatch(getBkmrkFilesAction({libType: 'Bookmark'}));

        // return () => dispatch(resetGetSubjContent())
    }, [dispatch])

    useEffect(() => {
        if(getPkgContentsStatus == STATUS.SUCCESS){
            setCourse(_.find(courseList,c => c._id === params.courseId))
        }
    }, [courseList, getPkgContentsStatus, params.courseId])

    let breadcrumbs = currentCourse ? [
        {title:'Home', link:'/'},
        {title:'Courses', link:ROUTES.COURSES},
        {title:currentCourse.name, link:location.pathname},
    ] : []

    return(
        <Box>
            <SectionHeader title='Courses' breadcrumbs={breadcrumbs}/>

            <ErrorChecker status={defaultDataStatus}>
            <ErrorChecker status={filesStatus}>
                {defaultDataStatus == STATUS.SUCCESS && filesStatus == STATUS.SUCCESS ?
                    currentCourse?.subjects?.length ?
                        <Box>
                            <Header course={currentCourse} subjectContent={subjectContent} defaultData={defaultData}/>
                        </Box>
                        :
                        <Text>No constent added</Text>
                    :
                    <Text>Something went wrong</Text>
                }
            </ErrorChecker>
            </ErrorChecker>
        </Box>
    )
}

const Header = ({defaultData, course, subjectContent}) => {
    let params = useParams()
    let history = useHistory()

    const {libFiles} = useSelector(state => ({
        libFiles: state.library.libFiles
    }))
    
    const selectTab = (type) => {
        if(course.subjects?.length && type != 'texts')
            history.push(`/dashboard/courses/${params.courseId}/${type}/${course.subjects[0]?.content._id}`)
        else
            history.push(`/dashboard/courses/${params.courseId}/${type}`)
    }

    let currentTab = params.contentType

    let tabs = [
        {id:1, title:'Audio', type:'audios', icon:<BsMusicNote/>, count:'countAudios'},
        {id:2, title:'Video', type:'videos', icon:<AiFillVideoCamera/>, count:'countVideos'},
        {id:3, title:'PDF Books', type:'documents', icon:<AiFillFilePdf/>, count:'countDocs'},
        {id:4, title:'Online Books', type:'texts', icon:<AiFillFileText/>, count:'countTexts'},
    ]

    tabs = _.filter(tabs,t => course[t.count])
    return(
        <Box>
            <ContentNavBar tabs={tabs} currentTab={currentTab} selectTab={selectTab}/>
            <Box>
                {currentTab === 'audios' ? <AudioFiles libFiles={libFiles} course={course} subjectContent={subjectContent} defaultData={defaultData}/> :
                    currentTab === 'videos' ? <VideoFiles libFiles={libFiles} course={course} subjectContent={subjectContent} defaultData={defaultData}/> :
                        currentTab === 'documents' ? <PdfFiles libFiles={libFiles} course={course} subjectContent={subjectContent} defaultData={defaultData}/> :
                            currentTab === 'texts' ? <TextFiles libFiles={libFiles} course={course} subjectContent={subjectContent} defaultData={defaultData}/> :
                        null
                }
            </Box>
        </Box>
    )
}