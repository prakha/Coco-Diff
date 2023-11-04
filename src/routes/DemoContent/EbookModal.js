import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay } from '@chakra-ui/react'
import React from 'react'
import { useFullScreenHandle } from 'react-full-screen';
import { PdfViewer } from '../../Components/PDFViewer/PdfViewer'

export const EbookModal = ({document, closeModal, visible}) => {

    console.log('docuemnt', document)
    return(
        <Modal onClose={closeModal} size={'4xl'} isOpen={visible}>
            <ModalOverlay/>
            <ModalContent>
                <ModalHeader>{document.name}</ModalHeader>
                <ModalCloseButton/>
                <ModalBody>
                    <div dangerouslySetInnerHTML={{__html:document.data.value}}/>
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}