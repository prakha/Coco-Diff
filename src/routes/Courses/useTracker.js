import {useCallback, useEffect, useMemo, useRef} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import { postTrackingAction } from '../../redux/tracking';

export const useTracker = ({
  courseId,
  contentType,
  contentId,
  dataId,
  latency = 10,
}) => {
  const tracking = useSelector(s => s.tracking.trackings);

  const thisTracking = useMemo(() => {
    const contentTrackings = tracking?.[courseId]?.[contentType];
    return contentTrackings && contentTrackings[dataId];
  }, [contentType, courseId, dataId, tracking]);

  const timeoutRef = useRef();
  const trackingRef = useRef(false);
  const progressRef = useRef(0);
  const totalRef = useRef(0);
  const lastAddedProgressRef = useRef(-0.1);

  const addProgress = (current, total, track = false) => {
    if (current && current !== 0) {
      //   console.log('[tracker]', current, total);
      progressRef.current = current;
      totalRef.current = total;
    }
  };

  const dispatch = useDispatch();

  const addTracking = useCallback(
    d => {
      dispatch(postTrackingAction(d));
    },
    [dispatch],
  );

  const currentTrackingRef = useRef();

  useEffect(() => {
    currentTrackingRef.current = thisTracking;
  }, [thisTracking]);

  const trackerTrack = useCallback(
    (current, total, checkLatency = true) => {
      let progress = current || progressRef.current;

      // console.log(
      //   '[tracker] check check',
      //   lastAddedProgressRef.current || lastAddedProgressRef.current === 0,
      // ) && progress - lastAddedProgressRef <= 10;
      if (
        (lastAddedProgressRef.current || lastAddedProgressRef.current === 0) &&
        progress - lastAddedProgressRef.current <=  (checkLatency ? latency : 1)
      ) {
        // console.log(
        //   '[tracker] traker not run',
        //   progress - lastAddedProgressRef.current,
        //   checkLatency,
        //   lastAddedProgressRef.current,
        //   progress,
        // );

        return;
      }

      lastAddedProgressRef.current = progress;

      const objectData = {
        action: currentTrackingRef.current ? 'PROGRESS' : 'START',
        properties: {
          remark: 'PROGRESS',
          size: total || totalRef.current,
          current: progress,
        },
      };

      const postdata = currentTrackingRef.current
        ? {
            activityLogId: currentTrackingRef.current._id,
          }
        : {
            parentContentId: courseId,
            parentContentType: 'Course',
            udf1: contentId,
            udf1key: 'content',
            objectId: dataId,
            objectType: contentType,
          };

      addTracking({
        ...postdata,
        ...objectData,
      });
    },
    [addTracking, contentId, contentType, courseId, dataId, latency],
  );

  useEffect(() => {
    return () => {
      timeoutRef.current && clearInterval(timeoutRef.current);
      trackerTrack(null, null, false)
      lastAddedProgressRef.current = -0.1

    };
  }, [dataId]);

  const startTracking = useCallback(() => {
    if (!trackingRef.current) {
      trackingRef.current = true;
      timeoutRef.current = setInterval(trackerTrack, 2000);
    }
  }, [trackerTrack]);

  return {
    startTracking,
    trackerTrack,
    addProgress,
  };
};
