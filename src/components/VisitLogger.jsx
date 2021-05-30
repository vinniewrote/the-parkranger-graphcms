import React, { Fragment } from "react";
import { useQuery, gql, useMutation } from "@apollo/client";
import { useManagedStory } from "../contexts/StoryContext";
import { useAuth0 } from "@auth0/auth0-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";

export default function VisitLogger(props) {
  const { user } = useAuth0();

  const {
    currentDate,
    dayName,
    todaysDate,
    userJournalId,
    setUserJournalId,
    currentChapterId,
    setCurentChapterId,
    savedStoryId,
    setSavedStoryId,
  } = useManagedStory();

  const { landmarkId, landmarkName } = props;

  const CREATE_NEW_JOURNAL = gql`
    mutation CreateNewJournal {
      createJournal(data: {author: {connect: {auth0id: "${user.sub}", email: "${user.email}"}}, name: "${user.name}'s Journal", journalSlug: "${user.nickmane}-journal", chapters: {create: {title: "${dayName}'s Experience", date: "${currentDate}", stories: {create: {title: "${landmarkName}'s Story", visits: {create: {title: "${landmarkName}'s visit", destination: {connect: {Landmark: {id: "${landmarkId}"}}}}}}}}}}) {
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

  const JOURNAL_CHECK = gql`
    query getJournalStatus {
      journals(where: { author: { auth0id: "${user.sub}" } }) {
        id
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
      ? journalQueryData.journals.map(({ id }) => {
          setUserJournalId(id);
        })
      : "";

  const CREATE_NEW_CHAPTER = gql`
    mutation CreateNewChapter {
      createChapter(data: {date: "${todaysDate}", journal: {connect: {id: "${userJournalId}"}}, stories: {create: {visits: {create: {destination: {connect: {Landmark: {id: "${landmarkId}"}}}, title: "${dayName}'s Adventure"}}}}}) {
        date
        id
        stories {
          title
        }
      }
    }
  `;

  const [createJournal] = useMutation(CREATE_NEW_JOURNAL);

  const GET_CHAPTER_DATE = gql`
    query GetChapterDate {
      chapters(where: { journal: { id: "${userJournalId}" } }) {
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
  let chapterIds = [];

  const chapterMap =
    chapterQueryData !== undefined
      ? chapterQueryData.chapters.map(({ id, date }) => {
          nArr.push(date);
          setCurentChapterId(id);
        })
      : "";

  //compare current date to date array
  const dateComp = nArr.includes(todaysDate);

  const CHECK_FOR_LANDMARKS = gql`
    query getLoggedLandmarks {
      chapters(where: { journal: { id: "${userJournalId}" } }) {
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

  let storyArr = [];

  const storyMap =
    landmarkQueryData !== undefined
      ? landmarkQueryData.chapters.map(({ id, stories }) => {
          stories.map((landmark, id) => {
            storyArr.push(landmark.landmarkId);
          });
        })
      : "";
  console.log(storyArr);

  const ldmkComp = storyArr.includes(landmarkId);

  const CHECK_FOR_STORYID = gql`
    query GetStoryId {
      stories(
        where: {
          chapter: { id: "${currentChapterId}" }
          landmarkId: "${landmarkId}"
        }
      ) {
        id
      }
    }
  `;

  const {
    loading: storyQueryLoading,
    error: storyQueryError,
    data: storyQueryData,
  } = useQuery(CHECK_FOR_STORYID, { pollInterval: 10000 });

  const currentStoryMap =
    storyQueryData !== undefined
      ? storyQueryData.stories.map(({ id }) => {
          setSavedStoryId(id);
        })
      : "";

  console.log(storyQueryData);

  const CREATE_NEW_STORY = gql`
    mutation CreateNewStory {
      createStory(
        data: {
          landmarkId: "${landmarkId}"
          title: "${landmarkName} ride"
          visits: {
            create: {
              destination: {
                connect: { Landmark: { id: "${landmarkId}" } }
              }
            }
          }
          chapter: { connect: { id: "${currentChapterId}" } }
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
          story: { connect: { id: "${savedStoryId}" } }
          destination: {
            connect: { Landmark: { id: "${landmarkId}" } }
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

  const PUBLISH_JOURNAL = gql`
    mutation PublishJournal {
      publishJournal(where: {id: "${userJournalId}"}) {
    publishedAt
  }
    }
  `;
  const [publishUserJournal] = useMutation(PUBLISH_JOURNAL);

  const PUBLISH_CHAPTER = gql`
    mutation PublishChapter {
      publishChapter(where: {id: "${currentChapterId}"}) {
        publishedAt
      }
    }
  `;
  const [publishUserChapter] = useMutation(PUBLISH_CHAPTER);

  const PUBLISH_STORY = gql`
    mutation PublishStory {
      publishStory(where: {id: "${savedStoryId}"}) {
        publishedAt
      }
    }
  `;
  const [publishUserStory] = useMutation(PUBLISH_STORY);

  const journalLogic = () => {
    if (!journalQueryData) {
      createJournal();
      toast("registering your journal & visit");
      publishUserJournal();
    } else if (!dateComp) {
      // create chapter request is busted test graphql query
      createNewChapter();
      toast("updating & publishing your data for today");
      publishUserChapter();
    } else if (!landmarkQueryData) {
      createNewStory();
      toast("creating and publishing your story");
      publishUserStory();
    } else if (ldmkComp) {
      createNewVisit();
      toast("updating and publishing your visit");
    } else if (!ldmkComp) {
      createNewStory();
      toast("creating and publishing your story");
      publishUserStory();
    }
  };

  return (
    <Fragment>
      <button
        onClick={() => {
          journalLogic();
        }}
      >
        +
      </button>
      <ToastContainer />
    </Fragment>
  );
}
