import React, { useState } from "react";
import { ChakraProvider, Text } from "@chakra-ui/react";
import { defaultTheme } from "../theme/default";
import "../routes/ProfileComponent/styles.css";

import { Switch, Route, Redirect, useLocation } from "react-router-dom";

import { ExamView } from "../routes/ExamView";
import { ExamPreviewScreen } from "../routes/ExamPreview";
import { Box } from "@chakra-ui/layout";
import { isSSR } from "../utils/ssrHelper";
import { Center, Spinner } from "@chakra-ui/react";
import { setAuthorizationHeader } from "../services/api";
import { ExamAppProvider } from "../App/AppProvider";
import { ExamAnalysisScreen } from "../routes/ExamAnalysis";
import { useQueryParams } from "../utils/useQueryParams";

const AppRouter = ({ isAuthenticated }) => {
  
  return (
    <>
      <Box>
        <Switch>
          <Route exact path={"/exam/start"}>
            <ExamView />
          </Route>
          <Route exact path={"/exam/report"}>
            <ExamPreviewScreen />
          </Route>
          <Route exact path={"/exam/report/analysis"}>
            <ExamAnalysisScreen />
          </Route>


        </Switch>
        {/* <FooterComponent /> */}
      </Box>
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
    </>
  );
};

export const App = ({ serverData }) => {


  const location = useLocation()
  const query = useQueryParams()

  if (location.pathname.startsWith('/exam.html')) {
    if (query.get("path") === "exam-report") {
      return <Redirect to={"/exam/report" + location.search} />
    }else if (query.get("path") === "exam-report-analysis") {
      return <Redirect to={"/exam/report/analysis" + location.search} />
    }
    return (
      <Redirect to={"/exam/start" + location.search} />
    )
  }
    
  const token = query.get("token")
  return (
    <ChakraProvider theme={defaultTheme}>
      <ExamAppProvider serverToken={token}>
        <AppRouter />
      </ExamAppProvider>
    </ChakraProvider>
  );
};
