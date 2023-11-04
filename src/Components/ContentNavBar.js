import { HStack } from '@chakra-ui/layout'
import { Box } from '@chakra-ui/layout'
import React from 'react'

export const ContentNavBar = ({tabs, currentTab, selectTab}) => {
    return(
        <HStack spacing={1} align='stretch' w='100%'>
            {tabs.map(tab => 
                <SingleTab key={tab.id} title={tab.title} type={tab.type} currentTab={currentTab} icon={tab.icon} selectTab={selectTab}/>
            )}
        </HStack>
    )
}

const SingleTab = ({title, icon, type, selectTab, currentTab}) => {
    const _selectTab = () => {
        selectTab(type)
    }

    let active = currentTab == type
    return(
        <HStack w='100%' className={active ? 'content-tab' : ''} cursor='pointer'
            onClick={_selectTab}
            borderRadius={active ? '6px' : ''}
            position='relative' spacing={3} p={2} flexGrow='1' justifyContent='center' 
            backgroundColor={active ? "brand.redAccentLight" : '#ECF0F1'}
            color={active ? 'brand.redAccent' : ''}
        >
            <Box p={2} bg={active ? 'brand.redAccent' : '#DB4437'} color={active ? 'white' : 'white'} fontSize='1.17vw' borderRadius='50%'>
                {icon}
            </Box>
            <Box fontSize='md' fontWeight='600'>
                {title}
            </Box>
        </HStack>
    )
}