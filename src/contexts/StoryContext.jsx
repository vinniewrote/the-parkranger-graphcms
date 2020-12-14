import React, { useContext, useState, useMemo } from "react";

const StoryContext = React.createContext();
export const useManagedStory = () => useContext(StoryContext);

export function ManageStory({ children }) {
  const [savedStoryId, setSavedStoryId] = useState(null);
  const [journalStatus, setJournalStatus] = useState(false);
  const [savedJournalId, setSavedJournalId] = useState(false);
  const [savedChapterId, setSavedChapterId] = useState(false);
  const [savedLandmarkId, setSavedLandmarkId] = useState([]);

  const value = useMemo(() => {
    return {
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
    };
  }, [
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
  ]);

  return (
    <StoryContext.Provider value={value}>{children}</StoryContext.Provider>
  );
}
