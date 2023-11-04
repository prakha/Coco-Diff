import { Box, HStack, Text, Button, VStack, Popover, PopoverTrigger, IconButton, PopoverContent, PopoverArrow, PopoverBody, List, ListItem, Menu, MenuButton, MenuList, MenuItem } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { AiFillFilePdf, AiFillFileText, AiFillFolder, AiFillFolderAdd, AiFillVideoCamera, AiOutlineArrowLeft, AiOutlineDelete, AiOutlineEdit } from 'react-icons/ai'
import { BsMusicNote } from 'react-icons/bs'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useLocation, useParams } from 'react-router'
import { STATUS } from '../../App/Constants'
import { ContentNavBar } from '../../Components/ContentNavBar'
import { ErrorChecker } from '../../Components/ErrorChecker'
import { getBkmrkFoldersAction, getBookmarkAction, removeBkmrkFolderAction, resetGetFolders } from '../../redux/reducers/bookmarks'
import _ from 'lodash';
import { SectionHeader } from '../../Components/SectionHeader'
import { ROUTES } from '../../Constants/Routes'
import { FiMoreVertical } from 'react-icons/fi'
import { AddBookmarkFolderModal } from './AddBookmarkFolder'
import { PDFBookmarks } from './PDFBookmarks'
import { AudioBookmarks } from './AudioBookmarks'
import { VideoBookmarks } from './VideoBookmarks'
import { TextBookmarks } from './TextBookmarks'

export const BookmarkFolder = () => {
    const params = useParams()
    const history = useHistory()
    const dispatch = useDispatch()
    const location = useLocation()

    const {getBookmarkStatus, getBkmrkFoldersStatus, folderContent} = useSelector(state => ({
        getBookmarkStatus:state.bookmark.getBookmarkStatus,
        getBkmrkFoldersStatus:state.bookmark.getBkmrkFoldersStatus,
        folderContent:state.bookmark.folderContent,
    }))

    const intitalBreadCrumbs = [{title:'Bookmark', link:ROUTES.BOOKMARKS}]
    let [breadcrumbs, changeBreadCrumbs] = useState(intitalBreadCrumbs)

    useEffect(() => {
        if(getBkmrkFoldersStatus == STATUS.SUCCESS && folderContent){
            let indx = _.findIndex(breadcrumbs,d => d.id == folderContent._id)
            if(indx != -1)
                changeBreadCrumbs(d => d.slice(0, indx+1))
            else
                changeBreadCrumbs(d => _.concat(d, [{id:folderContent._id, title:folderContent.folderName, link:location.pathname}]))
        }
    }, [getBkmrkFoldersStatus, folderContent])

    useEffect(() => {
        return () => dispatch(resetGetFolders())
    }, [])

    useEffect(() => {
        dispatch(getBkmrkFoldersAction({folderId:params.folderId}))
    }, [params.folderId])

    useEffect(() => {
        if(getBookmarkStatus != STATUS.SUCCESS)
            dispatch(getBookmarkAction())
    }, [getBookmarkStatus])

    const selectTab = (type) => {
        history.push(`/dashboard/bookmark-folder/${params.folderId}/${type}`)
    }

    const tabs = [
        {id:1, title:'Audios', type:'audios', icon:<BsMusicNote fontSize='15px'/>},
        {id:2, title:'Videos', type:'videos', icon:<AiFillVideoCamera fontSize='15px'/>},
        {id:3, title:'Documents', type:'documents', icon:<AiFillFilePdf fontSize='15px'/>},
        {id:4, title:'Text', type:'texts', icon:<AiFillFileText fontSize='15px'/>},
    ]

    let currentTab =  params.contentType

    return(
            <Box>
                <ErrorChecker status={getBkmrkFoldersStatus}>
                <ErrorChecker status={getBookmarkStatus}>
                    <Box>
                        <SectionHeader title='My Bookmark'/>
                        {folderContent ? 
                            <Box mb={4} bg='white' boxShadow='rgba(149, 157, 165, 0.1) 0px 4px 12px' p={1}>
                                {folderContent.parentFolder ? 
                                    <Button size='lg' iconSpacing={6} leftIcon={<AiOutlineArrowLeft/>} variant='ghost'
                                        onClick={() => history.push('/dashboard/bookmark-folder/'+folderContent.parentFolder._id)}
                                    >
                                        {folderContent.folderName}
                                    </Button>
                                    :!folderContent.parentFolder && folderContent.bookmark ? 
                                        <Button size='lg' iconSpacing={6} leftIcon={<AiOutlineArrowLeft/>} variant='ghost' 
                                            onClick={() => history.push(ROUTES.BOOKMARKS)}
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
                                {getBookmarkStatus == STATUS.SUCCESS && getBkmrkFoldersStatus == STATUS.SUCCESS && folderContent ?
                                    <Box>
                                        <ContentNavBar tabs={tabs} currentTab={currentTab} selectTab={selectTab}/>
                                        <br/>
                                        {
                                            currentTab === 'audios' ? <AudioBookmarks content={folderContent}/> :
                                                currentTab === 'videos' ? <VideoBookmarks content={folderContent}/> :
                                                    currentTab === 'documents' ? <PDFBookmarks content={folderContent}/> :
                                                        currentTab === 'texts' ? <TextBookmarks content={folderContent}/> :
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

    const {getBkmrkFoldersStatus, folderContent, getBookmarkStatus, removeBkmrkFolderStatus} = useSelector(state => ({
        getBkmrkFoldersStatus:state.bookmark.getBkmrkFoldersStatus,
        folderContent:state.bookmark.folderContent,
        getBookmarkStatus:state.bookmark.getBookmarkStatus,
        removeBkmrkFolderStatus:state.bookmark.removeBkmrkFolderStatus
    }))


    const [addFolderModal, toggleAddFolderModal] = useState()
    const [currentFolder, changeCurrentfolder] = useState()
    
    const _toggleAddFolderModal = () => {
        toggleAddFolderModal(!addFolderModal)
    }

    const openFolder = (id) => {
        history.push('/dashboard/bookmark-folder/'+id)
    }

    const removeFolder = (e, fldr) => {
        e?.stopPropagation()

        dispatch(removeBkmrkFolderAction({folderId:fldr._id}))
    }

    const updateFolder = (e, fldr) => {
        e?.stopPropagation()

        toggleAddFolderModal(!addFolderModal)
        changeCurrentfolder(fldr)
    }

    return(
        <Box p={3}>
            <Text textAlign='center' fontSize='20px' fontWeight='bold'>Folders</Text><br/>
            <Button isFullWidth p={6} mb={3} onClick={_toggleAddFolderModal} leftIcon={<AiFillFolderAdd fontSize='20pt'/>} bg='#4285F4' color='white'>
                Create New Foldder
            </Button>
            <br/>
            {getBookmarkStatus == STATUS.SUCCESS && getBkmrkFoldersStatus == STATUS.SUCCESS && folderContent?.folders?.length ?
                <VStack align='stretch'>
                    {_.orderBy(folderContent.folders, ['createdAt'],  ['desc']).map(fldr =>
                        <HStack justifyContent='space-between' border='1px solid #4285F45D' onClick={() => openFolder(fldr._id)} cursor='pointer' p={4} alignContent='center' borderRadius='6px'>
                            <HStack>
                                <Box><AiFillFolder fontSize='20pt' color='#4285F45D'/></Box>
                                <Box>
                                    {fldr.folderName}
                                </Box>
                            </HStack>

                            <Box>
                                <Menu>
                                    <MenuButton as={Button} as={IconButton} variant="outline" icon={<FiMoreVertical />}></MenuButton>
                                    <MenuList>
                                        <MenuItem icon={<AiOutlineEdit fontSize='18px'/>}>Edit</MenuItem>
                                        <MenuItem icon={<AiOutlineDelete fontSize='18px'/> }>Delete</MenuItem>
                                    </MenuList>
                                </Menu>
                                {/* <Popover>
                                    <PopoverTrigger>
                                        <IconButton onClick={e => e.stopPropagation()} size='sm' fontSize='18px' variant='ghost' icon={<FiMoreVertical/> }/>
                                    </PopoverTrigger>
                                    <PopoverContent>
                                        <PopoverArrow />
                                        <PopoverBody p={0}>
                                            <List>
                                                <ListItem>
                                                    <Button borderRadius={0} colorScheme='blue' variant='ghost' iconSpacing={4} isFullWidth 
                                                        leftIcon={<AiOutlineEdit fontSize='18px'/> }
                                                        onClick={e => updateFolder(e, fldr)}
                                                    >
                                                        Edit
                                                    </Button>
                                                </ListItem>
                                                <ListItem>
                                                    <Button borderRadius={0} colorScheme='blue' variant='ghost' iconSpacing={4} isFullWidth 
                                                        leftIcon={<AiOutlineDelete fontSize='18px'/> }
                                                        onClick={e => removeFolder(e, fldr)} isLoading={removeBkmrkFolderStatus == STATUS.FETCHING}
                                                    >
                                                        Delete
                                                    </Button>
                                                </ListItem>
                                            </List>
                                        </PopoverBody>
                                    </PopoverContent>
                                </Popover> */}
                            </Box>
                        </HStack>
                    )}
                </VStack>
                :
                <Text textAlign='center'>No Folders</Text>                    
            }
            {addFolderModal ? 
                <AddBookmarkFolderModal currentFolder={currentFolder} parentFolder={params.folderId} visible={addFolderModal} 
                    closeModal={currentFolder ? updateFolder : _toggleAddFolderModal} 
                /> 
                : null
            }
        </Box>
    )
}