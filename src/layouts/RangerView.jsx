import React from "react";
import Logout from "../components/LogoutButton";
import { Switch, Route } from "react-router-dom";
import Parks from "../components/Parks";
import Journal from "../components/Journal";
import ParkDetail from "../components/ParkDetail";
import LandmarkDetail from "../components/LandmarkDetail";

export default function RangerView({ children }) {
  return (
    <div className="rangerView">
      <div className="topBlock">
        <Logout />
        <h1>Page Header</h1>
        <h2>Subheader Text</h2>
      </div>
      <div className="viewBlock">
        <Switch>
          <Route path="/parks/:parkId/:id" component={LandmarkDetail} />
          <Route path="/parks/:parkId" component={ParkDetail} />
          <Route path="/parks" component={Parks} />
          <Route path="/journal" component={Journal} />
        </Switch>
      </div>
    </div>
  );
}
