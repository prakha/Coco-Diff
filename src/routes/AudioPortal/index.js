import { Button, IconButton } from "@chakra-ui/button";
import { SearchIcon } from "@chakra-ui/icons";
import { Input } from "@chakra-ui/input";
import { Divider, Heading, HStack, Text, VStack } from "@chakra-ui/layout";
import { Box } from "@chakra-ui/layout";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation, useParams } from "react-router";
import {
  getContentReactionAction,
  getPublicContentAction,
  getSubjContentAction,
  reactContentAction,
} from "../../redux/reducers/courses";
import { AiFillDislike, AiFillLike } from "react-icons/ai";
import { ErrorChecker } from "../../Components/ErrorChecker";
import { STATUS } from "../../App/Constants";
import _ from "lodash";
import { InputBox } from "../../Components/InputBox";
import { BsBookmark, BsFillBookmarkFill, BsMusicNote } from "react-icons/bs";
import { CustomAudioPlayer } from "../../Components/AudioPlayer";
import { Image } from "@chakra-ui/image";
import { getLibraryAction } from "../../redux/reducers/library";
import { getBkmrkFilesAction, getBookmarkAction, removeFromBkmrkAction } from "../../redux/reducers/bookmarks";
import { DiscussionComments } from "../DiscussionCommunity/DiscussionComments";
import { HiThumbDown, HiThumbUp } from "react-icons/hi";
import { SectionHeader } from "../../Components/SectionHeader";
import { bilingualText } from "../../utils/Helper";
import { audioIcon, checkLibContent } from "../Contents/AudioFiles";
import { Tooltip } from "@chakra-ui/tooltip";
import { MoveToBookmarkModal } from "../Contents/MoveToBookmarkModal";
import { BiNotepad } from "react-icons/bi";
import { NotesModal } from "../../Components/NotesModal";

export const AudioPortal = () => {
  const dispatch = useDispatch();
  const params = useParams();
  const location = useLocation();

  const {user, courseList, getPkgContentsStatus, getContentReactionStatus, contentReactions, reactContentStatus,
    getLibraryStatus, getPublicContentStatus, publicContent, libraryContent, getBookmarkStatus, bookmarkContent,
    packagesList, subjectContent, removeFromBkmrkStatus, addToBookmarkStatus, getBkmrkFilesStatus, bkmrkFiles
  } = useSelector((state) => ({
    courseList: state.package.packageContents?.courses,
    getPkgContentsStatus: state.package.getPkgContentsStatus,
    user: state.user,
    getContentReactionStatus: state.course.getContentReactionStatus,
    contentReactions: state.course.contentReactions,
    reactContentStatus: state.course.reactContentStatus,
    getLibraryStatus: state.library.getLibraryStatus,
    libraryContent: state.library.libraryContent,
    getBookmarkStatus: state.bookmark.getBookmarkStatus,
    bookmarkContent: state.bookmark.bookmarkContent,
    getPublicContentStatus: state.course.getPublicContentStatus,
    publicContent: state.course.publicContent,
    packagesList: state.package.packagesList,
    subjectContent: {data: state.course.subjectContent, status: state.course.getSubjContentStatus,},
    removeFromBkmrkStatus:state.bookmark.removeFromBkmrkStatus,
    addToBookmarkStatus:state.bookmark.addToBookmarkStatus,
    getBkmrkFilesStatus:state.bookmark.getBkmrkFilesStatus,
    bkmrkFiles:state.bookmark.bkmrkFiles,
  }));

  const [currentSubj, setCurrentSubj] = useState();
  let [currentAudio, setCurrentAudio] = useState();
  const [currentCourse, setCurrentCourse] = useState();
  const [suggestions, setSuggestions] = useState([]);

  const urlSearchParams = new URLSearchParams(location.search);
  let courseId = urlSearchParams.get("courseId");
  let subjectId = urlSearchParams.get("subjectId");
  let libraryId = urlSearchParams.get("libraryId");
  let fileId = urlSearchParams.get("fileId");
  let folderId =
    urlSearchParams.get("folderId") == "undefined" ||
    urlSearchParams.get("folderId") == "null"
      ? null
      : urlSearchParams.get("folderId");
  let libType = urlSearchParams.get("libType");
  let demoCourseId = urlSearchParams.get("demoCourseId");
  let packageId = urlSearchParams.get("packageId");

  const checkSubjectContent = (id) => {
    if (subjectContent?.data?.length) {
      return _.findIndex(subjectContent.data, (s) => s.contentId === id) != -1;
    }
  }

  useEffect(() => {
      if(getBkmrkFilesStatus != STATUS.SUCCESS)
          dispatch(getBkmrkFilesAction({libType: 'Bookmark'}))
  }, [getBkmrkFilesStatus])

  useEffect(() => {
    if (subjectId && courseId) {
      if (courseList?.length) {
        let crc = _.find(courseList, (c) => c._id == courseId);
        setCurrentSubj(_.find(crc.subjects, (s) => s.content._id == subjectId));
        setCurrentCourse(crc);
      }

      if (!checkSubjectContent(subjectId))
        dispatch(getSubjContentAction({ id: subjectId }));
    } else if (libType) {
      if (libType == "Library")
        dispatch(getLibraryAction({ folderId: folderId }));
      else 
        dispatch(getBookmarkAction({ folderId: folderId }));
    } else if (demoCourseId) {
      dispatch(getPublicContentAction({ courseIds: [demoCourseId] }));
    }
  }, [
    courseId,
    folderId,
    courseList,
    subjectId,
    libType,
    dispatch,
    demoCourseId,
  ]);

  useEffect(() => {
    let audio = null;
    if (subjectId && courseId && subjectContent?.data?.length) {
      let subj = _.find(subjectContent.data, (d) => d.contentId == subjectId);
      audio =
        subj && subj.audios?.length
          ? _.find(subj.audios, (v) => v.data?._id == params.audioId)
          : null;
      setSuggestions(subj?.audios);
      setCurrentAudio(audio);
    }
  }, [subjectId, params.audioId, courseId, subjectContent]);

  useEffect(() => {
    let audio = null;
    if (
      libType &&
      (getLibraryStatus == STATUS.SUCCESS ||
        getBookmarkStatus == STATUS.SUCCESS)
    ) {
      let data = libType == "Library" ? libraryContent : bookmarkContent;
      audio =
        data?.files?.length &&
        _.findIndex(data.files, (v) => v._id == fileId) != -1
          ? _.find(data.files, (v) => v._id == fileId)
          : null;
      audio = { ...audio, data: audio?.fileDataId };
      setCurrentAudio(audio);
    }
  }, [getLibraryStatus, getBookmarkStatus, libType, fileId, libraryContent, bookmarkContent,]);

  useEffect(() => {
    let audio = null;
    if (demoCourseId && subjectId && getPublicContentStatus === STATUS.SUCCESS) {
      let subj = publicContent.subjects?.length ? _.find(publicContent.subjects, (s) => s.content === subjectId) : null;

      audio = subj?.audios?.length
        ? _.find(subj.audios, (v) => v.data?._id == params.audioId)
        : null;
      
        setCurrentAudio(audio);
    }
  }, [params.audioId, demoCourseId, subjectId, getPublicContentStatus, publicContent]);

  // useEffect(() => {
  //     let audio = null
  //     if(subjectId && courseId && subjectContent?.data?.length){
  //         let subj = _.find(subjectContent.data,d => d.contentId == subjectId)
  //         audio = subj && subj.audios?.length ? _.find(subj.audios,v => v._id == params.audioId) : null
  //         setSuggestions(subj.audios)

  //     }else if(libType && (getLibraryStatus == STATUS.SUCCESS || getBookmarkStatus == STATUS.SUCCESS) ){
  //         let data = libType == 'Library' ? libraryContent : bookmarkContent
  //         audio = data?.files?.length && _.findIndex(data.files,v => v._id == fileId) != -1 ?_.find(data.files,v => v._id == fileId) : null
  //         audio = {...audio, data:audio?.fileDataId}
  //     }else if(demoCourseId && subjectId && getPublicContentStatus === STATUS.SUCCESS){
  //         let subj = publicContent.subjects?.length ? _.find(publicContent.subjects,s => s.content === subjectId) : null
  //         audio = subj?.audios?.length ? _.find(subj.audios,v => v._id == params.audioId) : null
  //     }
  //     console.log('audio', audio, demoCourseId , subjectId , getPublicContentStatus === STATUS.SUCCESS)
  //     setCurrentAudio(audio)
  // }, [currentSubj, getLibraryStatus, getBookmarkStatus, subjectId, folderId, params.audioId, libType, libraryContent, bookmarkContent, fileId, getPublicContentStatus, publicContent])

  useEffect(() => {
    if (currentAudio) {
      dispatch(
        getContentReactionAction({
          contentId: currentAudio?._id,
          itemId: courseId || demoCourseId || currentAudio.courseId,
        })
      );
    }
  }, [courseId, currentAudio, dispatch]);

  let likedStatus = contentReactions && _.findIndex(contentReactions.likes, (l) => l._id == user.user._id) != -1;
  let dislikedStatus = contentReactions && _.findIndex(contentReactions.dislikes, (l) => l._id == user.user._id) != -1;

  const likeAudio = () => {
    let data = {
      itemId: courseId || demoCourseId || currentAudio.courseId,
      contentId: currentAudio._id,
      onModel: "Course",
      path: "likes",
      contentModel: "Audio",
    };
    if (likedStatus) {
      dispatch(reactContentAction({ ...data, remove: true }));
    } else {
      dispatch(reactContentAction(data));
    }
  };

  const dislikeAudio = () => {
    let data = {
      itemId: courseId || demoCourseId || currentAudio.courseId,
      contentId: currentAudio._id,
      onModel: "Course",
      path: "dislikes",
      contentModel: "Audio",
    };
    if (dislikedStatus) dispatch(reactContentAction({ ...data, remove: true }));
    else {
      dispatch(reactContentAction(data));
    }
  };

  const [audioPlaying, setAudioPlaying] = useState();

  const onAudioPlay = (e) => {
    if (e.type === "play") setAudioPlaying(true);
    else setAudioPlaying(false);
  };

  const [breadcrumbs, setBreadCrumbs] = useState([]);

  useEffect(() => {
    if (currentCourse && currentSubj && currentAudio) {
      let data = [
        { title: "Home", link: "/" },
        { title: "Courses", link: "/dashboard/courses" },
        {
          title: currentCourse.name,
          link:
            "/dashboard/courses/" +
            currentCourse._id +
            "/audios/" +
            currentSubj.content._id,
        },
        { title: currentAudio?.name },
      ];
      setBreadCrumbs(data);
    } else if (demoCourseId && getPublicContentStatus === STATUS.SUCCESS) {
      let pkg = _.find(packagesList, (p) => p._id === packageId);
      let data = [
        { title: "Home", link: "/" },
        {
          title: bilingualText(pkg ? pkg?.name : {}),
          link: "/package?id=" + packageId,
        },
        {
          title: publicContent.name,
          link: `/demo-content/${packageId}/${demoCourseId}/${subjectId}`,
        },
        { title: currentAudio?.name },
      ];
      setBreadCrumbs(data);
    }
  }, [currentCourse, currentSubj, currentAudio]);

  useEffect(() => {
    if (currentAudio && (libraryContent || bookmarkContent)) {
      let data = [];
      if (libType == "Library") {
        data = [
          { title: "Home", link: "/" },
          { title: "Library", link: "/dashboard/Library/root/audios" },
          { title: currentAudio?.name },
        ];

        libraryContent?.folder
          ? data.splice(2, 0, {
              title: libraryContent.folder.folderName,
              link: "/dashboard/Library/" + folderId + "/audios",
            })
          : null;
      } else if (libType == "Bookmark") {
        data = [
          { title: "Home", link: "/" },
          { title: "Bookmark", link: "/dashboard/Bookmark/root/audios" },
          { title: currentAudio?.name },
        ];

        bookmarkContent?.folder
          ? data.splice(2, 0, {
              title: bookmarkContent.folder.folderName,
              link: "/dashboard/Bookmark/" + folderId + "/audios",
            })
          : null;
      }
      setBreadCrumbs(data);
    }
  }, [folderId, currentAudio, libraryContent, bookmarkContent]);

  const [moveToBookmarkModal, toggleMoveToBookmarkModal] = useState()

  const addToBookmark =() => {
      toggleMoveToBookmarkModal(moveToBookmarkModal ? null : {...currentAudio, subject:subjectId})
  }

  const removeBookmark = () => {
      let id = _.find(bkmrkFiles,f => f.fileDataId === currentAudio.data._id || f.fileDataId?._id === currentAudio.data._id)?._id
      dispatch(removeFromBkmrkAction({fileId:id}))
  }

  const [notesModal, openNotesModal] = useState()

  const handleNotesModal = () => {
      openNotesModal(!notesModal)
  }

  return (
    <Box>
      <SectionHeader title={currentAudio?.name} breadcrumbs={breadcrumbs} />
      {/* <HStack p={3} justifyContent='space-between' borderRadius='5px' bg='lightGrayBlue'>
                <HStack ml={4}>
                    <Box p={3} color={'white'} bg='white' borderRadius='50%'>
                        <BsMusicNote color='#DB4437' fontSize='26px'/>
                    </Box>
                    <Box pl={2}>
                        <Text fontSize='lg' fontWeight='bold'>View Audio</Text>
                    </Box>
                </HStack>
            </HStack>
            <br/> */}
      <ErrorChecker
        status={
          getPkgContentsStatus ||
          getLibraryStatus ||
          getPublicContentStatus ||
          subjectContent?.status
        }
      >
        <ErrorChecker status={getContentReactionStatus}>
          {(getPkgContentsStatus == STATUS.SUCCESS ||
            getLibraryStatus == STATUS.SUCCESS ||
            getPublicContentStatus === STATUS.SUCCESS ||
            subjectContent?.status === STATUS.SUCCESS) &&
          getContentReactionStatus == STATUS.SUCCESS &&
          currentAudio ? (
            <HStack align="stretch" spacing={4}>
              <Box
                bg="white"
                w="70%"
                p={5}
                pos="relative"
                boxShadow="0pt 3pt 6pt rgba(221, 230, 237, 0.6)"
              >
                <Box>
                  <HStack justifyContent="center" h="140pt" p={2}>
                    {audioPlaying ? (
                      <Image src="/images/sound.gif" w="140pt" />
                    ) : (
                      <Image src="/images/sound.png" w="140pt" />
                    )}
                  </HStack>
                  <CustomAudioPlayer
                    audio={currentAudio}
                    onPlay={onAudioPlay}
                    onPause={onAudioPlay}
                  />
                </Box>
                <br />
                <Box my={2} key={currentAudio._id}>
                  <Heading fontSize="xl">{currentAudio.name}</Heading>
                  <br />
                  <HStack justifyContent="space-between">
                    <Text color="#566573"></Text>
                    <HStack spacing={6}>
                      <Box>
                          <Tooltip label='Notes' placement='top'>
                              <IconButton onClick={handleNotesModal} icon={<BiNotepad fontSize='25px'/>} p={0} variant='ghost'/>
                          </Tooltip>
                      </Box>
                      <ErrorChecker size='sm' status={removeFromBkmrkStatus}>
                          {checkLibContent(currentAudio.data._id, bkmrkFiles) ? 
                              <Tooltip label='Remove bookmark' placement='top'>
                                  <IconButton p={0} onClick={removeBookmark} variant='ghost' isLoading={reactContentStatus == STATUS.FETCHING} 
                                      icon={<BsFillBookmarkFill cursor='pointer' fontSize='25px'/>} 
                                      size='xs'
                                  />
                              </Tooltip>
                              :
                              <Tooltip label='Bookmark' placement='top'>
                                  <IconButton p={0} onClick={addToBookmark} variant='ghost' isLoading={reactContentStatus == STATUS.FETCHING} 
                                      icon={<BsBookmark cursor='pointer' fontSize='25px'/>} 
                                      size='xs'
                                  />
                              </Tooltip>
                          }
                      </ErrorChecker>
                      <HStack>
                        <IconButton
                          onClick={likeAudio}
                          variant="ghost"
                          isLoading={reactContentStatus == STATUS.FETCHING}
                          icon={
                            <HiThumbUp
                              cursor="pointer"
                              fontSize="25px"
                              color={
                                contentReactions?.self == "likes"
                                  ? "#3498DB"
                                  : "#767676"
                              }
                            />
                          }
                          size="sm"
                        />
                        <Text>{contentReactions?.totalLikes || 0}</Text>
                      </HStack>
                      <HStack>
                        <IconButton
                          onClick={dislikeAudio}
                          variant="ghost"
                          isLoading={reactContentStatus == STATUS.FETCHING}
                          icon={
                            <HiThumbDown
                              cursor="pointer"
                              fontSize="25px"
                              color={
                                contentReactions?.self == "dislikes"
                                  ? "#3498DB"
                                  : "#767676"
                              }
                            />
                          }
                          size="sm"
                        />
                        <Text>{contentReactions?.totalDislikes || 0}</Text>
                      </HStack>
                      {/* <HStack><FaShare fontSize='22px'/> <Text>SHARE</Text></HStack> */}
                    </HStack>
                  </HStack>

                  <Divider my={3} />

                  <DiscussionComments
                    commentsLabel="Doubt Community"
                    inputStyle="flushed"
                    itemId={currentAudio.data?._id}
                    itemModel={'Audio'}
                    contentId={currentSubj?.content._id}
                    courseId={courseId}
                    includeDoubt={1}
                  />
                </Box>
              </Box>
              <Box
                bg="white"
                w="30%"
                p={3}
                borderRadius={12}
                boxShadow="0pt 3pt 6pt rgba(221, 230, 237, 0.6)"
              >
                {suggestions?.length && !demoCourseId ? (
                  <Suggestions
                    audios={_.filter(
                      suggestions,
                      (v) => v._id != params.audioId
                    )}
                    currentAudio={currentAudio}
                  />
                ) : null}
              </Box>
            </HStack>
          ) : (
            <Text>Processing...</Text>
          )}
        </ErrorChecker>
      </ErrorChecker>
      {notesModal ? <NotesModal dataList={suggestions} currentData={currentAudio} visible={notesModal} closeModal={handleNotesModal} /> : null}
      {moveToBookmarkModal ? 
          <MoveToBookmarkModal course={courseId} type={'audios'} 
              visible={moveToBookmarkModal} file={moveToBookmarkModal} closeModal={addToBookmark}
          /> : null
      }
    </Box>
  );
};

const Suggestions = ({ audios, currentAudio }) => {
  let history = useHistory();
  let params = useParams();
  const location = useLocation();

  const [audiosList, changeAudiosList] = useState(audios);

  const openAudio = (id) => {
    history.push(`/dashboard/audio/${id}${location.search}`);
  };

  const searchaudios = (e) => {
    let data = _.filter(audios, (d) =>
      _.includes(_.toLower(d.name), _.toLower(e.target.value))
    );
    changeAudiosList(data);
  };

  return (
    <Box>
      <Text fontSize="heading" fontWeight="600">
        List of Topics
      </Text>
      <Box my={2}>
        <InputBox
          placeholder="Search"
          key={params.audioId}
          onChange={searchaudios}
          icon={<SearchIcon />}
        />
      </Box>
      <br />

      <VStack spacing={0} align="stretch">
        <HStack
          key={currentAudio._id}
          borderRadius={2}
          bg="#F0F3F4"
          p={3}
          cursor="pointer"
          alignItems="stretch"
        >
          <HStack w="30%" justifyContent="center">
            {audioIcon()}
          </HStack>
          <VStack w="70%" justifyContent="space-between" align="stretch">
            <Text fontSize="sm">{currentAudio.name}</Text>

            <HStack>
              <Text fontSize="xs" color="brand.green">
                Playing...
              </Text>
            </HStack>
          </VStack>
        </HStack>
        {_.filter(audiosList,a => a._id != currentAudio._id).length
          ? _.filter(audiosList,a => a._id != currentAudio._id).map((aud) => (
              <HStack
                key={aud._id}
                _hover={{ background: "#F2F4F4" }}
                borderRadius={2}
                p={3}
                transition="background .3s"
                cursor="pointer"
                alignItems="stretch"
                onClick={() => openAudio(aud.data?._id)}
              >
                <HStack w="30%" justifyContent="center">
                  {audioIcon()}
                </HStack>
                <Box w="70%">
                  <Text fontSize="sm">{aud.name}</Text>
                  <Text fontSize="14px" color="#566573">
                    1 month ago
                  </Text>
                </Box>
              </HStack>
            ))
          : null}
      </VStack>
    </Box>
  );
};
