import { ButtonGroup, IconButton, Button } from "@chakra-ui/button";
import { AddIcon, SearchIcon, SmallAddIcon } from "@chakra-ui/icons";
import {
  VStack,
  HStack,
  Box,
  Text,
  Flex,
  Spacer,
  Stack,
  Heading,
} from "@chakra-ui/layout";
import { Tooltip } from "@chakra-ui/tooltip";
import React, { useEffect, useState, useRef, useCallback } from "react";
import { BsFilter } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router";
import { STATUS } from "../../App/Constants";
import { ErrorChecker } from "../../Components/ErrorChecker";
import {
  Checkbox,
  Image,
  Circle,
  Divider,
  Input,
  Tag,
  TagLabel,
  Tabs,
  TabList,
  Tab,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  Textarea,
} from "@chakra-ui/react";
import {
  AiOutlineDislike,
  AiOutlineLike,
  AiFillLike,
  AiFillDislike,
  AiFillHdd,
  AiOutlineUsergroupAdd,
} from "react-icons/ai";
import {
  getSingleForumAction,
  topicReactAction,
  getSubTopicForumsAction,
  resetModalStatus,
} from "../../redux/reducers/discussion";
import { GoComment } from "react-icons/go";
import { Comments } from "../VideoPortal/Comments";
import { AddNewForumModal } from "../../Components/AddNewForumModal";
import _ from "lodash";

import { addCommentAction } from "../../redux/reducers/courses";
import Pagination from "@choc-ui/paginator";
import { DiscussionComments } from "./DiscussionComments";
import { SectionHeader } from "../../Components/SectionHeader";
import { ButtonX } from "../../Components/ButtonX";

export const SingleForumComponent = (props) => {
  const dispatch = useDispatch();
  const params = useParams();
  const history = useHistory();

  let [allNestedCmnts, changeNestedCmnts] = useState([]);
  const [userComment, changeComment] = useState("");
  const [attachment, changeAttachment] = useState({ file: "", fileType: "" });
  const [replyComment, setReplyCmnt] = useState();
  const [bottomView, changeBottomView] = useState("Topic");
  const [addForumModal, changeAddForumModal] = useState(false);

  const {
    currentForum,
    topicReactStatus,
    user,
    addCommentStatus,
    commentsList,
    getCommentsStatus,
    removeCmntStatus,
    addLikeStatus,
    commentRepliesList,
    getRepliesStatus,
    updateCommentStatus,
    discussionData,
  } = useSelector((state) => ({
    currentForum: state.discussion?.currentForum || null,
    addCommentStatus: state.course.addCommentStatus,
    commentsList: state.course.commentsList,
    getCommentsStatus: state.course.getCommentsStatus,
    user: state.user,
    removeCmntStatus: state.course.removeCmntStatus,
    addLikeStatus: state.course.addLikeStatus,
    commentRepliesList: state.course.commentRepliesList,
    getRepliesStatus: state.course.getRepliesStatus,
    updateCommentStatus: state.course.updateCommentStatus,
    discussionData: state.discussion,
    topicReactStatus: state.discussion?.topicReactStatus,
  }));

  useEffect(() => {
    dispatch(getSingleForumAction({ topicId: params?.id }));
  }, [dispatch, params?.id]);

  useEffect(() => {
    if (addCommentStatus == STATUS.SUCCESS) {
      changeComment("");
      changeAttachment({ file: "", fileType: "" });
    }
  }, [addCommentStatus]);

  const toTree = useCallback((data, pid = null) => {
    return data.reduce((r, e) => {
      if (e.parentComment?._id === pid) {
        const obj = { ...e };
        const children = toTree(data, e._id);
        if (children.length) obj.children = children;
        r.push(obj);
      }
      return r;
    }, []);
  }, []);

  useEffect(() => {
    if (discussionData.addNewForumStatus === STATUS.SUCCESS) {
      changeAddForumModal(false);
      dispatch(resetModalStatus());
    }
  }, [discussionData.addNewForumStatus, dispatch]);

  useEffect(() => {
    if (getCommentsStatus == STATUS.SUCCESS && commentsList) {
      if (
        getCommentsStatus == STATUS.SUCCESS ||
        getRepliesStatus == STATUS.SUCCESS ||
        addCommentStatus == STATUS.SUCCESS ||
        updateCommentStatus == STATUS.SUCCESS ||
        removeCmntStatus == STATUS.SUCCESS ||
        addLikeStatus == STATUS.SUCCESS
      ) {
        let data = commentsList ? commentsList.docs : [];
        changeNestedCmnts(_.orderBy(toTree(data), ["createdAt"], ["desc"]));
      }
    }
  }, [
    getCommentsStatus,
    getRepliesStatus,
    addCommentStatus,
    commentsList,
    updateCommentStatus,
    removeCmntStatus,
    addLikeStatus,
    toTree,
  ]);

  const likeVideo = () => {
    let data = { topicId: currentForum._id };
    dispatch(topicReactAction(data));
  };

  const _changeComment = (e) => {
    changeComment(e.target.value);
  };

  const _addAttachment = (e) => {
    let file = e.target.files[0];
    let fileType;

    if (file.type.split("/")[0] == "image") {
      fileType = "images";
    } else if (file.type.split("/")[0] == "video") {
      fileType = "videos";
    } else if (file.type.split("/")[0] == "audio") {
      fileType = "audios";
    } else {
      fileType = "documents";
    }

    changeAttachment({ file: e.target.files[0], fileType: fileType });
  };

  const submitComment = () => {
    if (attachment.file) {
      let item = {
        comment: userComment,
        itemModel: "Topic",
        itemId: currentForum._id,
        type: attachment.fileType,
        upload: attachment.file,
      };
      let form_data = new FormData();

      for (let key in item) {
        form_data.append(key, item[key]);
      }
      dispatch(addCommentAction(form_data));
    } else {
      dispatch(
        addCommentAction({
          comment: userComment,
          itemModel: "Topic",
          itemId: currentForum._id,
        })
      );
    }
  };

  const clearComment = () => {
    changeComment("");
    changeAttachment({ file: "", fileType: "" });
  };

  const changeSingleForm = (sub) => {
    history.push("/dashboard/community-discussion/" + sub._id);
  };

  const changePage = (e) => {
    dispatch(getSingleForumAction({ topicId: params?.id, limit: 10, page: e }));
  };

  const hiddenFileInput = React.useRef(null);

  const handleClick = (event) => {
    hiddenFileInput.current.click();
  };

  const handleChange = (event) => {
    _addAttachment(event);
  };

  useEffect(() => {
    if (
      discussionData.getSingleForumStatus === STATUS.SUCCESS &&
      currentForum?.parentTopic
    ) {
      changeBottomView("Chat");
    } else {
      changeBottomView("Topic");
    }
  }, [currentForum?.parentTopic, discussionData.getSingleForumStatus]);

  const localData =
    typeof window !== "undefined" && localStorage.getItem("discussionRoute")
      ? JSON.parse(localStorage.getItem("discussionRoute"))
      : [];

  let breadcrumbs = [
    {title:'Home', link:'/'},
    {title:'Discussion Community', link:'/dashboard/community-discussion'},
    ...localData.map(d => ({title:d.topic, link:'/dashboard/community-discussion/'+d._id}))
  ]
  return (
    <Box pos="relative">
      <SectionHeader title='Discussion Community' breadcrumbs={breadcrumbs}/>
      {/* <Box>
        <Breadcrumb separator="/">
          <BreadcrumbItem>
            <BreadcrumbLink
              onClick={() => history.push("/")}
            >
              Home
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink
              onClick={() => history.push("/dashboard/community-discussion")}
            >
              Discussion Community
            </BreadcrumbLink>
          </BreadcrumbItem>
          {_.map(localData, (d) => {
            return (
              <BreadcrumbItem style={{ cursor: "pointer" }} key={d._id}>
                <BreadcrumbLink onClick={() => history.push(d._id)}>
                  {d.topic}
                </BreadcrumbLink>
              </BreadcrumbItem>
            );
          })}
        </Breadcrumb>
      </Box> */}
      {currentForum ? (
        <>
          <ErrorChecker size="md" status={discussionData.getSingleForumStatus}>
            {discussionData.getSingleForumStatus === STATUS.SUCCESS ? (
              <HStack w="100%" marginTop={3} spacing={6} alignItems="stretch">
                <Box
                  w="100%"
                  p={6}
                  bg="white"
                  borderRadius="12px"
                  boxShadow="rgba(149, 157, 165, 0.1) 0px 4px 12px"
                >
                  <HStack justifyContent='space-between'>
                    <Heading fontSize="md">{currentForum?.topic}</Heading>
                    {bottomView === "Topic" ?
                      <ButtonX size='sm' leftIcon={<AddIcon/>} 
                        onClick={() => changeAddForumModal(true)}
                      >
                          Add New Topic
                      </ButtonX> : null
                    }
                  </HStack>
                  <Text mt={2}>{currentForum?.body}</Text>
                  <Box>
                   
                  </Box>
                  <br />
                  <Box>
                    <Flex>
                    
                    </Flex>
                  </Box>
                  {bottomView === "Topic" ? (
                    <Box
                      style={{
                        backgroundColor: "white",
                        margin: "10px",
                        padding: "10px",
                        borderRadius: "10px",
                        border: "1px solid #70707022",
                      }}
                    >
                      {currentForum?.subTopics?.docs?.length === 0
                        ? "No Sub-Topics Added."
                        : null}
                      {_.map(currentForum?.subTopics?.docs, (sub, index) => {
                        return (
                          <div onClick={() => changeSingleForm(sub)}>
                            <HStack
                              w="100%"
                              my={3}
                              alignItems="stretch"
                              p={2}
                              cursor="pointer"
                            >
                              <Box w="6%">
                                <div>
                                  <Circle
                                    size="40px"
                                    bg="#EBF3FF"
                                    color="text.300"
                                  >
                                    T{index + 1}
                                  </Circle>
                                </div>
                              </Box>
                              <Box w="94%">
                                <div>
                                  <b>{sub?.topic}</b>
                                </div>
                                <div
                                  style={{ color: "#24A061", fontSize: "12pt" }}
                                >
                                  {sub?.body}
                                </div>
                              </Box>
                            </HStack>
                            {index + 1 ===
                            currentForum.subTopics.docs.length ? null : (
                              <Divider />
                            )}
                          </div>
                        );
                      })}
                      <div>
                        {currentForum?.subTopics?.docs.length ? (
                          <HStack align="center">
                            {currentForum?.subTopics?.pages === 1 ? null : (
                              <Pagination
                                current={currentForum?.subTopics?.page}
                                total={currentForum?.subTopics?.total}
                                pageSize={currentForum?.subTopics?.limit}
                                onChange={(page) => changePage(page)}
                                paginationProps={{
                                  display: "flex",
                                  pos: "absolute",
                                  left: "50%",
                                  transform: "translateX(-50%)",
                                }}
                                colorScheme="blue"
                              />
                            )}

                            <br />
                          </HStack>
                        ) : null}
                      </div>
                    </Box>
                  ) : currentForum?.parentTopic ? (
                    <Box
                      style={{
                        backgroundColor: "white",
                        margin: "10px",
                        padding: "10px",
                        borderRadius: "10px",
                      }}
                    >
                      <br />
                      <Box my={2}>
                        {/* <Flex style={{alignItems:'flex-start'}}>
                                                <div style={{border: '1px solid #707070A7', borderStyle: 'dashed', padding: '10px'}}>
        		                                	<div style={{textAlign: 'center'}} onClick={handleClick}>
                                                        {attachment.file ? 
                                                            <span>
                                                                {attachment.file.name}
                                                            </span>   
                                                        : 
                                                            <span><SmallAddIcon boxSize={8}/></span>
                                                        }
                                                    </div>
                                                    <input type="file"
                                                        ref={hiddenFileInput}
                                                        onChange={handleChange}
                                                        style={{display:'none'}} 
                                                    /> 
        		                                </div>
        		                                <Textarea ml={3} variant="filled" noOfLines={2} alignSelf="stretch" value={userComment} onChange={_changeComment} placeholder='Add a public comment...'/>

                                                </Flex>
        		                                <br/>
        		                                <HStack spacing={4} my={2} justifyContent='flex-end' width='100%'>
        		                                    <Button variant='outline' size='sm' onClick={clearComment}  colorScheme='blue'>CANCEL</Button>
        		                                    <Button variant="solid" size='sm' isLoading={addCommentStatus == STATUS.FETCHING && !replyComment} onClick={submitComment}  colorScheme='blue'>COMMENT</Button>
        		                                </HStack> */}
                        <br />
                        {currentForum.commentsAllowed ?
                          <DiscussionComments itemId={currentForum._id} />
                          :
                          <Box borderRadius={4} padding={4} background='#F4F6F7'>
                            <Text color='#909090'>Comments are turned off</Text>
                          </Box>
                        }
                        {/* <Comments type='Topic' currentContent={currentForum}/> */}
                      </Box>
                    </Box>
                  ) : null}
                </Box>
                {addForumModal ? (
                  <AddNewForumModal
                    visible={addForumModal}
                    closeModal={() => changeAddForumModal(false)}
                    parentId={params?.id}
                  />
                ) : null}
              </HStack>
            ) : null}
          </ErrorChecker>
        </>
      ) : null}
    </Box>
  );
};
