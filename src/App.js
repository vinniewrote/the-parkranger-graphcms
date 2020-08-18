import React, { useEffect, useState, Fragment } from "react";
// import { BrowserRouter as Router, Route } from "react-router-dom";
import "./App.css";
import { ApolloClient } from "apollo-client";
import { HttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";
import gql from "graphql-tag";
import { request } from "graphql-request";
import NewVisitorPage from "./components/NewVistorPage";
import { Auth0Provider } from "@auth0/auth0-react";
import MainSplash from "./layouts/MainSplashPage";
import RangerRouter from "./components/RangerRouter";

const GRAPHCMS_API =
  "https://api-us-east-1.graphcms.com/v2/ck8g4we3i14kb01xv6avzh80e/master";

function App() {
  const [parks, setParks] = useState(null);

  useEffect(() => {
    const fetchParks = async () => {
      const { parks } = await request(
        "https://api-us-east-1.graphcms.com/v2/ck8g4we3i14kb01xv6avzh80e/master",
        `
          {
            parks {
              id
              name 
            }
          }
        `
      );
      setParks(parks);
    };
    fetchParks();
  }, []);

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
