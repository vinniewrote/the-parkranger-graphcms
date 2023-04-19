import React, { Fragment, useState } from "react";
import { useQuery, gql, useMutation } from "@apollo/client";
import { useManagedStory } from "../contexts/StoryContext";
import { useAuth0 } from "@auth0/auth0-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import Button from "./styledComponents/Button";
import {
  JOURNAL_CHECK,
  GET_CHAPTER_DATE,
  CHECK_FOR_STORYID,
  CHECK_FOR_LANDMARKS,
} from "../graphql/queries/journalQueries.js";
import {
  CREATE_NEW_AUTHOR,
  CREATE_NEW_CHAPTER,
  PUBLISH_JOURNAL,
  CREATE_NEW_JOURNAL,
  CREATE_NEW_STORY,
  CREATE_NEW_VISIT,
  PUBLISH_CHAPTER,
  PUBLISH_STORY,
  PUBLISH_VISIT,
  NEW_AUTHOR_STEP_ONE,
  NEW_AUTHOR_STEP_TWO,
  NEW_AUTHOR_STEP_THREE,
  NEW_AUTHOR_STEP_FOUR,
} from "../graphql/mutations/journalMutations";
import NewUserFlow from "./NewUserFlow";
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

  const [publishJournal] = useMutation(PUBLISH_JOURNAL, {
    variables: {
      authJournalId: userJournalId || localStorage.getItem("newJournalId"),
    },
  });

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

  const [
    createJournal,
    {
      data: newJournaldata,
      loading: newJournalLoading,
      error: newJournalError,
    },
  ] = useMutation(CREATE_NEW_JOURNAL, {
    variables: {
      authZeroEmail: user.email,
      authZeroName: user.name,
      authZeroId: user.sub,
    },
    // onCompleted: setUserJournalId(journalMutationId),
  });

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
      console.log(`post author created  ${userJournalId}`);
    },
  });

  const [createAuthor] = useMutation(CREATE_NEW_AUTHOR, {
    variables: {
      authZeroId: user.sub,
      authZeroEmail: user.email,
      authZeroName: user.name,
    },
    refetchQueries: [
      { query: JOURNAL_CHECK }, // DocumentNode object parsed with gql
      "getJournalStatus", // Query name
    ],
    onCompleted: () => console.log(`post author created  ${userJournalId}`),
  });

  const [
    newAuthorStepFour,
    { data: stepFourData, loading: stepFourLoading, error: stepFourError },
  ] = useMutation(NEW_AUTHOR_STEP_FOUR, {
    variables: {
      authLandmark: landmarkId,
      landmarkIdentifier: landmarkId,
      authJournalID: userJournalId,
      currentDate: currentDate,
      dayOfWeek: dayName,
    },
    onCompleted() {
      console.log("mission accomplished");
      publishJournal();
    },
    //publish that stuff
  });

  const [
    newAuthorStepThree,
    { data: stepThreeData, loading: stepThreeLoading, error: stepThreeError },
  ] = useMutation(NEW_AUTHOR_STEP_THREE, {
    variables: {
      authZeroId: user.sub,
      authZeroEmail: user.email,
      authZeroName: user.name,
    },
    onCompleted() {
      localStorage.setItem("newJournalId", stepThreeData.id);
      // setUserJournalId(stepThreeData.createJournal.id);
      newAuthorStepFour({ authJournalID: stepThreeData.createJournal.id });
    },
  });

  const [newAuthorStepTwo] = useMutation(NEW_AUTHOR_STEP_TWO, {
    variables: {
      authZeroEmail: user.email,
    },
    onCompleted: () => newAuthorStepThree(),
  });

  const [newAuthorStepOne] = useMutation(NEW_AUTHOR_STEP_ONE, {
    variables: {
      authZeroId: user.sub,
      authZeroEmail: user.email,
      authZeroName: user.name,
    },
    onCompleted: () => newAuthorStepTwo(),
  });

  const journalMutationId = newJournaldata?.createJournal?.id;

  // const prepJournalForPublish = () => {
  //   setUserJournalId(journalMutationId);
  // };

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

  const currentChapterDate = chapterQueryData;
  let nArr = [];
  let chapterIds = [];
  // console.log(chapterQueryData?.chapters);
  const chapterMap =
    chapterQueryData !== undefined
      ? chapterQueryData.chapters.map(({ id, date }) => {
          nArr.push(date);
          if (date === todaysDate) {
            console.log("over here");
            setCurentChapterId(id);
          }
        })
      : "";

  //compare current date to date array
  const dateComp = nArr.includes(todaysDate);

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
    console.log(`findTodays - ${findTodays}`);
    const onlyLandmarks = findTodays.map((marks) => marks.landmarkId);
    console.log(`findTodays - ${onlyLandmarks}`);
    const landmarkFlag = onlyLandmarks.includes(`${landmarkId}`);
    console.log(`findTodays - ${landmarkFlag}`);
    setLandmarkFlagBoolean(landmarkFlag);
    setTodaysChapterId(isTodaysChapterId);
  }

  const ldmkComp = storyArr.includes(landmarkId);
  const checkForLandmark = bundleArray.some((b) => b.landmarkId === landmarkId);
  const findStoryIdForLandmark = bundleArray.find(
    (b) => b.landmarkId === landmarkId
  );
  const storyIdForLandmark = findStoryIdForLandmark?.storyId;

  console.log(landmarkQueryData);
  console.log(bundleArray);
  console.log(findStoryIdForLandmark);
  console.log(storyIdForLandmark);
  console.log(userJournalId);

  console.log(`landmarkid - ${landmarkId}`);
  console.log(`landmarkname - ${landmarkName}`);
  console.log(`todayschpid - ${todaysChapterId}`);

  const {
    loading: storyQueryLoading,
    error: storyQueryError,
    data: storyQueryData,
  } = useQuery(CHECK_FOR_STORYID, {
    variables: { currentChapterId: currentChapterId },
    pollInterval: 10000,
  });

  const currentStoryMap =
    storyQueryData !== undefined
      ? storyQueryData.stories.map(({ id }) => {
          setSavedStoryId(id);
        })
      : "";

  {
    /* have to fix findStoryIdForLandmark?.storyId    */
  }

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
  });

  const chapterMutation = newChapterData?.createChapter?.id;
  const [
    createNewVisit,
    { data: newVisitData, loading: newVisitLoading, error: newVisitError },
  ] = useMutation(CREATE_NEW_VISIT, {
    variables: {
      landmarkTracker: landmarkId,
      storyIDLandmark: storyIdForLandmark,
    },
  });
  const visitMutation = newVisitData?.createVisit?.id;

  let chapterDraft = newChapterData?.createNewChapter?.id;
  let storyDraft = newStoryData?.createNewStory?.id;
  let visitDraft = newVisitData?.createVisit?.id;

  const [publishUserChapter] = useMutation(PUBLISH_CHAPTER, {
    variables: { currentChptID: { currentChapterId } },
  });

  const [publishUserStory] = useMutation(PUBLISH_STORY, {
    variables: { storyDraft: { storyDraft } },
  });

  const [publishUserVisit] = useMutation(PUBLISH_VISIT, {
    variables: { visitDraft: { visitDraft } },
  });

  const newLandmarkPayload = {
    id: "",
    landmarkId: `${landmarkId}`,
    storyId: "",
  };

  console.log(journalQueryData?.journals.length);

  const newAuthorModal = () => {
    return (
      <div>
        <h4>Test Header</h4>
        <p>Test content</p>
      </div>
    );
  };

  const journalLogic = () => {
    setStatus(true);
    if (journalQueryData?.journals.length === 0) {
      showNewUserModal(true);
      toast("You need to register your journal before tracking your ride", {
        onClose: () => setStatus(false),
      });
    } else if (journalQueryData?.journals.length !== 0 && !dateComp) {
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
      <button
        disabled={journalQueryData?.journals.length === 0}
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
