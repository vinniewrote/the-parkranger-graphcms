import React, { useContext, useState } from "react";

const StoryContext = React.createContext();
export const useManagedStory = () => useContext(StoryContext);

export function ManageStory({ children }) {
  const [savedStoryId, setSavedStoryId] = useState([]);
  const [savedStoryLandmarkBundle, setSavedStoryLandmarkBundle] = useState([]);
  const [journalStatus, setJournalStatus] = useState(false);
  const [savedJournalId, setSavedJournalId] = useState(false);
  const [savedChapterId, setSavedChapterId] = useState(false);
  const [savedLandmarkId, setSavedLandmarkId] = useState([]);
  const [todaysChapterId, setTodaysChapterId] = useState([]);
  const [userJournalId, setUserJournalId] = useState(null);
  const [currentChapterId, setCurentChapterId] = useState(null);
  const [currentStoryId, setCurrentStoryId] = useState(null);
  const [currentVisitId, setCurrentVisitId] = useState(null);
  const [rawVisitData, setRawVisitData] = useState([]);
  const [landmarkFlagBoolean, setLandmarkFlagBoolean] = useState(null);
  const [newUserStatus, setNewUserStatus] = useState(null);
  const [storyIdForLandmark, setStoryIdForLandmark] = useState(null);
  const [doDatesMatch, setDoDatesMatch] = useState(null);
  const [filter, setFilter] = useState("Coasters");
  const [emptyFilters, setEmptyFilters] = useState(null);
  const [rawVisitCount, setRawVisitCount] = useState(null);
  const newDate = new Date();
  const currentDate = newDate.toISOString();
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

  const value = {
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
    todaysChapterId,
    setTodaysChapterId,
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
    filter,
    setFilter,
    emptyFilters,
    setEmptyFilters,
    rawVisitCount,
    setRawVisitCount,
  };

  return (
    <StoryContext.Provider value={value}>{children}</StoryContext.Provider>
  );
}
