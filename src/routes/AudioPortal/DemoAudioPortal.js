import { SearchIcon } from "@chakra-ui/icons";
import { HStack, Text, VStack } from "@chakra-ui/layout";
import { Box } from "@chakra-ui/layout";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation, useParams } from "react-router";
import { ErrorChecker } from "../../Components/ErrorChecker";
import { STATUS } from "../../App/Constants";
import _ from "lodash";
import { InputBox } from "../../Components/InputBox";
import { CustomAudioPlayer } from "../../Components/AudioPlayer";
import { Image } from "@chakra-ui/image";
import { SectionHeader } from "../../Components/SectionHeader";
import { bilingualText } from "../../utils/Helper";
import { audioIcon } from "../Contents/AudioFiles";
import { getPackageDemoAction } from "../../redux/reducers/packages";

export const DemoAudioPortal = () => {
  const dispatch = useDispatch();
  const params = useParams();
  const location = useLocation();

  const {getPackageDemoStatus, packageDemoContent} = useSelector((state) => ({
    getPackageDemoStatus:state.package.getPackageDemoStatus,
    packageDemoContent:state.package.packageDemoContent?.[0]
  }));

  let [currentAudio, setCurrentAudio] = useState();
  const [suggestions, setSuggestions] = useState([]);

  const urlSearchParams = new URLSearchParams(location.search);
  let demoCourseId = urlSearchParams.get("demoCourseId");
  let demoPackageId = urlSearchParams.get('demoPackageId')

  useEffect(() => {
    if(demoPackageId)
        dispatch(getPackageDemoAction({id:demoPackageId}))
  }, [demoPackageId, dispatch])


  useEffect(() => {
    if(getPackageDemoStatus === STATUS.SUCCESS && packageDemoContent){
        let audio = _.find(packageDemoContent.demoContent.audios,v => v.data._id === params.contentId)
        setCurrentAudio(audio)
        setSuggestions([audio, ..._.filter(packageDemoContent.demoContent.audios,d => d.data._id !== params.contentId)])
    }
  }, [getPackageDemoStatus, packageDemoContent, params.contentId])

  const [audioPlaying, setAudioPlaying] = useState();

  const onAudioPlay = (e) => {
    if (e.type === "play") setAudioPlaying(true);
    else setAudioPlaying(false);
  };

  const breadcrumbs = [
    { title: "Home", link: "/" },
    { title:packageDemoContent ? bilingualText(packageDemoContent.name) : null, link: "/package?id=" + demoPackageId},
    { title: 'Demo', link: '/package-demo/'+demoPackageId},
    { title: currentAudio?.name, link: '#'},
  ]

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
        <ErrorChecker status={getPackageDemoStatus}>
          {getPackageDemoStatus === STATUS.SUCCESS &&  currentAudio ? (
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
    </Box>
  );
};

const Suggestions = ({ audios, currentAudio }) => {
  let history = useHistory();
  let params = useParams();
  const location = useLocation();

  const [audiosList, changeAudiosList] = useState(audios);

  const openAudio = (id) => {
    history.push(`/dashboard/package-demo/audio/${id}${location.search}`);
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
