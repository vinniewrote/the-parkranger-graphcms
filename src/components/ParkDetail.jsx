import React, { Fragment, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@apollo/client";
import FilterButton from "./FilterButton";
import Logout from "../components/LogoutButton";
import { LANDMARK_LISTING } from "../graphql/queries/journalQueries";

const FILTER_MAP = {
  All: () => true,
  Coasters: (category) => category === "Coasters",
  Shops: (category) => category === "shops",
  Attractions: (category) => category === "attractions",
  Restaurants: (category) => category === "restaurants",
};

const FILTER_NAMES = Object.keys(FILTER_MAP);

export default function ParkDetail(props, match, location) {
  const {
    params: { parkId },
  } = props.match;

  const [filter, setFilter] = useState("All");

  const filterList = FILTER_NAMES.map((name) => (
    <FilterButton
      key={name}
      name={name}
      isPressed={name === filter}
      setFilter={setFilter}
    />
  ));

  const { loading, error, data } = useQuery(LANDMARK_LISTING, {
    variables: { propertyId: parkId },
    pollInterval: 10000,
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <Fragment>
      <div className="topBlock">
        <Logout />
        <h1>Parks and Maps</h1>
        <h2>{parkId}</h2>
      </div>

      {filterList}
      <Fragment>
        {data.parks[0].landmarks
          .filter(FILTER_MAP[filter])
          .map(({ id, name, category }) => (
            <Link key={id} category={category} to={`/parks/${parkId}/${id}`}>
              <p>{name}</p>
            </Link>
          ))}
      </Fragment>
    </Fragment>
  );
}
