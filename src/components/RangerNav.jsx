import React from "react";
import book from "../svg/book.svg";
import park from "../svg/park.svg";
import profile from "../svg/profile.svg";

export default function RangerNav() {
  return (
    <div className="rangerNav">
      <a href="/parks">
        <img src={park} alt="park" />
      </a>
      <a href="/journal">
        <img src={book} alt="journal" />
      </a>
      <a href="/profile">
        <img src={profile} alt="profile" />
      </a>
    </div>
  );
}
