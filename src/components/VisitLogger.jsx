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
  const { user } = useAuth0();

  const { currentDate, dayName, todaysDate } = useManagedStory();

  const CREATE_NEW_JOURNAL = gql`
    mutation CreateNewJournal {
      createJournal(data: {author: {connect: {auth0id: "${user.sub}", email: "${user.email}"}}, name: "${user.name}'s Journal", chapters: {create: {title: "${dayName}'s Experience", date: "${currentDate}", stories: {create: {title: "${landmarkName}'s Story", visits: {create: {title: "${landmarkName}'s visit", destination: {connect: {Landmark: {id: "${landmarkId}"}}}}}}}}}}) {
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

  const journalMap =
    journalQueryData !== undefined
      ? journalQueryData.journals.map(({ id, name }) => <p key={id}>{id}</p>)
      : console.log("no mapping yet");

  console.log(journalMap);

  const CREATE_NEW_CHAPTER = gql`
    mutation CreateNewChapter {
      createChapter(
        data: {
          journal: { connect: { id: "${user.sub}" } }
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

  const [createJournal] = useMutation(CREATE_NEW_JOURNAL);

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
  const {
    loading: chapterQueryLoading,
    error: chapterQueryError,
    data: chapterQueryData,
  } = useQuery(GET_CHAPTER_DATE, {
    pollInterval: 2000,
  });
  const currentChapterDate = chapterQueryData;
  let nArr = [];
  const chapterMap =
    chapterQueryData !== undefined
      ? chapterQueryData.chapters.map(({ id, date }) => {
          nArr.push(date);
          console.log(nArr);
        })
      : console.log("no mapping yet");

  //compare current date to date array
  console.log(chapterMap);
  console.log(currentDate);
  const dateComp = nArr.includes(todaysDate);
  if (!dateComp) {
    console.log("imma create a new chapter here");
  } else {
    console.log("ill just add to the chapter");
  }

  // const UPDATE_CHAPTER = gql``;
  const CHECK_FOR_LANDMARKS = gql`
    query getLoggedLandmarks {
      chapters(where: { journal: { id: "ckm9da8wgon8n0977uqxo8vzr" } }) {
        date
        id
        stage
        title
        stories {
          id
          title
          landmarkId
        }
      }
    }
  `;

  const {
    loading: landmarkQueryLoading,
    error: landmarkQueryError,
    data: landmarkQueryData,
  } = useQuery(CHECK_FOR_LANDMARKS, {
    pollInterval: 2000,
  });
  if (landmarkQueryData) {
    console.log(landmarkQueryData.chapters);
  } else {
    console.log("no data yet fam");
  }

  let storyArr = [];

  const storyMap =
    landmarkQueryData !== undefined
      ? landmarkQueryData.chapters.map(({ id, stories }) => {
          stories.map((landmark, id) => {
            storyArr.push(landmark.landmarkId);
          });
        })
      : console.log("no story mapping yet");
  console.log(storyArr);

  const ldmkComp = storyArr.includes(landmarkId);
  if (!ldmkComp) {
    console.log("new story needed my man");
  } else {
    console.log("ill just add a visit to the story");
  }
  const CREATE_NEW_STORY = gql`
    mutation CreateNewStory {
      createStory(
        data: {
          landmarkId: "ckb5wq9201loa0179kvo517od"
          title: "Maxx Force ride"
          visits: {
            create: {
              destination: {
                connect: { Landmark: { id: "ckb5wq9201loa0179kvo517od" } }
              }
            }
          }
          chapter: { connect: { id: "ckmazlwv4t9zm0977bsvk4nol" } }
        }
      ) {
        id
        stage
      }
    }
  `;

  const CREATE_NEW_VISIT = gql`
    mutation CreateNewVisit {
      createVisit(
        data: {
          story: { connect: { id: "ckmf3ahgw0bui0e72fenvtbxt" } }
          destination: {
            connect: { Landmark: { id: "ckb5wq9201loa0179kvo517od" } }
          }
        }
      ) {
        id
        stage
      }
    }
  `;

  const [createNewStory] = useMutation(CREATE_NEW_STORY);
  const [createNewChapter] = useMutation(CREATE_NEW_CHAPTER);
  const [createNewVisit] = useMutation(CREATE_NEW_VISIT);

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
