import { Button } from '@chakra-ui/react'
import React from 'react'

export function ButtonX(props) {
    if(props.variant === 'outline')
        return  (
        <Button color={'#e02a1f' } border={'1px solid' } borderColor='#e02a1f' {...props}>
            {props.children}
        </Button>
        )
    return (
        <Button color={'white'} bg={'#e02a1f' } _hover={{ bg: 'brand.redAccentDark' }} {...props}>
            {props.children}
        </Button>
    )
}
