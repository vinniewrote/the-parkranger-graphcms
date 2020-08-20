import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

export default function Profile() {
  const { user, isAuthenticated } = useAuth0();
  return (
    isAuthenticated && (
      <div className="profileWrapper">
        <div className="userImage">
          <img src={user.picture} alt="user avatar" />
        </div>
        <h3>Profile</h3>
        <a href="/app/parks">go to app</a>
        <a href="/">go to home</a>
      </div>
    )
  );
}
