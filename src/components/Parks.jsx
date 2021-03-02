import React, { useEffect, useState, Fragment } from "react";
import { request } from "graphql-request";
import {} from "react-router-dom";
import { Link } from "react-router-dom";
import { useQuery, gql } from "@apollo/client";

const PARK_LISTING = gql`
  query GetParkListing {
    parks {
      id
      parkId
      name
      openingDay
      openingMonth
      openingYear
    }
  }
`;

export default function Parks() {
  const { loading, error, data } = useQuery(PARK_LISTING);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <Fragment>
      <h3>Parks and Maps</h3>

      <Fragment>
        {data.parks.map(({ id, parkId, name }) => (
          <Link key={id} to={`/parks/${parkId}`}>
            <p>{name}</p>
          </Link>
        ))}
      </Fragment>
    </Fragment>
  );
}
