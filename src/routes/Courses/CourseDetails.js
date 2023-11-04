import { Box, Text } from '@chakra-ui/react'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { STATUS } from '../../App/Constants'
import { ErrorChecker } from '../../Components/ErrorChecker'
import { getSingleCourseAction } from '../../redux/reducers/courses'

export const CourseDetails = () => {
    const dispatch = useDispatch()
    const params = useParams()

    const {getCourseStatus, currentCourse} = useSelector((state) => ({
        getCourseStatus: state.course.getSingleCourseStatus,
        currentCourse:state.course.currentCourse?.[0]
    }))

    useEffect(() => {
        dispatch(getSingleCourseAction({id:params.courseId}))
    }, [])

    return(
        <Box>
            <ErrorChecker status={getCourseStatus}>
                {getCourseStatus === STATUS.SUCCESS ? 
                    <Box>
                        <Text fontWeight='bold' fontSize='heading' color='#3498DB'>{currentCourse.name}</Text>
                        <Text>{currentCourse.description}</Text>
                    </Box>
                    :
                    null
                }
            </ErrorChecker>
        </Box>
    )
}