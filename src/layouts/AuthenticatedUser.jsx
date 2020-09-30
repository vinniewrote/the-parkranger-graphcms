import React from "react";
import RangerNav from "../components/RangerNav";
import RangerView from "./RangerView";
import { Switch, Route } from "react-router-dom";
import ProfileView from "./ProfileView";

export default function AuthenticatedUser() {
  return (
    <div className="rangerWrapper">
      <Switch>
        <Route path="/parks" component={RangerView} />
        <Route path="/journal" component={RangerView} />
        <Route exact path="/profile" component={ProfileView} />
        <Route path="/" component={RangerView} />
      </Switch>
      <RangerNav />
    </div>
  );
}
