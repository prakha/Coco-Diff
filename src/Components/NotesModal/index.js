import { Button, ButtonGroup, IconButton } from '@chakra-ui/button'
import { Box, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerFooter, DrawerHeader, DrawerOverlay, Accordion, AccordionItem, AccordionButton, AccordionIcon, 
    AccordionPanel, FormControl, HStack, Text, Popover, PopoverTrigger, PopoverContent, PopoverHeader, PopoverBody, PopoverArrow, PopoverCloseButton,
    Divider,
} from '@chakra-ui/react'
import _ from 'lodash'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { STATUS } from '../../App/Constants'
import { deleteNoteAction, getNotesAction } from '../../redux/reducers/notes'
import { ErrorChecker } from '../ErrorChecker'
import { AddIcon, DeleteIcon, EditIcon } from '@chakra-ui/icons'
import { AddNoteModal } from './AddNoteModal'
import moment from 'moment'

export const NotesModal = ({visible, closeModal, dataList, currentData}) => {
    const dispatch = useDispatch()
    const {getNotesStatus, notesList} = useSelector(state => ({
        getNotesStatus:state.notes.getNotesStatus,
        notesList:state.notes.notesList
    }))

    useEffect(() => {
        dispatch(getNotesAction({dataIds:dataList?.length ? dataList.map(d => d._id) : []}))
    }, [dataList, dispatch])

    return(
        <Drawer isOpen={visible} size='xl' onClose={closeModal}>
            <DrawerOverlay />
            <DrawerContent>
                <DrawerHeader>Notes</DrawerHeader>
                <DrawerCloseButton />
                <DrawerBody color='#34495E'>
                    <ErrorChecker status={getNotesStatus === STATUS.FETCHING}>
                        <Box>
                            <Accordion allowMultiple defaultIndex={[0]}>
                                <DataBox notesList={notesList} data={currentData} currentData={currentData}/>
                                
                                {dataList?.length ?  _.filter(dataList,d => d._id !== currentData._id).map(data => 
                                    <DataBox notesList={notesList} data={data} currentData={currentData}/>
                                ) : null}
                            </Accordion>
                        </Box>
                    </ErrorChecker>
                </DrawerBody>
                <DrawerFooter>
                    <Button colorScheme="blue" mr={3} onClick={closeModal}>
                        Close
                    </Button>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}

let DataBox = ({data, notesList, currentData}) => {
    const [addModal, changeAddModal] = useState()
    const {addNotesStatus} = useSelector(state => ({
        addNotesStatus:state.notes.addNotesStatus
    }))

    useEffect(() => {
        if(addNotesStatus === STATUS.SUCCESS)
            changeAddModal(false)
    }, [addNotesStatus])

    const handleAddNoteModal = () => {
        changeAddModal(!addModal)
    }

    return(
        <AccordionItem my={2}>
            <AccordionButton border='1px solid #D6DBDF' b borderBottom={0} _expanded={{ elevation: 2, color:"blue.600" }}>
                <Box flex={1} textAlign='left' fontWeight="900" >{data.name}</Box>
                <AccordionIcon fontSize={22}/>
            </AccordionButton>
            <AccordionPanel py={5} border='1px solid #D6DBDF' borderTop={0}>
                {currentData._id === data._id ?
                    <Button width='100%' leftIcon={<AddIcon/>} onClick={handleAddNoteModal}>Add New</Button>
                    : null
                }
                {_.filter(notesList,n => n.dataId === data._id).length ?
                    _.filter(_.orderBy(notesList, ['createdAt'], ['desc']),n => n.dataId === data._id).map(note => {
                        return(
                            <NoteBox currentData={currentData} key={note._id} note={note} data={data}/>
                        )
                    })
                    :
                    <Text color='#85929E' mt={2}>No notes added</Text>
                }
                {addModal ? <AddNoteModal visible={addModal} data={data} closeModal={handleAddNoteModal} /> : null}
            </AccordionPanel>
        </AccordionItem>
    )
}

let NoteBox = ({data, note, currentData}) => {
    const dispatch = useDispatch()
    const {updateNoteStatus, deleteNoteStatus} = useSelector(state => ({
        updateNoteStatus:state.notes.updateNoteStatus,
        deleteNoteStatus:state.notes.deleteNoteStatus
    }))
    const [updateModal, changeUpdateModal] = useState()

    useEffect(() => {
        if(updateNoteStatus === STATUS.SUCCESS)
            changeUpdateModal(false)
    }, [updateNoteStatus])

    const handleDelete = () => {
        dispatch(deleteNoteAction({noteId:note._id}))
    }

    const handleUpdate = () => {
        changeUpdateModal(!updateModal)
    }
    return(
        <>
            <Box padding={3} borderRadius={5}>
                {/* <Box marginY={4} padding={3} borderRadius={5} boxShadow='rgba(17, 17, 26, 0.05) 0px 1px 0px, rgba(17, 17, 26, 0.1) 0px 0px 8px'> */}
                <FormControl>
                        <HStack justifyContent='space-between' background=''>
                            <Text color='#85929E' fontSize={14}>{moment(data.createdAt).format('LLLL')}</Text>
                            {currentData._id === data._id ?
                                <ButtonGroup size='sm'>
                                    <IconButton background='white' onClick={handleUpdate} variant='outline' icon={<EditIcon/>}/>
                                    <Popover placement='left'>
                                        <PopoverTrigger>
                                            <IconButton background='white' variant='outline' icon={<DeleteIcon/>}/>
                                        </PopoverTrigger>
                                        <PopoverContent>
                                        <PopoverArrow />
                                        <PopoverCloseButton/>
                                        <PopoverHeader>Are you sure?</PopoverHeader>
                                        <PopoverBody>
                                            <Button colorScheme="blue" float='right' isLoading={deleteNoteStatus === STATUS.FETCHING} onClick={handleDelete}>Confirm</Button>
                                        </PopoverBody>
                                        </PopoverContent>
                                    </Popover>
                                </ButtonGroup>
                                : null
                            }
                        </HStack>
                    <Box borderRadius={2}>
                        <Box
                            fontSize="md"
                            my={4}
                            fontFamily="Lato"
                            as="pre"
                            sx={{
                                "white-space": "-moz-pre-wrap",
                                "white-space": "-o-pre-wrap",
                                "word-wrap": "break-word",
                                "white-space": "pre-wrap",
                            }}
                        > 
                            {note.note}
                        </Box>
                    </Box>
                </FormControl>
                {updateModal ? <AddNoteModal visible={updateModal} defaultNote={note} closeModal={handleUpdate} /> : null}
            </Box>
            <Divider/>
        </>
    )
}