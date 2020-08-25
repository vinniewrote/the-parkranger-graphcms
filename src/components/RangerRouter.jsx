import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import MainSplash from "../layouts/MainSplashPage";
import Profile from "./Profile";
import Journal from "./Journal";
import Parks from "./Parks";
import RangerView from "../layouts/RangerView";
import ProfileView from "../layouts/ProfileView";
import { PrivateRoute } from "../components/PrivateRoute";

export default function RangerRouter() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={MainSplash} />
        <Route path="/login" component={MainSplash} />
        <Route path="/app/:path?" exact>
          <Switch>
            <RangerView>
              <PrivateRoute path="/app/parks" component={Parks} />
              <PrivateRoute path="/app/journal" component={Journal} />
            </RangerView>
          </Switch>
        </Route>
        <Route path="/user/:path?" exact>
          <Switch>
            <ProfileView>
              <PrivateRoute path="/user/profile" component={Profile} />
            </ProfileView>
          </Switch>
        </Route>
      </Switch>
    </Router>
  );
}
