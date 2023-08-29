import React, { Fragment, useState } from "react";
import VisitLogger from "./VisitLogger";
import { empty, useQuery } from "@apollo/client";
import { useAuth0 } from "@auth0/auth0-react";
import { useManagedStory } from "../contexts/StoryContext";
import {
  JOURNAL_CHECK,
  AUTHOR_CHECK,
  LANDMARK_DETAILS,
} from "../graphql/queries/journalQueries";
import {
  InfoBlockWrapper,
  LoggingCountContainer,
  SpecsBlockWrapper,
  SpecsContainer,
  YourVisitsBlock,
} from "../styledComponents/LandmarkDetails_styled";
import NewUserFlow from "./NewUserFlow";
import Logout from "../components/LogoutButton";
import { element } from "prop-types";

export default function LandmarkDetail(props, match) {
  const {
    params: { id, parkId },
  } = props.match;
  const { user } = useAuth0();
  const { setUserJournalId, newUserStatus, setAuthorId } = useManagedStory();
  const [localPropertyData, setLocalPropertyData] = useState(null);
  const [propertyDestinationId, setPropertyDestinationId] = useState(null);

  const {
    loading: journalQueryLoading,
    error: journalQueryError,
    data: journalQueryData,
  } = useQuery(JOURNAL_CHECK, {
    pollInterval: 10000,
    variables: { authZeroId: user.sub },
    context: { clientName: "authorLink" },
    onCompleted: () => {
      journalQueryData?.journal?.map(({ id }) => {
        setUserJournalId(id);
      });
    },
  });

  const {
    loading: authorQueryLoading,
    error: authorQueryError,
    data: authorQueryData,
  } = useQuery(AUTHOR_CHECK, {
    pollInterval: 40000,
    variables: { authZeroId: user.sub },
    context: { clientName: "authorLink" },
    onCompleted() {
      setAuthorId(authorQueryData?.authors[0]?.id);
    },
  });

  const { loading, error, data } = useQuery(LANDMARK_DETAILS, {
    variables: { propertyId: id, authZeroId: user.sub },
    context: { clientName: "authorLink" },
    onCompleted() {
      console.log(data.property);
      setLocalPropertyData(data.property);
    },
  });

  // console.log(authorQueryData?.author);
  // console.log(journalQueryData);

  // const deactivateAuthorStep = authorQueryData?.author?.auth0id !== null;
  // console.log(`deactivated author step: ${deactivateAuthorStep}`);

  const newUserCriteria =
    authorQueryData?.author === null || journalQueryData?.journal?.length === 0;
  let emptyDestinationArray = [];
  const propertyParent =
    localPropertyData?.location?.length > 0 &&
    localPropertyData?.location.map((parent) => {
      emptyDestinationArray.push({
        categoryName: parent.category.name,
        categoryId: parent.id,
        cluster: parent.category.cluster,
      });
    });
  console.log(emptyDestinationArray);
  const foundDistrict =
    emptyDestinationArray.length > 0 &&
    emptyDestinationArray.find(
      (element) =>
        element.categoryName === "District" && element.cluster === true
    );
  // console.log(foundDistrict);
  const foundHotel =
    emptyDestinationArray.length > 0 &&
    emptyDestinationArray.find(
      (element) => element.categoryName === "Hotel" && element.cluster === true
    );
  // console.log(foundHotel);
  const foundShip =
    emptyDestinationArray.length > 0 &&
    emptyDestinationArray.find(
      (element) =>
        element.categoryName === "Cruise ship" && element.cluster === true
    );
  const foundPark =
    emptyDestinationArray.length > 0 &&
    emptyDestinationArray.find(
      (element) => element.categoryName === "Park" && element.cluster === true
    );
  // console.log(foundPark);
  const foundDestination =
    emptyDestinationArray.length > 0 &&
    emptyDestinationArray.find(
      (element) =>
        element.categoryName === "Destination" && element.cluster === true
    );
  // setPropertyDestinationId(foundDestination.categoryId);
  // const setFoundDestInContext =
  //   foundDestination !== null && setPropertyDestinationId(foundDestination);
  // console.log(newUserCriteria);
  console.log(localPropertyData);
  console.log(localPropertyData?.location);
  console.log(localPropertyData?.liveDataID?.wikiLive?.liveData[0]?.status);
  console.log(localPropertyData?.stats);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <Fragment>
      {(newUserCriteria || newUserStatus === true) && (
        <NewUserFlow style={{ position: "absolute" }} />
      )}

      <div>
        <div className="topBlock">
          <Logout />
          <div>{localPropertyData?.category?.name}</div>
          <div className="isPropertyOpen">
            <p>
              {localPropertyData?.liveDataID?.wikiLive?.liveData[0]?.status}
            </p>
          </div>

          <h2 key={`${localPropertyData?.name} - ${localPropertyData?.id}`}>
            {localPropertyData?.name}
          </h2>

          <p key={`${localPropertyData?.timeline[0]?.year} - ${id}`}>
            {localPropertyData?.timeline[0]?.year !== null
              ? `@ ${localPropertyData?.timeline[0]?.year}`
              : ""}
          </p>
        </div>
        <div>
          <InfoBlockWrapper>
            {localPropertyData?.category?.trackable === true ? (
              <VisitLogger
                key={`${localPropertyData?.name} - ${localPropertyData?.id}`}
                landmarkId={localPropertyData?.id}
                landmarkName={localPropertyData?.name}
                destinationId={foundDestination?.categoryId}
                parkId={foundPark?.categoryId}
                hotelId={foundHotel?.categoryId}
                shipId={foundShip?.categoryId}
              />
            ) : (
              <h4>Apologies, this property cannot be logged</h4>
            )}
          </InfoBlockWrapper>
          <h3>Location</h3>
          {localPropertyData?.location.length > 0 &&
            localPropertyData.location.map((locale) => (
              <InfoBlockWrapper>
                <p>{locale.category.name}</p>
                <p>{locale.name}</p>
              </InfoBlockWrapper>
            ))}

          <h3>Summary</h3>
          <InfoBlockWrapper>
            <p key={`${localPropertyData?.summary} - ${localPropertyData?.id}`}>
              {localPropertyData?.summary}
            </p>
            {}
          </InfoBlockWrapper>

          <h3>Creative Team</h3>
          {localPropertyData?.creativeTeam.length > 0 &&
            localPropertyData.creativeTeam.map((member) => (
              <InfoBlockWrapper>
                <p>{member.professionalRole}</p>
                <p>{member.professionalName}</p>
              </InfoBlockWrapper>
            ))}

          <h3>Classification</h3>
          {localPropertyData?.classification.length > 0 &&
            localPropertyData.classification.map((classy) => (
              <InfoBlockWrapper>
                <p>{classy.attribute}</p>
                <p>{classy.name}</p>
              </InfoBlockWrapper>
            ))}

          <h3>Timeline</h3>
          {localPropertyData?.timeline.length > 0 &&
            localPropertyData.timeline.map((timepoint) => (
              <InfoBlockWrapper>
                <p>{timepoint.type}</p>
                <p>{timepoint.year}</p>
              </InfoBlockWrapper>
            ))}

          <h3>Specs</h3>
          <SpecsContainer>
            {localPropertyData?.stats.length > 0 &&
              localPropertyData.stats.map((stat) => (
                <SpecsBlockWrapper>
                  {stat.measurementTime ? (
                    <>
                      <h4>{stat.measurementTime}</h4>{" "}
                      <p>{`${stat.minutes}:${stat.seconds}`}</p>
                    </>
                  ) : (
                    <>
                      <h4> {stat.measurementType}</h4>
                      {stat.unitOfMeasure !== null ? (
                        <p>{`${stat.numericValue}  ${stat.unitOfMeasure}`} </p>
                      ) : (
                        <p>{`${stat.numericValue}`} </p>
                      )}
                    </>
                  )}
                </SpecsBlockWrapper>
              ))}
          </SpecsContainer>
        </div>
      </div>
    </Fragment>
  );
}
