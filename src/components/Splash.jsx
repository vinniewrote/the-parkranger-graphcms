import React, { Fragment, useState } from "react";
import { useQuery, gql, useMutation } from "@apollo/client";
import { useAuth0 } from "@auth0/auth0-react";
import { ToastContainer, toast } from "react-toastify";
import { JOURNAL_CHECK } from "../graphql/queries/journalQueries";
import {
  NEW_AUTHOR_STEP_ONE,
  NEW_AUTHOR_STEP_TWO,
  NEW_AUTHOR_STEP_THREE,
} from "../graphql/mutations/journalMutations";
import { useManagedStory } from "../contexts/StoryContext";

export default function Splash() {
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
  });

  const [newAuthorStepThree, { data, loading, error }] = useMutation(
    NEW_AUTHOR_STEP_THREE,
    {
      variables: {
        authZeroId: user.sub,
        authZeroEmail: user.email,
        authZeroName: user.name,
      },

      onCompleted() {
        console.log("step 3 done");
      },
    }
  );

  const [newAuthorStepTwo] = useMutation(NEW_AUTHOR_STEP_TWO, {
    variables: {
      authZeroEmail: user.email,
    },
    onCompleted: () => console.log("completed step 2"),
  });

  const [newAuthorStepOne] = useMutation(NEW_AUTHOR_STEP_ONE, {
    variables: {
      authZeroId: user.sub,
      authZeroEmail: user.email,
      authZeroName: user.name,
    },
    onCompleted: () => newAuthorStepTwo(),
  });

  console.log(authorQueryData?.author);
  console.log(journalQueryData);

  const deactivateAuthorStep = authorQueryData?.author?.auth0id !== null;
  console.log(`deactivated author step: ${deactivateAuthorStep}`);

  return authorQueryData?.author === null ||
    journalQueryData?.journals.length === 0 ? (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "1em 1.25em",
        }}
        className={
          authorQueryData?.author?.auth0id !== null
            ? "openTask task"
            : "closedTask task"
        }
      >
        <h4>Welcome to Park Ranger</h4>
        <div className="stepWrapper">
          <h5>Looks like you are new here :) </h5>

          <button
            disabled={authorQueryData?.author !== null}
            onClick={(event) => {
              event.preventDefault();
              newAuthorStepOne();
              toast("activating your Ranger author");
            }}
          >
            Begin
          </button>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "1em 1.25em",
        }}
        className={
          authorQueryData?.author?.auth0id === null
            ? "openTask task"
            : "closedTask task"
        }
      >
        <h5>Step 1 of 2</h5>
        <div className="stepWrapper">
          <p>Activate your Ranger Journal</p>
          <button
            style={{}}
            // disabled={}
            onClick={(event) => {
              event.preventDefault();
              newAuthorStepThree();
              toast("setting up your Ranger journal");
            }}
          >
            Activate
          </button>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "1em 1.25em",
        }}
        className={
          journalQueryData?.journals.length === 0
            ? "openTask task"
            : "closedTask task"
        }
      >
        <h5>Step 2 of 2</h5>
        <div className="stepWrapper">
          <p>Success! Now track your visits.</p>
          <button
            style={{}}
            onClick={(event) => {
              event.preventDefault();
              // createAuthor();
              // publishUserJournal();
              toast("taking you to your journal");
            }}
          >
            Go
          </button>
        </div>
      </div>
    </div>
  ) : (
    <div>
      Splash details. Just some basic text for authenticated users logging for
      the first time.
    </div>
  );
}
