import { Box, Container, Heading, Text } from '@chakra-ui/layout'
import React from 'react'

export const ConponentContainer = ({title, children}) => {
    return(
        <Box p='20px 60px' whiteSpace='pre-line'>
            <Text fontSize='30px' fontWeight='bold'>{title}</Text>
            <br/>
            <pre fontSize='14px' lineHeight='25px'>
                {children}
            </pre>
        </Box>
    )
}