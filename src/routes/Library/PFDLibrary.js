import { Box, Text, List } from '@chakra-ui/layout'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { checkExpiry } from '../../utils/Helper'
import { PdfCard } from '../Contents/PdfFiles'

export const PDFLibrary = ({content, searchData}) => {
    const {courseList, user} = useSelector(state => ({
        courseList:state.package.packageContents?.courses,
        user:state.user.student
    }))
    //user->student
    const [filterpdflibrarydata, setFilterPDFLibraryData] = useState()  

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
            setFilterPDFLibraryData( newFilterData)
    },[ searchData])

    return(
        <Box>
            {filterpdflibrarydata?.length ? 
                <List w='100%' spacing={4}>
                    {_.map(filterpdflibrarydata, doc =>
                        <PdfCard key={doc._id} library={list} doc={doc}/>
                    )}
                </List>
                :
                <Text>No document added</Text>
            }
        </Box>
    )
}