import React from "react";
import { useOktaAuth } from "@okta/okta-react";

export default function LogoutButton() {
  const { authState, authService } = useOktaAuth();
  const logout = async () => {
    authService.logout({ returnTo: window.location.origin });
  };
  return (
    <div>
      {authState.isAuthenticated && (
        <button
          onClick={() => {
            logout();
          }}
        >
          Log out
        </button>
      )}
    </div>
  );
}
