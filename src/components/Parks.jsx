import React, { useEffect, useState, Fragment } from "react";
import { request } from "graphql-request";
import {} from "react-router-dom";
import { Link } from "react-router-dom";

const GRAPHCMS_API =
  "https://api-us-east-1.graphcms.com/v2/ck8g4we3i14kb01xv6avzh80e/master";

export default function Parks() {
  const [parks, setParks] = useState(null);

  useEffect(() => {
    const fetchParks = async () => {
      const { parks } = await request(
        `${GRAPHCMS_API}`,
        `
          {
            parks {
              id
              parkId
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
      <h3>Parks and Maps</h3>
      {!parks ? (
        "Loading"
      ) : (
        <Fragment>
          {parks.map(({ id, parkId, name }) => (
            <Link key={parkId} to={`/app/parks/${parkId}`}>
              <p>{name}</p>
            </Link>
          ))}
        </Fragment>
      )}
    </Fragment>
  );
}
