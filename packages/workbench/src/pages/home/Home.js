import React from "react";
import PropTypes from "prop-types";

import Base from "../base/base";

import VerticalTabs from "./VerticalTabs";

export const Home = () => {
  return (
    <Base>
      <VerticalTabs />
    </Base>
  );
};

Home.propTypes = {};
