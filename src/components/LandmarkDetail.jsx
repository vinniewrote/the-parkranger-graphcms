import React, { Fragment } from "react";
import VisitLogger from "./VisitLogger";
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
  console.log(data);
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
              <p key={`${name}-${id}`}>{name}</p>
              <p key={inversions}>{inversions} inversions</p>
              <p key={duration}>{duration}</p>
              <p key={openingDay}>{openingDay}</p>
              <p key={openingMonth}>{openingMonth}</p>
              <p key={openingYear}>{openingYear}</p>
              <VisitLogger landmarkId={id} landmarkName={name} />
            </div>
          )
        )}
      </Fragment>
    </Fragment>
  );
}
