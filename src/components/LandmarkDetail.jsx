import React, { Fragment, useEffect, useState } from "react";
import { request } from "graphql-request";
import VisitLogger from "./VisitLogger";
import { useManagedStory } from "../contexts/StoryContext";

const GRAPHCMS_API =
  "https://api-us-east-1.graphcms.com/v2/ck8g4we3i14kb01xv6avzh80e/master";

export default function LandmarkDetail(props, match) {
  const {
    params: { id },
  } = props.match;
  const [landmarks, setLandmarks] = useState(null);

  useEffect(() => {
    const fetchParks = async () => {
      const { landmarks } = await request(
        `${GRAPHCMS_API}`,
        `{
          landmarks(where: {id: "${id}"}) {
            id
            name
            height
            inversions
            length
            heightRestriction
            gForce
            externalLink
            duration
            drop
            createdAt
            openingMonth
            openingDay
            openingYear
            closingDay
            closingMonth
            closingYear
            operationalStatus
            speed
            designer {
              name
              id
            }
            location {
              latitude
              longitude
            }
            
            summary
            colorPalette {
              hex
            }
          }
        }
        `
      );
      setLandmarks(landmarks);
    };
    fetchParks();
  }, [id]);

  return (
    <Fragment>
      <div>Detail about the landmark goes here </div>
      <h4>{id}</h4>
      {!landmarks ? (
        "no data yet"
      ) : (
        <Fragment>
          {landmarks.map(
            ({
              id,
              name,
              inversions,
              duration,
              openingMonth,
              openingDay,
              openingYear,
            }) => (
              <div>
                <p>{name}</p>
                <p>{inversions} inversions</p>
                <p>{duration}</p>
                <p>{openingDay}</p>
                <p>{openingMonth}</p>
                <p>{openingYear}</p>
                <VisitLogger
                  landmarkId={id}
                  landmarkName={name}
                  useManagedStory={useManagedStory}
                />
              </div>
            )
          )}
        </Fragment>
      )}
    </Fragment>
  );
}
