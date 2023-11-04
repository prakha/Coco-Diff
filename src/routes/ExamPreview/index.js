import { Box, Flex, Spinner, useMediaQuery } from "@chakra-ui/react";
import {
  clone,
  compact,
  fill,
  find,
  findIndex,
  flattenDepth,
  groupBy,
  head,
  keyBy,
  map,
  orderBy,
} from "lodash";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { apiClient, URIS } from "../../services/api";
import { useApiRequest } from "../../services/api/useApiRequest";
import { useQueryParams } from "../../utils/useQueryParams";
import { ExamPreviewContext } from "./Context";
import { ExamMainPreView } from "./ExamPreview";
import moment from "moment";
import { apis } from "../../services/api/apis";
import { useHistory } from "react-router-dom";

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
  const pageWiseData = flattenDepth(
    map(sectionsWiseQuestionsData, (pagee, secId) => {
      sectionsWiseQuestions[secId] = [...pagee];
      let ddd = map(
        fill(new Array(Math.ceil(pagee.length / numQuestionsPerPage))),
        (_) => pagee.splice(0, numQuestionsPerPage)
      );
      return ddd;
    }),
    1
  );

  let lastAttemptedPage = findIndex(
    pageWiseData,
    (p) => findIndex(p, (que) => que._id === lastAttemptedQuestion._id) !== -1
  );
  const pageNumber = lastAttemptedPage !== -1 ? lastAttemptedPage : 0;

  let currentPageData = pageWiseData[pageNumber];

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
    examTotalTime: test.totalTime * 60000,
    totalTimeTaken: attempt.totalTimeTaken || 0,
  };

  return final;
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

export const ExamPreviewScreen = (props) => {
  const query = useQueryParams();
  const testId = query.get("testId");
  const testAttemptId = query.get("testAttemptId");
  const attemptMode = query.get("mode");
  const demo = query.get("demo") || 0;
  const platform = query.get("platform") || "web";
  const [language, changeLanguage] = useState("en");

  const [testData, setTestData] = useState();
  const [testAttempt, setTestAttempt] = useState();

  const [attemptLoading, setAttemptLoading] = useState(false);

  const requestAttempt = useCallback(
    async (tdata) => {
      setAttemptLoading(true);
      const res = await apis.getTestAttemptApi({ id: testAttemptId });
      setAttemptLoading(false);
      if (res.ok) {
        const atdata = getExamAttemptData(tdata, res.data);
        setTestAttempt(atdata);
      } else {
      }
    },
    [testAttemptId]
  );

  const onCompleted = useCallback(
    (data) => {
      //   console.log({data})
      setTestData(data);
      //call the attempt response
      requestAttempt(data);
    },
    [requestAttempt]
  );

  const onError = useCallback((response) => {}, []);

  const { request, loading } = useApiRequest(URIS.GET_SINGLE_TEST_DATA, {
    onCompleted,
    onError,
  });

  useEffect(() => {
    request({ method: "GET", params: { testId } });
  }, [testId, request]);

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
        typeOfAction === "randomQuestion" ||
        typeOfAction === "prev" ||
        typeOfAction === "next"
      ) {
        setTestAttempt((a) => {
          let data = currentQuestionChange(
            { typeOfAction, newSectionId, newQuestionId, pageNumber },
            clone(a.pageWiseData)
          );

          return {
            ...a,
            currentPageData: data.newPageData,
            pageNumber: data.newPageNumber,
          };
        });
      } else {
      }
    },
    []
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

  const exitReport = useCallback(() => {
   if(typeof window !== "undefined"){
    window.close();    
    window.ReactNativeWebView?.postMessage(
      JSON.stringify({
        exit: true,
        testId: testId,
        testAttemptId: testAttemptId,
      })
    );
   }
    // history.goBack()
  },[testAttemptId, testId])

  const contextValue = useMemo(
    () => ({
      testData,
      demo,
      platform,
      testId,
      exitReport,
      isSmallDevice,
      testAttempt,
      setTestAttempt,
      language,
      changeLanguage,
      attemptMode,
      testAttemptId,
      changeQuestionAction,
    }),
    [
      changeQuestionAction,
      testData,
      demo,
      platform,
      testId,
      exitReport,
      isSmallDevice,
      testAttempt,
      language,
      attemptMode,
      testAttemptId,
    ]
  );

  //   console.log({loading, testData, testAttempt})

  return (
    <ExamPreviewContext.Provider value={contextValue}>
      <Flex h="100vh" justifyContent="center">
        {loading || attemptLoading ? (
          <Box style={{ textAlign: "center" }}>
            <Spinner size={"xl"} />
          </Box>
        ) : testData && testAttempt ? (
          <ExamMainPreView />
        ) : null}
      </Flex>
    </ExamPreviewContext.Provider>
  );
};
