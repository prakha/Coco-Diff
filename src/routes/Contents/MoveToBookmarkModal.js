import { Box, Button, HStack, IconButton, List, ListItem, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text } from '@chakra-ui/react'
import _ from 'lodash'
import React, { useEffect, useState } from 'react'
import { AiFillFolder, AiOutlineArrowLeft, AiOutlineRight } from 'react-icons/ai'
import { useDispatch, useSelector } from 'react-redux'
import { STATUS } from '../../App/Constants'
import { ErrorChecker } from '../../Components/ErrorChecker'
import { FILE_TYPE } from '../../Constants'
import { addToBookmarkAction, getBkmrkFoldersAction, resetGetFolders, updateBkmrkFolderAction, resetMoveLibFile, moveBkmrkFileAction } from '../../redux/reducers/bookmarks'

export const MoveToBookmarkModal = ({visible, closeModal, file, type, course}) => {
    const dispatch = useDispatch()
    
    const {bookmarkFolders, getBkmrkFoldersStatus, folderContent, moveBkmrkFileStatus, addToBookmarkStatus, updateBkmrkFolderStatus, getBookmarkStatus} = useSelector(state => ({
        bookmarkFolders:state.bookmark.bookmarkFolders,
        getBkmrkFoldersStatus:state.bookmark.getBkmrkFoldersStatus,
        folderContent:state.bookmark.folderContent,
        addToBookmarkStatus:state.bookmark.addToBookmarkStatus,
        updateBkmrkFolderStatus:state.bookmark.updateBkmrkFolderStatus,
        getBookmarkStatus:state.bookmark.getBookmarkStatus,
        moveBkmrkFileStatus:state.bookmark.moveBkmrkFileStatus
    }))

    const [folderslist, setFoldersList] = useState()
    const [currentFolder, changeFolder] = useState()
    const inBookmark = file.libType

    useEffect(() => {
        dispatch(getBkmrkFoldersAction())

        return () => {
            !inBookmark && dispatch(resetGetFolders())
            dispatch(resetMoveLibFile())
        }
    }, [])

    useEffect(() => {
        if(getBkmrkFoldersStatus == STATUS.SUCCESS && bookmarkFolders){
            setFoldersList(bookmarkFolders)
            changeFolder(bookmarkFolders)
        }
    }, [getBkmrkFoldersStatus, bookmarkFolders])

    useEffect(() => {
        if(updateBkmrkFolderStatus == STATUS.SUCCESS || addToBookmarkStatus == STATUS.SUCCESS || moveBkmrkFileStatus == STATUS.SUCCESS)
            closeModal()
    }, [updateBkmrkFolderStatus, addToBookmarkStatus, moveBkmrkFileStatus])

    const selectFolder = (fldr) => {
        if(currentFolder && currentFolder._id == fldr._id)
            changeFolder(bookmarkFolders._id)
        else
            changeFolder(fldr)
    }

    // const openFolder = (fldr) => {
    //     dispatch(getBkmrkFoldersAction({folderId:fldr._id}))
    // }

    // const prevFolder = () => {
    //     dispatch(getBkmrkFoldersAction({folderId:folderslist.parentFolder._id}))
    // }

    const backToHome = () => {
        setFoldersList(bookmarkFolders)
        changeFolder(null)
    }

    const copyFile = () => {
        let data = {name:file.name, libType:'Bookmark', type:FILE_TYPE[type], courseId:course, contentId:file.subject,  fileDataId:file.data._id || file.data,
                chapterId:file.chapterId, folderId:currentFolder?._id || null
            }
        data = _.omitBy(data, d => !d)
        dispatch(addToBookmarkAction(data))
    }

    const moveFile = () => {
        let data = {folderId:currentFolder._id, fileId:file._id}
        dispatch(moveBkmrkFileAction(data))
    }

    return(
        <Modal isOpen={visible} size='md' onClose={closeModal}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Bookmark to</ModalHeader>
            <ModalCloseButton />
            
            <ModalBody p={0} zIndex='99999999'>
                <ErrorChecker status={getBkmrkFoldersStatus} size='md'>
                    <Box height='300pt' borderBottom='1px solid #3498DB' borderTop='1px solid #3498DB' overflow='auto'>
                        {folderslist ?
                            <Box py={2} px={4}>
                                <Text fontSize='16px' fontWeight='bold' color='blue.500'>Bookmark</Text>
                                {/* <HStack py={2} px={4}>
                                    {!folderslist.parentFolder &&  folderslist.bookmark ? 
                                        <Button variant='ghost' colorScheme='blue' onClick={backToHome} leftIcon={<AiOutlineArrowLeft fontSize='18px'/> } fontSize='16px' iconSpacing={3} size='sm'>
                                            {folderslist.folderName}
                                        </Button>
                                        :folderslist.parentFolder ?
                                            <Button variant='ghost' colorScheme='blue' onClick={prevFolder} leftIcon={<AiOutlineArrowLeft fontSize='18px'/> } fontSize='16px' iconSpacing={3} size='sm'>
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
                        <ErrorChecker status={getBkmrkFoldersStatus}>
                            {getBkmrkFoldersStatus == STATUS.SUCCESS && folderslist?.length ?
                                <Box>
                                    <List>
                                        {_.orderBy(folderslist, ['createdAt'], ['desc']).map(fldr =>
                                            {
                                                let active = currentFolder?._id == fldr._id
                                                return(
                                                    <ListItem cursor='pointer' className={active ? 'activeFolderTab' : 'folderTab'} onClick={() => selectFolder(fldr)} key={fldr._id} p={2}>
                                                        <HStack px={6} justifyContent='space-between'>
                                                            <HStack spacing={4}>
                                                                <AiFillFolder fontSize='22px' color={active ? 'white' : '#AEB6BF'}/> 
                                                                <Text>{fldr.folderName}</Text>
                                                            </HStack>
                                                            {/* <Box>
                                                                <IconButton onClick={''} variant='ghost' colorScheme='blue' size='sm' 
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
                {inBookmark ? 
                    <Button colorScheme="blue" onClick={moveFile} isLoading={moveBkmrkFileStatus == STATUS.FETCHING}>{currentFolder ? 'Move' : 'Move Here'}</Button>
                    :
                    <Button colorScheme="blue" onClick={copyFile} isLoading={addToBookmarkStatus == STATUS.FETCHING}>{currentFolder ? 'Add' : 'Add Here'}</Button>
                }
            </ModalFooter>
            </ModalContent>
        </Modal>
    )
}