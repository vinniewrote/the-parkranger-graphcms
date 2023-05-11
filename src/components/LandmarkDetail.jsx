import React, { Fragment } from "react";
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
  YourVisitsBlock,
} from "../styledComponents/LandmarkDetails_styled";
import NewUserFlow from "./NewUserFlow";
import Logout from "../components/LogoutButton";

export default function LandmarkDetail(props, match) {
  const {
    params: { id },
  } = props.match;
  const { user } = useAuth0();
  const { setUserJournalId, newUserStatus, rawVisitCount } = useManagedStory();

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
  });

  console.log(authorQueryData?.author);
  console.log(journalQueryData);

  const deactivateAuthorStep = authorQueryData?.author?.auth0id !== null;
  console.log(`deactivated author step: ${deactivateAuthorStep}`);

  const newUserCriteria =
    authorQueryData?.author === null || journalQueryData?.journals.length === 0;

  console.log(newUserCriteria);

  // console.log(data);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <Fragment>
      {(newUserCriteria || newUserStatus === true) && (
        <NewUserFlow style={{ position: "absolute" }} />
      )}

      <Fragment>
        {data.landmarks.map(
          ({
            id,
            name,
            inversions,
            duration,
            openingMonth,
            openingDay,
            openingYear,
            summary,
            gForce,
            speed,
            colorPalette,
            designer,
            park,
            area,
          }) => (
            <div key={`Landmark Detail -  ${id}`}>
              <div className="topBlock">
                <Logout />
                <h2 key={`${name} - ${id}`}>{name}</h2>
                <p key={`${openingYear} - ${id}`}>
                  {openingYear !== null ? `@ ${openingYear}` : ""}
                </p>
              </div>

              <h3>Your Visits</h3>
              <InfoBlockWrapper>
                <VisitLogger
                  key={`${name} - ${id}`}
                  landmarkId={id}
                  landmarkName={name}
                />
                {/* <p>
                  {rawVisitCount?.visits.length > 0
                    ? "Welcome Back"
                    : "You havent been here yet"}
                </p> */}
              </InfoBlockWrapper>
              <h3>Location</h3>
              <InfoBlockWrapper>
                <p key={`${park?.name} - ${id}`}>{park?.name}</p>
                <p key={`${area?.name} - ${id}`}>{area?.name}</p>
              </InfoBlockWrapper>

              <h3>Summary</h3>
              <InfoBlockWrapper>
                <p key={`${summary} - ${id}`}>{summary}</p>
              </InfoBlockWrapper>

              <h3>Specs</h3>
              <>
                {gForce !== null ? (
                  <SpecsBlockWrapper>
                    <h5>GForce</h5>
                    <span key={`${gForce} - ${id}`}>{gForce}</span>
                  </SpecsBlockWrapper>
                ) : (
                  ""
                )}
                {speed !== null ? (
                  <SpecsBlockWrapper>
                    <h5>Speed (in mph)</h5>
                    <span key={`${speed} - ${id}`}>{speed}mph</span>
                  </SpecsBlockWrapper>
                ) : (
                  ""
                )}
              </>

              <h3>Theme</h3>
              <InfoBlockWrapper>
                <div
                  key={`${colorPalette} - ${id} - Block1`}
                  style={{
                    height: "40px",
                    width: "40px",
                    background: `${colorPalette[0]?.hex}`,
                  }}
                />
                <div
                  key={`${colorPalette} - ${id} - Block2`}
                  style={{
                    height: "40px",
                    width: "40px",
                    background: `${colorPalette[1]?.hex}`,
                  }}
                />
                <div
                  key={`${colorPalette} - ${id} - Block3`}
                  style={{
                    height: "40px",
                    width: "40px",
                    background: `${colorPalette[2]?.hex}`,
                  }}
                />
              </InfoBlockWrapper>

              <h3>Creative</h3>
              <InfoBlockWrapper>
                <p key={`designer - ${id}`}>{designer[0]?.name}</p>
              </InfoBlockWrapper>
            </div>
          )
        )}
      </Fragment>
    </Fragment>
  );
}
