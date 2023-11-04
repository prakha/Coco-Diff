import React, { useReducer, useState, useEffect } from "react";
import {
  Box,
  Button,
  HStack,
  Spacer,
  VStack,
  Text,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Input,
  Image,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  CloseButton,
  Textarea,
  Divider,
  Tag,
  IconButton,
  Tooltip,
} from "@chakra-ui/react";
import { SectionHeader } from "../../Components/SectionHeader";
import { GoLocation } from "react-icons/go";
import {
  AiOutlineMinusCircle,
  AiOutlinePaperClip,
  AiOutlinePlusCircle,
} from "react-icons/ai";
import { BiPhoneCall } from "react-icons/bi";
import bannerImage from "./helpandsupport.png";
import { useDispatch, useSelector } from "react-redux";
import {
  createTicketAction,
  requestUserTicketAction,
} from "../../redux/reducers/tickets";
import { STATUS } from "../../App/Constants";
import { ROUTES } from "../../Constants/Routes";
import { useQueryParams } from "../../utils/useQueryParams";
import { useHistory } from "react-router";
import moment from "moment";
import { IoTicketOutline } from "react-icons/io5";
import { CloseIcon } from "@chakra-ui/icons";
import _ from "lodash";
import { ButtonX } from "../../Components/ButtonX";

export const HelpAndSupport = () => {
  const dispatch = useDispatch();

  let query = useQueryParams();
  const track = query.get("tracking");
  // useEffect(()=>{
  //     dispatch(requestUserWalletAction());
  // },[])
  // const [walletData, setWalletData] = useState(null)
  // const {wallet} = useSelector(state => ({
  //     wallet:state.wallet,
  // }))

  // useEffect(()=>{
  //     if(wallet.getWalletStatus === STATUS.SUCCESS){
  //         setWalletData(wallet.wallet)
  //     }
  // },[wallet])

  // useEffect(() => {
  //   // eslint-disable-next-line no-undef
  //   // const tawk = Tawk_API;
  //   // tawk?.showWidget?.();
  //   // return () => tawk?.hideWidget?.();
  // }, []);

  return track ? (
    <Box>
      <TrackYourToken />
    </Box>
  ) : (
    <Box>
      <HelpAndSupportSection />
    </Box>
  );
};

export const HelpAndSupportSection = (props) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState("");
  const [message, setMessage] = useState("");
  const [submitButtonLoading, setSubmitButtonLoading] = useState(false);
  const [statusUpdate, setStatusUpdate] = useState(null);
  const [selectedFiles, setFiles] = useState([]);

  const { ticketStatus } = useSelector((s) => ({
    ticketStatus: s.ticket?.getTicketStatus,
  }));

  useEffect(() => {
    setSubmitButtonLoading(ticketStatus === STATUS.FETCHING);
    if (ticketStatus === STATUS.SUCCESS) {
      setSubject("");
      setCategory("");
      setMessage("");
      setFiles([]);
      document.getElementById("attachment").value = "";
      setStatusUpdate({
        status: "success",
        title: "Query Submitted Successfully",
        description: "You Can Track Your Token Now",
      });
    } else if (ticketStatus === STATUS.FAILED) {
      setStatusUpdate({
        status: "error",
        title: "Submission Failed",
        description: "Please Try Again After Some Time",
      });
    } else {
      setStatusUpdate(null);
    }
  }, [ticketStatus, setSubmitButtonLoading]);

  const _createToken = (e) => {
    e.nativeEvent.preventDefault();
    const data = {
      subject,
      category,
      message,
    };

    let formData = new FormData();
    Object.keys(data).forEach((key) => formData.append(key, data[key]));
    selectedFiles.map((file, i) => formData.append(`upload[${i}]`, file));

    dispatch(createTicketAction(formData));
  };

  const handleSelectFile = (d) => {
    setFiles((files) => [...files, ...d]);
  };

  const handleRemoveFile = (indx) => {
    let data = [...selectedFiles];
    _.remove(data, (d, i) => i === indx);
    setFiles(data);
  };

  return (
    <Box>
      <HStack>
        <SectionHeader
          title="Help &amp; Support"
          breadcrumbs={[
            { title: "Home", link: "/" },
            { title: "Help & Support", link: "#" },
          ]}
        />
        <Spacer />
        <Box>
          <Button
            leftIcon={<GoLocation />}
            bg="lightGrayBlue"
            color="#4A4C4F"
            variant="solid"
            borderRadius="999px"
            onClick={() =>
              history.push(ROUTES.HELP_AND_SUPPORT + "?tracking=true")
            }
          >
            TRACK YOUR TOKEN
          </Button>
        </Box>
      </HStack>

      <Box
        p="4rem 2rem"
        margin="2rem"
        boxShadow="lg"
        bg="white"
        borderRadius="lg"
      >
        <HStack>
          <Box width="50%">
            <VStack alignItems="flex-start">
              <Text fontSize="heading" fontWeight="bold" marginBottom="2rem">
                Write Your Query
              </Text>
              {statusUpdate ? (
                <Box>
                  <Alert status={statusUpdate.status} borderRadius="999px">
                    <AlertIcon />
                    <AlertTitle mr={2}>{statusUpdate.title}</AlertTitle>
                    <AlertDescription>
                      {statusUpdate.description}
                    </AlertDescription>
                  </Alert>
                </Box>
              ) : null}
              <form style={{ width: "100%" }} onSubmit={_createToken}>
                <FormControl id="subject" isRequired mb="20px">
                  <FormLabel>Subject</FormLabel>
                  <Input
                    type="text"
                    placeholder="Subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                  />
                </FormControl>
                <FormControl id="category" mb="20px">
                  <FormLabel>Category</FormLabel>
                  <Input
                    type="text"
                    placeholder="Category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  />
                </FormControl>
                <FormControl id="message" isRequired mb="20px">
                  <FormLabel>Message</FormLabel>
                  <Textarea
                    rows={6}
                    type="text"
                    placeholder="Message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </FormControl>
                <FormControl id="message" mb="20px">
                  <FormLabel>Attachment</FormLabel>
                  <Input
                    type="file"
                    id="attachment"
                    placeholder="Message"
                    onChange={(e) => handleSelectFile(e.target.files)}
                  />
                  {selectedFiles.length ? (
                    <VStack mt={2} align="stretch">
                      {selectedFiles.map((file, i) => (
                        <HStack key={i} my={1} justifyContent="space-between">
                          <Text fontSize="sm">{file.name}</Text>
                          <Box>
                            <Tooltip label="Remove" placement="right">
                              <IconButton
                                icon={<CloseIcon fontSize={10} />}
                                size="xs"
                                onClick={() => handleRemoveFile(i)}
                              />
                            </Tooltip>
                          </Box>
                        </HStack>
                      ))}
                    </VStack>
                  ) : null}
                </FormControl>
                <HStack justifyContent="flex-end" marginTop="1.5rem">
                  {/* <Box width="50%" display="flex" justifyContent="flex-start">
                    <Button width='60%' leftIcon={<AiOutlinePaperClip />} colorScheme='blue' variant="outline">Attachment</Button>
                  </Box> */}
                  <ButtonX
                    isLoading={ticketStatus === STATUS.FETCHING}
                    loadingText={submitButtonLoading ? "Submitting" : ""}
                    disabled={!subject || !message}
                    type="submit"
                  >
                    Submit
                  </ButtonX>
                </HStack>
              </form>
            </VStack>
          </Box>
          <Box width="50%">
            <VStack>
              <Box
                style={{
                  padding: "8px 15px",
                  borderRadius: "999px",
                  boxShadow: "sm",
                  backgroundColor: "#FFE3E2",
                }}
                as="a"
                href="tel:7869961760"
              >
                <HStack>
                  <BiPhoneCall
                    style={{
                      backgroundColor: "#EF5261",
                      borderRadius: "999px",
                      fontSize: "25px",
                      padding: "5px",
                    }}
                    color="#F6C863"
                  />
                  <Text fontSize="sm" fontWeight="bold">
                    FOR SUPPORT : 7869961760
                  </Text>
                </HStack>
              </Box>
              <Box p="2rem">
                <Image
                  src={bannerImage}
                  width="280px"
                  fallbackSrc="https://via.placeholder.com/150"
                />
              </Box>
            </VStack>
          </Box>
        </HStack>
      </Box>
      {/* <Box p="2rem" marginX="2rem" marginY="2rem" borderRadius="lg">
        <Text fontSize="heading" fontWeight="bold" marginBottom="2rem">
          Frequently Asked Questions
        </Text>
        <FAQContent />
      </Box> */}
    </Box>
  );
};

const FAQContent = () => {
  const FAQs = [
    {
      question: "Frequently asked question, frequently asked questions",
      answer:
        "A frequently asked questions (FAQ) forum is often used in articles, websites, email lists, and online forums where common questions tend to recur, for example through posts or queries by new users related to common knowledge gaps. … Since the acronym FAQ originated in textual media, its pronunciation varies.A frequently asked questions (FAQ) forum is often used in articles, websites, email lists, and online forums where common questions tend to recur, for example through posts or queries by new users related to common knowledge gaps. … Since the acronym FAQ originated in textual media, its pronunciation varies.",
    },
    {
      question: "Frequently asked question, frequently asked questions",
      answer:
        "A frequently asked questions (FAQ) forum is often used in articles, websites, email lists, and online forums where common questions tend to recur, for example through posts or queries by new users related to common knowledge gaps. … Since the acronym FAQ originated in textual media, its pronunciation varies.A frequently asked questions (FAQ) forum is often used in articles, websites, email lists, and online forums where common questions tend to recur, for example through posts or queries by new users related to common knowledge gaps. … Since the acronym FAQ originated in textual media, its pronunciation varies.",
    },
    {
      question: "Frequently asked question, frequently asked questions",
      answer:
        "A frequently asked questions (FAQ) forum is often used in articles, websites, email lists, and online forums where common questions tend to recur, for example through posts or queries by new users related to common knowledge gaps. … Since the acronym FAQ originated in textual media, its pronunciation varies.A frequently asked questions (FAQ) forum is often used in articles, websites, email lists, and online forums where common questions tend to recur, for example through posts or queries by new users related to common knowledge gaps. … Since the acronym FAQ originated in textual media, its pronunciation varies.",
    },
    {
      question: "Frequently asked question, frequently asked questions",
      answer:
        "A frequently asked questions (FAQ) forum is often used in articles, websites, email lists, and online forums where common questions tend to recur, for example through posts or queries by new users related to common knowledge gaps. … Since the acronym FAQ originated in textual media, its pronunciation varies.A frequently asked questions (FAQ) forum is often used in articles, websites, email lists, and online forums where common questions tend to recur, for example through posts or queries by new users related to common knowledge gaps. … Since the acronym FAQ originated in textual media, its pronunciation varies.",
    },
  ];

  return (
    <Accordion allowToggle>
      {FAQs.map((FAQ, i) => (
        <AccordionItem
          key={i}
          mb="1rem"
          border="2px solid #E0E0E0"
          borderRadius="md"
        >
          {({ isExpanded }) => (
            <>
              <h2>
                <AccordionButton>
                  <Box flex="1" textAlign="left">
                    <Text>{FAQ.question}</Text>
                  </Box>
                  {isExpanded ? (
                    <AiOutlineMinusCircle fontSize="heading" color="#4F8EF1" />
                  ) : (
                    <AiOutlinePlusCircle fontSize="heading" color="text.300" />
                  )}
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4}>
                <Text>{FAQ.answer}</Text>
              </AccordionPanel>
            </>
          )}
        </AccordionItem>
      ))}
    </Accordion>
  );
};

// ToDO UI
const TrackYourToken = () => {
  const history = useHistory();
  const [userTickets, setUserTickets] = useState(null);

  const dispatch = useDispatch();

  const { tickets, ticketStatus } = useSelector((s) => ({
    ticketStatus: s.ticket.getTicketRequestStatus,
    tickets: s.ticket.userTickets,
  }));

  useEffect(() => {
    dispatch(requestUserTicketAction());
  }, [dispatch]);

  useEffect(() => {
    if (ticketStatus === STATUS.SUCCESS) {
      setUserTickets(tickets);
    }
  }, [ticketStatus]);

  const handleOpenTicket = (data) => {
    history.push("ticket/" + data._id);
  };

  return (
    <Box>
      <SectionHeader
        title="Track Your Token"
        breadcrumbs={[
          { title: "Home", link: "/" },
          { title: "Help & Support", link: ROUTES.HELP_AND_SUPPORT },
          {
            title: "Track Your Token",
            link: ROUTES.HELP_AND_SUPPORT + "?tracking=true",
          },
        ]}
      />
      <Box
        boxShadow="sm"
        borderRadius="xl"
        backgroundColor="white"
        p="2rem 1rem"
      >
        {/* <Text paddingLeft="2rem" fontSize="heading" fontWeight="bold">
          Your Tokens
        </Text> */}
        {userTickets?.length ? (
          _.orderBy(userTickets, ["createdAt"], ["desc"]).map((ticket) => {
            return (
              <>
                <HStack
                  _hover={{ background: "#F4F6F7" }}
                  transition="all .3s"
                  p="1rem 2rem"
                  display="flex"
                  justifyContent="space-between"
                  align="start"
                  borderRadius="lg"
                  cursor="pointer"
                  onClick={() => handleOpenTicket(ticket)}
                >
                  <HStack alignItems="start">
                    <Box>
                      <IoTicketOutline fontSize={30} />
                    </Box>
                    <Box pl={2}>
                      <Box fontWeight="bolder" fontSize="large">
                        {ticket.subject}
                      </Box>
                      <Box fontSize="sm">{ticket.category}</Box>
                      <Box fontSize="sm" color="rgba(0,0,0,0.4)">
                        {ticket.message}
                      </Box>
                      {/* {ticket.files?.length ? <Box fontSize='xs'>Files: {ticket.files.length}</Box> : null } */}
                    </Box>
                  </HStack>
                  <HStack justifyContent="right" pl={10}>
                    <Box width="170px" textAlign="right">
                      <Text fontSize="xs" color="gray.400">
                        {ticket.createdAt
                          ? moment(ticket.createdAt).format("LLL")
                          : null}
                      </Text>
                      <br />
                      {ticket.status ? (
                        <Tag
                          variant="solid"
                          colorScheme={
                            ticket.status === "Pending" ? "blue" : "green"
                          }
                        >
                          {ticket.status}
                        </Tag>
                      ) : null}
                    </Box>
                  </HStack>
                </HStack>
                <Divider />
              </>
            );
          })
        ) : (
          <Box color="brand.secondary">Empty</Box>
        )}
      </Box>
    </Box>
  );
};
