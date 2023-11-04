import { Box, Flex, HStack, Text, Wrap, WrapItem } from '@chakra-ui/layout'
import React, { useEffect, useState } from 'react'
import _ from 'lodash'
import { AudioCard } from '../Contents/AudioFiles'

export const Audios = ({course}) => {
    const [audioList, setAudio] = useState([])

    useEffect(() => {
        if(course?.audios?.length){
            setAudio(course.audios)
        }
    }, [course])

    return(
        <Box>
            <HStack mb={3} justify='space-between' p={2} boxShadow='0px 1px 2px #00000040' bg='white'>
                <Text fontSize='lg'>Audios</Text>
            </HStack>
            <Flex w='100%' wrap flexWrap='wrap' align='stretch' spacing={1}>
                {audioList?.length ?  
                    audioList.map(audio => 
                        <AudioCard key={audio._id} course={course} demo audio={audio}/>
                    )
                    :
                    <Text color='gray.400'></Text>
                }
            </Flex>
            <br/>
        </Box>
    )
}