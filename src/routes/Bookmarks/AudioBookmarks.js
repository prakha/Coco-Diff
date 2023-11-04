import { Box, Wrap, Text } from '@chakra-ui/layout'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { checkExpiry } from '../../utils/Helper'
import { AudioCard } from '../Contents/AudioFiles'

export const AudioBookmarks = ({content, searchData}) => {
    const {courseList, user} = useSelector(state => ({
        courseList:state.package.packageContents?.courses,
        user:state.user.student
    }))
    //user->student

    const [filteraudiodata, setFilterAudioData] = useState()  
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
            setFilterAudioData( newFilterData)
    },[ searchData])
    console.log('list',list)
    console.log('filteraudiodata',filteraudiodata)

    return(
        <Box>
            {filteraudiodata?.length ? 
                <Wrap>
                    {_.map(filteraudiodata, aud =>
                        <AudioCard key={aud._id} bookmark={filteraudiodata} audio={aud}/>
                    )}
                </Wrap>
                :
                <Text>No audio added</Text>
            }
        </Box>
    )
}