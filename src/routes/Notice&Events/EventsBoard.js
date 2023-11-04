import { Box, Divider, HStack, Text, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody } from '@chakra-ui/react';
import moment from 'moment';
import React, { useState } from 'react'
import { AiOutlineCalendar, AiOutlineClockCircle } from 'react-icons/ai';
import { GiAlarmClock } from 'react-icons/gi';
import { HiOutlineStatusOnline } from 'react-icons/hi';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { checkEventStatus } from '../../utils/Helper';

export const EventsBoard = () => {
    const history = useHistory()
    const {config, events} = useSelector(state => ({
      config:state.package.config,
      events:state.package.events
    }))

    const [eventModal, openEventModal] = useState()
    const openEvent = (event) => {
        openEventModal(event)
    }
  
    return (
      <Box bg='white'>
        <HStack bg="white" align='center' borderBottom='1px solid #EBEDEF' justify='space-between'
          p={2} boxShadow="sm" borderLeft={"4px solid #DB4437"}
          // onClick={() => changeFilterOpen(title)}
        >
          <Box width="">
            <Text textAlign="left" color={'#4285F4'}>
              Upcoming Events
            </Text>
          </Box>
          
          <Box color='#DB4437' >
            <Text fontSize='sm' onClick={() => history.push('/notices-events')} cursor='pointer'>View All</Text>
          </Box>
        </HStack>
        <Box p={1}>
          <Box>
            
              {events?.length ?
                events.map(event => 
                  {
                    let startDate = event.startDate ? moment(event.startDate, 'YYYY/MM/DD') : ''
                    let endDate = event.endDate ? moment(event.endDate, 'YYYY/MM/DD') : ''
                    let startTime = event.startTime ? moment(event.startTime).format('HH:mm A') : ''
                    let endTime = event.endTime ? moment(event.endTime).format('HH:mm A') : ''
                    let online = checkEventStatus(startDate, endDate)
  
                    return(
                      <Box cursor='pointer' onClick={() => openEvent(event)}>
                        <HStack alignItems='center' p={3}>
                          <Box  minW={'18%'}>
                            {startDate ? 
                              <Box p={2} borderRadius={3} lineHeight={1.3} color='white' background='#169D58' textAlign='center'>
                                <Text as='b'>{startDate.format('D')}</Text>
                                <Text>{startDate.format('MMM')}</Text>
                              </Box> : null
                            }
                          </Box>
                          <Box>
                            <Text>{event.title}</Text>
                            {startTime ? 
                              <HStack>
                                <GiAlarmClock/> 
                                <Text fontSize='xs'> {startTime}  {endTime ? ' - ' +endTime : null}</Text>
                              </HStack>
                              : null
                            }
                            <HStack>
                                <HiOutlineStatusOnline fontSize='20px' color={online ? '#27A163' : '#DB4437'}/> 
                                <Text color={online ? 'brand.green' : 'brand.red'}>{online ? 'Online' : 'Offline'}</Text>
                            </HStack>
                          </Box>
                        </HStack>
                        <Divider w='100%'/>
                      </Box>
                    )
                  }
                )
                :
                <Text p={2} fontSize='sm' color='gray.600'>No events</Text>
              }
          </Box>
        </Box>
        {eventModal ? <EventModal visible={eventModal} event={eventModal} closeModal={openEvent}/> : null}
      </Box>
    );
};

export const EventModal = ({visible, closeModal, event}) => {
    return (
        <Modal isOpen={visible} size='3xl' onClose={closeModal}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>{event.title}</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    {event.startDate ?
                        <HStack fontSize='sm' align='center'>
                            <AiOutlineCalendar/>
                            <Text color='brand.secondary'>
                                {moment(event.startDate).format('DD-MM-YYYY')} {event.endDate ? ' - '+moment(event.endDate).format('DD-MM-YYYY') : null}
                            </Text>
                        </HStack> : null
                    }
                    {event.startTime ?
                        <HStack fontSize='sm' align='center'>
                            <AiOutlineClockCircle/>
                            <Text color='brand.secondary'>
                                {moment(event.startTime).format('HH:mm A')} {event.endTime ? ' - '+moment(event.endTime).format('HH:mm A') : null}
                            </Text>
                        </HStack> : null
                    }
                    <br/>
                    <Text>{event.body}</Text>
                    <br/>
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}