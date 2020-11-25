import React, { useContext, useState, useMemo } from "react";

const StoryContext = React.createContext();
export const useManagedStory = () => useContext(StoryContext);

export function ManageStory({ children }) {
  const [savedStoryId, setSavedStoryId] = useState(null);
  const [storyStatus, setStoryStatus] = useState(false);

  const value = useMemo(() => {
    return {
      savedStoryId,
      setSavedStoryId,
      storyStatus,
      setStoryStatus,
    };
  }, [savedStoryId, setSavedStoryId, storyStatus, setStoryStatus]);

  return (
    <StoryContext.Provider value={value}>{children}</StoryContext.Provider>
  );
}
