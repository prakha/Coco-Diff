import React, { useState, useEffect } from "react";
import { Box, Spinner } from "@chakra-ui/react";

import { useSelector } from "react-redux";
import { Route, Switch, useHistory, useRouteMatch } from "react-router-dom";

import { useAppContext, useIsAuthenticated } from "../../App/Context";
import _ from "lodash";
import { STATUS } from "../../Constants";

export const HomeRoute = () => {
  const status = useSelector((s) => s.user.status);
  const { checkapp } = useAppContext();
  if (!checkapp || status === STATUS.FETCHING) {
    return <Spinner size="xl" color="red.500" />;
  }
  return (
    <Box p={10}>
      <MainApp />
    </Box>
  );
};

const MainApp = () => {
  const auth = useIsAuthenticated();
  const history = useHistory();

  useEffect(() => {
    // if (auth) {
    history.push("/dashboard");
    // } else {
    //   // window.open("https://competitioncommunity.com", "_self");
    // }
  }, [auth, history]);
  return (
    <Box>
      <Spinner />
    </Box>
  );
};
