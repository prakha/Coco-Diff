import { Box, Button, ChakraProvider, Heading, Spinner, Text } from "@chakra-ui/react";
import React, { useCallback, useEffect, useState } from "react";
import { defaultTheme } from "../theme/default";
import { Redirect, Route, Switch, useLocation } from "react-router-dom";
import { DownloadRoll } from "./DownloadPackageRollNo";
import { useQueryParams } from "../utils/useQueryParams";
import { SurveyComponent } from "../routes/Survey";
import { setAuthorizationHeader } from "../services/api";
import { STATUS } from "../Constants";


const Survey = () => {
  const query = useQueryParams();
  const id = query.get("survey");
  const token = query.get("token");
  const app = query.get('app')

  const closeWindow = useCallback(() => {
    window.close();
    window.ReactNativeWebView?.postMessage(
      JSON.stringify({
        type: 'success',
        message: 'completed',
      }),
    );
  }, []);

  const [tokenV, setTokenV] = useState(STATUS.FETCHING)

  useEffect(() => {
    if (token) {
      setAuthorizationHeader(token)
      setTokenV(STATUS.SUCCESS)
    } else {
      setTokenV(STATUS.FAILED)
      closeWindow()
      
    }
  }, [token])


  if(tokenV === STATUS.FETCHING){
    return (
      <Spinner color="redAccent.400" size="lg" />
    )
  }

  return tokenV === STATUS.SUCCESS ? (
    <SurveyComponent survey={id} app={true} closeWindow={closeWindow} />
  ) :
    <Text m={10}>Not available</Text>
}



export const ExtraApp = () => {

  const location = useLocation()
  const query = useQueryParams()

  if (location.pathname.startsWith('/extra.html')) {
    return <Redirect to={"/" + location.search} />
  }

  const token = query.get("token")
  return (
    <ChakraProvider theme={defaultTheme}>
      <Switch>
        <Route path="/" component={location.search.includes("survey") ? Survey : DownloadRoll} />
      </Switch>
    </ChakraProvider>
  );
};
