import React, { useEffect, useRef } from "react";
import { Switch, Route, Redirect } from "react-router-dom";

import { HomeRoute } from "./Home";
import { useAppContext, useIsAuthenticated } from "../App/Context";
import { AppRoutes } from "./ProtectedApp";
import { ROUTES } from "../Constants/Routes";
// import { Cart } from "./Cart";
import { ExamView } from "./ExamView";
import { ExamPreviewScreen } from "./ExamPreview";
import { Box } from "@chakra-ui/layout";
import { Heading } from "@chakra-ui/react";
import { isSSR } from "../utils/ssrHelper";
import { Center, Spinner } from "@chakra-ui/react";
import Survey from "./Survey";
import { Blogs } from "./Blogs";
import { useSelector } from "react-redux";
import { STATUS } from "../Constants";
import { useHistory } from "react-router-dom";
import { intersection, map, size } from "lodash";
import { find } from "lodash";
import { CommonHeader } from "../Components/CommonHeader";
import { useLoginModal } from "../App/useLoginModal";
import { DemoContent } from "./DemoContent";
import { Notifications } from "./Notifications";
import Doubts from "./Doubts";
import { PackageDemoContent } from "./DemoContent/PackageDemoContent";
// import ZoomMetting from "./LiveClasses/zoomMeeting";
import { YoutubeView } from "../extra_routes/YoutubeView";

const AppRouter = (props) => {
  const auth = useIsAuthenticated();
  const student = useSelector((s) => s.user.student);
  const history = useHistory();
  const allSurveys = useSelector((s) => s.user.userSurvey);

  const getWebsitePackageStatus = useSelector(
    (s) => s.package.getWebsitePackageStatus
  );

  console.log({ getWebsitePackageStatus });

  useEffect(() => {
    function goToSurvey(s, type) {
      const url = ROUTES.SURVEY + "?survey=" + s._id;
      history.push(url);
    }
    if (allSurveys?.length && student) {
      find(allSurveys, (surveyData) => {
        if (surveyData.accessibility) {
          if (surveyData.accessibility === "all") {
            goToSurvey(surveyData, "all");
            return true;
          } else if (surveyData.accessibility === "any") {
            if (size(student?.packages)) {
              goToSurvey(surveyData, "any");
              return true;
            }
          } else if (surveyData.accessibility === "specific") {
            const allowedPackages = surveyData.specific_packages;
            const studentPackages = map(
              student?.packages,
              (p) => p.package?._id
            );

            const intersected = intersection(studentPackages, allowedPackages);
            // console.log("survey intersected", intersected, studentPackages);

            if (size(intersected)) {
              goToSurvey(surveyData, "specific");
              return true;
            }
          }
        }
        return false;
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allSurveys, student]);

  return getWebsitePackageStatus === STATUS.SUCCESS ? (
    <Box h="100vh">
      <Switch>
        <Route exact path={"/exam/start"}>
          {auth ? <ExamView /> : <Redirect to="/" />}
        </Route>
        <Route exact path={"/exam/report"}>
          {auth ? <ExamPreviewScreen /> : <Redirect to="/" />}
        </Route>

        {/* <Route exact path={"/blogs"}>
            <Blogs />
          </Route> */}
        {/* <Route path={ROUTES.PUBLIC_CART}>
            <Cart />
          </Route> */}

        <Route path={ROUTES.SURVEY} key="330">
          <Survey />
        </Route>
        <Route exact path={ROUTES.YOUTUBE_LIVE}>
          <YoutubeView />
        </Route>

        <Route path="/">
          <HomeRoutes />
        </Route>
      </Switch>
      {/* <FooterComponent /> */}
      {isSSR ? (
        <Center
          position="fixed"
          bg="white"
          top={0}
          left={0}
          right={0}
          bottom={0}
          w="100vw"
          h="full"
        >
          <Spinner size="xl" colorScheme="telegram" />
        </Center>
      ) : null}
    </Box>
  ) : (
    <Center
      position="fixed"
      bg="white"
      top={0}
      left={0}
      right={0}
      bottom={0}
      w="100vw"
      h="full"
    >
      <Spinner size="xl" colorScheme="telegram" />
    </Center>
  );
};

const HomeRoutes = () => {
  const { config } = useSelector((s) => ({
    config: s.package.config,
  }));

  return (
    <Box display="flex" h="100vh" flexDirection={"column"}>
      <CommonHeader
        isAuthenticated={true}
        pageContext="dashboard"
        config={config}
      />
      <Box overflowY={"auto"} flex={1}>
        <Switch>
          <ProtectedRoute path="/dashboard" component={AppRoutes} />

          {/* <Route path={ROUTES.HELP_AND_SUPPORT} component={HelpAndSupport} /> */}
          {/* <Route path={ROUTES.CURRENT_AFFAIRS} component={CurrentAffairs} /> */}
          {/* <Route path={ROUTES.PRIVACY_POLICY} component={PrivacyPolity}/> */}
          {/* <Route path={ROUTES.NOTICE} component={NoticeAndEvents}/> */}
          <Route path={ROUTES.DEMO_CONTENT} component={DemoContent} />
          <ProtectedRoute
            path={ROUTES.NOTIFICATIONS}
            component={Notifications}
          />
          {/* <ProtectedRoute
            path={ROUTES.ZOOM_CLASS}
            component={ZoomMetting}
            key="2302"
          /> */}

          {/* <Route path={ROUTES.TERMS_SERVICE} component={TermsService}/> */}
          {/* <Route path={ROUTES.ABOUT_US} component={AboutUs}/> */}
          {/* <Route path={ROUTES.CONTACT_US} component={ContactUs}/> */}
          <Route path={ROUTES.DOUBTS} component={Doubts} />
          <Route
            path={ROUTES.PACKAGE_DEMO_CONTENT}
            component={PackageDemoContent}
          />
          <Route path="/">
            <HomeRoute />
          </Route>
        </Switch>
      </Box>
    </Box>
  );
};

export const ProtectedRoute = (props) => {
  const auth = useIsAuthenticated();

  const { checkapp } = useAppContext();
  console.log({ checkapp });

  const status = useSelector((s) => s.user.status);
  const { openLoginModal, closeLoginModal } = useLoginModal();

  const { config } = useSelector((s) => ({
    config: s.package.config,
    pkg: s.package,
  }));

  const timeoutref = useRef();
  useEffect(() => {
    timeoutref.current = setTimeout(() => {
      if (!auth) {
        openLoginModal();
      } else {
        closeLoginModal();
      }
    }, [2000]);
    return () => {
      timeoutref.current && clearTimeout(timeoutref.current);
    };
  }, [auth, openLoginModal, closeLoginModal]);

  if (!checkapp || status === STATUS.FETCHING) {
    return <Spinner size="xl" color="red.500" />;
  }

  return auth ? (
    <Route {...props} /> // same as <Route path="/dashboard" component={AppRoutes} />
  ) : (
    <Box>
      <Center p={10}>
        <Heading fontSize="20">You are not logged In</Heading>
      </Center>
      <Center px={10}>Login to continue</Center>
    </Box>
  );
};

export default AppRouter;
