import React, { Fragment } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useQuery, gql, useMutation } from "@apollo/client";
import { useManagedStory } from "../contexts/StoryContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import NewUserFlow from "./NewUserFlow";

export default function Journal(props, match, location) {
  const { user } = useAuth0();

  const {
    userJournalId,
    rawVisitData,
    setRawVisitData,
    setUserJournalId,
    newUserStatus,
  } = useManagedStory();

  const AUTHOR_CHECK = gql`
    query getAuthorStatus {
      author(where: { email: "${user.email}" }) {
        bio
        email
        name
        auth0id
      }
    }
  `;
  const JOURNAL_CHECK = gql`
    query getJournalStatus {
      journals(where: { author: { auth0id: "${user.sub}" } }) {
        id
        name
      }
    }
  `;
  const CREATE_NEW_AUTHOR = gql`
    mutation CreateNewAuthor {
      createAuthor(data: {email: "${user.email}", name: "${user.name}", auth0id: "${user.sub}"}) {
        auth0id
        email
        name
        stage
      }
      publishAuthor(where: {email: "${user.email}"}, to: PUBLISHED) {
        id
      }
      createJournal(data: {author: {connect: {auth0id: "${user.sub}", email: "${user.email}"}}, name: "${user.name}'s Journal"}) {
        id
        name
      }
    }
  `;

  const GET_USER_VISIT_DATA = gql`
    query getUserVisitData {
      journals(where: {author: {auth0id: "${user.sub}"}}) {
    chapters {
      date
      id
      title
      stories {
        id
        landmarkId
        landmarkName
        title
        visits {
          id
          landmark {
            id
            name
            park {
              id
              name
            }
          }
        }
      }
    }
  }
    }
  `;

  const {
    loading: authorQueryLoading,
    error: authorQueryError,
    data: authorQueryData,
  } = useQuery(AUTHOR_CHECK, {
    pollInterval: 10000,
  });

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
    loading: visitDataQueryLoading,
    error: visitDataQueryError,
    data: visitQueryData,
  } = useQuery(GET_USER_VISIT_DATA);

  // visitQueryData?.journals?.[0] && {

  // }

  // setRawVisitData( userVisitChapters)
  // console.log(userVisitChapters);
  // console.log(visitQueryData?.journals?.[0].chapters.length);

  if (visitQueryData?.journals?.[0]?.chapters?.length > 0) {
    const userChapters = visitQueryData?.journals?.[0].chapters;
    setRawVisitData(userChapters);
  } else {
    console.log("fresh fish");
  }

  console.log(rawVisitData);

  const [createAuthor] = useMutation(CREATE_NEW_AUTHOR);

  const PUBLISH_JOURNAL = gql`
      mutation PublishJournal {
        publishJournal(where: {id: "${userJournalId}"}) {
      publishedAt
      }
      }
      `;

  const [publishUserJournal] = useMutation(PUBLISH_JOURNAL);

  if (authorQueryLoading || journalQueryLoading) return <p>Loading...</p>;
  if (authorQueryError || journalQueryError) return <p>Error :(</p>;

  const newUserCriteria =
    authorQueryData?.author === null || journalQueryData?.journals.length === 0;

  console.log(newUserCriteria);

  return (
    <Fragment>
      <h3 style={{ marginTop: "3em" }}>Journal</h3>

      {(newUserCriteria || newUserStatus === true) && (
        <NewUserFlow style={{ position: "absolute" }} />
      )}

      {rawVisitData &&
        rawVisitData.map((visit, i) => (
          <>
            <div key={i}>
              <h3>{visit.date}</h3>
              <h4>{visit?.stories[0]?.visits[0]?.landmark?.park?.name}</h4>
              {console.log(visit?.stories?.landmarkId)}
              {/* {console.log(visit?.stories[0]?.visits[0]?.landmark?.park?.name)} */}
              {console.log(visit?.stories[0]?.visits)}
              {visit?.stories.map((story, landmarkId, index, visits) => (
                <>
                  <h3>
                    {story.landmarkName !== null
                      ? story.landmarkName
                      : story.landmarkId}
                  </h3>
                  <p>X {story?.visits.length}</p>
                </>
              ))}
            </div>
          </>
        ))}
      <ToastContainer />
    </Fragment>
  );
}
