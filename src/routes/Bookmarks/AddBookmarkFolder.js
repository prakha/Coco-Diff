import { Button } from '@chakra-ui/button'
import { FormControl, FormHelperText, FormLabel } from '@chakra-ui/form-control'
import { Input } from '@chakra-ui/input'
import { Box } from '@chakra-ui/layout'
import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay } from '@chakra-ui/modal'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { STATUS } from '../../App/Constants'
import { ButtonX } from '../../Components/ButtonX'
import { ErrorChecker } from '../../Components/ErrorChecker'
import { addBkmrkChildFolderAction, addBkmrkFolderAction, getBookmarkAction, resetAddFolderStatus, updateBkmrkFolderAction } from '../../redux/reducers/bookmarks'

export const AddBookmarkFolderModal = ({visible, closeModal, parentFolder, currentFolder}) => {
    const dispatch = useDispatch()

    const [name, changeName] = useState('')

    const {addBkmrkFolderStatus, getBookmarkStatus, bookmarkContent, addBkmrkChildFolderStatus, updateBkmrkFolderStatus, folderError} = useSelector(state => ({
        addBkmrkFolderStatus:state.bookmark.addBkmrkFolderStatus,
        getBookmarkStatus:state.bookmark.getBookmarkStatus,
        bookmarkContent:state.bookmark.bookmarkContent,
        addBkmrkChildFolderStatus:state.bookmark.addBkmrkChildFolderStatus,
        updateBkmrkFolderStatus:state.bookmark.updateBkmrkFolderStatus,
        folderError:state.bookmark.folderError
    }))

    // useEffect(() => {
    //     if(getBookmarkStatus != STATUS.SUCCESS)
    //         dispatch(getBookmarkAction())
    // }, [getBookmarkStatus])

    useEffect(() => {
        if(currentFolder)
            changeName(currentFolder.folderName)
        
        return () => dispatch(resetAddFolderStatus())
    }, [])

    useEffect(() => {
        if(addBkmrkFolderStatus == STATUS.SUCCESS || updateBkmrkFolderStatus == STATUS.SUCCESS)
            closeModal()
    }, [addBkmrkFolderStatus, addBkmrkChildFolderStatus, updateBkmrkFolderStatus])
    
    const addFolder = (e) => {
        e.preventDefault()
        let data = {folderName:name, type:'Bookmark', parentFolder }
        dispatch(addBkmrkFolderAction(data))
    }

    const updateFolder = (e) => {
        e.preventDefault()
        dispatch(updateBkmrkFolderAction({folderName:name, folderId:currentFolder._id}))
    }

    const _changeName = (e) => {
        changeName(e.target.value)
    }

    return(
        <Modal isOpen={visible} onClose={closeModal}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>{currentFolder ? 'Update Folder' : 'Add New Folder'}</ModalHeader>
                <ModalCloseButton />
                <ErrorChecker status={getBookmarkStatus}>
                    {getBookmarkStatus == STATUS.SUCCESS ? 
                        <ModalBody>
                            <form onSubmit={currentFolder ? updateFolder : addFolder}>
                                <FormControl>
                                    <FormLabel>Folder Name</FormLabel>
                                    <Input type="text" value={name} autoFocus onChange={_changeName} placeholder='Folder name' />
                                    <FormHelperText color='brand.red'>{folderError?.message}</FormHelperText>
                                </FormControl>
                                <br/>
                                <Box float='right'> 
                                        <ButtonX type='submit' disabled={!name}
                                            isLoading={addBkmrkChildFolderStatus == STATUS.FETCHING || addBkmrkFolderStatus == STATUS.FETCHING || updateBkmrkFolderStatus == STATUS.FETCHING} 
                                            >
                                            {currentFolder ? 'Update' : 'Add'}
                                        </ButtonX>
                                </Box>
                            </form>
                        </ModalBody>
                        :
                        null
                    }
                </ErrorChecker>
            </ModalContent>
        </Modal>
    )
}