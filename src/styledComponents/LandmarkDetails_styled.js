import styled from "styled-components/macro";

export const InfoBlockWrapper = styled.div`
  background: #fff;
  border: 1px solid #fff;
  border-radius: 8px;
  width: 85%;
  padding: 20px;
  margin: 0 auto;
`;

export const SpecsContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  column-gap: 10px;
  row-gap: 10px;
  width: 90%;
  margin: 0 auto;
`;

export const SpecsBlockWrapper = styled.div`
  display: flex;
  flex-direction: column;
  background: #fff;
  border: 1px solid gray;
  width: 195px;
  padding: 5px 10px;
`;

export const LoggingCountContainer = styled.div`
  display: flex;
  width: 75%;
  margin: 0 auto;
  border: 1px solid #000;
  background: #0d4556;
  border-radius: 8px;
  padding: 24px;
  column-gap: 16px;
`;

export const YourVisitsBlock = styled.div`
  display: flex;
  flex-direction: column;
  width: 68%;
  color: white;

  & h4 {
    text-align: left;
    font-family: "Work Sans";
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 22px;
    margin: 0;
  }

  & p {
    font-family: "Work Sans";
    font-size: 44px;
    font-weight: 400;
    line-height: 42px;
    letter-spacing: 0em;
    text-align: left;
    margin: 0;
  }
`;
