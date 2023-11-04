import { Spinner } from '@chakra-ui/spinner'
import React from 'react'
import { STATUS } from '../App/Constants'

export const ErrorChecker = ({status, children, size, state}) => {
    return(
            status === STATUS.FETCHING || state ? 
                <div style={{textAlign:'center'}}><Spinner size={size || "xl"} /></div> 
                : 
                children 
    )
}