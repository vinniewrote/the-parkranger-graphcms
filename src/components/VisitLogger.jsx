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
  HAS_PROPERTY_BEEN_LOGGED,
  GET_USER_VISIT_DATA,
} from "../graphql/queries/journalQueries.js";
import {
  CREATE_NEW_CHAPTER,
  PUBLISH_JOURNAL,
  CREATE_NEW_STORY,
  CREATE_NEW_VISIT,
  PUBLISH_CHAPTER,
  PUBLISH_STORY,
  PUBLISH_VISIT,
  TEST_CREATE_NEW_CHAPTER,
  TEST_CREATE_NEW_ARTICLE,
  TEST_ADD_NEW_STORY_TO_ARTICLE,
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
  const [landmarkVisitedPrior, setLandmarkVisitedPrior] = useState(null);
  const [userArticles, setUserArticles] = useState(null);
  const [testcleanedArray, setTestCleanedArray] = useState(null);
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
    rawVisitData,
    setRawVisitData,
    currentUserArticles,
    setCurrentUserArticles,
    cleanedArticles,
    setCleanedArticles,
  } = useManagedStory();
  const { landmarkId, landmarkName, destinationId, parkId, hotelId, shipId } =
    props;

  let nArr = [];
  let storyArr = [];
  let bundleArray = [];
  let landmarkArray = [];
  let cleanedLandMarkArray = [];
  let articleBundle = [];

  /************************************************ QUERIES *****************************************************/
  const { loading, error, data } = useQuery(VISIT_LANDMARK_CHECK, {
    variables: { currentPropertyId: landmarkId },
    context: { clientName: "authorLink" },
    onCompleted: () => {
      // console.log(data);
      setRawVisitCount(data);
    },
  });

  const {
    loading: priorLogLoading,
    error: priorLogError,
    data: priorLogData,
  } = useQuery(HAS_PROPERTY_BEEN_LOGGED, {
    variables: { landmarkTracker: landmarkId, currentDate: currentDate },
    context: { clientName: "authorLink" },
    onCompleted: () => {
      // console.log(priorLogData?.visits.length);
      priorLogData?.visits.length > 0
        ? setLandmarkVisitedPrior(true)
        : setLandmarkVisitedPrior(false);
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

  const {
    loading: visitDataQueryLoading,
    error: visitDataQueryError,
    data: visitQueryData,
  } = useQuery(GET_USER_VISIT_DATA, {
    variables: { journalTracker: userJournalId },
    context: { clientName: "authorLink" },
    onCompleted() {
      // console.log(visitQueryData?.journal?.chapters[0]);

      const articArray = visitQueryData?.journal?.chapters[0].articles.map(
        (item, index) => ({
          articleID: item.id,
          destinationID: item.properties[0]?.id,
          parkID: item.properties[1]?.id,
          rawStories: item?.stories?.map((story, index) => ({
            storyID: story.id,
            storyLandmarkID: story.property.id,
          })),
        })
      );

      setRawVisitData(visitQueryData?.journal?.chapters[0]);
      setUserArticles(articArray);
    },
  });

  // console.log(rawVisitData?.articles);

  const articleArray =
    rawVisitData?.articles?.length > 0 &&
    rawVisitData.articles.map((item, index) => ({
      articleID: item.id,
      destinationID: item.properties[0]?.id,
      parkID: item.properties[1]?.id,
      rawStories: item?.stories,
    }));

  console.log(articleArray);
  // articleArray?.length > 0 && setCleanedArticles([...articleArray]);

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
      parkIdentifier: parkId === undefined ? hotelId || shipId : parkId,
      destinationIdent: destinationId,
      authJournalID: userJournalId,
      currentDate: currentDate,
      landmarkTitle: "Title String",
    },
    context: { clientName: "authorLink" },
    onCompleted() {
      setCurentChapterId(newChapterData.createChapter.id);
      newChapterData.createChapter.articles.map((arty, index) => {
        articleStoryBundle.push({
          articleID: arty.id,
          destinationID: arty.properties[0].id,
          parkID: arty.properties[1].id,
          stories: arty.stories.map((story) => ({ storyId: story.id })),
        });
        return articleStoryBundle;
      });
      setCurrentUserArticles(newChapterData.createChapter.articles);
      setCleanedArticles(articleStoryBundle);
      // setCurrentStoryId(newChapterData.createChapter.stories[0].id);
      // setCurrentVisitId(newChapterData.createChapter.stories[0].visits[0].id);
    },
  });

  const [
    createNewArticle,
    {
      data: newArticleData,
      loading: newArticleLoading,
      error: newArticleError,
    },
  ] = useMutation(TEST_CREATE_NEW_ARTICLE, {
    variables: {
      authLandmark: landmarkId,
      landmarkIdentifier: landmarkId,
      parkIdentifier: parkId === undefined ? hotelId || shipId : parkId,
      destinationIdent: destinationId,
      currentDate: currentDate,
      visitTitle: "Title String",
      chapterIdentifier: currentChapterId,
    },
    context: { clientName: "authorLink" },
    onCompleted() {
      console.log(newArticleData);
    },
  });
  const [
    createStoryForExistingArticle,
    {
      data: newStoryArticleData,
      loading: newStoryArticleLoading,
      error: newStoryArticleError,
    },
  ] = useMutation(TEST_ADD_NEW_STORY_TO_ARTICLE, {
    variables: {
      chapterIdentifier: currentChapterId,
      articleIdentifier: cleanedArticles[0].articleID, //need to find the appropriate index when there are multiples
      landmarkIdentifier: landmarkId,
      destinationIdent: cleanedArticles[0].destinationID,
      parkIdentifier: cleanedArticles[0].parkID,
      currentDate: currentDate,
      visitTitle: "Title String",
      storyTitle: "Title String",
    },
    context: { clientName: "authorLink" },
    onCompleted() {
      console.log(newStoryArticleData);
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
    },
  });

  /************************************************ HELPER FUNCTIONS *****************************************************/
  const chapterMap =
    chapterIDQueryData?.journal?.chapters.length > 0 &&
    chapterIDQueryData?.journal?.chapters.map(({ id, date }) => {
      nArr.push(date);
      if (date === todaysDate) {
        console.log("over here");
      }
    });
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

  const loggedUserDestinations =
    userArticles?.length > 0 &&
    userArticles.map((destination, index) => destination.destinationID);

  const isDestinationLogged =
    loggedUserDestinations !== false &&
    loggedUserDestinations.includes(`${destinationId}`);
  // console.log(isDestinationLogged);

  const loggedUserParks =
    userArticles?.length > 0 && userArticles.map((park, index) => park.parkID);
  const isParkLogged =
    loggedUserParks !== false && loggedUserParks?.includes(`${parkId}`);
  // console.log(isParkLogged);

  const loggedUserStories =
    userArticles?.length > 0 &&
    userArticles.map((story, index) => story.rawStories);

  const isLandmarkLogged =
    loggedUserStories !== false && loggedUserStories.includes(`${parkId}`);
  // console.log(loggedUserStories);

  const storyLandmarkValuePairs =
    loggedUserStories !== false &&
    loggedUserStories[0].map((loggedStory, index) => ({
      loggedStoryID: loggedStory.storyID,
      loggedLandmarkID: loggedStory.storyLandmarkID,
    }));

  console.log(storyLandmarkValuePairs);

  const currentStoryMap =
    storyQueryData !== undefined &&
    storyQueryData.stories.map(({ id }) => {
      setSavedStoryId(id);
    });
  let articleStoryBundle = [];

  // const userArticleIds =
  //   currentUserArticles?.length > 0 &&
  //   currentUserArticles.map((arty, index) => {
  //     articleStoryBundle.push({
  //       articleID: arty.id,
  //       destinationID: arty.properties[0].id,
  //       parkID: arty.properties[1].id,
  //       stories: arty.stories,
  //     });
  //     return articleStoryBundle;
  // arty.stories.map((story, index) => {
  //   articleStoryBundle.push({ storyID: story.id });
  // });
  // });
  // console.log(userArticleIds);
  // articleStoryBundle.length > 0 && setTestCleanedArray(userArticleIds);

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
      // create new article if there is a currentchapterID and parks/destination IDs DO NOT match
    } else if (
      currentChapterId !== null &&
      isDestinationLogged === false &&
      isParkLogged === false
    ) {
      createNewArticle();
      toast("creating your new article", { onClose: () => setStatus(false) });
    } else if (
      // add story to article when the currentchapterID is present and park/dest ID DO match and landmarkID does not
      landmarkVisitedPrior === false &&
      currentChapterId !== null &&
      isDestinationLogged === true &&
      isParkLogged === true
    ) {
      createStoryForExistingArticle();
      toast("adding story to article", { onClose: () => setStatus(false) });
    } else if (
      landmarkVisitedPrior === true &&
      currentChapterId !== null &&
      isDestinationLogged === true &&
      isParkLogged === true
    ) {
      // createNewChapter();
      // createNewVisit();
      toast("adding visit to existing story....well nah", {
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
