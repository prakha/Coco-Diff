import { Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay } from '@chakra-ui/react'
import React from 'react'
import { useFullScreenHandle } from 'react-full-screen';
import { BsArrowsFullscreen } from 'react-icons/bs';
import { PdfViewer } from '../../Components/PDFViewer/PdfViewer'

export const PDFModal = ({document, closeModal, visible}) => {
    const fullScreenHandle = useFullScreenHandle();

    console.log('docuemnt', document)
    return(
        <Modal onClose={closeModal} size={'4xl'} isOpen={visible}>
            <ModalOverlay/>
            <ModalContent>
                <ModalHeader>{document.name}</ModalHeader>
                <ModalCloseButton/>
                <ModalBody>
                    <Button size='sm' mb={5} onClick={fullScreenHandle.enter} leftIcon={<BsArrowsFullscreen/>}>Fullscreen</Button>
                    <PdfViewer height='100%' key={document._id} handle={fullScreenHandle} 
                        url={document.data.url + "?origin=" + "http://localhost:3000"}
                    />
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}