import React from "react";
import { Component } from "./Component";
import "./style.css";
import styled from "styled-components";

const StyledBox = styled.div`
  height: 263px;
  width: 390px;

  & .rectangle {
    height: 263px;
    left: 0;
    position: fixed;
    top: 0;
    width: 390px;
  }
`;

export const GladiusProfile = () => {
  return (
    <div className="gladius-profile">
      <div className="div">
        <div className="overlap">
          <StyledBox>
            <svg
              width="390"
              height="263"
              viewBox="0 0 390 263"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0 0H390V232.085C390 232.085 271.719 263.122 194 263C117.05 262.878 0 232.085 0 232.085V0Z"
                fill="#F200F7"
              />
            </svg>
          </StyledBox>
          <div className="profile-box">
            <div className="avatar">
              <div className="overlap-group">
                <Component className="component-1" kind="avatar-6" />
              </div>
            </div>
            <div className="text-wrapper">Alexey</div>
            <div className="level">Level 1</div>
          </div>
        </div>
        <div className="group-2">
          <div className="stats-box">
            <div className="overlap-group-wrapper">
              <div className="overlap-group-2">
                <div className="rectangle-2" />
                <div className="text-wrapper-2">Points</div>
                <div className="points">0</div>
                <img
                  className="star-half-empty"
                  alt="Star half empty"
                  src={require("../../img/star-half-empty.png")}
                />
              </div>
            </div>
            <div className="total-wins">
              <div className="overlap-2">
                <div className="level-2">Total Wins</div>
                <div className="level-3">0</div>
                <img
                  className="first-place-ribbon"
                  alt="First place ribbon"
                  src={require("../../img/first-place-ribbon.png")}
                />
              </div>
            </div>
            <div className="overlap-wrapper">
              <div className="overlap-3">
                <div className="overlap-group-3">
                  <div className="level-4">Gladius Coins</div>
                  <div className="level-5">0</div>
                </div>
                <img
                  className="cent"
                  alt="Cent"
                  src={require("../../img/cent.png")}
                />
              </div>
            </div>
            <div className="div-wrapper">
              <div className="overlap-4">
                <div className="rectangle-3" />
                <div className="level-6">Total Trainings</div>
                <div className="level-7">345</div>
                <img
                  className="calendar"
                  alt="Calendar"
                  src={require("../../img/calendar.png")}
                />
              </div>
            </div>
          </div>
          <div className="text-wrapper-3">Statistics</div>
        </div>
        <div className="transfer-button">
          <div className="overlap-5">
            <div className="text-wrapper-4">Transfer</div>
          </div>
        </div>
      </div>
    </div>
  );
};
