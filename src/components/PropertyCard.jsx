import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import { PropertyBlock, PropertyTitle } from "../styledComponents/Parks_styled";

export function PropertyCard({ property }) {
  const id = property.id;
  const name = property.name;
  // const parkLoc = property?.location?.[1]?.id;

  return (
    <PropertyBlock>
      <Link key={`${name}-${id}`} to={`/properties/${id}`}>
        <PropertyTitle key={`${id}-${name}`}>{name}</PropertyTitle>
      </Link>
    </PropertyBlock>
  );
}

export function PropertyCardList({ properties }) {
  return (
    <Fragment>
      {properties.map((property) => (
        <Fragment key={property.id}>
          <PropertyCard property={property} />
        </Fragment>
      ))}
    </Fragment>
  );
}
