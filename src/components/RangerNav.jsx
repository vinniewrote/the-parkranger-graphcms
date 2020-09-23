import React from "react";
import Parksbtn from "./ParksButton";
import Profilebtn from "./ProfileButton";
import Journalbtn from "./JournalButton";
import { NavLink } from "react-router-dom";

export default function RangerNav() {
  return (
    <div className="rangerNav">
      <NavLink to="/app/parks" activeClassName="selected">
        <Parksbtn />
      </NavLink>
      <NavLink to="/app/journal" activeClassName="selected">
        <Journalbtn />
      </NavLink>
      <NavLink to="/user/profile" activeClassName="selected">
        <Profilebtn />
      </NavLink>
    </div>
  );
}
