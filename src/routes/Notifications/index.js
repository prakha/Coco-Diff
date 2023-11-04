import { Avatar } from '@chakra-ui/avatar'
import { Button } from '@chakra-ui/button'
import { Box, Divider, Flex, HStack, List, ListItem, Text, VStack } from '@chakra-ui/layout'
import { Spinner } from '@chakra-ui/spinner'
import moment from 'moment'
import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { STATUS } from '../../App/Constants'
import { ErrorChecker } from '../../Components/ErrorChecker'
import { SectionHeader } from '../../Components/SectionHeader'
import { Truncate } from '../../Components/Truncate'
import { getNotificationsAciton } from '../../redux/reducers/notifications'

export const Notifications = () => {
    const dispatch = useDispatch()

    const {user, getNotificationsStatus, notificationList, pageData} = useSelector(state => ({
        user:state.user.user,
        getNotificationsStatus:state.notifications.getNotificationsStatus,
        notificationList:state.notifications.notificationList,
        pageData:state.notifications.pageData
    }))

    const getNotification = useCallback(
        (page = 1, limit = 10) => {
          dispatch(getNotificationsAciton({user:user?._id, page, limit}));
        },
        [dispatch, user?._id],
    );
    
    useEffect(() => {
        getNotification()
    }, [getNotification])

    const [viewMore, setViewMore] = useState()
    const _viewMore = (id) => {
        setViewMore(d => _.xor(d, [id]))
    }

    let status = !notificationList.length ? getNotificationsStatus : null
    return(
        <Box bg="#E3E6EC" background='' p={[4, 4, 10]}>
            <SectionHeader title='Notifications'/>

            <Box p={[0 , 0, 2]}>
                <ErrorChecker status={status}>
                    {notificationList?.length ? 
                        <HStack justifyContent='center'>
                            <List background='#F4F6F8' maxHeight='1200px' overflow='auto' id='scroll-bar' borderRadius={6} p={[0, 0, 4]} width={['100%', '100%', '70%']}>
                                {notificationList?.length ?
                                    notificationList.map(notify => {
                                        return(
                                            <ListItem key={notify._id} mb={2}>
                                                <Flex  flexWrap={['wrap', 'nowrap']}
                                                    // cursor='pointer' 
                                                    background='white'
                                                    _hover={{background:'#F4F6F7', 
                                                        // boxShadow:'rgba(0, 0, 0, 0.05) 0px 0px 0px 1px'
                                                    }} 
                                                    transition='.4s' borderRadius={8} p={[4, 5]} spacing={4} 
                                                    alignItems='start'
                                                >
                                                    <Box visibility={['hidden', 'visible']} display={['none', 'block']}>
                                                        <Avatar mr={3} mb={4} size='md' name={notify.notificationId.sentBy?.name} />
                                                    </Box>
                                                    <VStack alignItems='stretch' w='100%'>
                                                        <HStack justifyContent='left'>
                                                            <Box visibility={['visible', 'hidden']} display={['block', 'none']}>
                                                                <Avatar mr={4} size='md' name={notify.notificationId.sentBy?.name} />
                                                            </Box>
                                                            
                                                            <Flex flexWrap='wrap' justifyContent='space-between' w='100%'>
                                                                <Text fontSize='sm' w={['100%', 'auto']} color='#5D6D7E'>{notify.notificationId.sentBy?.name}</Text>
                                                                <Text fontSize='xs' color='#5D6D7E'>{moment(notify.createdAt).format("DD MMM YYYY, HH:mm")}</Text>
                                                            </Flex>
                                                        </HStack>
                                                        <HStack>
                                                            <Box></Box>
                                                            <Box>
                                                                <Text fontSize='sm' fontWeight='bold'>{notify.notificationId.title}</Text>
                                                                <Text fontSize='sm'>
                                                                    <Truncate>
                                                                        {notify.notificationId.body}
                                                                    </Truncate>
                                                                </Text>
                                                            </Box>
                                                        </HStack>
                                                    </VStack>
                                                    <Box>

                                                    </Box>
                                                </Flex>
                                                <Divider/>
                                            </ListItem>
                                        )
                                    }
                                    )
                                    :
                                    null
                                }
                                <ListItem p={2} textAlign='center'>
                                    {getNotificationsStatus === STATUS.FETCHING ?
                                        <Spinner ml={10} size="lg" />
                                        :pageData.page === pageData.pages ?
                                            null
                                            :
                                            <Button color='#3498DB' onClick={() => getNotification(pageData.page + 1)} variant='ghost'>
                                                Load More
                                            </Button>
                                    }
                                </ListItem>
                            </List>
                        </HStack>
                        :
                        <Box width='white'>
                            <Text>No message available</Text>
                        </Box>
                    }
                </ErrorChecker>
            </Box>
        </Box>
    )
}