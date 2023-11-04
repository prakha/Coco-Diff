import {
  Box,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Tag,
  Flex,
  ModalOverlay,
  Text,
  Textarea,
  Spacer,
  Image,
  Divider,
  Tooltip,
  Link,
} from "@chakra-ui/react";
import React, { useState, useEffect, useMemo } from "react";
import {
  AiFillClockCircle,
  AiOutlineUpload,
  AiOutlineDownload,
  AiOutlineCheckCircle,
} from "react-icons/ai";
import { BsArrowDownCircle, BsClipboardData } from "react-icons/bs";
import _ from "lodash";
import { STATUS } from "../../App/Constants";
import { Button } from "@chakra-ui/button";
import { useDispatch, useSelector } from "react-redux";
import { resetUploadSheet, uploadSheetAction } from "../../redux/reducers/test";
import {
  uploadFileAction,
  resetFileAction,
} from "../../redux/reducers/website";
import { beautifyDate } from "../../utils/Helper";
import moment from "moment";
import { AssignmentDetails, UploadAnswerSheet } from "./AssignmentDetails";
import { CheckIcon, ExternalLinkIcon } from "@chakra-ui/icons";
import { MdLeaderboard, MdQuestionAnswer } from "react-icons/md";
import { useHistory, useParams } from "react-router-dom";

export const Assignments = ({ assignments, currentPackage, website }) => {
  const [searchData, changeSearchData] = useState("");

  
  const [isactivedata, setIsActiveData] = useState()
  const [iscompletedata, setIsCompleteData] = useState()
  const [isexpireddata, setIsExpiredData] = useState()

  console.log('isactivedata',isactivedata)
  console.log('iscompletedata',iscompletedata)
  console.log('isexpireddata',isexpireddata)

  useEffect(() => {
    let activearray = []
    let completearray = []
    let expiredarray = []
    _.chain(assignments)
      .orderBy('startDate', 'desc')
      .filter((f) =>
        _.includes(_.toUpper(f?.assignmentId?.title), _.toUpper(searchData))
      )
      .map((ass) => {
          let assignmentItem = ass && ass.assignmentId;
          let today = moment();
          let startDate = ass && ass.startDate && moment(ass.startDate);
          let endDate = ass && ass.startDate && moment(ass.endDate);

          const isBefore = ass &&
            ass.startDate &&
            moment(today).isBefore(startDate) &&
            moment(ass.startDate).fromNow();
          const isExpired = ass &&
            ass.endDate &&
            moment(today).isAfter(endDate) &&
            moment(ass.endDate).fromNow();
          let isSubmitted = null;
          if (assignmentItem?.submissions?.length) {
           isSubmitted = _.find(assignmentItem.submissions, (s) => s.submittedAt || s.answerSheetChecked?.length);
          }
          let currentDate = moment(new Date())

          const toExpire =
            !isBefore &&
            !isExpired &&
            ass.endDate &&
            moment(ass.endDate).fromNow();
            if(isExpired){
              expiredarray.push(ass)
            }
            else if(isSubmitted || ass.assignmentId.resultPublished == true){
              completearray.push(ass)
            }
            else{
              activearray.push(ass)
            }
              })
              .value()
              setIsCompleteData(completearray)
              setIsActiveData(activearray)
              setIsExpiredData(expiredarray)
  },[currentPackage, searchData, assignments])
  
  return (
    <Box width="100%">
      <Flex flexWrap="wrap">
        {_.chain(assignments)
          .orderBy('startDate', 'desc')
          .filter((f) =>
            _.includes(_.toUpper(f?.title), _.toUpper(searchData))
          )
          .map((ass) => {
            return (
              ass.startDate && (
                <AssignmentItem
                  key={ass._id}
                  assignment={ass}
                  website={website}
                  currentPackage={currentPackage}
                />
              )
            );
          })
          .value()
        }
      </Flex>
    </Box>
  );
};

const AssignmentItem = ({ assignment, currentPackage, website }) => {
  console.log("assignment", assignment)
  const [testBoxModal, openTextBox] = useState();
  const [uploadFile, openUploadFile] = useState();
  const [downloadModalData, changeDownloadModalData] = useState({
    assignment: "",
    downloadModal: false,
  });

  let assignmentItem = assignment.assignmentId;

  const _openTextBox = (data) => {
    openTextBox((d) => (d ? null : data));
  };

  const _openUploadFile = (data) => {
    openUploadFile((d) => (d ? null : data));
  };

  // const answersheet =assignmentItem?.answerSheet && Array.isArray(assignmentItem.answerSheet)
  //   ? assignmentItem.answerSheet[0]?.file : assignmentItem?.answerSheet?.file;

  let today = moment();
  let startDate = assignment.startDate && moment(assignment.startDate);
  let endDate = assignment.startDate && moment(assignment.endDate);

  const isBefore =
    assignment.startDate &&
    moment(today).isBefore(startDate) &&
    moment(assignment.startDate).fromNow();
  const isExpired =
    assignment.endDate &&
    moment(today).isAfter(endDate) &&
    moment(assignment.endDate).fromNow();

  const isSubmitted = useMemo(() => {
    let submission = false;
    if (assignmentItem?.submissions) {
      submission = _.find(assignmentItem.submissions, (s) => s.submittedAt || s.answerSheetChecked?.length);
    }
    return submission;
  }, [assignmentItem]);

  const resultPublished = assignmentItem.resultPublished;

  const footer = resultPublished
    ? {
        info: "Result Published",
        infoColor: "green.500",
        text: "Result Published",
        color: "green.500",
      }
    : isSubmitted
    ? {
        info: "Submitted",
        infoColor: "green.500",
        text: "Submitted",
        color: "green.500",
      }
    : isBefore
    ? {
        info: "Starting " + isBefore,
        infoColor: "blue.500",
        text: "Currently Not Available",
      }
    : isExpired
    ? {
        info: "Ended " + isExpired,
        infoColor: "yellow.500",
        text: "Expired",
        color: "red.500",
      }
    : null;

  // let currentDate = moment(new Date())

  const toExpire =
    !isBefore &&
    !isExpired &&
    assignment.endDate &&
    moment(assignment.endDate).fromNow();
  // console.log({isBefore, isExpired});
  const [openAssignDetails, changeOpenAssignDetails] = useState();

  const _openAssignDetails = (data) => {
    changeOpenAssignDetails(data);
  };

  const [files, _setFiles] = useState([]);

  const { totalSize, countFiles } = useMemo(() => {
    const s = _.sumBy(files, "size");
    const c = files.length;
    return { totalSize: ((s / 1024 / 1024) * 100) / 100, countFiles: c };
  }, [files]);

  const history = useHistory();
  const params = useParams();

  const _discussion = (a) => {
    history.push(
      "/dashboard/exam/discussion/" + params.packageId + "/" + a._id + "/assignment"
    ); //_.last(test.userAttempts)._id)
  };
  const _leaders = (a) => {
    history.push(
      "/dashboard/assignment/leaders/" + params.packageId + "/" + a._id + "/"
    ); //_.last(test.userAttempts)._id)
  };

  const moreData = resultPublished
    ? {
        label: "View Result",
        color: "green",
      }
    : isSubmitted
    ? {
        label: "View Submitted Details",
        color: "green",
      }
    : isBefore
    ? {
        label: "Not Available",
        color: "blue",
      }
    : isExpired
    ? {
        label: "Not Available",
        color: "red",
      }
    : {
        label: "Download Question Paper",
        color: "green",
      };

  return (
    <Box bg="white" boxShadow="md" borderWidth="1px" borderRadius="lg" m={3}>
      <Flex direction="column" h="100%" justify="space-between">
        <Box flexGrow={1}>
          <Box>
            <HStack
              p="3"
              lineHeight="tight"
              fontSize="lg"
              // borderBottom='1px solid #D6DBDF'
            >
              <Box>
                <HStack>
                  <Box paddingRight={1}>
                    <BsClipboardData fontSize="heading" />
                  </Box>
                  <Text p="0 4">{assignmentItem?.title}</Text>
                </HStack>
                <HStack mt={1} alignItems="center" p="1" fontSize="xs" bg="#F0F3F4">
                  <Box>
                    <Image src="/images/Date.svg" />
                  </Box>
                  <Text fontSize="10px">
                    Start{" "}
                    {startDate
                      ? moment(startDate).format("DD MMM, hh:mm a")
                      : "-"}
                  </Text>
                  <Text> | </Text>
                  <Text fontSize="10px">
                    End{" "}
                    {endDate ? moment(endDate).format("DD MMM, hh:mm a") : "-"}
                  </Text>
                </HStack>
              </Box>
            </HStack>
            <Box fontSize="sm" p={3}>
              {resultPublished &&
              assignment.assignmentId?.submissions?.length ? (
                <HStack>
                  <AiOutlineCheckCircle />
                  <Text>
                    <b>Your Marks: </b>{" "}
                  </Text>
                  <Text color="brand.blue" fontWeight="bold">
                    {assignment.assignmentId.submissions[0].result || "-"}
                  </Text>
                </HStack>
              ) : null}
              <HStack>
                <AiOutlineCheckCircle />
                <Text>
                  <b>Max Marks:</b> {assignment.maximumMarks || "-"}
                </Text>
              </HStack>
              {/* <HStack>
                                <BiCalendarCheck/> <Text><b>Date:</b> </Text> 
                            </HStack>
                            <HStack>
                                <AiOutlineUnorderedList/> <Text><b>No of Attempts:</b> {assignmentItem?.totalQuestions}</Text> 
                            </HStack> */}
            </Box>
            {!footer && toExpire ? (
              <Box p={3} fontSize="sm">
                <HStack py={1} px={2} alignItems="center" bg="#FDEDEC">
                  <Box pr={1}>
                    <AiFillClockCircle color="red" />
                  </Box>
                  {/* <Text color='red.500'>
                                        <b>Submit within : </b>
                                        {_.round(diffDateInHours/24) === 0 ? 'Today' 
                                            :_.round(diffDateInHours/24) === 1 ? 
                                                `${_.round(diffDateInHours/24)} Day`
                                                :
                                                `${_.round(diffDateInHours/24)} Days`
                                        }
                                    </Text> */}
                  <Text color="red.500">
                    <b>Submit within : </b>
                    {toExpire}{" "}
                  </Text>
                </HStack>
              </Box>
            ) : null}
          </Box>
        </Box>
        <Box p={2}>
          <Divider pt={3} />
          {true ? (
            <HStack justifyContent={'center'}
              style={{
                border: "1px solid #7070703E",
                borderRadius: "6px",
                backgroundColor: "white",
                position: "relative",
                top: "-10px",
                // left: "28%",
                padding: "4px 10px",
              }}
            >
              <Button
                colorScheme={moreData.color}
                onClick={() => _openAssignDetails(assignment)}
                variant="link"
              >
                {moreData.label}
              </Button>
            </HStack>
          ) : null}
          {footer ? (
            <Box display="flex" justifyContent="space-between" alignItems={'center'} p={1}>
              <Flex>
                {assignmentItem?.discussion ? (
                  <Box mr="1" ml="1">
                    <Tooltip label="Doubt Community">
                      <Box
                        onClick={() => _discussion(assignmentItem)}
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

                {assignmentItem?.resultPublished ? (
                  <Box mr="1" ml="1">
                    <Tooltip label="Leader Board">
                      <Box borderRadius="50%" padding={1} background="#EFF3F6">
                        <MdLeaderboard
                          fontSize="28px"
                          cursor="pointer"
                          color="#DC4D4A"
                          onClick={() => _leaders(assignmentItem)}
                        />
                      </Box>
                    </Tooltip>
                  </Box>
                ) : null}
              </Flex>
              <Text fontSize={14} color={footer.infoColor}>{footer.info}</Text>
            </Box>
          ) : null}
          {/* <Box p={1}>
                        <Button onClick={() => _openUploadFile(ass)} style={{border: '1px solid #DC554D'}} color='#DC554D' variant="outline" borderRadius='4px' size='sm'>
                            Assignment Closed
                        </Button>
                    </Box> */}
        </Box>
      </Flex>
      {openAssignDetails ? (
        <AssignmentDetails
          assignment={openAssignDetails}
          visible={openAssignDetails}
          closeModal={() => _openAssignDetails(false)}
          footer={footer}
          isSubmitted={isSubmitted}
          totalSize={totalSize}
          countFiles={countFiles}
          files={files}
        />
      ) : null}
      {downloadModalData.downloadModal ? (
        <DownloadAssignmetModal
          visible={downloadModalData.downloadModal}
          assignment={downloadModalData.assignment}
          closeModal={() =>
            changeDownloadModalData({ assignment: "", downloadModal: false })
          }
        />
      ) : null}
      {testBoxModal ? (
        <TextBoxModal
          visible={testBoxModal}
          data={testBoxModal}
          closeModal={_openTextBox}
        />
      ) : null}
      {uploadFile ? (
        <UploadFile
          visible={uploadFile}
          data={uploadFile}
          closeModal={_openUploadFile}
          website={website}
        />
      ) : null}
    </Box>
  );
};

const UploadFile = ({ visible, closeModal, data, website }) => {
  const dispatch = useDispatch();
  const [file, changeFile] = useState();

  const { uploadSheetStatus } = useSelector((state) => ({
    uploadSheetStatus: state.test.uploadSheetStatus,
  }));

  useEffect(() => {
    return () => dispatch(resetUploadSheet());
  }, []);

  useEffect(() => {
    if (uploadSheetStatus == STATUS.SUCCESS) closeModal();
  }, [uploadSheetStatus]);

  const _uploadFile = (e) => {
    let item = { file: e.target.files?.[0] };
    let form_data = new FormData();

    for (let key in item) {
      form_data.append(key, item[key]);
    }

    dispatch(uploadFileAction(form_data));
    // changeFile(e.target.files?.[0])
  };

  const upload = () => {
    const formData = new FormData();
    formData.append("assignmentId", data._id);

    _.forEach(filesData?.files, (f, i) => {
      formData.append(`uploads`, f);
    });

    dispatch(uploadSheetAction(formData));
  };

  useEffect(() => {
    dispatch(resetFileAction());
  }, [visible]);

  let [filesData, setFiles] = useState();
  const getFiles = (data) => {
    setFiles(data);
  };

  return (
    <Modal isOpen={visible} size="2xl" onClose={closeModal}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Upload File</ModalHeader>
        <ModalBody>
          <UploadAnswerSheet getFiles={getFiles} />
          {/* <Input placeholder='file' onChange={_uploadFile} type='file'/> */}
        </ModalBody>
        <ModalFooter>
          <Button
            disabled={
              !filesData?.files?.length ||
              filesData?.totalSize >= 10000 ||
              filesData?.countFiles > 10
            }
            onClick={upload}
            isLoading={uploadSheetStatus == STATUS.FETCHING}
            loadingText="Submitting..."
          >
            Submit
          </Button>

          {/* <Button  disabled={website.uploadFileStatus != STATUS.SUCCESS} onClick={upload}>Upload</Button> */}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

const TextBoxModal = ({ visible, closeModal, data }) => {
  const dispatch = useDispatch();

  const [answer, changeAnswer] = useState();

  const save = () => {
    dispatch(
      uploadSheetAction({ typedAnswers: answer, assignmentId: data._id })
    );
  };

  const _changeAnswer = (e) => {
    changeAnswer(e.target.value);
  };

  return (
    <Modal isOpen={visible} size="4xl" onClose={closeModal}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Answers</ModalHeader>
        <ModalBody>
          <Textarea placeholder="Answers" onChange={_changeAnswer} />
        </ModalBody>
        <ModalFooter>
          <Button disabled={!answer} onClick={save}>
            Submit
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

const DownloadAssignmetModal = ({ visible, closeModal, assignment }) => {
  const dispatch = useDispatch();
  return (
    <Modal isOpen={visible} size="4xl" onClose={closeModal}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Download Assignment Data</ModalHeader>
        <ModalBody>
          <Box>
            <Flex p={3}>
              <HStack spacing="24px">
                <Box w="140px">Question Paper:</Box>
                <Box>
                  <Tag
                    size="sm"
                    variant="solid"
                    colorScheme="teal"
                    cursor="pointer"
                    onClick={() => window.open(assignment.questionPaper)}
                  >
                    Download Question Paper
                  </Tag>
                </Box>
              </HStack>
            </Flex>
            <Flex p={3}>
              {assignment.answerSheet?.length ? (
                <HStack spacing="24px">
                  <Box w="140px">Answer Keys:</Box>
                  <Box>
                    {_.map(assignment.answerSheet, (s) => {
                      return (
                        <Tag
                          size="sm"
                          key={s._id}
                          variant="solid"
                          colorScheme="teal"
                          cursor="pointer"
                          onClick={() => window.open(s.file)}
                        >
                          {s.title}
                        </Tag>
                      );
                    })}
                  </Box>
                </HStack>
              ) : assignment.localAnswerSheet ? (
                <HStack spacing="24px">
                  <Box w="140px">Answer Keys:</Box>
                  <Box>
                    <Tag
                      size="sm"
                      variant="solid"
                      colorScheme="teal"
                      cursor="pointer"
                      onClick={() => window.open(assignment.localAnswerSheet)}
                    >
                      Answer Sheet
                    </Tag>
                  </Box>
                </HStack>
              ) : null}
            </Flex>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
