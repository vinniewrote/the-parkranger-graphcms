import React from "react";
import Parksbtn from "./ParksButton";
import Profilebtn from "./ProfileButton";
import Journalbtn from "./JournalButton";

export default function RangerNav() {
  return (
    <div className="rangerNav">
      <a href="/app/parks">
        <Parksbtn />
      </a>
      <a href="/app/journal">
        <Journalbtn />
      </a>
      <a href="/user/profile">
        <Profilebtn />
      </a>
    </div>
  );
}
