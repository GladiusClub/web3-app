import React from "react";
import styled from "styled-components";

const StyledHeadlineSubhead = styled.div`
  align-items: center;
  background: linear-gradient(180deg, rgb(15, 18, 51) 0%, rgb(14, 16, 37) 100%);
  display: flex;
  flex-direction: column;
  gap: 40px;
  height: 239px;
  padding: 40px 0px;
  position: relative;
  width: 375px;

  & .div {
    align-items: flex-start;
    display: flex;
    flex: 0 0 auto;
    flex-direction: column;
    gap: 30px;
    position: relative;
    width: 315px;
  }

  & .frame {
    align-items: flex-start;
    align-self: stretch;
    display: flex;
    flex: 0 0 auto;
    flex-direction: column;
    gap: 10px;
    position: relative;
    width: 100%;
  }

  & .browse-marketplace {
    align-self: stretch;
    color: var(--white);
    font-family: var(--h4-work-sans-font-family);
    font-size: var(--h4-work-sans-font-size);
    font-style: var(--h4-work-sans-font-style);
    font-weight: var(--h4-work-sans-font-weight);
    letter-spacing: var(--h4-work-sans-letter-spacing);
    line-height: var(--h4-work-sans-line-height);
    margin-top: -1px;
    position: relative;
  }

  & .browse-through-more {
    align-self: stretch;
    color: var(--white);
    font-family: var(--base-body-work-sans-font-family);
    font-size: var(--base-body-work-sans-font-size);
    font-style: var(--base-body-work-sans-font-style);
    font-weight: var(--base-body-work-sans-font-weight);
    letter-spacing: var(--base-body-work-sans-letter-spacing);
    line-height: var(--base-body-work-sans-line-height);
    position: relative;
  }
`;

export const HeadlineSubhead = () => {
  return (
    <StyledHeadlineSubhead>
      <div className="div">
        <div className="frame">
          <div className="browse-marketplace">Gladius Level&nbsp;&nbsp;1</div>
          <p className="browse-through-more">
            Guest - gets the opportunity to choose a weapon on which further specialization depends. You can choose only
            one weapon, the long sword is the default for all players.
          </p>
        </div>
      </div>
    </StyledHeadlineSubhead>
  );
};
