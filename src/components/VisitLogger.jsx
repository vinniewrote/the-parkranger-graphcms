import React, { Fragment } from "react";
import { request } from "graphql-request";
import { useQuery, gql, useMutation } from "@apollo/client";
import { useManagedStory } from "../contexts/StoryContext";
import { useAuth0 } from "@auth0/auth0-react";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";

export default function VisitLogger(props) {
  const landmarkId = props.landmarkId;
  const landmarkName = props.landmarkName;
  const { user, isAuthenticated } = useAuth0();

  const { savedLandmarkId, currentDate, dayName } = useManagedStory();

  const CREATE_NEW_JOURNAL = gql`
    mutation CreateNewJournal {
      createJournal(data: {author: {connect: {auth0id: "${user.sub}", email: "${user.email}"}}, name: "${user.name}'s Journal", chapters: {create: {title: "${dayName}'s Experience", date: "${currentDate}", stories: {create: {title: "${landmarkName}'s Story", visits: {create: {title: "${landmarkName}'s visit", destination: {connect: {Landmark: {id: "{landmarkId}"}}}}}}}}}}) {
        id
        name
        chapters {
          date
          id
          title
        }
      }
    }
    # add a publish mutation for journal. look for other publish/draft requirements in other querys/mutations
  `;

  const GET_CHAPTER_DATE = gql`
    query GetChapterDate {
      chapters(where: { journal: { id: "ckm9da8wgon8n0977uqxo8vzr" } }) {
        date
        id
        stage
        title
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
  const {
    loading: journalQueryLoading,
    error: journalQueryError,
    data: journalQueryData,
  } = useQuery(JOURNAL_CHECK);

  const CREATE_NEW_CHAPTER = gql`
    mutation CreateNewChapter {
      createChapter(
        data: {
          journal: { connect: { id: "ckltst54o6zye0a71dhr2tixi" } }
          date: "${currentDate}"
          title: "${dayName}'s Adventure"
        }
      ) {
        date
        id
        title
      }
    }
  `;
  // const CHECK_FOR_LANDMARK = gql``;
  // const NEW_STORY = gql``;
  // const NEW_VISIT = gql``;
  // const UPDATE_VISIT = gql``;

  const [createJournal] = useMutation(CREATE_NEW_JOURNAL);
  const [createNewChapter] = useMutation(CREATE_NEW_CHAPTER);
  const {
    loading: chapterQueryLoading,
    error: chapterQueryError,
    data: chapterQueryData,
  } = useQuery(GET_CHAPTER_DATE, {
    pollInterval: 2000,
  });
  const currentChapterDate = chapterQueryData;
  // const isDateSynced = currentChapterDate === currentDate;
  console.log(currentChapterDate);
  // console.log(`check for date match ${isDateSynced}`);
  const chapterMap =
    chapterQueryData !== undefined
      ? chapterQueryData.chapters.map(({ id, date }) => <p key={id}>{date}</p>)
      : console.log("no mapping yet");
  if (chapterQueryData !== undefined) console.log(chapterMap);

  const journalMap =
    journalQueryData !== undefined
      ? journalQueryData.journals.map(({ id, name }) => <p key={id}>{id}</p>)
      : console.log("no mapping yet");
  if (journalQueryData !== undefined) console.log(journalMap);
  return (
    <Fragment>
      <button
        onClick={() => {
          createJournal();
          console.log("created a new user journal.");
        }}
      >
        +
      </button>
      {chapterMap}
      {journalMap}
      <ToastContainer />
    </Fragment>
  );
}
