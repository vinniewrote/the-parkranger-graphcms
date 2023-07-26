import React, { Fragment } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useQuery } from "@apollo/client";
import { useManagedStory } from "../contexts/StoryContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import NewUserFlow from "./NewUserFlow";
import Logout from "../components/LogoutButton";
import {
  PropertyName,
  PropertyLocation,
  PropertyTitleWrapper,
  PropertyVisitCount,
  PropertyCountValue,
  PropertyCountBlock,
  ChapterPropertyTitle,
  ChapterPropertySubTitle,
  ChapterDisplayBlock,
} from "../styledComponents/Journal_styled";
import {
  JOURNAL_CHECK,
  AUTHOR_CHECK,
  // GET_USER_VISIT_DATA,
  ALPHA_GET_USER_VISITS,
} from "../graphql/queries/journalQueries";

export default function Journal(props, match, location) {
  const { user } = useAuth0();

  const {
    rawVisitData,
    setRawVisitData,
    userJournalId,
    setUserJournalId,
    newUserStatus,
    authorId,
    setAuthorId,
  } = useManagedStory();
  // console.log(authorId);
  /************************************************ QUERIES *****************************************************/

  const {
    loading: journalQueryLoading,
    error: journalQueryError,
    data: journalQueryData,
  } = useQuery(JOURNAL_CHECK, {
    variables: { authZeroId: user.sub },
    context: { clientName: "authorLink" },
    onCompleted: () => {
      journalQueryData?.journals.map(({ id }) => {
        setUserJournalId(id);
      });
      console.log(journalQueryData);
    },
  });

  const {
    loading: authorQueryLoading,
    error: authorQueryError,
    data: authorQueryData,
  } = useQuery(AUTHOR_CHECK, {
    pollInterval: 40000,
    variables: { authZeroId: user.sub },
    context: { clientName: "authorLink" },
    onCompleted() {
      setAuthorId(authorQueryData?.authors[0]?.id);
    },
  });

  const {
    loading: visitDataQueryLoading,
    error: visitDataQueryError,
    data: visitQueryData,
  } = useQuery(ALPHA_GET_USER_VISITS, {
    variables: { authorIdentifier: authorId },
    context: { clientName: "authorLink" },
    onCompleted() {
      // console.log(visitQueryData.author.chapters);
      setRawVisitData(visitQueryData.author.chapters);
    },
  });

  // console.log(rawVisitData);

  if (authorQueryLoading || journalQueryLoading) return <p>Loading...</p>;
  if (authorQueryError || journalQueryError) return <p>Error :(</p>;

  const newUserCriteria =
    authorQueryData?.author === null || journalQueryData?.journal?.length === 0;

  return (
    <Fragment>
      <div className="topBlock">
        <Logout />
        <h1>Journal</h1>
        <h2>Subheader Text</h2>
      </div>

      {(newUserCriteria || newUserStatus === true) && (
        <NewUserFlow style={{ position: "absolute" }} />
      )}

      {rawVisitData?.length > 0 &&
        rawVisitData.map((visit, i) => (
          <>
            <div
              className="JournalCardContainer"
              style={{ background: "#F0F5F5" }}
            >
              <div key={i}>
                {/* <ChapterPropertyTitle>{visit.id}</ChapterPropertyTitle> */}
                <h4>{visit.date}</h4>

                {visit?.articles.map((usrarticle, k) => (
                  <>
                    <div className="JournalCardWrapper">
                      {/* <ChapterPropertyTitle>
                        {usrarticle.id}
                      </ChapterPropertyTitle> */}
                      <div
                        className="destinatonParkWrapper"
                        style={{ width: "90%", margin: "20px auto" }}
                      >
                        <h4
                          className="destinationName"
                          style={{
                            textAlign: "left",
                            color: "#003541",
                            fontFamily: "Work Sans",
                            fontSize: "1.5rem",
                            fontStyle: "normal",
                            fontWeight: "800",
                            lineHeight: "1.625rem",
                            margin: "0",
                          }}
                        >
                          {usrarticle.properties[0].name}
                        </h4>
                        <h5
                          className="ParkName"
                          style={{
                            textAlign: "left",
                            color: "#003541",
                            fontFamily: "Work Sans",
                            fontSize: "1.125rem",
                            fontStyle: "normal",
                            fontWeight: "600",
                            lineHeight: "1.5rem",
                            margin: "0",
                          }}
                        >
                          {usrarticle.properties[1].name}
                        </h5>
                      </div>

                      {usrarticle.stories.map((tinystory, q) => (
                        <div
                          key={q}
                          className="singlevisitcard"
                          style={{
                            backgroundColor: "white",
                            width: "90%",
                            margin: "0 auto",
                          }}
                        >
                          <div
                            className="singlevisitdata-flex"
                            style={{ display: "flex", flexDirection: "column" }}
                          >
                            <div
                              className="propertytypeCountBloc"
                              style={{
                                display: "flex",
                                flexDirection: "row",
                                padding: "20px 14px",
                              }}
                            >
                              <div
                                className="propertytype"
                                style={{ width: "85%" }}
                              >
                                <p
                                  style={{
                                    color: "#3E7885",
                                    fontFamily: "Work Sans",
                                    fontSize: "1rem",
                                    fontStyle: "normal",
                                    fontWeight: "400",
                                    lineHeight: "1.5rem",
                                    margin: "0",
                                    textAlign: "left",
                                  }}
                                >
                                  {tinystory.property?.category?.name ===
                                  undefined
                                    ? "unknown category"
                                    : tinystory.property?.category?.name}
                                </p>
                              </div>
                              <div
                                className="visitLog"
                                style={{ width: "15%" }}
                              >
                                <div
                                  className="visitCount"
                                  style={{ width: "75%" }}
                                >
                                  <p
                                    style={{
                                      color: "#003541",
                                      textAlign: "center",
                                      fontFamily: "Work Sans",
                                      fontSize: "1rem",
                                      fontStyle: "normal",
                                      fontWeight: "400",
                                      lineHeight: "1.5rem",
                                      margin: "0",
                                      padding: "0 10px",
                                      background: "#F0F5F5",
                                      border: "1px solid #f0f5f5",
                                      borderRadius: "624.9375rem",
                                    }}
                                  >{`X ${tinystory.visits.length}`}</p>
                                </div>
                              </div>
                            </div>
                            <div className="propertyName">
                              <p
                                style={{
                                  color: "#003541",
                                  fontFamily: "Work Sans",
                                  fontSize: "1.125rem",
                                  fontStyle: "normal",
                                  fontWeight: "600",
                                  lineHeight: "1.5rem",
                                  textAlign: "left",
                                  margin: "0",
                                  padding: "0 14px",
                                }}
                              >
                                {tinystory.property?.name === undefined
                                  ? "Unknown Property"
                                  : tinystory.property?.name}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                ))}
              </div>
            </div>
          </>
        ))}
      <ToastContainer />
    </Fragment>
  );
}
