/*
We're constantly improving the code you see. 
Please share your feedback here: https://form.asana.com/?k=uvp-HPgd3_hyoXRBw1IcNg&d=1152665201300829
*/

import PropTypes from "prop-types";
import React from "react";
import "./style.css";

export const Bar = ({ mode, className }) => {
  return <div className={`bar ${mode} ${className}`} />;
};

Bar.propTypes = {
  mode: PropTypes.oneOf(["light-content", "dark-content"]),
};
