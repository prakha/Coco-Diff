import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ExamWindow } from "../../Components/ExamWindow";
import {
  Box,
  Button,
  Divider,
  Flex,
  HStack,
  Text,
  Tooltip,
  Input,
  Spacer,
  useToast,
  Link,
  Spinner,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from "@chakra-ui/react";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { useState } from "react";
import { toggleExamWindowAction } from "../../redux/reducers/onlineExam";
import {
  AiFillClockCircle,
  AiFillPieChart,
  AiOutlineAreaChart,
  AiOutlineRightCircle,
  AiOutlineUnorderedList,
} from "react-icons/ai";
import _, { size } from "lodash";
import { BsArrowDownCircle, BsClipboardData } from "react-icons/bs";
import { BiCalendarCheck } from "react-icons/bi";
import { FaScroll, FaFileDownload } from "react-icons/fa";
import { bilingualText, getAllPackages } from "../../utils/Helper";
import { VscFilePdf } from "react-icons/vsc";
import { Assignments } from "../Assignments";
import {
  MdLeaderboard,
  MdLibraryBooks,
  MdOutlinePictureAsPdf,
  MdQuestionAnswer,
} from "react-icons/md";
import { TestSyllabusModal } from "../../Components/TestSyllabusModal";
import { MultipleAnalysisModal } from "../../Components/MultipleAnalysisModal";
import { ROUTES } from "../../Constants/Routes";
import moment from "moment";
import { SectionHeader } from "../../Components/SectionHeader";
import { TEST_STATE } from "../../Constants";
import { FcAnswers } from "react-icons/fc";
import { FiMessageSquare } from "react-icons/fi";
import { SiAnsible } from "react-icons/si";
import { getStudentRollAction } from "../../redux/reducers/packages";
import { ErrorChecker } from "../../Components/ErrorChecker";
import { STATUS } from "../../App/Constants";
import { ExternalLinkIcon } from "@chakra-ui/icons";

export const Tests = (props) => {
  const dispatch = useDispatch();
  const params = useParams();
  const history = useHistory();
  const [selectedTab, changeSelectedTab] = useState();
  const [searchData, changeSearchData] = useState("");
  const [testSyllabusModal, changeTestSyllabusModal] = useState({
    modal: false,
    testId: "",
  });
  const [multipleAnalysisModal, changeMultipleAnalysisModal] = useState({
    modal: false,
    testData: "",
    attempts: [],
  });

  const { student, testList, assignments, website, studentRoll, getStudentRollStatus } = useSelector((state) => ({
    attemptsData: state.package.attemptsData,
    student: state.user.student,
    testList: state.package.packageContents?.tests || [],
    assignments: state.package.packageContents?.assignments,
    website: state.website,
    studentRoll:state.package.studentRoll,
    getStudentRollStatus:state.package.getStudentRollStatus
  }));

  const [currentPackage, setCurrentPackage] = useState();
  useEffect(() => {
    if (student) {
      let pkg = _.find(
        getAllPackages(student),
        (d) => d.package?._id === params.packageId
      );
      setCurrentPackage(pkg);
    }
  }, [params.packageId, student]);

  useEffect(() => {
    changeSelectedTab(
      currentPackage?.package?.tests?.length > 0
        ? "myTests"
        : currentPackage?.package?.assignments?.length > 0
        ? "myTestsAssignments"
        : ""
    );
  }, [currentPackage]);

  useEffect(() => {
    if(currentPackage && student.user)
      dispatch(getStudentRollAction({packageId:currentPackage.package._id, userId:student.user}))
  }, [dispatch, student, currentPackage])

  const isOffline = currentPackage?.mode === "offline";
  const toast = useToast()

  const startExam = (test, attemptCheck) => {
    
    if(isOffline &&  !test.forceOnline){
      return toast({
        status: "error",
        title:"Offline Test",
        description: "You have applied for offline attempt, so you cannot attempt this test online, Your center is "+currentPackage?.center?.name+" (" +currentPackage?.center?.address+")"
      })
    }

    localStorage?.removeItem("testId");
    localStorage?.removeItem("attemptId");
    localStorage.setItem("packageId", params.packageId);

    const attemptId = attemptCheck
      ? _.head(_.orderBy(test?.userAttempts, ["createdAt"], ["desc"]))._id
      : null;
    const attemptStatus = attemptCheck ? "Resume" : "Start";

    // history.push(`/exam/start/?testId=${test._id}&testAtemptId=${attemptId}&mode=${attemptStatus}`)

    dispatch(
      toggleExamWindowAction({
        newWindow: true,
        redirect: false,
        testId: test._id,
        attemptId,
        attemptStatus,
      })
    );
  };

  const _discussion = (test) => {
    history.push(
      "/dashboard/exam/discussion/" + params.packageId + "/" + test._id + "/test"
    ); //_.last(test.userAttempts)._id)
  };
  const _leaders = (test) => {
    let attempts = _.orderBy(
      test &&  _.filter(test.userAttempts, (att) => att.progressStatus === "completed"),
       ["createdAt"],
       ["desc"]
     );
     
    history.push(
      "/dashboard/exam/leaders/" + params.packageId + "/" + test._id + '/' + _.head(attempts)?._id
    ); //_.last(test.userAttempts)._id)
  };

  const viewAnalysis = (test) => {
    let attempts = _.orderBy(
     test &&  _.filter(test.userAttempts, (att) => att.progressStatus === "completed"),
      ["createdAt"],
      ["desc"]
    );
    if (attempts?.length > 1) {
      changeMultipleAnalysisModal({
        modal: true,
        testData: test,
        attempts: attempts,
      });
    } else {
      history.push(
        "/dashboard/exam/analysis/" +
          params.packageId +
          "/" +
          test?._id +
          "/" +
          _.head(attempts)?._id
      ); //_.last(test.userAttempts)._id)
    }
  };

  const location = useLocation();

  let breadcrumbs = [
    { title: "Home", link: "/" },
    { title: "My Tests", link: ROUTES.TEST_PACKAGES },
    {
      title: bilingualText(currentPackage?.package.name),
      link: location.pathname,
    },
  ];

const getPkgContentsStatus = useSelector(s => s.package.getPkgContentsStatus)
const [iscompleteddata , setIsCompleteddata] = useState()
const [isactivedata , setIsActivedata] = useState()
const [isexpireddata, setIsExpireddata] = useState()
const [oldtab ,setChangeTab]  = useState('0') 
console.log('iscompleteddata',iscompleteddata)

useEffect(() => {
  let activearray = []
  let completearray = []
  let expiredarray = []
  
  const TestData = currentPackage?.package?.tests?.length && 
  _.chain(currentPackage.package.tests)
  .orderBy( 'startDate', 'desc')
  .map((t) => ({ ...t, test: _.find(testList, (tst) => tst._id == t.test),}))
    .filter(f => 
      !searchData ||
      _.includes(
        _.toUpper(bilingualText(f.test?.name)),
        _.toUpper(searchData)
      ) && f.test?.visibility)
      .map((test, i) => {
        let attemptCheck =
          test.test?.userAttempts?.length &&
          _.last(test.test?.userAttempts).progressStatus ==
            "in-progress"
            ? true
            : false;
    
        const isResume = test?.length && find(
          test.test?.userAttempts,
          (a) => a.progressStatus === TEST_STATE.IN_PROGRESS
        );
        const firstAttempt =
          test?.length  && test.test?.userAttempts[0];
          
        const isCompleted =
          firstAttempt && 
          firstAttempt.progressStatus === TEST_STATE.COMPLETED;
    
        let notAttempts =
          isCompleted &&
          test.test.maxAttempts &&
          test.test?.userAttempts?.length >= test.test.maxAttempts;
    
        let lastCompleted = test.test?.userAttempts.length
          ? _.find(
              test.test?.userAttempts,
              (s) => s.progressStatus == "completed"
            )
          : null;
        let isBefore =
          test.startDate &&
          moment().isBefore(moment(test.startDate));

        let DateCheck = test.startDate && test.endDate;

        let isExpired =
          test.endDate && moment().isAfter(moment(test.endDate));

          if(isExpired){
            expiredarray.push(test)
          }
          else if(isCompleted || notAttempts || lastCompleted ){
            completearray.push(test)
          }
          else if(attemptCheck || isResume || !isCompleted && !isExpired ){
            activearray.push(test)
          }
      }).value()
      setIsCompleteddata(completearray)
      setIsActivedata(activearray)
      setIsExpireddata(expiredarray)
}, [currentPackage, searchData, testList, oldtab])

  return (
    <Box>
      <SectionHeader title="My Tests" breadcrumbs={breadcrumbs} />

      <ErrorChecker status={getStudentRollStatus === STATUS.FETCHING}>
        <>
          <Box>
            {currentPackage?.package?.tests?.length > 0 ? (
              <Button
                leftIcon={<MdLibraryBooks />}
                size="sm"
                background = {selectedTab === "myTests" ? "brand.redAccentLight" : ""}
                color = { selectedTab === "myTests" ? "brand.redAccent" : "" }
                style={{
                  borderRadius: "3px",
                }}
                onClick={() => changeSelectedTab("myTests")}
              >
                My Tests
              </Button>
            ) : null}
            &nbsp;&nbsp;
            {currentPackage?.package?.assignments?.length > 0 ? (
              <Button
                leftIcon={<MdLibraryBooks />}
                background={selectedTab === "myTestsAssignments" ? "brand.redAccentLight" : ""}
                color = {selectedTab === "myTestsAssignments" ? "brand.redAccent" : ""}
                size="sm"
                style={{
                  borderRadius: "3px",
                }}
                onClick={() => changeSelectedTab("myTestsAssignments")}
              >
                My Assignments
              </Button>
            ) : null}
          </Box>

        
                    
          {selectedTab == "myTests" ? (
            <Box boxShadow="sm" p="6" background="white">
              <Box width="100%">
                <Flex mb={4}>
                  <Text fontWeight="bold" fontSize='heading'>
                    My Tests
                  </Text>

                  {
                        getPkgContentsStatus === STATUS.FETCHING ?
                            <Box p={10}>
                                <Spinner />
                            </Box> : null
                    }

                  <Spacer />
                  {/*<Box>
                    <Select placeholder='filter' width='200px'>
                      <option>Name</option>
                      <option>date</option>
                    </Select>
                  </Box>*/}
                  &nbsp;&nbsp;

                      {studentRoll?.length && getStudentRollStatus === STATUS.SUCCESS ? 
                      <HStack px={4} pb={2}>
                        <Text>Roll Number:</Text>
                        <HStack align='center'>
                          <Text fontWeight='bold' fontSize={18}>
                            {studentRoll[0].finalRoll}
                          </Text>
                          <Button background='brand.blue' color='white' size='sm' rightIcon={<BsArrowDownCircle fontSize={15} />}
                            onClick={() => window.open("http://"+window?.location?.host + "/?dr=" + studentRoll[0].finalRoll)}
                          >
                            Download Admit Card
                          </Button>
                        </HStack>
                        <br/>
                      </HStack>
                      :
                      null
                    }
                      
                    </Flex>
                    <Tabs variant='unstyled' isLazy size="sm" onChange={(value) => setChangeTab(value)}>
                    <HStack>  
                        <TabList>
                          <Tab _selected={{ color: 'white', bg: 'blue.500' }}  >Active</Tab>
                          <Tab _selected={{ color: 'white', bg: 'blue.500' }} >Completed</Tab>
                          <Tab _selected={{ color: 'white', bg: 'blue.500' }} >Expired</Tab>
                        </TabList>
                        <Spacer/>
                        <Box mr='4'>
                        <Input
                        placeholder="Search"
                        style={{ minWidth: "300px" }}
                        onChange={(e) => changeSearchData(e.target.value)}
                        />
                      </Box>
                    </HStack>
                      <TabPanels>
                        <TabPanel>
                        {testList?.length && currentPackage ? (
                          <Flex flexWrap="wrap">
                            <TestCard TestData={isactivedata} _discussion={_discussion} _leaders={_leaders} startExam={startExam}
                            currentPackage={currentPackage} isOffline={isOffline} oldtab={oldtab} viewAnalysis={viewAnalysis}/>
                          </Flex>
                        ) : null}
                        </TabPanel>
                        <TabPanel>
                        {testList?.length && currentPackage ? (
                          <Flex flexWrap="wrap">
                            <TestCard TestData={iscompleteddata} _discussion={_discussion} _leaders={_leaders} startExam={startExam}
                            currentPackage={currentPackage} isOffline={isOffline} oldtab={oldtab} viewAnalysis={viewAnalysis}/>
                          </Flex>
                        ) : null}
                        </TabPanel>
                        <TabPanel>
                        {testList?.length && currentPackage ? (
                          <Flex flexWrap="wrap">
                            <TestCard TestData={isexpireddata} _discussion={_discussion} _leaders={_leaders} startExam={startExam}
                            currentPackage={currentPackage} isOffline={isOffline} oldtab={oldtab} viewAnalysis={viewAnalysis}/>
                          </Flex>
                        ) : null}
                        </TabPanel>
                      </TabPanels>
                    </Tabs>
                    <ExamWindow />
                  </Box>
                </Box>
              ) : null}
              {selectedTab == "myTestsAssignments" ? (
                assignments?.length && currentPackage ? (
                  <Box boxShadow="sm" p="6" background="white">
                      {
                            getPkgContentsStatus === STATUS.FETCHING ?
                                <Box p={10}>
                                    <Spinner />
                                </Box> : null
                        }

                    <HStack flexWrap="wrap" justifyContent="center">
                      <Assignments
                        website={website}
                        currentPackage={currentPackage.package}
                        assignments={_.filter(
                          currentPackage?.package?.assignments,
                          (f) => f.assignmentId
                        ).map((t) =>
                          Object.assign(
                            {},
                            {
                              ...t,
                              assignmentId: _.find(
                                assignments,
                                (tst) => tst._id == t.assignmentId
                              ),
                            }
                          )
                        )}
                      />
                    </HStack>
                  </Box>
                ) : null
              ) : null}
              {testSyllabusModal.modal ? (
                <TestSyllabusModal
                  testId={testSyllabusModal.testId}
                  visible={testSyllabusModal.modal}
                  closeModal={() =>
                    changeTestSyllabusModal({ modal: false, testId: "" })
                  }
                />
              ) : null}
              {multipleAnalysisModal.modal ? (
                <MultipleAnalysisModal
                  testData={multipleAnalysisModal.testData}
                  attempts={multipleAnalysisModal.attempts}
                  visible={multipleAnalysisModal.modal}
                  closeModal={() =>
                    changeMultipleAnalysisModal({
                      modal: false,
                      testData: "",
                      attempts: [],
                    })
                  }
                />
              ) : null}
            </>
          </ErrorChecker>
        </Box>
      );
    };

    const TestCard = ({ TestData, isOffline, currentPackage, oldtab, viewAnalysis,_discussion, _leaders, startExam}) => {
      return(
          <>
          {
                _.map(TestData, (test, i) => {
                  // const test = testObj?.test && testObj.test 
                  let attemptCheck =
                          test?.test?.userAttempts?.length &&
                          _.last(test.test?.userAttempts).progressStatus ==
                            "in-progress"
                            ? true
                            : false;

                        const isResume = test?.test?.userAttempts && find(
                          test.test?.userAttempts,
                          (a) => a.progressStatus === TEST_STATE.IN_PROGRESS
                        );
                        const firstAttempt =
                          test?.test?.userAttempts && test.test?.userAttempts[0];
                        const isCompleted =
                          firstAttempt && 
                          firstAttempt.progressStatus === TEST_STATE.COMPLETED;

                        const currentAttempt = isResume;

                        let notAttempts =
                          isCompleted &&
                          test.test.maxAttempts &&
                          test.test?.userAttempts.length >= test.test.maxAttempts;

                        let lastCompleted = test?.test?.userAttempts?.length
                          ? _.find(
                              test.test?.userAttempts,
                              (s) => s.progressStatus == "completed"
                            )
                          : null;
                        let isBefore =
                        test?.startDate &&
                          moment().isBefore(moment(test.startDate));
                        let isExpired =
                          test?.endDate && moment().isAfter(moment(test.endDate));

                            let notDate = !test?.endDate && !test?.startDate
                        
                        return (
                          <Box
                            key={i}
                            background="white"
                            boxShadow="sm"
                            borderWidth="1px"
                            borderRadius="lg"
                            m="3"
                            minWidth="21.0vw"
                            // maxWidth="337px"
                          >
                            <Box>
                              <HStack
                                p="3"
                                borderBottom="1px solid #D6DBDF"
                                lineHeight="tight"
                                fontSize="lg"
                              >
                                <Box paddingRight="4px">
                                  <BsClipboardData fontSize="1.40vw" />
                                </Box>
                                <Box>
                                  <Text padding="0 4">
                                    {bilingualText(test?.test?.name)}
                                  </Text>
                                  <HStack
                                    w="100%"
                                    alignItems="center"
                                    p={1}
                                    fontSize="0.6vw"
                                    background="#F0F3F4"
                                  >
                                    <Box>
                                      <img src="/images/Date.svg" />
                                    </Box>
                                    <Text>
                                      Start{" "}
                                      {test?.startDate ||
                                      currentPackage?.package?.startDate
                                        ? moment(
                                            test?.startDate ||
                                              currentPackage?.package?.startDate
                                          ).format("DD MMM, YYYY HH:mm")
                                        : "---"}
                                    </Text>
                                    <Text>|</Text>
                                    <Text>
                                      End{" "}
                                      {test?.endDate
                                        ? moment(
                                            test?.endDate ||
                                              currentPackage?.package?.endDate
                                          ).format("DD MMM, YYYY HH:mm")
                                        : "---"}
                                    </Text>
                                  </HStack>
                                </Box>
                              </HStack>
                              <Box fontSize="sm" p="3" lineHeight="2">
                                <HStack>
                                  <AiFillClockCircle />{" "}
                                  <Text>
                                    <b>Duration:</b> {test.test?.totalTime} min
                                  </Text>
                                </HStack>
                                <HStack>
                                  <BiCalendarCheck />{" "}
                                  <Text>
                                    <b>No of Attempts:</b>{" "}
                                    {_.size(test.test?.userAttempts)
                                      ? size(test.test.userAttempts)
                                      : "No attempts"}
                                  </Text>
                                </HStack>
                                <HStack>
                                  <AiOutlineUnorderedList />{" "}
                                  <Text>
                                    <b>Total Questions:</b>{" "}
                                    {test.test?.totalQuestions}
                                  </Text>
                                </HStack>
                              </Box>
                              <Box p={3} fontSize="sm">
                                <HStack justifyContent="space-between">
                                  <HStack background="#EFF3F6" p="1">
                                    <FaScroll />{" "}
                                    {firstAttempt &&
                                    firstAttempt.studentResult &&
                                    (firstAttempt.studentResult.totalScore ||
                                      firstAttempt.studentResult.totalScore ===
                                        0) ? (
                                      <Text>
                                        <b>My Score:</b>{" "}
                                        {_.round(
                                          firstAttempt?.studentResult?.totalScore,
                                          2
                                        )}
                                        /{test.test?.maxMarks}&nbsp; &nbsp; &nbsp;
                                        Rank :{" "}
                                        {firstAttempt?.studentResult?.skippedRank ||
                                          "-"}
                                      </Text>
                                    ) : (
                                      <Text>
                                        <b>MM:</b> {test.test?.maxMarks}
                                      </Text>
                                    )}
                                </HStack>
                                </HStack>
                              </Box>
                            </Box>
                            <Divider />
                            <Box display="flex" alignItems="center" w="100%" p="1">
                              {isCompleted ? (
                                <Box mr="1" ml="1">
                                  <Tooltip label="Test Analysis">
                                    <Box
                                      borderRadius="50%"
                                      padding={1}
                                      background="#EFF3F6"
                                    >
                                      <AiOutlineAreaChart
                                        fontSize="28px"
                                        cursor="pointer"
                                        color="green"
                                        onClick={() => viewAnalysis(test && test.test)}
                                      />
                                    </Box>
                                  </Tooltip>
                                </Box>
                              ) : null}
                              { test.test?.testOption?.discussion ? (
                                <Box mr="1" ml="1">
                                  <Tooltip label="Doubt Community">
                                    <Box
                                      onClick={() => _discussion(test.test)}
                                      borderRadius="50%"
                                      padding={1}
                                      background="#EFF3F6"
                                    >
                                      <MdQuestionAnswer
                                        fontSize="28px"
                                        cursor="pointer"
                                        color="#4285F4"
                                      />
                                    </Box>
                                  </Tooltip>
                                </Box>
                              ) : null}
                              {test.test?.resultPublished ? (
                                <Box mr="1" ml="1">
                                  <Tooltip label="Leader Board">
                                    <Box
                                      borderRadius="50%"
                                      padding={1}
                                      background="#EFF3F6"
                                    >
                                      <MdLeaderboard
                                        fontSize="28px"
                                        cursor="pointer"
                                        color="#DC4D4A"
                                        onClick={() => _leaders(test.test)}
                                      />
                                    </Box>
                                  </Tooltip>
                                </Box>
                              ) : null}
                              {test.test?.questionPaper ? (
                                <Box mr="1" ml="1">
                                  <Tooltip label="Question Paper">
                                    <Box
                                      borderRadius="50%"
                                      padding={1}
                                      background="#EFF3F6"
                                      onClick={() =>
                                        window.open(test.test.questionPaper)
                                      }
                                    >
                                      <MdOutlinePictureAsPdf
                                        fontSize="28px"
                                        cursor="pointer"
                                        color="#4E8DF1"
                                      />
                                    </Box>
                                  </Tooltip>
                                </Box>
                              ) : null}
                              {test.test?.answerKey ? (
                                <Box mr="1" ml="1">
                                  <Tooltip label="Answer Keys">
                                    <Box
                                      borderRadius="50%"
                                      padding={1}
                                      background="#EFF3F6"
                                      onClick={() =>
                                        window.open(test.test.answerKey)
                                      }
                                    >
                                      <SiAnsible
                                        fontSize="28px"
                                        cursor="pointer"
                                        color="#4E8DF1"
                                      />
                                    </Box>
                                  </Tooltip>
                                </Box>
                              ) : null}
                              <Spacer />
                              { notAttempts ? (
                                <Text
                                  fontSize="md"
                                  px={2}
                                  fontWeight="bold"
                                  color="brand.green"
                                >
                                  Completed
                                </Text>
                              ) :  isBefore || isExpired ? (
                                <Tooltip
                                  label={
                                    isBefore ? "Currently Not Available" : "Expired"
                                  }
                                >
                                  <Button
                                    colorScheme="green"
                                    variant="ghost"
                                    borderRadius="0"
                                    disabled={true}
                                  >
                                    {isBefore ? "Not Available" : "Expired"}
                                  </Button>
                                </Tooltip>
                              ) : (
                                <Tooltip label={attemptCheck ? "Resume" : "Start"}>
                                  <Button
                                    colorScheme="green"
                                    variant="ghost"
                                    borderRadius="0"
                                    onClick={() =>
                                      startExam(test?.test, attemptCheck)
                                    }
                                  >
                                    {isOffline && !test.test.forceOnline ? (
                                      <Button
                                        borderRadius="4px"
                                        colorScheme="red"
                                        size="sm"
                                        fontSize="sm"
                                      >
                                        Offline
                                      </Button>
                                    ) : attemptCheck ? (
                                      <Button
                                        borderRadius="4px"
                                        rightIcon={
                                          <AiOutlineRightCircle fontSize="1.05vw" />
                                        }
                                        colorScheme="green"
                                        size="sm"
                                      >
                                        RESUME
                                      </Button>
                                    ) : (
                                      <Button
                                        borderRadius="4px"
                                        rightIcon={
                                          <AiOutlineRightCircle fontSize="1.05vw" />
                                        }
                                        colorScheme="red"
                                        size="sm"
                                        fontSize="sm"
                                      >
                                        {isCompleted
                                          ? "Attempt More"
                                          : "Start Test"}
                                      </Button>
                                    )}
                                  </Button>
                                </Tooltip>
                              )}
                            </Box>
                          </Box>
               )
       })}
       </>
       )
}
