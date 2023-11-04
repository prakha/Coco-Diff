import { Box } from '@chakra-ui/layout';
import React, { useEffect, useRef } from 'react'
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import { CONTENT_TYPE } from '../Constants';
import { useTracker } from '../routes/Courses/useTracker';

export const CustomAudioPlayer = ({audio, onPlay, onPause}) => {
    const urlSearchParams = new URLSearchParams(location.search)
    let courseId = urlSearchParams.get('courseId') || audio.courseId
    let subjectId = urlSearchParams.get('subjectId') || audio.contentId
    const audioRef = useRef()

    const {startTracking, addProgress} = useTracker({
        contentType: CONTENT_TYPE.AUDIO,
        courseId,
        dataId: audio._id,
        contentId:subjectId,
    });

    useEffect(() => {
        startTracking();
    }, [startTracking]);

    useEffect(() => {
        window.addEventListener('keydown', function(e) {
            if(e.keyCode == 32 && e.target == document.body) {
              e.preventDefault();
            }
        });
    })

    const _onProgress = (e) => {
        let current = e.target.currentTime
        let total = e.target.duration
        const intcurrent = parseInt(current, 10)
        addProgress(intcurrent, total)
    };

    return(
        <Box>
            <AudioPlayer style={{boxShadow:0}} id='my-audio'
                customAdditionalControls={[]}
                ref={audioRef}
                src={audio.data?.url}
                onPlay={onPlay}
                onPause={onPause}
                listenInterval={800}
                onListen={e => _onProgress(e)}
            />
        </Box>
    )
}