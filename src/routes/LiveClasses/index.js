import React from 'react'
import { Box, Flex } from '@chakra-ui/react'
import StudentFeedbacks from './StudentFeedbacks'
import TodayClasses from './TodayClasses'
import UpcomingClasses from './UpcomingClasses'
import { useCallback } from 'react'
import { useState } from 'react'

export default function LiveClasses(props) {
    
    const [ teacherReview, setTeacherReview ] = useState();

    const closeReviewSidebar = useCallback( () => {
        setTeacherReview(null);
    },[setTeacherReview]);

    return (
        <Box px={0} pt={6} maxH='85vh' overflowY='scroll' pb={110} overflowX='hidden' pos='relative'>
            <Flex>  
                <Box w={{ md: '25%' }} display={{ base:'none', lg:'block' }} pr={1}>
                    <UpcomingClasses />
                </Box>
                <TodayClasses setTeacherReview={setTeacherReview}/>
            </Flex>
            <StudentFeedbacks handleClose={closeReviewSidebar} staffId={teacherReview}/>
        </Box>
    )
}
