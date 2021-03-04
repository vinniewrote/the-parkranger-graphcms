import React, { Fragment } from "react";
import { request } from "graphql-request";
import { useQuery, gql, useMutation } from "@apollo/client";
import { useManagedStory } from "../contexts/StoryContext";
import { useAuth0 } from "@auth0/auth0-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";

export default function VisitLogger(props) {
  const landmarkId = props.landmarkId;
  const landmarkName = props.landmarkName;
  const newDate = new Date();
  const currentDate = newDate.toDateString();
  const currentDay = newDate.getDay();
  const { user, isAuthenticated } = useAuth0();

  const {
    savedStoryId,
    setSavedStoryId,
    journalStatus,
    setJournalStatus,
    savedJournalId,
    setSavedJournalId,
    savedChapterId,
    setSavedChapterId,
    savedLandmarkId,
    setSavedLandmarkId,
  } = useManagedStory();

  const mergeLandmarkIds = () => savedLandmarkId.push(landmarkId);

  const weekday = new Array(7);
  weekday[0] = "Sunday";
  weekday[1] = "Monday";
  weekday[2] = "Tuesday";
  weekday[3] = "Wednesday";
  weekday[4] = "Thursday";
  weekday[5] = "Friday";
  weekday[6] = "Saturday";

  let dayName = weekday[newDate.getDay()];

  console.log(newDate);

  console.log(currentDate);

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
  `;

  const GET_CHAPTER_DATE = gql`
    query GetChapterDate {
      journals(
        where: { author: { auth0id: "google-oauth2|114631981982606367806" } }
      ) {
        id
        name
        chapters {
          date
          id
        }
      }
    }
  `;

  // const CREATE_CHAPTER = gql``;
  // const NEW_STORY = gql``;
  // const NEW_VISIT = gql``;
  // const UPDATE_VISIT = gql``;

  const [createJournal, { journalData }] = useMutation(CREATE_NEW_JOURNAL);
  const { loading, error, data } = useQuery(GET_CHAPTER_DATE, {
    pollInterval: 500,
  });
  const currentChapterDate = data;
  // const isDateSynced = currentChapterDate === currentDate;
  console.log(currentChapterDate);
  // console.log(`check for date match ${isDateSynced}`);

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
      <ToastContainer />
    </Fragment>
  );
}
