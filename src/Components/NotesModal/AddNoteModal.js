import { Button } from '@chakra-ui/button'
import { Box } from '@chakra-ui/layout'
import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from '@chakra-ui/modal'
import { Textarea } from '@chakra-ui/textarea'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { STATUS } from '../../App/Constants'
import { addNotesAction, updateNoteAction } from '../../redux/reducers/notes'

export const AddNoteModal = ({visible, closeModal, data, defaultNote}) => {
    const dispatch = useDispatch()
    const {addNotesStatus, updateNoteStatus} = useSelector(state => ({
        addNotesStatus:state.notes.addNotesStatus,
        updateNoteStatus:state.notes.updateNoteStatus
    }))
    const [noteText, changeText] = useState('')

    useEffect(() => {
        if(defaultNote)
            changeText(defaultNote.note)
    }, [defaultNote])

    const handleText = (e) => {
        changeText(e.target.value)
    }

    const handleAddNote = () => {
        let noteData = {note:noteText, dataId:data._id}
        dispatch(addNotesAction(noteData))
    }

    const handleUpdateNote = () => {
        const data = {noteId:defaultNote._id, note:noteText}
        dispatch(updateNoteAction(data))
    }

    return(
        <Modal isOpen={visible} size='6xl' onClose={closeModal}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Add Note</ModalHeader>
                <ModalCloseButton />
                <ModalBody color='#34495E'>
                    <Textarea autoFocus={true} value={noteText} rows={20} onChange={handleText} placeholder='Write your note here'/>
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme="blue" mr={3} onClick={closeModal}>Close</Button>
                    <Button onClick={defaultNote ? handleUpdateNote : handleAddNote} 
                        isLoading={addNotesStatus === STATUS.FETCHING || updateNoteStatus === STATUS.FETCHING}
                    >
                        {defaultNote ? 'Update' : 'Add'}
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}