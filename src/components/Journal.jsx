import React, { Fragment } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useQuery } from "@apollo/client";
import { useManagedStory } from "../contexts/StoryContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import NewUserFlow from "./NewUserFlow";
import Logout from "../components/LogoutButton";
import {
  PropertyName,
  PropertyLocation,
  PropertyTitleWrapper,
  PropertyVisitCount,
  PropertyCountValue,
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
    rawVisitData,
    setRawVisitData,
    userJournalId,
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
    context: { clientName: "authorLink" },
    onCompleted: () => {
      journalQueryData?.journals.map(({ id }) => {
        setUserJournalId(id);
      });
      console.log(journalQueryData);
    },
  });

  const {
    loading: authorQueryLoading,
    error: authorQueryError,
    data: authorQueryData,
  } = useQuery(AUTHOR_CHECK, {
    pollInterval: 10000,
    variables: { authZeroEmail: user.email },
    context: { clientName: "authorLink" },
  });

  const {
    loading: visitDataQueryLoading,
    error: visitDataQueryError,
    data: visitQueryData,
  } = useQuery(GET_USER_VISIT_DATA, {
    variables: { journalTracker: userJournalId },
    context: { clientName: "authorLink" },
    onCompleted() {
      console.log(visitQueryData?.journal?.chapters);
      setRawVisitData(visitQueryData?.journal?.chapters);
    },
  });

  console.log(rawVisitData);

  if (authorQueryLoading || journalQueryLoading) return <p>Loading...</p>;
  if (authorQueryError || journalQueryError) return <p>Error :(</p>;

  const newUserCriteria =
    authorQueryData?.author === null || journalQueryData?.journal?.length === 0;

  return (
    <Fragment>
      <div className="topBlock">
        <Logout />
        <h1>Journal</h1>
        <h2>Subheader Text</h2>
      </div>

      {(newUserCriteria || newUserStatus === true) && (
        <NewUserFlow style={{ position: "absolute" }} />
      )}

      {rawVisitData?.length > 0 &&
        rawVisitData?.map((visit, i) => (
          <>
            <ChapterDisplayBlock key={i}>
              <ChapterPropertyTitle>{visit?.title}</ChapterPropertyTitle>
              <ChapterPropertySubTitle>{visit.date}</ChapterPropertySubTitle>
              {/* {visit?.stories.map((story, index, id) => (
                <PropertyCountBlock>
                  <PropertyTitleWrapper>
                    <PropertyName>{story?.property?.name}</PropertyName>
                    <PropertyLocation>
                      {`${story?.property?.category?.pluralName} - ${story?.property?.park?.name}`}
                    </PropertyLocation>
                  </PropertyTitleWrapper>
                  <PropertyVisitCount>
                    <PropertyCountValue>
                      {`x ${story?.property?.visits?.length}`}
                    </PropertyCountValue>
                  </PropertyVisitCount>
                </PropertyCountBlock>
              ))} */}
            </ChapterDisplayBlock>
          </>
        ))}
      <ToastContainer />
    </Fragment>
  );
}
