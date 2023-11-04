import { Box, HStack, VStack, Wrap, Text, List } from '@chakra-ui/layout'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { checkExpiry } from '../../utils/Helper'
import { AudioCard } from '../Contents/AudioFiles'
import { PdfCard } from '../Contents/PdfFiles'
import { VideoCard } from '../Contents/VideoFiles'

export const PDFBookmarks = ({content, searchData}) => {
    const {courseList, user} = useSelector(state => ({
        courseList:state.package.packageContents?.courses,
        user:state.user.student
    }))
    //user->student

    const [filterpdfbookmarkdata, setFilterPDFBookmarkData] = useState() 

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
            setFilterPDFBookmarkData( newFilterData)
    },[ searchData])

    return(
        <Box>
            {filterpdfbookmarkdata?.length ? 
                <List w='100%' spacing={4}>
                    {_.map(filterpdfbookmarkdata, doc =>
                        <PdfCard key={doc._id} bookmark={list} doc={doc}/>
                    )}
                </List>
                :
                <Text>No document added</Text>
            }
        </Box>
    )
}