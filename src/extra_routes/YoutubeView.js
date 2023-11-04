import React, { useEffect, useMemo, useRef, useState } from "react";
import { Box, Button, Flex, HStack, Input, Tag, Text, VStack } from "@chakra-ui/react";
import ReactPlayer from "react-player/youtube";
import { useHistory, useLocation } from "react-router-dom";
import { AiFillPlayCircle } from "react-icons/ai";
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import { IoPauseOutline, IoPlayOutline } from "react-icons/io5";
import { round } from "lodash";
import { BiExitFullscreen, BiFullscreen } from "react-icons/bi";
import { GoPrimitiveDot } from "react-icons/go";
import { useDispatch, useSelector } from "react-redux";
import { LoadingRef } from "../App/AppProvider";
import { resetPageDetailsData } from "../redux/reducers/UI";
import { useCallback } from "react";
import BottomSheet from "../Components/BottomSheet";
import { IoClose } from "react-icons/io5";

import { FaComments } from "react-icons/fa";

const overlayStyle = {
    height: '100%',
    width: '100%',
    position: 'absolute',
    top: '0px',
    bottom: '0px',
    backgroundColor: 'rgb(0,0,0)'
  }

export function useInterval(callback, delay) {
  const savedCallback = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [callback, delay]);
}

export const YoutubeView = () => {
  const [ progressData, setProgressData ] = useState({});
  const [ isVideoPlayingPre, setIsVideoPlayingPre ] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [videoData, changeVideoData] = useState({
    volume: 80,
    playing: false,
  });
  const [expand, setExpand ] = useState(false);
  const videoDetail = useSelector((s) => s.UI.pageDetailsData);
  const [ video, setVideo ] = useState({
    data: {
      value: '',
    }
  })

  const handle = useFullScreenHandle();
  const history = useHistory();
  const dispatch = useDispatch();
  const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);


  useEffect( () => {
    if(videoDetail?.youtubeId){
      setVideo({
        data: {
          value: videoDetail.youtubeId
        }
      })
    }else{
      LoadingRef.current.showToast({
        title: "Cannot Find Video",
        position: "top",
      });
      history.push('/');
    }
    return () => dispatch(resetPageDetailsData());
  },[history, dispatch, videoDetail])

  const toggleFullscreen = () => {
    if (handle.active) {
      handle.exit();
    } else {
      handle.enter();
    }
    setExpand(!expand);
  };

  const toggleBottomSheet = () => {
    setIsBottomSheetVisible(!isBottomSheetVisible);
  };
  

  const ref = useRef();
  // set videw playing in previous to hide controls before video get paused 

  const playVideo = () => {
    changeVideoData((d) => ({ ...d, playing: true }));
  };

  const pauseVideo = () => {
    changeVideoData((d) => ({ ...d, playing: false }));
  };

  const location = useLocation();
  const videoReady = () => {};

  const handleProgress = (state) => {    
    setProgressData(state);
  };

  const handleDuration = (state) => {
  };

  const handleEnded = () => {
    setIsVideoPlayingPre(false);
    handlePause();
  };

  const handlePlay = () => {
    playVideo();
    window.setTimeout( () => { setIsVideoPlayingPre(true)} , 400);
  };

  const handlePause = () => {
    setIsVideoPlayingPre(false);
    window.setTimeout(pauseVideo, 400);
  };

  const handleLiveBt = () => {
    ref.current.seekTo(1,'fraction')
  }

  
  

  const isInFullMode = useMemo( () => handle.active ,[handle.active]);

  return (
    <FullScreen handle={handle} style={{height: "100vh"}}>
      <VStack align='stretch' h='100vh' spacing={0}>
        <Box h="90vh" position={"relative"}>
          {/* <Text>Youtube</Text> */}
          <ReactPlayer
            style={{ background: "black" }}
            ref={ref}
            url={`https://www.youtube.com/embed/${video.data.value}`}
            width={isBottomSheetVisible ?"70%": "100%"}
            height="100%"
            volume={videoData.volume / 100}
            playing={videoData?.playing}
            playbackRate={playbackRate}
            playsinline={true}
            controls
            config={{
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
            }}
            onReady={videoReady}
            onProgress={handleProgress}
            onDuration={handleDuration}
            onEnded={handleEnded}
            onPlay={handlePlay}
            onPause={handlePause}
          />

          <HStack
            justifyContent="center"
            alignItems="center"
            pos="absolute"
            top={0}
            bottom={0}
            right={0}
            left={0}
            zIndex="9"
            onClick={ isVideoPlayingPre ? pauseVideo : playVideo}
            width={isBottomSheetVisible ?"70%": "100%"}
            cursor="pointer"
            background=""
          >
            { isVideoPlayingPre ? null : (
              <AiFillPlayCircle color="white" fontSize="90pt" />
            )}
          </HStack>

          <Box 
            transition={ isVideoPlayingPre && 'all 0.2s' }
            style={ ref.current?.player?.onDurationCalled && !isVideoPlayingPre ? { ...overlayStyle } : {}}>
          </Box>
        </Box>
        <Box flex={1} bg='black' px={4} style={isBottomSheetVisible ? { width: '70%' } : { width : '100%' }}>
          <Flex align='center' justify='space-between' w='full'>
            <Box flexGrow={1}>
              <Slider player={ref.current} progressData={progressData}/>
            </Box>
            <Button color={ 'white' } variant="flushed" boxShadow='none!important' fontSize='xl' alignSelf='end' onClick={toggleFullscreen}>
              {
                isInFullMode ? 
                <BiExitFullscreen />
                :
                <BiFullscreen />
              }
            </Button>
          </Flex>
          <Flex justify='space-between'>
            <HStack spacing={2}>
              <PlayPauseBt isPause={!videoData.playing} handlePause={handlePause} handlePlay={handlePlay} setIsBottomSheetVisible={setIsBottomSheetVisible} isBottomSheetVisible={isBottomSheetVisible}/>
              <Duration handleLiveBt={handleLiveBt} isInFullMode={isInFullMode} player={ref.current}/>
            </HStack>
            
            <Box>
              <Tag cursor='pointer' onClick={ handleLiveBt } variant="outline" colorScheme="red"><Box as='span' mr={2} color='white'><GoPrimitiveDot /></Box>Live</Tag>
            </Box>
          </Flex>
        </Box>
      </VStack>
         { isBottomSheetVisible && <BottomSheet id={video.data.value} /> }
      </FullScreen>
  );
};

const Slider = ({ player, progressData }) => {
  const [ isSeeking, setIsSeeking ] = useState(false);
  const [ playedVideo, setPlayedVideo ] = useState();

  useEffect( () => {
    if(isSeeking) return;
    setPlayedVideo(progressData.played);
  },[progressData.played])

  const handleSeekMouseDown = (e) => {
    if(!isSeeking)
      setIsSeeking(true);
    else  
      handleSeekMouseUp(e);
  }

  const handleSeekChange = useCallback((e) => {
    setPlayedVideo(e.target.value);
  },[setPlayedVideo])

  const handleSeekMouseUp = useCallback( e => {
    setIsSeeking(false);
    player.seekTo(e.target.value,'fraction')
  },[player, setIsSeeking])

  return (
      <Box pos='relative'>
        <Input 
        css= {{ '&::-webkit-slider-thumb' : {
          "-webkit-appearance": "none", 
          "appearance": "none",
          "width": "20px", 
          "height": "20px", 
          "background": "#e53e3e", 
          "cursor": "pointer", 
          "borderRadius": '50px',
          'transition': 'all 0.2s',
          "outline": 'none'
        }, '&::-webkit-slider-thumb:hover' : {
          "width": "25px", 
          "height": "25px", 
        }  }}
        boxShadow='none!important'
        outline='none!important'
        border='none'
        p={0}
        h={1}
        bg={`linear-gradient(to right, #e53e3e 0%, #e53e3e ${playedVideo * 100}%,white ${playedVideo * 100}%,white 100%)`}
        type="range" min={0} max={0.999999} step='any' value={playedVideo}
            onMouseDown={handleSeekMouseDown}
            onChange={handleSeekChange}
            onMouseUp={handleSeekMouseUp}
        />
      </Box>
  )
}


const Duration = ({ player, isInFullMode, handleLiveBt }) => {
  if(!player) return null;
  const currentTimeInSec = player.getCurrentTime();
  const currentHours = parseInt(currentTimeInSec / (60 * 60));
  const currentMinutes = round(parseInt((currentTimeInSec - ( currentHours * 3600 )) / 60), 2);
  const currentSeconds = round(parseInt(currentTimeInSec % 60), 2);
  
  const totalTimeInSec = player.getDuration() > currentTimeInSec ? player.getDuration() : currentTimeInSec;
  const totalHours = parseInt(totalTimeInSec / (60 * 60));
  const totalMinutes = parseInt((totalTimeInSec - ( totalHours * 3600 )) / 60);
  const totalSeconds = parseInt(totalTimeInSec % 60);
  return (
    <Flex fontWeight='bold' color={ 'white' }>
      <Box mr={2}>
        
        {
          totalHours > 0 ? addZeroBefore(totalHours) + ":" : ''
        }
        {
          addZeroBefore(totalMinutes) + ":" + addZeroBefore(totalSeconds)
        }
      </Box> 
    <Box>
      {
        currentHours > 0 ? addZeroBefore(currentHours) + ":" : ''
      }
      {
        addZeroBefore(currentMinutes) + ":" + addZeroBefore(currentSeconds)
      }
    </Box>
    </Flex>
  )
}

const addZeroBefore = (number) => {
  return number > 9 ? number : "0"+number;
}

const PlayPauseBt = ({ handlePause, handlePlay, isPause, setIsBottomSheetVisible, isBottomSheetVisible  }) => {

  const toggleBottomSheet = () => {
    setIsBottomSheetVisible(!isBottomSheetVisible);
  };
  
  return (
    <Flex alignItems="center" position="relative">
    <Button size="sm" colorScheme="red" onClick={isPause ? handlePlay : handlePause}>
      {isPause ? <IoPlayOutline /> : <IoPauseOutline />}
    </Button>
    {isBottomSheetVisible ? (
      <Button
        size="sm"
        colorScheme="red"
        onClick={toggleBottomSheet}
        
     
      >
        Chat Off
      </Button>
    ) : (
      <Button size="sm" colorScheme="blue" onClick={toggleBottomSheet}>
        Chat On {/* Chat icon */}
      </Button>
    )}
  </Flex>
  )
}
