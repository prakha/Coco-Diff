import {
  Box,
  Flex,
  Heading,
  IconButton,
  Image,
  Table,
  TableCaption,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tooltip,
  Tr,
  useToast,
  VStack,
} from "@chakra-ui/react";
import _, { find, findIndex, round, size } from "lodash";
import React, { useEffect, useMemo, useState } from "react";
import { AiOutlineEye } from "react-icons/ai";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { ErrorChecker } from "../../Components/ErrorChecker";
import { SectionHeader } from "../../Components/SectionHeader";
import { ROUTES } from "../../Constants/Routes";
import { getTestAttemptAction } from "../../redux/reducers/test";
import { apis } from "../../services/api/apis";
import { DiscussionComments } from "../DiscussionCommunity/DiscussionComments";

export const LeaderBoardScreen = (props) => {
  const params = useParams();
  const dispatch = useDispatch();

  const { currentAttempt, user } = useSelector((state) => ({
    currentAttempt: state.test.currentAttempt,
    user: state.user.user,
  }));

  const student = useSelector((s) => s.user.student);
  let pkg = student
    ? find(student.packages, (p) => p.package?._id === params.packageId)
    : null;

  let breadcrumbs = [
    { title: "Home", link: "/" },
    { title: "My Tests", link: ROUTES.TEST_PACKAGES },
    {
      title: pkg?.package?.name?.en || "Package Tests",
      link: ROUTES.TEST_PACKAGES + "/" + params.packageId,
    },
    { title: "Leader Board" },
  ];

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState();
  const toast = useToast();

  const inLeaderBoard = useMemo(() => {
    return data?.toppers?.length
      ? findIndex(data.toppers, (t) => t.userId._id === student.user) !== -1
      : true;
  }, [data, student]);

  useEffect(() => {
    if (params.attemptId)
      dispatch(getTestAttemptAction({ id: params.attemptId }));
  }, [dispatch, params.attemptId, inLeaderBoard]);

  const currentStudentResult = useMemo(() => {
    if (params.attemptId && !inLeaderBoard && currentAttempt) {
      return currentAttempt;
    }
  }, [currentAttempt, inLeaderBoard, params]);

  useEffect(() => {
    const api = async () => {
      setLoading(true);
      const response = await apis.testToppersApi({ testId: params.testId });
      setLoading(false);
      if (response.ok) {
        setData(response.data);
      } else {
        toast({
          status: "error",
          title: "could not load toppers",
        });
      }
    };
    api();
  }, [params.testId, toast]);

  return (
    <Box p={3}>
      <SectionHeader title="Test Result" breadcrumbs={breadcrumbs} />
      {/* <Box
        flex="none"
        boxSize="full"
        shadow="md"
      // as={Link}

      //  to={{pathname: slide.link, target:"_blank"}}
      >
        <Image
          src={require("../../Images/humtayaarh.jpg")}
          boxSize="full"
          backgroundSize="initial"
        />
      </Box> */}
      <ErrorChecker state={loading}>
        {data && data.toppers ? (
          size(data.toppers) ? (
            <>
              <Box p={4} bg="white">
                <Heading fontSize="lg">{data?.name?.en}</Heading>
                <Flex mt={3}>
                  <Box boxShadow="xs" m={2} p={4} borderRadius="lg">
                    <Text mb={1} fontSize={"sm"} color="gray.600">
                      Total Attempts{" "}
                    </Text>
                    <Text fontSize={"md"} color="gray.800">
                      {" "}
                      {data?.testResult?.totalAttempt}
                    </Text>
                  </Box>

                  <Box boxShadow="xs" m={2} p={4} borderRadius="lg">
                    <Text mb={1} fontSize={"sm"} color="gray.600">
                      Your Rank
                    </Text>
                    <Text fontSize={"md"} color="gray.800">
                      {data.selfAttempt?.studentResult?.skippedRank || "-"}
                    </Text>
                  </Box>

                  <Box boxShadow="xs" m={2} p={4} borderRadius="lg">
                    <Text mb={1} fontSize={"sm"} color="gray.600">
                      Max Marks
                    </Text>
                    <Text fontSize={"md"} color="gray.800">
                      {data?.maxMarks}
                    </Text>
                  </Box>

                  <Box boxShadow="xs" m={2} p={4} borderRadius="lg">
                    <Text mb={1} fontSize={"sm"} color="gray.600">
                      Average Score
                    </Text>
                    <Text fontSize={"md"} color="gray.800">
                      {round(data?.testResult?.averageScore, 2)}
                    </Text>
                  </Box>
                  <Box boxShadow="xs" m={2} p={4} borderRadius="lg">
                    <Text mb={1} fontSize={"sm"} color="blue.500">
                      Your Percentile
                    </Text>
                    <Text fontSize={"md"} color="blue.500">
                      {round(currentAttempt?.studentResult?.percentile, 2) || 0}
                      %
                    </Text>
                  </Box>
                </Flex>
              </Box>
              <Table bg="white" variant="simple">
                <TableCaption>Test Toppers</TableCaption>
                <Thead>
                  <Tr>
                    <Th>Student</Th>
                    <Th isNumeric>Rank</Th>
                    <Th isNumeric>Score</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {data.toppers.map((t, i) => {
                    const isCurrentUser = t.userId._id === student.user;
                    return (
                      <Tr
                        key={t._id}
                        {...(isCurrentUser
                          ? { bg: "green.100", fontWeight: "bold" }
                          : {})}
                        sx={
                          i === 0
                            ? {
                                border: "0.6px solid green.400",
                                fontWeight: "bold",
                              }
                            : {}
                        }
                      >
                        <Td
                          color={
                            i === 0 || i === 1 || i === 2
                              ? "green.600"
                              : "black"
                          }
                        >
                          {t.userId?.name}
                        </Td>
                        <Td isNumeric>{t.studentResult?.skippedRank}</Td>
                        <Td isNumeric>
                          {round(t.studentResult.totalScore, 2)}
                        </Td>
                      </Tr>
                    );
                  })}
                  {currentStudentResult && (
                    <>
                      <Tr>
                        <Td textAlign={"center"} colSpan={3}>
                          <VStack>
                            <Text fontSize={20}>....</Text>
                          </VStack>
                        </Td>
                      </Tr>
                      <Tr fontWeight={"bold"} bg={"green.100"}>
                        <Td>{user.name}</Td>
                        <Td isNumeric>
                          {currentStudentResult.studentResult.skippedRank}
                        </Td>
                        <Td isNumeric>
                          {round(
                            currentStudentResult.studentResult.totalScore,
                            2
                          )}
                        </Td>
                      </Tr>
                    </>
                  )}
                </Tbody>
              </Table>
            </>
          ) : (
            <Box p={2}>
              <Text>No Toppers found</Text>
            </Box>
          )
        ) : null}
      </ErrorChecker>
    </Box>
  );
};

export const AssignmentLeaderBoardScreen = (props) => {
  const params = useParams();
  const student = useSelector((s) => s.user.student);
  let pkg = student
    ? find(student.packages, (p) => p.package?._id === params.packageId)
    : null;

  let breadcrumbs = [
    { title: "Home", link: "/" },
    { title: "My Tests", link: ROUTES.TEST_PACKAGES },
    {
      title: pkg?.package?.name?.en || "Package Tests",
      link: ROUTES.TEST_PACKAGES + "/" + params.packageId,
    },
    { title: "Leader Board" },
  ];

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState();
  const toast = useToast();

  useEffect(() => {
    const api = async () => {
      setLoading(true);
      const response = await apis.assignmentToppersApi({
        assignmentId: params.testId,
      });
      setLoading(false);
      if (response.ok) {
        setData(response.data);
      } else {
        toast({
          status: "error",
          title: "could not load toppers",
        });
      }
    };
    api();
  }, [params.testId, toast]);

  return (
    <Box p={3}>
      <SectionHeader title="Assignment Result" breadcrumbs={breadcrumbs} />
      <Box
        flex="none"
        boxSize="full"
        shadow="md"
        // as={Link}

        //  to={{pathname: slide.link, target:"_blank"}}
      ></Box>
      <ErrorChecker state={loading}>
        {data && data.toppers ? (
          size(data.toppers) ? (
            <>
              <Box p={4} bg="white">
                <Heading fontSize="lg">{data?.name?.en}</Heading>
                <Flex mt={3}>
                  <Box boxShadow="xs" m={2} p={4} borderRadius="lg">
                    <Text mb={1} fontSize={"sm"} color="gray.600">
                      Total Attempts{" "}
                    </Text>
                    <Text fontSize={"md"} color="gray.800">
                      {" "}
                      {data?.result?.totalAttempt}
                    </Text>
                  </Box>

                  <Box boxShadow="xs" m={2} p={4} borderRadius="lg">
                    <Text mb={1} fontSize={"sm"} color="gray.600">
                      Your Rank
                    </Text>
                    <Text fontSize={"md"} color="gray.800">
                      {data.selfAttempt?.studentResult?.rank || "-"}
                    </Text>
                  </Box>

                  <Box boxShadow="xs" m={2} p={4} borderRadius="lg">
                    <Text mb={1} fontSize={"sm"} color="gray.600">
                      Average Score
                    </Text>
                    <Text fontSize={"md"} color="gray.800">
                      {round(data?.result?.averageScore, 2)}
                    </Text>
                  </Box>
                </Flex>
              </Box>
              <Table bg="white" variant="simple">
                <TableCaption>Assignment Toppers</TableCaption>
                <Thead>
                  <Tr>
                    <Th>Student</Th>
                    <Th isNumeric>Rank</Th>
                    <Th isNumeric>Score</Th>
                    <Th>Toppers Answer Sheet</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {data.toppers.map((t, i) => {
                    return (
                      <Tr
                        key={t._id}
                        sx={
                          i === 0
                            ? {
                                border: "0.6px solid green.400",
                                fontWeight: "bold",
                              }
                            : {}
                        }
                      >
                        <Td
                          color={
                            i === 0 || i === 1 || i === 2
                              ? "green.600"
                              : "black"
                          }
                        >
                          {t.userId?.name}
                        </Td>
                        <Td isNumeric>{t.studentResult?.rank}</Td>
                        <Td isNumeric>{round(t.studentResult.score, 2)}</Td>
                        <Td isNumeric>
                          {t?.publicAnswerSheet &&
                          t?.answerSheetChecked?.length ? (
                            <FileDownloadView url={t.answerSheetChecked[0]} />
                          ) : null}
                        </Td>
                      </Tr>
                    );
                  })}
                </Tbody>
              </Table>
            </>
          ) : (
            <Box p={2}>
              <Text>No Toppers found</Text>
            </Box>
          )
        ) : null}
      </ErrorChecker>
    </Box>
  );
};

const FileDownloadView = ({ url }) => {
  return (
    <Box>
      <Tooltip label="view">
        <AiOutlineEye
          fontSize="20px"
          onClick={() => window.open(url)}
          cursor="pointer"
        />
      </Tooltip>{" "}
    </Box>
  );
};
