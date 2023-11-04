import { Button, ButtonGroup, IconButton } from "@chakra-ui/button";
import { VStack } from "@chakra-ui/layout";
import { HStack } from "@chakra-ui/layout";
import { Box } from "@chakra-ui/layout";
import { SliderThumb } from "@chakra-ui/slider";
import { Slider } from "@chakra-ui/slider";
import { SliderFilledTrack } from "@chakra-ui/slider";
import { SliderTrack } from "@chakra-ui/slider";
import { Tooltip } from "@chakra-ui/tooltip";
import memoizeOne from "memoize-one";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  AiFillPlayCircle,
  AiFillStepBackward,
  AiFillStepForward,
  AiOutlineFullscreen,
  AiOutlineFullscreenExit,
} from "react-icons/ai";

import {
  BsFillPlayFill,
  BsFillVolumeDownFill,
  BsFillVolumeMuteFill,
  BsFillVolumeUpFill,
  BsPause,
} from "react-icons/bs";

import ReactPlayer from "react-player";
import { CONTENT_TYPE } from "../../Constants";
import { secondsToStringVideoFormatted } from "../../utils/Helper";
import $ from "jquery";
import { useTracker } from "../../routes/Courses/useTracker";
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import { Helmet } from "react-helmet";
import { apis } from "../../services/api/apis";
import { useTrackContent } from "../useTrackContent";

export const VideoPlayer = ({ video }) => {
  let initialState = {
    showOverlay: true,
    playing: false,
    played: 0,
    playbackRate: 1.0,
    duration: 1,
    durationFormatted: "00:00",
    showHours: false,
    playedSeconds: 0,
    loadedSeconds: 0,
    loaded: 0,
    endStyles: {},
    isLive: true,
    volume: 100,
  };

  const [fullscreenStatus, toggleFullscreen] = useState();
  const [videoData, changeVideoData] = useState(initialState);
  const [player, changePlayer] = useState();

  useEffect(() => {
    window.addEventListener("keydown", function (e) {
      if (e.keyCode == 32 && e.target == document.body) {
        e.preventDefault();
      }
    });
  }, []);

  const handle = useFullScreenHandle();
  const videoPlayer = () => (
    <DefaultVideoPlayer
      videoData={videoData}
      changeVideoData={changeVideoData}
      video={video}
      toggleFullscreen={handle.active ? handle.exit : handle.enter}
      fullscreenStatus={fullscreenStatus}
      player={player}
      changePlayer={changePlayer}
      fullScreenHandle={handle}
    />
  );
  return (
    <Box>
      <FullscreenVideo
        video={video}
        fullScreenHandle={handle}
        visible={fullscreenStatus}
        closeModal={handle.exit}
        videoData={videoData}
        changeVideoData={changeVideoData}
        changePlayer={changePlayer}
        player={videoPlayer}
      />
    </Box>
  );
};

const DefaultVideoPlayer = ({
  video,
  toggleFullscreen,
  fullscreenStatus,
  videoData,
  changeVideoData,
  player,
  changePlayer,
  fullScreenHandle,
}) => {
  useEffect(() => {
    player?.seekTo(videoData.playedSeconds, "seconds");
  }, []);

  useEffect(() => {
    myStateRef.current = videoData;
  }, [videoData]);

  const urlSearchParams = new URLSearchParams(location.search);
  let courseId = urlSearchParams.get("courseId") || video.courseId;
  let subjectId = urlSearchParams.get("subjectId") || video.contentId;

  const ref = (player) => {
    changePlayer(player);
  };

  const handleDuration = (duration) => {
    let showHours = duration >= 3600;
    changeVideoData({
      ...videoData,
      duration,
      showHours,
      durationFormatted: secondsToStringVideoFormatted(duration, showHours),
    });
  };

  const { startTracking, addProgress } = useTracker({
    contentType: CONTENT_TYPE.VIDEO,
    courseId,
    dataId: video._id,
    contentId: subjectId,
  });

  let trackingData = useTrackContent()


  useEffect(() => {
    startTracking();
  }, [startTracking]);

  const _onProgress = (d) => {
    let current = d.playedSeconds;
    let total = videoData.duration;
    const intcurrent = parseInt(current, 10);
    
    if(trackingData.startTracking(courseId, 'Video', video._id)?.current < intcurrent)
      addProgress(intcurrent, total);
  };

  const handleProgress = (state) => {
    _onProgress(state);

    if (!videoData.seeking) {
      changeVideoData((d) => ({ ...d, ...state }));
    }
  };

  const handleEnded = () => {
    changeVideoData({ ...videoData, playing: false });
  };

  const handlePlay = () => {
    changeVideoData({ ...videoData, playing: true });
  };

  const handlePause = () => {
    changeVideoData({ ...videoData, playing: false });
  };

  const seekRewind = () => {
    player.seekTo(videoData.playedSeconds - 10, "seconds");
  };

  const seekForward = (state) => {
    player.seekTo(videoData.playedSeconds + 10, "seconds");
  };

  const playVideo = () => {
    changeVideoData((d) => ({ ...d, playing: true }));
  };

  const pauseVideo = () => {
    changeVideoData((d) => ({ ...d, playing: false }));
  };

  const changeVolume = (e) => {
    changeVideoData((d) => ({ ...d, volume: e }));
  };

  const muteVideo = () => {
    changeVideoData((d) => ({ ...d, volume: 0 }));
  };

  const unmuteVideo = () => {
    changeVideoData((d) => ({ ...d, volume: 100 }));
  };

  const getYoutubeId = (url) => {
    return url?.split("v=")[1];
  };

  const forwardVideo = (e) => {
    let playedSeconds = e.target.value;
    changeVideoData({ ...videoData, playedSeconds });
    player.seekTo(playedSeconds, "seconds");
  };

  // const handleSeekMouseDown = e => {
  //     changeVideoData({...videoData, seeking: true})
  // }

  // const handleSeekMouseUp = e => {
  //     if(videoData.played == 0.999999) {
  //         //if video has ended and seeking back
  //         changeVideoData({...videoData, playing: true, seeking: false})
  //     } else {
  //         changeVideoData({...videoData, seeking: false})
  //     }

  //     player.seekTo(parseFloat(e.target.value), 'fraction')
  // }

  const handleSetPlaybackRate = (e) => {
    changeVideoData({ ...videoData, playbackRate: parseFloat(e) });
  };

  const myStateRef = useRef(videoData);

  const _toggleFullscreen = () => {
    toggleFullscreen();
    focusVideoPlayer();
  };

  const videoReady = () => {
    focusVideoPlayer();

    if (videoData.playedSeconds)
      player.seekTo(videoData.playedSeconds, "seconds");
  };

  const focusVideoPlayer = () => {
    $("#playerBox")
      .click(() => {
        document.getElementById("playerBox").focus();
      })
      .keydown((e) => {
        let stateData = myStateRef.current;
        if (e.keyCode === 32) {
          e.preventDefault();
          stateData.playing ? pauseVideo() : playVideo();
        } else if (e.keyCode === 70) {
          e.preventDefault();
          toggleFullscreen();
        } else if (e.keyCode === 39) {
          e.preventDefault();
          document.getElementById("forwardButton").click();
        } else if (e.keyCode === 37) {
          e.preventDefault();
          document.getElementById("rewindButton").click();
        }
        // else if (e.keyCode ===  77) {
        //     e.preventDefault()
        //     document.getElementById('muteButton')?.click()
        // }
      });
  };


  let renderPlayer = memoizeOne(
    (
      location,
      playing,
      playbackRate,
      handleProgress,
      handleDuration,
      handleEnded,
      handlePlay,
      handlePause,
      isJWPlayer
    ) => {
      let videoType = video.data?.url?.replace(/.+\/\/|www.|\..+/g, "");
      return (
        <Box pos="relative" height="100%">
          {isJWPlayer || videoType == "vimeo" ? null : (
            <HStack
              justifyContent="center"
              alignItems="center"
              pos="absolute"
              top={0}
              bottom={0}
              right={0}
              left={0}
              zIndex="9"
              onClick={videoData.playing ? pauseVideo : playVideo}
              cursor="pointer"
              background=""
            >
              {videoData.playing ? null : (
                <AiFillPlayCircle color="white" fontSize="90pt" />
              )}
            </HStack>
          )}
          {isJWPlayer ? (
            <div>
              {/* <Helmet>
                <script
                  src={`https://cdn.jwplayer.com/libraries/7RHAqkfq.js`}
                ></script>
              </Helmet> */}

              <JwPlayer video={{...video, courseId, subjectId}} mediaId={video.data?.value} />
            </div>
          ) : (
            <ReactPlayer
              style={{ background: "black" }}
              ref={ref}
              url={video.data.source === 'vimeo' ? `https://player.vimeo.com/video/${video.data.value}?quality=360p` : `https://www.youtube.com/embed/${video.data.value}`}
              width="100%"
              height="100%"
              volume={videoData.volume / 100}
              playing={playing}
              playbackRate={playbackRate}
              playsinline={true}
              controls
              config={{
                vimeo: { controls: false, quality: "720p" },
                youtube: {
                  playerVars: {
                    controls: 0,
                    disablekb: 0,
                    enablejsapi: 1,
                    iv_load_policy: 3,
                    fs: 0,
                    rel: 0,
                    modestbranding: 1,
                    origin: location.origin,
                    widget_referrer: location.origin,
                  },
                },
              }}
              onReady={videoReady}
              onProgress={handleProgress}
              onDuration={handleDuration}
              onEnded={handleEnded}
              onPlay={handlePlay}
              onPause={handlePause}
            />
          )}
        </Box>
      );
    }
  );

  let videoType = video.data?.url?.replace(/.+\/\/|www.|\..+/g, "");
  const isJWPlayer = video.data?.source === "jw";
  return (
    <VStack
      height={fullScreenHandle.active ? "100%" : "60vh"}
      tabindex="0"
      id="playerBox"
      spacing={0}
      align="stretch"
    >
      {renderPlayer(
        { protocol: window.location.protocol, origin: window.location.origin },
        videoData.playing,
        videoData.playbackRate,
        handleProgress,
        handleDuration,
        handleEnded,
        handlePlay,
        handlePause,
        isJWPlayer
      )}
      {videoType === "vimeo" || isJWPlayer ? null : (
        <Box
          py={2}
          px={fullscreenStatus ? 6 : 0}
          color={fullscreenStatus ? "white" : ""}
          background={fullscreenStatus ? "black" : ""}
        >
          <Box>
            {/* <input type="range" min={0} max={0.999999} value={videoData.played || 0} className='ytp-progress-bar' step='any' id="myRange"
                            style={{width:'100%', cursor:'pointer'}}
                            onMouseDown={handleSeekMouseDown}
                            onChange={forwardVideo}
                            onMouseUp={handleSeekMouseUp}
                        /> */}

            <input
              type="range"
              min={0}
              max={videoData.duration}
              value={videoData.playedSeconds || 0}
              className="ytp-progress-bar"
              step="1"
              id="myRange"
              style={{ width: "100%", cursor: "pointer" }}
              // onMouseDown={handleSeekMouseDown}
              onChange={forwardVideo}
              // onMouseUp={handleSeekMouseUp}
            />
            <HStack>
              {/* <Box>{secToMin(_.round(videoData.playedSeconds))+' / '+secToMin(videoData.duration)}</Box> */}
            </HStack>
          </Box>
          <HStack justifyContent="space-between">
            <HStack spacing={5}>
              <ButtonGroup size="sm" variant="ghost">
                <Tooltip label="Rewind">
                  <IconButton
                    id="rewindButton"
                    onClick={seekRewind}
                    fontSize="25px"
                    icon={<AiFillStepBackward />}
                  />
                </Tooltip>
                {videoData.playing ? (
                  <Tooltip label="Pause">
                    <IconButton
                      onClick={pauseVideo}
                      fontSize="40px"
                      icon={<BsPause />}
                    />
                  </Tooltip>
                ) : (
                  <Tooltip label="Play">
                    <IconButton
                      onClick={playVideo}
                      fontSize="40px"
                      icon={<BsFillPlayFill />}
                    />
                  </Tooltip>
                )}
                <Tooltip label="Forward">
                  <IconButton
                    id="forwardButton"
                    onClick={seekForward}
                    fontSize="25px"
                    icon={<AiFillStepForward />}
                  />
                </Tooltip>
              </ButtonGroup>
              <HStack>
                <Box>
                  {videoData.volume == 0 ? (
                    <IconButton
                      id="unmuteButton"
                      variant="ghost"
                      size="sm"
                      onClick={unmuteVideo}
                      fontSize="30px"
                      icon={<BsFillVolumeMuteFill />}
                    />
                  ) : videoData.volume < 50 ? (
                    <IconButton
                      id="muteButton"
                      variant="ghost"
                      size="sm"
                      onClick={muteVideo}
                      fontSize="30px"
                      icon={<BsFillVolumeDownFill />}
                    />
                  ) : (
                    <IconButton
                      id="muteButton"
                      variant="ghost"
                      size="sm"
                      onClick={muteVideo}
                      fontSize="30px"
                      icon={<BsFillVolumeUpFill />}
                    />
                  )}
                </Box>
                <Slider
                  onChange={changeVolume}
                  value={videoData.volume}
                  width="50px"
                >
                  <SliderTrack>
                    <SliderFilledTrack />
                  </SliderTrack>
                  <SliderThumb backgroundColor="blue.500" />
                </Slider>
              </HStack>
              <Box>
                {secondsToStringVideoFormatted(
                  videoData.playedSeconds || 0,
                  videoData.showHours
                )}{" "}
                / {videoData.durationFormatted}
              </Box>
            </HStack>
            <HStack spacing={4} align="center">
              <HStack>
                <Box fontWeight="bold">Playback Speed</Box>
                <Box>
                  <ButtonGroup size="xs" isAttached variant="outline">
                    <Button
                      onClick={() => handleSetPlaybackRate(1)}
                      colorScheme={videoData.playbackRate == 1 ? "blue" : null}
                    >
                      1X
                    </Button>
                    <Button
                      onClick={() => handleSetPlaybackRate(1.5)}
                      colorScheme={
                        videoData.playbackRate == 1.5 ? "blue" : null
                      }
                    >
                      1.5X
                    </Button>
                    <Button
                      onClick={() => handleSetPlaybackRate(2)}
                      colorScheme={videoData.playbackRate == 2 ? "blue" : null}
                    >
                      2X
                    </Button>
                  </ButtonGroup>
                </Box>
              </HStack>
              <Box>
                {fullscreenStatus ? (
                  <Tooltip label="Exit Full screen">
                    <IconButton
                      fontSize={26}
                      onClick={_toggleFullscreen}
                      variant="ghost"
                      size="sm"
                      icon={<AiOutlineFullscreenExit />}
                    />
                  </Tooltip>
                ) : (
                  <Tooltip label="Full screen">
                    <IconButton
                      fontSize={26}
                      onClick={_toggleFullscreen}
                      variant="ghost"
                      size="sm"
                      icon={<AiOutlineFullscreen />}
                    />
                  </Tooltip>
                )}
              </Box>
            </HStack>
          </HStack>
        </Box>
      )}
    </VStack>
  );
};

const FullscreenVideo = ({
  video,
  visible,
  closeModal,
  player,
  fullScreenHandle,
}) => {
  return <FullScreen handle={fullScreenHandle}>{player()}</FullScreen>;
};


function installPlayerScript({ context, onLoadCallback, scriptSrc, uniqueScriptId }) {
  const jwPlayerScript = context.createElement('script');
  jwPlayerScript.id = uniqueScriptId;
  jwPlayerScript.src = scriptSrc;
  jwPlayerScript.onload = onLoadCallback;

  context.head.appendChild(jwPlayerScript);
}



const JwPlayer = React.memo(({ mediaId, video }) => {
  const [loading, setLoading] = useState(false);

  const { startTracking, addProgress } = useTracker({
    contentType: CONTENT_TYPE.VIDEO,
    courseId:video.courseId,
    dataId: video._id,
    contentId: video.subjectId,
  });
  let trackingData = useTrackContent()

  useEffect(() => {
    startTracking();
  }, [startTracking]);

  const _onProgress = (d) => {
    let current = d.playedSeconds;
    let total = d.duration;
    const intcurrent = parseInt(current, 10);

    if(trackingData.startTracking(video.courseId, 'Video', video._id)?.current < intcurrent)
      addProgress(intcurrent, total);
  };

  const onTime = (data) => {
    let d = {playedSeconds: data.currentTime,  duration: data.duration}
    _onProgress(d)
  }
  const progresRef = useRef()

  const setup = useCallback(async () => {
    const getMediaSecure = async () => {
      setLoading(true);
      const res = await apis.getJWMediaUrl({ mediaId });
      setLoading(false);
      if (res.ok) {
        return res.data;
      }
    };
    const url = await getMediaSecure();
    const playerInstance =
      jwplayer &&
      jwplayer("playerIdJw")?.setup?.({
        playlist: url,
      });

      playerInstance?.on("all", function(e, data){
        if(e==="time"){
          if(!progresRef.current ||  data.currentTime - progresRef.current > 1){
            progresRef.current = data.currentTime
            onTime(data)
          }
        }
      })
  }, [mediaId]);


  
  useEffect(() => {
    if(!document.jwplayer){
      installPlayerScript({
        context: document,
        onLoadCallback: (a) => {
          setup()      
        },
        scriptSrc: 'https://cdn.jwplayer.com/libraries/7RHAqkfq.js',
        uniqueScriptId: '7RHAqkfq',
      })
    }else{
      setup()
    }

  }, [setup])

  

  // useEffect(() => {
  //   if (typeof window !== "undefined" && window.jwplayer) {
  //     setup();
  //   }
  // }, [setup]);

  return <><div id="playerIdJw"/></>;
});
