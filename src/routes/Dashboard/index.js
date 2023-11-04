import React, { useEffect, useState } from "react";
import { Box, Flex } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Switch } from "react-router-dom";
import { CommonHeader } from "../../Components/CommonHeader";
import { ROUTES } from "../../Constants/Routes";
import $ from "jquery";
import { Courses } from "../Courses";
import { Tests } from "../Tests/TestList";
import { Library } from "../Library";
import { Order } from "../Order";
// import { Wishlist } from "../Wishlist";
import { Bookmarks } from "../Bookmarks";
import { PerformanceReport } from "../PerformanceReport";
import { Referral } from "../Referral";
import { HelpAndSupport } from "../HelpAndSupport";
import { Feedback } from "../Feedback";
import { Wallet } from "../Wallet";
import { Settings } from "../Settings";
import { getPackagesAction } from "../../redux/reducers/packages";
import { Sidebar } from "../../Components/Sidebar";
import { DashboardMain } from "./DashboardMain";
import { CourseDetails } from "../Courses/CourseDetails";
import { TestPackages } from "../Tests/TestPackages";
// import { Cart } from "../Cart";
import { TestAnalysis } from "../TestAnalysis";
import { CourseContent } from "../Courses/CourseContent";
import { VideoPortal } from "../VideoPortal/index.js";
import { AudioPortal } from "../AudioPortal/index.js";
import { DiscussionCommunity } from "../DiscussionCommunity";
import { QuestionsCommunity } from "../QuestionsCommunity";
import { ProfilePage } from "../ProfilePage";
import { Magazines } from "../Magazines";
import { OrderDetails } from "../Order/OrderDetails";
import Doubts from "../Doubts";
import { isSSR } from "../../utils/ssrHelper";
import { webView } from "../../utils/Helper";
import { TestDiscussionScreen } from "../Tests/TestDiscussions";
import {
  AssignmentLeaderBoardScreen,
  LeaderBoardScreen,
} from "../Tests/LeaderBoards";
import { StudentTicket } from "../HelpAndSupport/StudentTicket";
import { PackagePerformance } from "../PackagePerformance";
import { PerformanceReportPackages } from "../PerformanceReportPackages.js";
import { DemoVideoPortal } from "../VideoPortal/DemoVideoPortal";
import { DemoAudioPortal } from "../AudioPortal/DemoAudioPortal";
import LiveClasses from "../LiveClasses";
const ZoomMeeting = React.lazy(() => import("../LiveClasses/zoomMeeting"));
const packagecall = React.createRef(false);

export const Dashboard = () => {
  const dispatch = useDispatch();
  // const isAuthenticated = useIsAuthenticated();

  const { packages_reducer } = useSelector((s) => ({
    packages_reducer: s.package,
  }));

  useEffect(() => {
    if (!packagecall.current && !packages_reducer.packagesList?.length) {
      dispatch(getPackagesAction()); // API Call to get All the Packages
      packagecall.current = true;
    }
  }, [dispatch, packages_reducer.packagesList?.length]);

  return (
    <Flex h="100%">
      <Box width={"20%"} h="100%" {...webView} id="sidebar">
        <Sidebar />
      </Box>
      <Box
        flex={1}
        style={{
          padding: "20px",
          backgroundColor: "#F7F8FB",
        }}
      >
        <DashboardContent />
      </Box>
    </Flex>
  );
};

export const DashboardContent = () => {
  return (
    <Box>
      <Switch>
        <Route
          exact
          path={ROUTES.TEST_ANALYSIS}
          component={TestAnalysis}
          key="0"
        />
        <Route
          exact
          path={ROUTES.TEST_DISCUSSIONS}
          component={TestDiscussionScreen}
          key="01"
        />

        <Route
          exact
          path={ROUTES.TEST_LEADERS}
          component={LeaderBoardScreen}
          key="02"
        />
        <Route
          exact
          path={ROUTES.ASSIGNMENT_LEADERS}
          component={AssignmentLeaderBoardScreen}
          key="03"
        />
        <Route
          exact
          path={ROUTES.DASHBOARD}
          component={DashboardMain}
          key="1"
        />
        <Route
          exact
          path={ROUTES.COURSE_DETAILS}
          component={CourseDetails}
          key="2"
        />
        <Route exact path={ROUTES.COURSES} component={Courses} key="3" />
        <Route exact path={ROUTES.TESTS} component={Tests} key="4" />
        <Route exact path={ROUTES.LIBRARY} component={Library} key="7" />
        <Route exact path={ROUTES.MAGAZINES} component={Magazines} key="25" />
        <Route exact path={ROUTES.ORDER} component={Order} key="8" />
        {/* <Route exact path={ROUTES.CART} component={Cart} key="9" /> */}
        {/* <Route exact path={ROUTES.WISHLIST} component={Wishlist} key="10" /> */}
        <Route exact path={ROUTES.BOOKMARKS} component={Bookmarks} key="11" />
        <Route
          exact
          path={ROUTES.PERFORMANCE_REPORT}
          component={PerformanceReport}
          key="12"
        />
        <Route exact path={ROUTES.REFERRAL} component={Referral} key="13" />
        <Route
          exact
          path={ROUTES.HELP_AND_SUPPORT}
          component={HelpAndSupport}
          key="14"
        />
        <Route exact path={ROUTES.FEEDBACK} component={Feedback} key="15" />
        <Route exact path={ROUTES.WALLET} component={Wallet} key="16" />
        <Route exact path={ROUTES.SETTINGS} component={Settings} key="17" />
        {/* <Route exact path={ROUTES.LOGOUT} component={Logout} key="18" /> */}
        <Route
          exact
          path={ROUTES.TEST_PACKAGES}
          component={TestPackages}
          key="19"
        />
        <Route
          exact
          path={ROUTES.VIDEO_PORTAL}
          component={VideoPortal}
          key="20"
        />
        <Route
          exact
          path={ROUTES.AUDIO_PORTAL}
          component={AudioPortal}
          key="21"
        />

        <Route
          exact
          path={ROUTES.COURSE_CONTENT}
          component={CourseContent}
          key="22"
        />
        {/* <Route
          exact
          path={ROUTES.LIBRARY_FOLDER}
          component={LibraryFolder}
          key="23"
        /> */}
        <Route
          path={ROUTES.DISCUSSION_COMMUNITY}
          component={DiscussionCommunity}
          key="5"
        />
        <Route
          path={ROUTES.QUESTIONS_COMMUNITY}
          component={QuestionsCommunity}
          key="6"
        />
        <Route exact path={ROUTES.PROFILE} component={ProfilePage} key="24" />
        <Route
          exact
          path={ROUTES.ORDER_DETAILS}
          component={OrderDetails}
          key="25"
        />
        <Route
          exact
          path={ROUTES.STUDENT_TOKEN}
          component={StudentTicket}
          key="26"
        />
        <Route
          exact
          path={ROUTES.PACKAGE_PERFORMANCE}
          component={PackagePerformance}
          key="27"
        />
        <Route
          exact
          path={ROUTES.PERFORMANCE_REPORT_PACKAGES}
          component={PerformanceReportPackages}
          key="28"
        />
        <Route path={ROUTES.DEMO_VIDEO_PORTAL} component={DemoVideoPortal} />
        <Route path={ROUTES.DEMO_AUDIO_PORTAL} component={DemoAudioPortal} />
        <Route path={ROUTES.LIVE_CLASSES} component={LiveClasses} key="2301" />
        {/* <Route exact path={ROUTES.BOOKMARK_FOLDER} component={BookmarkFolder} /> */}
      </Switch>
    </Box>
  );
};
