import NewWindow from "react-new-window";
import { useDispatch, useSelector } from "react-redux";
import React from "react";
import {useAppContext} from '../App/Context'
import { toggleExamWindowAction } from "../redux/reducers/onlineExam";
import { useHistory } from "react-router";
import { token } from "../App/AppProvider";
import { useToast } from "@chakra-ui/react";

export const ExamWindow = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { onlineExam } = useSelector((state) => ({
    onlineExam: state.onlineExam?.newWindowData,
  }));

  const toast = useToast()
  const {getPackageContent} = useAppContext()

  const unload = () => {
    dispatch(
      toggleExamWindowAction({
        newWindow: false,
        redirect: false,
        testId: "",
        attemptId: "",
        attemptStatus: "",
      })
    );
    getPackageContent()

    const testId = localStorage.getItem("testId");
    const attemptId = localStorage.getItem("attemptId");
    const packageId = localStorage.getItem("packageId");

    if (testId && attemptId){
      history.push("/dashboard/exam/analysis/" + packageId + '/' + testId + "/" + attemptId);
    }else{
      toast({
        status:"error",
        "title": "Test Window closed",
      })
    }
  };

  //   console.log("playstore", onlineExam)

  const url =
    onlineExam &&
    `/exam/start/?testId=${onlineExam.testId}&testAttemptId=${
      onlineExam.attemptId
    }&mode=${onlineExam.attemptStatus}&token=${token.current}`;

  return (
    <div>
      {onlineExam?.newWindow ? (
        <NewWindow
          url={url}
          name="onlineExam"
          onUnload={unload}
          dialog="yes"
          features={{
            innerWidth: window.innerWidth,
            innerHeight: window.innerHeight,
            close: "no",
          }}
        />
      ) : null}
    </div>
  );
};
