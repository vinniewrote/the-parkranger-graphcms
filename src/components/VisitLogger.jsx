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
    savedLandmarkId,
    setSavedLandmarkId,
  } = useManagedStory();

  const { landmarkId, landmarkName } = props;

  const CREATE_NEW_JOURNAL = gql`
    mutation CreateNewJournal {
      createJournal(data: {author: {connect: {auth0id: "${user.sub}", email: "${user.email}"}}, name: "${user.name}'s Journal", journalSlug: "${user.nickmane}-journal", chapters: {create: {title: "${dayName}'s Experience", date: "${currentDate}", stories: {create: {title: "${landmarkName}'s Story", visits: {create: {title: "${landmarkName}'s visit", destination: {connect: {Landmark: {id: "${landmarkId}"}}}}}}}}}}) {
        id
        name
      }
    }
  `;

const PUBLISH_JOURNAL = gql`
mutation PublishJournal {
  publishJournal(where: {id: "${userJournalId}"}) {
    id
    name
  }
}
`;
const [publishJournal] = useMutation(PUBLISH_JOURNAL);

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

  const [createJournal, { data: newJournaldata, loading: newJournalLoading, error: newJournalError }] = useMutation(CREATE_NEW_JOURNAL, {
    // onCompleted: prepJournalForPublish
  });
  
  const journalMutationId = newJournaldata?.createJournal?.id;
    
  const prepJournalForPublish = () => {
    setUserJournalId(journalMutationId);
  }

  const CREATE_NEW_CHAPTER = gql`
    mutation CreateNewChapter {
      createChapter(data: {journal: {connect: {id: "${userJournalId}"}}, date: "${todaysDate}", stories: {create: {visits: {create: {landmark: {connect: {id: "${landmarkId}"}}, title: "${dayName}'s Adventure"}}}}}) {
        id
      }
    }
  `;



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
      stories(where: {chapter: {date: "${todaysDate}", journal: {id: "${userJournalId}"}}}) {
        landmarkId
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
console.log(landmarkQueryData?.stories);
  const storyMap =
  landmarkQueryData !== undefined ?
      landmarkQueryData.stories.map (({ id, landmarkId }) => {
         storyArr.push(landmarkId);
         console.log('done');
        })
        :"";
    
  const ldmkComp = storyArr.includes(landmarkId);
  console.log(storyArr);
  console.log(ldmkComp);

  const CHECK_FOR_STORYID = gql`
    query GetStoryId {
      stories(
        where: {
          chapter: { id: "${currentChapterId}" }
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

  const CREATE_NEW_STORY = gql`
    mutation CreateNewStory {
      createStory(data: {landmarkId: "${landmarkId}", visits: {create: {landmark: {connect: {id: "${landmarkId}"}}}}, title: "my awesome story", chapter: {connect: {id: "${currentChapterId}"}}}) {
    id
  }

    }
  `;
  
  const CREATE_NEW_VISIT = gql`
    mutation CreateNewVisit {
      createStory(data: {landmarkId: "${landmarkId}", visits: {create: {landmark: {connect: {id: "${landmarkId}"}}}}, title: "my thrilling  story", chapter: {connect: {id: "${currentChapterId}"}}}) {
    id
  }
    }
  `;

  const [createNewStory, {data:newStoryData, loading: newStoryLoading, error: newStoryError}] = useMutation(CREATE_NEW_STORY);
  const [createNewChapter, {data: newChapterData, loading: newChapterLoading, error: newChapterError}] = useMutation(CREATE_NEW_CHAPTER);
  const chapterMutation = newChapterData?.createChapter?.id;
  const [createNewVisit, {data: newVisitData, loading: newVisitLoading, error: newVisitError}] = useMutation(CREATE_NEW_VISIT);
  const visitMutation = newVisitData?.createVisit?.id;
  

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
      toast("registering your brand new journal & visit");
      prepJournalForPublish();
      publishJournal();
    } else if (!dateComp) {
      publishJournal();
      createNewChapter();
      toast("updating today's data");
      publishUserChapter();
      publishUserStory();
    } else if (!landmarkQueryData) {
      publishJournal();
      createNewStory();
      toast("creating your new story");
      publishUserChapter();
      publishUserStory();
    } else if (ldmkComp) {
      publishJournal();
      createNewVisit();
      toast("updating your story & visit");
      publishUserChapter();
      publishUserStory();
    } else if (!ldmkComp) {
      publishJournal();
      createNewStory();
      toast("creating your new landmark story");
      publishUserChapter();
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
