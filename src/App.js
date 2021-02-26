import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import "./App.css";
import { Auth0Provider } from "@auth0/auth0-react";
import Authenticated from "./layouts/AuthenticatedUser";
import Unauthenticated from "./layouts/UnauthenticatedUser";
import { PrivateRoute } from "./components/PrivateRoute";
import { ManageStory } from "./contexts/StoryContext";

function App() {
  return (
    <Auth0Provider
      domain="parkranger.us.auth0.com"
      clientId="7b2H1ssfuueiedKhY1tyIsNAsgR1SoPQ"
      redirectUri={window.location.origin}
    >
      <BrowserRouter>
        <ManageStory>
          <div className="App">
            <Switch>
              <Route path="/auth" component={Unauthenticated} />
              <PrivateRoute path="/" component={Authenticated} />
            </Switch>
          </div>
        </ManageStory>
      </BrowserRouter>
    </Auth0Provider>
  );
}

export default App;
