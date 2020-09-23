import React from "react";
import RangerNav from "../components/RangerNav";
import Logout from "../components/LogoutButton";

export default function ProfileView({ children }) {
  return (
    <div className="rangerProfileView">
      <div className="profileTopBlock">
        <Logout />
        <div className="profileViewBlock">{children}</div>
      </div>
      <RangerNav />
    </div>
  );
}
