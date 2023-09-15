import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import "./App.css";
import { Auth0Provider } from "@auth0/auth0-react";
import Authenticated from "./layouts/AuthenticatedUser";
import Unauthenticated from "./layouts/UnauthenticatedUser";
import { PrivateRoute } from "./components/PrivateRoute";
import { ManageStory } from "./contexts/StoryContext";
import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client";
import { ApolloProvider } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { HttpLink } from "apollo-link-http";
import { ApolloLink } from "apollo-link";

const baseLink = createHttpLink({
  uri: "https://api-us-east-1.hygraph.com/v2/ck8g4we3i14kb01xv6avzh80e/master",
});

const authorPAT = `eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImdjbXMtbWFpbi1wcm9kdWN0aW9uIn0.eyJ2ZXJzaW9uIjozLCJpYXQiOjE2ODI5NTI1MjQsImF1ZCI6WyJodHRwczovL2FwaS11cy1lYXN0LTEuaHlncmFwaC5jb20vdjIvY2s4ZzR3ZTNpMTRrYjAxeHY2YXZ6aDgwZS9tYXN0ZXIiLCJtYW5hZ2VtZW50LW5leHQuZ3JhcGhjbXMuY29tIl0sImlzcyI6Imh0dHBzOi8vbWFuYWdlbWVudC5ncmFwaGNtcy5jb20vIiwic3ViIjoiYmMxODZlMTEtODA1Zi00NmM1LThmOTAtNjkwNmNjY2Y1MGFmIiwianRpIjoiY2xoNHloYWlvNW9zdjAxdWpmNjlpYm9rbCJ9.ZXIcpLY7d1A0i_fbjNOrLIfC7eGVIgejShvOaup-5UcBKikbBRMHgm2GCPPKWouZm-MEdWr4aC8mPr42ubkyz5fKoFKeIBnucRWguDYw-YeoS0SKmHSmJq-1E-HlnZFOe9AJitBOPFM2_gaGTMfzw1uNuNhquWY1t3f8bnGGviWUulOtlH2KMOIYs4EqeuOkUTI8Gkkq_oJLvEmHIyUtE87AYgDiqo1j7N27ID-G03-A6IlSITEp--fULkUQvwItIvBRf0fx3YJbdkE_b1Oi8fnU1nN7dHn8ydF8C7Zi2skTpogSqbBII2wU_2jdkEOsDdFLlTEtltT84-R1EoUMR4g55s9z99oLo_VbT5fPG_DGq8rZWM05KgYsse2eNE7jOtlJWPzhvzWpIYH-GOoZM54YhqoSI6e1af2PLQl_Kt4Obw4Z_2VHS7gzPnZo1vS6TVYN1aaBslv13u_x5wSIdyDzZYAQzft_PsNVwct441xeKfrlbyZJTfJkn762aawd8LT1kTz54wne02eywhN_L9V_xk_2g0uszkgw8DcN7PDXPx3iMNgFM_UMj9PJoyKFxiKgMrVvE4by8PG4oZb196qsQe4Nhbi_0Wkzd_8K3utftSHihdVq7o7QMZYAGaydnzAYsKB4hCTFqZheZY4Q2UjpYF9sSnqr6AZi2Vm_nfw`;
const authorLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const authPAToken = authorPAT;
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: authPAToken ? `Bearer ${authPAToken}` : "",
    },
  };
});

// const authenticationLink = setContext((_, { headers }) => {
//   // get the authentication token from local storage if it exists
//   const authenticationPAToken = authZeroPAT;
//   // return the headers to the context so httpLink can read them
//   return {
//     headers: {
//       ...headers,
//       authorization: authenticationPAToken
//         ? `Bearer ${authenticationPAToken}`
//         : "",
//     },
//   };
// });

const mediaUploadLink = new HttpLink({
  uri: "https://api-us-east-1.hygraph.com/v2/ck8g4we3i14kb01xv6avzh80e/master/upload",
});
const readOnlyLink = new HttpLink({
  uri: "https://us-east-1.cdn.hygraph.com/content/ck8g4we3i14kb01xv6avzh80e/master",
});

const baseClient = new HttpLink({
  uri: "https://api-us-east-1.hygraph.com/v2/ck8g4we3i14kb01xv6avzh80e/master",
});

const mergedClient = new ApolloClient({
  link: ApolloLink.split(
    (operation) => operation.getContext().clientName === "authorLink",
    // the string "author-link" can be anything you want,
    authorLink.concat(baseLink), // <= apollo will send to this if clientName is "authorLink"
    // authenticationLink.concat(baseClient),
    // mediaUploadLink, // <= apollo will send to this if clientName is "mediaUploadLink"
    baseClient // <= otherwise will send to this
  ),
  cache: new InMemoryCache(),
  // other options can go here
});

function App() {
  return (
    <ApolloProvider client={mergedClient}>
      <Auth0Provider
        domain="parkranger.us.auth0.com"
        clientId="7b2H1ssfuueiedKhY1tyIsNAsgR1SoPQ"
        redirectUri={window.location.origin}
      >
        <BrowserRouter>
          <ManageStory>
            <div className="App">
              <p style={{ margin: 0 }}>v0.106.23</p>
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
