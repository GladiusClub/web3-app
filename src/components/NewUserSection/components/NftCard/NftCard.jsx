import React from "react";
import { Button } from "../Button";
import styled from "styled-components";
import placeholderImage from "./image-placeholder.png";

const StyledNftCard = styled.div`
  align-items: center;
  background: linear-gradient(180deg, rgb(15, 18, 51) 0%, rgb(14, 16, 37) 100%);
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  height: 402px;
  position: relative;
  transition: all 0.3s ease;
  width: 315px;

  & .image {
    align-items: flex-start;
    align-self: stretch;
    border-radius: 20px 20px 0px 0px;
    display: flex;
    flex: 0 0 auto;
    flex-direction: column;
    gap: 10px;
    position: relative;
    width: 100%;
  }

  & .image-placeholder {
    align-self: stretch;
    height: 201px;
    object-fit: cover;
    position: relative;
    width: 100%;
  }

  & .NFT-info {
    align-self: stretch;
    height: 201px;
    position: relative;
    width: 100%;
  }

  & .NFT-name {
    color: var(--white);
    font-family: var(--h5-work-sans-font-family);
    font-size: var(--h5-work-sans-font-size);
    font-style: var(--h5-work-sans-font-style);
    font-weight: var(--h5-work-sans-font-weight);
    left: 59px;
    letter-spacing: var(--h5-work-sans-letter-spacing);
    line-height: var(--h5-work-sans-line-height);
    position: absolute;
    text-align: center;
    top: 18px;
    width: 198px;
  }

  & .use-button {
    background: linear-gradient(
      180deg,
      rgb(230.56, 208.95, 14.41) 0%,
      rgb(223.12, 110.43, 28.82) 100%
    ) !important;
    background-color: unset !important;
    display: flex !important;
    height: 41px !important;
    left: 91px !important;
    position: absolute !important;
    top: 67px !important;
    width: 135px !important;
  }

  & .button-instance {
    font-family: var(--button-text-font-family) !important;
    font-size: var(--button-text-font-size) !important;
    font-style: var(--button-text-font-style) !important;
    font-weight: var(--button-text-font-weight) !important;
    letter-spacing: var(--button-text-letter-spacing) !important;
    line-height: var(--button-text-line-height) !important;
    margin-left: -0.5px !important;
    margin-right: -0.5px !important;
  }

  & .additional-info {
    align-items: flex-start;
    display: flex;
    left: 20px;
    position: absolute;
    top: 142px;
    width: 198px;
  }

  & .price {
    align-items: flex-start;
    display: flex;
    flex: 1;
    flex-direction: column;
    flex-grow: 1;
    gap: 8px;
    padding: 0px 21px 0px 0px;
    position: relative;
  }

  & .text-wrapper-2 {
    align-self: stretch;
    color: #858584;
    flex: 1;
    font-family: var(--caption-space-mono-font-family);
    font-size: var(--caption-space-mono-font-size);
    font-style: var(--caption-space-mono-font-style);
    font-weight: var(--caption-space-mono-font-weight);
    letter-spacing: var(--caption-space-mono-letter-spacing);
    line-height: var(--caption-space-mono-line-height);
    margin-top: -1px;
    position: relative;
    white-space: nowrap;
  }

  & .element-ETH {
    align-self: stretch;
    color: var(--white);
    flex: 1;
    font-family: var(--caption-space-mono-font-family);
    font-size: var(--caption-space-mono-font-size);
    font-style: var(--caption-space-mono-font-style);
    font-weight: var(--caption-space-mono-font-weight);
    letter-spacing: var(--caption-space-mono-letter-spacing);
    line-height: var(--caption-space-mono-line-height);
    position: relative;
    white-space: nowrap;
  }
`;

export const NftCard = ({ className }) => {
  return (
    <StyledNftCard className={`NFT-card ${className}`}>
      <div className="image">
        <img
          className="image-placeholder"
          alt="Placeholder"
          src={placeholderImage}
        />
      </div>
      <div className="NFT-info">
        <div className="NFT-name">Spear</div>
        <Button
          className="use-button"
          divClassName="button-instance"
          hasLeftIcon={false}
          property1="primary-filled"
          text="BUY"
        />
        <div className="additional-info">
          <div className="price">
            <div className="text-wrapper-2">Price</div>
            <div className="element-ETH">1.63 GLC</div>
          </div>
        </div>
      </div>
    </StyledNftCard>
  );
};
