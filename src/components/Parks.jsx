import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@apollo/client";
import Logout from "../components/LogoutButton";
import { PARK_LISTING } from "../graphql/queries/journalQueries";

export default function Parks() {
  const { loading, error, data } = useQuery(PARK_LISTING);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <Fragment>
      <div className="topBlock">
        <Logout />
        <h1>Parks and Maps</h1>
        <h2>Subheader Text</h2>
      </div>
      {/* <h3>Parks and Maps</h3> */}

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
