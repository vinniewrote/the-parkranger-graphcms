import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

export default function LoginButton() {
  const { isAuthenticated, loginWithRedirect } = useAuth0();

  return (
    <div>
      {!isAuthenticated && (
        <button
          className="loginBtn"
          onClick={() =>
            loginWithRedirect({
              screen_hint: "signup",
            })
          }
        >
          Log in
        </button>
      )}
    </div>
  );
}
