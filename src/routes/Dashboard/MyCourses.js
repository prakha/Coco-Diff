import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router'
import _, { size } from 'lodash';
import { Avatar, Box, Button, HStack, Image, List, ListItem, Text, VStack } from '@chakra-ui/react';
import { contentType, headerIcon } from './DashboardMain';
import { checkExpiry } from '../../utils/Helper';
import { Progressbar } from '../../Components/Progressbar';
import moment from 'moment';

export const CoursesList = () => {
    const history = useHistory()

    const { courses, trackings, student } = useSelector((state) => ({
        courses: state.package.packageContents?.courses,
        trackings: state.tracking.trackings,
        student: state.user.student,

    }))

    const [courseList, setCourseList] = useState()

    useEffect(() => {
        if (student && courses) {
            let list = courses.map(l => _.findIndex(student?.courses, c => c.course === l._id) !== -1 ? ({ ..._.find(student?.courses, c => c.course === l._id), ...l }) : l)
            setCourseList(list)
        }
    }, [student, courses])

    const allCourses = () => {
        history.push('/dashboard/courses')
    }

    return (
        <VStack flexGrow={2} borderRadius='15px' align='stretch' bg='#FFEBF6'>
            <HStack px={6} pt={2} justifyContent='space-between'>
                <HStack spacing={4}>
                    {headerIcon}
                    <Text fontSize='md'>Courses</Text>
                </HStack>
                <Button onClick={allCourses} color='brand.red' variant='link' fontSize='sm' fontWeight='400'>View All</Button>
            </HStack>

            <Box flexGrow={1} borderRadius='15px' background='white'>
                <List w='100%' id='scroll-bar' maxH={450} overflow='auto'>
                    {student?.packages?.length ?
                        student.packages.map(pkg => {
                            const validityExpired = pkg.validity?.date ? moment(pkg.validity.date).isBefore(moment()) : false
                            return <VStack align={'stretch'} key={pkg.id}>
                                {pkg.package?.courses?.length ?
                                    pkg.package.courses.map(crc => {
                                        const packageLang = pkg.lang === 'english' ? 'en' : pkg.lang === 'bilingual' ? 'bi' : 'hn'
                                        const course = _.find(courseList, c => c._id === crc) || {}
                                        const stCourse = _.find(student.courses, c => c.course === crc)
                                        const myCourse = pkg.subscription ? packageLang === course?.lang : true
                                        const subscribed = pkg.subscription || size(pkg.subDetails) //pkg.assignedOn && pkg.package.priceMode === 'sub'

                                        const courseTrackings = trackings?.[course._id] || {};
                                        let totalCount = _.sum([course.countTexts, course.countVideos, course.countAudios, course.countDocs])
                                        let progress = _.chain(courseTrackings).flatMap(d => _.size(d)).sum().value()
                                        let track = totalCount ? ((progress / totalCount) * 100) : 0

                                        const daysLeft = stCourse?.expireOn ? checkExpiry(stCourse.expireOn) : 'nonExpired'
                                        const trialDaysLeft = checkExpiry(pkg.expireOn)
                                        const subscriptionLeftDays = subscribed && checkExpiry(pkg.expireOn)

                                        let expired = subscribed ? trialDaysLeft || subscriptionLeftDays ? false : true : daysLeft ? false : true
                                        return (
                                            myCourse && <CourseCard validityExpired={validityExpired} crc={course} expired={expired} track={track} />
                                        )
                                    }
                                    )
                                    :
                                    null
                                }
                            </VStack>
                        })
                        :
                        null
                    }
                </List>
            </Box>
        </VStack>
    )
}

const CourseCard = ({ crc, expired, track, validityExpired }) => {
    const history = useHistory()

    const openCourse = (crc, type) => {
        history.push(`/dashboard/courses/${crc._id}/${type}`)
    }

    return (
        <ListItem key={crc._id} pos='relative' boxShadow='0px 3px 6px #0000000A' px={6} py={2}>
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
                    :
                    null
            }

            <HStack filter={expired && 'grayscale(1)'} spacing={6} justifyContent='space-between'>
                <HStack>
                    <Progressbar value={track} />
                    <Text fontSize='md'>{crc.name}</Text>
                </HStack>
                <HStack spacing={4}>
                    {crc.countAudios ? <Avatar cursor='pointer' size='sm' bg={contentType('Audio').bg} icon={contentType('Audio', 17).icon}
                        onClick={() => expired ? null : openCourse(crc, 'audios')}
                    /> : null}
                    {crc.countVideos ? <Avatar cursor='pointer' size='sm' bg={contentType('Video').bg} icon={contentType('Video', 17).icon}
                        onClick={() => expired ? null : openCourse(crc, 'videos')}
                    /> : null}
                    {crc.countDocs ? <Avatar cursor='pointer' size='sm' bg={contentType('Document').bg} icon={contentType('Document', 17).icon}
                        onClick={() => expired ? null : openCourse(crc, 'documents')}
                    /> : null}
                    {crc.countTexts ? <Avatar cursor='pointer' size='sm' bg={contentType('Text').bg} icon={contentType('Text', 17).icon}
                        onClick={() => expired ? null : openCourse(crc, 'texts')}
                    /> : null}
                </HStack>
            </HStack>
        </ListItem>
    )
}