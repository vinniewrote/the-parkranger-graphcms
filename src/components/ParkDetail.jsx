import React, { Fragment, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@apollo/client";
import FilterButton from "./FilterButton";
import Logout from "../components/LogoutButton";
import { LANDMARK_LISTING } from "../graphql/queries/journalQueries";
import { useManagedStory } from "../contexts/StoryContext";
import { FilterBar } from "../styledComponents/FilterButton_styled";
import {
  ParkLandmarkCard,
  LandmarkCardTop,
  LandmarkCardMiddle,
} from "../styledComponents/ParkDetail_styled";

const FILTER_MAP = {
  Coasters: (property) => property.category?.pluralName === "Coasters",
  Shops: (property) => property.category?.pluralName === "Shops",
  Attractions: (property) => property.category?.pluralName === "Attractions",
  // Restaurants: (property) => property.category?.pluralName === "Restaurants",
  Dining: (property) => property.category?.pluralName === "Dining",
};

const FILTER_ARRAY = [
  "Coasters",
  "Shops",
  "Attractions",
  // "Restaurants",
  "Dining",
];

const FILTER_NAMES = Object.keys(FILTER_MAP);

export default function ParkDetail(props, match, location) {
  const {
    params: { parkId },
  } = props.match;

  const { filter, setFilter, emptyFilters, setEmptyFilters } =
    useManagedStory();

  const filterList = FILTER_NAMES.map((name) => (
    <FilterButton key={name} name={name} />
  ));

  const { loading, error, data } = useQuery(LANDMARK_LISTING, {
    variables: { propertyId: parkId },
    pollInterval: 10000,
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;
  const rawLandmarks = data.parks[0].landmarks;
  // console.log(FILTER_ARRAY);
  const dataBoop = FILTER_ARRAY.map((filterPoint) => {
    const filterCheck = rawLandmarks.filter(FILTER_MAP[filterPoint]);
    // console.log(filterCheck);
    filterCheck.length === 0 && setEmptyFilters(filterPoint);
  });
  //  console.log(data.parks.includes("Coasters"));
  // console.log(`Shops - ${data.includes("Shops")}`);
  // console.log(`Attractions - ${data.includes("Attractions")}`);
  // console.log(`Restaurants - ${data.includes("Restaurants")}`);
  // console.log(`Dining - ${data.includes("Dining")}`);
  const dataPreFilters = data.parks[0].landmarks.filter(FILTER_MAP[filter]);
  console.log(dataPreFilters);
  // console.log(FILTER_MAP[filter]);
  // console.log(
  //   data.parks[0].landmarks.filter(FILTER_MAP[filter]).length === 0 &&
  //     setEmptyFilters(filter)
  // );

  return (
    <Fragment>
      <div className="topBlock">
        <Logout />
        <h1>Parks and Maps</h1>
        <h2>{parkId}</h2>
      </div>
      <FilterBar>{filterList}</FilterBar>
      <Fragment>
        {dataPreFilters.length > 0
          ? dataPreFilters.map((property) => (
              <Link
                key={property.id}
                category={property.category.pluralName}
                to={`/parks/${parkId}/${property.id}`}
                style={{ textDecoration: "none" }}
              >
                <ParkLandmarkCard>
                  <LandmarkCardTop>
                    <span>{property.category.pluralName}</span>
                  </LandmarkCardTop>
                  <LandmarkCardMiddle>
                    <h4>{property.name}</h4>
                  </LandmarkCardMiddle>
                </ParkLandmarkCard>
              </Link>
            ))
          : setEmptyFilters(filter)}
      </Fragment>
    </Fragment>
  );
}
