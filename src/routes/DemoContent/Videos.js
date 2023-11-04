import { Flex } from '@chakra-ui/layout'
import { Box, HStack, Text } from '@chakra-ui/layout'
import _ from 'lodash'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useHistory, useParams } from 'react-router'
import { VideoCard } from '../Contents/VideoFiles'

export const Videos = ({course}) => {
    const [videoList, setVideos] = useState([])

    useEffect(() => {
        if(course?.videos?.length){
            setVideos(course.videos)
        }
    }, [course])

    return(
        <Box>
            <HStack mb={3} justify='space-between' p={2} boxShadow='0px 1px 2px #00000040' bg='white'>
                <Text fontSize='lg'>Videos</Text>
            </HStack>
            <Flex w='100%' flexWrap='wrap' align='stretch' spacing={1}>
                {videoList?.length ?  
                    videoList.map(video => 
                        <VideoCard demo key={video._id} course={course} video={video}/>
                    )
                    :
                    <Text color='gray.400'></Text>
                }
            </Flex>
            <br/>
        </Box>
    )
}