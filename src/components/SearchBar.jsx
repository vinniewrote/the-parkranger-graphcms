import React, { useState } from "react";
import { useQuery, gql } from "@apollo/client";
import { SEARCH_QUERY } from "../graphql/queries/journalQueries";

export default function SearchBar() {
  /************************************************ QUERIES *****************************************************/

  const {
    loading: searchQueryLoading,
    error: searchQueryError,
    data: searchQueryData,
  } = useQuery(SEARCH_QUERY, {
    context: { clientName: "authorLink" },
    onCompleted: () => {
      console.log(searchQueryData);
    },
  });
  return (
    <div>
      {/* <label>Search</label> */}
      <input
        onChange={(e) => {
          /* Handle updating search/filter text */
        }}
        type="string"
      />
    </div>
  );
}
