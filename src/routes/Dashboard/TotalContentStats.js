import { HStack, VStack, CircularProgress, CircularProgressLabel, Avatar, Text, Box } from '@chakra-ui/react';
import React from 'react'
import { useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import { Progressbar } from '../../Components/Progressbar';
import { CONTENT_TYPE } from '../../Constants';
import { contentType } from './DashboardMain';

const courseOverallTrackingSelector = createSelector(
    [state => state.package.packageContents?.courses, state => state.tracking.trackings],
    (courses, trackings) => {
      const total = {};
  
      const typeKeys = {
        [CONTENT_TYPE.VIDEO]: 'countVideos',
        [CONTENT_TYPE.AUDIO]: 'countAudios',
        [CONTENT_TYPE.DOCUMENT]: 'countDocs',
        [CONTENT_TYPE.TEXT]: 'countTexts',
      };
      
      trackings && _.forEach(courses, c => {
        _.forEach(CONTENT_TYPE, (type, key) => {
          if (!total[type]) {
            total[type] = {
              total: 0,
              tracked: 0,
            };
          }
          total[type].total = total[type].total + (c[typeKeys[type]] || 0);
          total[type].tracked += _.size(trackings[c._id]?.[type]);
        });
      });
      return total;
    },
);

const TopStats = ({type}) => {
    const data = courseOverallTrackingSelector(useSelector(s => s));

    let content = data[type]
    let totalCount = content ? (content.tracked/content.total)*100 || 0 : 0
    return (
        <Progressbar value={totalCount}/>
    );
  };

export const TotalContentStats = () => {
    const { courses } = useSelector((state) => ({
        courses:state.package.packageContents?.courses,
    }))

    let countAudios = _.sumBy(courses,c => c.countAudios)
    let countVideos = _.sumBy(courses,c => c.countVideos)
    let countDocs = _.sumBy(courses,c => c.countDocs)
    let countTexts = _.sumBy(courses,c => c.countTexts)

    return(
        <HStack spacing={10} justifyContent='space-evenly' boxShadow='' borderRadius='15px' w='100%'>
            <ContentCard type={CONTENT_TYPE.AUDIO} name='Audios' total={countAudios}/>
            <ContentCard type={CONTENT_TYPE.VIDEO} name='Videos' total={countVideos}/>
            <ContentCard type={CONTENT_TYPE.DOCUMENT} name='Documents' total={countDocs}/>
            <ContentCard type={CONTENT_TYPE.TEXT} name='Books Content' total={countTexts}/>
        </HStack>
    )
}

const ContentCard = ({type, name, total}) => {
    const trackingData = courseOverallTrackingSelector(useSelector(s => s))

    return(
        <VStack w='25%' alignItems='stretch' bg='#E0EBFF' boxShadow='0px 3px 6px #0000000A' justifyContent='center' borderRadius='15px'>
            <HStack spacing={3} p={4} justifyContent='center' alignItems='center' bg='white' borderRadius='15px'>
                <Avatar size='sm' bg={contentType(type).bg} icon={contentType(type, 19).icon}/>
                <Text fontSize='md'>{name}</Text>
            </HStack>
            <HStack spacing={2} justifyContent='center' pb={2}>
                <TopStats type={type}/>
                <Text fontSize='md'>{(trackingData[type]?.tracked || 0) + '/' + total}</Text>
            </HStack>
        </VStack>
    )
}