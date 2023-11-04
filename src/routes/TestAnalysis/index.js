import React, { useEffect, useState } from 'react'
import { Box, Text, Divider, Button, Flex, Tag } from '@chakra-ui/react'
import { useLocation, useParams } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import { getTestAttemptAction } from '../../redux/reducers/test'
import { getSingleTestDataAction } from '../../redux/reducers/onlineExam'
import { ErrorChecker } from '../../Components/ErrorChecker'
import { STATUS } from '../../App/Constants'
import { bilingualText } from '../../utils/Helper'
import { MdLibraryBooks } from 'react-icons/md';
import { OverallAnalysis } from '../../Components/OverallAnalysis'
import { QuestionWiseAnalysis } from '../../Components/QuestionWiseAnalysis'
import { TimeWiseAnalysis } from '../../Components/TimeWiseAnalysis';
import { SectionHeader } from '../../Components/SectionHeader'
import { ROUTES } from '../../Constants/Routes'
import _ from 'lodash'

export const TestAnalysis = () => {
    const params = useParams()
    const dispatch = useDispatch()
    const location = useLocation()

    const { singleTestStatus, currentTest, currentAttempt, student } = useSelector((state) => ({
        currentAttempt: state.test.currentAttempt,
        currentTest: state.onlineExam?.singleTestData,
        singleTestStatus: state.onlineExam.getSingleTestStatus,
        student: state.user.student
    }))

    const packageId = params.packageId

    useEffect(() => {
        dispatch(getSingleTestDataAction({ testId: params.testId }))
        dispatch(getTestAttemptAction({ id: params.attemptId }))
    }, [dispatch, params.attemptId, params.testId])

    let pkg = student ? _.find(student.packages, p => p.package?._id === packageId) : null

    let breadcrumbs = [
        { title: 'Home', link: '/' },
        { title: 'My Tests', link: ROUTES.TEST_PACKAGES },
        { title: bilingualText(pkg?.package?.name), link: ROUTES.TEST_PACKAGES + '/' + packageId },
        { title: currentTest ? bilingualText(currentTest.name) : '' },
    ]

    return (
        <Box>
            <ErrorChecker status={singleTestStatus}>
                {singleTestStatus === STATUS.SUCCESS && currentAttempt ?
                    currentTest?.testOption?.showAnalysis ?
                        <Box>
                            <SectionHeader title={bilingualText(currentTest.name)} breadcrumbs={breadcrumbs} />
                            <Box mt={2}>
                                <MainAnalysisComponent currentTest={currentTest} currentAttempt={currentAttempt} />
                            </Box>
                        </Box>
                        : currentTest?.resultPublished ?
                            <Box>
                                <Text fontWeight='bold' fontSize='xl'>{bilingualText(currentTest.name)}</Text>
                                <br />
                                <Box mt={2}>
                                    <MainAnalysisComponent currentTest={currentTest} currentAttempt={currentAttempt} />
                                </Box>
                            </Box>
                            :
                            <Text>The analysis will be available after the result is published.</Text>
                    :
                    <Text>Something went wrong</Text>
                }
            </ErrorChecker>
        </Box>
    )
}

export const MainAnalysisComponent = ({ currentAttempt, currentTest }) => {
    const [selectedTab, changeSelectedTab] = useState('overall')
    const [selectedHeaderTab, changeSelectedHeaderTab] = useState('all')
    const [selectedSection, changeSelectedSection] = useState()

    const isoffline = currentAttempt.offline

    return (
        <Box>
            <Flex bg="white" p={3}>
                <Box w="80%" pl='3'>
                    <Tag fontWeight='bold' style={{ marginTop: '5px' }}>Your Score</Tag>&nbsp;&nbsp;
                    <span style={{ fontSize: '24px', color: '#3498DB' }}>
                        {`${currentAttempt.studentResult.totalScore ? _.round(currentAttempt.studentResult.totalScore, 2) : 0} / ${currentTest.maxMarks}`}
                    </span>&nbsp;&nbsp;&nbsp;&nbsp;
                    {
                        isoffline ?
                            <Tag ml={10} colorScheme='red' fontWeight='bold' style={{ marginTop: '5px' }}>offline</Tag>
                            :
                            <>
                                <Tag fontWeight='bold' style={{ marginTop: '5px' }}>Accuracy</Tag>&nbsp;&nbsp;<span style={{ fontSize: '24px' }}>{_.round((currentAttempt.studentResult?.totalStats?.correctNo / currentAttempt?.studentResult?.totalStats?.attemptedNo) * 100 || 0, 2)}%</span>

                            </>
                    }&nbsp;&nbsp;&nbsp;&nbsp;
                    <Tag fontWeight='bold' style={{ marginTop: '5px' }}>Percentile</Tag>&nbsp;&nbsp;<span style={{ fontSize: '24px' }}>{currentAttempt.studentResult?.percentile || 0}%</span>

                </Box>
            </Flex>
            <br />
            <Divider />
            <HeaderAnalysis currentTest={currentTest} currentAttempt={currentAttempt} selectedTab={selectedTab} changeSelectedTab={(e) => changeSelectedTab(e)} />
            <Divider />
            <Box boxShadow="sm" pt="3" bg="white">
                <MainComponent currentTest={currentTest} currentAttempt={currentAttempt} selectedHeaderTab={selectedHeaderTab} selectedTab={selectedTab} section={selectedSection} />
            </Box>

        </Box>
    )
    // return(
    //     <Grid templateColumns="repeat(6, 1fr)">
    //         <GridItem colSpan={1}>
    //             <Box boxShadow="2xl" mt='8' p='2' mr='3' bg="white">
    //                 <SideBarAnalysis currentTest={currentTest} currentAttempt={currentAttempt} selectedHeaderTab={selectedHeaderTab} changeSelectedHeaderTab={(e, sec) => {changeSelectedHeaderTab(e), changeSelectedSection(sec)}}/>
    //             </Box>
    //         </GridItem>
    //         <GridItem colSpan={5}>
    //         </GridItem>
    //     </Grid>
    // )
}

const SideBarAnalysis = ({ currentAttempt, currentTest, selectedHeaderTab, changeSelectedHeaderTab }) => {
    return (
        <Box>
            <Button leftIcon={<MdLibraryBooks />} size="sm" style={{ width: '100%', borderRadius: '3px', backgroundColor: selectedHeaderTab == 'all' ? "#edf2f7" : "white", border: selectedHeaderTab != 'all' ? "1px solid #edf2f7" : "" }} onClick={() => changeSelectedHeaderTab('all', '')}>
                All
            </Button>
            {_.map(currentTest.sections, (s, i) => {
                return (
                    <>
                        <Button leftIcon={<MdLibraryBooks />} size="sm" style={{ width: '100%', borderRadius: '3px', backgroundColor: selectedHeaderTab == s._id ? '#edf2f7' : "white", border: selectedHeaderTab != s._id ? "1px solid #edf2f7" : "" }} onClick={() => changeSelectedHeaderTab(s._id, s)}>
                            {s.subjectRefId.name.en}
                        </Button>
                    </>
                )
            })}
        </Box>
    )
}

const HeaderAnalysis = ({ currentAttempt, currentTest, selectedTab, changeSelectedTab }) => {
    const isoffline = currentAttempt.offline

    return (
        <Box>
            <Box textAlign="center" cursor="pointer" width="150px" display="inline-block" padding={2} borderRadius="sm" fontSize="sm" style={{ backgroundColor: selectedTab == 'overall' ? 'white' : '#f4f2f9' }} onClick={() => changeSelectedTab('overall')}>
                OVERALL
            </Box>
            {currentTest?.testOption?.getTimeAnalysis ?
                <Box textAlign="center" cursor="pointer" width="150px" display="inline-block" padding={2} borderRadius="sm" fontSize="sm" style={{ backgroundColor: selectedTab == 'time_wise' ? 'white' : '#f4f2f9' }} onClick={() => changeSelectedTab('time_wise')}>
                    TIME WISE
                </Box>
                : null}
            {
                isoffline ? null : <Box textAlign="center" cursor="pointer" width="150px" display="inline-block" padding={2} borderRadius="sm" fontSize="sm" style={{ backgroundColor: selectedTab == 'question_wise' ? 'white' : '#f4f2f9' }} onClick={() => changeSelectedTab('question_wise')}>
                    QUESTION WISE
                </Box>
            }
        </Box>
    )
}

const MainComponent = ({ currentAttempt, currentTest, section, selectedTab, selectedHeaderTab }) => {
    return (
        <Box>
            {selectedTab == 'overall' ?
                <OverallAnalysis currentAttempt={currentAttempt} currentTest={currentTest} section={section} />
                : selectedTab == 'time_wise' ?
                    <TimeWiseAnalysis currentAttempt={currentAttempt} currentTest={currentTest} section={section} />
                    : selectedTab == 'question_wise' ?
                        <QuestionWiseAnalysis currentAttempt={currentAttempt} currentTest={currentTest} section={section} />
                        : null}
        </Box>
    )
}
