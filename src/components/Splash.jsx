import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import { useAuth0 } from "@auth0/auth0-react";
import { JOURNAL_CHECK, AUTHOR_CHECK } from "../graphql/queries/journalQueries";
import { useManagedStory } from "../contexts/StoryContext";
import NewUserFlow from "./NewUserFlow";

export default function Splash() {
  const { user } = useAuth0();
  const { userJournalId, setUserJournalId, newUserStatus, setNewUserStatus } =
    useManagedStory();

  const {
    loading: journalQueryLoading,
    error: journalQueryError,
    data: journalQueryData,
  } = useQuery(JOURNAL_CHECK, {
    pollInterval: 10000,
    variables: { authZeroId: user.sub },
    context: { clientName: "authorLink" },
    onCompleted: () => {
      journalQueryData?.journals?.map(({ id }) => {
        console.log(`id posted ${id}`);
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

  console.log(authorQueryData?.author);
  console.log(journalQueryData);

  const deactivateAuthorStep = authorQueryData?.author?.auth0id !== null;
  console.log(`deactivated author step: ${deactivateAuthorStep}`);

  const newUserCriteria =
    authorQueryData?.author === null ||
    journalQueryData?.journals?.length === 0;

  console.log(newUserCriteria);

  return newUserCriteria || newUserStatus === true ? (
    <NewUserFlow />
  ) : (
    <div>
      Splash details. Just some basic text for authenticated users logging for
      the first time.
    </div>
  );
}
