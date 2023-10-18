import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import { PropertyCardList } from "../components/PropertyCard";
import { SEARCH_QUERY } from "../graphql/queries/journalQueries";

export default function SearchBar() {
  /************************************************ QUERIES *****************************************************/
  const [results, setResults] = useState([]);
  const [initialQuery, setInitialQuery] = useState(null);

  const {
    loading: searchQueryLoading,
    error: searchQueryError,
    data: searchQueryData,
  } = useQuery(SEARCH_QUERY, {
    context: { clientName: "authorLink" },
    pollInterval: 10000,
    onCompleted: () => {
      setInitialQuery(searchQueryData);
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
            if (initialQuery.hasOwnProperty("properties")) {
              for (const property of initialQuery?.properties) {
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
