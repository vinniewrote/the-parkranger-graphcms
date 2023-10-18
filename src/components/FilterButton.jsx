import React from "react";
import { useManagedStory } from "../contexts/StoryContext";
import { PropertyFilter } from "../styledComponents/FilterButton_styled";

export default function FilterButton(props) {
  // const { setFilter } = useManagedStory();
  return (
    <PropertyFilter
      type="button"
      aria-pressed={props.isPressed}
      aria-selected={props.name === filter}
      onClick={() => console.log(props.name)}
    >
      {/* <span className="visually-hidden">Show </span> */}
      <span>{props.name}</span>
      {/* <span className="visually-hidden"> tasks</span> */}
    </PropertyFilter>
  );
}
