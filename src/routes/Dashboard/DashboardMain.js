import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useSelector } from 'react-redux'
import { Box, HStack, Image, Tag, Text, VStack } from "@chakra-ui/react";
import { ErrorChecker } from "../../Components/ErrorChecker";
import { AiFillFilePdf, AiFillVideoCamera, AiOutlineFileText } from "react-icons/ai";
import { BsMusicNote } from "react-icons/bs";
import _ from "lodash";
import { useHistory } from "react-router";
import { bilingualText } from "../../utils/Helper";
import { testPackageStatus } from "../Tests/TestPackages";
import moment from "moment";
import { DashboardNotifications } from "./DashboardNotications";
import { RecentActivities } from "./RecentActivities";
import { TotalContentStats } from "./TotalContentStats";
import { CoursesList } from "./MyCourses";
import { useApiRequest } from "../../services/api/useApiRequest";
import { URIS } from "../../services/api";
import { RelativePackages } from "./SimilarPackages";
import { ButtonX } from "../../Components/ButtonX";

export const DashboardMain = () => {

    const [dashData, setData] = useState()

    const onCompleted = useCallback((data) => {
        setData(data)
    }, [])

    const onError = useCallback((data) => {
    }, [])

    const {request, loading} = useApiRequest(URIS.STUDENT_DASHBOARD, {
        onCompleted,
        onError
    })

    const getDashboard = useCallback(() => {
        request({method: 'GET'})
    }, [request])

    useEffect(() => {
        getDashboard()
        // dispatch(getDashboardAction())
    }, [getDashboard])

    return(
        <Box>
            <ErrorChecker state={loading}>
                {dashData ? 
                    <Box>
                        <br/>
                        <HStack spacing={6} alignItems='start' wrap>
                            <Box w='70%'>
                                <TotalContentStats dashData={dashData}/>
                                <br/>
                                <HStack spacing={6} alignItems='stretch'>
                                    <RecentActivities dashData={dashData}/>
                                    <CoursesList/>
                                </HStack>
                                <br/>
                                <TestPackage/>
                                <br/>
                                <TestSeries testAttempts={dashData.testAttempts || []}/>
                                <br/>
                                <RelativePackages packages={dashData.similarPackages?.length ? dashData.similarPackages : []}/>
                                <br/>
                            </Box>
                            <Box w='30%'>
                                <DashboardNotifications/>
                            </Box>
                        </HStack>
                        <br/>
                    </Box>
                    :
                    null
                }
            </ErrorChecker>
        </Box>
    )
}

export const headerIcon = <Image w='2.34vw' src='/images/book.svg'/>

const TestPackage = () => {
    const history = useHistory()
    
    const {student, tests, assignments
      } = useSelector((state) => ({
        student: state.user.student,
        tests: state.package.packageContents?.tests,
        assignments: state.package.packageContents?.assignments,
    }));

    const attemptsData = useMemo(() => {
        let attemptsd = student?.packages
          ? _.filter(student?.packages, (p) =>
              _.size(p?.package?.tests  || []) || _.size(p?.package?.assignments || []) 
            )
          : [];
    
        return _.map(attemptsd, (a) => {
          let ptests = a?.package?.tests;
          let passignments = a?.package?.assignments;
    
          ptests = _.map(ptests, (te) => {
            let ntest = _.find(tests, (t) => t._id === te.test);
    
            return Object.assign({}, te, {
              test: ntest,
            });
          });
    
          passignments = _.map(passignments, (te) => {
            let nass = _.find(assignments, (a) => a._id === te.assignmentId);
            return Object.assign({}, te, {
              assignmentId: nass,
            });
          });
    
          if (a?.package?.tests || a?.package?.assignments) {
            return Object.assign({}, a, {
              package: Object.assign({}, a.package, {
                tests: ptests,
                assignments: passignments,
              }),
            });
          }
          return a;
        });
    }, [assignments, student, tests]);

    const openTests = () => {
        history.push('/dashboard/test-packages')
    }

    const openPkg = (pkg) => {
        history.push('/dashboard/test-packages/'+pkg._id)
    }

    return(
        <Box borderRadius='15px' background='white' boxShadow='0px 3px 6px #0000000A'>
            <HStack px={6} py={3} justifyContent='space-between'>
                <HStack spacing={4}>
                    {headerIcon}
                    <Text fontSize='md'>Test Series</Text>
                </HStack>
                <ButtonX onClick={openTests} color='brand.redAccent' bg="white" _hover={{ textDecoration: 'underline', bg: 'white' }} variant='link' fontSize='sm' fontWeight='400'>View All</ButtonX>
            </HStack>
            <HStack py={3} px={6} spacing={6} align='stretch'>
            {attemptsData.length ? attemptsData.slice(0, 4).map((ad) => {
                const pkg = ad.package;
                let totalTest = pkg?.tests?.length;
                let totalAssignment = pkg?.assignments?.length;

                let attemptedTest = _.filter(
                    pkg.tests,
                    (t) => t?.test?.userAttempts.length
                    ).length;

                const attemptedAssignment = _.filter(
                    pkg?.assignments,
                    (a) => _.size(a?.assignmentId?.submissions)
                    ).length;

                let value = _.round(
                ((attemptedTest + attemptedAssignment) /
                    (totalTest + totalAssignment)) *
                    100, 2
                );

                value = String(value) === "NaN" || String(value) === "Infinity" ? 0 : value;
                let pkgStatus = testPackageStatus(value)
                return (
                    <VStack cursor='pointer' p={3} w={'25%'} align='stretch' borderRadius='6px' overflow='hidden' 
                        boxShadow='rgba(17, 17, 26, 0.05) 0px 1px 0px, rgba(17, 17, 26, 0.1) 0px 0px 8px'
                        onClick={() => openPkg(pkg)}
                    >
                        <Box flexGrow={1}>
                            <Text overflowWrap='break-word' fontSize='sm'>{bilingualText(pkg.name)}</Text>
                        </Box>

                        <HStack pt={4} justifyContent='space-between'>
                            <Text color='brand.secondary' fontWeight='600' fontSize='sm'>
                                {attemptedTest +
                                    attemptedAssignment +
                                    "/" +
                                    _.sum([totalTest, totalAssignment])
                                }
                            </Text>
                            
                            <Tag size='sm' variant="solid" borderRadius='4px' fontSize='xs' fontWeight='bold' 
                                colorScheme={pkgStatus == 'Start' ? 'blue' : pkgStatus === 'Progress' ? 'yellow' : 'green'}
                            >
                                {pkgStatus}
                            </Tag>
                        </HStack>
                    </VStack>
                )})
                :
                <Text color='brand.secondary' fontSize='md'>No test available</Text>
            }
            </HStack>
        </Box>
    )
}

const TestSeries = ({testAttempts}) => {
    const history = useHistory()

    const {student} = useSelector(state => ({
        student:state.user.student
    }))

    const [pkgTests, setTests] = useState()

    const openAll = () => {
        history.push('/dashboard/test-packages')
    }

    const openTest = (id) => {
        history.push('dashboard/test-packages/'+id)
    }

    useEffect(() => {
        if(student?.packages?.length){
            let tests = _.chain(student?.packages)
                .flatMap(p => p.package?.tests.map(t => ({...t, package:p.package})))
                .compact()
                .value()
            
            setTests(tests)
        }
    }, [student])
    
    return(
        <Box borderRadius='15px' background='white' boxShadow='0px 3px 6px #0000000A'>
            <HStack px={6} py={2} justifyContent='space-between'>
                <HStack spacing={4}>
                    {headerIcon}
                    <Text fontSize='md'>Attempted Tests</Text>
                </HStack>
                <ButtonX onClick={openAll} color='brand.redAccent' bg="white" _hover={{ textDecoration: 'underline', bg: 'white' }} variant='link' fontSize='sm' fontWeight='400'>View All</ButtonX>
            </HStack>
            <HStack py={2} px={6} spacing={6} align='stretch'>
                {testAttempts?.length && pkgTests?.length ? 
                    testAttempts.slice(0, 4).map(atmpt => {
                        let test = {..._.find(pkgTests,t => t.test === atmpt.testId[0]._id), attempt:atmpt}
                        let progressStatus = test.attempt.progressStatus
                        let isBefore = test.startDate && moment().isBefore(moment(test.startDate));
                        let isExpired = test.endDate && moment().isAfter(moment(test.endDate));

                        return(
                            <VStack justifyContent='space-between' align='stretch' p={3} w={'25%'} borderRadius='6px' overflow='hidden' 
                                boxShadow='rgba(17, 17, 26, 0.05) 0px 1px 0px, rgba(17, 17, 26, 0.1) 0px 0px 8px' cursor='pointer'
                                onClick={() => openTest(test.package._id)}
                            >
                                <Box flexGrow={1}>
                                    <Text overflowWrap='break-word' fontSize='sm'>{bilingualText(atmpt.testId?.[0]?.name)}</Text>
                                </Box>
                                <HStack mt={6} justifyContent='space-between'>
                                    <Box>
                                    </Box>
                                    {isBefore || isExpired ?  
                                        <Tag size='sm' variant="solid" borderRadius='4px' fontSize='xs' fontWeight='bold'
                                            colorScheme='red'
                                        >
                                            {isBefore ? "Not Available" : "Expired"}
                                        </Tag>
                                        :
                                        <Tag size='sm' variant="solid" borderRadius='4px' fontSize='xs' fontWeight='bold'
                                            colorScheme={progressStatus === 'completed' ? 'green' : progressStatus === 'in-progress' ? 'yellow' : 'blue'}
                                        >
                                            {progressStatus === 'in-progress' ? 'Progress' : _.capitalize(progressStatus)}
                                        </Tag>
                                    }
                                </HStack>
                            </VStack>
                        )
                    })
                    :
                    <Text color='brand.secondary' fontSize='md'>No test available</Text>
                }
            </HStack>
        </Box>
    )
}

export const contentType = (type, iconSize = 'lg') => {
    let data
    if(type === 'Audio')
        data = {type:'Audio', icon:<BsMusicNote color='#4285F4' fontSize={iconSize}/>, bg:'#E0EBFF'}
    else if(type === 'Document')
        data = {type:'Document', icon:<AiFillFilePdf color='#169D58' fontSize={iconSize}/>, bg:'#DEFFEE'}
    else if(type === 'Video')
        data = {type:'Video', icon:<AiFillVideoCamera color='#DB4437' fontSize={iconSize}/>, bg:'#FFD3D0'}
    else
        data = {type:'BookContent', icon:<AiOutlineFileText color='#F1C40F' fontSize={iconSize}/>, bg:'#FCF3CF'}
    
    return data
}
