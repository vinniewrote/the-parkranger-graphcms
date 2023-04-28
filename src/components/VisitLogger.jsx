import React, { Fragment, useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { useManagedStory } from "../contexts/StoryContext";
import { useAuth0 } from "@auth0/auth0-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import {
  JOURNAL_CHECK,
  GET_CHAPTER_DATE,
  CHECK_FOR_STORYID,
  CHECK_FOR_LANDMARKS,
} from "../graphql/queries/journalQueries.js";
import {
  CREATE_NEW_CHAPTER,
  PUBLISH_JOURNAL,
  CREATE_NEW_STORY,
  CREATE_NEW_VISIT,
  PUBLISH_CHAPTER,
  PUBLISH_STORY,
  PUBLISH_VISIT,
} from "../graphql/mutations/journalMutations";
import { LoggingButton } from "../styledComponents/VisitLogger_styled";

export default function VisitLogger(props) {
  const { user } = useAuth0();
  const [status, setStatus] = useState(false);
  const [newUserModal, showNewUserModal] = useState(false);
  const {
    currentDate,
    dayName,
    todaysDate,
    userJournalId,
    setUserJournalId,
    currentChapterId,
    currentStoryId,
    currentVisitId,
    setCurentChapterId,
    setCurrentStoryId,
    setCurrentVisitId,
    savedStoryId,
    setSavedStoryId,
    savedLandmarkId,
    setSavedLandmarkId,
    STATUS,
    todaysChapterId,
    setTodaysChapterId,
    landmarkFlagBoolean,
    setLandmarkFlagBoolean,
    storyIdForLandmark,
    setStoryIdForLandmark,
    doDatesMatch,
    setDoDatesMatch,
  } = useManagedStory();
  const { landmarkId, landmarkName } = props;

  let nArr = [];
  let storyArr = [];
  let bundleArray = [];
  let landmarkArray = [];
  let cleanedLandMarkArray = [];

  /************************************************ QUERIES *****************************************************/

  const {
    loading: journalQueryLoading,
    error: journalQueryError,
    data: journalQueryData,
  } = useQuery(JOURNAL_CHECK, {
    variables: { authZeroId: user.sub },
    onCompleted: () => {
      journalQueryData.journals.map(({ id }) => {
        setUserJournalId(id);
      });
    },
  });

  const {
    loading: chapterQueryLoading,
    error: chapterQueryError,
    data: chapterQueryData,
  } = useQuery(GET_CHAPTER_DATE, {
    variables: {
      journalTracker: userJournalId || localStorage.getItem("newJournalId"),
    },
    pollInterval: 8000,

    onCompleted() {
      chapterQueryData.chapters.map(({ id, date }) => {
        nArr.push(date);
        console.log(nArr);
        if (date === todaysDate) {
          console.log("found it");
          setCurentChapterId(id);
        }
      });
    },
  });

  const {
    loading: storyQueryLoading,
    error: storyQueryError,
    data: storyQueryData,
  } = useQuery(CHECK_FOR_STORYID, {
    variables: { currentChapterId: currentChapterId },
    pollInterval: 10000,
  });

  const {
    loading: landmarkQueryLoading,
    error: landmarkQueryError,
    data: landmarkQueryData,
  } = useQuery(CHECK_FOR_LANDMARKS, {
    variables: {
      authJournalId: userJournalId || localStorage.getItem("newJournalId"),
      currentDate: currentDate,
    },
    pollInterval: 10000,
  });

  /************************************************ MUTATIONS *****************************************************/

  const [
    createNewChapter,
    {
      data: newChapterData,
      loading: newChapterLoading,
      error: newChapterError,
    },
  ] = useMutation(CREATE_NEW_CHAPTER, {
    variables: {
      authLandmark: landmarkId,
      landmarkIdentifier: landmarkId,
      authJournalID: userJournalId,
      currentDate: currentDate,
      dayOfWeek: dayName,
    },
    onCompleted() {
      // console.log(newChapterData);
      setCurentChapterId(newChapterData.createChapter.id);
      setCurrentStoryId(newChapterData.createChapter.stories[0].id);
      setCurrentVisitId(newChapterData.createChapter.stories[0].visits[0].id);
      publishUserChapter();
    },
  });

  const [
    createNewStory,
    { data: newStoryData, loading: newStoryLoading, error: newStoryError },
  ] = useMutation(CREATE_NEW_STORY, {
    variables: {
      authLandmark: landmarkId,
      landmarkIdentifier: landmarkId,
      landmarkTitle: landmarkName,
      currentChptID: todaysChapterId,
    },
    refetchQueries: [
      { query: GET_CHAPTER_DATE }, // DocumentNode object parsed with gql
      "GetChapterDate", // Query name
    ],
    onCompleted() {
      setCurrentStoryId(newStoryData.createStory.id);
      setCurrentVisitId(newStoryData.createStory.visits[0].id);
      publishUserChapter();
    },
  });

  const [
    createNewVisit,
    { data: newVisitData, loading: newVisitLoading, error: newVisitError },
  ] = useMutation(CREATE_NEW_VISIT, {
    variables: {
      landmarkTracker: landmarkId,
      storyIDLandmark: storyIdForLandmark,
    },
    onCompleted() {
      // console.log(newVisitData);
      setCurrentVisitId(newVisitData.createVisit.id);
      publishUserChapter();
    },
  });

  const [publishUserChapter] = useMutation(PUBLISH_CHAPTER, {
    variables: { currentChptID: currentChapterId },
    onCompleted() {
      publishUserStory();
    },
  });

  const [publishUserStory] = useMutation(PUBLISH_STORY, {
    variables: { storyDraft: currentStoryId },
    onCompleted() {
      publishUserVisit();
    },
  });

  const [publishUserVisit] = useMutation(PUBLISH_VISIT, {
    variables: { visitDraft: currentVisitId },
    onCompleted() {
      console.log("publishing done");
    },
  });

  /************************************************ HELPER FUNCTIONS *****************************************************/

  const chapterMap =
    chapterQueryData !== undefined &&
    chapterQueryData.chapters.map(({ id, date }) => {
      nArr.push(date);
      if (date === todaysDate) {
        console.log("over here");
        setCurentChapterId(id);
      }
    });

  if (nArr.length > 0) {
    const dateComp = nArr.includes(todaysDate);
    setDoDatesMatch(dateComp);
  }

  const storyMap =
    landmarkQueryData !== undefined &&
    landmarkQueryData.stories.map(({ id, landmarkId }) => {
      storyArr.push(landmarkId);
      bundleArray.push({ landmarkId, storyId: id });
    });

  const landmarkMap =
    chapterQueryData !== undefined &&
    chapterQueryData.chapters.map(({ id, stories }) => {
      landmarkArray.push({ chapterId: id, stories });
    });

  const cleanLandmark = landmarkArray.map(
    (landmark, id, chapterId, stories) => {
      landmark.stories.map(({ id, landmarkId }) => {
        let chpId = landmark.chapterId;
        cleanedLandMarkArray.push({ chpId, landmarkId, storyId: id });
      });
    }
  );

  if (
    cleanedLandMarkArray?.length > 0 &&
    chapterQueryData?.chapters?.length > 0
  ) {
    const findTodaysChapterId = chapterQueryData?.chapters?.find(
      (c) => c.date === todaysDate
    );
    let isTodaysChapterId = findTodaysChapterId?.id;
    // console.log(todaysChapterId);
    const findTodays = cleanedLandMarkArray?.filter(
      (d) => d.chpId === todaysChapterId
    );

    // console.log(`findTodays - ${findTodays}`);

    const onlyLandmarks = findTodays.map((marks) => marks.landmarkId);

    // console.log(`findTodays - ${onlyLandmarks}`);

    const landmarkFlag = onlyLandmarks.includes(`${landmarkId}`);

    // console.log(`findTodays - ${landmarkFlag}`);

    setLandmarkFlagBoolean(landmarkFlag);
    setTodaysChapterId(isTodaysChapterId);
  }

  if (bundleArray.length > 0) {
    const findStoryIdForLandmark = bundleArray.find(
      (b) => b.landmarkId === landmarkId
    );
    const storyIdToLdmk = findStoryIdForLandmark?.storyId;
    setStoryIdForLandmark(storyIdToLdmk);
  }

  console.log(`landmarkid - ${landmarkId}`);
  console.log(`landmarkname - ${landmarkName}`);
  console.log(`todayschpid - ${todaysChapterId}`);

  const currentStoryMap =
    storyQueryData !== undefined &&
    storyQueryData.stories.map(({ id }) => {
      setSavedStoryId(id);
    });

  // const chapterMutation = newChapterData?.createChapter?.id;

  // const visitMutation = newVisitData?.createVisit?.id;

  // let chapterDraft = newChapterData?.createNewChapter?.id;

  /************************************************ JOURNAL LOGIC **************************************************/

  const journalLogic = () => {
    setStatus(true);
    if (journalQueryData?.journals.length === 0) {
      showNewUserModal(true);
      toast("You need to register your journal before tracking your ride", {
        onClose: () => setStatus(false),
      });
    } else if (journalQueryData?.journals.length !== 0 && !doDatesMatch) {
      createNewChapter();
      toast("creating today's data", { onClose: () => setStatus(false) });
    } else if (landmarkFlagBoolean === false) {
      createNewStory();
      toast("creating your new story", { onClose: () => setStatus(false) });
    } else if (
      landmarkFlagBoolean === true &&
      storyIdForLandmark !== "undefined"
    ) {
      createNewVisit();
      toast("updating your story & visit", { onClose: () => setStatus(false) });
    } else if (landmarkFlagBoolean === false) {
      createNewStory();
      toast("creating your new landmark story", {
        onClose: () => setStatus(false),
      });
    }
  };

  return (
    <Fragment>
      <LoggingButton
        disabled={journalQueryData?.journals.length === 0}
        type="button"
        onClick={() => {
          journalLogic();
        }}
      >
        <span>+</span>
      </LoggingButton>
      <ToastContainer />
    </Fragment>
  );
}
