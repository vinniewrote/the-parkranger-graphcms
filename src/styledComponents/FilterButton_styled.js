import styled from "styled-components/macro";

export const FilterBar = styled.div`
  display: flex;
  flex-direction: row;
  overflow-x: scroll;
  margin: 0;
  padding: 1rem 0 0 0;
`;

export const PropertyFilter = styled.button`
  border: 1px solid #0f0c09;
  border-radius: 40px;
  background: #fbf0dc;
  padding: 10px 22px;
  transition: background 0.75s ease-in-out;
  margin: 0 1rem 1rem 0;
  cursor: pointer;
  &:hover {
    background: #eaddc9;
  }
  &:first-child {
    margin-left: 2em;
  }
  &[aria-selected="true"] {
    background: #eaddc9;
    span {
      text-decoration: underline;
    }
  }
  span {
    font-family: "Work Sans";
    font-style: normal;
    font-weight: 400;
    font-size: 1.25em;
    line-height: 1.5em;
  }
`;
