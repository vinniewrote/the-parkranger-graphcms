import React, { Children, Fragment, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@apollo/client";
import FilterButton from "./FilterButton";
import Logout from "../components/LogoutButton";
import { LANDMARK_LISTING } from "../graphql/queries/journalQueries";
import { useManagedStory } from "../contexts/StoryContext";
import { FilterBar } from "../styledComponents/FilterButton_styled";
import { useAuth0 } from "@auth0/auth0-react";
import {
  ParkLandmarkCard,
  LandmarkCardTop,
  LandmarkCardMiddle,
  LandmarkCardBottom,
  AreaContainer,
  AreaTitle,
} from "../styledComponents/ParkDetail_styled";

const FILTER_MAP = {
  Coasters: (property) => property.category?.pluralName === "Coasters",
  Shops: (property) => property.category?.pluralName === "Shops",
  Attractions: (property) => property.category?.pluralName === "Attractions",
  Dining: (property) => property.category?.pluralName === "Dining",
};

const FILTER_ARRAY = ["Coasters", "Shops", "Attractions", "Dining"];

const FILTER_NAMES = Object.keys(FILTER_MAP);

export default function ParkDetail(props, match, location) {
  const { user } = useAuth0();
  const [rawAreaData, setRawAreaData] = useState(null);
  const [cleanedData, setCleanedData] = useState(null);
  const {
    params: { parkId },
  } = props.match;

  const { filter, setFilter, emptyFilters, setEmptyFilters } =
    useManagedStory();

  const filterList = FILTER_NAMES.map((name) => (
    <FilterButton key={name} name={name} />
  ));
  let cleanedPlate = [];
  const { loading, error, data } = useQuery(LANDMARK_LISTING, {
    variables: { propertyId: parkId, authZeroId: user.sub },
    pollInterval: 10000,
    context: { clientName: "authorLink" },
    onCompleted: () => {
      data.property.childProp.map((simpleArea) => {
        simpleArea?.childProp?.map((simp) => {
          cleanedPlate.push({
            casualAreaName: simpleArea.name,
            casualPropertyName: simp.name,
            casualPropertyID: simp.id,
            casualCategoryName: simp.category.pluralName,
            casualAreaLink: `/properties/${parkId}/${simp.id}`,
          });
        });
        return cleanedPlate;
      });
      setCleanedData(cleanedPlate);
      setRawAreaData(data.property.childProp);
    },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  // cleanedAreDataName()?.length > 0 && setCleanedData(cleanedAreDataName());

  // const areaData = data?.property?.childProp;
  // console.log(areaData);

  // const dataBoop = FILTER_ARRAY.map((filterPoint) => {
  //   const filterCheck = rawLandmarks.filter(FILTER_MAP[filterPoint]);
  //   // console.log(filterCheck);
  //   filterCheck.length === 0 && setEmptyFilters(filterPoint);
  // });
  // let propertyCheck = document.getElementsByClassName("areaTitle");
  // console.log(propertyCheck.length);

  return (
    <Fragment>
      <div className="topBlock">
        <Logout />
        <h1>Parks and Maps</h1>
        <h2>{parkId}</h2>
      </div>
      <FilterBar>{filterList}</FilterBar>

      <Fragment>
        {cleanedData?.length > 0 &&
          cleanedData.map((propArea) => (
            <AreaContainer key={propArea.id}>
              {/* <AreaTitle>{propArea.casualAreaName}</AreaTitle> */}

              <ParkLandmarkCard>
                <Link
                  category={propArea.casualCategoryName}
                  to={propArea.casualAreaLink}
                  style={{ textDecoration: "none" }}
                >
                  <LandmarkCardTop>
                    {/* <AreaTitle>{propArea.casualAreaName}</AreaTitle> */}
                    <span>{propArea.casualCategoryName}</span>
                  </LandmarkCardTop>
                  <LandmarkCardMiddle>
                    <h4>{propArea.casualPropertyName}</h4>
                  </LandmarkCardMiddle>
                </Link>
                <LandmarkCardBottom>
                  {/* <span>{`${propertyLandmarks?.visits?.length} visits`}</span> */}
                  {/* add slim visitlogger here */}
                  <div>+</div>
                </LandmarkCardBottom>
              </ParkLandmarkCard>
            </AreaContainer>
          ))}
      </Fragment>
    </Fragment>
  );
}
