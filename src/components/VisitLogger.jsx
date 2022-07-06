import React, { Fragment, useState } from "react";
import { useQuery, gql, useMutation } from "@apollo/client";
import { useManagedStory } from "../contexts/StoryContext";
import { useAuth0 } from "@auth0/auth0-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import Button from "./styledComponents/Button";

export default function VisitLogger(props) {
  const { user } = useAuth0();
  const [status, setStatus] = useState(false);
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
    STATUS,
    todaysChapterId,
    setTodaysChapterId,
    landmarkFlagBoolean,
    setLandmarkFlagBoolean,
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

  const [
    createJournal,
    {
      data: newJournaldata,
      loading: newJournalLoading,
      error: newJournalError,
    },
  ] = useMutation(CREATE_NEW_JOURNAL, {
    // onCompleted: prepJournalForPublish
  });

  const journalMutationId = newJournaldata?.createJournal?.id;

  const prepJournalForPublish = () => {
    setUserJournalId(journalMutationId);
  };

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
        stories {
          id
          landmarkId
          landmarkName
        }
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
  // console.log(chapterQueryData?.chapters);
  const chapterMap =
    chapterQueryData !== undefined
      ? chapterQueryData.chapters.map(({ id, date }) => {
          nArr.push(date);
          if (date === todaysDate) {
            setCurentChapterId(id);
          }
        })
      : "";

  //compare current date to date array
  const dateComp = nArr.includes(todaysDate);

  const CHECK_FOR_LANDMARKS = gql`
    query getLoggedLandmarks {
      stories(where: {chapter: {date: "${todaysDate}", journal: {id: "${userJournalId}"}}}) {
        id
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
  let bundleArray = [];
  let landmarkArray = [];

  const storyMap =
    landmarkQueryData !== undefined
      ? landmarkQueryData.stories.map(({ id, landmarkId }) => {
          storyArr.push(landmarkId);
          bundleArray.push({ landmarkId, storyId: id });
        })
      : "";

  const landmarkMap =
    chapterQueryData !== undefined
      ? chapterQueryData.chapters.map(({ id, stories }) => {
          // stories.map(({ id, landmarkId }) => {
          //   landmarkArray.push({ landmarkId, storyId: id });
          // });
          landmarkArray.push({ chapterId: id, stories });
        })
      : "";
  let cleanedLandMarkArray = [];

  const cleanLandmark = landmarkArray.map(
    (landmark, id, chapterId, stories) => {
      landmark.stories.map(({ id, landmarkId }) => {
        let chpId = landmark.chapterId;
        cleanedLandMarkArray.push({ chpId, landmarkId, storyId: id });
      });
    }
  );
  // console.log(cleanedLandMarkArray);
  // console.log(chapterQueryData?.chapters?.length);
  // console.log(todaysDate);
  if (
    cleanedLandMarkArray?.length > 0 &&
    chapterQueryData?.chapters?.length > 0
  ) {
    // console.log("passed the test");

    const findTodaysChapterId = chapterQueryData?.chapters?.find(
      (c) => c.date === todaysDate
    );
    let isTodaysChapterId = findTodaysChapterId?.id;
    // console.log(todaysChapterId);
    const findTodays = cleanedLandMarkArray?.filter(
      (d) => d.chpId === todaysChapterId
    );
    // console.log(findTodays);
    const onlyLandmarks = findTodays.map((marks) => marks.landmarkId);
    // console.log(onlyLandmarks);
    const landmarkFlag = onlyLandmarks.includes(`${landmarkId}`);
    // console.log(landmarkFlag);
    setLandmarkFlagBoolean(landmarkFlag);
    setTodaysChapterId(isTodaysChapterId);
  }

  const ldmkComp = storyArr.includes(landmarkId);
  const checkForLandmark = bundleArray.some((b) => b.landmarkId === landmarkId);
  const findStoryIdForLandmark = bundleArray.find(
    (b) => b.landmarkId === landmarkId
  );

  // console.log(checkForLandmark);
  // console.log(findStoryIdForLandmark);
  // console.log(findStoryIdForLandmark?.storyId);
  // console.log(storyArr);

  // console.log(ldmkComp);

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
          landmarkName: "${landmarkName}"
          title: "${landmarkName} ride"
          visits: {
            create: {
              landmark: {
                connect: {  id: "${landmarkId}"  }
              }
            }
          }
          chapter: { connect: { id: "${todaysChapterId}" } }
        }
      ) {
        id
        stage
      }
    }
  `;

  const CREATE_NEW_VISIT = gql`
    mutation CreateNewVisit {
      createVisit(data: {story: {connect: {id: "${findStoryIdForLandmark?.storyId}"}}, landmark: {connect: {id: "${landmarkId}"}}})  {
        id
      }
    }
  `;

  const [
    createNewStory,
    { data: newStoryData, loading: newStoryLoading, error: newStoryError },
  ] = useMutation(CREATE_NEW_STORY);
  const [
    createNewChapter,
    {
      data: newChapterData,
      loading: newChapterLoading,
      error: newChapterError,
    },
  ] = useMutation(CREATE_NEW_CHAPTER);
  // console.log(newChapterData);
  const chapterMutation = newChapterData?.createChapter?.id;
  const [
    createNewVisit,
    { data: newVisitData, loading: newVisitLoading, error: newVisitError },
  ] = useMutation(CREATE_NEW_VISIT);
  const visitMutation = newVisitData?.createVisit?.id;

  // console.log(newStoryData?.createNewStory);
  // console.log(newChapterData?.createNewChapter);
  // console.log(newVisitData?.createVisit);

  let chapterDraft = newChapterData?.createNewChapter?.id;
  let storyDraft = newStoryData?.createNewStory?.id;
  let visitDraft = newVisitData?.createVisit?.id;

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

  const newLandmarkPayload = {
    id: "",
    landmarkId: `${landmarkId}`,
    storyId: "",
  };

  const journalLogic = () => {
    setStatus(true);
    if (!journalQueryData) {
      createJournal();
      toast("registering your brand new journal & visit", {
        onClose: () => setStatus(false),
      });
      prepJournalForPublish();
      publishJournal();
    } else if (!dateComp) {
      createNewChapter();

      toast("creating today's data", { onClose: () => setStatus(false) });
      // publishUserChapter();
    } else if (!landmarkQueryData) {
      createNewStory();

      toast("creating your new story", { onClose: () => setStatus(false) });
      // publishUserStory();
    } else if (landmarkFlagBoolean) {
      createNewVisit();
      toast("updating your story & visit", { onClose: () => setStatus(false) });
      // publishUserVisit();
    } else if (!landmarkFlagBoolean) {
      createNewStory();
      toast("creating your new landmark story", {
        onClose: () => setStatus(false),
      });
      // publishUserStory();
    }
  };

  return (
    <Fragment>
      {/* <button
        style={{width: '60px', height: '60px', border: '1px solid black', borderRadius: '60px', fontSize: '2.25em', lineHeight: '1em', cursor: 'pointer'}}
        onClick={() => {
          journalLogic();
        }}
      >
        +
      </button> */}

      <button
        disabled={status}
        type="button"
        style={{
          width: "60px",
          height: "60px",
          border: "1px solid black",
          borderRadius: "60px",
          fontSize: "2.25em",
          lineHeight: "1em",
          cursor: "pointer",
          margin: "auto 0",
        }}
        onClick={() => {
          journalLogic();
        }}
      >
        {/* {status.children || 'Submit'} */}+{status}
      </button>

      <ToastContainer />
    </Fragment>
  );
}
