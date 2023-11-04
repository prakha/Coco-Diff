import {
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
} from "@chakra-ui/accordion";
import {
  Button,
  ButtonGroup,
  IconButton,
  Image,
  Tooltip,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { Input, InputGroup, InputLeftElement } from "@chakra-ui/input";
import {
  Box,
  HStack,
  List,
  ListItem,
  Text,
  VStack,
  Wrap,
  WrapItem,
} from "@chakra-ui/layout";
import _ from "lodash";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  AiFillFileText,
  AiFillVideoCamera,
  AiOutlineArrowLeft,
  AiOutlineFileImage,
} from "react-icons/ai";
import { BiFilterAlt, BiNotepad } from "react-icons/bi";
import { FaFilter } from "react-icons/fa";
import { FiMinus, FiPlus } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation, useParams } from "react-router";
import { InputBox } from "../../Components/InputBox";
import { bilingualText, typeset } from "../../utils/Helper";
import { BsBookmark, BsBookmarkFill, BsFillBookmarkFill } from "react-icons/bs";
import { MoveToBookmarkModal } from "./MoveToBookmarkModal";
import { useTracking } from "../../Components/VideoPlayer";
import { CONTENT_TYPE } from "../../Constants";
import { useTracker } from "../Courses/useTracker";
import { getSubjContentAction } from "../../redux/reducers/courses";
import { ErrorChecker } from "../../Components/ErrorChecker";
import { param } from "jquery";
import { checkLibContent } from "./AudioFiles";
import { removeFromBkmrkAction } from "../../redux/reducers/bookmarks";
import { NotesModal } from "../../Components/NotesModal";

export const TextFiles = ({ course, subjectContent }) => {
  const params = useParams();
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();

  const checkSubjectContent = (id) => {
    if (subjectContent?.data?.length) {
      return _.findIndex(subjectContent.data, (s) => s.contentId === id) != -1;
    }
  };

  const selectSubject = (sub) => {
    history.push(location.pathname + "/" + sub.content._id);

    if (!checkSubjectContent(params.subjectId))
      dispatch(getSubjContentAction({ id: sub.content._id }));
  };

  return (
    <Box>
      <br />
      {params.subjectId ? (
        <SingleSubject
          course={course}
          subjectContent={subjectContent}
          currentSubject={
            course?.subjects?.length
              ? _.find(
                  course.subjects,
                  (s) => s.content._id == params.subjectId
                )
              : null
          }
        />
      ) : (
        <SubjectsList selectSubject={selectSubject} currentCourse={course} />
      )}
    </Box>
  );
};

const SubjectsList = ({ currentCourse, selectSubject }) => {
  const params = useParams();
  const [subjectsList, setSubjects] = useState(currentCourse?.subjects || []);

  const filterFiles = (e) => {
    if (currentCourse?.subjects?.length) {
      let data = _.filter(currentCourse.subjects, (d) =>
        _.includes(_.lowerCase(d.displayName), _.lowerCase(e.target.value))
      );
      setSubjects(data);
    }
  };

  return (
    <Box>
      <HStack
        p={4}
        justifyContent="space-between"
        borderRadius="5px"
        bg="lightGrayBlue"
      >
        <HStack>
          <Box p={2} bg={"#DB4437"} color={"white"} borderRadius="50%">
            <AiFillFileText fontSize="1.40vw" />
          </Box>
          <Box>
            <Text fontSize="lg" fontWeight="bold">
              List of Online Book
            </Text>
          </Box>
        </HStack>
        <HStack>
          {/* <Box>
                        <InputBox icon={<FaFilter />} placeholder='filter' />
                        
                    </Box> */}
          <Box>
            <InputBox
              onChange={filterFiles}
              icon={<SearchIcon />}
              placeholder="Search"
            />
          </Box>
        </HStack>
      </HStack>
      <br />
      <Box>
        <Wrap spacing={10} alignItems="stretch">
          {subjectsList.length
            ? subjectsList.map((sub) => {
                return (
                  <WrapItem key={sub._id} alignItems="stretch">
                    <VStack
                      cursor="pointer"
                      bg="white"
                      onClick={() => selectSubject(sub)}
                      boxShadow="rgba(17, 17, 26, 0.05) 0px 1px 0px, rgba(17, 17, 26, 0.1) 0px 0px 8px"
                      alignItems="stretch"
                      borderRadius="5px"
                      align="stretch"
                      w="220px"
                      justifyContent="space-between"
                    >
                      <Box textAlign="center" h="100%" borderRadius="5px">
                        <VStack
                          justifyContent="center"
                          pos="relative"
                          height="200px"
                          w="auto"
                          overflow="hidden"
                          bg="#F4F6F7"
                        >
                          {sub.image ? (
                            <Image top={0} src={sub.image} />
                          ) : (
                            <AiOutlineFileImage fontSize="25pt" />
                          )}
                        </VStack>
                      </Box>
                      <Box px={3} py={2} fontSize="lg">
                        {sub.displayName}
                      </Box>
                    </VStack>
                  </WrapItem>
                );
              })
            : null}
        </Wrap>
      </Box>
    </Box>
  );
};

const SingleSubject = ({ currentSubject, course, subjectContent }) => {
  const history = useHistory();
  const params = useParams();
  const dispatch = useDispatch();

  const [selectedContent, setContent] = useState();
  const [selectedChp, setChapter] = useState();
  const [hoverCont, setHoverCont] = useState();
  const [chapterList, setChapterList] = useState(
    currentSubject.template?.chapters || []
  );
  const [textList, setTexts] = useState([]);

  const checkSubjectContent = (id) => {
    if (subjectContent?.data?.length) {
      return _.findIndex(subjectContent.data, (s) => s.contentId === id) != -1;
    }
  };

  useEffect(() => {
    if (!checkSubjectContent(params.subjectId))
      dispatch(getSubjContentAction({ id: params.subjectId }));
  }, [params.subjectId]);

  // useEffect(() => {
  //     if(selectedContent)
  //         window.renderMathInElement()
  // }, [selectedContent])

  useEffect(() => {
    // renderFun();
    if (selectedContent) {
      typeset(() =>
        document.getElementById("math-tex", {
          delimiters: [{ left: "$", right: "$", display: true }],
        })
      );
    }
  }, [selectedContent]);

  useEffect(() => {
    let sbj =
      subjectContent?.data.length && params.subjectId
        ? _.find(subjectContent.data, (s) => s.contentId === params.subjectId)
        : null;
    if (sbj) setTexts(sbj.texts);
  }, [params.subjectId, subjectContent]);

  const selectContent = (cont) => {
    setContent(cont);
  };

  const selectChapter = (ch) => {
    setChapter(ch);
  };

  const hoverContent = (ch) => {
    setHoverCont(ch._id);
  };

  const hoverContentOff = () => {
    setHoverCont(null);
  };

  const searchChapter = (e) => {
    let chapters = currentSubject.template?.chapters || [];
    let data = _.filter(chapters, (d) =>
      _.includes(_.toLower(d.chapterId.name.en), _.toLower(e.target.value))
    );
    setChapterList(data);
  };

  return (
    <ErrorChecker status={subjectContent.status}>
      <Box>
        <Box bg="white" p={2} boxShadow="sm">
          <Tooltip label="back" placement="top">
            <Button
              size="lg"
              variant="ghost"
              onClick={() => history.goBack()}
              colorScheme="blue"
              iconSpacing={3}
              fontSize="heading"
              leftIcon={<AiOutlineArrowLeft />}
            >
              {currentSubject.displayName}
            </Button>
          </Tooltip>
        </Box>
        <br />
        <HStack align="stretch" w="100%">
          <VStack
            align="stretch"
            w="30%"
            bg="white"
            p={2}
            boxShadow="rgba(149, 157, 165, 0.2) 0px 8px 24px"
          >
            <Text fontSize="heading" fontWeight="bold">
              List of Chapters
            </Text>

            <InputBox
              onChange={searchChapter}
              icon={<SearchIcon />}
              placeholder="Search"
            />

            <Accordion p={1}>
              {_.orderBy(chapterList, ["order"], ["asc"]).map((chp, i) => {
                let active = selectedChp && selectedChp._id == chp._id;
                let chapterTexts = _.filter(
                  textList,
                  (t) => t.chapterId == chp.chapterId._id
                );

                return (
                  <AccordionItem
                    onClick={() => selectChapter(chp)}
                    border={0}
                    cursor="pointer"
                    p={2}
                    key={chp._id}
                  >
                    <h2>
                      <AccordionButton bg="rgba(238, 243, 248, 1)">
                        <HStack justifyContent="space-between" width="100%">
                          <HStack>
                            <HStack
                              borderRadius="50%"
                              fontWeight="bold"
                              h="1.75vw"
                              w="1.75vw"
                              color="rgba(66, 133, 244, 1)"
                              border="1pt dashed rgba(66, 133, 244, 1)"
                              bg="white"
                              align="center"
                              justifyContent="center"
                            >
                              <Text fontSize="sm">{++i}</Text>
                            </HStack>
                            <Text fontSize="md" fontWeight="bold">
                              {bilingualText(chp.chapterId.name)}
                            </Text>
                          </HStack>
                          {active ? (
                            <Button borderRadius={0} size="sm" p={1} bg="white">
                              <FiMinus />
                            </Button>
                          ) : (
                            <Button borderRadius={0} size="sm" p={1} bg="white">
                              <FiPlus />
                            </Button>
                          )}
                        </HStack>
                      </AccordionButton>
                      <AccordionPanel bg="rgba(247, 249, 250, 0.75)">
                        <List pl={2} spacing={2}>
                          {textList?.length && chapterTexts.length ? (
                            _.orderBy(chapterTexts, "order", "asc").map(
                              (cont, indx) => (
                                <ListItem
                                  key={indx}
                                  onClick={() =>
                                    selectContent({ ...cont, indx })
                                  }
                                  p={2}
                                  _hover={{
                                    background: "rgba(238, 243, 248, 1)",
                                  }}
                                  className={
                                    selectedContent?._id == cont._id
                                      ? "active-chapter"
                                      : null
                                  }
                                >
                                  <HStack>
                                    <Box
                                      borderRadius="50%"
                                      fontWeight="bold"
                                      fontSize="sm"
                                      px="6px"
                                      py="1px"
                                      color="grey"
                                      border="1pt dashed grey"
                                      bg="white"
                                    >
                                      {String.fromCharCode(65 + indx)}
                                    </Box>
                                    <Text fontSize="md">{cont.name}</Text>
                                  </HStack>
                                </ListItem>
                              )
                            )
                          ) : (
                            <Text fontSize="md" py={2}>
                              Empty
                            </Text>
                          )}
                        </List>
                      </AccordionPanel>
                    </h2>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </VStack>

          {selectedContent ? (
            <Box paddingLeft="20px" w="80%">
              <TextCard
                content={selectedContent}
                suggestions={_.filter(
                  textList,
                  (t) => t.chapterId == selectedContent.chapterId
                )}
                subject={currentSubject}
              />
            </Box>
          ) : null}
        </HStack>
      </Box>
    </ErrorChecker>
  );
};

export const TextCard = ({ content, subject, suggestions }) => {
  const params = useParams();
  const dispatch = useDispatch();

  const { bkmrkFiles } = useSelector((state) => ({
    bkmrkFiles: state.bookmark.bkmrkFiles,
  }));

  const [moveFileModal, toggleMoveFileModal] = useState();
  const [inBkmrk, setInBkmrk] = useState();

  const { trackerTrack } = useTracker({
    contentType: CONTENT_TYPE.TEXT,
    courseId: params.courseId,
    dataId: content._id,
    contentId: subject.content._id,
    latency: 1,
  });

  useEffect(() => {
    if (bkmrkFiles && content) {
      let id = content.data ? content.data._id : content.fileDataId?._id;
      setInBkmrk(checkLibContent(id, bkmrkFiles));
    }
  }, [bkmrkFiles, content]);

  useEffect(() => {
    trackerTrack(1, 1);
  }, [content?._id]);

  const addToBookmark = () => {
    toggleMoveFileModal(moveFileModal ? null : { ...content, subject });
  };

  const removeFromBkmrk = () => {
    dispatch(removeFromBkmrkAction({ fileId: inBkmrk || content._id }));
  };

  const [notesModal, openNotesModal] = useState();

  const handleNotesModal = () => {
    openNotesModal(!notesModal);
  };

  return (
    <>
      <HStack justifyContent="space-between">
        <HStack>
          <Box>
            <HStack
              borderRadius="50%"
              fontWeight="bold"
              h="2vw"
              w="2vw"
              color="grey"
              border="1pt dashed grey"
              bg="white"
              justifyContent="center"
              align="center"
            >
              <Text fontSize="heading">
                {String.fromCharCode(65 + content.indx)}
              </Text>
            </HStack>
          </Box>
          <Text fontSize="heading" fontWeight="bold">
            {content.name}
          </Text>
        </HStack>

        <ButtonGroup>
          <Tooltip label={"notes"} placement="top">
            <IconButton
              variant="ghost"
              onClick={handleNotesModal}
              fontSize="25px"
              icon={<BiNotepad />}
            />
          </Tooltip>
          <Tooltip
            label={inBkmrk ? "Remove from bookmark" : "bookmark"}
            placement="top"
          >
            <IconButton
              variant="ghost"
              onClick={() => (inBkmrk ? removeFromBkmrk() : addToBookmark())}
              fontSize="25px"
              icon={inBkmrk ? <BsBookmarkFill /> : <BsBookmark />}
            />
          </Tooltip>
        </ButtonGroup>
      </HStack>
      <br />
      <Box px={6} py={2} bg="rgba(239, 243, 246, 0.66)">
        <Box
          fontSize="md"
          id="math-tex"
          dangerouslySetInnerHTML={{ __html: content.data.value }}
        />
      </Box>

      {notesModal ? (
        <NotesModal
          dataList={suggestions}
          currentData={content}
          visible={notesModal}
          closeModal={handleNotesModal}
        />
      ) : null}
      {moveFileModal ? (
        <MoveToBookmarkModal
          course={params.courseId}
          type={"texts"}
          visible={moveFileModal}
          file={moveFileModal}
          closeModal={addToBookmark}
        />
      ) : null}
    </>
  );
};
