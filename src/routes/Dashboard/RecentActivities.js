import { Avatar, Box, HStack, Image, List, ListItem, Text, VStack } from '@chakra-ui/react'
import { find, flattenDeep, intersectionBy, map, size } from 'lodash'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router'
import { Progressbar } from '../../Components/Progressbar'
import { useTrackContent } from '../../Components/useTrackContent'
import { OBJ_CONTENT_TYPE } from '../../Constants'
import { checkExpiry } from '../../utils/Helper'
import { headerIcon, contentType } from './DashboardMain'

export const RecentActivities = ({ dashData }) => {
    const history = useHistory()
    const { packageData, student, trackings } = useSelector(state => ({
        packageData: state.package.packageContents,
        student: state.user.student,
        trackings: state.tracking.trackings
    }))

    const [activities, setActivities] = useState()

    useEffect(() => {
        let courses = student.packages.map(pkg => pkg.package.courses.length ? intersectionBy(packageData?.courses, pkg.package.courses.map(d => ({ _id: d })), '_id').map(d => ({ ...d, package: pkg })) : [])
        courses = flattenDeep(courses)
        let activities = dashData?.activities

        if (courses?.length && activities?.length) {
            let data = map(activities, d => {
                let crc = find(courses, c => c._id === d.parentContentId)
                crc = { ...crc, assigned: find(student?.courses, c => c.course === crc?._id) }
                let subject = find(crc?.subjects, sub => sub?.content._id === d.udf1)
                let contentType = OBJ_CONTENT_TYPE[d.objectType]
                let contentList = subject?.content[contentType] || []
                let content = find(contentList, c => c?._id === d.objectId)

                return crc ? ({ ...d, course: crc, content, subject }) : d
            }
            )
            setActivities(data)
        }
    }, [packageData, dashData, student])

    const openContent = (act) => {
        let search = `?courseId=${act.parentContentId}&subjectId=${act.udf1}`

        if (act.objectType === 'Video' || act.objectType === 'Audio')
            history.push({ pathname: `/dashboard/${act.objectType === 'Video' ? 'video' : 'audio'}/${act.content?.data}`, search })
        else if (act.objectType === 'Document' || act.objectType === 'BookContent')
            history.push(`/dashboard/courses/${act.parentContentId}/${act.objectType === 'Document' ? 'documents' : 'texts'}/${act.udf1}`)
    }

    const { startTracking } = useTrackContent()
    
    return (
        <VStack w='' flexGrow={1} borderRadius='15px' align='stretch' bg='#E0EBFF'>
            <HStack px={6} pt={2} justifyContent='space-between'>
                <HStack spacing={4}>
                    {headerIcon}
                    <Text fontSize='md'>Recent Activities</Text>
                </HStack>
            </HStack>

            <Box flexGrow={1} borderRadius='15px' background='white'>
                <List w='100%' id='scroll-bar' maxH={450} overflow='auto'>
                    {activities?.length && trackings ?
                        activities.map((act) => {
                            let type = contentType(act.objectType, 17)
                            let content = act.content

                            const subscribed = act.course.package?.subscription || size(act.course.package?.subDetails)
                            let track = startTracking(act.course?._id, act.objectType, content?._id)

                            const stCourse = find(student.courses, c => c.course === act.course)
                            const daysLeft = stCourse?.expireOn ? checkExpiry(stCourse.expireOn) : 'nonExpired'
                            const trialDaysLeft = act.course.package && checkExpiry(act.course.package.expireOn)
                            const subscriptionLeftDays = subscribed && checkExpiry(act.course.package.expireOn)
                            const validityExpired = act.course.package?.validity?.date ? moment(act.course.package.validity.date).isBefore(moment()) : false

                            let expired = subscribed ? trialDaysLeft || subscriptionLeftDays ? false : true : daysLeft ? false : true
                            {/* const videoTrackings = trackings?.[act.course._id]?.[act.objectType]
                            const thisTracking = videoTrackings?.[act.content._id];
                            let finalLog = thisTracking
                            const current = finalLog?.properties?.current || 0;
                            const total = finalLog?.properties?.size || 0
                            const progress = parseInt(current / total * 100) || 0 */}

                            return (
                                <ListItem boxShadow='0px 3px 6px #0000000A' key={act._id} px={6} py={2} pos='relative'>
                                    {expired ?
                                        <HStack justifyContent='center' textAlign='center' background='#ECF0F1' opacity='0.2'
                                            pos='absolute' zIndex='10' top={0} bottom={0} left={0} right={0}
                                        >
                                            <Image src='/images/expired.jpg' w='100px' />
                                        </HStack>
                                        : validityExpired ?
                                            <HStack justifyContent='center' textAlign='center' background='#ECF0F1' opacity='0.8'
                                                pos='absolute' zIndex='10' top={0} bottom={0} left={0} right={0}
                                            >
                                                <Text color={'#E74C3C'} size="lg">Your previous due is pending</Text>
                                            </HStack>
                                            : null
                                    }
                                    <HStack filter={expired && 'grayscale(1)'} justifyContent='space-between' spacing={6}>
                                        <HStack flexGrow={1} alignItems='center'>
                                            <Box>
                                                <Progressbar value={track.progress} />
                                            </Box>
                                            <VStack align='stretch' spacing={0}>
                                                <Text fontSize='md'>{content?.name}</Text>
                                                <Text fontSize='xs'>{act.subject?.displayName}</Text>
                                                <Text fontSize='xs' color='brand.secondary'>{act.course?.name}</Text>

                                            </VStack>
                                            {/* {act.objectType === 'Audio' || act.objectType === 'Video' ?
                                                <Progress borderRadius='10px' colorScheme="green" size='xs' w='100%' value={progress}/> : null
                                            } */}
                                        </HStack>
                                        <Avatar cursor='pointer' onClick={() => openContent(act)} bg={type?.bg} size='sm' icon={type?.icon} />
                                    </HStack>
                                </ListItem>
                            )
                        })
                        :
                        <ListItem boxShadow='0px 3px 6px #0000000A' px={6} py={4}>
                            <HStack justifyContent='center'>
                                <Text color='brand.secondary'>No activities</Text>
                            </HStack>
                        </ListItem>
                    }
                </List>
            </Box>
        </VStack>
    )
}