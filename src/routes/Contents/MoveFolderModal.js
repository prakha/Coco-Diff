import { Box, Button, HStack, List, ListItem, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text } from '@chakra-ui/react'
import _ from 'lodash'
import React, { useEffect, useState } from 'react'
import { AiFillFolder } from 'react-icons/ai'
import { useDispatch, useSelector } from 'react-redux'
import { STATUS } from '../../App/Constants'
import { ErrorChecker } from '../../Components/ErrorChecker'
import { FILE_TYPE } from '../../Constants'
import { addToLibraryAction, getLibFoldersAction, moveLibFileAction, resetGetFolders, resetMoveLibFile } from '../../redux/reducers/library'

export const MoveFolderModal = ({visible, closeModal, file, type, course}) => {
    const dispatch = useDispatch()
    
    const {libraryFolders, getLibFoldersStatus, folderContent, moveLibFileStatus, addToLibraryStatus, updateFolderStatus} = useSelector(state => ({
        libraryFolders:state.library.libraryFolders,
        getLibFoldersStatus:state.library.getLibFoldersStatus,
        folderContent:state.library.folderContent,
        addToLibraryStatus:state.library.addToLibraryStatus,
        updateFolderStatus:state.library.updateFolderStatus,
        moveLibFileStatus:state.library.moveLibFileStatus
    }))

    const [folderslist, setFoldersList] = useState()
    const [currentFolder, changeFolder] = useState()

    let inLibrary = file.libType

    useEffect(() => {
        dispatch(getLibFoldersAction())

        return () => {
            !inLibrary && dispatch(resetGetFolders())
            dispatch(resetMoveLibFile())
        }
    }, [])

    useEffect(() => {
        if(getLibFoldersStatus === STATUS.SUCCESS){
            setFoldersList(libraryFolders)
            changeFolder(libraryFolders)
        }
    }, [getLibFoldersStatus, libraryFolders])

    useEffect(() => {
        if(updateFolderStatus === STATUS.SUCCESS || addToLibraryStatus === STATUS.SUCCESS || moveLibFileStatus === STATUS.SUCCESS)
            closeModal()
    }, [updateFolderStatus, addToLibraryStatus, moveLibFileStatus, closeModal])

    const selectFolder = (fldr) => {
        if(currentFolder && currentFolder._id === fldr._id)
            changeFolder(libraryFolders._id)
        else
            changeFolder(fldr)
    }

    // const openFolder = (fldr) => {
    //     dispatch(getLibraryAction({folderId:fldr._id}))
    // }

    // const prevFolder = () => {
    //     dispatch(getLibraryAction({folderId:folderslist.parentFolder._id}))
    // }

    // const backToHome = () => {
    //     setFoldersList(libraryFolders)
    //     changeFolder(null)
    // }

    const copyFile = () => {
        
        let data = {name:file.name, libType:'Library', type:FILE_TYPE[type], courseId:course, contentId:file.subject,  fileDataId:file.data?._id || file.data,
                fileContentId:file._id, chapterId:file.chapterId, folderId:currentFolder?._id || null
            }
        data = _.omitBy(data, d => !d)
        dispatch(addToLibraryAction(data))
    }
    
    const moveFile = () => {
        let data = {folderId:currentFolder._id, fileId:file._id}
        dispatch(moveLibFileAction(data))
    }

    return(
        <Modal isOpen={visible} size='md' onClose={closeModal}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Move File</ModalHeader>
            <ModalCloseButton />
            
            <ModalBody p={0}>
                <ErrorChecker status={getLibFoldersStatus} size='md'>
                    <Box height='300pt' borderBottom='1px solid #3498DB' borderTop='1px solid #3498DB' overflow='auto'>
                        {folderslist ?
                            <Box py={2} px={4}>
                                <Text fontSize='16px' fontWeight='bold' color='blue.500'>Library</Text>
                                {/* <HStack py={2} px={4}>
                                    {!folderslist.parentFolder? 
                                        <Button variant='ghost' colorScheme='blue' onClick={backToHome} leftIcon={'' } fontSize='16px' iconSpacing={3} size='sm'>
                                            {folderslist.folderName}
                                        </Button>
                                        :folderslist.parentFolder ?
                                            <Button variant='ghost' colorScheme='blue' onClick={prevFolder} leftIcon={'' } fontSize='16px' iconSpacing={3} size='sm'>
                                                {folderslist.parentFolder ? folderslist.folderName : '' }
                                            </Button>
                                            :
                                            <Box px={4}>
                                                <Text fontSize='16px' color='#1494E9' fontWeight='bold'>Home</Text>
                                            </Box>
                                    }   
                                </HStack> */}
                            </Box>
                            :
                            null
                        }
                        
                        <ErrorChecker status={getLibFoldersStatus}>
                            {getLibFoldersStatus === STATUS.SUCCESS && folderslist?.length ?
                                <Box>
                                    <List>
                                        {_.orderBy(folderslist, ['createdAt'], ['desc']).map(fldr =>
                                            {
                                                let active = currentFolder?._id === fldr._id
                                                return(
                                                    <ListItem cursor='pointer' className={active ? 'activeFolderTab' : 'folderTab'} onClick={() => selectFolder(fldr)} key={fldr._id} p={2}>
                                                        <HStack px={6} justifyContent='space-between'>
                                                            <HStack spacing={4}>
                                                                <AiFillFolder fontSize='22px' color={active ? 'white' : '#AEB6BF'}/> 
                                                                <Text>{fldr.folderName}</Text>
                                                            </HStack>
                                                            {/* <Box>
                                                                <IconButton onClick={() => openFolder(fldr)} variant='ghost' colorScheme='blue' size='sm' 
                                                                    icon={<AiOutlineRight fontSize='18px'/>}
                                                                    color={active ? 'white' : ''}
                                                                />
                                                            </Box> */}
                                                        </HStack>
                                                    </ListItem>
                                                )
                                            }
                                        )}
                                    </List>
                                </Box>
                                :
                                <HStack alignItems='center' justifyContent='center' textAlign='center' minHeight='200px'>
                                    <Text>This is Empty</Text>
                                </HStack>
                            }
                        </ErrorChecker>
                    </Box>
                </ErrorChecker>
            </ModalBody>

            <ModalFooter>
                <Button variant='ghost' mr={3} onClick={closeModal}>Close</Button> 
                            
                {inLibrary ? 
                    <Button colorScheme="blue" onClick={moveFile} isLoading={moveLibFileStatus === STATUS.FETCHING}>{currentFolder ? 'Move' : 'Move Here'}</Button>
                    :
                    <Button colorScheme="blue" onClick={copyFile} isLoading={addToLibraryStatus === STATUS.FETCHING}>{currentFolder ? 'Add' : 'Add Here'}</Button>
                }
            
            </ModalFooter>
            </ModalContent>
        </Modal>
    )
}