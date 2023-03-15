import React, { Fragment } from "react";
import VisitLogger from "./VisitLogger";
import { useQuery, gql } from "@apollo/client";
import {
  InfoBlockWrapper,
  LoggingCountContainer,
  SpecsBlockWrapper,
} from "../styledComponents/LandmarkDetails_styled";

export default function LandmarkDetail(props, match) {
  const {
    params: { id },
  } = props.match;

  const LANDMARK_DETAILS = gql`
    query GetLandmarkDetails {
      landmarks(where: {id: "${id}"}) {
        id
        name
        height
        inversions
        length
        heightRestriction
        gForce
        externalLink
        duration
        drop
        createdAt
        openingMonth
        openingDay
        openingYear
        closingDay
        closingMonth
        closingYear
        operationalStatus
        speed
        designer {
          name
          id
        }
        location {
          latitude
          longitude
        }
        
        summary
        colorPalette {
          hex
        }
        visits {
        id
        title
        date
      }
      park {
        name
      }
      area {
        id
        name
      }
      }
    }
  `;

  const { loading, error, data } = useQuery(LANDMARK_DETAILS);
  // console.log(data);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <Fragment>
      {/* <div>Detail about the landmark goes here </div>
      <h4>{id}</h4> */}
      <Fragment>
        {data.landmarks.map(
          ({
            id,
            name,
            inversions,
            duration,
            openingMonth,
            openingDay,
            openingYear,
            summary,
            gForce,
            speed,
            colorPalette,
            designer,
            park,
            area,
          }) => (
            <div key={`Landmark Detail -  ${id}`}>
              <h2 key={`${name} - ${id}`}>{name}</h2>
              <p key={`${openingYear} - ${id}`}>
                {openingYear !== null ? `@ ${openingYear}` : ""}
              </p>
              <h3>Your Visits</h3>
              <InfoBlockWrapper>
                <LoggingCountContainer>
                  <div style={{ width: "70%" }}>
                    <p
                      style={{
                        color: "#ffffff",
                        textAlign: "left",
                        fontSize: "38px",
                        lineHeight: "42px",
                        fontWeight: "300",
                      }}
                    >
                      0
                    </p>
                  </div>
                  <VisitLogger
                    key={`${name} - ${id}`}
                    landmarkId={id}
                    landmarkName={name}
                  />
                </LoggingCountContainer>
                <p>You havent been here yet</p>
              </InfoBlockWrapper>
              <h3>Location</h3>
              <InfoBlockWrapper>
                <p key={`${park?.name} - ${id}`}>{park?.name}</p>
                <p key={`${area?.name} - ${id}`}>{area?.name}</p>
              </InfoBlockWrapper>

              <h3>Summary</h3>
              <InfoBlockWrapper>
                <p key={`${summary} - ${id}`}>{summary}</p>
              </InfoBlockWrapper>

              <h3>Specs</h3>
              <>
                {gForce !== null ? (
                  <SpecsBlockWrapper>
                    <h5>GForce</h5>
                    <span key={`${gForce} - ${id}`}>{gForce}</span>
                  </SpecsBlockWrapper>
                ) : (
                  ""
                )}
                {speed !== null ? (
                  <SpecsBlockWrapper>
                    <h5>Speed (in mph)</h5>
                    <span key={`${speed} - ${id}`}>{speed}mph</span>
                  </SpecsBlockWrapper>
                ) : (
                  ""
                )}
              </>

              <h3>Theme</h3>
              <InfoBlockWrapper>
                {/* {console.log(colorPalette[0].hex)} 
                {colorPalette.map((color, index) => {
                  // <p>{color.hex}</p>;
                })}
                */}
                <div
                  key={`${colorPalette} - ${id} - Block1`}
                  style={{
                    height: "40px",
                    width: "40px",
                    background: `${colorPalette[0]?.hex}`,
                  }}
                />
                <div
                  key={`${colorPalette} - ${id} - Block2`}
                  style={{
                    height: "40px",
                    width: "40px",
                    background: `${colorPalette[1]?.hex}`,
                  }}
                />
                <div
                  key={`${colorPalette} - ${id} - Block3`}
                  style={{
                    height: "40px",
                    width: "40px",
                    background: `${colorPalette[2]?.hex}`,
                  }}
                />
              </InfoBlockWrapper>

              <h3>Creative</h3>
              <InfoBlockWrapper>
                <p key={`designer - ${id}`}>{designer[0]?.name}</p>
              </InfoBlockWrapper>
            </div>
          )
        )}
      </Fragment>
    </Fragment>
  );
}
