/*
We're constantly improving the code you see. 
Please share your feedback here: https://form.asana.com/?k=uvp-HPgd3_hyoXRBw1IcNg&d=1152665201300829
*/

import PropTypes from "prop-types";
import React from "react";
import "./style.css";

export const Component = ({ kind, className }) => {
  return <div className={`component ${kind} ${className}`} />;
};

Component.propTypes = {
  kind: PropTypes.oneOf(["avatar-3", "avatar-1", "avatar-6", "avatar-4", "avatar-2", "avatar-5"]),
};
