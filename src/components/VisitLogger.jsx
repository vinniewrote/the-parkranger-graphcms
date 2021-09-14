import React, { Fragment } from "react";
import { useQuery, gql, useMutation } from "@apollo/client";
import { useManagedStory } from "../contexts/StoryContext";
import { useAuth0 } from "@auth0/auth0-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import { logDOM } from "@testing-library/dom";

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
      createChapter(data: {date: "${todaysDate}", journal: {connect: {id: "${userJournalId}"}}, title: "${todaysDate}", stories: {create: {title: "An epic ${dayName} endeavor", visits: {create: {landmark: {connect: {id: "${landmarkId}"}}}}, landmarkId: "${landmarkId}"}}}) {
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
    pollInterval: 8000,
  });
  const currentChapterDate = chapterQueryData;
  let nArr = [];
  let chapterIds = [];
  console.log(chapterQueryData?.chapters);
  const chapterMap =
    chapterQueryData !== undefined
      ? chapterQueryData.chapters.map(({ id, date }) => {
          nArr.push(date);
          if (date===todaysDate){
            // console.log(`winner winner ${id}`);
            setCurentChapterId(id);
          }
          
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
    pollInterval: 10000,
  });

  let storyArr = [];
console.log(landmarkQueryData?.stories);
  const storyMap =
  landmarkQueryData !== undefined ?
      landmarkQueryData.stories.map (({ id, landmarkId }) => {
        console.log(landmarkId);
         storyArr.push(landmarkId);
         
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
      createStory(
        data: {
          landmarkId: "${landmarkId}"
          title: "${landmarkName} ride"
          visits: {
            create: {
              landmark: {
                connect: {  id: "${landmarkId}"  }
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
      createVisit(data: {story: {connect: {id: "${savedStoryId}"}}, landmark: {connect: {id: "${landmarkId}"}}})  {
        id
      }
    }
  `;

  const [createNewStory, {data:newStoryData, loading: newStoryLoading, error: newStoryError}] = useMutation(CREATE_NEW_STORY);
  const [createNewChapter, {data: newChapterData, loading: newChapterLoading, error: newChapterError}] = useMutation(CREATE_NEW_CHAPTER);
  const chapterMutation = newChapterData?.createChapter?.id;
  const [createNewVisit, {data: newVisitData, loading: newVisitLoading, error: newVisitError}] = useMutation(CREATE_NEW_VISIT);
  const visitMutation = newVisitData?.createVisit?.id;
  
  console.log(newStoryData?.createNewStory);
  console.log(newChapterData?.createNewChapter);
  console.log(newVisitData?.createVisit);

  let chapterDraft = newChapterData?.createNewChapter?.id;
  let storyDraft = newStoryData?.createNewStory?.id;
  let visitDraft = newVisitData?.createVisit?.id;

  console.log(chapterDraft);
  console.log(storyDraft);
  console.log(visitDraft);

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
      publishStory(where: {id: "${storyDraft}"}) {
        id
        
      }
    }
  `;
  const [publishUserStory] = useMutation(PUBLISH_STORY);

  const PUBLISH_VISIT = gql`
  mutation PublishVisit {
    publishVisit(where: {id: "${visitDraft}"}) {
      id
      
    }
  }
`;
const [publishUserVisit] = useMutation(PUBLISH_VISIT);
console.log(dateComp);
console.log(landmarkQueryData);
console.log(currentChapterId);
console.log(landmarkId);
  const journalLogic = () => {
    
    if (!journalQueryData) {
      createJournal();
      toast("registering your brand new journal & visit");
      prepJournalForPublish();
      publishJournal();
    } else if (!dateComp) {
      createNewChapter();
      toast("creating today's data");
      publishUserChapter();
    } else if (!landmarkQueryData) {
      createNewStory();
      toast("creating your new story");
      publishUserStory();
    } else if (ldmkComp) {
      createNewVisit();
      toast("updating your story & visit");
      publishUserVisit();
    } else if (!ldmkComp) {
      createNewStory();
      toast("creating your new landmark story");
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
