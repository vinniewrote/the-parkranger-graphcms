import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import { PropertyCardList } from "../components/PropertyCard";
import { SEARCH_QUERY_SHORT } from "../graphql/queries/journalQueries";

export default function SearchBar() {
  /************************************************ QUERIES *****************************************************/
  const [results, setResults] = useState([]);

  const {
    //loading: searchQueryLoading,
    //error: searchQueryError,
    data: searchQueryData,
  } = useQuery(SEARCH_QUERY_SHORT, {
    context: { clientName: "authorLink" },
    onCompleted: () => {
      console.log(searchQueryData);
    },
  });

  return (
    <div>
      {/* <label>Search</label> */}
      <input
        type="string"
        onChange={(e) => {
          /* Handle updating search/filter text */
          const query = e.target.value.toLowerCase();

          const newResults = [];
          if (query !== "") {
            if (searchQueryData.hasOwnProperty("properties")) {
              for (const property of searchQueryData?.properties) {
                if (property.name.toLowerCase().indexOf(query) > -1) {
                  newResults.push(property);
                }
              }
            }
          }
          setResults(newResults);
        }}
      />

      <br />
      <br />

      <PropertyCardList properties={results} />

    </div>
  );
}
