import React, { Fragment, useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { useManagedStory } from "../contexts/StoryContext";
import { useAuth0 } from "@auth0/auth0-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import {
  GET_CHAPTER_ID,
  JOURNAL_CHECK,
  GET_CHAPTER_DATE,
  CHECK_FOR_STORYID,
  CHECK_FOR_LANDMARKS,
  VISIT_LANDMARK_CHECK,
} from "../graphql/queries/journalQueries.js";
import {
  TEST_CREATE_NEW_CHAPTER,
  CREATE_NEW_CHAPTER,
  PUBLISH_JOURNAL,
  CREATE_NEW_STORY,
  CREATE_NEW_VISIT,
  PUBLISH_CHAPTER,
  PUBLISH_STORY,
  PUBLISH_VISIT,
} from "../graphql/mutations/journalMutations";
import { LoggingButton } from "../styledComponents/VisitLogger_styled";
import {
  YourVisitsBlock,
  LoggingCountContainer,
} from "../styledComponents/LandmarkDetails_styled";

export default function VisitLogger(props) {
  const { user } = useAuth0();
  const [status, setStatus] = useState(false);
  const [newUserModal, showNewUserModal] = useState(false);
  const [rawVisitCount, setRawVisitCount] = useState(null);
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
    setSavedStoryId,
    todaysChapterId,
    setTodaysChapterId,
    landmarkFlagBoolean,
    setLandmarkFlagBoolean,
    storyIdForLandmark,
    setStoryIdForLandmark,
    doDatesMatch,
    setDoDatesMatch,
    // rawVisitCount,
    // setRawVisitCount,
  } = useManagedStory();
  const { landmarkId, landmarkName, destinationId, parkId, hotelId, shipId } =
    props;

  let nArr = [];
  let storyArr = [];
  let bundleArray = [];
  let landmarkArray = [];
  let cleanedLandMarkArray = [];

  /************************************************ QUERIES *****************************************************/
  const { loading, error, data } = useQuery(VISIT_LANDMARK_CHECK, {
    variables: { currentPropertyId: landmarkId },
    context: { clientName: "authorLink" },
    onCompleted: () => {
      console.log(data);
      setRawVisitCount(data);
    },
  });

  const {
    loading: journalQueryLoading,
    error: journalQueryError,
    data: journalQueryData,
  } = useQuery(JOURNAL_CHECK, {
    variables: { authZeroId: user.sub },
    context: { clientName: "authorLink" },
    onCompleted: () => {
      journalQueryData?.journals.map(({ id }) => {
        setUserJournalId(id);
      });
    },
  });

  const {
    loading: chapterIDQueryLoading,
    error: chapterIDQueryError,
    data: chapterIDQueryData,
  } = useQuery(GET_CHAPTER_ID, {
    variables: {
      journalTracker: userJournalId,
    },
    pollInterval: 40000,
    context: { clientName: "authorLink" },
    onCompleted() {
      chapterIDQueryData?.journal?.chapters.length > 0
        ? chapterIDQueryData.journal.chapters.map(({ id, date }) => {
            nArr.push(date);
            if (date === todaysDate) {
              setCurentChapterId(id);
            }
          })
        : setCurentChapterId(null);
    },
  });

  // const {
  //   loading: chapterQueryLoading,
  //   error: chapterQueryError,
  //   data: chapterQueryData,
  // } = useQuery(GET_CHAPTER_DATE, {
  //   variables: {
  //     journalTracker: userJournalId || localStorage.getItem("newJournalId"),
  //   },
  //   pollInterval: 8000,
  //   context: { clientName: "authorLink" },
  //   onCompleted() {
  //     chapterQueryData.chapters.map(({ id, date }) => {
  //       nArr.push(date);
  //       console.log(nArr);
  //       if (date === todaysDate) {
  //         console.log("found it");
  //         setCurentChapterId(id);
  //       }
  //     });
  //   },
  // });

  const {
    loading: storyQueryLoading,
    error: storyQueryError,
    data: storyQueryData,
  } = useQuery(CHECK_FOR_STORYID, {
    variables: { currentChapterId: currentChapterId },
    pollInterval: 10000,
    context: { clientName: "authorLink" },
  });

  const {
    loading: landmarkQueryLoading,
    error: landmarkQueryError,
    data: landmarkQueryData,
  } = useQuery(CHECK_FOR_LANDMARKS, {
    variables: {
      authJournalId: userJournalId,
      currentDate: currentDate,
    },
    pollInterval: 10000,
    context: { clientName: "authorLink" },
  });

  /************************************************ MUTATIONS *****************************************************/

  const [
    createNewChapter,
    {
      data: newChapterData,
      loading: newChapterLoading,
      error: newChapterError,
    },
  ] = useMutation(TEST_CREATE_NEW_CHAPTER, {
    variables: {
      authLandmark: landmarkId,
      landmarkIdentifier: landmarkId,
      parkIdentifier: parkId,
      destinationIdent: destinationId,
      authJournalID: userJournalId,
      currentDate: currentDate,
      landmarkTitle: "Title String",
    },
    context: { clientName: "authorLink" },
    onCompleted() {
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
      landmarkIdentifier: landmarkId,
      landmarkTitle: landmarkName,
      currentChptID: todaysChapterId,
    },
    context: { clientName: "authorLink" },
    refetchQueries: [
      { query: GET_CHAPTER_DATE }, // DocumentNode object parsed
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
    context: { clientName: "authorLink" },
    onCompleted() {
      setCurrentVisitId(newVisitData.createVisit.id);
      publishUserChapter();
    },
  });

  const [publishUserChapter] = useMutation(PUBLISH_CHAPTER, {
    variables: { currentChptID: currentChapterId },
    context: { clientName: "authorLink" },
    refetchQueries: [{ query: VISIT_LANDMARK_CHECK }, "CheckLandmarkForVisits"],
    onCompleted() {
      publishUserStory();
    },
  });

  const [publishUserStory] = useMutation(PUBLISH_STORY, {
    variables: { storyDraft: currentStoryId },
    context: { clientName: "authorLink" },
    onCompleted() {
      publishUserVisit();
    },
  });

  const [publishUserVisit] = useMutation(PUBLISH_VISIT, {
    variables: { visitDraft: currentVisitId },
    context: { clientName: "authorLink" },
    // refetchQueries: [{ query: VISIT_LANDMARK_CHECK }, "CheckLandmarkForVisits"],
    onCompleted() {
      publishJournal();
    },
  });

  const [publishJournal] = useMutation(PUBLISH_JOURNAL, {
    variables: {
      authJournalId: userJournalId || localStorage.getItem("newJournalId"),
    },
    context: { clientName: "authorLink" },
  });

  /************************************************ HELPER FUNCTIONS *****************************************************/
  // const chapterMap =
  //   chapterIDQueryData?.journal?.chapters.length > 0 &&
  //   chapterIDQueryData?.journal?.chapters.map(({ id, date }) => {
  //     nArr.push(date);
  //     if (date === todaysDate) {
  //       console.log("over here");
  //       setCurentChapterId(id);
  //     }
  //   });
  console.log(nArr);
  if (nArr.length > 0) {
    const dateComp = nArr.includes(todaysDate);
    setDoDatesMatch(dateComp);
  }

  const storyMap =
    landmarkQueryData !== undefined &&
    landmarkQueryData.stories.map(({ id, propertyId }) => {
      storyArr.push(propertyId);
      bundleArray.push({ propertyId, storyId: id });
    });

  // const landmarkMap =
  //   chapterQueryData !== undefined &&
  //   chapterQueryData.chapters.map(({ id, stories }) => {
  //     landmarkArray.push({ chapterId: id, stories });
  //   });

  console.log(landmarkArray);

  // const cleanLandmark = landmarkArray.map(
  //   (landmark, id, chapterId, stories) => {
  //     landmark.stories.map(({ id, propertyId }) => {
  //       let chpId = landmark.chapterId;
  //       cleanedLandMarkArray.push({ chpId, propertyId, storyId: id });
  //     });
  //   }
  // );

  if (
    cleanedLandMarkArray?.length > 0 &&
    chapterIDQueryData?.journal?.chapters.length > 0
  ) {
    const findTodaysChapterId = chapterIDQueryData?.journal?.chapters?.find(
      (c) => c.date === todaysDate
    );
    let isTodaysChapterId = findTodaysChapterId?.id;
    console.log(cleanedLandMarkArray);
    console.log(isTodaysChapterId);
    const findTodays = cleanedLandMarkArray?.filter(
      (d) => d.chpId === todaysChapterId
    );

    console.log(`findTodays - ${findTodays}`);

    const onlyLandmarks = findTodays.map((marks) => marks.propertyId);

    console.log(`findTodays - ${onlyLandmarks}`);

    const landmarkFlag = onlyLandmarks.includes(`${landmarkId}`);

    console.log(`findTodays - ${landmarkFlag}`);

    setLandmarkFlagBoolean(landmarkFlag);
    setTodaysChapterId(isTodaysChapterId);
  }
  console.log(bundleArray);
  if (bundleArray.length > 0) {
    const findStoryIdForLandmark = bundleArray.find(
      (b) => b.propertyId === landmarkId
    );
    const storyIdToLdmk = findStoryIdForLandmark?.storyId;
    setStoryIdForLandmark(storyIdToLdmk);
  }

  console.log(storyIdForLandmark);
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

  console.log(landmarkFlagBoolean);
  console.log(destinationId);
  /************************************************ JOURNAL LOGIC **************************************************/

  const journalLogic = () => {
    setStatus(true);
    if (journalQueryData?.journals?.length === 0) {
      showNewUserModal(true);
      toast("You need to register your journal before tracking your ride", {
        onClose: () => setStatus(false),
      });
    } else if (journalQueryData?.journals?.length > 0 && !doDatesMatch) {
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
      <LoggingCountContainer>
        <YourVisitsBlock>
          <h4>Your Visits</h4>
          <p>{rawVisitCount?.visits.length}</p>
        </YourVisitsBlock>
        <LoggingButton
          disabled={journalQueryData?.journals?.length === 0}
          type="button"
          onClick={() => {
            journalLogic();
          }}
        >
          <span>+</span>
        </LoggingButton>
        <ToastContainer />
      </LoggingCountContainer>
      <p>
        {rawVisitCount?.visits.length > 0
          ? "Welcome Back"
          : "You havent been here yet"}
      </p>
    </Fragment>
  );
}
