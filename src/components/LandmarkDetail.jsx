import React, { Fragment, useState } from "react";
import VisitLogger from "./VisitLogger";
import { useQuery } from "@apollo/client";
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

export default function LandmarkDetail(props, match) {
  const {
    params: { id },
  } = props.match;
  const { user } = useAuth0();
  const { setUserJournalId, newUserStatus } = useManagedStory();
  const [localPropertyData, setLocalPropertyData] = useState(null);

  const {
    loading: journalQueryLoading,
    error: journalQueryError,
    data: journalQueryData,
  } = useQuery(JOURNAL_CHECK, {
    pollInterval: 10000,
    variables: { authZeroId: user.sub },
    onCompleted: () => {
      journalQueryData.journals.map(({ id }) => {
        setUserJournalId(id);
      });
    },
  });

  const {
    loading: authorQueryLoading,
    error: authorQueryError,
    data: authorQueryData,
  } = useQuery(AUTHOR_CHECK, {
    pollInterval: 10000,
    variables: { authZeroEmail: user.email },
  });

  const { loading, error, data } = useQuery(LANDMARK_DETAILS, {
    variables: { propertyId: `${id}` },
    context: { clientName: "readOnlyLink" },
    onCompleted() {
      setLocalPropertyData(data.property);
    },
  });

  // console.log(authorQueryData?.author);
  // console.log(journalQueryData);

  // const deactivateAuthorStep = authorQueryData?.author?.auth0id !== null;
  // console.log(`deactivated author step: ${deactivateAuthorStep}`);

  const newUserCriteria =
    authorQueryData?.author === null || journalQueryData?.journals.length === 0;

  // console.log(newUserCriteria);

  console.log(localPropertyData?.liveDataID?.wikiLive?.liveData[0].status);
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
          <h2 key={`${localPropertyData?.name} - ${localPropertyData?.id}`}>
            {localPropertyData?.name}
          </h2>

          <p key={`${localPropertyData?.timeline[0]?.year} - ${id}`}>
            {localPropertyData?.timeline[0]?.year !== null
              ? `@ ${localPropertyData?.timeline[0]?.year}`
              : ""}
          </p>

          <div className="isPropertyOpen">
            <p>
              {`The Property is now ${localPropertyData?.liveDataID?.wikiLive?.liveData[0].status}`}
            </p>
          </div>
        </div>
        <div>
          <InfoBlockWrapper>
            <VisitLogger
              key={`${localPropertyData?.name} - ${localPropertyData?.id}`}
              landmarkId={localPropertyData?.id}
              landmarkName={localPropertyData?.name}
            />
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
