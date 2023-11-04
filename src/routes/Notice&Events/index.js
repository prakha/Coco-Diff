import { Th, Table, Thead, Text, Box, Tbody, Td, Tr, Divider, Button } from '@chakra-ui/react'
import _ from 'lodash'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { BsEye } from 'react-icons/bs'
import { useDispatch, useSelector } from 'react-redux'
import { STATUS } from '../../App/Constants'
import { ErrorChecker } from '../../Components/ErrorChecker'
import { SectionHeader } from '../../Components/SectionHeader'
import { getAllEventsAction, getAllNoticeAction } from '../../redux/reducers/notice&events'
import { checkEventStatus } from '../../utils/Helper'
import { EventModal } from './EventsBoard'
import { NoticeModal } from './NoticeBoard'

export const NoticeAndEvents = () => {
    const dispatch = useDispatch()

    const {noticeList, getAllNoticeStatus, getAllEventsStatus, eventsList} = useSelector((state) => ({
        noticeList:state.notice.noticeList,
        getAllNoticeStatus:state.notice.getAllNoticeStatus,
        getAllEventsStatus:state.notice.getAllEventsStatus,
        eventsList:state.notice.eventsList
    }))

    useEffect(() => {
        dispatch(getAllNoticeAction({active:true}))
        dispatch(getAllEventsAction({active:true}))
    }, [dispatch])

    const [eventModal, openEventModal] = useState()
    const [noticeModal, openNoticeModal] = useState()

    const viewEvent = (event) => {
        openEventModal(event)
    }

    const viewNotice = (notice) => {
        openNoticeModal(notice)
    }

    return(
        <Box bg="#F7F8FB" p='2rem' >
            <SectionHeader title='Notices and Events'/>
            <ErrorChecker status={getAllNoticeStatus}>
            <ErrorChecker status={getAllEventsStatus}>
                {getAllEventsStatus === STATUS.SUCCESS && getAllNoticeStatus === STATUS.SUCCESS ?
                    <Box background='white' p={8}>
                        <Box>
                            <Text fontWeight='bold' fontSize='lg'>Notices</Text>
                            <br/>
                            <Box overflowY='auto' id='scroll-bar' border='1px solid #ECF0F1' maxHeight='800px' pos='relative'>
                                <Table>
                                    <Thead pos='sticky' top={0} right={0} left={0} zIndex={1} border='1px solid #ECF0F1' bg='#F4F6F7'>
                                        <Tr>
                                            <Th>#</Th>
                                            <Th>Title</Th>
                                            <Th>Notice</Th>
                                            <Th>Actions</Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody color='gray.700'>
                                        {noticeList?.length ? 
                                            _.orderBy(noticeList, ['priority']).map((notice, i) => 
                                                <Tr key={notice._id}>
                                                    <Td border='1px solid #ECF0F1'>{++i}</Td>
                                                    <Td border='1px solid #ECF0F1' minWidth='200px'>{notice.title}</Td>
                                                    <Td border='1px solid #ECF0F1'>
                                                        {notice.body.substring(0,300)}
                                                        {notice.body.length > 300 ? 
                                                            <span>...</span> 
                                                            : null
                                                        }
                                                    </Td>
                                                    <Td border='1px solid #ECF0F1'>
                                                        <Button leftIcon={<BsEye/>} colorScheme='blue' color='white' size='xs' bg='brand.blue' 
                                                            onClick={() => viewNotice(notice)}
                                                        >
                                                            View
                                                        </Button>
                                                    </Td>
                                                </Tr>
                                            )
                                            :
                                            null
                                        }
                                    </Tbody>
                                </Table>
                            </Box>
                        </Box>
                        <br/>
                        <Divider/>
                        <br/><br/>
                        <Box>
                            <Text fontWeight='bold' fontSize='lg'>Events</Text>
                            <br/>
                            <Box overflowY='auto' id='scroll-bar' border='1px solid #ECF0F1' maxHeight='800px' pos='relative'>
                                <Table fontSize='sm'>
                                    <Thead pos='sticky' top={0} zIndex={1} right={0} left={0} border='1px solid #ECF0F1' bg='#F4F6F7'>
                                        <Tr>
                                            <Th>#</Th>
                                            <Th>Title</Th>
                                            <Th>Event Details</Th>
                                            <Th>Start Date</Th>
                                            <Th>end Date</Th>
                                            <Th>Status</Th>
                                            <Th>Actions</Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody color='gray.700'>
                                        {eventsList?.length ? 
                                            _.orderBy(eventsList, ['priority']).map((event, i) =>
                                                {
                                                    let online = checkEventStatus(event.startDate || null, event.endDate || null)
                                                    return (
                                                        <Tr key={event._id}>
                                                            <Td border='1px solid #ECF0F1'>{++i}</Td>
                                                            <Td border='1px solid #ECF0F1' minWidth='200px'>{event.title}</Td>
                                                            <Td border='1px solid #ECF0F1'>
                                                                {event.body?.substring(0,200)}
                                                                {event.body?.length > 200 ? 
                                                                    <span>...</span> 
                                                                    : null
                                                                }
                                                            </Td>
                                                            <Td border='1px solid #ECF0F1' w='130px'>{event.startDate && moment(event.startDate).format('DD-MM-YYYY')}</Td>
                                                            <Td border='1px solid #ECF0F1' w='130px'>{event.endDate && moment(event.endDate).format('DD-MM-YYYY')}</Td>
                                                            <Td border='1px solid #ECF0F1'>
                                                                <Text color={online ? 'brand.green' : 'brand.red'}>{online ? 'Online' : 'Offline'}</Text>
                                                            </Td>
                                                            <Td border='1px solid #ECF0F1'>
                                                                <Button leftIcon={<BsEye/>} colorScheme='blue' color='white' size='xs' bg='brand.blue' 
                                                                    onClick={() => viewEvent(event)}
                                                                >
                                                                    View
                                                                </Button>
                                                            </Td>
                                                        </Tr>
                                                    )
                                                }
                                            )
                                            :
                                            null
                                        }
                                    </Tbody>
                                </Table>
                            </Box>
                        </Box>
                    </Box>
                    :
                    null
                }
            </ErrorChecker>
            </ErrorChecker>
            {eventModal ? <EventModal visible={eventModal} event={eventModal} closeModal={viewEvent}/> : null}
            {noticeModal ? <NoticeModal visible={noticeModal} notice={noticeModal} closeModal={viewNotice}/> : null}
        </Box>
    )
}