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
          landmarkId
          landmarkName
          title
          visits {
            id
            landmark {
              id
              name
              park {
                id
                name
              }
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

export const LANDMARK_LISTING = gql`
  query GetLandmarkListing($propertyId: String) {
    parks(where: { parkId: $propertyId }) {
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
