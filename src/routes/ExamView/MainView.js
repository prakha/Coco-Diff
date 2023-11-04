import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CloseIcon,
} from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  Heading,
  Square,
  Text,
  useDisclosure,
  Tag,
  Stack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  IconButton,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerBody,
  DrawerHeader,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  TagLabel,
  Circle,
  Code,
  HStack,
  useToast,
} from "@chakra-ui/react";
import {
  concat,
  countBy,
  findIndex,
  groupBy,
  map,
  toUpper,
  uniq,
} from "lodash";
import moment from "moment";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Countdown from "react-countdown";
import { BsGrid } from "react-icons/bs";
import { Numpad } from "../../Components/Numpad";
import { QUESTION_COLOR } from "../../Constants";
import { useExamViewContext } from "./Context";
import { InnerExamViewContext, useInnerExamViewContext } from "./InnerContext";
const TopQuestionRef = React.createRef();

export const ExamMainView = (props) => {
  const {
    testData,
    changeQuestionAction,
    testAttempt,
    isSmallDevice,
    language,
  } = useExamViewContext();

  const [allSections, changeAllSection] = useState(true);
  const [submitModal, changeSubmitModal] = useState({ modal: false, type: "" });

  const [testLanguage, changeTestLanguage] = useState(language || "en");

  const {
    isOpen: sidebarOpen,
    onClose: sidebarClose,
    onToggle: sidebarToggle,
  } = useDisclosure();

  useEffect(() => {
    if(testData?.testOption?.questionNumbersView)
      changeAllSection(testData.testOption.questionNumbersView === 'normal' ? true : false)
  }, [testData])

  useEffect(() => {
    // console.log("[pagechange hook]");
    changeQuestionAction({
      typeOfAction: "pageChange",
    });
  }, [changeQuestionAction, testAttempt?.pageNumber]);

  const contextValue = useMemo(
    () => ({
      sidebarClose,
      submitModal,
      changeSubmitModal,
      sidebarToggle,
      sidebarOpen,
      testLanguage,
      changeTestLanguage,
      allSections,
      changeAllSection,
    }),
    [
      allSections,
      sidebarClose,
      sidebarOpen,
      sidebarToggle,
      submitModal,
      testLanguage,
    ]
  );
  const { pageNumber, pageWiseData } = testAttempt;
  const isLastPage = useMemo(
    () => (pageNumber === pageWiseData.length - 1 ? true : false),
    [pageNumber, pageWiseData]
  );

  return (
    <InnerExamViewContext.Provider value={contextValue}>
      <Box h="100vh" style={{ backgroundColor: "#f5f7fa" }}>
        <Flex w="100vw" h="100vh">
          <Flex direction="column" w={["100%", "100%", "75%"]} h={"100vh"}>
            <HeaderView />
            <Box flex={1} overflowY="auto">
              <QuestionComponent />
            </Box>
            <Box
              boxShadow="lg"
              bg="white"
              display={"flex"}
              padding={"10px"}
              alignItems="center"
              justifyContent={isSmallDevice ? "space-between" : "flex-end"}
              //boxShadow="lg"
              w={"100%"}
            >
              {isSmallDevice ? (
                <IconButton
                  colorScheme="primary"
                  aria-label="toggle"
                  onClick={sidebarToggle}
                  icon={<BsGrid />}
                />
              ) : null}

              <Button
                colorScheme="white"
                variant="text"
                style={{ margin: "3px" }}
                disabled={pageNumber === 0}
                onClick={() => {
                  TopQuestionRef.current.scrollIntoView(true);

                  changeQuestionAction({
                    pageNumber: pageNumber,
                    typeOfAction: "prev",
                  });
                }}
              >
                <ChevronLeftIcon /> &nbsp;Prev
              </Button>

              {isLastPage && isSmallDevice ? (
                <Button
                  colorScheme="accent"
                  style={{ margin: "3px" }}
                  disabled={!isLastPage}
                  onClick={sidebarToggle}
                >
                  Submit&nbsp;
                  <ChevronRightIcon />
                </Button>
              ) : (
                <Button
                  colorScheme="success"
                  bg="brand.green"
                  color="white"
                  style={{ margin: "3px" }}
                  disabled={isLastPage}
                  onClick={() => {
                    TopQuestionRef.current.scrollIntoView(true);

                    changeQuestionAction({
                      pageNumber: pageNumber,
                      typeOfAction: "next",
                    });
                  }}
                >
                  Save & Next&nbsp;
                  <ChevronRightIcon />
                </Button>
              )}
            </Box>
          </Flex>

          <RightComponentWrapper />
        </Flex>
        <SubmitModalComponent />
      </Box>
    </InnerExamViewContext.Provider>
  );
};

const RightComponentWrapper = (props) => {
  const { isSmallDevice } = useExamViewContext();
  const { sidebarOpen, sidebarClose } = useInnerExamViewContext();
  return isSmallDevice ? (
    <Drawer
      isOpen={sidebarOpen}
      size="sm"
      placement="bottom"
      onClose={sidebarClose}
    >
      <DrawerOverlay />
      <DrawerContent>
        <DrawerHeader>
          <Flex alignItems="flex-end">
            <IconButton icon={<CloseIcon />} onClick={sidebarClose} />
          </Flex>
        </DrawerHeader>
        {/* <DrawerHeader>Create your account</DrawerHeader> */}
        <DrawerBody style={{ padding: 0, maxHeight: "100vh" }}>
          <RightComponent height="80vh" />
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  ) : (
    <RightComponent />
  );
};

// (
//   <Flex>
//     {map(sectionsKeyedData, (sec, id) => {
//       let activeSection =
//         findIndex(currentPageData, (cq) => cq.sectionId === sec._id) !==
//         -1;

//       return (
//         <Flex
//           key={id}
//           style={{
//             cursor: "pointer",
//             padding: "20px 15px 5px 15px",
//             borderBottom: activeSection ? "4px solid #4b37a5" : "",
//             color: "black",
//           }}
//           onClick={() =>
//             changeQuestionAction({
//               pageNumber: pageNumber,
//               typeOfAction: "sectionChange",
//               newSectionId: sec._id,
//             })
//           }
//         >
//           <b>{sec?.subjectRefId?.name?.en}</b>
//         </Flex>
//       );
//     })
//}
// </Flex>
//)

const HeaderView = (props) => {
  const { isSmallDevice, testData } = useExamViewContext();

  const { changeTestLanguage, testLanguage } = useInnerExamViewContext();

  // const langRef = useRef();

  return (
    <Flex
      spread
      boxShadow="xs"
      minH="52px"
      style={{
        paddingLeft: "0px",
        backgroundColor: "white",
        position: "sticky",
        top: "0px",
        zIndex: "1",
      }}
    >
      <Flex
        w="100%"
        alignItems="center"
        color="white"
        justifyContent="space-between"
      >
        <Heading m={3} size="sm" color="gray.800">
          {testData.name.en}
        </Heading>

        {isSmallDevice ? <Timer hideLabel /> : null}
      </Flex>

      <Flex alignItems="center" padding={3}>
        {testData.testOption.bilingual ? (
          <Menu>
            <MenuButton
              value={testLanguage}
              as={Button}
              borderRadius="xs"
              size="xs"
              rightIcon={<ChevronDownIcon />}
            >
              {toUpper(testLanguage)}
            </MenuButton>
            <MenuList>
              <MenuItem value={"en"} onClick={() => changeTestLanguage("en")}>
                EN
              </MenuItem>
              <MenuItem value="hn" onClick={() => changeTestLanguage("hn")}>
                HI
              </MenuItem>
              {testData.testOption.allowBilingual ?
                <MenuItem value="bia" onClick={() => changeTestLanguage("bia")}>
                  BI
                </MenuItem>
                :
                null
              }
            </MenuList>
          </Menu>
        ) : null}
      </Flex>
    </Flex>
  );
};

const RightComponent = ({ height }) => {
  const { isSmallDevice, testAttempt } = useExamViewContext();
  const { allSections, changeAllSection, submitModal, changeSubmitModal } =
    useInnerExamViewContext();
  const {
    allQuestionData,
    sectionsKeyedData,
    questionResponseData,
    sectionsWiseQuestions,
  } = testAttempt;

  //   console.log({ allQuestionData }, sectionsWiseQuestions);
  const counts = useMemo(
    () => countBy(questionResponseData, "action"),
    [questionResponseData]
  );

  return (
    <Box
      w={["100%", "100%", "25%"]}
      h={height || "100vh"}
      overflow="auto"
      bg="white"
      display="flex"
      flexDirection="column"
    >
      <Box position="sticky" top={0} paddingBottom={["10px"]}>
        {isSmallDevice ? null : <Timer />}
      </Box>
      <Box marginBottom="20px" flex={1}>
        {!isSmallDevice ? (
          <Box
            padding={["10px", "20px"]}
            paddingTop={["0px", "0px"]}
            borderBottom="1px solid #F2F3F4"
          >
            <TagComponentS
              title="Not Visited"
              mainTitle="not-viewed-yet"
              number={counts["not-viewed-yet"]}
            />
            <TagComponentS
              title="Not Answered"
              mainTitle="not-attempted"
              number={counts["not-attempted"]}
            />
            <TagComponentS
              title="Answered"
              mainTitle="attempted"
              number={counts["attempted"]}
            />
            <TagComponentS
              title="Reviewed"
              mainTitle="reviewed"
              number={counts["reviewed"]}
            />
            <TagComponentS
              title="Answered and To Review"
              mainTitle="attempted-reviewed"
              number={counts["attempted-reviewed"]}
            />
          </Box>
        ) : null}
        {allSections ? (
          <Box
            w={"100%"}
            style={{
              padding: "10px",
              borderBottom: "1px solid #e2e1e5",
            }}
          >
            <Flex flex={1} justifyContent={"space-between"}>
              <Box>
                <Heading size="sm">All Sections</Heading>
              </Box>

              <Flex marginLeft="auto" flex={1} justifyContent="flex-end">
                <Button
                  fontSize={12}
                  onClick={() => changeAllSection((s) => !s)}
                  variant="link"
                >
                  Category View
                </Button>
              </Flex>
            </Flex>

            <Flex wrap="wrap" justifyContent="center">
              {map(allQuestionData, (que, i) => {
                return <QuestionNumberView key={i} que={que} />;
              })}
            </Flex>
          </Box>
        ) : (
          <Box>
            {map(Object.values(sectionsKeyedData), (sec, id) => {
              return (
                <Box
                  w={"100%"}
                  key={id}
                  style={{
                    padding: "10px",
                    borderBottom: "1px solid #e2e1e5",
                  }}
                >
                  <Flex justify={"spread"} flex={1}>
                    <Box>
                      <Heading size="sm">{sec?.subjectRefId?.name?.en}</Heading>
                    </Box>
                    {id === 0 ? (
                      <Flex
                        marginLeft="auto"
                        flex={1}
                        justifyContent="flex-end"
                      >
                        <Button
                          fontSize={12}
                          onClick={() => changeAllSection((s) => !s)}
                          variant="link"
                        >
                          Normal View
                        </Button>
                      </Flex>
                    ) : null}
                  </Flex>
                  <Flex wrap="wrap" justifyContent="center">
                    {map(sectionsWiseQuestions[sec._id], (que, i) => {
                      return <QuestionNumberView key={i} que={que} />;
                    })}
                  </Flex>
                </Box>
              );
            })}
          </Box>
        )}
      </Box>
      <Box
        boxShadow="sm"
        rounded="md"
        position="sticky"
        bottom={0}
        borderTopWidth="xs"
        padding={"10px"}
        w="100%"
        style={{
          backgroundColor: "#ffffff",
        }}
      >
        <Button
          colorScheme="success"
          bg="brand.green"
          color="white"
          w="100%"
          onClick={() => changeSubmitModal({ modal: true, type: "submit" })}
        >
          Submit
        </Button>
      </Box>
    </Box>
  );
};

const QuestionRefs = React.createRef([]);

const QuestionNumberView = ({ que }) => {
  const {
    changeQuestionAction,
    testAttempt: { pageNumber, questionResponseData },
  } = useExamViewContext();

  const { sidebarClose } = useInnerExamViewContext();

  const questionResponse = useMemo(
    () => questionResponseData[que._id],
    [que._id, questionResponseData]
  );

  return (
    <Square
      color="white"
      size="2rem"
      borderRadius={"md"}
      _hover={{ bg: "gray.300", color: "gray.700" }}
      cursor="pointer"
      bg={QUESTION_COLOR[questionResponse?.action]}
      style={{
        margin: "16px 5px 0px 5px",
      }}
      onClick={() => {
        changeQuestionAction({
          pageNumber: pageNumber,
          typeOfAction: "randomQuestion",
          newSectionId: que.sectionId,
          newQuestionId: que._id,
        });
        QuestionRefs.current?.[que.order]?.scrollIntoView(true);
        sidebarClose();
      }}
      justifyContent="center"
      alignItems="center"
    >
      <Box>
        <Text fontSize="sm"> {que.orderX}</Text>
      </Box>
    </Square>
  );
};

const getMathjax = () => typeof window !== "undefined" && window.MathJax;

export const typeset = (selector) => {
  const mathjax = getMathjax();
  if (!mathjax) {
    return null;
  }
  mathjax.startup.promise = mathjax.startup.promise
    .then(() => {
      selector();
      return mathjax.typesetPromise();
    })
    .catch((e) => {
      console.log("typeset failed", e);
    });
  return mathjax.startup.promise;
};

const QuestionComponent = () => {
  const texRef = useRef(null);
  // const renderFun = () => {
  //   const currentData = texRef.current;
  //   currentData && window.renderMathInElement(currentData);
  // };

  const { testAttempt, changeQuestionAction, isSmallDevice } =
    useExamViewContext();
  const { testLanguage } = useInnerExamViewContext();
  const { pageNumber, currentPageData, questionResponseData } = testAttempt;

  //const openBookmarkModal = (que) => {
  //  toggleBookmarkModal(que);
  //};
  useEffect(() => {
    // renderFun();
    typeset(() => texRef.current);
  }, [pageNumber, testLanguage]);

  const reviewCheck = (question) => {
    if (question) {
      if (
        question.action === "attempted-reviewed" ||
        question.action === "reviewed"
      ) {
        return question?.answer.length ? "attempted" : "not-attempted";
      } else {
        return question?.answer.length ? "attempted-reviewed" : "reviewed";
      }
    } else {
      return "reviewed";
    }
  };

  return (
    <Box ref={texRef} style={{ position: "relative" }} className="questionview">
      <div
        ref={TopQuestionRef}
        style={{ position: "absolute", top: "-50px", height: "10px" }}
      ></div>
      {map(currentPageData, (que, index) => {
        let questionData = que?.questionRefId;
        const questionResponse = questionResponseData[que._id];

        return (
          questionData && (
            <Box
              id={"" + questionData._id}
              boxShadow="sm"
              rounded="md"
              style={{ backgroundColor: "#ffffff" }}
              position="relative"
              margin={[1, 1, 2, 2]}
              key={questionData._id}
            >
              <div
                style={{ position: "absolute", top: "-50px" }}
                ref={(el) => {
                  if (!QuestionRefs.current) {
                    QuestionRefs.current = [];
                  }
                  QuestionRefs.current[que.order] = el;
                }}
              ></div>
              <Flex
                w="100%"
                px={4}
                pt={4}
                alignItems="center"
                justifyContent="space-between"
              >
                <Circle bg={"gray.100"}>
                  <Text m={1} mx={2} fontSize="sm">
                    {que.orderX}
                  </Text>
                </Circle>

                <Tag style={{ float: "right" }} fontSize="xs">
                  {toUpper(questionData.type)}
                </Tag>
              </Flex>

              {/* <HStack justifyContent='flex-end' w='100%'>
							<Box>
								<Tooltip label='bookmark' placement='top'>
									<IconButton variant='ghost' onClick={() => openBookmarkModal(que)} fontSize='25px' icon={<BsBookmark/> }/>
								</Tooltip>
								{bookmarkModal?._id == que._id ? <MoveToBookmarkModal visible={bookmarkModal} type='question' file={bookmarkModal} closeModal={openBookmarkModal} /> : null}
							</Box>
						</HStack>	 */}
              <Box bg="white" maxW="100vw" overflowX="auto">
                {questionData.paragraph ? (
                  testLanguage === "bia" ? (
                    <Code padding={5} display={["box", "box", "flex"]}>
                      <NoSelectBox
                        fontSize="xs"
                        flex={1}
                        dangerouslySetInnerHTML={{
                          __html: questionData.paragraph.body.hn,
                        }}
                      />
                      {isSmallDevice ? <br /> : <Box w={"10px"} />}
                      <NoSelectBox
                        flex={1}
                        dangerouslySetInnerHTML={{
                          __html: questionData.paragraph.body.en,
                        }}
                      />
                    </Code>
                  ) : (
                    <Code padding={5}>
                      <NoSelectBox
                        dangerouslySetInnerHTML={{
                          __html: questionData.paragraph.body[testLanguage],
                        }}
                      />
                    </Code>
                  )
                ) : null}

                <Box style={{ padding: "20px" }}>
                  {testLanguage === "bia" ? (
                    <Box display={["box", "box", "flex"]}>
                      <NoSelectBox
                        flex={1}
                        dangerouslySetInnerHTML={{
                          __html: questionData.question.hn,
                        }}
                      />
                      {isSmallDevice ? <br /> : <Box w={"10px"} />}
                      <NoSelectBox
                        flex={1}
                        dangerouslySetInnerHTML={{
                          __html: questionData.question.en,
                        }}
                      />
                    </Box>
                  ) : (
                    <Box>
                      <NoSelectBox
                        dangerouslySetInnerHTML={{
                          __html: questionData.question[testLanguage],
                        }}
                      />
                    </Box>
                  )}
                </Box>

                {questionData.type === "Integer" ? (
                  <Box
                    style={{
                      padding: "20px",
                      borderBottom: "1px solid #e2e1e5",
                    }}
                  >
                    <Numpad
                      key={questionData._id}
                      id={questionData._id}
                      defaultData={questionResponse?.answer[0]}
                      onChangeData={(data) =>
                        changeQuestionAction({
                          pageNumber: pageNumber,
                          questionId: que._id,
                          typeOfAction: "attempted",
                          answer: data,
                        })
                      }
                    />
                  </Box>
                ) : (
                  <Box>
                    {map(questionData.options, (op, i) => {
                      let optionSelected =
                        findIndex(
                          questionResponse.answer,
                          (ans) => ans === op._id
                        ) !== -1;

                      return (
                        <Box
                          key={i}
                          style={{
                            borderTop: i === 0 ? "1px solid #e2e1e5" : "",
                            borderBottom: "1px solid #e2e1e5",
                            padding: "16px",
                            backgroundColor: optionSelected ? "#f4f3fa" : "",
                            cursor: "pointer",
                          }}
                          onClick={() =>
                            changeQuestionAction({
                              pageNumber: pageNumber,
                              questionId: que._id,
                              typeOfAction:
                                questionResponse.action ===
                                  "attempted-reviewed" ||
                                questionResponse.action === "reviewed"
                                  ? "attempted-reviewed"
                                  : "attempted",
                              answer:
                                questionData.type === "MCQ"
                                  ? uniq(
                                      concat(questionResponse.answer, [op._id])
                                    )
                                  : [op._id],
                            })
                          }
                        >
                          <Flex>
                            <Box
                              style={{
                                paddingLeft: "5px",
                                marginRight: "10px",
                                display: "block",
                              }}
                            >
                              <HStack
                                h="30px"
                                w="30px"
                                borderRadius="full"
                                p={1}
                                justifyContent="center"
                                align="center"
                                bg={optionSelected ? "brand.blue" : ""}
                                style={{
                                  border: optionSelected
                                    ? ""
                                    : "1px solid #e2e1e5",
                                  color: optionSelected ? "white" : "",
                                }}
                              >
                                <Text fontSize="xs">{op?.key?.en}</Text>
                              </HStack>
                            </Box>
                            <Box ml="lg" pl="md" w={"100%"}>
                              {testLanguage == "bia" ? (
                                <Box
                                  w={"100%"}
                                  display={["box", "box", "flex"]}
                                >
                                  <NoSelectBox
                                    flex={1}
                                    dangerouslySetInnerHTML={{
                                      __html: op?.body?.hn,
                                    }}
                                  />
                                  {isSmallDevice ? <br /> : <Box w={"10px"} />}
                                  <NoSelectBox
                                    flex={1}
                                    dangerouslySetInnerHTML={{
                                      __html: op?.body?.en,
                                    }}
                                  />
                                </Box>
                              ) : (
                                <NoSelectBox
                                  dangerouslySetInnerHTML={{
                                    __html: op?.body[testLanguage],
                                  }}
                                />
                              )}
                            </Box>
                          </Flex>
                        </Box>
                      );
                    })}
                  </Box>
                )}
                <Stack spacing={4} p={3} mx={[2, 4, 4]} direction="row">
                  <Button
                    colorScheme="accent"
                    size="xs"
                    variant={
                      questionResponse.action === "reviewed" ||
                      questionResponse.action === "attempted-reviewed"
                        ? "solid"
                        : "outline"
                    }
                    onClick={() =>
                      changeQuestionAction({
                        pageNumber: pageNumber,
                        questionId: que._id,
                        typeOfAction: reviewCheck(questionResponse),
                        answer: questionResponse?.answer,
                      })
                    }
                  >
                    Later Review
                  </Button>

                  {/* <Checkbox
                color="blue.600"
                variant="solid"
                onChange={() =>
                  changeQuestionAction({
                    pageNumber: pageNumber,
                    questionId: que._id,
                    typeOfAction: reviewCheck(questionResponse),
                    answer: questionResponse?.answer,
                  })
                }
                isChecked={
                  questionResponse.action == "reviewed" ||
                  questionResponse.action == "attempted-reviewed"
                }
              >
                Review
              </Checkbox> */}
                  {questionResponse.answer?.length ? (
                    <Button
                      bg="brand.red"
                      color="white"
                      size="xs"
                      variant="solid"
                      onClick={() =>
                        changeQuestionAction({
                          pageNumber: pageNumber,
                          questionId: que._id,
                          typeOfAction: "not-attempted",
                          answer: [],
                        })
                      }
                    >
                      <CloseIcon size="xs" /> &nbsp; Clear
                    </Button>
                  ) : null}
                </Stack>
              </Box>
            </Box>
          )
        );
      })}
    </Box>
  );
};

const Timer = ({ hideLabel }) => {
  const { changeSubmitModal } = useInnerExamViewContext();
  const { counterRef, changeQuestionAction, startRef } = useExamViewContext();
  const counterTime = counterRef.current;
  // console.log({ counterTime, now: Date.now(), diff: Date.now()- counterTime });

  const toast = useToast();
  const _timerComplete = useCallback(() => {
    toast({
      status: "error",
      title: "Test Completed",
      description: "Time for your test is completed",
      duration: 2000,
    });
    changeSubmitModal({
      modal: true,
      type: "timeSubmit",
    });
  }, [changeSubmitModal, toast]);

  useEffect(() => {
    if (counterTime - Date.now() < 1200) {
      _timerComplete();
    }
  }, [_timerComplete, changeQuestionAction, counterTime]);

  return (
    <Box
      bg="white"
      style={{
        padding: "14px",
        paddingLeft: "20px",
        borderBottom: "1px solid #F2F3F4",
      }}
    >
      {hideLabel ? null : <b>TIME LEFT : </b>}
      <Tag>
        <Countdown
          onComplete={_timerComplete}
          key={counterTime}
          daysInHours
          date={counterTime}
        />
      </Tag>
    </Box>
  );
};

const SubmitModalComponent = () => {
  //check if time is over or actionQueue has completed action
  const {
    testAttempt,
    actionQueue,
    isSmallDevice,
    changeQuestionAction,
    loadingSubmit,
    syncError,
  } = useExamViewContext();

  const { submitModal, changeSubmitModal } = useInnerExamViewContext();
  const { modal, type } = submitModal;

  const { sectionsKeyedData, pageNumber, questionResponseData } = testAttempt;

  let completedStatus =
    type === "timeSubmit" ||
    findIndex(actionQueue, (s) => s.progressStatus === "completed") !== -1;

  const _close = () => {
    changeSubmitModal({ modal: false });
  };
  const sectionGrouped = useMemo(
    () => groupBy(questionResponseData, "sectionId"),
    [questionResponseData]
  );
  //const countQuestions = useMemo(() => (countBy(Object.values(questionResponseData), 'action')))
  return (
    <Modal
      motionPreset="slideInBottom"
      isOpen={modal}
      scrollBehavior="inside"
      closeOnEsc={!completedStatus}
      closeOnOverlayClick={!completedStatus}
      onClose={_close}
      size={isSmallDevice ? "xl" : "lg"}
    >
      <ModalOverlay />
      <ModalContent
        borderRadius={0}
        minH={isSmallDevice ? "100vh" : null}
        style={isSmallDevice ? { margin: 0 } : {}}
      >
        <ModalHeader>Submit Test</ModalHeader>
        {!completedStatus ? <ModalCloseButton /> : null}
        <ModalBody>
          <Flex
            flexDir={["column", "row"]}
            wrap="wrap"
            style={{ overflow: "hidden" }}
          >
            {map(sectionsKeyedData, (sec, id) => {
              const currentSecCounts = countBy(
                sectionGrouped[sec._id],
                "action"
              );
              return (
                <Box
                  boxShadow="lg"
                  rounded="md"
                  key={id}
                  margin={[1, 2, 4]}
                  p={[2, 3]}
                  style={{
                    backgroundColor: "#ffffff",
                  }}
                  pt={4}
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
          </Flex>
        </ModalBody>
        <ModalFooter>
          <Button
            bg="brand.blue"
            color="white"
            disabled={completedStatus}
            mr={3}
            onClick={() => (completedStatus ? null : _close())}
          >
            Close
          </Button>
          <Button
            bg="brand.green"
            color="white"
            colorScheme="green"
            isLoading={loadingSubmit}
            onClick={() =>
              changeQuestionAction({
                pageNumber: pageNumber,
                typeOfAction: "submit",
                progressStatus: "completed",
              })
            }
          >
            {syncError ? "Retry Submit" : "Submit Test"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export const TagComponent = ({ title, number, mainTitle }) => {
  return (
    <Tag
      size="md"
      margin={1}
      borderRadius="full"
      style={{ fontSize: "11px", backgroundColor: "#f3f3f3" }}
    >
      <Box
        bg={QUESTION_COLOR[mainTitle]}
        style={{
          height: "25px",
          width: "25px",
          borderRadius: "50%",
          textAlign: "center",
          color: "white",
          paddingTop: "6px",
        }}
      >
        {number || 0}
      </Box>
      &nbsp;&nbsp;<TagLabel>{title}</TagLabel>
    </Tag>
  );
};

export const TagComponentS = ({ title, number, mainTitle }) => {
  const { isSmallDevice } = useExamViewContext();

  return !isSmallDevice ? (
    <TagComponent title={title} mainTitle={mainTitle} number={number} />
  ) : null;
};

export const NoSelectBox = (props) => {
  return (
    <Box
      {...props}
      sx={{
        "-moz-user-select": "none",
        "-webkit-user-select": "none",
        "-ms-user-select": "none",
        "user-select": "none",
        "-o-user-select": "none",
      }}
    />
  );
};
