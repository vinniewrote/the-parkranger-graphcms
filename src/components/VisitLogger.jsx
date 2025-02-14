import React, { Fragment, useState, useEffect } from "react";
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
  IS_PROPERTY_LOGGED_TO_STORY,
  GET_TODAYS_CHAPTER_DATA,
  ALPHA_GET_USER_VISITS,
  PROPERTY_VISIT_COUNTER,
} from "../graphql/queries/journalQueries.js";
import {
  CREATE_NEW_STORY_FINAL,
  CREATE_NEW_CHAPTER_FINAL,
  CREATE_NEW_VISIT_FINAL,
  CREATE_NEW_ARTICLE_FINAL,
  ADD_STORY_TO_ARTICLE_FINAL,
} from "../graphql/mutations/journalMutations";
import { LoggingButton } from "../styledComponents/VisitLogger_styled";
import {
  YourVisitsBlock,
  LoggingCountContainer,
} from "../styledComponents/LandmarkDetails_styled";

export default function VisitLogger(props) {
  const {
    landmarkId,
    landmarkName,
    destinationId,
    parkId,
    hotelId,
    shipId,
    districtId,
    foundlingId,
  } = props;
  const { user } = useAuth0();
  const [status, setStatus] = useState(false);
  const [newUserModal, showNewUserModal] = useState(false);
  const [rawVisitCount, setRawVisitCount] = useState(null);
  const [landmarkVisitedPrior, setLandmarkVisitedPrior] = useState(null);
  const [userArticles, setUserArticles] = useState(null);
  const [storyBlock, setStoryBlock] = useState(null);
  const [propertyVisitCount, setPropertyVisitCount] = useState(null);
  const [storyLandmarkBundle, setStoryLandmarkBundle] = useState(null);
  const {
    currentDate,
    todaysDate,
    userJournalId,
    setUserJournalId,
    currentChapterId,
    setCurentChapterId,
    setCurrentStoryId,
    setCurrentVisitId,
    setSavedStoryId,
    todaysChapterId,
    setTodaysChapterId,
    setLandmarkFlagBoolean,
    setStoryIdForLandmark,
    doDatesMatch,
    setDoDatesMatch,
    rawVisitData,
    setRawVisitData,
    currentUserArticles,
    setCurrentUserArticles,
    cleanedArticles,
    setCleanedArticles,
    authorId,
  } = useManagedStory();

  let nArr = [];
  let storyArr = [];
  let bundleArray = [];
  let landmarkArray = [];
  let cleanedLandMarkArray = [];
  let articleBundle = [];
  let propStoryBundle = [];
  let todaysChapterBundle = [];
  let newArticleAdditionBundle = [];

  // function isDestMatch(dest) {
  //   return dest.destinationID === destinationId;
  // }
  // function isParkMatch(dest) {
  //   return dest.parkID === parkId;
  // }

  let propParkIdentity =
    parkId === undefined
      ? hotelId || shipId || districtId || foundlingId
      : parkId;

  console.log(propParkIdentity);

  /************************************************ QUERIES *****************************************************/

  const {
    loading: propertyVisitLoading,
    error: propertyVisitError,
    data: propertyVisitData,
  } = useQuery(PROPERTY_VISIT_COUNTER, {
    variables: { landmarkTracker: landmarkId, authorIdentifier: authorId },
    pollInterval: 50000,
    context: { clientName: "authorLink" },
    onCompleted: () => {
      setPropertyVisitCount(propertyVisitData.visitsConnection.aggregate.count);
    },
  });

  const {
    loading: todaysChpDataLoading,
    error: todaysChpDataError,
    data: todaysChpDataOutput,
  } = useQuery(GET_TODAYS_CHAPTER_DATA, {
    variables: { currentChapterId: currentChapterId },
    context: { clientName: "authorLink" },
    pollInterval: 100000,
    onCompleted: () => {
      console.log(todaysChpDataOutput.chapter.articles);
      todaysChpDataOutput.chapter.articles.map((farty, index) => {
        todaysChapterBundle.push({
          articleID: farty.id,
          destinationID: farty.properties[0].id,
          parkID: farty.properties[1].id,
          stories: farty.stories.map((story) => ({ storyId: story.id })),
        });
        return todaysChapterBundle;
      });
      console.log(todaysChapterBundle);
      setCurrentUserArticles(todaysChpDataOutput.chapter.articles);
      setCleanedArticles(todaysChapterBundle);
    },
  });

  const {
    loading: isPropertyStoryLoading,
    error: isPropertyStoryError,
    data: isPropertyStoryData,
  } = useQuery(IS_PROPERTY_LOGGED_TO_STORY, {
    variables: { landmarkTracker: landmarkId, authorIdentifier: authorId },
    context: { clientName: "authorLink" },
    pollInterval: 40000,
    onCompleted: () => {
      console.log(isPropertyStoryData);
      isPropertyStoryData.stories.map((story, index) => {
        let propStoryId = story.id;
        let newStoryDate = story.storyDate;

        propStoryBundle.push({
          propStoryID: propStoryId,
          propStoryDate: newStoryDate,
        });
        console.log(propStoryBundle);
      });
      setStoryBlock(propStoryBundle);
    },
  });
  console.log(
    storyBlock?.some((storee) => {
      storee.propStoryDate === todaysDate &&
        setStoryIdForLandmark(storee.propStoryID);
    })
  );

  const { loading, error, data } = useQuery(VISIT_LANDMARK_CHECK, {
    variables: { currentPropertyId: landmarkId, authorIdentifier: authorId },
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
    variables: {
      landmarkTracker: landmarkId,
      currentDate: currentDate,
      authorIdentifier: authorId,
    },
    pollInterval: 40000,
    context: { clientName: "authorLink" },
    onCompleted: () => {
      priorLogData?.visits.length > 0
        ? setLandmarkVisitedPrior(true)
        : setLandmarkVisitedPrior(false);
      setStoryLandmarkBundle({
        ldmkID: landmarkId,
        ldmkStoryID: priorLogData.visits[0]?.story.id,
      });
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
  console.log(todaysDate);
  const {
    loading: visitDataQueryLoading,
    error: visitDataQueryError,
    data: visitQueryData,
  } = useQuery(GET_USER_VISIT_DATA, {
    variables: { journalTracker: userJournalId },
    context: { clientName: "authorLink" },
    pollInterval: 40000,
    onCompleted() {
      // console.log(visitQueryData?.journal?.chapters);
      const rawChapters = visitQueryData?.journal?.chapters;
      const targetChapterIndex = rawChapters.findIndex(
        (chap) => chap.date === todaysDate
      );
      // console.log(targetChapterIndex);
      // console.log(rawChapters);
      const todaysArticleArray = visitQueryData?.journal?.chapters[
        targetChapterIndex
      ]?.articles.map((item, index) => ({
        articleID: item.id,
        destinationID: item.properties[0]?.id,
        parkID: item.properties[1]?.id,
        rawStories: item?.stories?.map((story, index) => ({
          storyID: story?.id,
          storyLandmarkID: story?.property?.id,
        })),
      }));

      setRawVisitData(visitQueryData?.journal?.chapters);
      setUserArticles(todaysArticleArray);
    },
  });

  console.log(rawVisitData?.articles);

  const articleArray =
    rawVisitData?.articles?.length > 0 &&
    rawVisitData.articles.map((item, index) => ({
      articleID: item.id,
      destinationID: item.properties[0]?.id,
      parkID: item.properties[1]?.id,
      rawStories: item?.stories,
    }));

  console.log(articleArray);

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
  ] = useMutation(CREATE_NEW_CHAPTER_FINAL, {
    variables: {
      authorIdentifier: authorId,
      authLandmark: landmarkId,
      landmarkIdentifier: landmarkId,
      parkIdentifier: propParkIdentity,
      destinationIdent: destinationId,
      authJournalID: userJournalId,
      currentDate: currentDate,
    },
    context: { clientName: "authorLink" },
    refetchQueries: [
      { query: PROPERTY_VISIT_COUNTER },
      "BetaVisitCount",
      { query: GET_USER_VISIT_DATA },
      "getUserVisitData",
      { query: HAS_PROPERTY_BEEN_LOGGED },
      "checkPropertyForPriorLog",
    ],

    onCompleted() {
      setCurrentUserArticles(newChapterData.createChapter.articles);
      setCurentChapterId(newChapterData.createChapter.id);

      newChapterData.createChapter.articles.map((party, index) => {
        newArticleAdditionBundle.push({
          articleID: party.id,
          destinationID: party.properties[0].id,
          parkID: party.properties[1].id,
          stories: party.stories.map((story) => ({ storyId: story.id })),
        });
        return newArticleAdditionBundle;
      });

      console.log(`created articles: ${newChapterData.createChapter.articles}`);
      setCleanedArticles(newArticleAdditionBundle);
    },
  });

  const [
    createNewArticle,
    {
      data: newArticleData,
      loading: newArticleLoading,
      error: newArticleError,
    },
  ] = useMutation(CREATE_NEW_ARTICLE_FINAL, {
    variables: {
      authorIdentifier: authorId,
      authLandmark: landmarkId,
      landmarkIdentifier: landmarkId,
      parkIdentifier: propParkIdentity,
      destinationIdent: destinationId,
      currentDate: currentDate,
      chapterIdentifier: currentChapterId,
    },
    context: { clientName: "authorLink" },
    refetchQueries: [
      { query: PROPERTY_VISIT_COUNTER },
      "BetatVisitCount",
      { query: GET_USER_VISIT_DATA },
      "getUserVisitData",
      { query: HAS_PROPERTY_BEEN_LOGGED },
      "checkPropertyForPriorLog",
    ],
    onCompleted() {
      newArticleData.createArticle.map((arty, index) => {
        articleStoryBundle.push({
          articleID: arty.id,
          destinationID: arty.properties[0].id,
          parkID: arty.properties[1].id,
          stories: arty.stories.map((story) => ({ storyId: story.id })),
        });
        return articleStoryBundle;
      });

      // console.log(`created new article: ${newArticleData}`);
      setCleanedArticles(articleStoryBundle);
    },
  });

  // add another layer
  console.log(propParkIdentity);
  const destParkMatch = cleanedArticles?.filter(function (parkdest) {
    return (
      parkdest.destinationID === destinationId &&
      parkdest.parkID === propParkIdentity
    );
  });
  // console.log(destParkMatch?.[0].articleID);

  const [
    createStoryForExistingArticle,
    {
      data: newStoryArticleData,
      loading: newStoryArticleLoading,
      error: newStoryArticleError,
    },
  ] = useMutation(ADD_STORY_TO_ARTICLE_FINAL, {
    variables: {
      chapterIdentifier: currentChapterId,
      articleIdentifier: destParkMatch?.[0]?.articleID,
      landmarkIdentifier: landmarkId,
      destinationIdent: destParkMatch?.[0]?.destinationID,
      parkIdentifier: propParkIdentity,
      authorIdentifier: authorId,
      currentDate: currentDate,
      storyTitle: "Title String",
    },
    context: { clientName: "authorLink" },
    refetchQueries: [
      { query: PROPERTY_VISIT_COUNTER },
      "BetatVisitCount",
      { query: GET_USER_VISIT_DATA },
      "getUserVisitData",
      { query: HAS_PROPERTY_BEEN_LOGGED },
      "checkPropertyForPriorLog",
    ],
    onCompleted() {
      console.log(newStoryArticleData);
    },
  });

  const [
    createVisitForExistingStory,
    {
      data: newUserVisitData,
      loading: newUserVisitLoading,
      error: newUserVisitError,
    },
  ] = useMutation(CREATE_NEW_VISIT_FINAL, {
    variables: {
      storyIdentifier: storyLandmarkBundle?.ldmkStoryID,
      landmarkIdentifier: landmarkId,
      authorIdentifier: authorId,
      currentDate: currentDate,
    },
    context: { clientName: "authorLink" },
    refetchQueries: [
      { query: PROPERTY_VISIT_COUNTER },
      "BetaVisitCount",
      { query: GET_USER_VISIT_DATA },
      "getUserVisitData",
      { query: HAS_PROPERTY_BEEN_LOGGED },
      "checkPropertyForPriorLog",
    ],
    onCompleted() {
      console.log(newUserVisitData);
    },
  });

  const [
    createNewStory,
    { data: newStoryData, loading: newStoryLoading, error: newStoryError },
  ] = useMutation(CREATE_NEW_STORY_FINAL, {
    variables: {
      landmarkIdentifier: landmarkId,
      landmarkTitle: landmarkName,
      currentChptID: todaysChapterId,
    },
    context: { clientName: "authorLink" },
    refetchQueries: [{ query: GET_CHAPTER_DATE }, "GetChapterDate"],
    onCompleted() {
      setCurrentStoryId(newStoryData.createStory.id);
      setCurrentVisitId(newStoryData.createStory.visits[0].id);
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

  if (
    cleanedLandMarkArray?.length > 0 &&
    chapterIDQueryData?.journal?.chapters.length > 0
  ) {
    const findTodaysChapterId = chapterIDQueryData?.journal?.chapters?.find(
      (c) => c.date === todaysDate
    );
    let isTodaysChapterId = findTodaysChapterId?.id;
    // console.log(cleanedLandMarkArray);
    // console.log(isTodaysChapterId);
    const findTodays = cleanedLandMarkArray?.filter(
      (d) => d.chpId === todaysChapterId
    );
    const onlyLandmarks = findTodays.map((marks) => marks.propertyId);

    const landmarkFlag = onlyLandmarks.includes(`${landmarkId}`);

    setLandmarkFlagBoolean(landmarkFlag);
    setTodaysChapterId(isTodaysChapterId);
  }

  if (bundleArray.length > 0) {
    const findStoryIdForLandmark = bundleArray.find(
      (b) => b.propertyId === landmarkId
    );
    const storyIdToLdmk = findStoryIdForLandmark?.storyId;
    setStoryIdForLandmark(storyIdToLdmk);
  }
  console.log(userArticles);
  const loggedUserDestinations =
    userArticles?.length > 0 &&
    userArticles.map((destination, index) => destination.destinationID);
  console.log(loggedUserDestinations);

  const isDestinationLogged =
    loggedUserDestinations !== false &&
    loggedUserDestinations.includes(`${destinationId}`);

  const loggedUserParks =
    userArticles?.length > 0 && userArticles.map((park, index) => park.parkID);
  console.log(loggedUserParks);
  const isParkLogged =
    loggedUserParks !== false &&
    loggedUserParks?.includes(`${propParkIdentity}`);

  const loggedUserStories =
    userArticles?.length > 0 &&
    userArticles.map((story, index) => story.rawStories);

  const isLandmarkLogged =
    loggedUserStories !== false && loggedUserStories.includes(`${parkId}`);
  console.log(loggedUserStories);

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

  useEffect(
    (currentUserArticles) => {
      // console.log("haha bitches");
      // console.log(userArticles);
    },
    [currentUserArticles]
  );

  /************************************************ JOURNAL LOGIC **************************************************/
  // console.log(foundlingState);
  console.log(landmarkVisitedPrior);
  console.log(isDestinationLogged);
  console.log(isParkLogged);
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
    } else if (
      landmarkVisitedPrior === false &&
      currentChapterId !== null &&
      isDestinationLogged === false &&
      isParkLogged === false
    ) {
      createNewArticle();
      toast("creating your new article", { onClose: () => setStatus(false) });
    } else if (
      landmarkVisitedPrior === false &&
      currentChapterId !== null &&
      isDestinationLogged === true &&
      isParkLogged === false
    ) {
      createNewArticle();
      toast("new article, new park, same destination", {
        onClose: () => setStatus(false),
      });
    } else if (
      landmarkVisitedPrior === false &&
      currentChapterId !== null &&
      isDestinationLogged === true &&
      isParkLogged === true
    ) {
      // console.log("creating a new story");
      createStoryForExistingArticle();
      toast("adding story to article", { onClose: () => setStatus(false) });
    } else if (
      landmarkVisitedPrior === true &&
      currentChapterId !== null &&
      isDestinationLogged === true &&
      isParkLogged === true
    ) {
      createVisitForExistingStory();
      toast("adding visit to existing story....new shit!", {
        onClose: () => setStatus(false),
      });
    }
  };
  console.log(rawVisitCount?.visits.length);
  return (
    <Fragment>
      <LoggingCountContainer>
        <YourVisitsBlock>
          <h4>Your Visits</h4>
          <p>
            {propertyVisitCount === undefined ? (
              <span>0</span>
            ) : (
              <span>{propertyVisitCount}</span>
            )}
          </p>
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
