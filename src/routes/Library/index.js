import { Box, HStack, Text, Button, VStack, List, ListItem, Popover, PopoverContent, PopoverArrow, PopoverBody, PopoverTrigger, IconButton, Menu, MenuButton, MenuList, MenuItem, Input, Flex } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { AiFillFilePdf, AiFillFileText, AiFillFolder, AiFillFolderAdd, AiFillVideoCamera, AiOutlineArrowLeft, AiOutlineDelete, AiOutlineEdit } from 'react-icons/ai'
import { BsMusicNote } from 'react-icons/bs'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useParams } from 'react-router'
import { STATUS } from '../../App/Constants'
import { ContentNavBar } from '../../Components/ContentNavBar'
import { ErrorChecker } from '../../Components/ErrorChecker'
import { addToLibraryAction, createLibraryAction, getFoldersAction, getLibFoldersAction, getLibraryAction, removeFolderAction, resetGetFolders } from '../../redux/reducers/library'
import { AddFolderModal } from './AddFolderModal'
import { AudioLibrary } from './AudioLibrary'
import { VideoLibrary } from './VideoLibrary'
import _ from 'lodash';
import { FiMoreVertical } from 'react-icons/fi'
import { PDFLibrary } from './PFDLibrary'
import { SectionHeader } from '../../Components/SectionHeader'
import { ROUTES } from '../../Constants/Routes'
import { ChevronDownIcon } from '@chakra-ui/icons'
import { ButtonX } from '../../Components/ButtonX'

export const Library = () => {
    const params = useParams()
    const history = useHistory()
    const dispatch = useDispatch()
    const currentFolderId = params.folderId === ':folderId' || params.folderId === 'root' ? null : params.folderId

    const {getLibraryStatus, libraryContent, createLibraryStatus, libraryFolders, removeFolderStatus, removedFolder} = useSelector(state => ({
        getLibraryStatus:state.library.getLibraryStatus,
        libraryContent:state.library.libraryContent,
        createLibraryStatus:state.library.createLibraryStatus,
        libraryFolders:state.library.libraryFolders,
        removeFolderStatus:state.library.removeFolderStatus
    }))

    const [searchData, changeSearchData] = useState("")

    useEffect(() => {
        // history.push('/dashboard/library/root/audios')
        
        return () => dispatch(resetGetFolders())
    }, [dispatch])

    useEffect(() => {
        if(currentFolderId && libraryFolders && removeFolderStatus === STATUS.SUCCESS){
            let indx = _.findIndex(libraryFolders,f => f._id === params.folderId)
            if(indx === -1)
                history.push('/dashboard/library/root/'+ params.contentType || 'audio')
        }
    }, [params.folderId, libraryFolders, currentFolderId, history, params.contentType, removeFolderStatus])

    // useEffect(() => {
    //     console.log('statuss', removeFolderStatus, removedFolder, params)
    //     if(removeFolderStatus === STATUS.SUCCESS && removedFolder && removedFolder._id === params.folderId)
    //         history.push('/dashboard/library/root')

    // }, [removeFolderStatus])

    useEffect(() => {
        let data = !currentFolderId ? {} : {folderId:currentFolderId}
        dispatch(getLibraryAction(data))
    }, [currentFolderId])

    useEffect(() => {
        if(createLibraryStatus === STATUS.SUCCESS)
            dispatch(getLibraryAction())
    }, [createLibraryStatus])

    useEffect(() => {
        // if(getLibraryStatus == STATUS.FAILED)
        //     dispatch(createLibraryAction({type:'library'}))

        // if(getLibraryStatus === STATUS.SUCCESS && libraryContent)
        //     history.push(`/dashboard/library`)
    }, [getLibraryStatus])

    const selectTab = (type) => {
        history.push(`/dashboard/library/${currentFolderId || 'root'}/${type}`)
    }

    const tabs = [
        {id:1, title:'Audios', type:'audios', icon:<BsMusicNote fontSize='15px'/>},
        {id:2, title:'Videos', type:'videos', icon:<AiFillVideoCamera fontSize='15px'/>},
        {id:3, title:'Documents', type:'documents', icon:<AiFillFilePdf fontSize='15px'/>},
        // {id:4, title:'Text', type:'files', icon:<AiFillFileText fontSize='15px'/>},
    ]

    let currentTab =  params.contentType

    let defaultBread = [
        { title: "Home", link: "/" },
        { title: "Library", link: '#' },
    ]

    let [breadcrumbs, changeBreadcrumbs] = useState(defaultBread)

    useEffect(() => {
        if(libraryContent?.parentFolder){
            let bread = [...breadcrumbs]
            bread[2] = {title:libraryContent.folderName, link:'#'}
            bread[1].link = '/dashboard/library/'+ libraryContent?.parentFolder?._id
            changeBreadcrumbs(bread)
        }else{
            changeBreadcrumbs(defaultBread)
        }
    }, [currentFolderId, libraryContent?.parentFolder])

    return(
            <Box>
                <ErrorChecker status={getLibraryStatus}>
                    <Box>
                        <SectionHeader title='My Library' breadcrumbs={breadcrumbs}/>
                        <Flex mb={4} bg='white' boxShadow='rgba(149, 157, 165, 0.1) 0px 4px 12px' p={1} alignItems='center' justifyContent={'space-between'}>
                            {libraryContent?.folder ? 
                                <Button size='lg' iconSpacing={6} leftIcon={<AiOutlineArrowLeft/>} variant='ghost'
                                    onClick={() => history.push('/dashboard/library/root/'+params.contentType || 'audios')}
                                >
                                    {libraryContent.folder.folderName}
                                </Button>
                                :libraryContent && !libraryContent.parentFolder ? 
                                    <Button size='lg' iconSpacing={6} variant='ghost' 
                                    >
                                        Library
                                    </Button>
                                    
                                    :
                                    null
                            }
                            <Flex mt={2}>
                                <Input
                                    placeholder="Search"
                                    style={{ width: "300px", padding:'10px', marginBottom:'10px',marginInline:'10px' }}
                                    onChange={(e) => changeSearchData(e.target.value)}
                                />
                            </Flex>
                        </Flex>
                        <HStack w='100%' minHeight='500pt' spacing={6} alignItems='stretch'>
                            <Box w={'75%'} p={3} bg='white' boxShadow='rgba(149, 157, 165, 0.1) 0px 4px 12px'>
                                {getLibraryStatus == STATUS.SUCCESS ?
                                    <Box>
                                        <ContentNavBar tabs={tabs} currentTab={currentTab} selectTab={selectTab}/>
                                        <br/>
                                        <Box>
                                            {libraryContent ?
                                                currentTab === 'audios' ? <AudioLibrary content={_.filter(libraryContent.files,d => d.type == 'Audio')} searchData={searchData}/> :
                                                    currentTab === 'videos' ? <VideoLibrary content={_.filter(libraryContent.files,d => d.type == 'Video')} searchData={searchData}/> :
                                                        currentTab === 'documents' ? <PDFLibrary content={_.filter(libraryContent.files,d => d.type == 'Document')} searchData={searchData}/> :
                                                        null
                                                :
                                                null
                                            }
                                        </Box>
                                    </Box>
                                    :
                                    <Text>No data available</Text>  
                                }
                            </Box>
                            <Box w='25%' bg='white' boxShadow='rgba(149, 157, 165, 0.1) 0px 4px 12px'>
                                <FoldersList currentFolderId={currentFolderId}/>
                            </Box>
                        </HStack>
                    </Box>
                </ErrorChecker>
            </Box>
    )
}

const FoldersList = ({currentFolderId}) => {
    const params = useParams()
    const history = useHistory()
    const dispatch = useDispatch()

    const {libraryContent, getLibraryStatus, removeFolderStatus, libraryFolders, getLibFoldersStatus} = useSelector(state => ({
        libraryContent:state.library.libraryContent,
        getLibraryStatus:state.library.getLibraryStatus,
        removeFolderStatus:state.library.removeFolderStatus,
        libraryFolders:state.library.libraryFolders,
        getLibFoldersStatus:state.library.getLibFoldersStatus
    }))

    const [addFolderModal, toggleAddFolderModal] = useState()
    const [currentFolder, changeCurrentfolder] = useState()
    
    useEffect(() => {
        if( getLibraryStatus != STATUS.SUCCESS)
            dispatch(getLibFoldersAction())
    },[getLibraryStatus, dispatch])

    const _toggleAddFolderModal = () => {
        toggleAddFolderModal(!addFolderModal)
    }

    const openFolder = (id) => {
        history.push(`/dashboard/library/${id}/${params.contentType || 'audios'}`)
    }

    const removeFolder = (e, fldr) => {
        e?.stopPropagation()

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
            <ButtonX isFullWidth p={6} mb={3} onClick={_toggleAddFolderModal} leftIcon={<AiFillFolderAdd fontSize='20pt'/>}>
                Create New Folder
            </ButtonX>
            <br/>
            <ErrorChecker status={getLibraryStatus}>
            <ErrorChecker status={getLibFoldersStatus}>
                {(getLibraryStatus == STATUS.SUCCESS || getLibFoldersStatus == STATUS.SUCCESS) && libraryFolders ?
                    <VStack align='stretch'>
                        <HStack p='0.93vw' onClick={() => openFolder('root')} justifyContent='space-between' border='1px solid' borderColor="primaryBlue.50" cursor='pointer' alignContent='center' borderRadius='6px'
                            className={params.folderId === 'root' ? 'active-folder' : null}
                        >
                            <HStack flexGrow={1}>
                                <Box color='primaryBlue.50'><AiFillFolder className={params.folderId === 'root' ? 'active-folder' : null} fontSize='20pt'/></Box>
                                <Text fontSize='md'>Library</Text>
                            </HStack>
                        </HStack>
                        {_.orderBy(libraryFolders, ['createdAt'],  ['desc']).map(fldr => 
                            <HStack justifyContent='space-between' border='1px solid' borderColor="primaryBlue.50" cursor='pointer' alignContent='center' borderRadius='6px'
                                className={params.folderId === fldr._id ? 'active-folder' : null}
                            >
                                <HStack p='0.93vw' onClick={() => openFolder(fldr._id)} flexGrow={1}>
                                    <Box color='primaryBlue.50'><AiFillFolder fontSize='20pt'/></Box>
                                    <Text fontSize='md'>
                                        {fldr.folderName}
                                    </Text>
                                </HStack>

                                <Box p='0.93vw'>
                                    <Menu>
                                        <MenuButton as={IconButton} background='white' padding={0} icon={<FiMoreVertical />}>
                                        </MenuButton>
                                        <MenuList>
                                            <MenuItem onClick={e => updateFolder(e, fldr)}>
                                                Edit
                                            </MenuItem>
                                            <MenuItem onClick={e => removeFolder(e, fldr)} isLoading={removeFolderStatus == STATUS.FETCHING}>
                                                Delete
                                            </MenuItem>
                                        </MenuList>
                                    </Menu>
                                </Box>
                            </HStack>
                        )}
                    </VStack>
                    :
                    <Text textAlign='center'>No Folders</Text>                 
                }
            </ErrorChecker>
            </ErrorChecker>
            {addFolderModal ? 
                <AddFolderModal currentFolder={currentFolder} parentFolder={libraryFolders._id} visible={addFolderModal} 
                    closeModal={currentFolder ? updateFolder : _toggleAddFolderModal} 
                /> 
                : null
            }
        </Box>
    )
}
