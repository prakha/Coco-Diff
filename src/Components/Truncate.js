import { Button } from '@chakra-ui/button'
import { Box, Text } from '@chakra-ui/react'
import React, { useState } from 'react'

export const Truncate = ({children, length = 200}) => {
    const [show, changeShow] = useState(false)
    const showPara = () => {
        changeShow(!show)
    }

    return <Box>
            {!children ?
                <Text>-</Text>
                :
                children.length > length && !show ?
                    <Box>
                        <Text display='inline'>{children.substring(1, length)}...</Text>&nbsp;
                        <Text display='inline' onClick={showPara} cursor='pointer' _hover={{color:'#85C1E9'}} fontSize='sm' color='brand.blue'>view more</Text>
                    </Box>
                    :
                    <Box>
                        <Text>{children}</Text>&nbsp;
                        {children.length > length ? <Text display='inline' onClick={showPara} cursor='pointer' _hover={{color:'#85C1E9'}} fontSize='sm' color='brand.blue'>view less</Text> : null }
                    </Box>
            }
        </Box>
}