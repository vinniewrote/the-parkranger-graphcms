import React from "react";
import { useOktaAuth } from "@okta/okta-react";

export default function LoginButton() {
  const { authState, authService } = useOktaAuth();
  const login = async () => {
    authService.login("/app");
  };

  return (
    <div>
      {authState.isPending && <div>Loading authentication...</div>}
      {!authState.isAuthenticated && (
        <button className="loginBtn" onClick={login}>
          Log in
        </button>
      )}
      {authState.isAuthenticated && (
        <div>
          <h3>Logged in user data</h3>
          {/* <p>{user.name}</p>
          <img src={user.picture} alt="user avatar" /> */}
        </div>
      )}
    </div>
  );
}
