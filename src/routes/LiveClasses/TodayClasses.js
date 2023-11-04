import React, { useRef, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Center,
  Divider,
  Flex,
  Link,
  Heading,
  HStack,
  Spinner,
  Text,
  VStack,
  IconButton,
} from "@chakra-ui/react";
import { AiOutlineCalendar } from "react-icons/ai";
import { useMemo } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getStaffRatingAction,
  getTodayLiveClassAction,
} from "../../redux/reducers/liveClass";
import { map } from "jquery";
import { STATUS } from "../../Constants";
import { useCallback } from "react";
import { filter, find, flatMap, indexOf, size, uniq } from "lodash";
import { Rating } from "./StudentFeedbacks";
import { LinkIcon } from "@chakra-ui/icons";
import { ROUTES } from "../../Constants/Routes";
import { useHistory } from "react-router-dom";
import moment from "moment";
import { setLectureId, setPageDetailsData } from "../../redux/reducers/UI";
import { BiErrorCircle } from "react-icons/bi";

export default function TodayClasses({ setTeacherReview }) {
  const { user, todayLiveClasses, getTodayLiveClassStatus } = useSelector(
    (s) => ({
      user: s.user.user,
      getTodayLiveClassStatus: s.liveClass.getTodayLiveClassStatus,
      todayLiveClasses: s.liveClass.todayLiveClasses,
    })
  );
  const [courseIds, setCourseIds] = useState();

  const batchIds = useMemo(
    () =>
      filter(
        flatMap(user?.student?.packages, (p) => {
          if (size(p.package?.batches)) {
            if (size(p.package?.courses)) {
              setCourseIds((s) => uniq([...(s || []), ...p.package?.courses]));
            }
          }
          return p.package?.batches;
        })
      ),
    [user]
  );

  const dispatch = useDispatch();

  useEffect(() => {
    if (batchIds.length > 0) {
      dispatch(
        getTodayLiveClassAction({
          batchIds,
          filterDate: moment().format("YYYY-MM-DD"),
        })
      );
    }
  }, [batchIds, dispatch]);

  const handleSeeReview = useCallback(
    (teacherId) => {
      setTeacherReview(teacherId);
    },
    [setTeacherReview]
  );

  useEffect(() => {
    if (todayLiveClasses?.length > 0) {
      const staffIds = uniq(
        map(todayLiveClasses, (t) => t.staff?._id || t.batchSubject?.staff?._id)
      );
      dispatch(getStaffRatingAction({ staffIds }));
    }
  }, [todayLiveClasses, dispatch]);

  const timerRef = useRef();
  const [timer, setTimer] = useState();

  useEffect(() => {
    timerRef.current = setInterval(() => {
      const time = moment().toISOString(true);
      setTimer(time);
    }, 5000);
    return () => clearInterval(timerRef.current);
  }, []);

  const history = useHistory();
  const _torecorded = () => {
    if (size(courseIds) === 1) {
      history.push(`/dashboard/courses/${courseIds[0]}/videos`);
    } else {
      history.push("/dashboard/courses");
    }
  };

  const todayLiveClassesData = useMemo(() => {
    if (todayLiveClasses?.length && user?.student?.packages?.length) {
      return todayLiveClasses.map(cls => ({
        ...cls,
        package: find(user.student.packages, pkg => pkg.package.batches?.length && indexOf(pkg.package.batches, cls.batchSubject?.batch._id) !== -1)
      }))
    } return todayLiveClasses
  }, [todayLiveClasses, user])

  return (
    <>
      <Box w="75%" pl={1}>
        <Box
          p={4}
          bg="white"
          borderRadius={5}
          border="1px solid"
          borderColor="gray.200"
        >
          <Flex justify="space-between">
            <Heading size="sm">Today Classes</Heading>
            <Flex align="center">
              {/* <Button mr={2} size='sm' colorScheme='blue'>Activity report</Button> */}
              <Button size="sm" colorScheme="blue" onClick={_torecorded}>
                Recorded classes
              </Button>
            </Flex>
          </Flex>
          {getTodayLiveClassStatus === STATUS.FETCHING ? (
            <Center py={14}>
              <Spinner />
            </Center>
          ) : todayLiveClassesData?.length > 0 ? (
            <VStack align="stretch" mt={10}>
              {map(todayLiveClassesData, (c) => (
                <LiveClass
                  seeReview={handleSeeReview}
                  key={c._id}
                  timer={timer}
                  classDetail={c}
                />
              ))}
            </VStack>
          ) : (
            <Heading textAlign="center" size="md" py={20} mt={10}>
              No Class for today
            </Heading>
          )}
        </Box>
      </Box>
    </>
  );
}

const getTimerFromSeconds = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const leftSeconds = seconds % 60;
  const secondsStr =
    leftSeconds >= 0 && leftSeconds < 10
      ? "0" + leftSeconds
      : String(leftSeconds);

  return {
    minutes,
    seconds: secondsStr,
  };
};

const LiveClass = ({ classDetail, timer, seeReview }) => {
  const staffDetails = useMemo(
    () => classDetail.staff || classDetail.batchSubject.staff,
    [classDetail]
  );

  const startTime = moment(classDetail.scheduleDateTime);
  const endTime = moment(classDetail.scheduleDateTime).add(
    classDetail.batchSubject.batch.duration,
    "m"
  );

  const status = useMemo(() => {
    if (moment(timer).isBetween(startTime, endTime)) {
      return { canAttend: true };
    } else if (moment(timer).isBefore(startTime)) {
      let left = 0;

      const seconds = startTime.diff(moment(timer), "second");
      if (seconds > 0) {
        if (seconds > 1 * 24 * 60 * 60) {
          left = Math.round(seconds / (24 * 60 * 60)) + " Days";
        } else if (seconds > 3600) {
          left = Math.round(seconds / (60 * 60)) + " hrs";
        } else {
          const timeSeconds = getTimerFromSeconds(seconds);
          left = timeSeconds.minutes + ":" + timeSeconds.seconds + " mins";
        }
      } else {
        left = 0;
      }

      return {
        canAttend: false,
        message: left ? `Starting in ${left}` : "Not Available",
        color: "blue.400",
      };
    } else if (moment(timer).isAfter(endTime)) {
      return {
        canAttend: false,
        message: "Expired",
        color: "red.500",
      };
    }
  }, [startTime, endTime, timer]);

  const history = useHistory();
  const dispatch = useDispatch();

  const _attend = () => {
    if (classDetail.zoomMeetingAvailable) {
      dispatch(setLectureId(classDetail._id));
      history.push(`${ROUTES.ZOOM_CLASS}?leaveUrl=${ROUTES.LIVE_CLASSES}`);
    } else if (classDetail.youtubeVideoId) {
      dispatch(setPageDetailsData({ youtubeId: classDetail.youtubeVideoId }));
      history.push(`${ROUTES.YOUTUBE_LIVE}`);
    }
  };

  const duePaymentWarning = classDetail.package?.validity?.date && moment(classDetail.package?.validity?.date).isBefore(moment())
  return (
    <Box>
      <Flex justify="space-between">
        <Box flex={1}>
          <HStack color="gray.600" mt={4} spacing={2} w="100%">
            <LiveBatch />
            <Box>
              {moment(classDetail.scheduleDateTime).format("MMM DD, YYYY")}
            </Box>
            <Flex align="center">
              <Box mr={1} color="blue.600">
                <AiOutlineCalendar />
              </Box>
              {startTime.format("hh:mm a")} - {endTime.format("hh:mm a")}
            </Flex>
          </HStack>
          <HStack justify={"space-between"}>
            <Heading
              fontSize="sm"
              mt={2}
            >{`${classDetail?.batchSubject?.subject?.name?.en} Lecture - ${classDetail?.lectureNo}`}</Heading>
            <Text fontSize="sm">{classDetail?.batchSubject?.batch?.name}</Text>
          </HStack>
          <Text mt={1} noOfLines={2}>
            {classDetail.description}
          </Text>
          <Flex wrap="wrap" ml={-2}>
            {map(classDetail.files, (file) => {
              return (
                <Box p={1} key={file._id} w="50%">
                  <a target="_blank" href={file.url} rel="noreferrer">
                    <Box borderRadius={10} p={2}>
                      <Flex align="center">
                        <IconButton>
                          <LinkIcon />
                        </IconButton>
                        <Box px={2}>
                          <Text noOfLines={1}>{file.name}</Text>
                          {/* <Button mt={1} size='sm'>
                                                                <DownloadIcon mr={2}/> Download
                                                            </Button> */}
                        </Box>
                      </Flex>
                    </Box>
                  </a>
                </Box>
              );
            })}
          </Flex>
          {duePaymentWarning ?
            <HStack opacity={'.8'} borderRadius={6} background={'#FADBD8'} p={2} mt={3}>
              <BiErrorCircle color="#E74C3C" />
              <Text color={'#E74C3C'} size="md">Looks like your previous due is pending. Please pay your due and continue learning.</Text>
            </HStack>
            :
            (classDetail.zoomMeetingAvailable || classDetail.youtubeVideoId) &&
              status?.canAttend ? (
              <Button onClick={_attend} mt={4} size="sm" colorScheme="green">
                Attend Class
              </Button>
            ) : (
              <Box mt={2}>
                <Text fontSize="sm" color={status.color}>
                  {status.message}
                </Text>
              </Box>
            )}
        </Box>
        {staffDetails && (
          <Box onClick={() => seeReview(staffDetails._id)} p={2}>
            <TeacherAvatar
              staffId={staffDetails._id}
              avatarImage={staffDetails.user.avatar}
              name={staffDetails.user.name}
            />
          </Box>
        )}
      </Flex>
      <Divider mt={4} />
    </Box>
  );
};

const TeacherAvatar = ({ name, avatarImage, staffId }) => {
  const { staffRatings } = useSelector((s) => ({
    staffRatings: s.liveClass.staffRatings,
  }));

  const ratings = useMemo(
    () => find(staffRatings, (s) => s.staffId === staffId),
    [staffId, staffRatings]
  );
  return (
    <Box
      border="1px solid"
      borderColor="gray.200"
      py={2}
      px={4}
      borderRadius={5}
      textAlign="center"
    >
      <Center>
        <Avatar src={avatarImage} size="lg" name={name} />
      </Center>
      <Text noOfLines={1} mt={2} color="gray.600">
        By {name}
      </Text>
      {ratings && (
        <HStack mt={1} justify="center" spacing={2}>
          <Rating stars={ratings.sumOfRating / ratings.noOfRatings} />
          <Box>({ratings.noOfRatings})</Box>
        </HStack>
      )}
      <Box textAlign="center" color="blue.400" fontSize="sm" as={Link}>
        See reviews
      </Box>
    </Box>
  );
};

const LiveBatch = () => {
  return (
    <Box border="1px dashed" borderColor="red.300" borderRadius={2}>
      <Flex align="center" bg="red.400" color="white" px={3} py={1}>
        <Box w={2} h={2} borderRadius={50} bg="white"></Box>
        <Box fontSize="sm" ml={2}>
          Live
        </Box>
      </Flex>
    </Box>
  );
};
