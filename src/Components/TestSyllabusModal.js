import React, { useState, useEffect } from 'react'
import {getTestSyllabusAction} from '../redux/reducers/packages'
import {useSelector, useDispatch} from 'react-redux' 
import { 
  Box, Modal, ModalBody, ModalContent, ModalHeader, Tag, Flex, ModalOverlay, Spacer, Divider, HStack,
  Accordion, AccordionItem, AccordionIcon, AccordionButton, AccordionPanel
} from '@chakra-ui/react'

export const TestSyllabusModal = ({visible, closeModal, testId}) => {
    const dispatch = useDispatch()
    const testSyllabus = useSelector(state => state.package?.testSyllabusData)
    useEffect(() => {
        dispatch(getTestSyllabusAction({testId: testId}))
    }, [testId,dispatch])

    let data = _.map(_.groupBy(testSyllabus, 'subject._id'), (s, key) => ({data: s, subject: _.find(testSyllabus, test => test.subject._id == key).subject}))
    return(
         <Modal isOpen={visible} size='4xl' onClose={closeModal}>
            <ModalOverlay />
 	        <ModalContent>
 	        	<ModalHeader>Test Syllabus</ModalHeader>
                <Divider/>
                <ModalBody>
                    {_.map(data, (sub, i) => {
                        return(
                            <div key={i}>
                                <Accordion allowMultiple>
                                  <AccordionItem>
                                    <h2>
                                      <AccordionButton>
                                        <Box flex="1" textAlign="left">
                                          {sub?.subject?.name?.en}
                                        </Box>
                                        <AccordionIcon />
                                      </AccordionButton>
                                    </h2>
                                    <AccordionPanel pb={4}>
                                        {_.map(sub.data, (syll, ind) => {
                                            return(
                                                <HStack spacing={4} key={ind} style={{marginTop: '10px'}}>
                                                    {_.map(syll.chapters, (cha, index) => (
                                                        <Tag size='md' key={index} variant="solid" colorScheme="teal">
                                                            {cha?.name?.en}
                                                        </Tag>
                                                    ))}
                                                </HStack>
                                            )}
                                        )}      
                                    </AccordionPanel>
                                  </AccordionItem>
                                </Accordion>
                            </div>
                        )}
                    )}
                    <br/>
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}
