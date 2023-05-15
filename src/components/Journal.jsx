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

  const { rawVisitData, setRawVisitData, setUserJournalId, newUserStatus } =
    useManagedStory();

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
      <div className="topBlock">
        <Logout />
        <h1>Journal</h1>
        <h2>Subheader Text</h2>
      </div>

      {(newUserCriteria || newUserStatus === true) && (
        <NewUserFlow style={{ position: "absolute" }} />
      )}

      {rawVisitData &&
        rawVisitData.map((visit, i) => (
          <>
            <ChapterDisplayBlock key={i}>
              <ChapterPropertyTitle>{visit?.title}</ChapterPropertyTitle>
              <ChapterPropertySubTitle>{visit.date}</ChapterPropertySubTitle>
              {visit?.stories.map((story, landmarkId, index, visits) => (
                <PropertyCountBlock>
                  <PropertyTitleWrapper>
                    <PropertyName>{story.landmarkName}</PropertyName>
                    <PropertyLocation>
                      {`${story?.landmark?.category?.pluralName} - ${story?.landmark?.park?.name}`}
                    </PropertyLocation>
                  </PropertyTitleWrapper>
                  <PropertyVisitCount>
                    <PropertyCountValue>
                      {`x ${story?.visits.length}`}
                    </PropertyCountValue>
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
