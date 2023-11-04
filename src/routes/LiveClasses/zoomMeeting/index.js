import React, { useEffect, useRef, useState } from "react";
import { Box, Button } from "@chakra-ui/react";
import {
  getZoomLectureSignatureAction,
  resetLectureZoomSigmaDetails,
} from "../../../redux/reducers/liveClass";
import { useHistory, useLocation } from "react-router";
import { useDispatch, useSelector } from "react-redux";
// import { ZoomMtg } from "@zoomus/websdk";
import $ from "jquery";
// import "@zoomus/websdk/dist/css/bootstrap.css";
import { unmaskKeys } from "../../../utils/Helper";
import { LoadingRef } from "../../../App/AppProvider";

// ZoomMtg.setZoomJSLib("https://source.zoom.us/2.9.7/lib", "/av");
// ZoomMtg.preLoadWasm();
// ZoomMtg.prepareJssdk();
// ZoomMtg.prepareWebSDK();
// // loads language files, also passes any error messages to the ui
// ZoomMtg.i18n.load("en-US");
// ZoomMtg.i18n.reload("en-US");

function ZoomMetting() {
  const [zoomSignature, setZoomSignature] = useState(null);
  const dispatch = useDispatch();
  const search = useLocation().search;
  const searchParams = new URLSearchParams(search);

  const lectureId = useSelector((s) => s.UI.lectureId);

  const leaveUrl = searchParams.get("leaveUrl") || "/";
  const { userData, lectureZoomSignatureDetails } = useSelector((state) => ({
    userData: state.user,
    lectureZoomSignatureDetails: state.liveClass.lectureZoomSignatureDetails,
  }));

  useEffect(() => {
    return () => {
      const zmmtgRoot = document.querySelector("#zmmtg-root");
      zmmtgRoot.style.display = "none";
    };
  }, []);

  const history = useHistory();

  useEffect(() => {
    if (lectureId && userData) {
      dispatch(
        getZoomLectureSignatureAction({ batchSubjectLectureId: lectureId })
      );
    } else {
      LoadingRef.current.showToast({
        title: "Cannot find class",
        position: "top",
      });
      history.push(leaveUrl);
    }
  }, [lectureId, dispatch, userData, history, leaveUrl]);

  function startMeeting(data) {
    const zmmtgRoot = document.querySelector("#zmmtg-root");
    zmmtgRoot.style.display = "block";
    const signature = data.signature;
    var sdkKey = unmaskKeys(data.sdk_key);
    var userName = userData?.user?.name || "student";
    // ZoomMtg.init({
    //   debug: false,
    //   leaveUrl: leaveUrl,
    //   showMeetingHeader: false,
    //   enableFullHD: true,
    //   enableHD: true,
    //   showPureSharingContent: false,
    //   videoHeader: false,
    //   disableInvite: true,
    //   meetingInfo: ["topic", "host"],
    //   success() {
    //     ZoomMtg.join({
    //       sdkKey: sdkKey,
    //       signature: signature,
    //       meetingNumber: data.meetingNumber,
    //       passWord: unmaskKeys(data.meetingPassword),
    //       userName: userName,
    //       success() {
    //         console.log("success connected to meeting");

    //         ZoomMtg.inMeetingServiceListener(
    //           "onMeetingStatus",
    //           function (data) {
    //             // {status: 1(connecting), 2(connected), 3(disconnected), 4(reconnecting)}
    //             console.log("meeting status", data);
    //           }
    //         );
    //       },
    //       error(res) {
    //         console.log({ res });
    //       },
    //     });
    //   },
    //   error(res) {
    //     console.log({ res });
    //   },
    // });
  }

  useEffect(() => {
    if (lectureZoomSignatureDetails) {
      resetLectureZoomSigmaDetails();
      setZoomSignature(lectureZoomSignatureDetails);
    }
  }, [lectureZoomSignatureDetails]);

  useEffect(() => {
    if (zoomSignature) {
      startMeeting(zoomSignature);
    }
  }, [zoomSignature]);

  return (
    <Box>
      {!lectureId ? (
        <Box p={20}>
          Cannot find the live class
          <Box py={5}>
            <Button
              onClick={() => {
                history.replace(leaveUrl);
              }}
            >
              Go to live classes
            </Button>
          </Box>
        </Box>
      ) : null}
    </Box>
  );
}

export default ZoomMetting;
