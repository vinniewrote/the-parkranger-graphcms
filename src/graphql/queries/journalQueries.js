import { gql } from "@apollo/client";

export const PROPERTY_VISIT_COUNTER = gql`
  query BetaVisitCount($authorIdentifier: ID, $landmarkTracker: ID!) {
    visitsConnection(
      where: {
        property: { id: $landmarkTracker }
        AND: { author: { id: $authorIdentifier } }
      }
    ) {
      aggregate {
        count
      }
    }
  }
`;

export const AUTHOR_CHECK = gql`
  query getAuthorStatus($authZeroId: String) {
    authors(where: { auth0id: $authZeroId }) {
      id
      name
      journal {
        id
      }
    }
  }
`;

export const JOURNAL_CHECK = gql`
  query getJournalStatus($authZeroId: String) {
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
      }
    }
  }
`;

export const GET_CHAPTER_ID = gql`
  query getChapterId($journalTracker: ID!) {
    journal(where: { id: $journalTracker }, stage: DRAFT) {
      id
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

export const HAS_PROPERTY_BEEN_LOGGED = gql`
  query checkPropertyForPriorLog(
    $landmarkTracker: ID!
    $currentDate: Date
    $authorIdentifier: ID
  ) {
    visits(
      where: {
        author: { id: $authorIdentifier }
        date: $currentDate
        property: { id: $landmarkTracker }
      }
    ) {
      id
      story {
        id
      }
    }
  }
`;

export const IS_PROPERTY_LOGGED_TO_STORY = gql`
  query CheckPropertyIsLoggedToStory(
    $authorIdentifier: ID
    $landmarkTracker: ID!
  ) {
    stories(
      where: {
        property: { id: $landmarkTracker }
        author: { id: $authorIdentifier }
      }
    ) {
      id
      storyDate
      visits {
        date
        id
      }
    }
  }
`;

export const GET_TODAYS_CHAPTER_DATA = gql`
  query PullChapterDataForUser($currentChapterId: ID!) {
    chapter(where: { id: $currentChapterId }) {
      date
      id
      articles {
        id
        stories {
          id
          title
          visits {
            id
            date
          }
        }
        properties {
          id
          name
          category {
            name
          }
        }
      }
    }
  }
`;

export const ALPHA_GET_USER_VISITS = gql`
  query PullUserVisitsForJournal($authorIdentifier: ID) {
    author(where: { id: $authorIdentifier }) {
      id
      name
      chapters {
        id
        date
        articles {
          id
          properties {
            id
            name
          }
          stories {
            id
            title
            storyDate
            visits {
              id
            }
            property {
              id
              name
              category {
                id
                name
                pluralName
                trackable
              }
            }
          }
        }
      }
    }
  }
`;

export const GET_USER_VISIT_DATA = gql`
  query getUserVisitData($journalTracker: ID) {
    journal(stage: DRAFT, where: { id: $journalTracker }) {
      id
      chapters {
        id
        title
        date
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
            }
          }
          properties {
            id
          }
        }
      }
    }
  }
`;

export const PARK_LISTING = gql`
  query GetParkListing {
    properties(stage: PUBLISHED) {
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

export const SEARCH_QUERY = gql`
  query SearchData {
    properties {
      name
      state
      ticketed
      location: parentProp {
        id
        name
        category {
          name
        }
      }
      childProp {
        id
        name
        category {
          name
        }
      }
      map {
        latitude
        longitude
      }
      timeline {
        day
        month
        year
        type
      }
      # liveDataID {
      #   id
      #   wikiID
      #   wikiLive {
      #     liveData {
      #       queue
      #       status
      #     }
      #   }
      # }
    }
  }
`;

export const VISIT_LANDMARK_CHECK = gql`
  query CheckLandmarkForVisits($currentPropertyId: ID, $authorIdentifier: ID) {
    visits(
      where: {
        author: { id: $authorIdentifier }
        property: { id: $currentPropertyId }
      }
    ) {
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
  query GetPropertyDetails($propertyId: ID, $authZeroId: String!) {
    property(where: { id: $propertyId }, stage: PUBLISHED) {
      id
      name
      state
      ticketed
      category {
        name
        trackable
        cluster
      }
      liveDataID {
        #Might be noisy for park type properties since it retrieves all children from the API
        wikiLive {
          liveData {
            queue
            status
            forecast
            operatingHours
          }
        }
        #Only relevant for park type properties
        wikiSchedule {
          schedule
          timezone
        }
      }
      location: parentProp {
        id
        name
        category {
          name
          cluster
        }
        state
      }
      childProp {
        id
        name
        category {
          name
        }
      }
      map {
        latitude
        longitude
      }
      #List all classifcations but themes, we list those separately
      classification(where: { attribute_not: Theme }) {
        id
        name
      }
      stats {
        ... on Vehicle {
          __typename
          id
          restraintSystem
          onboardFeatures
          arrangement {
            arrangementType
            numericValue
            unitOfMeasure
          }
        }
        ... on Measurement {
          __typename
          id
          measurementType
          numericValue
          unitOfMeasure
        }
        ... on Time {
          __typename
          id
          measurementTime
          minutes
          seconds
        }
        ... on Expense {
          __typename
          id
          expenseType
          amount
          currency
        }
      }
      presentation {
        ... on Detail {
          __typename
          id
          detailType
          detailName
          detailNotes
        }
        ... on Bio {
          __typename
          id
          profession
          height
          weight
          alias
        }
        ... on Palette {
          __typename
          id
          colorApplication
          hues {
            colorName
            value {
              rgba {
                r
                g
                b
                a
              }
            }
          }
        }
      }
      theme: classification(where: { attribute_in: Theme }) {
        id
        name
      }
      #We just want to list the cast of characters that can be found in this property
      cast: childProp(
        where: { category: { id: "clg33z21w30h50bk8tbanm0yt" } }
      ) {
        name
        presentation {
          ... on Bio {
            profession
          }
        }
      }
      creativeTeam {
        id
        professionalName
        professionalRole
      }
      summary
      predecessor {
        id
        name
        category {
          name
        }
      }
      timeline {
        id
        type
        year
        month
        day
        note
      }
      successor {
        id
        name
        category {
          name
        }
      }
      # List all child properties
      lineup: childProp {
        name
        category {
          name
        }
      }
    }
    # Get total visit count to this property for specific user
    visitsConnection(
      where: { property: { id: $propertyId }, author: { auth0id: $authZeroId } }
    ) {
      aggregate {
        count
      }
    }
    # Get all related chapters that contain stories from this property
    chapters(
      where: {
        articles_some: { stories_some: { property: { id: $propertyId } } }
        author: { auth0id: $authZeroId }
      }
    ) {
      id
      title
    }
  }
`;
