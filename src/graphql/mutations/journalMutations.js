import { gql } from "@apollo/client";

export const NEW_AUTHOR_STEP_ONE = gql`
  mutation AuthorStepOne(
    $authZeroEmail: String!
    $authZeroName: String!
    $authZeroId: String!
  ) {
    createAuthor(
      data: { email: $authZeroEmail, name: $authZeroName, auth0id: $authZeroId }
    ) {
      auth0id
      email
      name
      stage
    }
  }
`;

export const NEW_AUTHOR_STEP_TWO = gql`
  mutation AuthorStepTwo($authZeroEmail: String!) {
    publishAuthor(where: { email: $authZeroEmail }, to: PUBLISHED) {
      id
    }
  }
`;

export const NEW_AUTHOR_STEP_THREE = gql`
  mutation AuthorStepThree(
    $authZeroEmail: String!
    $authZeroName: String!
    $authZeroId: String!
  ) {
    createJournal(
      data: {
        author: { connect: { auth0id: $authZeroId, email: $authZeroEmail } }
        name: $authZeroName
      }
    ) {
      id
      name
    }
  }
`;

export const NEW_AUTHOR_STEP_FOUR = gql`
  mutation AuthorStepFour(
    $authLandmark: String
    $landmarkIdentifier: ID
    $authJournalID: ID!
    $currentDate: Date
    $dayOfWeek: String
  ) {
    createChapter(
      data: {
        date: $currentDate
        title: $dayOfWeek
        stories: {
          create: {
            landmarkId: $authLandmark
            visits: {
              create: { landmark: { connect: { id: $landmarkIdentifier } } }
            }
          }
        }
        journal: { connect: { id: $authJournalID } }
      }
    ) {
      id
    }
  }
`;

export const CREATE_NEW_CHAPTER = gql`
  mutation CreateNewChapter(
    $authLandmark: String
    $landmarkIdentifier: ID
    $landmarkTitle: String!
    $authJournalID: ID!
    $currentDate: Date
    $dayOfWeek: String
  ) {
    createChapter(
      data: {
        date: $currentDate
        title: $dayOfWeek
        stories: {
          create: {
            landmarkId: $authLandmark
            landmarkName: $landmarkTitle
            visits: {
              create: { landmark: { connect: { id: $landmarkIdentifier } } }
            }
          }
        }
        journal: { connect: { id: $authJournalID } }
      }
    ) {
      id
      stories {
        id
        visits {
          id
        }
      }
    }
  }
`;

export const CREATE_NEW_AUTHOR = gql`
  mutation CreateNewAuthor(
    $authZeroEmail: String!
    $authZeroName: String!
    $authZeroId: String!
  ) {
    createAuthor(
      data: { email: $authZeroEmail, name: $authZeroName, auth0id: $authZeroId }
    ) {
      auth0id
      email
      name
      stage
    }
    publishAuthor(where: { email: $authZeroEmail }, to: PUBLISHED) {
      id
    }
    createJournal(
      data: {
        author: { connect: { auth0id: $authZeroId, email: $authZeroEmail } }
        name: $authZeroName
      }
    ) {
      id
      name
    }
  }
`;

export const CREATE_NEW_JOURNAL = gql`
  mutation CreateNewJournal(
    $authZeroEmail: String!
    $authZeroName: String!
    $authZeroId: String!
  ) {
    createJournal(
      data: {
        author: { connect: { auth0id: $authZeroId, email: $authZeroEmail } }
        name: $authZeroName
      }
    ) {
      id
      name
    }
  }
`;

export const PUBLISH_JOURNAL = gql`
  mutation PublishJournal($authJournalId: ID!) {
    publishJournal(where: { id: $authJournalId }) {
      id
      name
    }
  }
`;

export const CREATE_NEW_STORY = gql`
  mutation CreateNewStory(
    $authLandmark: String
    $landmarkIdentifier: ID
    $landmarkTitle: String!
    $currentChptID: ID
  ) {
    createStory(
      data: {
        chapter: { connect: { id: $currentChptID } }
        landmarkId: $authLandmark
        landmarkName: $landmarkTitle
        title: $landmarkTitle
        visits: {
          create: { landmark: { connect: { id: $landmarkIdentifier } } }
        }
      }
    ) {
      id
      visits {
        id
      }
    }
  }
`;

export const CREATE_NEW_VISIT = gql`
  mutation CreateNewVisit($landmarkTracker: ID, $storyIDLandmark: ID) {
    createVisit(
      data: {
        story: { connect: { id: $storyIDLandmark } }
        landmark: { connect: { id: $landmarkTracker } }
      }
    ) {
      id
    }
  }
`;

export const PUBLISH_CHAPTER = gql`
  mutation PublishChapter($currentChptID: ID) {
    publishChapter(where: { id: $currentChptID }) {
      publishedAt
    }
  }
`;

export const PUBLISH_STORY = gql`
  mutation PublishStory($storyDraft: ID) {
    publishStory(where: { id: $storyDraft }) {
      id
    }
  }
`;

export const PUBLISH_VISIT = gql`
  mutation PublishVisit($visitDraft: ID) {
    publishVisit(where: { id: $visitDraft }) {
      id
    }
  }
`;
