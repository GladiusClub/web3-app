import React from "react";
import { AnimaLogo } from "../../icons/AnimaLogo";
import styled from "styled-components";

const StyledDevModePlugin = styled.div`
  background-color: #2d2d2d;
  display: flex;
  flex-direction: row;
  justify-content: center;
  width: 100%;

  & .div {
    background-color: #2d2d2d;
    height: 658px;
    overflow: hidden;
    position: relative;
    width: 1280px;
  }

  & .content {
    align-items: flex-start;
    display: inline-flex;
    flex-direction: column;
    height: 658px;
    justify-content: space-between;
    left: 60px;
    padding: 60px 0px 100px;
    position: absolute;
    top: 0;
  }

  & .anima-logo {
    height: 40px !important;
    position: relative !important;
    width: 40px !important;
  }

  & .text {
    align-items: flex-start;
    display: inline-flex;
    flex: 0 0 auto;
    flex-direction: column;
    gap: 24px;
    position: relative;
  }

  & .text-wrapper {
    color: #ffffff;
    font-family: "Mulish", Helvetica;
    font-size: 60px;
    font-weight: 700;
    letter-spacing: 0;
    line-height: 70px;
    margin-top: -1px;
    position: relative;
    width: 421px;
  }

  & .image {
    background-color: #f8d57e;
    height: 658px;
    left: 561px;
    position: absolute;
    top: 0;
    width: 720px;
  }

  & .anima-inspect-plugin {
    background-color: #fdfdfc;
    border-radius: 8px;
    height: 601px;
    left: 378px;
    position: absolute;
    top: 28px;
    width: 303px;
  }

  & .img {
    height: 337px;
    left: 7px;
    position: absolute;
    top: 74px;
    width: 288px;
  }

  & .image-2 {
    height: 53px;
    left: 7px;
    position: absolute;
    top: 11px;
    width: 288px;
  }

  & .image-3 {
    height: 176px;
    left: 7px;
    position: absolute;
    top: 415px;
    width: 288px;
  }

  & .usercard-in-dev-mode {
    height: 444px;
    left: 71px;
    position: absolute;
    top: 105px;
    width: 241px;
  }
`;

export const DevModePlugin = () => {
  return (
    <StyledDevModePlugin>
      <div className="div">
        <div className="content">
          <AnimaLogo className="anima-logo" />
          <div className="text">
            <div className="text-wrapper">
              Dev Mode
              <br />
              Plugin
            </div>
          </div>
        </div>
        <div className="image">
          <div className="anima-inspect-plugin">
            <img className="img" alt="test" src="/img/image-4.png" />
            <img className="image-2" alt="test" src="/img/image-6.png" />
            <img className="image-3" alt="test" src="/img/image-5.png" />
          </div>
          <img
            className="usercard-in-dev-mode"
            alt="Usercard in dev mode"
            src="/img/usercard-in-dev-mode.png"
          />
        </div>
      </div>
    </StyledDevModePlugin>
  );
};
