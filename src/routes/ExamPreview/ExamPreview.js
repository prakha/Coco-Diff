import React, { useEffect, useMemo, useRef, useState } from "react";

import {
  Box,
  Button,
  Circle,
  Code,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Heading,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Square,
  Stack,
  Tag,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useExamPreviewContext } from "./Context";

import { InnerExamPreviewContext } from "./InnerContext";
import { useInnerExamPreviewContext } from "./InnerContext";
import { BsGrid } from "react-icons/bs";
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CloseIcon,
  DeleteIcon,
} from "@chakra-ui/icons";
import { concat, countBy, findIndex, map, toUpper, uniq } from "lodash";
import { QUESTION_COLOR, QUESTION_RESPONSE_COLOR } from "../../Constants";
import { isCursorInRect } from "@nivo/core";
import { NoSelectBox, typeset } from "../ExamView/MainView";
const TopQuestionRef = React.createRef();

export const ExamMainPreView = (props) => {
  const { changeQuestionAction, testAttempt, isSmallDevice, language } =
    useExamPreviewContext();

  const [allSections, changeAllSection] = useState(true);
  const [testLanguage, changeTestLanguage] = useState(language || "en");

  const {
    isOpen: sidebarOpen,
    onClose: sidebarClose,
    onToggle: sidebarToggle,
  } = useDisclosure();

  const contextValue = useMemo(
    () => ({
      sidebarClose,
      sidebarToggle,
      sidebarOpen,
      testLanguage,
      changeTestLanguage,
      allSections,
      changeAllSection,
    }),
    [allSections, sidebarClose, sidebarOpen, sidebarToggle, testLanguage]
  );

  const { pageNumber, pageWiseData } = testAttempt;
  const isLastPage = useMemo(
    () => (pageNumber === pageWiseData.length - 1 ? true : false),
    [pageNumber, pageWiseData]
  );

  return (
    <InnerExamPreviewContext.Provider value={contextValue}>
      <Box flex={1} h="100vh" style={{ backgroundColor: "#f5f7fa" }}>
        <Flex w="100%" h="100vh">
          <Flex
            direction="column"
            w={["100%", "100%", "75%"]}
            h={"100vh"}
            overflow="auto"
          >
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
                  Go Back&nbsp;
                  <ChevronRightIcon />
                </Button>
              ) : (
                <Button
                  colorScheme="white"
                  variant="text"
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
                  Next&nbsp;
                  <ChevronRightIcon />
                </Button>
              )}
            </Box>
          </Flex>
          <RightComponentWrapper />
        </Flex>
      </Box>
    </InnerExamPreviewContext.Provider>
  );
};

const RightComponentWrapper = (props) => {
  const { isSmallDevice } = useExamPreviewContext();
  const { sidebarOpen, sidebarClose } = useInnerExamPreviewContext();
  return isSmallDevice ? (
    <Drawer isOpen={sidebarOpen} placement="bottom" onClose={sidebarClose}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerHeader>
          <Flex alignItems="flex-end">
            <IconButton icon={<CloseIcon />} onClick={sidebarClose} />
          </Flex>
        </DrawerHeader>
        {/* <DrawerHeader>Create your account</DrawerHeader> */}
        <DrawerBody style={{ padding: 0, maxHeight: "100vh" }}>
          <RightComponent height="70vh" />
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  ) : (
    <RightComponent />
  );
};

const HeaderView = (props) => {
  const { isSmallDevice, exitReport, testData } = useExamPreviewContext();
  const { changeTestLanguage, testLanguage } = useInnerExamPreviewContext();

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
        justifyContent="flex-start"
      >
        <Box ml={2}>
          <Circle
            p={2}
            onClick={exitReport}
            _hover={{ backgroundColor: "orange.100" }}
            color="gray.900"
          >
            <ChevronLeftIcon />
          </Circle>
        </Box>
        <Heading m={3} size="sm" color="gray.800">
          {testData.name.en}
        </Heading>
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
              <MenuItem value="bia" onClick={() => changeTestLanguage("bia")}>
                BI
              </MenuItem>
            </MenuList>
          </Menu>
        ) : null}
      </Flex>
    </Flex>
  );
};

const RightComponent = ({ height }) => {
  const { isSmallDevice, exitReport, testAttempt } = useExamPreviewContext();
  const { allSections, changeAllSection } = useInnerExamPreviewContext();
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
      <Box marginBottom="20px" flex={1}>
        {!isSmallDevice ? (
          <Box
            padding={["10px", "20px"]}
            paddingTop={["0px", "0px"]}
            borderBottom="1px solid #F2F3F4"
          >
            {/* <TagComponentS
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
              /> */}
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
        <Button colorScheme="gray" w="100%" onClick={exitReport}>
          Exit
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
  } = useExamPreviewContext();

  const { sidebarClose } = useInnerExamPreviewContext();

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
      bg={QUESTION_RESPONSE_COLOR[questionResponse?.remarks]}
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

const QuestionComponent = () => {
  const texRef = useRef(null);

  const renderFun = () => {
    const currentData = texRef.current;
    currentData && typeset(() => currentData);
    // currentData && window.renderMathInElement(currentData);
  };

  const { testAttempt, isSmallDevice } = useExamPreviewContext();
  const { testLanguage } = useInnerExamPreviewContext();
  const { pageNumber, currentPageData, questionResponseData } = testAttempt;

  //const openBookmarkModal = (que) => {
  //  toggleBookmarkModal(que);
  //};
  useEffect(() => {
    renderFun();
  }, [pageNumber, testLanguage]);

  return (
    <Box flex={1} style={{ position: "relative" }} className="questionview">
      <div
        ref={TopQuestionRef}
        style={{ position: "absolute", top: "-50px", height: "10px" }}
      ></div>
      {map(currentPageData, (que, index) => {
        let questionData = que?.questionRefId;
        const questionResponse = questionResponseData[que._id];
        return (
          <Box
            id={"" + questionData._id}
            boxShadow="sm"
            rounded="md"
            style={{ backgroundColor: "#ffffff" }}
            position="relative"
            margin={[1, 1, 2, 2]}
            ref={texRef}
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
              <Flex alignItems="center">
                <Circle
                  padding={1}
                  px={2}
                  borderRadius={10}
                  bg={"gray.100"}
                  m={1}
                >
                  <Text fontSize="sm">{que.orderX}</Text>
                </Circle>
                <Tag
                  ml={2}
                  style={{ float: "right" }}
                  colorScheme={
                    questionResponse.remarks === "correct"
                      ? "success"
                      : questionResponse.remarks === "incorrect"
                      ? "error"
                      : undefined
                  }
                >
                  {questionResponse.remarks}
                </Tag>
              </Flex>
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
                style={{ padding: "20px", borderBottom: "1px solid #e2e1e5" }}
              >
                {/* <Numpad
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
                  /> */}
              </Box>
            ) : (
              <Box>
                {map(questionData.options, (op, i) => {
                  let optionSelected =
                    findIndex(
                      questionResponse.answer,
                      (ans) => ans === op._id
                    ) !== -1;

                  const isCorrect =
                    findIndex(questionData.answer, (a) => {
                      return a === op._id;
                    }) !== -1;
                  return (
                    <Box
                      position="relative"
                      key={i}
                      sx={{
                        borderTop: i === 0 ? "1px solid #e2e1e5" : "",
                        borderBottom: "1px solid #e2e1e5",
                        padding: "16px",
                        paddingTop:
                          optionSelected || isCorrect ? "32px" : "16px",
                        backgroundColor: optionSelected ? "red.50" : "",
                        cursor: "pointer",
                      }}
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
                            bg={
                              optionSelected
                                ? isCorrect
                                  ? "brand.blue"
                                  : "red.400"
                                : ""
                            }
                            style={{
                              border: optionSelected ? "" : "1px solid #e2e1e5",
                              color: optionSelected ? "white" : "",
                            }}
                          >
                            <Text fontSize="xs">{op?.key?.en}</Text>
                          </HStack>
                        </Box>
                        <Box ml="lg" pl="md" w="100%">
                          {testLanguage == "bia" ? (
                            <Box w={"100%"} display={["box", "box", "flex"]}>
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

                      <Flex position="absolute" top={-0} right={0}>
                        {optionSelected ? (
                          <Tag
                            fontSize="xs"
                            mr={1}
                            colorScheme={isCorrect ? "primary" : "red"}
                          >
                            Your answer &nbsp;&nbsp;
                            {!isCorrect ? <CloseIcon /> : ""}
                          </Tag>
                        ) : null}

                        {isCorrect ? (
                          <Tag fontSize="xs" colorScheme="success">
                            <CheckIcon />
                          </Tag>
                        ) : null}
                      </Flex>
                    </Box>
                  );
                })}
              </Box>
            )}
            {questionData?.solution?.en || questionData?.solution?.hn ? (
              <Box my={2} p={5}>
                <Text color="green.500" mb={2}>
                  Explanation / व्याख्या
                </Text>
                {testLanguage == "bia" ? (
                  <Box w={"100%"} display={["box", "box", "flex"]}>
                    <NoSelectBox
                      flex={1}
                      dangerouslySetInnerHTML={{
                        __html: questionData?.solution?.hn,
                      }}
                    />
                    {isSmallDevice ? <br /> : <Box w={"10px"} />}
                    <NoSelectBox
                      flex={1}
                      dangerouslySetInnerHTML={{
                        __html: questionData?.solution?.en,
                      }}
                    />
                  </Box>
                ) : (
                  <NoSelectBox
                    dangerouslySetInnerHTML={{
                      __html: questionData?.solution?.[testLanguage],
                    }}
                  />
                )}
              </Box>
            ) : null}
          </Box>
        );
      })}
    </Box>
  );
};
