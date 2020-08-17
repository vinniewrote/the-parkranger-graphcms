import React from "react";
import RangerNav from "../components/RangerNav";
import Logout from "../components/LogoutButton";

export default function RangerView() {
  return (
    <div className="rangerView">
      <h1>Park Ranger</h1>
      <h2>Subheader Text</h2>
      <a href="/app">go to app</a>
      <a href="/">go to home</a>
      <Logout />
      <RangerNav />
    </div>
  );
}
