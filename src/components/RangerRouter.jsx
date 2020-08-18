import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
  useHistory,
  useLocation,
} from "react-router-dom";
import MainSplash from "../layouts/MainSplashPage";
import Profile from "./Profile";
import Journal from "./Journal";
import { withAuthenticationRequired } from "@auth0/auth0-react";
import Parks from "./Parks";
import RangerView from "../layouts/RangerView";
import { Security, LoginCallback, SecureRoute } from "@okta/okta-react";
import { PrivateRoute } from "../components/PrivateRoute";
const CALLBACK_PATH = "/implicit/callback";

const config = {
  clientId: "0oaqalxbgE41wNIxr4x6",
  issuer: "https://dev-907403.okta.com/oauth2/default",
  redirectUri: "http://localhost:3001/implicit/callback",
  scopes: ["openid", "profile", "email"],
  pkce: true,
};

export default function RangerRouter() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={MainSplash} />
        <Route path="/login" component={MainSplash} />
        <PrivateRoute path="/app" component={RangerView} />
        <PrivateRoute path="/parks" component={Parks} />
        <PrivateRoute path="/journal" component={Journal} />
        <PrivateRoute path="/profile" component={Profile} />
      </Switch>
    </Router>
  );
}
