import React, { useContext, useState, useMemo } from "react";
import { useQuery, gql, useMutation } from "@apollo/client";
import { useAuth0 } from "@auth0/auth0-react";

const StoryContext = React.createContext();
export const useManagedStory = () => useContext(StoryContext);

export function ManageStory({ children }) {
  const [savedStoryId, setSavedStoryId] = useState(null);
  const [journalStatus, setJournalStatus] = useState(false);
  const [savedJournalId, setSavedJournalId] = useState(false);
  const [savedChapterId, setSavedChapterId] = useState(false);
  const [savedLandmarkId, setSavedLandmarkId] = useState([]);
  const newDate = new Date();
  const currentDate = newDate.toDateString();
  const currentDay = newDate.getDate().toString().padStart(2, "0");
  const currentMonth = (newDate.getMonth() + 1).toString().padStart(2, "0");
  const currentYear = newDate.getFullYear();
  let todaysDate = `${currentYear}-${currentMonth}-${currentDay}`;
  const weekday = new Array(7);

  weekday[0] = "Sunday";
  weekday[1] = "Monday";
  weekday[2] = "Tuesday";
  weekday[3] = "Wednesday";
  weekday[4] = "Thursday";
  weekday[5] = "Friday";
  weekday[6] = "Saturday";

  // let authUserId = user.sub;

  let dayName = weekday[currentDay];

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
  };

  return (
    <StoryContext.Provider value={value}>{children}</StoryContext.Provider>
  );
}
