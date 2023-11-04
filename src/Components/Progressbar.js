import { CircularProgress, CircularProgressLabel } from '@chakra-ui/progress'
import React from 'react'

export const Progressbar = ({value, size = '38px'}) => {
    return(
        <CircularProgress size={size} color="brand.red" trackColor='yellow.400' background='white' borderRadius='50%' 
            value={value}
        >
            <CircularProgressLabel color='black'>{_.round(value)}%</CircularProgressLabel>
        </CircularProgress>
    )
}