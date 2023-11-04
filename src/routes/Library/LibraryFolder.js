import { Box, HStack, Text, Button, VStack, Popover, PopoverTrigger, IconButton, PopoverContent, PopoverArrow, PopoverBody, List, ListItem, useDisclosure } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { AiFillFilePdf, AiFillFileText, AiFillFolder, AiFillFolderAdd, AiFillVideoCamera, AiOutlineArrowLeft, AiOutlineDelete, AiOutlineEdit } from 'react-icons/ai'
import { BsMusicNote } from 'react-icons/bs'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useLocation, useParams } from 'react-router'
import { STATUS } from '../../App/Constants'
import { ContentNavBar } from '../../Components/ContentNavBar'
import { ErrorChecker } from '../../Components/ErrorChecker'
import { getFoldersAction, getLibraryAction, removeFolderAction, resetGetFolders } from '../../redux/reducers/library'
import { AddFolderModal } from './AddFolderModal'
import { AudioLibrary } from './AudioLibrary'
import { VideoLibrary } from './VideoLibrary'
import _ from 'lodash';
import { PDFLibrary } from './PFDLibrary'
import { SectionHeader } from '../../Components/SectionHeader'
import { ROUTES } from '../../Constants/Routes'
import { FiMoreVertical } from 'react-icons/fi'

export const LibraryFolder = () => {
    const params = useParams()
    const history = useHistory()
    const dispatch = useDispatch()
    const location = useLocation()

    const {getLibraryStatus, getFoldersStatus, folderContent} = useSelector(state => ({
        getLibraryStatus:state.library.getLibraryStatus,
        getFoldersStatus:state.library.getFoldersStatus,
        folderContent:state.library.folderContent,
    }))

    const intitalBreadCrumbs = [{title:'Library', link:ROUTES.LIBRARY}]
    let [breadcrumbs, changeBreadCrumbs] = useState(intitalBreadCrumbs)

    useEffect(() => {
        if(getFoldersStatus == STATUS.SUCCESS && folderContent){
            let indx = _.findIndex(breadcrumbs,d => d.id == folderContent._id)
            if(indx != -1)
                changeBreadCrumbs(d => d.slice(0, indx+1))
            else
                changeBreadCrumbs(d => _.concat(d, [{id:folderContent._id, title:folderContent.folderName, link:location.pathname}]))
        }
    }, [getFoldersStatus, folderContent])

    useEffect(() => {
        return () => dispatch(resetGetFolders())
    }, [])

    useEffect(() => {
        dispatch(getFoldersAction({folderId:params.folderId}))
    }, [params.folderId])

    useEffect(() => {
        if(getLibraryStatus != STATUS.SUCCESS)
            dispatch(getLibraryAction())
    }, [getLibraryStatus])

    const selectTab = (type) => {
        history.push(`/dashboard/library-folder/${params.folderId}/${type}`)
    }

    const tabs = [
        {id:1, title:'Audios', type:'audios', icon:<BsMusicNote fontSize='15px'/>},
        {id:2, title:'Videos', type:'videos', icon:<AiFillVideoCamera fontSize='15px'/>},
        {id:3, title:'Documents', type:'documents', icon:<AiFillFilePdf fontSize='15px'/>},
        // {id:4, title:'Text', type:'files', icon:<AiFillFileText fontSize='15px'/>},
    ]

    let currentTab =  params.contentType

    return(
            <Box>
                <ErrorChecker status={getFoldersStatus}>
                <ErrorChecker status={getLibraryStatus}>
                    <Box>
                        <SectionHeader title='My Library'/>
                        {folderContent ? 
                            <Box mb={4} bg='white' boxShadow='rgba(149, 157, 165, 0.1) 0px 4px 12px' p={1}>
                                {folderContent.parentFolder ? 
                                    <Button size='lg' iconSpacing={6} leftIcon={<AiOutlineArrowLeft/>} variant='ghost'
                                        onClick={() => history.push('/dashboard/library-folder/'+folderContent.parentFolder._id)}
                                    >
                                        {folderContent.folderName}
                                    </Button>
                                    :!folderContent.parentFolder && folderContent.libraryId ? 
                                        <Button size='lg' iconSpacing={6} leftIcon={<AiOutlineArrowLeft/>} variant='ghost' 
                                            onClick={() => history.push(ROUTES.LIBRARY)}
                                        >
                                            {folderContent.folderName}
                                        </Button>
                                        :
                                        null
                                }
                            </Box>
                            :
                            null
                        }
                        <HStack w='100%' spacing={6} alignItems='stretch'>
                            <Box w='75%' p={3} bg='white' boxShadow='rgba(149, 157, 165, 0.1) 0px 4px 12px'>
                                {getLibraryStatus == STATUS.SUCCESS && getFoldersStatus == STATUS.SUCCESS && folderContent ?
                                    <Box>
                                        <ContentNavBar tabs={tabs} currentTab={currentTab} selectTab={selectTab}/>
                                        <br/>
                                        {
                                            currentTab === 'audios' ? <AudioLibrary content={folderContent}/> :
                                                currentTab === 'videos' ? <VideoLibrary content={folderContent}/> :
                                                    currentTab === 'documents' ? <PDFLibrary content={folderContent}/> :
                                                        null
                                        }
                                    </Box>
                                    :
                                    <Text>Something went wrong</Text>  
                                }
                            </Box>
                            <Box w='25%' bg='white' boxShadow='rgba(149, 157, 165, 0.1) 0px 4px 12px'>
                                <FoldersList/>
                            </Box>
                        </HStack>
                    </Box>
                </ErrorChecker>
                </ErrorChecker>
            </Box>
    )
}

const FoldersList = () => {
    const params = useParams()
    const history = useHistory()
    const dispatch = useDispatch()

    const {getFoldersStatus, folderContent, getLibraryStatus, removeFolderStatus} = useSelector(state => ({
        getFoldersStatus:state.library.getFoldersStatus,
        folderContent:state.library.folderContent,
        getLibraryStatus:state.library.getLibraryStatus,
        removeFolderStatus:state.library.removeFolderStatus
    }))

    const initialFocusRef = React.useRef()
    const [addFolderModal, toggleAddFolderModal] = useState()
    const [currentFolder, changeCurrentfolder] = useState()
    const { onOpen, onClose, isOpen } = useDisclosure()
    
    const _toggleAddFolderModal = () => {
        toggleAddFolderModal(!addFolderModal)
    }

    const openFolder = (id) => {
        history.push('/dashboard/library-folder/'+id)
    }

    const removeFolder = (e, fldr) => {
        e?.stopPropagation()
        onClose();

        dispatch(removeFolderAction({folderId:fldr._id}))
    }

    const updateFolder = (e, fldr) => {
        e?.stopPropagation()

        toggleAddFolderModal(!addFolderModal)
        changeCurrentfolder(fldr)
    }

    return(
        <Box p={3}>
            <Text textAlign='center' fontSize='heading' fontWeight='bold'>Folders</Text><br/>
            <Button isFullWidth p={6} mb={3} onClick={_toggleAddFolderModal} leftIcon={<AiFillFolderAdd fontSize='20pt'/>} bg="primaryBlue.400" color='white'>
                Create New Folder
            </Button>
            <br/>
            {getLibraryStatus == STATUS.SUCCESS && getFoldersStatus == STATUS.SUCCESS && folderContent?.folders?.length ?
                <VStack align='stretch'>
                    {_.orderBy(folderContent.folders, ['createdAt'],  ['desc']).map(fldr => 
                        <HStack justifyContent='space-between' border='1px solid' borderColor="primaryBlue.50" onClick={() => openFolder(fldr._id)} cursor='pointer' p={4} alignContent='center' borderRadius='6px'>
                            <HStack>
                                <Box><AiFillFolder fontSize='20pt' color='primaryBlue.50'/></Box>
                                <Box>
                                    {fldr.folderName}
                                </Box>
                            </HStack>

                            <Box>
                                <Popover isOpen={isOpen} onOpen={onOpen} onClose={onClose} initialFocusRef={initialFocusRef}>
                                    <PopoverTrigger>
                                        <IconButton onClick={e => e.stopPropagation()} size='sm' fontSize="lg" variant='ghost' icon={<FiMoreVertical/> }/>
                                    </PopoverTrigger>
                                    <PopoverContent>
                                        <PopoverArrow />
                                        <PopoverBody p={0}>
                                            <List>
                                                <ListItem>
                                                    <Button borderRadius={0} colorScheme='blue' variant='ghost' iconSpacing={4} isFullWidth 
                                                        leftIcon={<AiOutlineEdit fontSize="lg"/> }
                                                        onClick={e => updateFolder(e, fldr)}
                                                    >
                                                        Edit
                                                    </Button>
                                                </ListItem>
                                                <ListItem>
                                                    <Button borderRadius={0} colorScheme='blue' variant='ghost' iconSpacing={4} isFullWidth 
                                                        leftIcon={<AiOutlineDelete fontSize="lg"/> }
                                                        onClick={e => removeFolder(e, fldr)} isLoading={removeFolderStatus == STATUS.FETCHING}
                                                    >
                                                        Delete
                                                    </Button>
                                                </ListItem>
                                            </List>
                                        </PopoverBody>
                                    </PopoverContent>
                                </Popover>
                            </Box>
                        </HStack>
                    )}
                </VStack>
                :
                <Text textAlign='center'>No Folders</Text>                    
            }
            {addFolderModal ? 
                <AddFolderModal currentFolder={currentFolder} parentFolder={params.folderId} visible={addFolderModal} 
                    closeModal={currentFolder ? updateFolder : _toggleAddFolderModal} 
                /> 
                : null
            }
        </Box>
    )
}