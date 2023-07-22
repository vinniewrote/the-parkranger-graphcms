import React from "react";
import Logout from "../components/LogoutButton";
import { Switch, Route, useHistory } from "react-router-dom";
import Parks from "../components/Parks";
import Journal from "../components/Journal";
import ParkDetail from "../components/ParkDetail";
import LandmarkDetail from "../components/LandmarkDetail";
import Splash from "../components/Splash";

export default function RangerView({ children }) {
  // if (currentUrl == newUrl) {
  //   props.history.push("/temp");
  //   props.history.goBack();
  // }
  let history = useHistory();
  window.onbeforeunload = (event) => {
    const e = event || window.event;
    // Cancel the event
    e.preventDefault();
    history.push(`${history.location.pathname}`);

    if (e) {
      e.returnValue = ""; // Legacy method for cross browser support
      history.goBack();
    }
    return ""; // Legacy method for cross browser support
  };

  console.log(history.location.pathname);

  return (
    <div className="rangerView">
      {/* <div className="topBlock">
        <Logout />
        <h1>Page Header</h1>
        <h2>Subheader Text</h2>
      </div> */}
      <div className="contentBlock">
        <Switch>
          <Route path="/parks/:parkId/:id" component={LandmarkDetail} />
          <Route path="/parks/:parkId" component={ParkDetail} />
          <Route path="/parks" component={Parks} />
          <Route path="/journal" component={Journal} />
          <Route exact path="/" component={Splash} />
        </Switch>
      </div>
    </div>
  );
}
