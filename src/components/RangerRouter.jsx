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

const CALLBACK_PATH = "/implicit/callback";

const config = {
  clientId: "0oaqalxbgE41wNIxr4x6",
  issuer: "https://dev-907403.okta.com/oauth2/default",
  redirectUri: "http://localhost:3001/implicit/callback",
  scopes: ["openid", "profile", "email"],
  pkce: true,
};

export default function RangerRouter() {
  // const PrivateRoute = ({ component, ...args }) => (
  //   <Route
  //     component={withAuthenticationRequired(component, {
  //       onRedirecting: () => <div>Redirecting you to the login...</div>,
  //     })}
  //     {...args}
  //   />
  // );
  return (
    <Router>
      <Switch>
        <Security {...config}>
          <Route exact path="/" component={MainSplash} />
          <Route path="/login" component={MainSplash} />
          <Route path={CALLBACK_PATH} component={LoginCallback} />
          <SecureRoute path="/app" component={RangerView} />
          <SecureRoute path="/parks" component={Parks} />
          <SecureRoute path="/journal" component={Journal} />
          <SecureRoute path="/profile" component={Profile} />
        </Security>
      </Switch>
    </Router>
  );
}
