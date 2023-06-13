import React from "react";
import { ToastContainer, toast } from "react-toastify";
import { useQuery, useMutation } from "@apollo/client";
import { useAuth0 } from "@auth0/auth0-react";
import { JOURNAL_CHECK, AUTHOR_CHECK } from "../graphql/queries/journalQueries";
import {
  NEW_AUTHOR_STEP_ONE,
  NEW_AUTHOR_STEP_TWO,
  NEW_AUTHOR_STEP_THREE,
  PUBLISH_JOURNAL,
} from "../graphql/mutations/journalMutations";
import { useManagedStory } from "../contexts/StoryContext";
import "react-toastify/dist/ReactToastify.min.css";

export default function NewUserFlow() {
  const {
    userJournalId,
    setUserJournalId,
    newUserStatus,
    setNewUserStatus,
    setAuthorId,
    authorId,
  } = useManagedStory();
  const { user } = useAuth0();

  const {
    loading: authorQueryLoading,
    error: authorQueryError,
    data: authorQueryData,
  } = useQuery(AUTHOR_CHECK, {
    pollInterval: 40000,
    variables: { authZeroEmail: user.email },
    context: { clientName: "authorLink" },
  });

  const {
    loading: journalQueryLoading,
    error: journalQueryError,
    data: journalQueryData,
  } = useQuery(JOURNAL_CHECK, {
    pollInterval: 40000,
    variables: { authZeroId: user.sub },
    context: { clientName: "authorLink" },
    onCompleted: () => {
      // journalQueryData?.journal.map(({ id }) => {
      //   setUserJournalId(id);
      // });
      console.log(journalQueryData);
    },
  });
  //create journal
  const [
    newAuthorStepThree,
    {
      data: stepThreeAuthorData,
      loading: stepThreeAuthorLoading,
      error: stepThreeAuthorError,
    },
  ] = useMutation(NEW_AUTHOR_STEP_THREE, {
    variables: {
      authIdentifier: authorId,
      authZeroName: user.nickname,
    },
    context: { clientName: "authorLink" },
    // refetchQueries: [
    //   { query: JOURNAL_CHECK }, // DocumentNode object parsed
    //   "getJournalStatus", // Query name
    // ],
    onCompleted() {
      console.log("step 3 done");
      console.log(stepThreeAuthorData?.createJournal);
      setUserJournalId(stepThreeAuthorData?.createJournal?.id);
    },
  });
  //publish author
  const [
    newAuthorStepTwo,
    {
      data: stepTwoAuthorData,
      loading: stepTwoAuthorLoading,
      error: stepTwoAuthorError,
    },
  ] = useMutation(NEW_AUTHOR_STEP_TWO, {
    variables: {
      authIdentifier: authorId,
    },
    context: { clientName: "authorLink" },
    onCompleted() {
      console.log(stepTwoAuthorData);
    },
  });
  //create author
  const [
    newAuthorStepOne,
    {
      data: stepOneAuthorData,
      loading: stepOneAuthorLoading,
      error: stepOneAuthorError,
    },
  ] = useMutation(NEW_AUTHOR_STEP_ONE, {
    variables: {
      authZeroId: user.sub,
      authZeroEmail: user.email,
      authZeroName: `${user.nickname} Author`,
    },
    context: { clientName: "authorLink" },
    onCompleted() {
      setAuthorId(stepOneAuthorData.createAuthor.id);
      newAuthorStepTwo();
    },
  });

  const [publishJournal] = useMutation(PUBLISH_JOURNAL, {
    variables: {
      authJournalId: userJournalId || localStorage.getItem("newJournalId"),
    },
    context: { clientName: "authorLink" },
  });

  console.log(authorQueryData?.authors.length);

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "1em 1.25em",
        }}
        className={
          authorQueryData?.authors?.auth0id === null
            ? "openTask task"
            : "closedTask task"
        }
      >
        <h4>Welcome to Park Ranger</h4>
        <div className="stepWrapper">
          <h5>Looks like you are new here :) </h5>

          <button
            disabled={authorQueryData?.authors.length !== 0}
            onClick={(event) => {
              event.preventDefault();
              setNewUserStatus(true);
              newAuthorStepOne();

              toast("activating your Ranger author", {
                onClose: () => console.log("author created"),
              });
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
          journalQueryData?.journals?.length === 0
            ? "openTask task"
            : "closedTask task"
        }
      >
        <h5>Step 1 of 2</h5>
        <div className="stepWrapper">
          <p>Activate your Ranger Journal</p>
          <button
            style={{}}
            disabled={journalQueryData?.journals?.length === 1}
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
        className={newUserStatus === true ? "openTask task" : "closedTask task"}
      >
        <h5>Step 2 of 2</h5>
        <div className="stepWrapper">
          <p>Success! Now track your visits.</p>
          <button
            style={{}}
            onClick={(event) => {
              event.preventDefault();
              publishJournal();
              setNewUserStatus(false);
              toast("taking you to your journal");
            }}
          >
            Go
          </button>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
