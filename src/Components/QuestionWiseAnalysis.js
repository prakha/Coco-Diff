import React, { useEffect, useState, useRef, useMemo } from "react";
import { useHistory } from "react-router";
import {
  Box,
  HStack,
  Progress,
  Stack,
  Text,
  Spacer,
  Center,
  Divider,
  GridItem,
  Grid,
  Button,
  Code,
  Tag,
  Flex,
  Select,
} from "@chakra-ui/react";
import { CheckIcon, CloseIcon } from "@chakra-ui/icons";
import { AiOutlineCheckCircle, AiOutlineCloseCircle } from "react-icons/ai";
import { typeset } from "../utils/Helper";

export const QuestionWiseAnalysis = ({
  currentTest,
  currentAttempt,
  section,
}) => {
  const texRef = useRef(null);
  const history = useHistory();
  const [language, changeLanguage] = useState("en");

  //   const renderFun = () => {
  //     const currentData = texRef.current;
  //     window.renderMathInElement(currentData);
  //   };

  // useEffect(() => {
  //     renderFun()
  // }, [section, language])

  useEffect(() => {
    // renderFun();
    typeset(() => texRef.current);
  }, [section, language]);

  let data = useMemo(
    () =>
      section
        ? section.questions
        : _.flatMap(currentTest.sections, (s) => s.questions),
    [section]
  );
  return (
    <div>
      <div>
        <Flex>
          {/* <Box w="80%" pl='3'>
                       <Tag fontWeight='bold' style={{marginTop: '5px'}}>Your Score</Tag>&nbsp;&nbsp;<span style={{fontSize: '24px'}}>{_.round(currentAttempt.studentResult.totalScore, 2)}/{currentTest.maxMarks}</span>&nbsp;&nbsp;&nbsp;&nbsp;
                       <Tag fontWeight='bold' style={{marginTop: '5px'}}>Accuracy</Tag>&nbsp;&nbsp;<span style={{fontSize: '24px'}}>{_.round((currentAttempt.studentResult?.totalStats?.correctNo/currentAttempt?.studentResult?.totalStats?.attemptedNo)*100, 2)}%</span>
                    </Box> */}
          {currentTest.testOption.bilingual ? (
            <Box w="20%">
              <div style={{ width: "150px", marginTop: "3px" }}>
                <Select
                  value={language}
                  onChange={(e) => changeLanguage(e.target.value)}
                  size="xs"
                >
                  <option value="en">&nbsp;&nbsp;ENGLISH&nbsp;&nbsp;</option>
                  <option value="hn">&nbsp;&nbsp;HINDI&nbsp;&nbsp;</option>
                  <option value="bia">&nbsp;&nbsp;BILINGUAL&nbsp;&nbsp;</option>
                </Select>
              </div>
            </Box>
          ) : null}
        </Flex>
      </div>
      <br />
      <div
        ref={texRef}
        style={{
          maxHeight: "800px",
          overflowY: "scroll",
          background: "#f4f2f9",
        }}
      >
        {_.map(data, (d, i) => {
          let questionResponse = _.find(
            currentAttempt.finalResponse,
            (s) => s.questionId == d._id
          );
          return (
            <Box
              boxShadow="sm"
              rounded="md"
              w={"100%"}
              style={{ backgroundColor: "#ffffff" }}
              mt={2}
              key={d._id}
            >
              {d?.questionRefId?.paragraph ? (
                language == "bia" ? (
                  <Code style={{ padding: "20px" }}>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: d?.questionRefId?.paragraph?.body?.en,
                      }}
                    />
                    <br />
                    <div
                      dangerouslySetInnerHTML={{
                        __html: d?.questionRefId?.paragraph?.body?.hn,
                      }}
                    />
                  </Code>
                ) : (
                  <Code style={{ padding: "20px" }}>
                    {d?.questionRefId?.paragraph?.body ? (
                      <div
                        dangerouslySetInnerHTML={{
                          __html: d?.questionRefId?.paragraph?.body[language],
                        }}
                      />
                    ) : null}
                  </Code>
                )
              ) : null}

              <div style={{ padding: "20px" }}>
                <Tag style={{ float: "right" }}>
                  {_.toUpper(d?.questionRefId?.type)}
                </Tag>
                {questionResponse?.action == "not-viewed" ? (
                  <>
                    <Tag style={{ float: "right" }}>NotAttempted</Tag>
                    &nbsp;&nbsp;&nbsp;
                  </>
                ) : null}
                {language == "bia" ? (
                  <span>
                    <b>{i + 1}.&nbsp;&nbsp;</b>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: d?.questionRefId?.question?.en,
                      }}
                    />
                    <br />
                    <div
                      dangerouslySetInnerHTML={{
                        __html: d?.questionRefId?.question?.hn,
                      }}
                    />
                  </span>
                ) : (
                  <span>
                    {d?.questionRefId?.question ? (
                      <>
                        <b>{i + 1}.&nbsp;&nbsp;</b>
                        <div
                          dangerouslySetInnerHTML={{
                            __html: d?.questionRefId?.question[language],
                          }}
                        />
                      </>
                    ) : null}
                  </span>
                )}
              </div>

              {d?.questionRefId?.type === "Integer" ? (
                <div
                  style={{
                    paddingLeft: "20px",
                    paddingBottom: "20px",
                    borderBottom: "1px solid #e2e1e5",
                  }}
                >
                  ANSWER: {d?.questionRefId?.answer}
                  {questionResponse?.answer.length ? (
                    <span
                      style={{
                        paddingLeft: "20px",
                        paddingBottom: "20px",
                        paddingRight: "25px",
                        float: "right",
                      }}
                    >
                      <Tag
                        fontWeight="bold"
                        style={{
                          background: _.isEqual(
                            questionResponse?.answer,
                            d?.questionRefId?.answer
                          )
                            ? "green"
                            : "red",
                          color: "white",
                        }}
                      >
                        &nbsp;&nbsp;{_.map(questionResponse?.answer, (s) => s)}
                        &nbsp;&nbsp;
                      </Tag>
                    </span>
                  ) : null}
                </div>
              ) : (
                <div>
                  {_.map(d?.questionRefId?.options || [], (op, i) => {
                    let correctAnswer =
                      _.findIndex(
                        d.questionRefId.answer,
                        (ans) => ans == op._id || ans == op.temp_id
                      ) != -1;
                    let yourAnswer =
                      questionResponse?.answer.length &&
                      _.findIndex(
                        questionResponse.answer,
                        (s) => s == op._id || s == op.temp_id
                      ) != -1;

                    return (
                      <div
                        key={i}
                        style={{
                          borderTop: i == 0 ? "1px solid #e2e1e5" : "",
                          borderBottom: "1px solid #e2e1e5",
                          padding: "20px",
                          backgroundColor: correctAnswer ? "#EAFAF1" : "",
                        }}
                      >
                        <Flex>
                          <Box
                            mr={1}
                            style={{ paddingLeft: "5px", display: "block" }}
                          >
                            <span
                              style={{
                                padding: "9px 14px",
                                background: "white",
                                borderRadius: "50%",
                                border: false ? "" : "1px solid #e2e1e5",
                                backgroundColor: false ? "#4B37A5" : "",
                                color: false ? "white" : "",
                              }}
                            >
                              {op?.key?.en}
                            </span>
                          </Box>
                          <Box flex={1}>
                            {language == "bia" ? (
                              <span>
                                <div
                                  dangerouslySetInnerHTML={{
                                    __html: op?.body?.en,
                                  }}
                                />
                                <br />
                                <div
                                  dangerouslySetInnerHTML={{
                                    __html: op?.body?.hn,
                                  }}
                                />
                              </span>
                            ) : (
                              <>
                                {op?.body ? (
                                  <div
                                    dangerouslySetInnerHTML={{
                                      __html: op?.body[language],
                                    }}
                                  />
                                ) : null}
                              </>
                            )}
                          </Box>
                        </Flex>
                        <Box style={{ paddingLeft: "5px", display: "block" }}>
                          {yourAnswer ? (
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "flex-end",
                              }}
                            >
                              {/* <Tag style={{background: yourAnswer && correctAnswer ? 'green' : 'red', color: 'white', textAlign: 'center'}} fontWeight='bold' >Your Answer</Tag> */}
                              <div style={{ paddingRight: 4 }}>
                                {correctAnswer ? (
                                  <AiOutlineCheckCircle
                                    fontSize={18}
                                    style={{ color: "#66BB6A" }}
                                  />
                                ) : (
                                  <AiOutlineCloseCircle
                                    fontSize={18}
                                    style={{ color: "red" }}
                                  />
                                )}
                              </div>
                              <Tag
                                size="sm"
                                colorScheme={correctAnswer ? "green" : "red"}
                              >
                                Your Answer
                              </Tag>
                            </div>
                          ) : null}
                        </Box>
                      </div>
                    );
                  })}
                  {d.questionRefId.solution &&
                  (d.questionRefId.solution.en ||
                    d.questionRefId.solution.hn) ? (
                    <div style={{ paddingLeft: "20px", paddingBottom: "20px" }}>
                      <br />
                      <b>Solution.</b>
                      <div
                        dangerouslySetInnerHTML={{
                          __html: d.questionRefId.solution.en,
                        }}
                      />
                      <br />
                      <br />
                      <div
                        dangerouslySetInnerHTML={{
                          __html: d.questionRefId.solution.hn,
                        }}
                      />
                    </div>
                  ) : null}
                </div>
              )}
            </Box>
          );
        })}
        <br />
      </div>
    </div>
  );
};
