import React, { Fragment, useEffect, useState } from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
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
    closingDate
    createdAt
    openingDate
    operationalStatus
    speed
    designer {
      name
      id
    }
    area {
      name
      id
      park {
        id
        name
      }
      venues {
        name
        id
      }
    }
    location {
      latitude
      longitude
    }
    category {
      name
    }
    classifications {
      name
    }
    theme {
      name
    }
    summary
    predecessor {
      name
      openingDate
      closingDate
    }
    successor {
      name
      openingDate
      closingDate
    }
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
  }, []);

  return (
    <Fragment>
      <div>Detail about the landmark goes here </div>
      <h4>{id}</h4>
      {!landmarks ? (
        "no data yet"
      ) : (
        <Fragment>
          {landmarks.map(({ id, name, inversions, duration, openingDate }) => (
            <div>
              <p>{name}</p>
              <p>{inversions}</p>
              <p>{duration}</p>
              <p>{openingDate}</p>
              <VisitLogger
                landmarkId={id}
                landmarkName={name}
                useManagedStory={useManagedStory}
              />
            </div>
          ))}
        </Fragment>
      )}
    </Fragment>
  );
}
