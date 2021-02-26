import React, { Fragment, useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { request } from "graphql-request";

const GRAPHCMS_API =
  "https://api-us-east-1.graphcms.com/v2/ck8g4we3i14kb01xv6avzh80e/master";

export default function Journal(props, match, location) {
  const { user, isAuthenticated } = useAuth0();

  const [parks, setParks] = useState(null);
  console.log(parks);
  useEffect(() => {
    const fetchParks = async () => {
      const { parks } = await request(
        `${GRAPHCMS_API}`,
        `
          {
            author(where: {email: "txcrew@txcrew.co"}) {
              bio
              email
              name
            }
          }
        `
      );

      setParks(parks);
    };
    fetchParks();
  }, []);

  return (
    <Fragment>
      <div
        className="ActivateJournal"
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "1em 1.25em",
          boxShadow: "0px 11px 10px 0px rgba(107,104,107,1)",
        }}
      >
        <p>Please click here to activate your Park Ranger Journal</p>
        <button
          style={{
            height: "3em",
            backgroundColor: "orange",
            border: "1px solid darkorange",
            borderRadius: "5px",
            alignSelf: "center",
            cursor: "pointer",
          }}
        >
          Start Journaling!
        </button>
      </div>

      <h3 style={{ marginTop: "3em" }}>Journal</h3>
      {user.email}
    </Fragment>
  );
}
