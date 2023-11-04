import { Button } from "@chakra-ui/button";
import { VStack, HStack, Box, Text, Flex, Spacer } from "@chakra-ui/layout";
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { STATUS } from "../../App/Constants";
import { ErrorChecker } from "../../Components/ErrorChecker";
import { InputBox } from "../../Components/InputBox";
import { Avatar, Input, FormControl, Select } from "@chakra-ui/react";
import { getQuestionDiscussAction, resetModalStatus } from "../../redux/reducers/questionDiscuss";
import { convertTime } from "../../utils/Helper";
import Pagination from "@choc-ui/paginator";
import { map } from "lodash";
import moment from "moment";
import { SectionHeader } from "../../Components/SectionHeader";
import { BsChevronRight } from "react-icons/bs";
import { AddNewForumModal } from "../../Components/AddNewForumModal";
import { AddIcon } from "@chakra-ui/icons";
import { getForumsAction } from "../../redux/reducers/discussion";
import { ButtonX } from "../../Components/ButtonX";

export const QuestionCommunityMain = (props) => {
  const dispatch = useDispatch();
  const history = useHistory();

  const [addForumModal, changeAddForumModal] = useState(false);
  const [searchData, changeSearchData] = useState();
  const [sortBy, changeSortBy] = useState(-1)

  const { questionDiscussData } = useSelector((state) => ({
    questionDiscussData: state.questionDiscuss,
  }));

  const defaultData = { community: "question", sorting:JSON.stringify({createdAt:sortBy}), limit:10, searchByText:searchData, subTopics:searchData ? true : undefined }

  useEffect(() => {
    if (questionDiscussData.addQueTopicStatus === STATUS.SUCCESS) {
      changeAddForumModal(false);
      dispatch(resetModalStatus());
    }
  }, [questionDiscussData.addQueTopicStatus, dispatch]);

  useEffect(() => {
    dispatch(getQuestionDiscussAction(defaultData));
  }, [dispatch]);

  const changeSingleForm = (id) => {
    history.push("/dashboard/community-questions/" + id);
  };

  const changePage = (e) => {
    dispatch(
      getQuestionDiscussAction({ ...defaultData, page: e })
    );
  };

  const formatedData = useMemo(() => {
    return questionDiscussData?.questionList.docs || [];
  }, [questionDiscussData?.questionList.docs]);

  const changeSearch = (e) => {
    dispatch(getQuestionDiscussAction(defaultData));
  };

  let breadcrumbs = [
    {title:'Home', link:'/'},
    {title:'Questions Community', link:'#'},
  ]

  const handleSorting = (value) => {
    changeSortBy(value.target.value)
    dispatch(getQuestionDiscussAction({...defaultData, sorting:JSON.stringify({createdAt:value.target.value})}))
  }

  return (
    <Box pos="relative">
      <SectionHeader title="Questions Community" breadcrumbs={breadcrumbs}/>
      <>
        <HStack w="100%" spacing={6} alignItems="stretch">
          <Box w={{ lg:"70%" }}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                changeSearch(searchData);
              }}
            >
              <Flex>
                 <Flex flex={1}>
                 <Input borderRadius="xl" background='white'
                    placeholder="Search topics"
                    mr={2}
                    onChange={(e) => changeSearchData(e.target.value)}
                  />
                  <ButtonX
                    type="submit"
                    onClick={() => changeSearch(searchData)}
                  >
                    Search
                  </ButtonX>
                 </Flex>
                <Box px={7}>
                  <FormControl>
                    <Select  onChange={handleSorting} background='white' value={sortBy} >
                      <option value={1}>Ascending</option>
                      <option value={-1}>Descending</option>
                    </Select>
                  </FormControl>
                </Box>
              </Flex>
            </form>
          </Box>
          {/*<Box w='30%'>
	                    <Button width="100%" leftIcon={<AiOutlineUsergroupAdd fontSize='18pt'/>} bg="primaryBlue.400" color='white' onClick={() => changeAddForumModal(true)}>
	                        Create New Community
	                    </Button>
	                </Box>*/}
        </HStack>
        <br />
        <HStack w="100%" spacing={6} alignItems="stretch">
          <ErrorChecker
            size="md"
            status={questionDiscussData.getQuestionDiscussStatus}
          >
            {questionDiscussData.getQuestionDiscussStatus == STATUS.SUCCESS ? (
              <Box
                w="100%"
                bg="white"
                borderRadius="12px"
                boxShadow="rgba(149, 157, 165, 0.1) 0px 4px 12px"
              >
                <HStack p={4} justifyContent='right'>
                  <ButtonX leftIcon={<AddIcon/>}
                    onClick={() => changeAddForumModal(true)}
                  >
                      Add New Topic
                  </ButtonX>
                </HStack>
                <VStack align="stretch" spacing={1} my={4}>
                  {map(formatedData, (forum, i) => {
                    let createdDate = moment(forum.createdAt).fromNow();
                    const isSubTopic = forum.parentTopic;
                    const isQuestion = forum.doubtQuestion?.question?.en;
                    return (
                      <Box
                        cursor="pointer"
                        borderBottom='1px solid #EBEDEF'
                        _hover={{ bg: "gray.100" }}
                        transition='all .4s'
                        /// borderRadius="md"
                        p={5}
                        onClick={() => changeSingleForm(forum._id)}
                      >
                        <HStack w="100%" spacing="lg" alignItems="stretch">
                          <Box>
                            <Avatar name={forum?.userId?.name} color="white" />
                          </Box>
                          <Box ml={3} flexGrow={1}>
                            <HStack mb={2} spacing={6} justifyContent=''>
                              {/* <Text fontSize="sm" color="primaryBlue.400">
                                {forum?.userId?.name || ""}
                              </Text>
                              &nbsp;&nbsp; */}
                              <Text fontSize="xs" color="gray.500">
                                {createdDate}
                              </Text>
                              <HStack style={{ fontSize: "14px" }}>
                                <Text >Questions:</Text> <Text color='brand.yellow' fontWeight='bold'>{forum.subTopicCount}</Text>
                              </HStack>
                            </HStack>
                            <Text fontSize="md" color="gray.900">
                              {isSubTopic ? isQuestion : forum?.topic}
                            </Text>

                            {isSubTopic ? (
                              <Text color="gray.400" fontSize="xs">
                                Click here to answer and view comments
                              </Text>
                            ) : (
                              <Text fontSize="sm" color="gray.600">
                                {forum?.body}
                              </Text>
                            )}

                            {/* <br /> */}
                            {/* <HStack w="100%" spacing={10} alignItems="stretch"> */}
                            {/* <SmallInfoBox title='Chat' color='#27A163' data={<IoIosChatbubbles fontSize='25px' style={{display: 'inline-block'}}/>}/> */}
                            {/* <SmallInfoBox title='Topics' color="primaryBlue.400" data={_.find(discussionData?.forumList.topicCounts, cou => cou._id === forum._id)?.count || '0'} /> */}
                            {/*<SmallInfoBox title='Post' color="primaryBlue.400" data={'225'}/>
									                    	<SmallInfoBox title='Freshness' color="primaryBlue.400" data={'1'}/>*/}
                            {/* </HStack> */}
                          </Box>
                          <HStack alignItems='center' pl={10}>
                            <BsChevronRight fontSize='20px'/>
                          </HStack>
                        </HStack>
                      </Box>
                    );
                  })}
                  <div>
                    {questionDiscussData?.questionList?.docs ? (
                      <HStack align="center">
                        <Pagination
                          current={questionDiscussData?.questionList?.page}
                          total={questionDiscussData?.questionList?.total}
                          pageSize={questionDiscussData?.questionList?.limit}
                          onChange={(page) => changePage(page)}
                          paginationProps={{
                            display: "flex",
                            pos: "absolute",
                            left: "50%",
                            transform: "translateX(-50%)",
                          }}
                          colorScheme="red"
                        />
                        <br />
                        <br />
                      </HStack>
                    ) : null}
                  </div>
                </VStack>
              </Box>
            ) : null}
          </ErrorChecker>
        </HStack>
        {addForumModal ? (
            <AddNewForumModal
              visible={addForumModal}
              closeModal={() => changeAddForumModal(false)}
              question
            />
          ) : null
        }
      </>
    </Box>
  );
};
