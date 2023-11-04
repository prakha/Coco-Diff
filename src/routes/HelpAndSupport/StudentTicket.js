import { Image } from '@chakra-ui/image'
import { Box, Flex, HStack, Text, VStack } from '@chakra-ui/layout'
import React, { useEffect } from 'react'
import { AiOutlineFileText } from 'react-icons/ai'
import { IoTicketOutline } from 'react-icons/io5'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router'
import { ErrorChecker } from '../../Components/ErrorChecker'
import { SectionHeader } from '../../Components/SectionHeader'
import { STATUS } from '../../Constants'
import { ROUTES } from '../../Constants/Routes'
import { getSingleTicketAction } from '../../redux/reducers/tickets'
import { DiscussionComments } from '../DiscussionCommunity/DiscussionComments'

export const StudentTicket = () => {
    const dispatch = useDispatch()
    const params = useParams()
    
    const {getTicketStatus, currentTicket} = useSelector(state => ({
        getTicketStatus:state.ticket.getTicketStatus,
        currentTicket:state.ticket.currentTicket
    }))

    useEffect(() => {
        dispatch(getSingleTicketAction({ticketId:params.id}))
    }, [dispatch, params.id])

    return(
        <div>
            <SectionHeader title='Student Ticket'
                breadcrumbs={[
                    { title: "Home", link: "/" },
                    { title: "Help & Support", link: ROUTES.HELP_AND_SUPPORT },
                    { title: "Track Your Token", link: ROUTES.HELP_AND_SUPPORT+'?tracking=true' },
                    { title: "Token", link: '#' },
                    
                ]}
            />

            <Box
                boxShadow="lg"
                borderRadius="xl"
                backgroundColor="white"
                p="2rem 1rem"
            >
                <ErrorChecker status={getTicketStatus}>
                    {getTicketStatus === STATUS.SUCCESS && currentTicket ? 
                        <Box lineHeight={2}>
                            <HStack>
                                {/* <IoTicketOutline fontSize={25}/> */}
                                <Text fontWeight='bold' fontSize={20}>{currentTicket.subject}</Text>
                            </HStack>
                            <Text>{currentTicket.category}</Text>
                            <Box>
                                <Box borderRadius='6px' color='brand.secondary' fontSize={16} py={3}
                                    fontFamily="Lato"
                                    as="pre"
                                    sx={{
                                        "white-space": "-moz-pre-wrap",
                                        "white-space": "-o-pre-wrap",
                                        "word-wrap": "break-word",
                                        "white-space": "pre-wrap",
                                    }}
                                >
                                    {currentTicket.message}
                                </Box>
                            </Box>
                            {currentTicket.files?.length ? 
                                <Box>
                                    <Text>Attached Files</Text>
                                    <Flex wrap='wrap'>
                                        {currentTicket.files.map((file, i) =>{
                                            let imageType = file.mimeType ? file.mimeType.split('/')[0] === 'image' : false
                                            
                                            return(
                                                <Box key={file._id} py={2} pr={2}>
                                                    <VStack py={1} px={3} border='1px dashed #D6DBDF' cursor='pointer' onClick={() => window.open(file.url, '_blank')}>
                                                        {imageType ?
                                                            <HStack justifyContent='center' boxSize={100}>
                                                                <Image src={file.url} h='100%'/>
                                                            </HStack>
                                                            :
                                                            <AiOutlineFileText fontSize={100} />
                                                        }
                                                        <Text fontSize='sm'>File {++i}</Text>
                                                    </VStack>
                                                </Box>      
                                            )
                                        } 
                                        )}
                                    </Flex>
                                </Box>
                                :
                                null
                            }
                            <br/>
                            <DiscussionComments disableReply={true} placeholder='Add comment...' itemModel = {"Topic"} itemModal='Ticket' showAttachment={true} inputStyle="flushed" itemId={params.id}/>
                        </Box>
                        :
                        null
                    }
                </ErrorChecker>
            </Box>
        </div>
    )
}