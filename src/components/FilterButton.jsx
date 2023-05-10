import React from "react";
import { useManagedStory } from "../contexts/StoryContext";
import { PropertyFilter } from "../styledComponents/FilterButton_styled";

export default function FilterButton(props) {
  const { filter, setFilter, emptyFilters } = useManagedStory();
  return (
    <PropertyFilter
      type="button"
      className={props.name === emptyFilters ? "empty" : "filled"}
      aria-pressed={props.isPressed}
      aria-selected={props.name === filter}
      onClick={() => setFilter(props.name)}
    >
      {/* <span className="visually-hidden">Show </span> */}
      <span>{props.name}</span>
      {/* <span className="visually-hidden"> tasks</span> */}
    </PropertyFilter>
  );
}
