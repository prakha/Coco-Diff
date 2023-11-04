import {
  Box,
  Flex,
  HStack,
  List,
  Text,
} from "@chakra-ui/layout";
import { Collapse } from "@chakra-ui/transition";
import React, { useEffect, useState } from "react";
import { AiOutlineDown, AiOutlineUp } from "react-icons/ai";
import { useParams } from "react-router";
import { bilingualText } from "../../utils/Helper";
import { BsArrowsFullscreen } from "react-icons/bs";
import { Tooltip } from "@chakra-ui/tooltip";
import { MoveFolderModal } from "./MoveFolderModal";
import { InputBox } from "../../Components/InputBox";
import { SearchIcon } from "@chakra-ui/icons";
import { ContentPopover } from "../../Components/ContentPopover";
import { CONTENT_TYPE } from "../../Constants";
import { useTracker } from "../Courses/useTracker";
import { PdfViewer } from "../../Components/PDFViewer/PdfViewer";

import { useFullScreenHandle } from "react-full-screen";
import { IconButton } from "@chakra-ui/react";
import { checkLibContent, SubjectsList } from "./AudioFiles";
import { ErrorChecker } from "../../Components/ErrorChecker";
import { useDispatch, useSelector } from "react-redux";
import { resetPdfId } from "../../redux/reducers/UI";
import { useIsAuthenticated } from "../../App/Context";
import { useLoginModal } from "../../App/useLoginModal";
import { BiNotepad } from "react-icons/bi";
import { NotesModal } from "../../Components/NotesModal";
import { orderBy, sortBy } from "lodash";

export const PdfFiles = ({ course, defaultData, subjectContent }) => {
  const params = useParams()

  const [selectedSubj, setSelectedSubj] = useState();
  const [documentsList, setDocuments] = useState([]);

  useEffect(() => {
    if (params.subjectId && course) {
      setSelectedSubj(
        _.find(course.subjects, (s) => s.content._id == params.subjectId)
      );
    }
  }, [params, course]);

  useEffect(() => {
    let sbj = subjectContent?.data.length && params.subjectId ? _.find(subjectContent.data, s => s.contentId === params.subjectId) : null

    if (sbj)
      setDocuments(sbj.documents)
  }, [params.subjectId, subjectContent])

  // useEffect(() => {
  //   if (selectedSubj) setDocuments(selectedSubj.content.documents);
  // }, [selectedSubj]);

  // const selectSubject = (sub) => {
  //   history.push(
  //     "/dashboard/courses/" + params.courseId + "/documents/" + sub._id
  //   );
  //   setSelectedSubj(sub);
  // };

  const filterdocument = (e) => {
    if (selectedSubj) {
      let data = _.filter(selectedSubj.content.documents, (d) =>
        _.includes(_.toLower(d.name), _.toLower(e.target.value))
      );
      setDocuments(data);
    }
  };

  return (
    <Box>
      <br />
      <HStack align="start" w="100%">

        <SubjectsList course={course} type='documents' />

        <ErrorChecker status={subjectContent.status}>
          {selectedSubj ? (
            <Box w="74%" background="white" p={4}>
              <HStack justifyContent='space-between' mb={4}>
                <Text fontSize='heading' fontWeight=''>{selectedSubj.displayName}</Text>
                <HStack>
                  <Box>
                    <InputBox
                      onChange={filterdocument}
                      icon={<SearchIcon />}
                      placeholder="Search"
                    />
                  </Box>
                </HStack>
              </HStack>
              {selectedSubj.template?.chapters?.length ? (
                orderBy(selectedSubj.template.chapters, ['order'], ['asc']).map((ch) => {
                  let chanpterDocs = _.filter(documentsList, (v) => v.chapterId == ch.chapterId._id)
                  return (
                    <Box key={ch._id}>
                      <Box key={ch._id}>
                        <HStack justify='space-between' p={2} boxShadow='0px 1px 2px #00000040' bg='white'>
                          <Text fontSize='md'>{bilingualText(ch.chapterId.name)}</Text>
                        </HStack>
                      </Box>
                      <br />
                      <List spacing={4} px={4}>
                        {documentsList?.length &&
                          chanpterDocs.length ? (
                          orderBy(chanpterDocs, 'order', 'asc').map((doc) => {
                            return (
                              <PdfCard
                                suggestions={chanpterDocs}
                                course={course}
                                doc={doc}
                                subject={selectedSubj}
                              />
                            )
                          })
                        ) : (
                          <Text color='gray.400'>Empty</Text>
                        )}
                      </List>
                      {/* <Divider marginY='30px'/> */}
                      <br />
                      <br />
                    </Box>
                  )
                })
              ) : (
                <Text>No data added</Text>
              )}
            </Box>
          ) : null}
        </ErrorChecker>
      </HStack>
    </Box>
  );
};

export const PdfCard = ({
  doc,
  subject,
  library,
  bookmark,
  demo,
  suggestions,
  course,
}) => {
  const params = useParams();
  const dispatch = useDispatch()
  let docData = doc?.data ? doc.data : doc.fileDataId;

  const [moveFileModal, toggleMoveFileModal] = useState();
  const fullScreenHandle = useFullScreenHandle();
  const [inLibrary, setInLibrary] = useState()
  const [inBkmrk, setInBkmrk] = useState()
  const [trackingData, setTrackingData] = useState()

  const { libFiles, bkmrkFiles, selectedPdf } = useSelector(state => ({
    libFiles: state.library.libFiles,
    bkmrkFiles: state.bookmark.bkmrkFiles,
    selectedPdf: state.UI.pdfId
  }))

  useEffect(() => {
    let data = {
      contentType: CONTENT_TYPE.DOCUMENT,
      courseId: params.courseId || doc.courseId,
      dataId: doc?._id,
      contentId: subject?.content?._id,
      latency: 1,
    }
    setTrackingData(data)
  }, [subject])

  useEffect(() => {
    if (libFiles) {
      let id = docData?._id || docData
      setInLibrary(checkLibContent(id, libFiles))
    }

    if (bkmrkFiles) {
      let id = doc.data ? doc.data._id : doc.fileDataId?._id
      setInBkmrk(checkLibContent(id, bkmrkFiles))
    }
  }, [libFiles, bkmrkFiles])

  const addToLibrary = (e) => {
    e?.stopPropagation();
    toggleMoveFileModal(moveFileModal ? null : { ...doc, subject });
  };

  // useEffect(() => {
  //   if (selectedPdf === doc._id) {
  //     trackerTrack(1, 1, false);
  //   }
  // }, [doc._id, selectedPdf]);

  const pageChange = (current, pages) => {
    // setPageDetails({ current, pages })
  }

  const { toggleLoginModal } = useLoginModal();
  const isAuthenticated = useIsAuthenticated();

  const openPfd = () => {
    if (isAuthenticated)
      dispatch(resetPdfId(doc._id))
    else
      toggleLoginModal()
  }

  const [notesModal, openNotesModal] = useState()

  const handleNotesModal = () => {
    openNotesModal(!notesModal)
  }

  return (
    <Box border="1px solid #E5E8E8">
      <HStack
        px={2}
        py={1}
        bg="#F0F3F4"
        // cursor="pointer"
        justifyContent="space-between"
      >
        <Text
          onClick={openPfd}
          fontSize="18px"
          fontWeight="bold"
        >
          {doc.name}
        </Text>
        <Flex align='center'>
          <Box px={2}>
            {selectedPdf == doc._id ? (
              <Tooltip label="fullscreen" placement="top">
                <IconButton onClick={fullScreenHandle.enter} icon={<BsArrowsFullscreen fontSize="heading" />}/>
              </Tooltip>
            ) : null}
          </Box>
          {!demo && 
            <Tooltip label='notes' placement="top">
              <IconButton onClick={handleNotesModal}
                icon={
                  <BiNotepad fontSize='heading' />
                }
              />
            </Tooltip>
          }
          <Box px={2}>
            {!demo ?
              <ContentPopover libraryId={inLibrary} bookmarkId={inBkmrk}
                course={params.courseId}
                library={library}
                bookmark={bookmark}
                type="documents"
                subject={subject?.content?._id}
                data={doc}
              /> : null
            }
          </Box>

          <Box px={2}>
            <Tooltip label={selectedPdf === doc._id ? "close" : 'open'} placement="top">
              <IconButton
                onClick={openPfd}
                icon={
                  selectedPdf === doc._id ? (
                    <AiOutlineUp fontSize="heading" />
                  ) : (
                    <AiOutlineDown fontSize="heading" />
                  )
                }
              />
            </Tooltip>
          </Box>
        </Flex>
      </HStack>

      <Collapse in={selectedPdf === doc._id} animateOpacity>
        {selectedPdf === doc._id ? (
          <PdfViewer handlePageChange={pageChange}
            handle={fullScreenHandle} 
            trackingData={trackingData}
            // initialPage={}
            url={docData?.url + "?origin=" + "http://localhost:3000"}
          />
        ) : null}
      </Collapse>
      {notesModal ? <NotesModal dataList={suggestions} currentData={doc} visible={notesModal} closeModal={handleNotesModal} /> : null}

      {moveFileModal ? (
        <MoveFolderModal
          type="documents"
          visible={moveFileModal}
          file={moveFileModal}
          closeModal={addToLibrary}
        />
      ) : null}
    </Box>
  );
};
