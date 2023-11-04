import { Box, Text, Wrap } from '@chakra-ui/layout'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { checkExpiry } from '../../utils/Helper'
import { VideoCard } from '../Contents/VideoFiles'

export const VideoLibrary = ({content, searchData}) => {
    const {courseList, user} = useSelector(state => ({
        courseList:state.package.packageContents?.courses,
        user:state.user.student
    }))
    const [filtervideodata, setFilterVideoData] = useState()  

    let list = _.chain(content).map(d => {
        let course = courseList?.length ? _.find(courseList,c => c._id == d.courseId) : []
        let assignedCourseDetails = user.courses?.length ? _.find(user.courses,c => c.course == d.courseId) : []
        return course ? ({...d, ..._.omit(assignedCourseDetails, ['_id']), course:{name:course.name}}) : d
    }).filter(d => d.course && checkExpiry(d.expireOn)).value()

    useEffect( () => {
        const newFilterData = 
        _.filter(list, f =>
        _.includes
            (
            _.toUpper(f.name),
            _.toUpper(searchData)))
            setFilterVideoData( newFilterData)
    },[ searchData])

    return(
        <Box>
            {filtervideodata?.length ? 
                <Wrap>
                    {_.map(filtervideodata, vid =>
                        <VideoCard key={vid._id} library={list} video={vid}/>
                    )}
                </Wrap>
                :
                <Text>No video added</Text>
            }
        </Box>
    )
}