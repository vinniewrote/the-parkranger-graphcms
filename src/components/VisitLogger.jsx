import React, { Fragment, useState, useEffect } from "react";
import { request, GraphQLClient, gql } from "graphql-request";
import { useManagedStory } from "../contexts/StoryContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";

const GRAPHCMS_API =
  "https://api-us-east-1.graphcms.com/v2/ck8g4we3i14kb01xv6avzh80e/master";

export default function VisitLogger(props) {
  const landmarkId = props.landmarkId;
  const landmarkName = props.landmarkName;
  const currentDate = new Date().toDateString();
  const {
    savedStoryId,
    setSavedStoryId,
    storyStatus,
    setStoryStatus,
  } = useManagedStory();

  const createAStory = async () => {
    const { createStory } = await request(
      `${GRAPHCMS_API}`,
      `
      mutation addStory() {
        createStory(data: {title: "${landmarkName}-${currentDate}", journal: {}, visits: {create: {destination: {connect: {Landmark: {id: "${landmarkId}"}}}}}}) {
            id
            title
          }
        }
    `
    );
    setStoryStatus(createStory.title.split("-")[1]);
    setSavedStoryId(createStory.id);
    toast("landmark logged!");
  };

  const addVisitToStory = async () => {
    const { updateStory } = await request(
      `${GRAPHCMS_API}`,
      `
      mutation updateStory() {
        updateStory(data: {journal: {}, visits: {create: {destination: {connect: {Landmark: {id: "${landmarkId}"}}}}}}, where: {id: "${savedStoryId}"}) {
            id
            updatedAt
          }
        }
    `
    );
    toast("story updated");
  };

  return (
    <Fragment>
      <button
        onClick={
          currentDate === storyStatus && savedStoryId !== null
            ? () => addVisitToStory()
            : () => createAStory()
        }
      >
        +
      </button>
      <ToastContainer />
    </Fragment>
  );
}
