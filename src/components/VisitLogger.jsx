import React, { Fragment, useState, useEffect } from "react";
import { request, GraphQLClient, gql } from "graphql-request";

const GRAPHCMS_API =
  "https://api-us-east-1.graphcms.com/v2/ck8g4we3i14kb01xv6avzh80e/master";

export default function VisitLogger(props) {
  const [visitCount, setVisitCount] = useState(0);
  const [stories, setStories] = useState(null);
  const landmarkId = props.landmarkId;
  const landmarkName = props.landmarkName;
  const currentDate = new Date().toDateString();
  const [storyStatus, setStoryStatus] = useState(false);
  const [storyId, setStoryId] = useState(null);

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
    console.log(createStory.title.split("-")[1]);
    // console.log(storyStatusDate[1]);
    setStoryStatus(createStory.title.split("-")[1]);
    setStoryId(createStory.id);
  };

  const addVisitToStory = async () => {
    const { updateStory } = await request(
      `${GRAPHCMS_API}`,
      `
      mutation addStory() {
        updateStory(data: {journal: {}, visits: {create: {destination: {connect: {Landmark: {id: "${landmarkId}"}}}}}}, where: {id: "${storyId}"}) {
            id
            updatedAt
          }
        }
    `
    );
    console.log(updateStory);
  };

  return (
    <Fragment>
      <button
        onClick={
          currentDate === storyStatus ? addVisitToStory() : () => createAStory()
        }
      >
        +
      </button>
    </Fragment>
  );
}
