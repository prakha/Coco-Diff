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
import { addFolderAction, addChildFolderAction, getLibraryAction, resetAddFolderStatus, updateFolderAction } from '../../redux/reducers/library'

export const AddFolderModal = ({visible, closeModal, parentFolder, currentFolder}) => {
    const dispatch = useDispatch()

    const [name, changeName] = useState('')

    const {addFolderStatus, getLibraryStatus, libraryContent, addChildFolderStatus, updateFolderStatus, folderError} = useSelector(state => ({
        addFolderStatus:state.library.addFolderStatus,
        getLibraryStatus:state.library.getLibraryStatus,
        libraryContent:state.library.libraryContent,
        addChildFolderStatus:state.library.addChildFolderStatus,
        updateFolderStatus:state.library.updateFolderStatus,
        folderError:state.library.folderError
    }))

    // useEffect(() => {
    //     if(getLibraryStatus != STATUS.SUCCESS)
    //         dispatch(getLibraryAction())
    // }, [getLibraryStatus])

    useEffect(() => {
        if(currentFolder)
            changeName(currentFolder.folderName)
        
            return () => dispatch(resetAddFolderStatus())
    }, [])

    useEffect(() => {
        if(addFolderStatus == STATUS.SUCCESS || updateFolderStatus == STATUS.SUCCESS)
            closeModal()
    }, [addFolderStatus, updateFolderStatus])
    
    const addFolder = (e) => {
        e.preventDefault()
        let data = {folderName:name, type:'Library', parentFolder }
        dispatch(addFolderAction(data))
    }

    const updateFolder = (e) => {
        e.preventDefault()
        dispatch(updateFolderAction({folderName:name, folderId:currentFolder._id}))
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
                <ErrorChecker status={getLibraryStatus}>
                    {getLibraryStatus == STATUS.SUCCESS ? 
                        <ModalBody>
                            <form onSubmit={currentFolder ? updateFolder : addFolder}>
                                <FormControl>
                                    <FormLabel>Folder Name</FormLabel>
                                    <Input type="text" value={name} autoFocus onChange={_changeName} placeholder='Folder name' />
                                    <FormHelperText color='brand.red'>{folderError?.message}</FormHelperText>
                                </FormControl>
                                <br/>
                                <Box float='right'> 
                                        <ButtonX type='submit'  disabled={!name}
                                            isLoading={addFolderStatus == STATUS.FETCHING || updateFolderStatus == STATUS.FETCHING} 
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