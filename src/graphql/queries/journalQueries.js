import { gql } from "@apollo/client";

export const AUTHOR_CHECK = gql`
  query getAuthorStatus($authZeroEmail: String!) {
    author(where: { email: $authZeroEmail }) {
      bio
      email
      name
      auth0id
    }
  }
`;

export const JOURNAL_CHECK = gql`
  query getJournalStatus($authZeroId: String!) {
    journals(where: { author: { auth0id: $authZeroId } }) {
      id
    }
  }
`;

export const GET_CHAPTER_DATE = gql`
  query GetChapterDate($journalTracker: ID!) {
    chapters(where: { journal: { id: $journalTracker } }) {
      date
      id
      stage
      title
      stories {
        id
        landmarkId
        landmarkName
      }
    }
  }
`;

export const CHECK_FOR_STORYID = gql`
  query GetStoryId($currentChapterId: ID!) {
    stories(where: { chapter: { id: $currentChapterId } }) {
      id
    }
  }
`;

export const CHECK_FOR_LANDMARKS = gql`
  query getLoggedLandmarks($authJournalId: ID!, $currentDate: Date) {
    stories(
      where: {
        chapter: { date: $currentDate, journal: { id: $authJournalId } }
      }
    ) {
      id
      landmarkId
    }
  }
`;

export const GET_USER_VISIT_DATA = gql`
  query getUserVisitData($authZeroId: String!) {
    journals(where: { author: { auth0id: $authZeroId } }) {
      chapters {
        date
        id
        title
        stories {
          id
          landmark {
            park {
              id
              name
            }
            category {
              id
              name
              pluralName
            }
          }
          landmarkId
          landmarkName

          title
          visits {
            id
            landmark {
              id
              name
            }
          }
        }
      }
    }
  }
`;

export const PARK_LISTING = gql`
  query GetParkListing {
    parks {
      id
      parkId
      name
      openingDay
      openingMonth
      openingYear
    }
  }
`;

export const VISIT_LANDMARK_CHECK = gql`
  query CheckLandmarkForVisits($currentPropertyId: ID) {
    visits(where: { landmark: { id: $currentPropertyId } }) {
      id
      landmark {
        id
        name
      }
    }
  }
`;

export const LANDMARK_LISTING = gql`
  query GetLandmarkListing($propertyId: String) {
    parks(where: { parkId: $propertyId }) {
      id
      name
      areas {
        id
        name
        landmarks {
          id
          name
          operationalStatus
          category {
            id
            name
            pluralName
          }
          visits {
            id
          }
        }
      }
    }
  }
`;

export const LANDMARK_DETAILS = gql`
  query GetLandmarkDetails($propertyId: ID) {
    landmarks(where: { id: $propertyId }) {
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
