import { Button } from "@chakra-ui/react";
import React from "react";
import { Switch, Route } from "react-router-dom";
import { ProfileComponent } from "./ProfileComponent";
import { Dashboard } from "./Dashboard";

export const AppRoutes = (props) => {
  return (
    <Switch>
      {/* <Route exact path={"/"} component={BasicDetailsComponent} /> */}
      <Route exact path="/profile" component={ProfileComponent} />
      <Route path="/dashboard" component={Dashboard} />
    </Switch>
  );
};
