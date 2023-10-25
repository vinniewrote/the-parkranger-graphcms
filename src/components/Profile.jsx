import React from "react";
import { NavLink } from "react-router-dom";
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

        <NavLink to="/properties" activeClassName="selected">
          go to parks
        </NavLink>
        <br />
        <br />

        <NavLink to="/" activeClassName="selected">
          go to home
        </NavLink>
      </div>
    )
  );
}
