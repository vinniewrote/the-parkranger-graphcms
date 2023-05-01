import React, { Fragment } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useQuery, gql, useMutation } from "@apollo/client";
import { useManagedStory } from "../contexts/StoryContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import NewUserFlow from "./NewUserFlow";
import {
  PropertyName,
  PropertyVisitCount,
  PropertyCountBlock,
  ChapterPropertyTitle,
  ChapterPropertySubTitle,
  ChapterDisplayBlock,
} from "../styledComponents/Journal_styled";
import {
  JOURNAL_CHECK,
  AUTHOR_CHECK,
  GET_USER_VISIT_DATA,
} from "../graphql/queries/journalQueries";

export default function Journal(props, match, location) {
  const { user } = useAuth0();

  const {
    userJournalId,
    rawVisitData,
    setRawVisitData,
    setUserJournalId,
    newUserStatus,
  } = useManagedStory();

  /************************************************ QUERIES *****************************************************/

  const {
    loading: journalQueryLoading,
    error: journalQueryError,
    data: journalQueryData,
  } = useQuery(JOURNAL_CHECK, {
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

  const {
    loading: visitDataQueryLoading,
    error: visitDataQueryError,
    data: visitQueryData,
  } = useQuery(GET_USER_VISIT_DATA, {
    variables: { authZeroId: user.sub },
    onCompleted() {
      console.log(visitQueryData);
      setRawVisitData(visitQueryData?.journals?.[0].chapters);
    },
  });

  console.log(rawVisitData);

  if (authorQueryLoading || journalQueryLoading) return <p>Loading...</p>;
  if (authorQueryError || journalQueryError) return <p>Error :(</p>;

  const newUserCriteria =
    authorQueryData?.author === null || journalQueryData?.journals.length === 0;

  return (
    <Fragment>
      <h3 style={{ marginTop: "3em" }}>Journal</h3>

      {(newUserCriteria || newUserStatus === true) && (
        <NewUserFlow style={{ position: "absolute" }} />
      )}

      {rawVisitData &&
        rawVisitData.map((visit, i) => (
          <>
            <ChapterDisplayBlock key={i}>
              <ChapterPropertyTitle>
                {visit?.stories[0]?.visits[0]?.landmark?.park?.name}
              </ChapterPropertyTitle>
              <ChapterPropertySubTitle>{visit.date}</ChapterPropertySubTitle>
              {/* {console.log(visit?.stories?.landmarkId)} */}
              {/* {console.log(visit?.stories[0]?.visits[0]?.landmark?.park?.name)} */}
              {/* {console.log(visit?.stories[0]?.visits)} */}
              {visit?.stories.map((story, landmarkId, index, visits) => (
                <PropertyCountBlock>
                  <PropertyName>{story.landmarkName}</PropertyName>
                  <PropertyVisitCount>
                    x<span>{story?.visits.length}</span>{" "}
                  </PropertyVisitCount>
                </PropertyCountBlock>
              ))}
            </ChapterDisplayBlock>
          </>
        ))}
      <ToastContainer />
    </Fragment>
  );
}
