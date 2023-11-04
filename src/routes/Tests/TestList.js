import {
  Box,
  Button,
  Divider,
  Flex,
  Tooltip,
  HStack,
  Input,
  Spacer,
  Spinner,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useToast,
} from "@chakra-ui/react";
import { filter, find, head, map, orderBy, round, size } from "lodash";
import moment from "moment";
import React, { useEffect, useMemo, useState } from "react";
import {
  AiFillClockCircle,
  AiOutlineAreaChart,
  AiOutlineUnorderedList,
} from "react-icons/ai";
import { BiCalendarCheck } from "react-icons/bi";
import { BsArrowDownCircle, BsClipboardData } from "react-icons/bs";
import { FaScroll } from "react-icons/fa";
import {
  MdLeaderboard,
  MdLibraryBooks,
  MdOutlinePictureAsPdf,
  MdQuestionAnswer,
} from "react-icons/md";
import { SiAnsible } from "react-icons/si";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { ErrorChecker } from "../../Components/ErrorChecker";
import { ExamWindow } from "../../Components/ExamWindow";
import { MultipleAnalysisModal } from "../../Components/MultipleAnalysisModal";
import { SectionHeader } from "../../Components/SectionHeader";
import { TestSyllabusModal } from "../../Components/TestSyllabusModal";
import { STATUS, TEST_STATE } from "../../Constants";
import { ROUTES } from "../../Constants/Routes";
import { toggleExamWindowAction } from "../../redux/reducers/onlineExam";
import { getStudentRollAction } from "../../redux/reducers/packages";
import { bilingualText, getAllPackages } from "../../utils/Helper";
import { Assignments } from "../Assignments";
import { TextCard } from "../Contents/TextFiles";

const getTestListStatus = (test, te, item) => {
  // console.log({ test, te })

  const isOffline = item?.mode === "offline";

  const forceOnline = test.forceOnline;

  const isResume = find(
    test.userAttempts,
    (a) => a.progressStatus === TEST_STATE.IN_PROGRESS
  );

  const completedUserAttempts = filter(
    test.userAttempts,
    (u) => u.progressStatus === TEST_STATE.COMPLETED
  );

  const firstAttempt = test.userAttempts && test.userAttempts[0];

  const isCompleted =
    firstAttempt && firstAttempt.progressStatus === TEST_STATE.COMPLETED;

  const currentAttempt = isResume;

  const isBefore = te.startDate && moment().isBefore(te.startDate);

  const notAvailable = te.endDate && moment().isAfter(moment(te.endDate));

  const isReady = true; // test.testReady
  const testMaxAttempts = test.maxAttempts || 1;

  const status = isResume
    ? "RESUME"
    : isCompleted
    ? size(test.userAttempts) < testMaxAttempts
      ? "RE-ATTEMPT"
      : "ANALYSIS"
    : "START";

  let isExpired = false;

  if (
    testMaxAttempts > 1 &&
    testMaxAttempts <= size(test.completedUserAttempts)
  ) {
    isExpired = true;
  } else if (te.startDate) {
    if (te.endDate && moment(te.endDate).isAfter(moment())) {
      if (moment().isSameOrAfter(moment(te.endDate).add(10, "days"))) {
        isExpired = true;
      }
    } else {
      const dateafter100 = moment(te.startDate).add(100, "days");
      if (moment().isSameOrAfter(dateafter100)) {
        isExpired = true;
      }
    }
  }

  const isOfflineAttempt = isOffline && !forceOnline && !test.resultPublished;
  const canAttempt = !isOfflineAttempt;

  const isAnalytics = status === "ANALYSIS" || status === "RE-ATTEMPT";
  const isMultipleAttempts = size(test.userAttempts) > 1;

  const footerData = {
    text: null,
    button: false,
    color: null,
    label: null,
  };

  if (isReady) {
    if (isBefore) {
      footerData.text = "Currently Not Available";
    } else if (status === "ANALYSIS") {
      footerData.text = "COMPLETED";
      footerData.color = "green";
    } else if (notAvailable) {
      footerData.text = "Not available";
      footerData.color = "blue";
    } else {
      footerData.button = true;
      footerData.color = !canAttempt ? "red" : isResume ? "teal" : "green";

      footerData.label = !canAttempt ? "Offline Test" : status;
    }
  }

  return Object.assign({}, te, {
    test,
    isCompleted,
    isExpired,
    status,
    footerData,
    isOffline,
    isResume,
    firstAttempt,
    currentAttempt,
    isBefore,
    notAvailable,
    isReady,
    isOfflineAttempt,
    canAttempt,
    isAnalytics,
    isMultipleAttempts,
  });
};

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

  const {
    student,
    testList,
    assignments,
    website,
    studentRoll,
    getStudentRollStatus,
  } = useSelector((state) => ({
    attemptsData: state.package.attemptsData,
    student: state.user.student,
    testList: state.package.packageContents?.tests || [],
    assignments: state.package.packageContents?.assignments,
    website: state.website,
    studentRoll: state.package.studentRoll,
    getStudentRollStatus: state.package.getStudentRollStatus,
  }));

  const packageItem = useMemo(() => {
    const a = find(
      student?.packages || [],
      (p) => p.package._id === params.packageId
    );
    if (!a) {
      return a;
    }
    let ptests = a?.package?.tests;
    let passignments = a?.package?.assignments;

    // console.log({ ptests, passignments })

    ptests = map(ptests, (te) => {
      let ntest = find(testList, (t) => t._id === te.test);
      //   console.log({te, ntest })

      return ntest && te && a && getTestListStatus(ntest, te, a);
    });

    // passignments = map(passignments, te => {
    //   let nass = find(assignments, as => as._id === te.assignmentId);
    //   return getAssignmentListStatus(nass, te, a, theme)
    // });

    if (a?.package?.tests || a?.package?.assignments) {
      return Object.assign({}, a, {
        package: Object.assign({}, a.package, {
          tests: ptests,
          // assignments: passignments,
        }),
      });
    }

    return a;
  }, [student?.packages, params.packageId, testList]);

  //   console.log({packageItem})

  const [currentPackage, setCurrentPackage] = useState();

  useEffect(() => {
    if (student) {
      let pkg = find(
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
        : "myTests"
    );
  }, [currentPackage]);

  useEffect(() => {
    if (currentPackage && student.user)
      dispatch(
        getStudentRollAction({
          packageId: currentPackage.package._id,
          userId: student.user,
        })
      );
  }, [dispatch, student, currentPackage]);

  const toast = useToast();

  const location = useLocation();

  let breadcrumbs = [
    { title: "Home", link: "/" },
    { title: "My Tests", link: ROUTES.TEST_PACKAGES },
    {
      title: bilingualText(currentPackage?.package.name),
      link: location.pathname,
    },
  ];

  const getPkgContentsStatus = useSelector(
    (s) => s.package.getPkgContentsStatus
  );

  const testAvailable = currentPackage?.package?.tests?.length;
  const assignmentAvailable = currentPackage?.package?.assignments?.length;
  const [oldtab, setChangeTab] = useState("0");

  const viewAnalysis = (test) => {
    let attempts = orderBy(
      test &&
        filter(test.userAttempts, (att) => att.progressStatus === "completed"),
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
          head(attempts)?._id
      ); //_.last(test.userAttempts)._id)
    }
  };

  return (
    <Box>
      <SectionHeader title="My Tests" breadcrumbs={breadcrumbs} />
      <ErrorChecker status={getStudentRollStatus === STATUS.FETCHING}>
        <>
          <Box>
            {testAvailable ? (
              <Button
                leftIcon={<MdLibraryBooks />}
                size="sm"
                background={
                  selectedTab === "myTests" ? "brand.redAccentLight" : ""
                }
                color={selectedTab === "myTests" ? "brand.redAccent" : ""}
                style={{
                  borderRadius: "3px",
                }}
                onClick={() => changeSelectedTab("myTests")}
              >
                My Tests
              </Button>
            ) : null}
            &nbsp;&nbsp;
            {assignmentAvailable ? (
              <Button
                leftIcon={<MdLibraryBooks />}
                background={
                  selectedTab === "myTestsAssignments"
                    ? "brand.redAccentLight"
                    : ""
                }
                color={
                  selectedTab === "myTestsAssignments" ? "brand.redAccent" : ""
                }
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
          <Box boxShadow="sm" p="6" background="white">
            <Box width="100%">
              <Flex mb={4}>
                <Text fontWeight="bold" fontSize="heading">
                  My {selectedTab === "myTests" ? "Tests" : "Assignments"}
                </Text>
                {getPkgContentsStatus === STATUS.FETCHING ? (
                  <Box p={10}>
                    <Spinner />
                  </Box>
                ) : null}
                <Spacer />
                &nbsp;&nbsp;
                {studentRoll?.length &&
                getStudentRollStatus === STATUS.SUCCESS ? (
                  <RollNumberView studentRoll={studentRoll} />
                ) : null}
              </Flex>

              {selectedTab === "myTests" ? (
                <Box>
                  <Tabs
                    variant="soft-rounded"
                    colorScheme="blue"
                    isLazy
                    size="sm"
                    onChange={(value) => setChangeTab(value)}
                  >
                    <HStack>
                      <TabList>
                        <Tab borderRadius="md">New</Tab>
                        <Tab borderRadius="md">Attempted</Tab>
                        <Tab borderRadius="md">Expired</Tab>
                      </TabList>
                      <Spacer />
                      <Box mr="4">
                        <Input
                          placeholder="Search"
                          style={{ minWidth: "300px" }}
                          onChange={(e) => changeSearchData(e.target.value)}
                        />
                      </Box>
                    </HStack>
                    <TabPanels>
                      <TabPanel>
                        <TestsList
                          mode="new"
                          packageItem={packageItem}
                          viewAnalysis={viewAnalysis}
                        />
                      </TabPanel>
                      <TabPanel>
                        <TestsList
                          mode="attempted"
                          packageItem={packageItem}
                          viewAnalysis={viewAnalysis}
                        />
                      </TabPanel>
                      <TabPanel>
                        <TestsList
                          mode="expired"
                          packageItem={packageItem}
                          viewAnalysis={viewAnalysis}
                        />
                      </TabPanel>
                    </TabPanels>
                  </Tabs>
                  <ExamWindow />

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
                </Box>
              ) : (
                <Box></Box>
              )}
              {selectedTab === "myTestsAssignments" ? (
                assignments?.length && currentPackage ? (
                  <Box boxShadow="sm" p="6" background="white">
                    {getPkgContentsStatus === STATUS.FETCHING ? (
                      <Box p={10}>
                        <Spinner />
                      </Box>
                    ) : null}

                    <HStack flexWrap="wrap" justifyContent="center">
                      <Assignments
                        website={website}
                        currentPackage={currentPackage.package}
                        assignments={filter(
                          currentPackage?.package?.assignments,
                          (f) => f.assignmentId
                        ).map((t) =>
                          Object.assign(
                            {},
                            {
                              ...t,
                              assignmentId: find(
                                assignments,
                                (tst) => tst._id === t.assignmentId
                              ),
                            }
                          )
                        )}
                      />
                    </HStack>
                  </Box>
                ) : null
              ) : null}
            </Box>
          </Box>
        </>
      </ErrorChecker>
    </Box>
  );
};

const TestsList = ({ packageItem, viewAnalysis, mode }) => {
  const tests = useMemo(() => {
    return filter(packageItem?.package?.tests, (t) => {
      return mode === "expired"
        ? t?.isExpired
        : mode === "attempted"
        ? !t?.isExpired && t?.isCompleted
        : !t?.isExpired && !t?.isCompleted;
    });
  }, [packageItem?.package?.tests, mode]);

  return tests?.length ? (
    <Flex flexWrap="wrap">
      {map(tests, (t, i) => {
        console.log({ t });
        return t && t.test?.visibility ? (
          <TestCard viewAnalysis={viewAnalysis} test={t} key={t?._id || i} />
        ) : null;
      })}
    </Flex>
  ) : null;
};

const RollNumberView = ({ studentRoll }) => {
  return (
    <HStack px={4} pb={2}>
      <Text>Roll Number:</Text>
      <HStack align="center">
        <Text fontWeight="bold" fontSize={18}>
          {studentRoll[0].finalRoll}
        </Text>
        <Button
          background="brand.blue"
          color="white"
          size="sm"
          rightIcon={<BsArrowDownCircle fontSize={15} />}
          onClick={() =>
            window.open(
              "http://" +
                window?.location?.host +
                "/?dr=" +
                studentRoll[0].finalRoll
            )
          }
        >
          Download Admit Card
        </Button>
      </HStack>
      <br />
    </HStack>
  );
};

const TestCard = ({ test, viewAnalysis }) => {
  const {
    canAttempt,
    notAvailable,
    isOffline,
    firstAttempt,
    isAnalytics,
    isBefore,
    isCompleted,
    isExpired,
    isOfflineAttempt,
    isResume,
    status,
  } = test;

  const toast = useToast();
  const params = useParams();
  const dispatch = useDispatch();
  const history = useHistory();

  const startExam = (test, isResume) => {
    if (isOffline && !test.forceOnline) {
      return toast({
        status: "error",
        title: "Offline Test",
        description:
          "You have applied for offline attempt, so you cannot attempt this test online, Your center is " +
          currentPackage?.center?.name +
          " (" +
          currentPackage?.center?.address +
          ")",
      });
    }

    localStorage?.removeItem("testId");
    localStorage?.removeItem("attemptId");
    localStorage.setItem("packageId", params.packageId);

    const attemptId = isResume
      ? head(orderBy(test?.userAttempts, ["createdAt"], ["desc"]))._id
      : null;

    const attemptStatus = isResume ? "Resume" : "Start";

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
      "/dashboard/exam/discussion/" +
        params.packageId +
        "/" +
        test._id +
        "/test"
    ); //_.last(test.userAttempts)._id)
  };
  const _leaders = (test) => {
    history.push(
      "/dashboard/exam/leaders/" + params.packageId + "/" + test._id + "/"
    ); //_.last(test.userAttempts)._id)
  };

  return (
    <Box
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
            <Text padding="0 4">{bilingualText(test?.test?.name)}</Text>
            <HStack
              w="100%"
              alignItems="center"
              p={1}
              fontSize="0.6vw"
              background="#F0F3F4"
            >
              <Box>
                <img src="/images/Date.svg" alt="calendar" />
              </Box>
              <Text>
                Start{" "}
                {test?.startDate
                  ? moment(test?.startDate).format("DD MMM, YYYY HH:mm")
                  : "---"}
              </Text>
              <Text>|</Text>
              <Text>
                End{" "}
                {test?.endDate
                  ? moment(test?.endDate).format("DD MMM, YYYY HH:mm")
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
              {size(test.test.userAttempts)
                ? size(test.test.userAttempts)
                : "No attempts"}
            </Text>
          </HStack>
          <HStack>
            <AiOutlineUnorderedList />{" "}
            <Text>
              <b>Total Questions:</b> {test.test.totalQuestions}
            </Text>
          </HStack>
        </Box>
        <Box p={3} fontSize="sm">
          <HStack justifyContent="space-between">
            <HStack background="#EFF3F6" p="1">
              <FaScroll />{" "}
              {test.test?.resultPublished &&
              firstAttempt &&
              firstAttempt.studentResult &&
              (firstAttempt.studentResult.totalScore ||
                firstAttempt.studentResult.totalScore === 0) ? (
                <Text>
                  <b>My Score:</b>{" "}
                  {round(firstAttempt?.studentResult?.totalScore, 2)}/
                  {test.test?.maxMarks}&nbsp; &nbsp; &nbsp; Rank :{" "}
                  {firstAttempt?.studentResult?.skippedRank || "-"}
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
              <Box borderRadius="50%" padding={1} background="#EFF3F6">
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
        {test.test?.testOption?.discussion ? (
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
              <Box borderRadius="50%" padding={1} background="#EFF3F6">
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
                onClick={() => window.open(test.test.questionPaper)}
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
        {test.test.answerKey ? (
          <Box mr="1" ml="1">
            <Tooltip label="Answer Keys">
              <Box
                borderRadius="50%"
                padding={1}
                background="#EFF3F6"
                onClick={() => window.open(test.test.answerKey)}
              >
                <SiAnsible fontSize="28px" cursor="pointer" color="#4E8DF1" />
              </Box>
            </Tooltip>
          </Box>
        ) : null}
        <Spacer />
        {isBefore ? (
          <Text color="orange.500">Not Available</Text>
        ) : status === "ANALYSIS" ? (
          <Text color="green.500">Completed</Text>
        ) : notAvailable ? (
          <Text color="blue.400">Not available</Text>
        ) : !canAttempt ? (
          <Text color="red.500">Offline Test</Text>
        ) : (
          <Button
            onClick={() => startExam(test?.test, isResume ? true : false)}
            size="sm"
            colorScheme={isResume ? "teal" : "green"}
          >
            {status}
          </Button>
        )}

        {/* if (isReady) {
        if (isBefore) {
            footerData.text = "Currently Not Available"
        }
        else if (status === "ANALYSIS") {
            footerData.text = "COMPLETED"
            footerData.color = "green"
        } else if (notAvailable) {
            footerData.text = "Not available"
            footerData.color = "blue"
        }
        else {
            footerData.button = true
            footerData.color = !canAttempt ? "red"
                : isResume ? "teal"
                    : "green"

            footerData.label = !canAttempt ? "Offline Test" : status
        }

    } */}

        {/* {notAttempts ? (
                    <Text
                        fontSize="md"
                        px={2}
                        fontWeight="bold"
                        color="brand.green"
                    >
                        Completed
                    </Text>
                ) : isBefore || isExpired ? (
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
                )} */}
      </Box>
    </Box>
  );
};
