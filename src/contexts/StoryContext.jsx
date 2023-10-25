import React, { useContext, useState } from "react";
import { useQuery } from "@apollo/client";
import { LANDMARK_LISTING } from "../graphql/queries/journalQueries";

const StoryContext = React.createContext();
export const useManagedStory = () => useContext(StoryContext);

export function ManageStory({ children }) {
  const [currParkID, setCurrParkID] = useState(null);
  const [sub, setSub] = useState(null);
  const [savedStoryId, setSavedStoryId] = useState([]);
  const [savedStoryLandmarkBundle, setSavedStoryLandmarkBundle] = useState([]);
  const [authorId, setAuthorId] = useState();
  const [journalStatus, setJournalStatus] = useState(false);
  const [savedJournalId, setSavedJournalId] = useState(false);
  const [savedChapterId, setSavedChapterId] = useState(false);
  const [savedLandmarkId, setSavedLandmarkId] = useState([]);
  // const [todaysChapterId, setTodaysChapterId] = useState([]);
  const [userJournalId, setUserJournalId] = useState(null);
  const [currentChapterId, setCurentChapterId] = useState(null);
  const [currentUserArticles, setCurrentUserArticles] = useState(null);
  const [currentStoryId, setCurrentStoryId] = useState(null);
  const [currentVisitId, setCurrentVisitId] = useState(null);
  const [rawVisitData, setRawVisitData] = useState(null);
  const [landmarkFlagBoolean, setLandmarkFlagBoolean] = useState(null);
  const [newUserStatus, setNewUserStatus] = useState(null);
  const [storyIdForLandmark, setStoryIdForLandmark] = useState(null);
  const [doDatesMatch, setDoDatesMatch] = useState(null);
  const [filter, setFilter] = useState("Coasters");
  const [emptyFilters, setEmptyFilters] = useState(null);
  const [cleanedArticles, setCleanedArticles] = useState(null);
  const newDate = new Date();

  const currentDay = newDate.getDate().toString().padStart(2, "0");
  const currentNumberDay = newDate.getDay();
  const currentMonth = (newDate.getMonth() + 1).toString().padStart(2, "0");
  const currentYear = newDate.getFullYear();
  const todaysDate = `${currentYear}-${currentMonth}-${currentDay}`;
  const weekday = new Array(7);
  weekday[0] = "Sunday";
  weekday[1] = "Monday";
  weekday[2] = "Tuesday";
  weekday[3] = "Wednesday";
  weekday[4] = "Thursday";
  weekday[5] = "Friday";
  weekday[6] = "Saturday";

  let dayName = weekday[currentNumberDay];

  const STATUS = {
    DEFAULT: "default",
    LOADING: "loading",
    SUCCESS: "success",
    DISABLED: "disabled",
    SUBMITTING: "submitting",
    SUBMITTED: "submitted",
    ERROR: "error",
  };

  const toISOStringWithTimezone = (date) => {
    const tzOffset = -date.getTimezoneOffset();
    const diff = tzOffset >= 0 ? "+" : "-";
    const pad = (n) => `${Math.floor(Math.abs(n))}`.padStart(2, "0");
    return (
      date.getFullYear() +
      "-" +
      pad(date.getMonth() + 1) +
      "-" +
      pad(date.getDate()) +
      "T" +
      pad(date.getHours()) +
      ":" +
      pad(date.getMinutes()) +
      ":" +
      pad(date.getSeconds()) +
      diff +
      pad(tzOffset / 60) +
      ":" +
      pad(tzOffset % 60)
    );
  };
  const currentDate = toISOStringWithTimezone(newDate);
  const currentISODate = currentDate.toISOString;
  const [rawAreaData, setRawAreaData] = useState(null);
  const [cleanedData, setCleanedData] = useState(null);
  const [filterBarItems, setFilterBarItems] = useState(null);
  const [secondaryFilterBarItems, setSecondaryFilterBarItems] = useState(null);
  const [currentSelectedCategory, setCurrentSelectedCategory] = useState(null);
  const [currentSelectedSubCategory, setCurrentSelectedSubCategory] =
    useState(null);
  const [currSubCategory, setCurrSubCategory] = useState(null);
  const [parkFilterItem, setParkFilterItem] = useState(null);

  let cleanedPlate = [];
  const { loading, error, data } = useQuery(LANDMARK_LISTING, {
    variables: { propertyId: currParkID, authZeroId: sub },
    pollInterval: 10000,
    context: { clientName: "authorLink" },
    onCompleted: () => {
      data.property.childProp.map((simpleArea) => {
        simpleArea?.childProp?.map((simp) => {
          cleanedPlate.push({
            casualAreaName: simpleArea.name,
            casualPropertyName: simp.name,
            casualPropertyID: simp.id,
            casualCategoryName: simp.category.pluralName,
            casualAreaLink: `/properties/${currParkID}/${simp.id}`,
            casualClassifications: simp.classification?.map((landClass) => {
              return landClass.name;
            }),
          });
        });
        return cleanedPlate;
      });
      console.log(cleanedPlate);
      setCleanedData(cleanedPlate);
      setParkFilterItem(cleanedPlate);
      setRawAreaData(data.property.childProp);
      setFilterBarItems([
        ...new Set(
          cleanedPlate?.map((cleanVal) => cleanVal.casualCategoryName)
        ),
      ]);
    },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  console.log(filterBarItems);
  console.log(parkFilterItem);

  const secondaryClean = (currCategory) => {
    console.log(currCategory);
    console.log(cleanedData);
    let filterShire = [];
    cleanedData?.map((cleanSubVal) => {
      if (cleanSubVal.casualCategoryName === currCategory) {
        console.log("its true focker");
        filterShire.push(cleanSubVal.casualClassifications);
      }
    });
    setSecondaryFilterBarItems([...new Set(filterShire.flat(Infinity))]);
    console.log(filterShire.flat(Infinity));
    return filterShire;
  };

  const filterItem = (currCategory) => {
    console.log(currCategory);
    secondaryClean(currCategory);
    const newItem = cleanedData?.filter((newVal) => {
      setCurrentSelectedCategory(currCategory);
      return newVal.casualCategoryName === currCategory;
    });
    setParkFilterItem(newItem);
  };
  console.log(secondaryFilterBarItems);

  const secondaryFilterItem = (currSubCategory) => {
    const newSubItem = cleanedData?.filter((newVal) => {
      setCurrSubCategory(currSubCategory);
      return (
        newVal.casualCategoryName === currentSelectedCategory &&
        newVal.casualClassifications?.includes(currSubCategory)
      );
    });
    setParkFilterItem(newSubItem);
  };

  const value = {
    authorId,
    setAuthorId,
    savedStoryId,
    setSavedStoryId,
    savedStoryLandmarkBundle,
    setSavedStoryLandmarkBundle,
    journalStatus,
    setJournalStatus,
    savedJournalId,
    setSavedJournalId,
    savedChapterId,
    setSavedChapterId,
    savedLandmarkId,
    setSavedLandmarkId,
    currentDate,
    currentISODate,
    currentDay,
    dayName,
    todaysDate,
    userJournalId,
    setUserJournalId,
    currentChapterId,
    setCurentChapterId,
    rawVisitData,
    setRawVisitData,
    STATUS,
    landmarkFlagBoolean,
    setLandmarkFlagBoolean,
    newUserStatus,
    setNewUserStatus,
    storyIdForLandmark,
    setStoryIdForLandmark,
    doDatesMatch,
    setDoDatesMatch,
    currentStoryId,
    currentVisitId,
    setCurrentStoryId,
    setCurrentVisitId,
    currentUserArticles,
    setCurrentUserArticles,
    cleanedArticles,
    setCleanedArticles,
    filter,
    setFilter,
    emptyFilters,
    setEmptyFilters,
    toISOStringWithTimezone,
    cleanedData,
    setCleanedData,
    filterBarItems,
    setFilterBarItems,
    secondaryFilterBarItems,
    setSecondaryFilterBarItems,
    currentSelectedCategory,
    setCurrentSelectedCategory,
    parkFilterItem,
    setParkFilterItem,
    filterItem,
    secondaryFilterItem,
    rawAreaData,
    setRawAreaData,
    currParkID,
    setCurrParkID,
    currSubCategory,
    setCurrSubCategory,
    sub,
    setSub,
    currentSelectedSubCategory,
    setCurrentSelectedSubCategory,
  };

  return (
    <StoryContext.Provider value={value}>{children}</StoryContext.Provider>
  );
}
