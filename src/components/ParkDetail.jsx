import React, { Fragment, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@apollo/client";
import Logout from "../components/LogoutButton";
import { LANDMARK_LISTING } from "../graphql/queries/journalQueries";
import { useManagedStory } from "../contexts/StoryContext";
import { useAuth0 } from "@auth0/auth0-react";
import {
  ParkLandmarkCard,
  LandmarkCardTop,
  LandmarkCardMiddle,
  LandmarkCardBottom,
  AreaContainer,
  PropertyFilterBtn,
  PropertySubFilterBtn,
  MainFilterWrapper,
  SubFilterWrapper,
} from "../styledComponents/ParkDetail_styled";

export default function ParkDetail(props, match, location) {
  const { user } = useAuth0();
  const [rawAreaData, setRawAreaData] = useState(null);
  const [cleanedData, setCleanedData] = useState(null);
  const [filterBarItems, setFilterBarItems] = useState(null);
  const [secondaryFilterBarItems, setSecondaryFilterBarItems] = useState(null);
  const [currentSelectedCategory, setCurrentSelectedCategory] = useState(null);
  const [parkFilterItem, setParkFilterItem] = useState(cleanedData);
  const {
    params: { parkId },
  } = props.match;

  const { filter, setFilter, emptyFilters, setEmptyFilters } =
    useManagedStory();

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
            casualClassifications: simp.classification?.map((landClass) => {
              return landClass.name;
            }),
          });
        });
        return cleanedPlate;
      });
      console.log(cleanedPlate);
      setCleanedData(cleanedPlate);
      setRawAreaData(data.property.childProp);
      setFilterBarItems([
        ...new Set(
          cleanedPlate?.map((cleanVal) => cleanVal.casualCategoryName)
        ),
      ]);
    },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  console.log(filterBarItems);

  const secondaryClean = (currCategory) => {
    console.log(currCategory);
    console.log(cleanedData);
    let filterShire = [];
    cleanedData?.map((cleanSubVal) => {
      if (cleanSubVal.casualCategoryName === currCategory) {
        console.log("its true focker");
        filterShire.push(cleanSubVal.casualClassifications);
      }
    });
    setSecondaryFilterBarItems([...new Set(filterShire.flat(Infinity))]);
    console.log(filterShire.flat(Infinity));
    return filterShire;
  };

  const filterItem = (currCategory) => {
    console.log(currCategory);
    secondaryClean(currCategory);
    const newItem = cleanedData?.filter((newVal) => {
      setCurrentSelectedCategory(currCategory);
      return newVal.casualCategoryName === currCategory;
    });
    setParkFilterItem(newItem);
  };
  console.log(secondaryFilterBarItems);

  const secondaryFilterItem = (currSubCategory) => {
    console.log(currSubCategory);
    const newSubItem = cleanedData?.filter((newVal) => {
      return (
        newVal.casualCategoryName === currentSelectedCategory &&
        newVal.casualClassifications?.includes(currSubCategory)
      );
    });
    setParkFilterItem(newSubItem);
  };

  return (
    <Fragment>
      <div className="topBlock">
        <Logout />
        <h1>Parks and Maps</h1>
        <h2>{parkId}</h2>
      </div>
      <MainFilterWrapper>
        {filterBarItems?.length > 1 &&
          filterBarItems?.map((menuVals, index) => {
            return (
              <PropertyFilterBtn
                onClick={() => filterItem(menuVals)}
                key={index}
              >
                {menuVals}
              </PropertyFilterBtn>
            );
          })}
        {/* <button onClick={() => setParkFilterItem(cleanedData)}>All</button> */}
      </MainFilterWrapper>
      <SubFilterWrapper className="d-flex justify-content-center secondaryFilter">
        {secondaryFilterBarItems?.length > 1 &&
          secondaryFilterBarItems?.map((subMenuVals, index) => {
            return (
              <PropertySubFilterBtn
                onClick={() => secondaryFilterItem(subMenuVals)}
                key={index}
              >
                {subMenuVals}
              </PropertySubFilterBtn>
            );
          })}
        {/* <button onClick={() => setParkFilterItem(cleanedData)}>All</button> */}
      </SubFilterWrapper>
      <Fragment>
        {parkFilterItem?.map((propArea) => (
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
