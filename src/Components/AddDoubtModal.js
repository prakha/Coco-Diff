import React, { useState, useEffect } from 'react'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    HStack,
    VStack,
    Text,
    Alert,
    Center
} from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons'
import {
    Box,
    FormControl,
    FormLabel,
    Input,
    Image,
    Textarea, IconButton, Tooltip
} from "@chakra-ui/react";
import { STATUS } from '../App/Constants'
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { CloseIcon } from "@chakra-ui/icons";
import _, { forEach } from 'lodash';
import {
    createNewDoubt,
    resetAddDoubtStatus
  } from "../redux/reducers/doubt";
import { GiFreedomDove } from 'react-icons/gi';




export default function Adddoubtmodal(props) {
    const { hideModal, staffId } = props;
    const dispatch = useDispatch();
    const history = useHistory();
    const doubtReducer = useSelector( state => state.doubts );
    const { createNewDoubtStatus } = doubtReducer;
    const [ doubt, setDoubt] = useState("");
    const [ selectedFiles, setFiles ] = useState([]);

    const hiddenFileInput = React.useRef(null);

    useEffect( () => {
        if( createNewDoubtStatus === STATUS.SUCCESS ){
            dispatch(resetAddDoubtStatus());
            hideModal()
        }
    } )

    const handleClick = (event) => {
        hiddenFileInput.current.click();
    };

    const handleSelectFile = (d) => {
        console.log('selectedFiles',selectedFiles)
        setFiles(files => [...files, ...d])
      }
    
      const handleRemoveFile = (indx) => {
        let data = [...selectedFiles]
        _.remove(data, (d,i) => i === indx )
        setFiles(data)
      }
    
    const handleAskDoubt = () => {
        let formData = new FormData()
        selectedFiles.map((file,i) => 
        formData.append(`upload[${i}]`, file)
        )
        
        formData.append(`doubt`, doubt)
        formData.append('staff', staffId )
        dispatch(createNewDoubt(formData))
    }
    
    return (
        <Modal size="lg" isOpen={true} onClose={hideModal}>
            <ModalOverlay />
            <ModalContent>
                <ModalCloseButton />
                <ModalBody>
                    <Box>
                        <Box
                            p="2rem 0rem"
                            my="2rem"
                            bg="white"
                            borderRadius="lg"
                        >
                            <HStack>
                                <Box flexGrow='1'>
                                    <VStack alignItems="flex-start">
                                        <Text fontSize="heading" fontWeight="bold" marginBottom="2rem">
                                            Ask your doubt
                                        </Text>
                                        <form style={{ width: "100%" }} onSubmit={() => console.log('asdf')}>

                                            <FormControl id="Doubt" isRequired mb="20px">
                                                <FormLabel>Enter your doubt</FormLabel>
                                                <Textarea rows={6}
                                                    type="text" 
                                                    placeholder='Type your doubt'
                                                    value={doubt}
                                                    onChange={(e) => setDoubt(e.target.value)}
                                                />
                                            </FormControl>
                                            { selectedFiles.length ?
                                                    <VStack mt={2} align='stretch'>
                                                        {selectedFiles.map((file, i) =>
                                                            <HStack key={i} my={1} borderBottom='1px dashed' justifyContent='space-between'>
                                                                <Text fontSize='sm'>{file?.name}</Text>
                                                                <Box>
                                                                    <Tooltip label='Remove' placement='right'>
                                                                        <IconButton bg="white" icon={<CloseIcon fontSize={10} />} size='xs' onClick={() => handleRemoveFile(i)} />
                                                                    </Tooltip>
                                                                </Box>
                                                            </HStack>
                                                        )}
                                                    </VStack>
                                                    : null
                                                }
                                            <FormControl id="attachment" mb="20px">
                                                {/*<Center m={4} >
                                                    <Button w='75%' colorScheme='teal' onClick={handleClick}>
                                                        <AddIcon m={3}/> Attachments
                                                    </Button>
                                            </Center>*/}
                                                <input
                                                    multiple
                                                    {...{ accept: "*/*" }}
                                                    type="file"
                                                    ref={hiddenFileInput}
                                                    onChange={ (e) => handleSelectFile(e.target.files) }
                                                    style={{ display: "none" }}
                                                />
                                            </FormControl>
                                        </form>
                                    </VStack>
                                </Box>
                                {/* <Box width="50%">
                                    <VStack>
                                        <Box
                                            style={{
                                                padding: "8px 15px",
                                                borderRadius: "999px",
                                                boxShadow: "sm",
                                                backgroundColor: "#FFE3E2",
                                            }}
                                            as="a"
                                            href="tel:7869961760"
                                        >
                                            <HStack>
                                                <BiPhoneCall
                                                    style={{
                                                        backgroundColor: "#EF5261",
                                                        borderRadius: "999px",
                                                        fontSize: "25px",
                                                        padding: "5px",
                                                    }}
                                                    color="#F6C863"
                                                />
                                                <Text fontSize="sm" fontWeight="bold">
                                                    FOR SUPPORT : 7869961760
                                                </Text>
                                            </HStack>
                                        </Box>
                                        <Box p="2rem">
                                            <Image
                                                src={bannerImage}
                                                width="280px"
                                                fallbackSrc="https://via.placeholder.com/150"
                                            />
                                        </Box>
                                    </VStack>
                                </Box> */}
                            </HStack>
                        </Box>
                        {/* <Box p="2rem" marginX="2rem" marginY="2rem" borderRadius="lg">
        <Text fontSize="heading" fontWeight="bold" marginBottom="2rem">
          Frequently Asked Questions
        </Text>
        <FAQContent />
      </Box> */}
                    </Box>
                </ModalBody>

                <ModalFooter>
                    <Button variant='ghost' mr={3} onClick={hideModal} isDisabled={ createNewDoubtStatus === STATUS.FETCHING }>
                        Close
                    </Button>
                    <Button colorScheme='blue' isLoading = { createNewDoubtStatus === STATUS.FETCHING } onClick={ handleAskDoubt }>Ask</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}
