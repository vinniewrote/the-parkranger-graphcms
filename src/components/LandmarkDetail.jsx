import React, { Fragment, useEffect, useState } from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import { request } from "graphql-request";

export default function LandmarkDetail(props, match) {
  const {
    params: { id },
  } = props.match;
  return (
    <Fragment>
      <div>Detail about the landmark goes here </div>
    </Fragment>
  );
}
