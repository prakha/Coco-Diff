import { Input } from '@chakra-ui/input'
import { InputRightElement } from '@chakra-ui/input'
import { InputGroup } from '@chakra-ui/input'
import {Select} from '@chakra-ui/react'
import React, {useState} from 'react'

export const InputBox = ({icon, placeholder, onChange, key, size}) => {
    return(
        <InputGroup>
            <InputRightElement color="text.100"
                pointerEvents="none"
                children={icon}
            />
            <Input borderColor='white' background='#F9F9F9' borderRadius="xl" onChange={onChange} key={key} size={size || 'md'} borderRadius='30px' bg='white' className='custom-input' placeholder={placeholder} />
        </InputGroup>
    )
} 

export const InputSelectBox = ({icon, placeholder, onChange, key, size, data}) => {
	return(
		<InputGroup>
        	<Select borderColor={0} placeholder={placeholder} onChange={(e) => onChange(e)} icon={icon} style={{borderRadius: '30px', width: '190px'}} 
                className='custom-input'
            >
			 	{_.map(data, d => (
			 		<option value={d.value}>{d.title}</option>
			 	))}
			</Select>
        </InputGroup>
	)
}