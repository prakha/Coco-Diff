
import { Box, HStack, Image, Progress, Text, VStack, Alert, AlertIcon, Flex, IconButton, Tooltip, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, Spinner, Icon, Button, CircularProgress, CircularProgressLabel, Avatar, Tag, Input } from "@chakra-ui/react";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from 'react-redux'
import { AiFillFilePdf, AiFillFileText, AiFillVideoCamera, AiOutlineBell, AiOutlineFileText, AiOutlineRight } from "react-icons/ai";
import { useHistory } from "react-router-dom";
import { SectionHeader } from "../../Components/SectionHeader";
import _, { find, intersectionBy, round, size } from "lodash";
import { BsFillInfoCircleFill, BsMusicNote } from "react-icons/bs";
import { ROUTES } from "../../Constants/Routes";
import { CONTENT_TYPE, STATUS } from "../../Constants";
import { checkExpiry, getAllPackages, mobileView, webView } from "../../utils/Helper";
import { Truncate } from "../../Components/Truncate";
import { RenewModal } from "./RenewModal";
import { SubscribeModal } from "../PackageDetails/SubscribeModal";
import moment from "moment";
import { getCoursesAction } from "../../redux/reducers/courses";
import { BiErrorCircle } from "react-icons/bi";


export const CourseList = () => {
    const history = useHistory()
    const dispatch = useDispatch()
    const [searchData, changeSearchData] = useState("")
    const [filterlistdata, setFilterListData] = useState()

    const { list, trackings, student, config } = useSelector((state) => ({
        list: state.package.packageContents?.courses,
        trackings: state.tracking.trackings,
        student: state.user.student,
        config: state.package.config,
        // courseList:state.course.courseList
    }))

    // const [courseList, changeCourseList] = useState()

    // useEffect(() => {
    //     dispatch(getCoursesAction({instituteId:'6026014693220a32dcbef98e'}))
    // }, [dispatch])

    const allPackages = useMemo(() => {
        if (student) {
            return getAllPackages(student)
        } return []
    }, [student])

    const getCoursePackage = useCallback((course) => {
        if (allPackages.length && course) {
            const pkg = _.find(allPackages, p => _.intersection(p.package?.courses, [course._id]).length)
            return pkg
        }
    }, [allPackages])

    // useEffect(() => {
    //     if (list?.length) {
    //         let data = list
    //         data = list.map(l => _.findIndex(student?.courses, c => c.course == l._id) != -1 ? ({ ..._.find(student.courses, c => c.course == l._id), ...l }) : l)
    //         changeCourseList(data)
    //     }
    // }, [list, student?.courses])

    let breadcrumbs = [
        { title: 'Home', link: '/' },
        { title: 'Courses', link: ROUTES.COURSES },
    ]

    const [filesModal, showFiles] = useState()

    const handleOpenFiles = (course) => {
        showFiles(d => d ? null : course)
    }

    // const getCourseTrial = useCallback((course) => {
    //     if(student?.packages?.length && course){
    //         const pkg = find(student.packages,pkg => _.intersectionBy(pkg.package?.courses, [course._id]).length)
    //         if(pkg){
    //             const trial = _.find(student.trials,t => t.packageId === pkg._id)
    //             return trial
    //         } 
    //     } return null
    // }, [student])

    const [subscribeModal, openSubscribeModal] = useState()
    const [renewModal, openRenewModal] = useState()

    const handleSubscriptionModal = (pkg) => {
        openSubscribeModal(d => d ? null : pkg)
    }

    const handleRenew = (pkg) => {
        openRenewModal(d => d ? null : pkg)
    }

    const getPkgContentsStatus = useSelector(s => s.package.getPkgContentsStatus)

    // const coursesList = useMemo(() => {
    //     if (list?.length && student) {
    //         let data = list

    //         let subCourses = student.packages?.length ? _.chain(student.packages).filter(p => p.package.priceMode === 'sub').flatMap(p => p.package.courses || []).flatMap(cId => ({ _id: cId })).value() : []
    //         subCourses = _.intersectionBy(list, subCourses, '_id')
    //         data = _.intersectionBy(list.map(l => ({ ...l, course: l._id })), student.courses, 'course')
    //         return [...data, ...subCourses]
    //     }
    //     return []
    // }, [list, student])


    useEffect(() => {
        const newFilterData =
            _.filter(list, f =>
                _.includes
                    (
                        _.toUpper(f.name),
                        _.toUpper(searchData)))
        setFilterListData(newFilterData)
    }, [list, searchData])

    return (
        <Box>
            <SectionHeader title='Courses' breadcrumbs={breadcrumbs} />

            <Box {...mobileView}>
                <Alert alignItems='start' status='info'>
                    <AlertIcon />
                    Please download COCO mobile app to view courses in mobile.
                </Alert>
                <Flex p={5} bg="gray.50" mt={10} as="a" href="https://bit.ly/3rlc2YQ" target={"_blank"} border="0.5px solid #dadada" borderRadius={"md"} alignItems="center">
                    <Image
                        style={{ height: "40px", width: "40px" }}
                        src={require('../../Images/play.png')}
                    />
                    <Text ml={3}>Click here to download android app</Text>
                </Flex>
            </Box>

            <Box {...webView}>
                {config.courseOffers?.length && _.filter(config.courseOffers, t => t.html).length ?
                    <Box background={'white'} p={6} borderTopRadius="20px">
                        <div dangerouslySetInnerHTML={{ __html: _.find(config.courseOffers, t => t.html).html }} />
                    </Box>
                    :
                    null
                }
                <br />
                <Flex align={'center'} justifyContent={'space-between'} bg='white' p={2} m={3} px={6} >
                    <Text fontSize='xl'>My Course</Text>
                    <Input
                        placeholder="Search"
                        style={{ width: "300px", padding: '10px', marginBottom: '10px' }}
                        onChange={(e) => changeSearchData(e.target.value)}
                    />
                </Flex>
                <VStack spacing={0} align={'stretch'}>
                    {
                        getPkgContentsStatus === STATUS.FETCHING ?
                            <Box p={10}>
                                <Spinner />
                            </Box> : null
                    }

                    {student?.trials?.length ?
                        <VStack align={'stretch'}>
                            {student.trials.map(trial => {
                                return (
                                    trial.packageId.courses?.length ?
                                        trial.packageId.courses.map(crcId => {
                                            const course = _.find(filterlistdata, c => c._id === crcId)//crcId //_.find(courseList,c => c._id === crcId)
                                            const expired = moment(trial.expireOn).isBefore(moment())
                                            const trialcourse = course?.lang === trial.lang
                                            // console.log('courseList', course)
                                            // return (
                                            //     <Text>Trials</Text>

                                            // )
                                            return (
                                                !expired && trialcourse && <CourseCard trial renewCourse={handleRenew} pkg={{ ...trial, package: trial.packageId }} course={course} />
                                            )
                                        }
                                        )
                                        :
                                        null
                                )
                            })}
                        </VStack>
                        :
                        null

                    }
                    {/* {console.log('package', student?.packages)} */}
                    {student?.packages?.length ?
                        student.packages.map(pkg => {
                            const validityExpired = pkg.validity?.date ? moment(pkg.validity.date).isBefore(moment()) : false
                            return <VStack align={'stretch'} key={pkg.id}>
                                {pkg.package?.courses?.length ?
                                    pkg.package.courses.map(crcId => {
                                        const packageLang = pkg.lang === 'english' ? 'en' : pkg.lang === 'bilingual' ? 'bi' : 'hn'
                                        const course = _.find(filterlistdata, c => c._id === crcId)
                                        const stCourse = _.find(student.courses, c => c.course === crcId)
                                        const myCourse = pkg.subscription ? packageLang === course?.lang : true
                                        return (
                                            myCourse && <CourseCard validityExpired={validityExpired} stCourse={stCourse} renewCourse={handleRenew} pkg={pkg} course={course} />
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
                    {/* {courseList?.length ?
                        _.orderBy(courseList, 'assignedOn', 'desc').map(course => {
                            const courseTrackings = trackings?.[course._id] || {};
                            let countAudios = course.countAudios
                            let countVideos = course.countVideos
                            let countDocs = course.countDocs
                            let countTexts = course.countTexts
                            let totalCount = _.sum([countTexts, countVideos, countAudios, countDocs])
                            // let progress = _.chain(courseTrackings).flatMap(d => _.size(d)).sum().value()
                            // let totalProgress = _.chain(courseTrackings).flatMap(d => _.size(d)).sum().value()
                            let daysLeft = course.expireOn ? checkExpiry(course.expireOn, course.duration) : 'nonExpired'
                            const coursePackage =  getCoursePackage(course)
                            let expired = daysLeft ? false : true
                            const trialDaysLeft = coursePackage.trial ? checkExpiry(coursePackage.expireOn) : ''
                            const subscribed = coursePackage.assignedOn && coursePackage.package.priceMode === 'sub'
                            const subscriptionLeftDays = subscribed && checkExpiry(coursePackage.expireOn)

                            console.log('trial', coursePackage, coursePackage.expireOn)
                            return totalCount ? (
                                <HStack pos='relative' align='stretch' p={3}>
                                    {expired ?
                                        <Box pos='absolute' paddingBottom='20px' paddingRight='20px' display='flex' justifyContent='center' alignItems='center'
                                            top={0} left={0} bottom={0} right={0} zIndex={9} onClick={null}
                                            pointerEvents='none'
                                        >
                                            <Image src='/images/expired.jpg' style={{ opacity: 0.1 }} width='20%' />
                                        </Box>
                                        :
                                        null
                                    }
                                    <HStack p={3} flex={1} justifyContent='space-between'
                                        filter={expired && 'grayscale(1)'} align="stretch"
                                        w='21.14vw' borderRadius='8px' border='1px solid #E9E9ED' bg='white'
                                    >
                                        <HStack width={'20%'} align='center'>
                                            <Text fontWeight={'bold'}>{course.name}</Text>
                                        </HStack>
                                        <HStack spacing={4} width={'70%'} px={10}>
                                            {countAudios ?
                                                <ContentItem2 icon={BsMusicNote} trackings={courseTrackings[CONTENT_TYPE.AUDIO]} colorScheme={'default'} duration={''} type='audios'
                                                    expired={expired}
                                                    item={{
                                                        type: CONTENT_TYPE.AUDIO,
                                                        total: countAudios,
                                                    }}
                                                    showContents={(type) => showContents(type, course)}
                                                /> : null
                                            }

                                            {countVideos ?
                                                <ContentItem2 icon={AiFillVideoCamera} trackings={courseTrackings[CONTENT_TYPE.VIDEO]} colorScheme={'yellow'} duration={''} type='videos'
                                                    expired={expired}
                                                    item={{
                                                        type: CONTENT_TYPE.VIDEO,
                                                        total: countVideos,
                                                    }}
                                                    showContents={(type) => showContents(type, course)}
                                                /> : null
                                            }

                                            {countDocs ?
                                                <ContentItem2 icon={AiFillFilePdf} trackings={courseTrackings[CONTENT_TYPE.DOCUMENT]} colorScheme={'red'} type='documents'
                                                    expired={expired}
                                                    item={{
                                                        type: CONTENT_TYPE.DOCUMENT,
                                                        total: countDocs,
                                                    }}
                                                    showContents={(type) => showContents(type, course)}
                                                /> : null
                                            }

                                            {
                                                <ContentItem2 icon={AiFillFileText} trackings={courseTrackings[CONTENT_TYPE.TEXT]} colorScheme={'green'} type='texts'
                                                    expired={expired}
                                                    item={{
                                                        type: CONTENT_TYPE.TEXT,
                                                        total: countTexts,
                                                    }}
                                                    showContents={(type) => showContents(type, course)}
                                                />
                                            }
                                        </HStack>
                                        <VStack width={'15%'} justify={'space-between'} align={'end'}>
                                            {
                                                subscribed ?
                                                    <VStack align={'end'}>
                                                        <Box>
                                                            <Text fontSize='sm' color='brand.green' fontWeight={'bold'}>
                                                                {subscriptionLeftDays ? subscriptionLeftDays+' remaining' : 'Expired'}
                                                            </Text>
                                                        </Box>
                                                        <Tag colorScheme="red">Subscribed</Tag>
                                                    </VStack>
                                                    :
                                                    trialDaysLeft ? 
                                                        <VStack align={'end'}>
                                                            <Box>
                                                                <Text fontSize='sm' color='brand.green' fontWeight={'bold'}>
                                                                    {trialDaysLeft+' remaining'}
                                                                </Text>
                                                            </Box>
                                                            <Tag colorScheme="red">Trial</Tag>
                                                        </VStack> 
                                                        :
                                                        <Text fontSize='sm' color='brand.green' fontWeight={'bold'}>
                                                            {expired ? 'Expired' : daysLeft ? daysLeft === 'nonExpired' ? <br /> : daysLeft+' remaining' : <br />}
                                                        </Text>
                                            }
                                            {subscribed && coursePackage.package.renewable ?
                                                <Button onClick={() => handleRenew(coursePackage)} zIndex={20} size="sm" color={'#E74C3C'} borderRadius={15}>Renew Now</Button>
                                                :trialDaysLeft ?
                                                    <Button onClick={() => handleRenew(coursePackage)} zIndex={20} size="sm" color={'#E74C3C'} borderRadius={15}>Subscribe Now</Button>
                                                :
                                                null
                                            }
                                        </VStack>
                                    </HStack>
                                </HStack>
                            )
                                :
                                null
                        }
                        )
                        : getPkgContentsStatus !== STATUS.FETCHING ?
                            <Text style={{ fontSize: '20px', fontWeight: 'bold' }}>No courses available</Text>
                            : null
                    } */}
                </VStack>

                {renewModal && <RenewModal lmsData={renewModal} visible={renewModal} closeModal={handleRenew} />}
                {subscribeModal && <SubscribeModal subscription={subscribeModal.package.subscriptions[0]} packageData={subscribeModal} visible={subscribeModal} closeModal={handleSubscriptionModal} />}
                {/* <Box w='100%' style={{ display: 'flex', alignItems: 'stretch', flexDirection: 'row', flexWrap: 'wrap' }}>
                    {courseList?.length ?
                        _.orderBy(courseList, 'assignedOn', 'desc').map(course => {
                            const courseTrackings = trackings?.[course._id] || {};
                            let countAudios = course.countAudios
                            let countVideos = course.countVideos
                            let countDocs = course.countDocs
                            let countTexts = course.countTexts
                            let totalCount = _.sum([countTexts, countVideos, countAudios, countDocs])
                            let progress = _.chain(courseTrackings).flatMap(d => _.size(d)).sum().value()
                            let totalProgress = _.chain(courseTrackings).flatMap(d => _.size(d)).sum().value()
                            let daysLeft = course.expireOn ? checkExpiry(course.expireOn, course.duration) : 'nonExpired'
                            let expired = daysLeft ? false : true

                            return totalCount ? (
                                <HStack pos='relative' key={course._id} align='stretch' p={3}>
                                    {expired ?
                                        <Box pos='absolute' paddingBottom='20px' paddingRight='20px' display='flex' justifyContent='center' alignItems='center'
                                            top={0} left={0} bottom={0} right={0} zIndex={9} onClick={null}
                                        >
                                            <Image src='/images/expired.jpg' style={{ opacity: 0.1 }} width='50%' />
                                        </Box>
                                        :
                                        null
                                    }
                                    <VStack filter={expired && 'grayscale(1)'} align="stretch"
                                        w='21.14vw' borderRadius='8px' border='1px solid #E9E9ED' bg='white'
                                    >
                                        <HStack justifyContent={'space-between'} borderBottom='1px solid #E4E4E4C3' p={3}>
                                            <Text fontSize='lg'>{course.name}</Text>
                                            {course.files?.length &&
                                                <Tooltip label='Files'>
                                                    <IconButton
                                                        onClick={() => handleOpenFiles(course)}
                                                        variant="outline"
                                                        color="blue.500"
                                                        icon={<AiOutlineFileText />}
                                                        fontSize={25}
                                                    />
                                                </Tooltip>
                                            }
                                        </HStack>
                                        <Box px={4} borderBottom='1px solid #E4E4E4C3' py={1}>
                                            <HStack justifyContent='space-between' w='100%'>
                                                <Text fontSize='sm' color='grey'><b>{totalCount && progress ? parseInt((progress / totalCount) * 100) : 0}% </b></Text>
                                                <Text fontSize='sm' color='green.500'>
                                                    {!totalCount || !progress ? 'Not Started' :
                                                        parseInt(progress) < totalCount ? 'In Progress' :
                                                            'Completed'
                                                    }
                                                </Text>
                                                <Text fontSize='sm' color='grey'><b>Progress</b></Text>
                                            </HStack>
                                            <Progress borderRadius='10px' colorScheme="green" my={2} size="xs"
                                                value={totalCount ? ((progress / totalCount) * 100) : 0}

                                            />
                                            <HStack justifyContent='space-between' w='100%'>
                                                <Text fontSize='sm' color='green.500'>
                                                    {expired ? 'Expired' : daysLeft ? daysLeft === 'nonExpired' ? <br /> : daysLeft : <br />}
                                                </Text>
                                            </HStack>
                                        </Box>
                                        <Box>
                                            {countAudios ?
                                                <ContentItem icon={<BsMusicNote />} trackings={courseTrackings[CONTENT_TYPE.AUDIO]} colorScheme={'default'} duration={''} type='audios'
                                                    item={{
                                                        type: CONTENT_TYPE.AUDIO,
                                                        total: countAudios,
                                                    }}
                                                    showContents={(type) => showContents(type, course)}
                                                /> : null
                                            }

                                            {countVideos ?
                                                <ContentItem icon={<AiFillVideoCamera />} trackings={courseTrackings[CONTENT_TYPE.VIDEO]} colorScheme={'yellow'} duration={''} type='videos'
                                                    item={{
                                                        type: CONTENT_TYPE.VIDEO,
                                                        total: countVideos,
                                                    }}
                                                    showContents={(type) => showContents(type, course)}
                                                /> : null
                                            }

                                            {countDocs ?
                                                <ContentItem icon={<AiFillFilePdf />} trackings={courseTrackings[CONTENT_TYPE.DOCUMENT]} colorScheme={'red'} type='documents'
                                                    item={{
                                                        type: CONTENT_TYPE.DOCUMENT,
                                                        total: countDocs,
                                                    }}
                                                    showContents={(type) => showContents(type, course)}
                                                /> : null
                                            }

                                            {countTexts ?
                                                <ContentItem icon={<AiFillFileText />} trackings={courseTrackings[CONTENT_TYPE.TEXT]} colorScheme={'green'} type='texts'
                                                    item={{
                                                        type: CONTENT_TYPE.TEXT,
                                                        total: countTexts,
                                                    }}
                                                    showContents={(type) => showContents(type, course)}
                                                /> : null
                                            }
                                            <br />
                                        </Box>
                                    </VStack>
                                </HStack>
                            )
                                :
                                null
                        }
                        )
                        : getPkgContentsStatus !== STATUS.FETCHING ?
                            <Text style={{ fontSize: '20px', fontWeight: 'bold' }}>No courses available</Text>
                            : null
                    }
                </Box> */}
            </Box>
            {filesModal ? <FilesModal visible={filesModal} course={filesModal} closeModal={handleOpenFiles} /> : null}
        </Box>
    );
};

const CourseCard = ({ course, stCourse, trial, pkg, renewCourse, validityExpired }) => {
    const history = useHistory()

    const { trackings } = useSelector((state) => ({
        trackings: state.tracking.trackings,
    }))

    const courseTrackings = trackings?.[course?._id] || {};
    let countAudios = course?.countAudios
    let countVideos = course?.countVideos
    let countDocs = course?.countDocs
    let countTexts = course?.countTexts
    let totalCount = _.sum([countTexts, countVideos, countAudios, countDocs])
    // let progress = _.chain(courseTrackings).flatMap(d => _.size(d)).sum().value()
    // let totalProgress = _.chain(courseTrackings).flatMap(d => _.size(d)).sum().value()

    const subscribed = pkg.subscription || size(pkg.subDetails) //pkg.assignedOn && pkg.package.priceMode === 'sub'

    const daysLeft = stCourse?.expireOn ? checkExpiry(stCourse.expireOn) : 'nonExpired'
    const trialDaysLeft = trial && checkExpiry(pkg.expireOn)
    const subscriptionLeftDays = subscribed && checkExpiry(pkg.expireOn)

    let expired = subscribed || trial ? trialDaysLeft || subscriptionLeftDays ? false : true : daysLeft ? false : true

    const showContents = (type, course) => {
        history.push('/dashboard/courses/' + course._id + '/' + type)
    }

    return totalCount ? (
        <HStack key={course._id} pos='relative' align='stretch' p={3}>
            {expired ?
                <Box pos='absolute' paddingBottom='20px' paddingRight='20px' display='flex' justifyContent='center' alignItems='center'
                    top={0} left={0} bottom={0} right={0} zIndex={9} onClick={null}
                    pointerEvents='none'
                >
                    <Image src='/images/expired.jpg' style={{ opacity: 0.1 }} width='20%' />
                </Box>
                : validityExpired ?
                    <Box pos='absolute' paddingBottom='20px' paddingRight='20px' display='flex' justifyContent='center' alignItems='center'
                        top={0} left={0} bottom={0} right={0} zIndex={9} onClick={null}
                        pointerEvents='none'
                    >
                        {/* <Image src='/images/expired.jpg' style={{ opacity: 0.1 }} width='20%' /> */}
                        <HStack opacity={'.8'} borderRadius={6} background={'#FADBD8'} p={4}>
                            <BiErrorCircle color="#E74C3C" />
                            <Text color={'#E74C3C'} size="lg">Looks like your previous due is pending. Please pay your due and continue learning.</Text>
                        </HStack>
                    </Box>
                    :
                    null
            }
            <HStack p={3} flex={1} justifyContent='space-between'
                filter={expired && 'grayscale(1)'} align="stretch"
                w='21.14vw' borderRadius='8px' border='1px solid #E9E9ED' bg='white'
            >
                <HStack width={'20%'} align='center'>
                    <Text fontWeight={'bold'}>{course?.name}</Text>
                </HStack>
                <HStack spacing={4} width={'70%'} px={10}>
                    {countAudios ?
                        <ContentItem2 icon={BsMusicNote} trackings={courseTrackings[CONTENT_TYPE.AUDIO]} colorScheme={'default'} duration={''} type='audios'
                            expired={(validityExpired || expired)}
                            item={{
                                type: CONTENT_TYPE.AUDIO,
                                total: countAudios,
                            }}
                            showContents={(type) => showContents(type, course)}
                        /> : null
                    }

                    {countVideos ?
                        <ContentItem2 icon={AiFillVideoCamera} trackings={courseTrackings[CONTENT_TYPE.VIDEO]} colorScheme={'yellow'} duration={''} type='videos'
                            expired={(validityExpired || expired)}
                            item={{
                                type: CONTENT_TYPE.VIDEO,
                                total: countVideos,
                            }}
                            showContents={(type) => showContents(type, course)}
                        /> : null
                    }

                    {countDocs ?
                        <ContentItem2 icon={AiFillFilePdf} trackings={courseTrackings[CONTENT_TYPE.DOCUMENT]} colorScheme={'red'} type='documents'
                            expired={(validityExpired || expired)}
                            item={{
                                type: CONTENT_TYPE.DOCUMENT,
                                total: countDocs,
                            }}
                            showContents={(type) => showContents(type, course)}
                        /> : null
                    }

                    {
                        <ContentItem2 icon={AiFillFileText} trackings={courseTrackings[CONTENT_TYPE.TEXT]} colorScheme={'green'} type='texts'
                            expired={(validityExpired || expired)}
                            item={{
                                type: CONTENT_TYPE.TEXT,
                                total: countTexts,
                            }}
                            showContents={(type) => showContents(type, course)}
                        />
                    }
                </HStack>
                <VStack width={'15%'} justify={'space-between'} align={'end'}>
                    {
                        subscribed ?
                            <VStack align={'end'}>
                                <Box>
                                    <Text fontSize='sm' color='brand.green' fontWeight={'bold'}>
                                        {subscriptionLeftDays ? subscriptionLeftDays + ' remaining' : 'Expired'}
                                    </Text>
                                </Box>
                                <Tag colorScheme="red">Subscribed</Tag>
                            </VStack>
                            :
                            trialDaysLeft ?
                                <VStack align={'end'}>
                                    <Box>
                                        <Text fontSize='sm' color='brand.green' fontWeight={'bold'}>
                                            {trialDaysLeft + ' remaining'}
                                        </Text>
                                    </Box>
                                    <Tag colorScheme="red">Trial</Tag>
                                </VStack>
                                :
                                <Text fontSize='sm' color='brand.green' fontWeight={'bold'}>
                                    {expired ? 'Expired' : daysLeft ? daysLeft === 'nonExpired' ? <br /> : daysLeft + ' remaining' : <br />}
                                </Text>
                    }

                    {subscribed && pkg.package.renewable ?
                        <Button onClick={() => renewCourse(pkg.package)} zIndex={20} size="sm" color={'#E74C3C'} borderRadius={15}>Renew Now</Button>
                        : trialDaysLeft ?
                            <Button onClick={() => renewCourse(pkg.package)} zIndex={20} size="sm" color={'#E74C3C'} borderRadius={15}>Subscribe Now</Button>
                            :
                            null
                    }

                </VStack>
            </HStack>
        </HStack>
    )
        :
        null
}

const FilesModal = ({ visible, closeModal, course }) => {
    return (
        <Modal onClose={closeModal} size='4xl' isOpen={visible}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader> {course?.name} </ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <VStack alignItems={'stretch'}>
                        {/* {course.files.map(file =>
                            <Box padding={'0px 10px 20px 0px'} key={file._id}>
                                <VStack onClick={() => window.open(file.data?.url, '_blank')} cursor='pointer' width={100} _hover={{color:'#3498DB'}} transition='all .2s'>
                                    <AiOutlineFileText color='#515A5A' fontSize={50}/>
                                    <Tooltip label={file.name}>
                                        <Text fontSize={12} color='brand.secondary'>{file.name.length > 20 ? `${file.name.substring(0, 20)}...` : file.name}</Text>
                                    </Tooltip>
                                </VStack>
                            </Box>
                        )} */}
                        {course.files.map(file =>
                            <Box border={'1px solid #D6DBDF'} borderRadius={4} _hover={{ borderColor: '#5DADE2' }} transition='all .2s' padding={1} key={file._id}>
                                <HStack
                                    width='100%'
                                    onClick={() => window.open(file.url, '_blank')}
                                    cursor='pointer'
                                >
                                    <AiOutlineFileText color='#515A5A' fontSize={30} />
                                    <Text fontSize={13} color='brand.secondary'>{file.name}</Text>
                                </HStack>
                            </Box>
                        )}
                    </VStack>
                    <br />
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}

const ContentItem2 = ({ icon, duration, colorScheme, trackings = [], item, type, showContents, expired }) => {
    let colorSchemes = [
        { colorScheme: 'default', iconColor: '#06D4FF', barColor: null },
        { colorScheme: 'green', iconColor: '#06D4FF', barColor: 'green' },
        { colorScheme: 'yellow', iconColor: '#06D4FF', barColor: 'yellow' },
        { colorScheme: 'red', iconColor: '#06D4FF', barColor: 'red' }
    ]

    let scheme = _.find(colorSchemes, c => c.colorScheme === colorScheme)

    let title = type === 'audios' ? 'Audios' : type === 'videos' ? 'Videos' : type === 'documents' ? 'PDF' : type === 'texts' ? 'eBook' : null
    const progress = round((_.size(trackings) / item.total) * 100)
    return (
        <HStack flex={1} p={3}>
            {item.total &&
                <VStack pr={2} spacing={0}>
                    <Text color={'gray.500'} fontWeight='bold' fontSize='sm'>
                        {title}
                    </Text>
                    <CircularProgress cursor={!expired && 'pointer'} onClick={() => expired ? null : showContents(type)} value={progress} size={70}
                        thickness={5} color='green.300'
                    >
                        <CircularProgressLabel>
                            <Avatar icon={<Icon fontSize={26} as={icon} color='white' />} bg={scheme.iconColor}
                                _hover={!expired && { bg: '#3498DB' }} transition='all .3s'
                            />
                            {/* <Icon viewBox='0 0 200 200' color={'red'} as={icon} fontSize={26} /> */}

                            {/* <HStack align='center' justify='center' bg={scheme.iconColor} fontSize='md' color={'white'} w='2.4vw' h='2.4vw' borderRadius='50%'> */}
                            {/* <Icon as={icon} fontSize={26} /> */}
                            {/* </HStack> */}
                        </CircularProgressLabel>
                    </CircularProgress>
                    <Text color={'gray.500'} fontSize='xs'>{progress}%</Text>
                </VStack>
            }
        </HStack>
    )
}

const ContentItem = ({ icon, duration, colorScheme, trackings = [], item, type, showContents }) => {
    let colorSchemes = [
        { colorScheme: 'default', iconColor: '#4285F4', barColor: null },
        { colorScheme: 'green', iconColor: '#27AE60', barColor: 'green' },
        { colorScheme: 'yellow', iconColor: '#FECD52', barColor: 'yellow' },
        { colorScheme: 'red', iconColor: '#DC4955', barColor: 'red' }
    ]

    let scheme = _.find(colorSchemes, c => c.colorScheme == colorScheme)

    let total = type == 'audios' ? 'Audio' : type == 'videos' ? 'Video' : type == 'documents' ? 'PDF' : type == 'texts' ? 'Online Book' : null
    return (
        <HStack p={3} onClick={() => showContents(type)} cursor='pointer'>
            <Box pr={2}>
                <HStack align='center' justify='center' bg={scheme.iconColor} fontSize='md' color={'white'} w='1.75vw' h='1.75vw' borderRadius='50%'>
                    {icon}
                </HStack>
            </Box>
            <Box flexGrow='1'>
                <HStack justifyContent='space-between' w='100%'>
                    <Text fontSize='sm'>
                        <b>{total}: </b>
                        {_.size(trackings) + '/' + item.total}
                    </Text>
                    {duration && <Text fontSize='sm'><b>Duration: </b> {duration}</Text>}
                </HStack>
                <Progress size='xs' colorScheme={scheme.barColor} value={item.total ? ((_.size(trackings) / item.total) * 100) : 0} />
            </Box>
        </HStack>
    )
}

const Notes = () => {
    return (
        <VStack align='stretch' spacing={0} bg='#D0D0D04D' borderRadius="xl">
            <HStack p={4} cursor='pointer' fontSize="lg">
                <Box pr={2} alignItems='center'>
                    <Box p={2} bg={"primaryBlue.400"} color={'white'} borderRadius='50%'>
                        <AiFillFileText />
                    </Box>
                </Box>
                <Box flexGrow='1'>
                    <Text fontWeight='bold'>NOTE</Text>
                </Box>
            </HStack>
            <Box bg='#FFFFFF' borderRadius="xl" p={2}>
                <HStack my={3} p={4} borderRadius='15px' w='100%' cursor='pointer' bg='#6C61D0' fontSize="lg">
                    <Box pr={2} alignItems='center'>
                        <Box p={2} bg={'white'} color={'#DC4955'} borderRadius='50%'>
                            <BsMusicNote fontSize='25px' />
                        </Box>
                    </Box>
                    <Box flexGrow='1' color='white'>
                        <Text fontWeight='bold'>Audio Icon will be used to visit the related page</Text>
                    </Box>
                    <Box>
                        <AiOutlineRight color='white' />
                    </Box>
                </HStack>
                <HStack my={3} p={4} borderRadius='15px' w='100%' cursor='pointer' bg='lightGrayBlue' fontSize="lg">
                    <Box pr={2} alignItems='center'>
                        <Box p={2} bg={'white'} color={'#DC4955'} borderRadius='50%'>
                            <AiFillFilePdf fontSize='25px' />
                        </Box>
                    </Box>
                    <Box flexGrow='1'>
                        <Text fontWeight='bold'>Documents Icon will be used to visit the related page</Text>
                    </Box>
                    <Box>
                        <AiOutlineRight />
                    </Box>
                </HStack>
                <HStack my={3} p={4} borderRadius='15px' w='100%' cursor='pointer' bg='lightGrayBlue' fontSize="lg">
                    <Box pr={2} alignItems='center'>
                        <Box p={2} bg={'white'} color={'#DC4955'} borderRadius='50%'>
                            <AiFillVideoCamera fontSize='25px' />
                        </Box>
                    </Box>
                    <Box flexGrow='1'>
                        <Text fontWeight='bold'>Video Icon will be used to visit the related page</Text>
                    </Box>
                    <Box>
                        <AiOutlineRight />
                    </Box>
                </HStack>

            </Box>
        </VStack>
    )
}

const Notification = () => {
    return (
        <VStack align='stretch' spacing={0} bg='#D0D0D04D' borderRadius="xl">
            <HStack p={4} cursor='pointer' fontSize="lg">
                <Box pr={2} alignItems='center'>
                    <Box p={2} bg={"primaryBlue.400"} color={'white'} borderRadius='50%'>
                        <AiOutlineBell />
                    </Box>
                </Box>
                <Box flexGrow='1'>
                    <Text fontWeight='bold'>Notification</Text>
                </Box>
            </HStack>
            <Box bg='#FFFFFF' borderRadius="xl" p={2}>
                <VStack fontSize="lg" p={2} align='stretch'>
                    <HStack alignItems='center' >
                        <Box><BsFillInfoCircleFill fontSize='22px' color='#FD9F27' /></Box>
                        <HStack borderBottom='1px solid #E4E4E4C3' w='100%' pb={3}>
                            <Box px={2}>
                                <Text fontWeight='bold'>March 2021</Text>
                                <Text fontSize='sm' color='#3C4043B2'>National international current affair...</Text>
                            </Box>
                            <Box pl={2}>
                                <AiOutlineRight />
                            </Box>
                        </HStack>
                    </HStack>
                </VStack>
                <VStack fontSize="lg" p={2} align='stretch'>
                    <HStack alignItems='center' >
                        <Box><BsFillInfoCircleFill fontSize='22px' color='#FD9F27' /></Box>
                        <HStack borderBottom='1px solid #E4E4E4C3' w='100%' pb={3}>
                            <Box px={2}>
                                <Text fontWeight='bold'>March 2021</Text>
                                <Text fontSize='sm' color='#3C4043B2'>National international current affair...</Text>
                            </Box>
                            <Box pl={2}>
                                <AiOutlineRight />
                            </Box>
                        </HStack>
                    </HStack>
                </VStack>
                <VStack fontSize="lg" p={2} align='stretch'>
                    <HStack alignItems='center' >
                        <Box><BsFillInfoCircleFill fontSize='22px' color='#FD9F27' /></Box>
                        <HStack borderBottom='1px solid #E4E4E4C3' w='100%' pb={3}>
                            <Box px={2}>
                                <Text fontWeight='bold'>March 2021</Text>
                                <Text fontSize='sm' color='#3C4043B2'>National international current affair...</Text>
                            </Box>
                            <Box pl={2}>
                                <AiOutlineRight />
                            </Box>
                        </HStack>
                    </HStack>
                </VStack>
            </Box>
        </VStack>
    )
}
