import React, { useEffect, useState, Fragment } from "react";
// import { BrowserRouter as Router, Route } from "react-router-dom";
import "./App.css";
import { ApolloClient } from "apollo-client";
import { HttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";
import gql from "graphql-tag";
import { Auth0Provider } from "@auth0/auth0-react";
import RangerRouter from "./components/RangerRouter";

function App() {
  return (
    <Auth0Provider
      domain="parkranger.us.auth0.com"
      clientId="7b2H1ssfuueiedKhY1tyIsNAsgR1SoPQ"
      redirectUri={window.location.origin}
    >
      <div className="App">
        {/* {!parks ? (
          "Loading"
        ) : (
          <Fragment>
            {parks.map(({ id, name }) => (
              <p key={id}>{name}</p>
            ))}
          </Fragment>
        )} */}
        <RangerRouter />
      </div>
    </Auth0Provider>
  );
}

export default App;
