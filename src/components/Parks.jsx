import React, { Fragment } from "react";
import { useQuery } from "@apollo/client";
import Logout from "../components/LogoutButton";
import { PropertyCardList } from "../components/PropertyCard";
import { PARK_LISTING } from "../graphql/queries/journalQueries";

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

      <PropertyCardList properties={data.properties} />
    </Fragment>
  );
}
