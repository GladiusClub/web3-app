import PropTypes from "prop-types";
import React from "react";
import { Rocketlaunch2 } from "../../icons/Rocketlaunch2";
import styled from "styled-components";

const StyledButton = styled.button`
  all: unset;
  align-items: center;
  border-radius: 20px;
  box-sizing: border-box;
  display: inline-flex;
  gap: 12px;
  justify-content: center;
  padding: 0px 50px;
  position: relative;
  transition: all 0.3s ease;

  & .rocket-launch {
    height: 20px !important;
    position: relative !important;
    width: 20px !important;
  }

  & .text-wrapper {
    color: #ffffff;
    position: relative;
    text-align: center;
    white-space: nowrap;
    width: fit-content;
  }

  &.primary-filled {
    background-color: var(--call-to-action);
    height: 72px;
  }

  &.tertiary-filled {
    background-color: var(--call-to-action);
    height: 46px;
  }

  &.tertiary-outlined {
    border: 2px solid;
    border-color: var(--call-to-action);
    height: 46px;
  }

  &.secondary-outlined {
    border: 2px solid;
    border-color: var(--call-to-action);
    height: 60px;
  }

  &.primary-outlined {
    border: 2px solid;
    border-color: var(--call-to-action);
    height: 72px;
  }

  &.secondary-filled {
    background-color: var(--call-to-action);
    height: 60px;
  }

  &.primary-filled .text-wrapper {
    font-family: var(--h5-work-sans-font-family);
    font-size: var(--h5-work-sans-font-size);
    font-style: var(--h5-work-sans-font-style);
    font-weight: var(--h5-work-sans-font-weight);
    letter-spacing: var(--h5-work-sans-letter-spacing);
    line-height: var(--h5-work-sans-line-height);
  }

  &.tertiary-filled .text-wrapper {
    font-family: "Work Sans", Helvetica;
    font-size: 16px;
    font-weight: 600;
    letter-spacing: 0;
    line-height: 22.4px;
  }

  &.tertiary-outlined .text-wrapper {
    font-family: "Work Sans", Helvetica;
    font-size: 16px;
    font-weight: 600;
    letter-spacing: 0;
    line-height: 22.4px;
  }

  &.secondary-outlined .text-wrapper {
    font-family: "Work Sans", Helvetica;
    font-size: 16px;
    font-weight: 600;
    letter-spacing: 0;
    line-height: 22.4px;
  }

  &.primary-outlined .text-wrapper {
    font-family: var(--h5-work-sans-font-family);
    font-size: var(--h5-work-sans-font-size);
    font-style: var(--h5-work-sans-font-style);
    font-weight: var(--h5-work-sans-font-weight);
    letter-spacing: var(--h5-work-sans-letter-spacing);
    line-height: var(--h5-work-sans-line-height);
  }

  &.secondary-filled .text-wrapper {
    font-family: "Work Sans", Helvetica;
    font-size: 16px;
    font-weight: 600;
    letter-spacing: 0;
    line-height: 22.4px;
  }
`;

export const Button = ({ hasLeftIcon = true, hasText = true, text = "Button", property1, className, divClassName }) => {
  return (
    <StyledButton className={`button ${property1} ${className}`}>
      {hasLeftIcon && (
        <Rocketlaunch2
          className="rocket-launch"
          color={
            ["primary-outlined", "secondary-outlined", "tertiary-outlined"].includes(property1) ? "#A259FF" : "white"
          }
        />
      )}

      {hasText && <div className={`text-wrapper ${divClassName}`}>{text}</div>}
    </StyledButton>
  );
};

Button.propTypes = {
  hasLeftIcon: PropTypes.bool,
  hasText: PropTypes.bool,
  text: PropTypes.string,
  property1: PropTypes.oneOf([
    "primary-filled",
    "secondary-outlined",
    "primary-outlined",
    "tertiary-filled",
    "tertiary-outlined",
    "secondary-filled",
  ]),
};
