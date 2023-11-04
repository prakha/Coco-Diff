import { Avatar, Box, HStack, Text, VStack } from '@chakra-ui/react'
import moment from 'moment'
import React, { useEffect } from 'react'
import { AiOutlineBell, AiOutlineRight } from 'react-icons/ai'
import { BsFillInfoCircleFill } from 'react-icons/bs'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router'
import { STATUS } from '../../App/Constants'
import { ErrorChecker } from '../../Components/ErrorChecker'
import { getNotificationsAciton } from '../../redux/reducers/notifications'

export const DashboardNotifications = () => {
    const dispatch = useDispatch()
    const history = useHistory()

    const {getNotificationsStatus, notificationList} = useSelector(state => ({
        getNotificationsStatus:state.notifications.getNotificationsStatus,
        notificationList:state.notifications.notificationList
    }))

    useEffect(() => {
        dispatch(getNotificationsAciton())
    }, [])

    const openNotificaitons = () => {
        history.push('/notifications')
    }

    return(
        <VStack align='stretch' boxShadow='0px 3px 6px #0000000A' spacing={0} bg='#D0D0D04D' borderRadius="xl">
            <HStack px={4} py={3} cursor='pointer' fontSize="lg">
                <Box alignItems='center'>
                    <Avatar bg="brand.redAccent" size='sm' icon={<AiOutlineBell color='white' fontSize="1.17vw" />} />
                </Box>
                <Box flexGrow='1'>
                    <Text fontSize='md'>Notification</Text>
                </Box>
            </HStack>
            <Box bg='#FFFFFF' borderRadius="xl" p={2} minHeight='300px'>
                <ErrorChecker status={getNotificationsStatus}>
                    {getNotificationsStatus === STATUS.SUCCESS && notificationList?.length ? 
                        notificationList.slice(0, 4).map(notify => 
                            <VStack key={notify._id} fontSize="lg" p={2} align='stretch'>
                                <HStack alignItems='center' cursor='pointer' onClick={openNotificaitons}>
                                    <Box><BsFillInfoCircleFill fontSize='1.57vw' color='#FD9F27'/></Box>
                                    <HStack borderBottom='1px solid #E4E4E4C3' justifyContent='space-between' w='100%' pb={3}>
                                        <Box px={2}>
                                            <Text fontSize='sm'>{moment(notify.createdAt).format("DD MMM YYYY")}</Text>
                                            <Text fontSize='xs' color='brand.secondary'>
                                                {notify.notificationId.body.length > 35 ? 
                                                    notify.notificationId.body.substring(0, 35)+'...'
                                                    :
                                                    notify.notificationId.body
                                                }    
                                            </Text>
                                        </Box>
                                        <Box pl={2}>
                                            <AiOutlineRight/>
                                        </Box>
                                    </HStack>
                                </HStack>
                            </VStack>
                        )
                        :
                        <VStack fontSize="lg" p={2} align='stretch'>
                            <HStack alignItems='center' >
                                <HStack w='100%' justifyContent='center' pb={3}>
                                    <Box px={2}>
                                        <Text color='brand.secondary'>Empty</Text>
                                    </Box>
                                </HStack>
                            </HStack>
                        </VStack>
                    }
                </ErrorChecker>
            </Box>
        </VStack>
    )
} 