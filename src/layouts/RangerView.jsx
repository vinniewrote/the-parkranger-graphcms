import React from "react";
import RangerNav from "../components/RangerNav";
import Logout from "../components/LogoutButton";

export default function RangerView({ children }) {
  return (
    <div className="rangerView">
      <div className="topBlock">
        <a href="/app/parks">go to app</a>
        <a href="/">go to home</a>
        <Logout />
        <h1>Page Header</h1>
        <h2>Subheader Text</h2>
      </div>
      <div className="viewBlock">{children}</div>

      <RangerNav />
    </div>
  );
}
