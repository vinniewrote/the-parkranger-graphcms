import { gql } from "@apollo/client";

export const AUTHOR_CHECK = gql`
  query getAuthorStatus($authZeroId: String) {
    authors(where: { auth0id: $authZeroId }) {
      id
      name
      journal {
        id
        name
      }
    }
  }
`;

export const JOURNAL_CHECK = gql`
  query getJournalStatus($authZeroId: String) {
    journals(where: { author: { auth0id: $authZeroId } }) {
      id
      name
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
      }
    }
  }
`;

export const GET_CHAPTER_ID = gql`
  query getChapterId($journalTracker: ID!) {
    journal(where: { id: $journalTracker }, stage: DRAFT) {
      id
      name
      chapters {
        id
        date
        title
        articles {
          id
        }
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
    }
  }
`;

export const GET_USER_VISIT_DATA = gql`
  query getUserVisitData($journalTracker: ID) {
    journal(stage: DRAFT, where: { id: $journalTracker }) {
      id
      name
      chapters {
        id
        title
        articles {
          id
          stories {
            id
            property {
              id
              name
              category {
                id
                name
                pluralName
              }
              visits {
                id
                title
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
      state #shows if the property exists or not
      ticketed
      #location shows the path to property based on parents
      location: parentProp(where: { state_not: Defunct }) {
        id
        name
        category {
          id
          name
          cluster
        }
      }
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
          timezone
        }
      }
      category {
        id
        name
        pluralName
      }
      #show all child properties that aren't characeters
      childProp(where: { category: { name_not: "Character" } }) {
        name
        id
      }
      #show all classifications except themes
      classification(where: { attribute_not: Theme }) {
        id
        name
        attribute
      }
      #show themes only
      themes: classification(where: { attribute_in: Theme }) {
        id
        name
        attribute
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
      #presentation is another aspect of themeing
      presentation {
        ... on Detail {
          id
          detailName
          detailNotes
          detailType
        }
        ... on Bio {
          id
          alias
          height
          profession
          weight
        }
      }
      #cast are the character properties that are attached to current prop
      cast: childProp(where: { category: { name_contains: "Character" } }) {
        name
        id
      }
      #creative team built/manage the prop
      creativeTeam {
        professionalRole
        professionalName
        id
      }
      timeline {
        id
        type
        year
        month
        day
        note
      }
      #the properties that came before current property which no longer exist
      predecessor: parentProp(where: { state_in: Defunct }) {
        id
        name
        category {
          name
        }
        timeline(where: { type: EndDate }) {
          year
          month
          day
          type
        }
      }
      #properties that came after the current property, excluding characers
      successor: childProp(where: { category: { name_not_in: "Character" } }) {
        name
        id
      }
      summary
      visits {
        id
        title
      }
    }
  }
`;
