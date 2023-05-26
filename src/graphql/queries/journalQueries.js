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
        propertyId
        propertyName
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
      propertyId
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
          # landmark {
          #   park {
          #     id
          #     name
          #   }
          #   category {
          #     id
          #     name
          #     pluralName
          #   }
          # }
          propertyId
          propertyName

          title
          visits {
            id
            property {
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
    properties {
      id
      name
      summary
      category {
        id
        name
        pluralName
      }
    }
  }
`;

export const VISIT_LANDMARK_CHECK = gql`
  query CheckLandmarkForVisits($currentPropertyId: ID) {
    visits(where: { property: { id: $currentPropertyId } }) {
      id
      property {
        id
        name
      }
    }
  }
`;

export const LANDMARK_LISTING = gql`
  query GetLandmarkListing($propertyId: ID) {
    property(where: { id: $propertyId }) {
      id
      name
      childProp(where: { category: { pluralName: "Areas" } }) {
        id
        name
        childProp {
          id
          name
          summary
          visits {
            id
            title
          }
          category {
            id
            name
            pluralName
          }
        }
      }
    }
  }
`;

export const LANDMARK_DETAILS = gql`
  query GetLandmarkDetails($propertyId: ID) {
    property(where: { id: $propertyId }) {
      id
      name
      summary
      ticketed
      liveDataID {
        id
        wikiID
        wikiLive {
          id
          name
          liveData {
            forecast
            lastUpdated
            operatingHours
            queue
            showtimes
            status
          }
          schedule
          timezone
        }
      }
      category {
        id
        name
        pluralName
      }
      timeline {
        day
        id
        month
        note
        type
        year
      }
      stats {
        ... on Measurement {
          id
          measurementType
          numericValue
          stage
          unitOfMeasure
        }
        ... on Time {
          id
          measurementTime
          minutes
          seconds
          stage
        }
      }
      visits {
        id
        title
      }
    }
  }
`;
