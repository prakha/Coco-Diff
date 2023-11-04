import { Box, Flex, HStack, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Text } from '@chakra-ui/react';
import React, { useState } from 'react'
import { BsInfoCircleFill } from 'react-icons/bs';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';


export const NoticeBoard = () => {
    const history = useHistory()
  
    const {notices} = useSelector(state => ({
      notices:state.package.notices
    }))
    
    const colors = ['#FD9F27', '#4285F4', '#169D58']
    let colorIndex = 0
    // console.log('config', config)

    const [noticeModal, openNoticeModal] = useState()

    const openNotice = (notice) => {
        openNoticeModal(notice)
    }

    return (
      <Box bg="white" boxShadow="lg" p={"2"}>
        <HStack justifyContent='space-between'>
          <Text px={2} style={{ fontSize: "18px" }}>
            New Updates
          </Text>
          <Text onClick={() => history.push('/notices-events')} fontSize='sm' color='brand.red' cursor='pointer'>View All</Text>
        </HStack>
        {notices?.length ?  
          notices.map((notice, i) => {
            let color = colors[colorIndex]
            colorIndex = colorIndex == colors.length ? 0 : ++colorIndex
            return (
              <Box key={i} p={2} >
                <Box cursor='pointer' onClick={() => openNotice(notice)} style={{ border: "2px solid #E3EAED", padding: "4px 6px"}}>
                  <Flex
                    align='center'
                    style={{borderLeft: "3px solid "+color, borderRadius:'2px'}}>
                    <Box p={3}>
                      <BsInfoCircleFill style={{ color: color, fontSize: "24px" }}/>
                    </Box>
                    <Box style={{ width: "87%" }}>
                      <Text  fontSize="">
                        {notice.title}
                      </Text>
                      <Text color="gray.500" fontSize="sm">
                        {notice.body?.length > 40 ? notice.body.substr(0, 40)+'...' : notice.body}
                      </Text>
                    </Box>
                  </Flex>
                </Box>
              </Box>
            )
          })
          :
          <Text p={2} fontSize='sm' color='gray.600'>No notice added</Text>
        }
        {noticeModal? <NoticeModal visible={noticeModal} notice={noticeModal} closeModal={openNotice}/> : null}
      </Box>
    );
  };

export const NoticeModal = ({visible, closeModal, notice}) => {
    return (
        <Modal isOpen={visible} size='3xl' onClose={closeModal}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>{notice.title}</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Box
                      as={"pre"}
                      fontSize="sm"
                      flex={1}
                      p={3}
                      sx={{
                        "white-space": "-moz-pre-wrap",
                        "white-space": "-o-pre-wrap",
                        "word-wrap": "break-word",
                        "white-space": "pre-wrap",
                      }}
                      color="gray.700"
                      dangerouslySetInnerHTML={{
                        __html: notice.body,
                      }}
                    ></Box>
                    <br/>
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}