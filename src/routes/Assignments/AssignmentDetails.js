import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  HStack,
  IconButton,
  Input,
  List,
  ListItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Tag,
  Text,
  Tooltip,
  UnorderedList,
  VStack,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import { Container } from "@nivo/core";
import React, { useEffect, useMemo, useState } from "react";
import { DeleteIcon } from "@chakra-ui/icons";
import _ from "lodash";
import { useDispatch, useSelector } from "react-redux";
import { resetUploadSheet, uploadSheetAction } from "../../redux/reducers/test";
import { STATUS } from "../../App/Constants";
import { isImage, isPDF } from "../../utils/Helper";
import { AiFillFile, AiOutlineFile } from "react-icons/ai";

export const AssignmentDetails = ({
  visible,
  closeModal,
  assignment,
  footer,
  isSubmitted,
  currentPackage,
}) => {
  const dispatch = useDispatch();

  const assignmentItem = assignment.assignmentId;
  const [filesData, setFiles] = useState();

  const { uploadSheetStatus } = useSelector((state) => ({
    uploadSheetStatus: state.test.uploadSheetStatus,
  }));

  const answersheet =
    assignmentItem?.answerSheet && Array.isArray(assignmentItem.answerSheet)
      ? assignmentItem.answerSheet[0]?.file
      : assignmentItem?.answerSheet?.file;

  useEffect(() => {
    return () => dispatch(resetUploadSheet());
  }, [dispatch]);

  useEffect(() => {
    if (uploadSheetStatus === STATUS.SUCCESS) closeModal();
  }, [closeModal, uploadSheetStatus]);

  const _downloadPaper = () => {
    window.open(assignmentItem.questionPaper);
  };

  const _downloadPaperModalSheet = () => {
    window.open(assignmentItem.modalAnswerSheet);
  };

  const submitFiles = () => {
    const formData = new FormData();
    formData.append("assignmentId", assignmentItem._id);

    _.forEach(filesData?.files, (f, i) => {
      formData.append(`uploads`, f);
    });

    dispatch(uploadSheetAction(formData));
  };

  const getFiles = (data) => {
    setFiles(data);
  };

  const [insVisible, setInsVisible] = useState(false)
  const closeIns = () => {
      setInsVisible(false)
  }
  const openIns = () => {
      setInsVisible(true)
  }

  // console.log('assignment', assignment, answersheet)
  return (
    <Drawer isOpen={visible} onClose={closeModal} size={"xl"}>
        <DrawerOverlay/>
      <DrawerContent>
        <DrawerHeader>
          <HStack>
            <Text>{assignmentItem.title}</Text>
            {footer || isSubmitted ? (
              <Tag colorScheme={footer.infoColor.split(".", 1)[0]}>
                {footer.info}
              </Tag>
            ) : null}
          </HStack>
        </DrawerHeader>
        <DrawerCloseButton />
        <DrawerBody>
          <Box>
            <VStack w="100%" align="stretch" spacing={4}>
              {assignmentItem.instructions ? (
                <HStack>
                  <Button onClick={openIns}>Instructions</Button>
                </HStack>
              ) : null}

            
              {assignmentItem.description && (
                <Container border="1px solid E2E8F0" p={2} background="#F7F9F9">
                  Description: {assignmentItem.description}
                </Container>
              )}
              <HStack spacing={6}>
                {assignment.maximumMarks ? (
                  <HStack>
                    <Text>Maximum Marks :</Text>
                    <Text fontWeight="bold">{assignment.maximumMarks}</Text>
                  </HStack>
                ) : null}
                {assignmentItem?.resultPublished && assignment.assignmentId?.submissions?.length ? (
                  <HStack>
                    <Text>Your Marks:</Text>
                    {assignment.assignmentId.submissions[0].result ? (
                      <Tag>
                        <Text
                          fontWeight="bold"
                          color="brand.blue"
                          fontSize={20}
                        >
                          {assignment.assignmentId.submissions[0].result}
                        </Text>
                      </Tag>
                    ) : (
                      <Text color="brand.secondary">not assigned</Text>
                    )}
                  </HStack>
                ) : null}
              </HStack>

              { assignmentItem.modalAnswerSheet ? (
                <HStack>
                    <Text fontWeight="bold">Modal Answer Sheet: </Text>
                    <Tag
                      variant="solid"
                      colorScheme="teal"
                      cursor="pointer"
                      onClick={_downloadPaperModalSheet}
                    >
                      Download Modal Answer Sheet
                    </Tag>

                    {/* <Button size='sm' color="blue.500" variant="outline" onClick={_downloadPaper} variant="outline">Download</Button> */}
                  </HStack>
                ) : null}
             
              <br />
              {footer || isSubmitted ? (
                <VStack spacing={4} align="stretch" w="100%">
                  {/* <Text color={footer.infoColor}>{footer.info}</Text> */}
                  {isSubmitted ? <Submission submission={isSubmitted} /> : null}
                </VStack>
              ) : (
                <VStack alignItems="start" spacing={4}>
                  <HStack>
                    <Text fontWeight="bold">Question Paper: </Text>
                    <Tag
                      variant="solid"
                      colorScheme="teal"
                      cursor="pointer"
                      onClick={_downloadPaper}
                    >
                      Download Question Paper
                    </Tag>

                    {/* <Button size='sm' color="blue.500" variant="outline" onClick={_downloadPaper} variant="outline">Download</Button> */}
                  </HStack>
                  <HStack>
                    <Text fontWeight="bold">Answer Keys: </Text>
                    <Tag
                      variant="solid"
                      colorScheme="teal"
                      cursor="pointer"
                      onClick={() =>
                        window.open(
                          answersheet || assignmentItem.localAnswerSheet
                        )
                      }
                    >
                      Download Answer Sheet
                    </Tag>

                    {/* {assignmentItem.answerSheet?.length ?
                                    <Wrap>
                                        {assignmentItem.answerSheet.map(a => 
                                            <WrapItem>
                                                <Tag variant="solid" colorScheme="teal" cursor='pointer' key={a._id} onClick={() => window.open(a.file)}>{a.title}</Tag>
                                            </WrapItem>
                                        )}    
                                    </Wrap>
                                    :
                                    null
                                } */}
                  </HStack>
                </VStack>
              )}
              <br />
              {footer || isSubmitted ? null : (
                <UploadAnswerSheet getFiles={getFiles} />
              )}
            </VStack>
            <AssignmentInstructions visible={insVisible} closeModal={closeIns} instructions={assignmentItem.instructions} />
          </Box>
        </DrawerBody>

        <DrawerFooter>
          {filesData?.files && filesData.files.length ? (
            <Button
              isLoading={uploadSheetStatus == STATUS.FETCHING}
              loadingText="Submitting..."
              disabled={
                filesData?.totalSize >= 10000 || filesData?.countFiles > 10
              }
              onClick={submitFiles}
              colorScheme="blue"
              variant="outline"
            >
              Submit
            </Button>
          ) : null}
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

const AssignmentInstructions = ({visible, closeModal, instructions}) => {
    return (
        <Modal isOpen={visible} onClose={closeModal} size="3xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <HStack>
              <Text>Assignment Instructions</Text>
              
            </HStack>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
          <Box>
                  <Text
                    fontSize="sm"
                    dangerouslySetInnerHTML={{
                      __html: instructions?.description?.en,
                    }}
                  />
                   <Text
                    fontSize="sm"
                    dangerouslySetInnerHTML={{
                      __html: instructions?.description?.hn,
                    }}
                  />
                </Box>
          </ModalBody>
  
         
        </ModalContent>
      </Modal>
    )
}

export const Submission = ({ submission }) => {
  const files = submission.answerSheet.map((a) => {
    return {
      typefile: isImage(a) ? "image" : isPDF(a) ? "pdf" : "other",
      uri: a,
    };
  });

  const handleOpenFile = (file) => {
    window.open(file, "_blank");
  };

  const handleOpenMyFile = (file) => {
    window.open(file, "_blank");
  };

  return (
    <VStack spacing={6} align="stretch" w="100%">
      {files.length ? (
        <VStack align="stretch">
          <Text fontWeight="bold" fontSize="16px">
            Your Submissions
          </Text>
          <HStack wrap="wrap">
            {files.map((f, i) => (
              <Tooltip title="view">
                <Button
                  onClick={() => handleOpenMyFile(f.uri)}
                  fontWeight={500}
                  variant="outline"
                  leftIcon={<AiOutlineFile />}
                  key={f.uri}
                >
                  {f.uri.substring(f.uri.length - 10, f.uri.length)}
                </Button>
              </Tooltip>
            ))}
          </HStack>
        </VStack>
      ) : null}

      {submission.answerSheetChecked?.length ? (
        <VStack align="stretch">
          <Text fontWeight="bold" fontSize="16px">
            Checked Files
          </Text>

          <HStack wrap="wrap">
            {submission.answerSheetChecked.map((d) => (
              <Tooltip title="view">
                <Button
                  onClick={() => handleOpenFile(d)}
                  fontWeight={500}
                  variant="outline"
                  leftIcon={<AiOutlineFile />}
                  key={d}
                >
                  {d.substring(d.length - 10, d.length)}
                </Button>
              </Tooltip>
            ))}
          </HStack>
        </VStack>
      ) : null}
    </VStack>
  );
};

export const UploadAnswerSheet = ({ getFiles }) => {
  const [files, setFiles] = useState();

  const { totalSize, countFiles } = useMemo(() => {
    const s =
      files?.length &&
      _.chain(files)
        .map((d) => d.size / 1000)
        .sum()
        .round(2)
        .value();
    const c = files?.length;
    return { totalSize: s, countFiles: c };
  }, [files]);

  useEffect(() => {
    getFiles({ files, totalSize, countFiles });
  }, [files]);

  const _setFiles = (e) => {
    setFiles([...e.target.files]);
  };

  const removeFile = (indx) => {
    setFiles((data) => _.filter(data, (d, i) => i != indx));
  };

  return (
    <Box>
      <Text fontWeight="bold">Upload Your Answers</Text>
      <Container>
        Please note that you can select a max of 10 files and total size not
        exceeding 10MB
      </Container>
      <br />
      <Input
        type="file"
        multiple
        onChange={_setFiles}
        accept=".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,.pdf"
      />
      <br />
      <br />
      {files && files.length ? (
        <Box>
          <Box fontSize="14px" p={2} background="#F4F6F6" borderRadius={7}>
            <HStack spacing={6}>
              <Box>
                Size: <b>{totalSize} KB</b>
              </Box>
              <Box>
                Count Files: <b>{countFiles}</b>
              </Box>
            </HStack>
            <List align="start" mt={5}>
              {files.map((f, key) => (
                <ListItem
                  px={2}
                  fontSize="13px"
                  _hover={{ background: "white" }}
                  border="1px solid #E5E8E8"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                  key={key}
                >
                  <Text>{f?.name}</Text>
                  <Tooltip label="remove" placement="left">
                    <IconButton
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(key)}
                      icon={<DeleteIcon />}
                    />
                  </Tooltip>
                </ListItem>
              ))}
            </List>
          </Box>
          {totalSize > 10500 || countFiles > 10 ? (
            <Text color="red.500">
              Count or file sizes exceeding the threshold limit, Please delete
              some or use compression.
            </Text>
          ) : (
            <Text color="yellow.500">
              Please note that after submitting your assignment you will not be
              able to make changes to it. To confirm please click here and
              submit.
            </Text>
          )}
        </Box>
      ) : null}
    </Box>
  );
};
