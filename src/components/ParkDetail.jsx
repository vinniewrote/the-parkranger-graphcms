import React, { Fragment, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, gql } from "@apollo/client";
import FilterButton from "./FilterButton";

// import useState
// add filter hooks
// define filters for coasters, shops, attractions and restaurants
// use const FILTER_NAMES = Object.keys(FILTER_MAP); to get all the filter names (coasters, shops, etc)
// render the filter buttons using the below map

{
  /* const filterList = FILTER_NAMES.map((name) => (
  <FilterButton key={name} name={name}/>
));
*/
}

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

  const LANDMARK_LISTING = gql`
  query GetLandmarkListing {
    parks(where: {parkId: "${parkId}"}) {
      id
      name
      
      landmarks {
        id
        name
        operationalStatus
          category {
          id
          name
          pluralName
        }
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

      {/* <div className="park-filter">
        <button>all</button>
        <button>coasters</button>
        <button>attractions</button>
        <button>restaurants</button>
        <button>shops</button>
      </div> */}

      {filterList}
      <Fragment>
        {data.parks[0].landmarks
          .filter(FILTER_MAP[filter])
          .map(({ id, name, category }) => (
            <Link
              key={id}
              category={category.pluralName}
              to={`/parks/${parkId}/${id}`}
            >
              <p>{name}</p>
            </Link>
          ))}
      </Fragment>
    </Fragment>
  );
}
