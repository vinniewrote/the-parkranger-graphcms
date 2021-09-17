import React, { useContext, useState } from "react";

const StoryContext = React.createContext();
export const useManagedStory = () => useContext(StoryContext);

export function ManageStory({ children }) {
  const [savedStoryId, setSavedStoryId] = useState(null);
  const [journalStatus, setJournalStatus] = useState(false);
  const [savedJournalId, setSavedJournalId] = useState(false);
  const [savedChapterId, setSavedChapterId] = useState(false);
  const [savedLandmarkId, setSavedLandmarkId] = useState([]);
  const [userJournalId, setUserJournalId] = useState(null);
  const [currentChapterId, setCurentChapterId] = useState(null);
  const newDate = new Date();
  const currentDate = newDate.toDateString();
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
    DEFAULT: 'default',
    LOADING: 'loading',
    SUCCESS: 'success',
    DISABLED: 'disabled',
    SUBMITTING: 'submitting',
    SUBMITTED: 'submitted',
    ERROR: 'error',
  }

  const value = {
    savedStoryId,
    setSavedStoryId,
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
    STATUS,
  };

  return (
    <StoryContext.Provider value={value}>{children}</StoryContext.Provider>
  );
}
