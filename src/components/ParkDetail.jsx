import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import { useQuery, gql } from "@apollo/client";

export default function ParkDetail(props, match, location) {
  const {
    params: { parkId },
  } = props.match;

  const LANDMARK_LISTING = gql`
  query GetLandmarkListing {
    parks(where: {parkId: "${parkId}"}) {
      id
      name
      
      landmarks {
        id
        name
        operationalStatus
      }
    }
  }
`;

  const { loading, error, data } = useQuery(LANDMARK_LISTING);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <Fragment>
      <div>{parkId}</div>
      <div>Park Detail goes here </div>

      <Fragment>
        {data.parks[0].landmarks.map(({ id, name }) => (
          <Link key={id} to={`/parks/${parkId}/${id}`}>
            <p>{name}</p>
          </Link>
        ))}
      </Fragment>
    </Fragment>
  );
}
