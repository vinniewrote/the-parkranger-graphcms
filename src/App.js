import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import "./App.css";
import { Auth0Provider } from "@auth0/auth0-react";
import Authenticated from "./layouts/AuthenticatedUser";
import Unauthenticated from "./layouts/UnauthenticatedUser";
import { PrivateRoute } from "./components/PrivateRoute";
import { ManageStory } from "./contexts/StoryContext";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import { ApolloProvider } from "@apollo/client";

const client = new ApolloClient({
  uri: "https://api-us-east-1.graphcms.com/v2/ck8g4we3i14kb01xv6avzh80e/master",
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <Auth0Provider
        domain="parkranger.us.auth0.com"
        clientId="7b2H1ssfuueiedKhY1tyIsNAsgR1SoPQ"
        redirectUri={window.location.origin}
      >
        <BrowserRouter>
          <ManageStory>
            <div className="App">
              <p style={{ margin: 0 }}>v0.105.3</p>
              <Switch>
                <Route path="/auth" component={Unauthenticated} />
                <PrivateRoute path="/" component={Authenticated} />
              </Switch>
            </div>
          </ManageStory>
        </BrowserRouter>
      </Auth0Provider>
    </ApolloProvider>
  );
}

export default App;
