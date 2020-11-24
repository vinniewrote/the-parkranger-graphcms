import React, { useContext, useState, useMemo } from "react";

const StoryContext = React.createContext();
export const useManagedStory = () => useContext(StoryContext);

export function ManageStory({ children }) {
  const [savedStoryId, setSavedStoryId] = useState(null);

  const value = useMemo(() => {
    return {
      savedStoryId,
      setSavedStoryId,
    };
  }, [savedStoryId, setSavedStoryId]);

  return (
    <StoryContext.Provider value={value}>{children}</StoryContext.Provider>
  );
}
