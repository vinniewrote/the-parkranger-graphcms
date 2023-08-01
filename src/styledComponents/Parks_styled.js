import styled from "styled-components/macro";

export const PropertyBlock = styled.div`
  display: flex;
  flex-direction: row;
  border: 1px solid gray;
  border-radius: 4px;
  width: 70%;
  margin: 10px auto;
  padding: 10px 15px;

  & a {
    text-decoration: none;
    color: #000000;
    width: 90%;
    & :hover {
      color: gray;
    }
  }
`;

export const PropertyTitle = styled.h4`
  font-family: "Work Sans";
  font-style: normal;
  font-weight: 600;
  font-size: 1em;
  line-height: 18px;
  text-align: left;
`;
