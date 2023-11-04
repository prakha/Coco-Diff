import { WarningIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Center,
  Flex,
  FormControl,
  HStack,
  Spinner,
  Text,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import _, { find } from "lodash";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { BsStarFill } from "react-icons/bs";
import { Redirect, useHistory, useLocation } from "react-router-dom";
import { useIsAuthenticated } from "../../App/Context";
import { useLoginModal } from "../../App/useLoginModal";
import { BaseURL } from "../../BaseUrl";
import { CommonHeader, SIGNIN_MODAL_TYPE } from "../../Components/CommonHeader";
import { STATUS } from "../../Constants";
import { apiClient } from "../../services/api";

const stars = [0, 1, 2, 3, 4];

export default function Survey(props) {
  const search = useLocation().search;
  const survey = new URLSearchParams(search).get("survey");

  // useLayoutEffect(() => {
  //     const tawk = Tawk_API;
  //     tawk?.hideWidget?.()
  // }, [])

  const isAuth = useIsAuthenticated();
  const { openLoginModal } = useLoginModal();

  useEffect(() => {
    if (!isAuth) {
      openLoginModal(SIGNIN_MODAL_TYPE.SIGNIN);
    }
  }, []);

  return (
    <Box>
      <CommonHeader />
      {isAuth ? (
        <SurveyComponent survey={survey} />
      ) : (
        <Box>
          <Text>Sign In to continue</Text>
        </Box>
      )}
    </Box>
  );
}

export const SurveyComponent = ({ survey, app = false, closeWindow }) => {
  const [getSurvey, setGetSurvey] = useState(STATUS.NOT_STARTED);
  const [getSurveyTopic, setGetSurveyTopic] = useState(STATUS.NOT_STARTED);

  const [surveyData, setSurveyData] = useState();
  const [topicsData, setTopicsData] = useState([]);

  const toast = useToast();
  const history = useHistory();

  const [error, setError] = useState(false);

  useEffect(() => {
    const getSurveyData = async () => {
      setError(false);
      setGetSurvey(STATUS.FETCHING);

      const res = await apiClient.get(BaseURL + "survey?surveyId=" + survey);

      if (res.ok) {
        setSurveyData(res.data);
        setGetSurvey(STATUS.SUCCESS);
      } else {
        toast({
          status: "info",
          title: "Get data error",
          description: "please try again later",
          position: "top-right",
          duration: 2000,
        });
        setError("Could not load survey data, try again");
      }
    };

    if (survey) {
      getSurveyData();
    }
  }, [survey]);

  useEffect(() => {
    const getTopicsData = async () => {
      setGetSurveyTopic(STATUS.FETCHING);

      const res = await apiClient.get(
        BaseURL + "survey/topic/all?surveyId=" + surveyData?._id
      );
      if (res.ok) {
        setTopicsData(res.data);
        setGetSurveyTopic(STATUS.SUCCESS);
      } else {
        setError("Could not load topic data");
      }
    };

    if (surveyData) {
      getTopicsData();
    }
  }, [surveyData]);

  if (error) {
    return (
      <Flex justifyContent={"center"}>
        <Flex direction={"column"} alignItems="center" p={20}>
          <Text my={10}>{error}</Text>
          <Button
            onClick={() => {
              if (app) {
                closeWindow();
              }
              window.open(window.location.origin, "_self");
            }}
          >
            Go to home
          </Button>
        </Flex>
      </Flex>
    );
  }

  if (getSurveyTopic === STATUS.SUCCESS && getSurvey === STATUS.SUCCESS) {
    if (surveyData) {
      return (
        <SurveyDetails
          survey={surveyData}
          surveyTopics={topicsData}
          app={app}
          closeWindow={closeWindow}
        />
      );
    } else {
      return <Redirect to="/" />;
    }
  } else return <Spinner />;
};

const SurveyDetails = ({ survey, surveyTopics, app, closeWindow }) => {
  const [successSubmit, setSuccessSubmit] = useState(STATUS.NOT_STARTED);
  const [requireAlert, showRequireAlert] = useState(null);
  const handleSurveySubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    var object = {};
    formData.forEach(function (value, key) {
      object[key] = value;
    });

    const data = _.map(object, (value, key) => ({
      surveyId: survey._id,
      topicId: key,
      answer: value,
    }));

    if (
      find(
        surveyTopics,
        (survey) =>
          survey.required &&
          find(data, (d) => d.topicId === survey._id && d.answer === "")
      )
    ) {
      showRequireAlert(true);
    } else {
      const submitResTopicsData = async () => {
        const res = await apiClient.post(
          BaseURL + "survey/topic/answer-multiple",
          data
        );
        if (res.ok) {
          setSuccessSubmit(STATUS.SUCCESS);
          window.ReactNativeWebView?.postMessage(
            JSON.stringify({
              type: "submit",
              message: "completed",
            })
          );
        } else {
          toast({
            status: "error",
            title: "Could not submit survey",
          });
        }
      };
      setSuccessSubmit(STATUS.FETCHING);
      submitResTopicsData();
    }
  };

  const toast = useToast();
  const history = useHistory();

  let unblock = history.block((tx) => {
    // Navigation was blocked! Let's show a confirmation dialog
    // so the user can decide if they actually want to navigate
    // away and discard changes they've made in the current page.

    if (successSubmit === STATUS.SUCCESS) {
      return true;
    } else {
      toast({
        status: "error",
        title: "Survey not completed",
        description: "You need to complete the survey.",
        position: "top-right",
        duration: 2000,
      });

      return false;
    }
  });

  return (
    <Box
      h="80vh"
      overflowY="auto"
      ml={{ base: 2, lg: 4 }}
      px={{ base: 4, md: 10, lg: 20 }}
      pt={10}
      pb={20}
      bg="white"
    >
      {!app ? (
        <Text color="brand.redAccent" fontSize="2xl">
          Feedback Survey
        </Text>
      ) : null}
      {successSubmit === STATUS.SUCCESS ? (
        <Center h="100%" w="100%">
          <Box>
            <Text>Thank you for your valuable feedback!</Text>
            {app ? (
              <Center mt={10}>
                <Button onClick={() => closeWindow()}>Go to Home</Button>
              </Center>
            ) : (
              <Center mt={10}>
                <Button onClick={() => history.replace("/")}>Go to Home</Button>
              </Center>
            )}
          </Box>
        </Center>
      ) : (
        <Box>
          {survey.teachers?.length > 0 && (
            <Box my={{ base: 10, lg: 18 }}>
              <Center>
                {/* {
                                        _.map(survey.teachers, teacher => <Box p={{ base: 3, lg: 6 }} key={teacher._id}>
                                            <Center><Avatar size={'md'} name={teacher.name} src={teacher.avatar} /></Center>
                                            <Box fontSize={{ base: 12, md: 14 }} fontWeight='bold' textAlign='center'>{teacher.name}</Box>
                                        </Box>)
                                    } */}
              </Center>
            </Box>
          )}
          <Box
            fontSize={{ base: 18, md: 24, lg: 30 }}
            color="gray.700"
            fontWeight="bold"
          >
            <Box>{survey?.title}</Box>
            <Box
              h={"4px"}
              style={{
                backgroundColor: "red",
              }}
              w="50px"
            ></Box>
          </Box>
          <Box
            fontSize={{ base: 13, md: 15, lg: 18 }}
            color="gray.700"
            textAlign={{ lg: "center" }}
          >
            {survey?.description}
          </Box>

          <Box color="gray.600" my={{ base: 8, lg: 14 }}>
            <Text fontStyle={"italic"}>
              Instruction for the feedback : on a scale of 1 - 5 ( 1 being the
              lowest and 5 being the highest) how you rate.
            </Text>
            {survey?.startDate && (
              <Flex w="100%" justify={"flex-start"} my={10} fontSize={14}>
                <Text fontWeight={"bold"} mr={2}>
                  Start at {moment(survey?.startDate).format("DD-MM-YYYY")}
                </Text>
                <Text fontWeight={"bold"}>
                  End at{" "}
                  {moment(survey?.startDate)
                    .add("days", survey.duration)
                    .format("DD-MM-YYYY")}
                </Text>
              </Flex>
            )}
          </Box>
          <form onSubmit={handleSurveySubmit}>
            <Box>
              {_.map(surveyTopics, (t, index) => (
                <FormControl isRequired={t.required}>
                  <SingleTopic
                    key={t.id}
                    index={index + 1}
                    topic={t}
                    requireAlert={requireAlert}
                  />
                </FormControl>
              ))}
            </Box>
            <Box mt={20}>
              <Center>
                <Button
                  isLoading={successSubmit === STATUS.FETCHING}
                  colorScheme="green"
                  w="full"
                  maxW="500px"
                  type="submit"
                >
                  Submit
                </Button>
              </Center>
            </Box>
          </form>
        </Box>
      )}
    </Box>
  );
};

const SingleTopic = ({ topic, index, requireAlert }) => {
  const [value, setValue] = useState("");
  return (
    <Box mt={{ base: 4, lg: 8 }}>
      <Box
        fontSize={{ base: 12, md: 15, lg: 18 }}
        color="gray.500"
        fontWeight="bold"
      >
        {index}. {topic.topicName}
      </Box>
      <Box mt={{ base: 4, lg: 8 }}>
        {topic.fieldType === "description" ? (
          <Textarea
            placeholder="answer"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        ) : (
          <>
            <StarsReview setReviewStars={setValue} reviewStarts={value} />
            {requireAlert && topic.required && value === "" ? (
              <Flex mt={2} align={"center"} color="brand.redAccent">
                <WarningIcon />
                <Text ml={1}>This field is required</Text>
              </Flex>
            ) : null}
            {/* <Input value={value} visibility="hidden" /> */}
          </>
        )}
      </Box>
      <input
        type="hidden"
        name={topic._id}
        value={value}
        required={topic.required}
      />
    </Box>
  );
};

export const StarsReview = ({ setReviewStars, reviewStarts = 1 }) => {
  const [hover, setHover] = useState(null);
  return (
    <HStack spacing={2} direction="row">
      {[...Array(5)].map((star, index) => {
        const ratingValue = index + 1;
        return (
          <Box key={"stars" + index}>
            <BsStarFill
              cursor="pointer"
              style={{ transition: "color 1000ms" }}
              size="30"
              onClick={() => setReviewStars(ratingValue)}
              color={
                ratingValue <= (hover || reviewStarts) ? "#ffc107" : "#e4e5e9"
              }
              onMouseEnter={() => setHover(ratingValue)}
              onMouseLeave={() => setHover(null)}
            />
          </Box>
        );
      })}
    </HStack>
  );
};
