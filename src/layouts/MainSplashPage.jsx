import React from "react";
import LoginButton from "../components/LoginButton";
import LogoutButton from "../components/LogoutButton";
import logo from "../svg/logo.svg";

export default function MainSplashPage() {
  return (
    <div className="baseBackground">
      <img src={logo} alt="park ranger logo" />
      <h1>Park Ranger</h1>
      <h2>Subheader Text</h2>
      <div className="authenticationLayer">
        <LoginButton />
        <LogoutButton />
        <a href="/app/properties">go to app</a>
        <a href="/">go to home</a>
      </div>
    </div>
  );
}
