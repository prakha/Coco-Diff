import { Box, HStack, Text, Button, VStack, List, ListItem, Popover, PopoverContent, PopoverArrow, PopoverBody, PopoverTrigger, IconButton, Menu, MenuButton, MenuList, MenuItem, Flex, Input } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { AiFillFilePdf, AiFillFileText, AiFillFolder, AiFillFolderAdd, AiFillVideoCamera, AiOutlineArrowLeft, AiOutlineDelete, AiOutlineEdit } from 'react-icons/ai'
import { BsMusicNote } from 'react-icons/bs'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useParams } from 'react-router'
import { STATUS } from '../../App/Constants'
import { ContentNavBar } from '../../Components/ContentNavBar'
import { ErrorChecker } from '../../Components/ErrorChecker'
import { addToBookmarkAction, bookmarkReducer, createBookmarkAction, getBkmrkFoldersAction, getBookmarkAction, removeBkmrkFolderAction, resetGetFolders } from '../../redux/reducers/bookmarks'
import _ from 'lodash';
import { FiMoreVertical } from 'react-icons/fi'
import { SectionHeader } from '../../Components/SectionHeader'
import { ROUTES } from '../../Constants/Routes'
import { AddBookmarkFolderModal } from './AddBookmarkFolder'
import { AudioBookmarks } from './AudioBookmarks'
import { VideoBookmarks } from './VideoBookmarks'
import { PDFBookmarks } from './PDFBookmarks'
import { TextBookmarks } from './TextBookmarks'
import { ButtonX } from '../../Components/ButtonX'

export const Bookmarks = () => {
    const params = useParams()
    const history = useHistory()
    const dispatch = useDispatch()
    const currentFolderId = params.folderId === ':folderId' || params.folderId === 'root' ? null : params.folderId

    const {getBookmarkStatus, bookmarkContent, createBookmarkStatus, bookmarkFolders, removeBkmrkFolderStatus} = useSelector(state => ({
        getBookmarkStatus:state.bookmark.getBookmarkStatus,
        bookmarkContent:state.bookmark.bookmarkContent,
        createBookmarkStatus:state.bookmark.createBookmarkStatus,
        bookmarkFolders:state.bookmark.bookmarkFolders,
        removeBkmrkFolderStatus:state.bookmark.removeBkmrkFolderStatus
    }))

    const [searchData, changeSearchData] = useState("")

    useEffect(() => {
        return () => dispatch(resetGetFolders())
    }, [])

    useEffect(() => {
        if(params.folderId && bookmarkFolders && removeBkmrkFolderStatus === STATUS.SUCCESS){
            let indx = _.findIndex(bookmarkFolders,f => f._id === params.folderId)
            if(indx === -1)
                history.push('/dashboard/bookmark/root/'+ params.contentType || 'audio')
        }
    }, [params.folderId, bookmarkFolders, params.contentType, history, removeBkmrkFolderStatus])

    useEffect(() => {
        let data = !currentFolderId ? {} : {folderId:currentFolderId}
        dispatch(getBookmarkAction(data))
    },[currentFolderId, dispatch])

    useEffect(() => {
        if(createBookmarkStatus === STATUS.SUCCESS)
            dispatch(getBookmarkAction())
    }, [createBookmarkStatus, dispatch])

    // useEffect(() => {
    //     if(getBookmarkStatus == STATUS.FAILED && getBookmarkError)
    //         dispatch(createBookmarkAction({}))

    //     if(getBookmarkStatus == STATUS.SUCCESS && !currentFolderId && bookmarkContent){
    //         history.push(`/dashboard/bookmark/${bookmarkContent._id}`)
    //     }

    // }, [getBookmarkStatus])

    const selectTab = (type) => {
        history.push(`/dashboard/bookmark/${currentFolderId || 'root'}/${type}`)
    }

    const tabs = [
        {id:1, title:'Audios', type:'audios', icon:<BsMusicNote fontSize='15px'/>},
        {id:2, title:'Videos', type:'videos', icon:<AiFillVideoCamera fontSize='15px'/>},
        {id:3, title:'Documents', type:'documents', icon:<AiFillFilePdf fontSize='15px'/>},
        {id:4, title:'Text', type:'texts', icon:<AiFillFileText fontSize='15px'/>},
    ]

    let currentTab =  params.contentType
    
    let defaultBread = [
        { title: "Home", link: "/" },
        { title: "Bookmark", link: '#' },
    ]

    let [breadcrumbs, changeBreadcrumbs] = useState(defaultBread)

    useEffect(() => {
        if(bookmarkContent?.parentFolder){
            let bread = [...breadcrumbs]
            bread[2] = {title:bookmarkContent.folderName, link:'#'}
            bread[1].link = '/dashboard/bookmark/root/'+params.contentType || 'audios'
            changeBreadcrumbs(bread)
        }else{
            changeBreadcrumbs(defaultBread)
        }
    }, [currentFolderId, bookmarkContent?.parentFolder])


    return(
            <Box>
                <ErrorChecker status={getBookmarkStatus}>
                    <Box>
                        <SectionHeader title='Bookmarks' breadcrumbs={breadcrumbs}/>
                        
                        <Flex mb={4} bg='white' boxShadow='rgba(149, 157, 165, 0.1) 0px 4px 12px' p={1} alignItems='center' justifyContent={'space-between'}>
                            {bookmarkContent?.folder ? 
                                <Button size='lg' iconSpacing={6} leftIcon={<AiOutlineArrowLeft/>} variant='ghost'
                                    onClick={() => history.push('/dashboard/bookmark/root/'+params.contentType || 'audios')}
                                >
                                    {bookmarkContent.folder.folderName}
                                </Button>
                                :bookmarkContent && !bookmarkContent.parentFolder ? 
                                    <Button size='lg' iconSpacing={6} variant='ghost'>
                                        Bookmark
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
                                {getBookmarkStatus == STATUS.SUCCESS ?
                                    <Box>
                                        <ContentNavBar tabs={tabs} currentTab={currentTab} selectTab={selectTab}/>
                                        <br/>
                                        <Box>
                                            {bookmarkContent ?
                                                currentTab === 'audios' ? <AudioBookmarks content={_.filter(bookmarkContent.files,d => d.type == 'Audio')} searchData={searchData}/> :
                                                    currentTab === 'videos' ? <VideoBookmarks content={_.filter(bookmarkContent.files,d => d.type == 'Video')} searchData={searchData}/> :
                                                        currentTab === 'documents' ? <PDFBookmarks content={_.filter(bookmarkContent.files,d => d.type == 'Document')} searchData={searchData}/> :
                                                            currentTab === 'texts' ? <TextBookmarks content={_.filter(bookmarkContent.files,d => d.type == 'BookContent')} searchData={searchData}/> :
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
    const history = useHistory()
    const dispatch = useDispatch()
    const params = useParams()

    const {getBookmarkStatus, removeBkmrkFolderStatus, bookmarkFolders, getBkmrkFoldersStatus} = useSelector(state => ({
        getBookmarkStatus:state.bookmark.getBookmarkStatus,
        removeBkmrkFolderStatus:state.bookmark.removeBkmrkFolderStatus,
        bookmarkFolders:state.bookmark.bookmarkFolders,
        getBkmrkFoldersStatus:state.bookmark.getBkmrkFoldersStatus
    }))

    const [addFolderModal, toggleAddFolderModal] = useState()
    const [currentFolder, changeCurrentfolder] = useState()

    useEffect(() => {
        if(getBookmarkStatus != STATUS.SUCCESS)
            dispatch(getBkmrkFoldersAction())
    },[getBookmarkStatus, dispatch])

    const _toggleAddFolderModal = () => {
        toggleAddFolderModal(!addFolderModal)
    }

    const openFolder = (id) => {
        history.push(`/dashboard/bookmark/${id || 'root'}/${params.contentType || 'audios'}`)
    }

    const removeFolder = (e, fldr) => {
        e?.stopPropagation()
        dispatch(removeBkmrkFolderAction({folderId:fldr._id, type:'Bookmark'}))
    }

    const updateFolder = (e, fldr) => {
        e?.stopPropagation()
        toggleAddFolderModal(!addFolderModal)
        changeCurrentfolder(fldr)
    }

    return(
        <Box p={3}>
            <Text textAlign='center' fontSize='20px' fontWeight='bold'>Folders</Text><br/>
            <ButtonX isFullWidth p={6} mb={3} onClick={_toggleAddFolderModal} leftIcon={<AiFillFolderAdd fontSize='20pt'/>}>
                Create New Folder
            </ButtonX>
            <br/>
            <ErrorChecker status={getBkmrkFoldersStatus}>
            <ErrorChecker status={getBookmarkStatus}>
                {(getBkmrkFoldersStatus === STATUS.SUCCESS || getBookmarkStatus === STATUS.SUCCESS) && bookmarkFolders?.length ?
                    <VStack align='stretch'>
                        <HStack p='0.93vw' onClick={() => openFolder(null)} justifyContent='space-between' border='1px solid' borderColor="primaryBlue.50" cursor='pointer' alignContent='center' borderRadius='6px'
                            className={params.folderId === 'root' ? 'active-folder' : null}
                        >
                            <HStack flexGrow={1}>
                                <Box color='primaryBlue.50'>
                                    <AiFillFolder className={params.folderId === 'root' ? 'active-folder' : null} fontSize='20pt'/>
                                </Box>
                                <Box>
                                    Bookmark
                                </Box>
                            </HStack>
                        </HStack>
                        {_.orderBy(bookmarkFolders, ['createdAt'],  ['desc']).map(fldr => 
                            <HStack justifyContent='space-between' border='1px solid #4285F45D'  cursor='pointer' alignContent='center' borderRadius='6px'
                                className={params.folderId === fldr._id ? 'active-folder' : null}
                            >
                                <HStack p='0.93vw' onClick={() => openFolder(fldr._id)} flexGrow={1}>
                                    <Box><AiFillFolder fontSize='20pt' color='#4285F45D'/></Box>
                                    <Box>
                                        {fldr.folderName}
                                    </Box>
                                </HStack>

                                <Box p='0.93vw'>
                                    <Menu>
                                        <MenuButton as={IconButton} background='white' padding={0} icon={<FiMoreVertical />}></MenuButton>
                                        <MenuList>
                                            <MenuItem onClick={e => updateFolder(e, fldr)}>
                                                Edit
                                            </MenuItem>
                                            <MenuItem onClick={e => removeFolder(e, fldr)} isLoading={removeBkmrkFolderStatus == STATUS.FETCHING}>
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
                <AddBookmarkFolderModal currentFolder={currentFolder} parentFolder={bookmarkFolders?._id} visible={addFolderModal} 
                    closeModal={currentFolder ? updateFolder : _toggleAddFolderModal} 
                /> 
                : null
            }
        </Box>
    )
}