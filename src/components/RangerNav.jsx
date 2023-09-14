import React from "react";
import Parksbtn from "./ParksButton";
import Profilebtn from "./ProfileButton";
import Journalbtn from "./JournalButton";
import { NavLink } from "react-router-dom";

export default function RangerNav() {
  return (
    <div className="rangerNav">
      <NavLink to="/property" activeClassName="selected">
        <Parksbtn />
      </NavLink>
      <NavLink to="/journal" activeClassName="selected">
        <Journalbtn />
      </NavLink>
      <NavLink to="/profile" activeClassName="selected">
        <Profilebtn />
      </NavLink>
    </div>
  );
}
