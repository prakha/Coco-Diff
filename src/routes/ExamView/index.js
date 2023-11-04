import {
  Box,
  Button,
  Checkbox,
  Flex,
  Radio,
  RadioGroup,
  Spinner,
  Text,
  useMediaQuery,
  useToast,
} from "@chakra-ui/react";
import {
  chunk,
  findIndex,
  forEach,
  groupBy,
  keyBy,
  remove,
} from "lodash";
import { clone, compact, find, head, map, orderBy, toUpper } from "lodash";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { URIS } from "../../services/api";
import { useApiRequest } from "../../services/api/useApiRequest";
import { useQueryParams } from "../../utils/useQueryParams";
import { ExamViewContext, useExamViewContext } from "./Context";
import moment from "moment";
import { ExamMainView } from "./MainView";
import { apis } from "../../services/api/apis";
import { ExamSummaryView } from "./Summary";

const getExamAttemptData = (test, attempt) => {
  const sectionsKeyedData = keyBy(test.sections, "_id");
  let allQuestionData = compact(
    map(attempt.finalResponse, (fr, i) => {
      let sectionData = sectionsKeyedData[fr.sectionId];
      let questionData = find(
        sectionData?.questions,
        (q) => q._id === fr.questionId
      );
      return {
        ...questionData,
        sectionId: sectionData._id,
        orderX: i + 1,
        endTime: fr?.endTime,
      };
    })
  );

  const lastAttemptedQuestion = head(
    orderBy(clone(allQuestionData), ["endTime"], ["asc"])
  );

  const testOption = test?.testOption;
  const numQuestionsPerPage =
    (testOption &&
      testOption.numQuestionsPerPage &&
      parseInt(testOption.numQuestionsPerPage)) ||
    1;

  let sectionsWiseQuestionsData = groupBy(allQuestionData, "sectionId");
  let sectionsWiseQuestions = {};
  //split all questions page wise in there respective sections

  map(sectionsWiseQuestionsData, (pagee, secId) => {
    sectionsWiseQuestions[secId] = [...pagee];
  })

  const pageWiseData = chunk(allQuestionData, numQuestionsPerPage)

  // const pageWiseData = flattenDepth(
  //   map(allQuestionData, (pagee, secId) => {
  //     sectionsWiseQuestions[secId] = [...pagee];
  //     let ddd = map(
  //       fill(new Array(Math.ceil(pagee.length / numQuestionsPerPage))),
  //       (_) => pagee.splice(0, numQuestionsPerPage)
  //     );
  //     return ddd;
  //   }),
  //   1
  // );

  let lastAttemptedPage = findIndex(
    pageWiseData,
    (p) => findIndex(p, (que) => que._id === lastAttemptedQuestion._id) !== -1
  );
  const pageNumber = lastAttemptedPage !== -1 ? lastAttemptedPage : 0;

  let currentPageData = pageWiseData[pageNumber];

  //   const allSectionsData = chain(allQuestionData)
  //     .groupBy("sectionId")
  //     .map((ques, sec) => ({ section: head(ques).section, questions: ques }))
  //     .value();
  const examTotalTime = test.totalTime * 60000
  const totalTimeTaken = attempt.totalTimeTaken || 0


  const final = {
    attemptData: attempt,
    sectionsKeyedData,
    allQuestionData,
    sectionsWiseQuestions,
    lastAttemptedPage,
    pageNumber,
    pageWiseData,
    currentPageData,
    questionResponseData: keyBy(attempt.finalResponse, "questionId"),
    currentStartTime: moment().format("x"),
    testStartTime: moment().format("x"),
    examTotalTime,
    totalTimeTaken,
    totalTimeLeft: attempt.timeLeft
  };

  return final;
};

const payloadDataMapping = (testAttempt) => {
  let startTime = testAttempt.currentStartTime;
  let endTime = moment(new Date()).format();
  //Current Question to map response --> either a particuler question or all the current questions
  let currentPageData = testAttempt.currentPageData;

  let responseList = map(currentPageData, (que) => {
    let questionResponse = testAttempt.questionResponseData[que._id];
    return {
      sectionId: que.sectionId,
      questionId: que._id,
      action: questionResponse.action,
      answer: questionResponse.answer,
      startTime: startTime,
      endTime: endTime,
      timeSpent:
        (moment(endTime).valueOf() - moment(startTime).valueOf()) / 1000,
    };
  });
  return responseList;
};

const currentQuestionChange = (actionData, pageWiseData) => {
  if (actionData.typeOfAction === "sectionChange") {
    let pageIndex = findIndex(
      pageWiseData,
      (pg) =>
        findIndex(pg, (d) => d.sectionId === actionData.newSectionId) !== -1
    );
    return {
      newPageData: pageWiseData[pageIndex],
      newPageNumber: pageIndex,
    };
  } else if (actionData.typeOfAction === "randomQuestion") {
    let pageIndex = findIndex(
      pageWiseData,
      (pg) => findIndex(pg, (d) => d._id === actionData.newQuestionId) !== -1
    );
    return {
      newPageData: pageWiseData[pageIndex],
      newPageNumber: pageIndex,
    };
  } else if (actionData.typeOfAction === "prev") {
    return {
      newPageData: pageWiseData[actionData.pageNumber - 1],
      newPageNumber: actionData.pageNumber - 1,
    };
  } else if (actionData.typeOfAction === "next") {
    return {
      newPageData: pageWiseData[actionData.pageNumber + 1],
      newPageNumber: actionData.pageNumber + 1,
    };
  } else {
    return {
      newPageData: pageWiseData[actionData.pageNumber],
      newPageNumber: actionData.pageNumber,
    };
  }
};

export const ExamView = (props) => {
  const actionQueue = useRef([]);

  const query = useQueryParams();
  const testId = query.get("testId");
  const testAttemptId = query.get("testAttemptId");
  const attemptMode = query.get("mode");
  const analysisbutton = query.get('analysis')
  const demo = query.get("demo") || 0;
  const platform = query.get("platform") || "web";
  const [language, changeLanguage] = useState("en");
  const [readAllInstruction, selectReadAllInstruction] = useState(false);

  const [testData, setTestData] = useState();
  const [testAttempt, setTestAttempt] = useState();

  const onCompleted = useCallback((data) => {
    setTestData(data);
  }, []);

  const onError = useCallback((response) => { }, []);

  const { request, loading } = useApiRequest(URIS.GET_SINGLE_TEST_DATA, {
    onCompleted,
    onError,
  });

  useEffect(() => {
    request({ method: "GET", params: { testId } });
  }, [testId, request]);

  const toast = useToast()

  const startExam = useCallback(
    (attemptData) => {
      if (attemptData.progressStatus === "in-progress") {
        const atdata = getExamAttemptData(testData, attemptData);
        window.ReactNativeWebView?.postMessage(
          JSON.stringify({
            type: "started",
            testId: testId,
            testAttemptId: attemptData._id,
          })
        );

        const now = Date.now();
        startRef.current = now;
        counterRef.current = now + atdata.totalTimeLeft;
        setTestAttempt(atdata);
      } else {
        if (attemptData.progressStatus === "completed") {
          toast({
            status: "error",
            "title": "Test already completed, You cannot resume",
            duration: 2000,
          })
        }
      }
    },
    [testData, testId, toast]
  );

  const actionLoading = useRef();
  const [syncError, setSyncError] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [testCompleted, setCompleted] = useState(false);

  const syncAction = useCallback(async () => {
    if (actionQueue.current.length && !actionLoading.current) {
      const toPush = actionQueue.current[0];
      //start loading

      actionLoading.current = true;
      setLoadingSubmit(true);

      // call api
      const response = await apis.actionResponseApi(toPush);

      // loading false
      actionLoading.current = false;
      setLoadingSubmit(false);

      if (response.ok) {
        remove(actionQueue.current, (c) => c.id === toPush.id);
        syncAction();

        if (toPush.progressStatus === "completed") {
          setCompleted(true);
        }
      } else {
        // console.log({response})
        setSyncError(true);
      }
    }
  }, []);

  const afterActionData = useCallback(
    ({ typeOfAction, testAttempt, answer, questionId }) => {
      let responseListData = { ...testAttempt.questionResponseData };

      if (typeOfAction === "pageChange") {
        forEach(testAttempt.currentPageData, (q) => {
          const rq = responseListData[q._id];
          if (rq) {
            responseListData[q._id] = Object.assign({}, rq, {
              answer: rq.answer,
              action:
                rq.action === "not-viewed-yet" ? "not-attempted" : rq.action,
            });
          }
        });

        return responseListData;
      } else {
        const rq = responseListData[questionId];
        if (rq) {
          responseListData[questionId] = Object.assign({}, rq, {
            answer: answer || rq.answer,
            action: typeOfAction || rq.action,
          });
        }
      }
      return responseListData;
    },
    []
  );

  const actionCalled = useCallback(
    ({
      typeOfAction,
      answer,
      questionId,
      timeOver,
      progressStatus,
      newSectionId,
      newQuestionId,
      pageNumber,
    }) => {
      if (
        typeOfAction === "sectionChange" ||
        typeOfAction === "randomQuestion" ||
        typeOfAction === "prev" ||
        typeOfAction === "next" ||
        typeOfAction === "submit"
      ) {
        setTestAttempt((a) => {
          let endDate = moment();
          let actionToPush = {
            id: moment().format("x"),
            attemptedTestId: a.attemptData._id,
            responseList: payloadDataMapping(a),
            totalTimeTaken: timeOver
              ? a.examTotalTime
              : a.totalTimeTaken + endDate.diff(moment(a.testStartTime, "x")),
            progressStatus: progressStatus ? "completed" : "in-progress",
            submittedAt: moment().toISOString(),
          };

          actionQueue.current = actionQueue.current.concat(actionToPush);
          syncAction();

          let data = currentQuestionChange(
            { typeOfAction, newSectionId, newQuestionId, pageNumber },
            clone(a.pageWiseData)
          );

          return {
            ...a,
            currentPageData: data.newPageData,
            currentStartTime: moment().format(),
            pageNumber: data.newPageNumber,
          };
        });

        //todo
      } else {
        setTestAttempt((a) => {
          let data = afterActionData({
            typeOfAction,
            testAttempt: a,
            questionId,
            answer,
          });
          return { ...a, questionResponseData: data };
        });
      }
    },
    [afterActionData, syncAction]
  );

  const changeQuestionAction = useCallback(
    (actionData) => {
      actionCalled({
        ...actionData,
        attemptedTestId: testId,
      });
    },
    [actionCalled, testId]
  );

  const [isSmallDevice] = useMediaQuery("(max-width: 48em)");
  const counterRef = useRef();
  const startRef = useRef();

  const contextValue = useMemo(
    () => ({
      testData,
      demo,
      platform,
      testId,
      syncError,
      changeQuestionAction,
      isSmallDevice,
      testAttempt,
      setTestAttempt,
      language,
      selectReadAllInstruction,
      changeLanguage,
      attemptMode,
      testAttemptId,
      loadingSubmit,
      actionQueue,
      startExam,
      counterRef,
      actionCalled,
      afterActionData,
      readAllInstruction,
      analysisbutton,
    }),
    [
      testData,
      analysisbutton,
      demo,
      platform,
      testId,
      syncError,
      changeQuestionAction,
      isSmallDevice,
      testAttempt,
      language,
      attemptMode,
      testAttemptId,
      loadingSubmit,
      startExam,
      actionCalled,
      afterActionData,
      readAllInstruction,
    ]
  );

  return (
    <ExamViewContext.Provider value={contextValue}>
      <Flex h="100vh" justifyContent="center">
        {loading ? (
          <Box style={{ textAlign: "center" }}>
            <Spinner size={"xl"} />
          </Box>
        ) : testCompleted ? (
          <ExamSummaryView />
        ) : testAttempt ? (
          <ExamMainView />
        ) : testData ? (
          <ExamInstruction />
        ) : null}
        {demo ? (
          <Flex
            position="absolute"
            top={0}
            left={0}
            zIndex={1000}
            fontSize="xs"
            color="white"
            p={1}
            bg="accent.300"
          >
            Demo Attempt
          </Flex>
        ) : null}
      </Flex>
    </ExamViewContext.Provider>
  );
};

const ExamInstruction = () => {
  const {
    testData,
    language,
    startExam,
    platform,
    demo,
    attemptMode,
    testAttemptId,
    selectReadAllInstruction,
    changeLanguage,
    readAllInstruction,
  } = useExamViewContext();

  const languageCheck = () => {
    if (testData.testOption.bilingual) {
      return language;
    } else {
      return "en";
    }
  };

  const onCompleted = useCallback(
    (data) => {
      startExam(data);
    },
    [startExam]
  );

  const onError = useCallback((response) => { }, []);

  const { request, loading } = useApiRequest(URIS.START_TEST_ATTEMPT, {
    onCompleted,
    onError,
  });

  const _startExam = useCallback(() => {
    let data = {};
    if (testAttemptId !== "null" && testAttemptId !== "undefined") {
      data = {
        id: testAttemptId,
        resume: true,
      };
    } else {
      data = {
        platform,
        demo: typeof demo === "number" ? demo : parseInt(demo),
        progressStatus: "in-progress",
        testId: testData._id,
        testLanguage: language == 'bia' ? 'en' : language,
        totalTimeTaken: 0,
      };
    }

    request({
      method: data.id ? "GET" : "POST",
      params: data.id ? data : null,
      data: !data.id ? data : null,
    });
  }, [demo, language, platform, request, testAttemptId, testData._id]);

  return (
    <Box
      flex={1}
      id="tearoff"
      // style={{ height: "100vh", overflow: "auto" }}
      padding={["10px"]}
      px={["10px", "10px", "150px", "150px"]}
    >
      <Box className="bg-white">
        {testData.instruction && testData.instruction.name && testData.instruction.description ? (
          <Box>
            {/* <Grid style={{ background: "#F3F3F3", padding: "10px" }}>
              <Box span={2} style={{ textAlign: "center" }}>
                <FileTextTwoTone style={{ fontSize: "28px" }} />
              </Box>
              <Box span={22}>
                <Heading as="h1" style={{ color: "#34495E" }}>
                  {testData.instructions.name[languageCheck()]
                    ? testData.instructions.name[languageCheck()]
                    : ""}
                </Heading>
              </Box>
            </Grid> */}
            <Flex style={{ padding: "20px" }}>
              <Box w="100%">
                {languageCheck() == 'bia' ?
                  <Box>
                    <Box
                      style={{ display: "inline-block" }}
                      dangerouslySetInnerHTML={{ __html: testData.instruction.description?.en }}
                    />
                    <br /><br /><br />
                    <Box
                      style={{ display: "inline-block" }}
                      dangerouslySetInnerHTML={{ __html: testData.instruction.description?.hn }}
                    />
                  </Box>
                  :
                  <Box
                    style={{ display: "inline-block" }}
                    dangerouslySetInnerHTML={{
                      __html: testData.instruction.description[languageCheck()]
                        ? testData.instruction.description[languageCheck()]
                        : "",
                    }}
                  />
                }
              </Box>
            </Flex>
          </Box>
        ) : (
          <DefaultInstruction singleTestData={testData} />
        )}
        <Flex style={{ padding: "10px" }}>
          <Box w="100%" p={5}>
            <ul style={{ listStyleType: "decimal" }}>
              {attemptMode &&
                toUpper(attemptMode) !== "RESUME" &&
                testData?.testOption &&
                testData?.testOption?.bilingual ? (
                <Box as="li" bg="gray.50" p={3} my={2}>
                  <span style={{ display: "inline" }}>Select Language </span>
                  &nbsp;&nbsp;&nbsp;
                  <RadioGroup name="radiogroup" defaultValue={language}>
                    <Radio
                      value="en"
                      onChange={() => changeLanguage("en")}
                    >
                      <b>English</b>
                    </Radio>
                    <Radio
                      value="hn"
                      ml={2}
                      onChange={() => changeLanguage("hn")}
                    >
                      <b>Hindi</b>
                    </Radio>
                    {testData?.testOption.allowBilingual ?
                      <Radio
                        value="bia"
                        ml={2}
                        onChange={() => changeLanguage("bia")}
                      >
                        <b>Bilingual</b>
                      </Radio>
                      :
                      null
                    }
                  </RadioGroup>
                </Box>
              ) : null}
            </ul>
            <Box style={{ width: "100%" }}>
              <Checkbox
                onClick={() => selectReadAllInstruction(true)}
                isChecked={readAllInstruction}
              >
                <b>I Have Read all The Instructions And Understood</b>
              </Checkbox>
            </Box>
          </Box>
        </Flex>
        <Button
          width="100%"
          onClick={readAllInstruction ? _startExam : null}
          isLoading={loading}
          disabled={!readAllInstruction || loading}
          loadingText={
            testAttemptId && testAttemptId != 'null' ? "Resuming Exam ..." : "Starting Exam ..."
          }
          background='brand.blue' color='white'
          colorScheme={testAttemptId && testAttemptId != 'null' ? 'blue' : "teal"}
          variant="solid"
        >
          {testAttemptId && testAttemptId != 'null' ? "Resume Exam" : "Start Exam"}
        </Button>
        <br /><br />
      </Box>
    </Box>
  );
};

export const DefaultInstruction = ({ singleTestData }) => {
  return (
    <Box style={{ borderBottom: ".5px solid #f4f4f4" }} borderRadius="">
      <Box
        bg="gray.100"
        justifyContent="space-between"
        p={3}
        display="flex"
        borderTopRadius="lg"
      >
        <Box>
          <Text color="gray.600" fontSize="sm">
            Test Duration
          </Text>
          <Text color="gray.800" fontSize="md">
            {" "}
            {singleTestData.totalTime} Minutes
          </Text>
        </Box>

        <Box>
          <Text color="gray.600" fontSize="sm">
            Max Marks
          </Text>
          <Text color="gray.800" fontSize="md">
            {singleTestData.maxMarks}
          </Text>
        </Box>
      </Box>

      <Box ml={3} p={5}>
        <ol>
          <Text as="li" color="gray.800" fontSize="md" mb={[2, 2, 1]}>
            You will get only 1 attempt. Please ensure that you have reliable
            power and internet for the whole duration of test.
          </Text>
          <Text as="li" color="gray.800" fontSize="md" mb={[2, 2, 1]}>
            You cannot pause the test.
          </Text>
          <Text as="li" color="gray.800" fontSize="md" mb={[2, 2, 1]}>
            Evaluate all options carefully.
          </Text>
        </ol>
      </Box>
      <Box p={3} pt={2}>
        {map(singleTestData.sections, (sec, index) => {
          return (
            <Box key={index}>
              <Box py={2}>
                <Flex justify="center" style={{ width: "100%" }}>
                  <Box
                    w="25%"
                    border=".5px solid rgba(97, 209, 245, 1)"
                    borderTopLeftRadius="md"
                    bg="rgba(97, 209, 245, 0.3)"
                    textAlign="center"
                    p={2}
                  >
                    <Text fontSize="sm">Number Of Questions</Text>
                  </Box>

                  <Box
                    w="25%"
                    border=".5px solid rgba(97, 209, 245, 1)"
                    bg="rgba(97, 209, 245, 0.3)"
                    textAlign="center"
                    p={2}
                  >
                    <Text fontSize="sm">Correct Marks</Text>
                  </Box>

                  <Box
                    w="25%"
                    border=".5px solid rgba(97, 209, 245, 1)"
                    bg="rgba(97, 209, 245, 0.3)"
                    textAlign="center"
                    p={2}
                  >
                    <Text fontSize="sm">Incorrect Marks</Text>
                  </Box>
                  <Box
                    w="25%"
                    border=".5px solid rgba(97, 209, 245, 1)"
                    borderTopRightRadius="md"
                    bg="rgba(97, 209, 245, 0.3)"
                    textAlign="center"
                    p={2}
                  >
                    <Text fontSize="sm">Question Type</Text>
                  </Box>
                </Flex>
                {map(sec.questionTypeGroup, (s, i) => (
                  <Flex justify="center" style={{ width: "100%" }} key={s._id}>
                    <Box
                      w="25%"
                      style={{
                        border: ".5px solid rgba(97, 209, 245, 1)",
                        borderBottomLeftRadius:
                          i + 1 == sec.questionTypeGroup.length ? "8px" : "0px",

                        padding: "5px",
                        textAlign: "center",
                      }}
                    >
                      {s.noOfQuestions}
                    </Box>
                    <Box
                      w="25%"
                      style={{
                        border: ".5px solid rgba(97, 209, 245, 1)",
                        padding: "5px",
                        textAlign: "center",
                        color: "green",
                      }}
                    >
                      {s.markingScheme && s.markingScheme.correct
                        ? s.markingScheme.correct
                        : "-"}
                    </Box>
                    <Box
                      w="25%"
                      style={{
                        border: ".5px solid rgba(97, 209, 245, 1)",
                        padding: "5px",
                        textAlign: "center",
                        color: "red",
                      }}
                    >
                      {s.markingScheme && s.markingScheme.incorrect
                        ? s.markingScheme.incorrect
                        : "-"}
                    </Box>
                    <Box
                      w="25%"
                      style={{
                        border: ".5px solid rgba(97, 209, 245, 1)",
                        borderBottomRightRadius:
                          i + 1 == sec.questionTypeGroup.length ? "8px" : "0px",

                        padding: "5px",
                        textAlign: "center",
                      }}
                    >
                      {s.type}
                      {s.partialMarking ? (
                        <b style={{ color: "red" }}>*</b>
                      ) : (
                        ""
                      )}
                    </Box>
                  </Flex>
                ))}
              </Box>
              {findIndex(sec.questionTypeGroup, (s) => s.partialMarking) !=
                -1 ? (
                <Box style={{ color: "red", fontSize: "14px" }}>
                  *Starred section contains partial marking.
                </Box>
              ) : null}
              <br />
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};
