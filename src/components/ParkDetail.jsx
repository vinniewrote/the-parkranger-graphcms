import React, { Fragment, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@apollo/client";
import FilterButton from "./FilterButton";
import Logout from "../components/LogoutButton";
import { LANDMARK_LISTING } from "../graphql/queries/journalQueries";
import { useManagedStory } from "../contexts/StoryContext";

const FILTER_MAP = {
  All: () => true,
  Coasters: (property) => property.category.pluralName === "Coasters",
  Shops: (property) => property.category.pluralName === "Shops",
  Attractions: (property) => property.category.pluralName === "Attractions",
  Restaurants: (property) => property.category.pluralName === "Restaurants",
};

const FILTER_NAMES = Object.keys(FILTER_MAP);

export default function ParkDetail(props, match, location) {
  const {
    params: { parkId },
  } = props.match;

  const { filter, setFilter } = useManagedStory();

  const filterList = FILTER_NAMES.map((name) => (
    <FilterButton key={name} name={name} />
  ));

  const { loading, error, data } = useQuery(LANDMARK_LISTING, {
    variables: { propertyId: parkId },
    pollInterval: 10000,
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;
  console.log(data.parks[0].landmarks);
  console.log(FILTER_MAP[filter]);
  return (
    <Fragment>
      <div className="topBlock">
        <Logout />
        <h1>Parks and Maps</h1>
        <h2>{parkId}</h2>
      </div>

      {filterList}
      <Fragment>
        {data.parks[0].landmarks.filter(FILTER_MAP[filter]).map((property) => (
          <Link
            key={property.id}
            category={property.category.pluralName}
            to={`/parks/${parkId}/${property.id}`}
          >
            <p>{property.name}</p>
          </Link>
        ))}
      </Fragment>
    </Fragment>
  );
}
