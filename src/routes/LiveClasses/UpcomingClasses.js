import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Button,
  Center,
  Divider,
  Flex,
  Heading,
  Input,
  Spinner,
} from "@chakra-ui/react";
import { map } from "lodash";
import { getUpcomingLiveClassAction } from "../../redux/reducers/liveClass";
import { STATUS } from "../../Constants";
import { filter } from "lodash";
import { find } from "lodash";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import moment from "moment";
import { flatMap } from "lodash";

const weekDays = ["S", "M", "T", "W", "T", "F", "S"];

export default function UpcomingClasses(props) {
  const { user } = useSelector((s) => ({
    user: s.user.user,
  }));

  const dispatch = useDispatch();

  const [selectedDate, setSelectedDate] = useState(moment().add(1, "day"));
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();

  const handlePrevMonth = useCallback(() => {
    setSelectedDate((p) => moment(p).subtract(1, "month"));
  }, [setSelectedDate]);

  const handleNextMonth = useCallback(() => {
    setSelectedDate((p) => moment(p).add(1, "month"));
  }, [setSelectedDate]);

  const handleTodayDate = useCallback(() => {
    setSelectedDate(moment());
  }, [setSelectedDate]);

  const batchIds = useMemo(
    () => filter(flatMap(user?.student?.packages, (p) => p.package?.batches)),
    [user]
  );
  useEffect(() => {
    const firstDateOfMonth = moment(selectedDate)
      .set("date", 1)
      .format("YYYY-MM-DD");
    const endDateOfMonth = moment(firstDateOfMonth)
      .add(1, "month")
      .subtract(1, "day")
      .format("YYYY-MM-DD");
    setStartDate(firstDateOfMonth);
    setEndDate(endDateOfMonth);
  }, [selectedDate]);

  useEffect(() => {
    if (batchIds.length > 0 && startDate && endDate) {
      dispatch(getUpcomingLiveClassAction({ batchIds, startDate, endDate }));
    }
  }, [batchIds, startDate, endDate, dispatch]);

  return (
    <Box py={6} bg="white" border="1px solid" borderColor="gray.200">
      <Box px={4}>
        <Heading size="sm">Upcoming Classes</Heading>
        <Flex mt={6} align="center" justify="space-between">
          <Box>{moment(selectedDate).format("MMM YYYY")}</Box>
          <DateButton
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
          />
        </Flex>
      </Box>
      <Box mt={2}>
        <ClassDates
          setSelectedDate={setSelectedDate}
          selectedDate={selectedDate}
        />
      </Box>
      <Box mt={8}>
        <IncomingClasses selectedDate={selectedDate} />
      </Box>
      <Flex px={2} justify="space-between">
        <Button
          leftIcon={<ChevronLeftIcon fontSize={20} />}
          onClick={handlePrevMonth}
          size="sm"
          colorScheme="gray"
          variant="flushed"
        >
          {moment(selectedDate)
            .set("date", 1)
            .subtract(1, "month")
            .format("MMM")}
        </Button>
        <Button onClick={handleTodayDate} size="sm" colorScheme="blue">
          Today
        </Button>
        <Button
          rightIcon={<ChevronRightIcon fontSize={20} />}
          onClick={handleNextMonth}
          size="sm"
          colorScheme="gray"
          variant="flushed"
        >
          {moment(selectedDate).set("date", 1).add(1, "month").format("MMM")}
        </Button>
      </Flex>
    </Box>
  );
}

const DateButton = ({ selectedDate, setSelectedDate }) => {
  return (
    <Box>
      <Input
        borderColor="transparent"
        value={moment(selectedDate).format("YYYY-MM-DD")}
        onChange={(e) => setSelectedDate(moment(e.target.value))}
        w={55}
        type="date"
      />
    </Box>
  );
};

const IncomingClasses = ({ selectedDate }) => {
  const { getUpcomingLiveClassStatus, batchUpcomingClasses } = useSelector(
    (s) => ({
      getUpcomingLiveClassStatus: s.liveClass.getUpcomingLiveClassStatus,
      batchUpcomingClasses: s.liveClass.batchUpcomingClasses,
    })
  );

  const filterClasses = useMemo(
    () =>
      filter(
        batchUpcomingClasses,
        (c) =>
          moment(c.scheduleDateTime).format("YYYY-MM-DD") ===
          moment(selectedDate).format("YYYY-MM-DD")
      ),
    [batchUpcomingClasses, selectedDate]
  );

  return (
    <Box px={4}>
      <Box pos="relative">
        <Heading
          fontSize="md"
          w="fit-content"
          pr={2}
          pos="relative"
          zIndex={2}
          bg="white"
        >
          {moment(selectedDate).format("DD MMM YYYY")}
        </Heading>
        <Box
          w="100%"
          pos="absolute"
          top="50%"
          h={"1px"}
          bg="gray.300"
          transform="translateY(-50%)"
        ></Box>
      </Box>
      {getUpcomingLiveClassStatus === STATUS.FETCHING ? (
        <Center py={14}>
          <Spinner />
        </Center>
      ) : filterClasses?.length > 0 ? (
        <Box>
          <Box mt={6}>
            {map(filterClasses, (c) => {
              return (
                <Box>
                  <Box>
                    <Box color="gray.500">
                      {moment(c.scheduleDateTime).format("MMM DD")} @{" "}
                      {moment(c.scheduleDateTime).format("hh:mm a")}-
                      {moment(c.scheduleDateTime)
                        .add(c.batchSubject.batch.duration, "m")
                        .format("hh:mm a")}
                    </Box>
                    <Heading fontSize="md">{c.description}</Heading>
                  </Box>
                  <Divider my={4} />
                </Box>
              );
            })}
          </Box>
        </Box>
      ) : (
        <Box py={12} textAlign="center">
          No upcoming classes
        </Box>
      )}
    </Box>
  );
};

const ClassDates = ({ selectedDate, setSelectedDate }) => {
  const [dates, setDates] = useState([]);

  const { batchUpcomingClasses } = useSelector((s) => ({
    batchUpcomingClasses: s.liveClass.batchUpcomingClasses,
  }));
  useEffect(() => {
    if (selectedDate) {
      let newDates = [];
      const firstDateOfMonth = moment(selectedDate).set("date", 1);
      const endDateOfMonth = moment(firstDateOfMonth)
        .add(1, "month")
        .subtract(1, "day");
      let currentDate = firstDateOfMonth;

      let gapDates = firstDateOfMonth.get("day");

      while (gapDates > 0) {
        newDates.push(null);
        gapDates -= 1;
      }

      while (currentDate <= endDateOfMonth) {
        newDates.push(currentDate);
        currentDate = moment(currentDate).add(1, "days");
      }
      setDates(newDates);
    }
  }, [selectedDate]);

  return (
    <Box w="100%" px={1}>
      <Flex w="100%" wrap="wrap">
        {map(weekDays, (d) => (
          <Box
            fontSize="xs"
            textAlign="center"
            fontWeight="bold"
            color="gray.500"
            p={2}
            minW={100 / weekDays.length + "%"}
            maxW={100 / weekDays.length + "%"}
            key={d}
          >
            {d}
          </Box>
        ))}
        {map(dates, (d, i) => {
          const isSelected =
            d && d.format("YYYY-MM-DD") === selectedDate.format("YYYY-MM-DD");
          const hasClasses =
            d &&
            find(
              batchUpcomingClasses,
              (c) =>
                moment(c.scheduleDateTime).format("YYYY-MM-DD") ===
                d.format("YYYY-MM-DD")
            );
          return (
            <Box
              cursor="pointer"
              onClick={() => d && setSelectedDate(d)}
              pos="relative"
              borderRadius={5}
              bg={isSelected ? "blue.400" : "inherit"}
              fontSize="sm"
              textAlign="center"
              fontWeight="bold"
              color={isSelected ? "white" : "gray.800"}
              p={2}
              minW={100 / weekDays.length + "%"}
              maxW={100 / weekDays.length + "%"}
            >
              <Box key={i}>{d ? d.format("DD") : ""}</Box>
              {hasClasses && d && (
                <Box
                  w={2}
                  h={2}
                  borderRadius={10}
                  bg={isSelected ? "white" : "blue.400"}
                  pos="absolute"
                  left="50%"
                  transform="translateX(-50%)"
                  bottom={"2px"}
                ></Box>
              )}
            </Box>
          );
        })}
      </Flex>
    </Box>
  );
};
