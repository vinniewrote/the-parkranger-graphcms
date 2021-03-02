import React, { Fragment } from "react";
import { request } from "graphql-request";
import { gql, useMutation } from "@apollo/client";
import { useManagedStory } from "../contexts/StoryContext";
import { useAuth0 } from "@auth0/auth0-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";

const GRAPHCMS_API =
  "https://api-us-east-1.graphcms.com/v2/ck8g4we3i14kb01xv6avzh80e/master";

export default function VisitLogger(props) {
  const landmarkId = props.landmarkId;
  const landmarkName = props.landmarkName;
  const currentDate = new Date().toDateString();
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
  const checkForLandmark = savedLandmarkId.includes(landmarkId);
  console.log(checkForLandmark);

  const createAJournal = async () => {
    const { createJournal } = await request(
      `${GRAPHCMS_API}`,
      `
    mutation createJournal() {
      createJournal(data: {title: "${landmarkName}-${currentDate}", chapters: {create: {title: "second chapter", stories: {create: {title: "second story", visits: {create: {destination: {connect: {Landmark: {id: "${landmarkId}"}}}}}}}}}}) {
        id
        title
        createdAt
        chapters {
          id
        }
      }
      }
  `
    );
    setJournalStatus(createJournal.title.split("-")[1]);
    setSavedJournalId(createJournal.id);
    setSavedLandmarkId(savedLandmarkId.concat(landmarkId));
    let chapterArray = createJournal.chapters;
    const chapterIds = chapterArray.map((x) => x.id);
    setSavedChapterId(chapterIds[0]);
    toast("landmark logged!");
  };

  const addVisitToStory = async () => {
    const { updateStory } = await request(
      `${GRAPHCMS_API}`,
      `
      mutation updateStory() {
        updateStory(data: {visits: {create: {destination: {connect: {Landmark: {id: "${landmarkId}"}}}}}}, where: {id: "${savedStoryId}"}) {
          id
          updatedAt
        }
        }
    `
    );
    toast("visit updated");
  };

  const addNewStory = async () => {
    const { updateChapter } = await request(
      `${GRAPHCMS_API}`,
      `
      mutation updateChapter() {
        updateChapter(data: {stories: {create: {visits: {create: {destination: {connect: {Landmark: {id: "${landmarkId}"}}}}}, title: "title here"}}}, where: {id: "${savedChapterId}"}) {
          updatedAt
          id
        }
      }
      `
    );
    setSavedLandmarkId(savedLandmarkId.concat(landmarkId));
    toast("chapter updated");
  };

  return (
    <Fragment>
      <button
        onClick={
          currentDate === journalStatus && savedStoryId !== null
            ? () => addVisitToStory()
            : checkForLandmark === true
            ? () => addNewStory()
            : () => createAJournal()
        }
      >
        +
      </button>
      <ToastContainer />
    </Fragment>
  );
}
