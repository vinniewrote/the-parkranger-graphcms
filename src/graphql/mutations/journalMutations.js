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
      id
      email
      name
      stage
    }
  }
`;

export const NEW_AUTHOR_STEP_TWO = gql`
  mutation AuthorStepTwo($authIdentifier: ID) {
    publishAuthor(where: { id: $authIdentifier }, to: PUBLISHED) {
      id
    }
  }
`;

export const NEW_AUTHOR_STEP_THREE = gql`
  mutation AuthorStepThree($authIdentifier: ID) {
    createJournal(data: { author: { connect: { id: $authIdentifier } } }) {
      id
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
    $landmarkIdentifier: ID
    $landmarkTitle: String
    $authJournalID: ID!
    $currentDate: Date
    $desinationIdentifier: ID
    $parkIdentifier: ID
  ) {
    createChapter(
      data: {
        date: $currentDate
        journal: { connect: { id: $authJournalID } }
        articles: {
          create: {
            reference: {
              create: {
                Story: {
                  property: { connect: { id: $landmarkIdentifier } }
                  visits: {
                    create: {
                      date: $currentDate
                      title: $landmarkTitle
                      property: { connect: { id: $landmarkIdentifier } }
                    }
                  }
                }
              }
              connect: [
                { Property: { id: $desinationIdentifier } }
                { Property: { id: $parkIdentifier } }
              ]
            }
          }
        }
      }
    ) {
      date
      id
      title
      articles {
        id
        reference {
          ... on Chapter {
            id
            title
          }
          ... on Property {
            id
            name
            category {
              id
              name
              pluralName
            }
          }
          ... on Story {
            id
            visits {
              id
              title
              date
            }
          }
        }
      }
    }
  }
`;

export const TEST_CREATE_NEW_CHAPTER = gql`
  mutation TestCreateNewChapter(
    $authorIdentifier: ID
    $landmarkIdentifier: ID
    $landmarkTitle: String
    $authJournalID: ID!
    $currentDate: Date
    $destinationIdent: ID
    $parkIdentifier: ID
  ) {
    createChapter(
      data: {
        author: { connect: { id: $authorIdentifier } }
        date: $currentDate
        journal: { connect: { id: $authJournalID } }
        articles: {
          create: {
            stories: {
              create: {
                storyDate: $currentDate
                author: { connect: { id: $authorIdentifier } }
                property: { connect: { id: $landmarkIdentifier } }
                visits: {
                  create: {
                    date: $currentDate
                    title: $landmarkTitle
                    author: { connect: { id: $authorIdentifier } }
                    property: { connect: { id: $landmarkIdentifier } }
                  }
                }
              }
            }
            properties: {
              connect: [{ id: $destinationIdent }, { id: $parkIdentifier }]
            }
          }
        }
      }
    ) {
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
            title
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

export const TEST_CREATE_NEW_ARTICLE = gql`
  mutation TestCreateNewArticle(
    $authorIdentifier: ID
    $chapterIdentifier: ID
    $landmarkIdentifier: ID
    $destinationIdent: ID
    $parkIdentifier: ID
    $currentDate: Date
    $visitTitle: String
  ) {
    createArticle(
      data: {
        chapter: { connect: { id: $chapterIdentifier } }
        properties: {
          connect: [{ id: $destinationIdent }, { id: $parkIdentifier }]
        }
        stories: {
          create: {
            storyDate: $currentDate
            property: { connect: { id: $landmarkIdentifier } }
            visits: {
              create: {
                date: $currentDate
                title: $visitTitle
                author: { connect: { id: $authorIdentifier } }
              }
            }
          }
        }
      }
    ) {
      id
      properties {
        id
        name
        category {
          name
        }
        articles {
          id
          stories {
            id
            visits {
              id
              date
            }
            property {
              id
            }
          }
        }
      }
    }
  }
`;
export const ALPHA_CREATE_NEW_VISIT = gql`
  mutation MyAlphaMutation(
    $storyIdentifier: ID
    $landmarkIdentifier: ID
    $authorIdentifier: ID
    $currentDate: Date
    $visitTitle: String
  ) {
    createVisit(
      data: {
        story: { connect: { id: $storyIdentifier } }
        title: $visitTitle
        date: $currentDate
        property: { connect: { id: $landmarkIdentifier } }
        author: { connect: { id: $authorIdentifier } }
      }
    ) {
      id
      date
      title
      property {
        id
      }
    }
  }
`;

export const ALPHA_ADD_NEW_STORY_TO_ARTICLE = gql`
  mutation AlphaAddNewStoryToArticle(
    $chapterIdentifier: ID
    $articleIdentifier: ID
    $landmarkIdentifier: ID
    $authorIdentifier: ID
    $currentDate: Date
    $visitTitle: String
    $storyTitle: String
  ) {
    createStory(
      data: {
        article: { connect: { id: $articleIdentifier } }
        chapter: { connect: { id: $chapterIdentifier } }
        title: $storyTitle
        storyDate: $currentDate
        visits: {
          create: {
            author: { connect: { id: $authorIdentifier } }
            title: $visitTitle
            date: $currentDate
            property: { connect: { id: $landmarkIdentifier } }
          }
        }
      }
    ) {
      id
      title
      visits {
        date
        id
        property {
          id
        }
      }
      chapter {
        id
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

export const CREATE_NEW_STORY = gql`
  mutation CreateNewStory(
    $landmarkIdentifier: ID
    $landmarkTitle: String!
    $currentChptID: ID
  ) {
    createStory(
      data: {
        chapter: { connect: { id: $currentChptID } }
        property: { connect: { id: $landmarkIdentifier } }
        title: $landmarkTitle
        visits: {
          create: { property: { connect: { id: $landmarkIdentifier } } }
        }
      }
    ) {
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
          date
        }
      }
    }
  }
`;

export const CREATE_NEW_VISIT = gql`
  mutation CreateNewVisit($landmarkTracker: ID, $storyIDLandmark: ID) {
    createVisit(
      data: {
        story: { connect: { id: $storyIDLandmark } }
        property: { connect: { id: $landmarkTracker } }
      }
    ) {
      id
    }
  }
`;
