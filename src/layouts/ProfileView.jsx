import React from "react";
import Logout from "../components/LogoutButton";
import Profile from "../components/Profile";

export default function ProfileView({ children }) {
  return (
    <div className="rangerProfileView">
      <div className="profileTopBlock">
        <Logout />
        <div className="profileViewBlock">
          <Profile />
        </div>
      </div>
    </div>
  );
}
