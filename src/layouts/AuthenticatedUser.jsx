import React from "react";
import RangerNav from "../components/RangerNav";
import RangerView from "./RangerView";
import { Switch } from "react-router-dom";
import ProfileView from "./ProfileView";
import { PrivateRoute } from "../components/PrivateRoute";

export default function AuthenticatedUser() {
  return (
    <div className="rangerWrapper">
      <Switch>
        <PrivateRoute path="/properties" component={RangerView} />
        <PrivateRoute path="/journal" component={RangerView} />
        <PrivateRoute exact path="/profile" component={ProfileView} />
        <PrivateRoute path="/" component={RangerView} />
      </Switch>
      <RangerNav />
    </div>
  );
}
