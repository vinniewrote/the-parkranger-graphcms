import React from "react";
// import { BrowserRouter as Router, Route } from "react-router-dom";
import logo from "./logo.svg";
import "./App.css";
import { ApolloClient } from "apollo-client";
import { HttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";
import gql from "graphql-tag";

const GRAPHCMS_API =
  "https://api-useast.graphcms.com/v1/cjj809xoy0bn001eez7tv87fb/master";

const client = new ApolloClient({
  link: new HttpLink({ uri: GRAPHCMS_API }),
  cache: new InMemoryCache()
});

function App() {
  const rangerparks = client
    .query({
      query: gql`
        {
          parks {
            name
            city
            stateProvince
            country
            location {
              latitude
              longitude
            }
          }
        }
      `
    })
    .then(result => {
      const parkquery = result.data.parks;
      return parkquery;
    });

  console.log(rangerparks);

  return (
    <div className="App">
      {Object.keys(rangerparks).map(parks => (
        <p>{parks.name}</p>
      ))}
    </div>
  );
}

export default App;
