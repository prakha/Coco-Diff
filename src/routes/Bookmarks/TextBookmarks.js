import { IconButton } from '@chakra-ui/button'
import { Box, Text, HStack, VStack } from '@chakra-ui/layout'
import { Tooltip } from '@chakra-ui/tooltip'
import { Collapse } from '@chakra-ui/transition'
import React, { useEffect, useState } from 'react'
import { AiOutlineDelete, AiOutlineDown, AiOutlineUp } from 'react-icons/ai'
import { useDispatch, useSelector } from 'react-redux'
import { STATUS } from '../../App/Constants'
import { removeFromBkmrkAction } from '../../redux/reducers/bookmarks'
import { checkExpiry } from '../../utils/Helper'
import { MoveToBookmarkModal } from '../Contents/MoveToBookmarkModal'

export const TextBookmarks = ({content, searchData}) => {
    const {courseList, user} = useSelector(state => ({
        courseList:state.package.packageContents?.courses,
        user:state.user.student
    }))

    const [filtertextbookmarkdata, setFilterTextBookmarkData] = useState() 

    let list = _.chain(content).map(d => {
        let course = courseList?.length ? _.find(courseList,c => c._id == d.courseId) : []
        let assignedCourseDetails = user.courses?.length ? _.find(user.courses,c => c.course == d.courseId) : []
        return course ? ({...d, ..._.omit(assignedCourseDetails, ['_id']), course:{name:course.name}}) : d
    }).filter(d => d.course && checkExpiry(d.expireOn)).value()

    useEffect( () => {
        const newFilterData = 
        _.filter(list, f =>
        _.includes
            (
            _.toUpper(f.name),
            _.toUpper(searchData)))
            setFilterTextBookmarkData( newFilterData)
    },[ searchData])


    return(
        <Box>
            {filtertextbookmarkdata?.length ? 
                <VStack align='stretch' spacing={2} px={4}>
                    {_.map(filtertextbookmarkdata, text =>
                        <TextCard key={text._id} bookmark={list} content={text}/>
                    )}
                </VStack>
                :
                <Text>No text added</Text>
            }
        </Box>
    )
}

export const TextCard = ({content, subject, bookmark}) => {
    const dispatch = useDispatch()

    const {removeFromBkmrkStatus, deleteBkmrkFolderStatus} = useSelector(state => ({
        removeFromBkmrkStatus:state.bookmark.removeFromBkmrkStatus,
        deleteBkmrkFolderStatus:state.bookmark.deleteBkmrkFolderStatus
    }))

    const [moveFileModal, toggleMoveFileModal] = useState()
    const [openText, toggleOpenText] = useState()
    const [currentTxt, setCurrentTxt] = useState()

    const addToBookmark =() => {
        toggleMoveFileModal(moveFileModal ? null : {...content, subject})
    }

    const selectText = () => {
        toggleOpenText(openText ? null : content._id)
    }

    const removeFromBookmark =(e) => {
        e?.stopPropagation()
        dispatch(removeFromBkmrkAction({fileId:content._id}))
        setCurrentTxt(content)
    }
    
    let textFile = content.data || content.fileDataId
    return(
        <Box>
            <HStack mb={2} justifyContent='space-between' onClick={selectText} cursor='pointer' border='1px solid #D6EAF8' px={2} bg='#EBF5FB' borderRadius='3px'>
                <HStack>
                    <Text fontSize='lg'>{content.name}</Text>
                </HStack>
                
                <HStack spacing={4}>
                    <Tooltip label='Remove' placement='top'>
                        <IconButton isLoading={currentTxt?._id == content._id && removeFromBkmrkStatus == STATUS.FETCHING} variant='ghost' onClick={removeFromBookmark} fontSize='20px' icon={<AiOutlineDelete /> }/>
                    </Tooltip>

                    {openText == content._id ? 
                        <AiOutlineUp fontSize='20px'/>
                        :
                        <AiOutlineDown fontSize='20px'/>
                    }
                </HStack>
            </HStack>
            <Collapse in={openText == content._id} animateOpacity>
                <Box px={6} py={2} bg='rgba(239, 243, 246, 0.66)'>
                    <div id='math-tex' dangerouslySetInnerHTML={{__html:textFile.value}}/>
                </Box>  
            </Collapse>
            {moveFileModal ? <MoveToBookmarkModal type={'texts'} visible={moveFileModal} file={moveFileModal} closeModal={addToBookmark} /> : null}
        </Box>
    )
}