import {
  Avatar,
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  IconButton,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Text,
  Textarea,
  Tooltip,
} from "@chakra-ui/react";
import { forEach, map, reduce, size } from "lodash";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { URIS } from "../../services/api";
import { useApiRequest } from "../../services/api/useApiRequest";
import moment from "moment";
import { AttachmentIcon, SmallAddIcon, SmallCloseIcon } from "@chakra-ui/icons";
import { GrAttachment } from "react-icons/gr";
import { isImage, isPDF } from "../../utils/Helper";
import { ButtonX } from "../../Components/ButtonX";

export const DiscussionComments = ({
  itemId,
  commentsLabel,
  itemModel = "Topic",
  includeDoubt = false,
  sortType,
  type = "discussion",
  selectedAnswer,
  showAttachment = true,
  inputStyle = "filled",
  placeholder = "Add a public comment...",
  disableReply,
  disableComment,
  courseId,
  contentId
}) => {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState();
  const [activeReplyComment, setActiveReplyComment] = useState();
  const [pagedata, setPageData] = useState();

  // useEffect(() => {
  //   if(sortType)
  //     request({ method: "GET", params: {sortBy:sortType === 'top' ? 'likes' : '', itemId, limit: 10, page:pagedata.page } });
  // }, [sortType])

  const onCompleted = useCallback((data) => {
    setComments((c) =>
      data && data.page === 1 ? data.docs : [...c, ...data?.docs]
    );
    setPageData(
      data && {
        limit: data.limit,
        page: data.page,
        pages: data.pages,
        total: data.total,
      }
    );
  }, []);

  const mappedComments = useMemo(() => {
    return reduce(
      comments,
      (last, c, i) => {
        if (c.replies && c.childComments && size(c.childComments)) {
          last.push(
            Object.assign({}, c, {
              sizecc: size(c.childComments),
            })
          );

          forEach(c.childComments, (cc) => {
            last.push(
              Object.assign({}, cc, {
                type: "child",
              })
            );
          });
        } else {
          last.push(c);
        }

        return last;
      },
      []
    );
  }, [comments]);

  const onError = useCallback((res) => {}, []);

  const { request, fetched, loading, data } = useApiRequest(URIS.GET_COMMENTS, {
    onCompleted,
    onError,
  });

  // const [files, setFiles] = useState();
  // const _clearFiles = () => {
  //   setFiles();
  // };

  const onCompletedAdd = useCallback((data) => {
    setComments((c) => {
      if (data.parentComment) {
        let final = map(c, (it) => {
          if (it._id === data.parentComment._id) {
            return Object.assign({}, it, {
              replies: data.parentComment.replies,
              childComments:
                it.childComments && Array.isArray(it.childComments)
                  ? [data, ...it.childComments]
                  : [data],
            });
          }
          return it;
        });
        return final;
      } else {
        return [data, ...c];
      }
    });
    setComment("");
    setActiveReplyComment();
  }, []);

  const onErrorAdd = useCallback((res) => {}, []);
  const { request: postCommentRequest, loading: commentLoading } =
    useApiRequest(URIS.ADD_COMMENT, {
      onCompleted: onCompletedAdd,
      onError: onErrorAdd,
    });

  const _getTopicComments = useCallback(
    (tid, page = 1) => {
      request({ method: "GET", params: { itemId: tid, limit: 10, page } });
    },
    [request]
  );

  const loadMore = useCallback(() => {
    _getTopicComments(itemId, (pagedata?.page || 0) + 1);
  }, [_getTopicComments, itemId, pagedata?.page]);

  useEffect(() => {
    _getTopicComments(itemId);
  }, [_getTopicComments, itemId]);

  const addComment = (data, attachment) => {
    const formData = new FormData();

    // if (files) {
    //   formData.append('upload', files);
    // }

    formData.append("comment", data);
    formData.append("itemModel", itemModel);
    formData.append("itemId", itemId);
    formData.append("includeDoubt", includeDoubt);

    if(contentId){
      formData.append("contentId", contentId);
    }

    if(courseId){
      formData.append("courseId", courseId);
    }

    if (attachment) {
      formData.append("upload", attachment);
    }

    if (activeReplyComment) {
      formData.append("parentComment", activeReplyComment._id);
    }

    postCommentRequest({
      method: "POST",
      headers:
        1 == 2 //files
          ? {
              contentType: "multipart",
            }
          : {},
      data: formData,
    });
  };

  const [lightboxUri, setLightBoxUri] = useState();

  const closeLightBox = () => {
    setLightBoxUri();
  };

  return (
    <Box>
      <Box pb={4}>
        {commentsLabel ? (
          <Text fontSize="sm">
            {commentsLabel} ({comments?.length || 0})
          </Text>
        ) : (
          <Text fontSize="sm">{comments?.length || 0} COMMENTS</Text>
        )}
      </Box>
      {!disableComment && (
        <CommentBox
          addComment={addComment}
          setComment={setComment}
          comment={comment}
          inputStyle={inputStyle}
          showAttachment={showAttachment}
          loading={commentLoading}
          placeholder={placeholder}
        />
      )}
      {map(mappedComments, (comment, i) => {
        return (
          <CommentItem
            disableReply={disableReply}
            setLightBoxUri={setLightBoxUri}
            key={comment._id + i}
            setComments={setComments}
            item={comment}
            index={i}
            setActiveReplyComment={setActiveReplyComment}
          />
        );
      })}
      {activeReplyComment ? (
        <AddCommentModal
          addComment={addComment}
          setComment={setComment}
          comment={comment}
          inputStyle={inputStyle}
          showAttachment={showAttachment}
          loading={commentLoading}
          activeComment={activeReplyComment}
          closeModal={() => setActiveReplyComment(false)}
          placeholder={placeholder}
        />
      ) : null}

      <Box p={2}>
        {loading ? (
          <Spinner ml={10} size="lg" />
        ) : pagedata && pagedata.page && pagedata.pages > pagedata.page ? (
          <Button variant="gray" onClick={loadMore}>
            Load More
          </Button>
        ) : comments && comments.length ? (
          <Text>No more comments. </Text>
        ) : null}
      </Box>

      {/* {
          pagedata && pagedata.page && pagedata.pages > 1 ? 
          <Pagination
                        current={pagedata.page}
                        total={pagedata.pages}
                        pageSize={pagedata.limit}
                        //onChange={(page) => changePage(page)}
                        paginationProps={{
                          display: "flex",
                          pos: "absolute",
                          left: "50%",
                          transform: "translateX(-50%)"
                        }}
                        colorScheme="blue"
                    />: null
      } */}

      <ImageViewLightBox uri={lightboxUri} onClose={closeLightBox} />
    </Box>
  );
};

export const CommentItem = ({
  item,
  setLightBoxUri,
  setComments,
  index,
  setActiveReplyComment,
  disableReply,
}) => {
  const _setActiveReplyComment = () => {
    setActiveReplyComment(item);
  };
  const onCompletedLike = useCallback(
    (data) => {
      setComments((c) =>
        map(c, (ci) => {
          const pid =
            typeof data.parentComment === "object"
              ? data.parentComment._id
              : data.parentComment;
          if (data.parentComment && ci._id === pid) {
            const childComments = map(ci.childComments, (cci) => {
              if (cci._id === data._id) {
                return data;
              }
              return cci;
            });

            return Object.assign({}, ci, {
              childComments,
            });
          }

          if (ci._id === data._id) {
            return Object.assign({}, data, {
              childComments: ci.childComments,
            });
          }
          return ci;
        })
      );
    },
    [setComments]
  );

  const onErrorLike = useCallback((res) => {}, []);

  const { request: likeComment, loadingComment } = useApiRequest(
    URIS.ADD_LIKE,
    {
      onCompleted: onCompletedLike,
      onError: onErrorLike,
    }
  );

  const _like = () => {
    likeComment({
      method: "PATCH",
      data: {
        path: item.self && item.self === "dislikes" ? "dislikes" : "likes",
        commentId: item._id,
      },
    });
  };

  const onCompletedReplies = useCallback(
    (data, resp, extraData) => {
      setComments((c) =>
        map(c, (cr) => {
          if (cr._id === extraData.commentId) {
            return Object.assign({}, cr, {
              childComments: data.docs,
            });
          }
          return cr;
        })
      );
    },
    [setComments]
  );

  const onErrorReplies = useCallback((res) => {}, []);

  const { request: commentRepliesRequest, loadingReplies } = useApiRequest(
    URIS.GET_COMMENT_REPLIES,
    {
      onCompleted: onCompletedReplies,
      onError: onErrorReplies,
    }
  );

  const _viewReplies = () => {
    commentRepliesRequest(
      {
        method: "GET",
        params: {
          commentId: item._id,
        },
      },
      {
        commentId: item._id,
      }
    );
  };

  return (
    <Flex
      py={item.parentComment ? 4 : 5}
      pl={item.parentComment ? 10 : 1}
      bg={item.parentComment ? "gray.50" : "white"}
    >
      <Avatar name={item.user?.name} size="sm" color="white" />
      <Box flex={1} ml={4}>
        <HStack spacing={2}>
          <Heading fontSize="sm">{item.user?.name}</Heading>
          <Text fontSize="xs" color="gray.500">
            {moment(item.createdAt).format("DD MMM, HH:mm")}
          </Text>
        </HStack>
        <Text>{item.comment == "undefined" ? "" : item.comment}</Text>
        {item.files && item.files.length ? (
          <Flex>
            {item.files.map((f) => {
              return (
                <FileView key={f._id} f={f} setLightBoxUri={setLightBoxUri} />
              );
            })}
          </Flex>
        ) : null}
        <Flex mt={3} fontSize={"sm"}>
          {loadingComment ? (
            <Spinner size="sm" />
          ) : (
            <Text
              color="gray.400"
              cursor="pointer"
              onClick={_like}
              _hover={{ color: "gray.500" }}
            >
              {item.self === "likes" ? "Liked" : "Like"}{" "}
            </Text>
          )}
          {item.totalLikes ? (
            <Text ml={4} color="gray.400">
              Likes {item.totalLikes}
            </Text>
          ) : null}
          {item.parentComment || disableReply ? null : (
            <Text
              ml={4}
              color="gray.400"
              cursor="pointer"
              _hover={{ color: "gray.500" }}
              onClick={_setActiveReplyComment}
            >
              Reply
            </Text>
          )}

          {item.replies && item.replies !== size(item.childComments) ? (
            <Button size="xs" variant="text" ml={4} onClick={_viewReplies}>
              <Text as="u" color="gray.500">
                View {item.replies - size(item.childComments)} Replies
              </Text>
            </Button>
          ) : null}
        </Flex>
      </Box>
    </Flex>
  );
};

const FileView = ({ f, setLightBoxUri }) => {
  const isFileImage = isImage(f.url, f.type);
  const isFilePdf = isPDF(f.url, f.type);

  return isFileImage ? (
    <Box
      cursor={"pointer"}
      onClick={() => setLightBoxUri(f.url)}
      _hover={{ bg: "gray.200" }}
    >
      <Image src={f.url} minHeight={"200px"} maxHeight={"400px"} />
    </Box>
  ) : (
    <Box
      cursor={"pointer"}
      onClick={() => window.open(f.url, "_")}
      _hover={{ bg: "gray.200" }}
    >
      <AttachmentIcon m={5} w={"30px"} h="30px" />
    </Box>
  );
};

const CommentBox = ({
  addComment,
  inputStyle,
  showAttachment,
  comment = '',
  loading,
  setComment,
  placeholder,
}) => {
  const [attachment, changeAttachment] = useState({ file: "", fileType: "" });

  const hiddenFileInput = React.useRef(null);

  const handleClick = (event) => {
    hiddenFileInput.current.click();
  };

  const handleChange = (event) => {
    _addAttachment(event);
  };

  const _addAttachment = (e) => {
    let file = e.target.files[0];
    let fileType;

    if (!file) {
      return;
    }

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

  const _changeComment = (e) => {
    setComment(e.target.value);
  };
  const clearComment = () => {
    setComment("");
    changeAttachment({ file: "", fileType: "" });
  };

  const submitComment = () => {
    let att = attachment?.file;
    changeAttachment({ file: "", fileType: "" });
    addComment(comment, att);
  };

  return (
    <Box>
      {showAttachment && attachment.file ? (
        <Flex alignItems="center" mb={2} p={2} bg="gray.50">
          <IconButton
            size="sm"
            onClick={() => {
              changeAttachment({ file: "", fileType: "" });
            }}
            icon={<SmallCloseIcon />}
          />
          <Text ml={3}>{attachment.file.name}</Text>
          <Text ml={3} fontSize="xs" color="gray.400">
            {(((attachment.file.size / 1024 / 1024) * 100) / 100).toFixed(2)} MB
          </Text>

          {/* <Image
            src={attachment}
            width="100px"
            height="100px"
            /> */}
        </Flex>
      ) : null}
      <Flex style={{ alignItems: "flex-start" }}>
        {showAttachment ? (
          <>
            <Tooltip label="attach file">
              <Box
                onClick={handleClick}
                _hover={{ color: "primary.400", fontSize: "xl" }}
                style={{
                  cursor: "pointer",
                  border: "1px solid #707070A7",
                  borderStyle: "dashed",
                  padding: "10px",
                }}
              >
                <HStack
                  justifyContent="center"
                  align="center"
                  style={{ textAlign: "center" }}
                  boxSize={8}
                >
                  <span>
                    <GrAttachment fontSize="18px" />
                  </span>
                </HStack>
                <input
                  {...{ accept: "*/*" }}
                  type="file"
                  ref={hiddenFileInput}
                  onChange={handleChange}
                  style={{ display: "none" }}
                />
              </Box>
            </Tooltip>
          </>
        ) : null}
        <Input
          ml={3}
          variant={inputStyle}
          noOfLines={2}
          alignSelf="stretch"
          value={comment}
          onChange={_changeComment}
          placeholder={placeholder}
        />
      </Flex>
      <HStack spacing={4} my={2} justifyContent="flex-end" width="100%">
        <ButtonX
          borderRadius={0}
          variant="outline"
          size="sm"
          onClick={clearComment}
        >
          CLEAR
        </ButtonX>
        <ButtonX
          borderRadius={0}
          size="sm"
          isLoading={loading}
          disabled={!comment && !attachment?.file}
          onClick={submitComment}
        >
          COMMENT
        </ButtonX>
      </HStack>
    </Box>
  );
};

const AddCommentModal = ({ activeComment, closeModal, ...rest }) => {
  return (
    <Modal
      isOpen={activeComment ? true : false}
      onClose={closeModal}
      size="4xl"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add Reply</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <CommentBox {...rest} />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

const ImageViewLightBox = ({ uri, onClose }) => {
  const [zoom, setZoom] = useState(1);

  const zoomIn = () => {
    setZoom((z) => parseFloat(z + 0.1));
  };
  const zoomOut = () => {
    setZoom((z) => parseFloat(z - 0.1));
  };

  return (
    <Modal
      size="full"
      closeOnOverlayClick={false}
      isOpen={uri ? true : false}
      onClose={onClose}
    >
      <ModalOverlay />
      <ModalContent
        style={{
          width: "100%",
          position: "relative",
          margin: 0,
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          backgroundColor: "transparent",
        }}
      >
        <ModalCloseButton />

        <Image
          //          sx={{
          //            transform:"scale("+zoom+")"
          //          }}
          maxHeight="100vh"
          maxWeight="100vh"
          src={uri}
        />
        {/* <Flex position="absolute" bottom={0} right={0}>
          <IconButton icon={<AiOutlineZoomIn />} onClick={zoomIn} />
          <Text>{zoom}</Text>
          <IconButton icon={<AiOutlineZoomOut />} onClick={zoomOut} />
        </Flex> */}
      </ModalContent>
    </Modal>
  );
};
