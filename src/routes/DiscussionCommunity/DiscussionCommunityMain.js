import { Button } from "@chakra-ui/button";
import { VStack, HStack, Box, Text, Flex } from "@chakra-ui/layout";
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { STATUS } from "../../App/Constants";
import { ErrorChecker } from "../../Components/ErrorChecker";
import { InputBox } from "../../Components/InputBox";
import { Avatar, Input, FormControl, FormLabel, Select } from "@chakra-ui/react";
import {
  getForumsAction,
  resetModalStatus,
} from "../../redux/reducers/discussion";
import { convertTime } from "../../utils/Helper";
import { AddNewForumModal } from "../../Components/AddNewForumModal";
import Pagination from "@choc-ui/paginator";
import _, { map } from "lodash";
import moment from "moment";
import { SectionHeader } from "../../Components/SectionHeader";
import { BsChevronCompactRight, BsChevronRight } from "react-icons/bs";
import { ButtonX } from "../../Components/ButtonX";

export const DiscussionCommunityMain = (props) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [searchData, changeSearchData] = useState();
  const [filterBy, changeFilterBy] = useState();
  const [addForumModal, changeAddForumModal] = useState(false);
  const [sortBy, changeSortBy] = useState(-1)

  const { discussionData } = useSelector((state) => ({
    discussionData: state.discussion,
  }));

  const defaultData = { community: "discussion", sorting:JSON.stringify({createdAt:sortBy}), limit:10, topic:searchData, subTopics:searchData ? true : undefined }

  useEffect(() => {
    dispatch(getForumsAction(defaultData));
  }, [dispatch]);

  useEffect(() => {
    if (discussionData.addNewForumStatus == STATUS.SUCCESS) {
      changeAddForumModal(false);
      dispatch(resetModalStatus());
    }
  }, [discussionData.addNewForumStatus, dispatch]);

  const changeSingleForm = (id) => {
    history.push("/dashboard/community-discussion/" + id);
  };

  const changePage = (e) => {
    dispatch(getForumsAction({ ...defaultData, page: e }));
  };

  const formatedData = useMemo(() => {
    return discussionData?.forumList.docs || [];
  },[discussionData?.forumList.docs]);

  const changeSearch = (e) => {
    let data = { ...defaultData, topic: e, tags: filterBy }
    if(e) data = {...data, subTopics:true}
    dispatch(getForumsAction(data))
  };

  const changeFilter = (e) => {
    changeFilterBy(e.target.value);
    dispatch(
      getForumsAction({
        ...defaultData,
        tags: e.target.value,
        topic: searchData,
      })
    );
  };
  
  const handleSorting = (value) => {
    changeSortBy(value.target.value)
    dispatch(getForumsAction({...defaultData, sorting:JSON.stringify({createdAt:value.target.value})}))
  }

  let breadcrumbs = [
    {title:'Home', link:'/'},
    {title:'Discussion Community', link:'#'},
  ]

  return (
    <Box pos="relative">
      <SectionHeader title="Discussion Community" breadcrumbs={breadcrumbs}/>
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
                  <Input background='white' borderRadius="xl" placeholder="Search topics and subtopics"
                    onChange={(e) => changeSearchData(e.target.value)}
                    mr={2}
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
                    <Select onChange={handleSorting} background='white' value={sortBy} >
                      <option value={1}>Ascending</option>
                      <option value={-1}>Descending</option>
                    </Select>
                  </FormControl>
                </Box>
              </Flex>
            </form>
            {/*<span style={{margin: '0px 5px'}}>
	                        	<InputSelectBox 
	                        		onChange={(e) => console.log('opasdasdasdasdas', e)} 
	                        		placeholder='Sort' 
	                        		icon={<BsFilter style={{display: "inline-block", fontSize: '24pt'}}/>}
	                        		data={[{title: 'option 1', value: 'option 1'}, {title: 'option 2', value: 'option 2'}, {title: 'option 3', value: 'option 3'}]}
	                        	/>
	                        </span>
	                        <span style={{margin: '0px 5px'}}>
	                        	<InputSelectBox 
	                        		onChange={(e) => changeFilter(e)}
	                        		placeholder='Filter' 
	                        		data={currentTags}
	                        		icon={<AiOutlineFilter style={{display: "inline-block", fontSize: '24pt'}}/>}
	                        		//data={[{title: 'option 1', value: 'option 1'}, {title: 'option 2', value: 'option 2'}, {title: 'option 3', value: 'option 3'}]}
	                        	/>
	                    	</span>*/}
          </Box>
        </HStack>
        <br />
        <HStack w="100%" spacing={6} alignItems="stretch">
          <ErrorChecker size="md" status={discussionData.getForumsStatus}>
            {discussionData.getForumsStatus == STATUS.SUCCESS ? (
              <Box
                w="100%"
                bg="white"
                borderRadius="md"
                boxShadow="rgba(149, 157, 165, 0.1) 0px 4px 12px"
              >
                <VStack align="stretch" spacing={1} my={4}>
                  {/* <Box p={3}>
                    <HStack w="100%" alignItems="stretch">
                      <Box w="10%">
                        <b>All Forums</b>
                      </Box>
                    </HStack>
                  </Box> */}
                  {map(formatedData, (forum, i) => {
                    let createdDate = moment(forum.createdAt).fromNow();
                    return (
                      <Box
                        cursor="pointer"
                        // bg="gray.50"
                        borderBottom='1px solid #EBEDEF'
                        _hover={{bg:"gray.100"}}
                        transition='all .4s'
                       /// borderRadius="md"
                        p={5}
                        onClick={() => changeSingleForm(forum._id)}
                      >
                        <HStack w="100%" spacing="lg" alignItems="stretch">
                          <Box>
                            <Avatar name={forum?.userId?.name} color="white" />
                          </Box>
                          <Box flexGrow={1} ml={3}>
                            <HStack mb={2} spacing={6} justifyContent=''>                            
                              <Text fontSize="xs" color="gray.500">
                                {createdDate}
                              </Text>
                              <HStack fontSize='sm'>
                                <Text>Topics:</Text> <Text color='brand.yellow' fontWeight='bold'>{forum.subTopicCount}</Text>
                              </HStack>
                            </HStack>
                            <Text fontSize="md">
                              {forum?.topic}
                            </Text>
                            <Text fontSize="sm" color="gray.600">
                              {forum?.body}
                            </Text>
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
                    {discussionData?.forumList?.docs ? (
                      <HStack align="center">
                        {/*<ReactPaginate previousLabel={"Prev"} nextLabel={"Next"} breakLabel={"..."} breakClassName={"break-me"}
							                        pageCount={discussionData?.forumList?.pages} marginPagesDisplayed={2} pageRangeDisplayed={5}
							                        onPageChange={changePage} containerClassName={"pagination"} subContainerClassName={"pages pagination"}
							                        activeClassName={"active"} previousClassName={'prevButton'} nextClassName={'nexButton'}
							                    />*/}
                        <Pagination
                          current={discussionData?.forumList?.page}
                          total={discussionData?.forumList?.total}
                          pageSize={discussionData?.forumList?.limit}
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
          {/*<Box w='30%' bg='white' p={3} borderRadius='12px' boxShadow='rgba(149, 157, 165, 0.1) 0px 4px 12px'>
	                    <Text fontSize='17pt' pl={1} fontWeight='bold'>Exam Categories</Text>
	                    <Box>
	                		<Stack pl={3} spacing={1}>
	                    		<Checkbox defaultIsChecked>Checkbox</Checkbox>
	                		</Stack>
	                    </Box>
	                </Box>*/}
        </HStack>
        {addForumModal ? (
          <AddNewForumModal
            visible={addForumModal}
            closeModal={() => changeAddForumModal(false)}
          />
        ) : null}
      </>
    </Box>
  );
};

export const SmallInfoBox = ({ title, data, color }) => {
  return (
    <Box
      bg="white"
      boxShadow="rgba(149, 157, 165, 0.1) 0px 4px 12px"
      style={{ minWidth: "95px", height: "30px" }}
    >
      <div
        style={{
          padding: "5px 0px 0px 5px",
          height: "100%",
          display: "inline-block",
        }}
      >
        &nbsp;&nbsp;{title}&nbsp;&nbsp;
      </div>
      <div
        style={{
          backgroundColor: color,
          textAlign: "center",
          color: "white",
          padding: "4px 0px 0px 3px",
          float: "right",
          height: "100%",
          borderRadius: "60px 0px 0px 60px",
          display: "inline-block",
          width: "38px",
        }}
      >
        {data}
      </div>
    </Box>
  );
};
