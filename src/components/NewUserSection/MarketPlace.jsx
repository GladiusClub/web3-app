import React from "react";
import { HeadlineSubhead } from "./components/HeadlineSubhead/HeadlineSubhead";
import { NftCard } from "./components/NftCard/NftCard";
import styled from "styled-components";
import "../../styleguide.css";

const StyledWithOurOwn = styled.div`
  align-items: flex-start;
  background: linear-gradient(180deg, rgb(15, 18, 51) 0%, rgb(14, 16, 37) 100%);
  background-color: rgba(255, 255, 255, 1);
  display: flex;
  flex-direction: column;
  height: 1168px;
  position: relative;

  & .marketplace-section {
    align-items: center;
    align-self: stretch;
    display: flex;
    flex-direction: column;
    height: 1168px;
    position: relative;
    width: 100%;

    & .NFT-cards-section {
      align-items: center;
      background-color: var(--background-secondary);
      display: flex;
      flex-direction: column;
      gap: 30px;
      height: 929px;
      padding: 40px 0px;
      position: relative;
      width: 375px;

      & .NFT-cards-row {
        align-items: flex-start;
        display: flex;
        flex: 0 0 auto;
        flex-direction: column;
        gap: 30px;
        position: relative;
        width: 315px;

        & .NFT-card-instance {
          align-self: stretch !important;
          width: 100% !important;
        }
      }
    }
  }
`;

export const MarketPlace = () => {
  return (
    <StyledWithOurOwn>
      <div className="marketplace-section">
        <HeadlineSubhead />
        <div className="NFT-cards-section">
          <div className="NFT-cards-row">
            <NftCard />
            <NftCard className="NFT-card-instance" />
          </div>
        </div>
      </div>
    </StyledWithOurOwn>
  );
};
