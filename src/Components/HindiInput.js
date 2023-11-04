import { Input } from '@chakra-ui/input';
import { Textarea } from '@chakra-ui/textarea';
import React from 'react'
import { useState } from 'react';

export const HindiInput = ({onChange, placeholder, required, value, componentType, rows, mb, size}) => {
    const [inputValue, setInputValue] = useState()
	const [language, changeLanguage]= useState('pramukhime:english')

    // useEffect(() => {
    //     setInputValue(value)
    //     let lang = language.split(':')
    //     if(window?.pramukhIME){
    //         window.pramukhIME.setLanguage(lang[1], lang[0]);
    //         window.pramukhIME.addKeyboard("PramukhIndic");
    //         window.pramukhIME.enable();
    //     }

    //     return () => {
    //         window.pramukhIME.disable()
    //     };
    //   }, []);

    const changeValue = (e) => {
        document.getElementById('input').focus = null
        onChange(e)
        setInputValue(e.target.value)
    }

    const handleLanguageChange = (value) => {
        let lang = value.split(':')
        window.pramukhIME.setLanguage(lang[1], lang[0]);
        changeLanguage(value)
    }

    return( componentType == 'textarea' ?
            <Textarea placeholder={placeholder} id='input' rows={rows}
                onFocus={() => handleLanguageChange('pramukhindic:hindi')} 
                defaultValue={inputValue} 
                value={inputValue}
                onBlur={(e) => (changeValue(e), handleLanguageChange('pramukhime:english'))} 
                onChange={changeValue}
                required={required}
            />
            :
            <Input placeholder={placeholder} id='input'  mb={mb} size={size}
                onFocus={() => handleLanguageChange('pramukhindic:hindi')} 
                defaultValue={inputValue} 
                value={inputValue}
                onBlur={(e) => (changeValue(e), handleLanguageChange('pramukhime:english'))} 
                onChange={changeValue}
                required={required}
            />
    )
}