import styled from "styled-components/macro";

export const ParkLandmarkCard = styled.div`
  border: 1px solid gray;
  border-radius: 4px;
  padding: 10px 15px;
  margin: 0 auto 20px auto;
  width: 70%;
`;

export const LandmarkCardTop = styled.div`
  display: flex;
  flex-direction: row;
  color: gray;

  & span {
    font-family: "Work Sans";
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 16px;

    opacity: 0.8;
  }
`;

export const LandmarkCardMiddle = styled.div`
  display: flex;
  flex-direction: row;
  color: #000000;
  & h4 {
    font-family: "Work Sans";
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 112%;
    margin: 10px 0;
  }
`;

export const LandmarkCardBottom = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  border-top: 1px solid gray;
  padding: 10px 0;

  & span {
    font-family: "Work Sans";
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 22px;
  }
`;

export const AreaContainer = styled.div`
  /* width: 70%; */
  margin: 0 auto;
  &:has(ParkLandmarkCard) {
    color: red;
  }
`;

export const AreaTitle = styled.h3`
  margin: 10px auto;
  padding: 10px 15px;
  text-align: left;
  width: 70%;
`;

export const PropertyFilterBtn = styled.button`
  display: inline-flex;
  padding: 0.625rem 1rem;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  border-radius: 624.9375rem;
`;

export const PropertySubFilterBtn = styled.button`
  display: inline-flex;
  padding: 0.625rem 1rem;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  border-radius: 624.9375rem;
`;

export const MainFilterWrapper = styled.div`
  width: 100%;
  height: 75px;
  display: flex;
  flex-wrap: nowrap;
  overflow-x: auto;
  &:button {
    /* overflow-x: hidden; */
  }
`;
export const SubFilterWrapper = styled.div`
  width: 100%;
  height: 75px;
  display: flex;
  flex-wrap: nowrap;
  overflow-x: auto;
  &:button {
    /* overflow-x: hidden; */
  }
`;
