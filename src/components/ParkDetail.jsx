import React, { Fragment, useEffect, useState } from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import { request } from "graphql-request";

const GRAPHCMS_API =
  "https://api-us-east-1.graphcms.com/v2/ck8g4we3i14kb01xv6avzh80e/master";

export default function ParkDetail(props, match, location) {
  const {
    params: { parkId },
  } = props.match;
  const [parks, setParks] = useState(null);
  console.log(parkId);

  useEffect(() => {
    const fetchParks = async () => {
      const { parks } = await request(
        `${GRAPHCMS_API}`,
        `
          {
            parks(where: {parkId: "${parkId}"}) {
              id
              name
              openingDate
              landmarks {
                id
                name
                operationalStatus
              }
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
      <div>{parkId}</div>
      <div>Park Detail goes here </div>
      {!parks ? (
        "no data yet"
      ) : (
        <Fragment>
          {parks[0].landmarks.map(({ id, name }) => (
            <Link key={id} to={`/parks/${parkId}/${id}`}>
              <p>{name}</p>
            </Link>
          ))}
        </Fragment>
      )}
    </Fragment>
  );
}
