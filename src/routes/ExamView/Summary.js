import { useDispatch, useSelector } from "react-redux";
import React, { useMemo } from "react";

import { Box, Button, Flex, Heading } from "@chakra-ui/react";
import { useExamViewContext } from "./Context";
import { countBy, groupBy, map } from "lodash";
import { TagComponent } from "./MainView";
import { useHistory } from "react-router-dom";

export const ExamSummaryView = () => {
  const {
    testId,
    analysisbutton,
    testData,
    testAttempt: { sectionsKeyedData, questionResponseData, attemptData },
  } = useExamViewContext();
  const history = useHistory()

  const sectionGrouped = useMemo(
    () => groupBy(questionResponseData, "sectionId"),
    [questionResponseData]
  );


  const toAnalysis = () => {
    history.push("/exam/report/analysis?testId=" + testId + "&testAttemptId=" + attemptData?._id)
  }

  const closeWindow = () => {
    localStorage.setItem("testId", testId);
    localStorage.setItem("attemptId", attemptData._id);
    window.close();
    window.ReactNativeWebView?.postMessage(
      JSON.stringify({
        submit: true,
        testId: testId,
        testAttemptId: attemptData._id,
      })
    );
  };

  return (
    <Box flex={1} display="flex" alignItems="center" justifyContent="center">
      <Box>
        <Heading textAlign="center">
          {testData?.name?.en}
        </Heading>
        <Heading mt={10} fontSize="lg" textAlign="center" color="blue.300">
          Test Submitted Successfully
        </Heading>
        {/* <Flex wrap="wrap" flex={1} width="100%">
        {map(sectionsKeyedData, (sec, id) => {
          const currentSecCounts = countBy(sectionGrouped[sec._id], "action");
          return (
            <Box
              boxShadow="lg"
              w={["80%", "60%", "30%"]}
              rounded="md"
              key={id}
              style={{
                backgroundColor: "#ffffff",
                margin: "20px",
                padding: "10px",
              }}
            >
              <h2 style={{ fontSize: "20px" }}>
                <b>{sec?.subjectRefId?.name?.en}</b>
              </h2>
              <br />
              <div>
                <TagComponent
                  title="Total Questions"
                  mainTitle="total-questions"
                  number={sec.questions.length}
                />
                <TagComponent
                  title="Not Visited"
                  mainTitle="not-viewed-yet"
                  number={currentSecCounts["not-viewed-yet"]}
                />
                <TagComponent
                  title="Not Answered"
                  mainTitle="not-attempted"
                  number={currentSecCounts["not-attempted"]}
                />
                <TagComponent
                  title="Answered"
                  mainTitle="attempted"
                  number={currentSecCounts["attempted"]}
                />
                <TagComponent
                  title="Reviewed"
                  mainTitle="reviewed"
                  number={currentSecCounts["reviewed"]}
                />
                <TagComponent
                  title="Answered and To Review"
                  mainTitle="attempted-reviewed"
                  number={currentSecCounts["attempted-reviewed"]}
                />
              </div>
            </Box>
          );
        })}
      </Flex> */}
        <Flex align="center" flexDir={"column"} mt={4} justify="center">
          <Button colorScheme='blue' onClick={closeWindow} >
            Close this window
          </Button>

          {analysisbutton === "true" ? <Button colorScheme='green' my={5} onClick={toAnalysis} >
            View Analysis
          </Button> : null
          }
        </Flex>
      </Box>
      <br />
    </Box>
  );
};
