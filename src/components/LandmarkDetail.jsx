import React, { Fragment, useEffect, useState } from "react";
import { request } from "graphql-request";
import VisitLogger from "./VisitLogger";
import { useManagedStory } from "../contexts/StoryContext";
import { useQuery, gql } from "@apollo/client";

export default function LandmarkDetail(props, match) {
  const {
    params: { id },
  } = props.match;

  const LANDMARK_DETAILS = gql`
  query GetLandmarkDetails {
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
`;

  const { loading, error, data } = useQuery(LANDMARK_DETAILS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <Fragment>
      <div>Detail about the landmark goes here </div>
      <h4>{id}</h4>

      <Fragment>
        {data.landmarks.map(
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
              <VisitLogger landmarkId={id} landmarkName={name} />
            </div>
          )
        )}
      </Fragment>
    </Fragment>
  );
}
