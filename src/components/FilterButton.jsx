import React from "react";
import { useManagedStory } from "../contexts/StoryContext";
export default function FilterButton(props) {
  const { filter, setFilter } = useManagedStory();
  return (
    <button
      type="button"
      className="btn toggle-btn"
      aria-pressed={props.isPressed}
      onClick={() => setFilter(props.name)}
    >
      {/* <span className="visually-hidden">Show </span> */}
      <span>{props.name}</span>
      {/* <span className="visually-hidden"> tasks</span> */}
    </button>
  );
}
