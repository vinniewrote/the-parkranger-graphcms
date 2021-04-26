import React, { Fragment } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useQuery, gql, useMutation } from "@apollo/client";
import { useManagedStory } from "../contexts/StoryContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";

export default function Journal(props, match, location) {
  const { user } = useAuth0();

  const { userJournalId, setUserJournalId } = useManagedStory();

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

  const {
    loading: authorQueryLoading,
    error: authorQueryError,
    data: authorQueryData,
  } = useQuery(AUTHOR_CHECK, {
    pollInterval: 500,
  });
  console.log(authorQueryData);
  const {
    loading: journalQueryLoading,
    error: journalQueryError,
    data: journalQueryData,
  } = useQuery(JOURNAL_CHECK, {
    pollInterval: 500,
  });

  const [createAuthor] = useMutation(CREATE_NEW_AUTHOR);

  const journalMap =
    journalQueryData !== undefined
      ? journalQueryData.journals.map(({ id }) => {
          setUserJournalId(id);
        })
      : console.log("no data available yet");

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

  return (
    <Fragment>
      <h3 style={{ marginTop: "3em" }}>Journal</h3>
      {authorQueryData.author === null ? (
        <Fragment>
          <div
            className="ActivateJournal"
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "1em 1.25em",
              boxShadow: "0px 11px 10px 0px rgba(107,104,107,1)",
            }}
          >
            <p>Please click here to activate your Park Ranger Journal</p>
            <button
              style={{
                height: "3em",
                backgroundColor: "orange",
                border: "1px solid darkorange",
                borderRadius: "5px",
                alignSelf: "center",
                cursor: "pointer",
              }}
              onClick={() => {
                createAuthor();
                publishUserJournal();
                toast("registering your journal");
              }}
            >
              Start Journaling!
            </button>
          </div>
        </Fragment>
      ) : (
        <Fragment>
          <div>Youre in! Start journaling</div>
        </Fragment>
      )}
      <ToastContainer />
    </Fragment>
  );
}
