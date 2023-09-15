import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@apollo/client";
import Logout from "../components/LogoutButton";
import { PARK_LISTING } from "../graphql/queries/journalQueries";
import { PropertyBlock, PropertyTitle } from "../styledComponents/Parks_styled";

export default function Parks() {
  const { loading, error, data } = useQuery(PARK_LISTING, {
    context: { clientName: "authorLink" },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <Fragment>
      <div className="topBlock">
        <Logout />
        <h1>Parks and Venues</h1>
        {/* <h2>Subheader Text</h2> */}
      </div>

      <Fragment>
        {data.properties.map(({ id, name }) => (
          <PropertyBlock key={id}>
            <Link key={`${name}-${id}`} to={`/properties/${id}`}>
              <PropertyTitle key={`${id}-${name}`}>{name}</PropertyTitle>
            </Link>
          </PropertyBlock>
        ))}
      </Fragment>
    </Fragment>
  );
}
