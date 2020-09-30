import React, { Fragment, useEffect, useState } from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import { request } from "graphql-request";

const GRAPHCMS_API =
  "https://api-us-east-1.graphcms.com/v2/ck8g4we3i14kb01xv6avzh80e/master";

export default function LandmarkDetail(props, match) {
  const {
    params: { id },
  } = props.match;
  const [parks, setParks] = useState(null);
  console.log(id);
  useEffect(() => {
    const fetchParks = async () => {
      const { parks } = await request(
        `${GRAPHCMS_API}`,
        `
          {
            landmark(where: {id: "${id}"}) {
              closingDate
              drop
              duration
              externalLink
              gForce
              height
              heightRestriction
              inversions
              length
              designer {
                name
                id
              }
              name
              openingDate
              operationalStatus
              speed
              predecessor {
                name
              }
              venue {
                id
                name
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
      <div>Detail about the landmark goes here </div>
      <h4>{id}</h4>
      {!parks ? (
        "no data yet"
      ) : (
        <Fragment>
          <h4>{id}</h4>
        </Fragment>
      )}
    </Fragment>
  );
}
