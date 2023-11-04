import { Box, Button, Text } from '@chakra-ui/react'
import React from 'react'

import { BsFillInboxFill } from "react-icons/bs";
import { ButtonX } from './ButtonX';


export const Empty = ({title, subtitle, Icon, style, cta}) => {
        return (
        <Box width="100%" display="flex" justifyContent="center">
                <Box p={10} w={400} style={{...style, marginTop:"4rem", minHeight:'250px', }} maxW={["80%", "80%", "50%"]} background='white' boxShadow="md" borderRadius="xl" 
                        display='flex' flexDirection='column' alignItems='center' justifyContent='center'
                >
                        <Box >{Icon ? Icon : <BsFillInboxFill fontSize='50px' color='#3C4043B2' />}</Box>
                        <Text fontSize='xl' fontWeight='lighter' color='brand.secondary'>{title ? title : "Nothing to see Here"}</Text>
                        <Text textAlign="center" fontSize='md' fontWeight='400' color='brand.secondary'>{subtitle ? subtitle : ""}</Text>
                        {cta ? <ButtonX onClick={cta.action} borderRadius="999px" size="small" mt="2rem" fontSize="sm" p="5px 15px">{cta.text}</ButtonX> : null}
                </Box>
        </Box>
        )
   
}
