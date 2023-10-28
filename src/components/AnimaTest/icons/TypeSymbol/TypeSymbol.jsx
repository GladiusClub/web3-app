import React from "react";
import styled from "styled-components";

const StyledTypeSymbol = styled.svg`
  & .path {
    fill: #ff6250;
  }
`;

export const TypeSymbol = ({ className }) => {
  return (
    <StyledTypeSymbol
      className={`type-symbol ${className}`}
      fill="none"
      height="24"
      viewBox="0 0 24 24"
      width="24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        className="path"
        d="M2.14153 1.00002H21.0877C21.1116 0.99963 21.1351 1.00535 21.156 1.01663C21.177 1.0279 21.1947 1.04437 21.2075 1.06444C21.2204 1.08452 21.2278 1.10754 21.2292 1.13131C21.2305 1.15508 21.2258 1.1788 21.2154 1.20022C19.5821 4.49849 17.12 7.31601 14.0706 9.37684C9.14477 12.7002 4.18458 13.0434 2.143 13.0618C2.12436 13.0622 2.10583 13.0588 2.0885 13.0519C2.07116 13.0451 2.05537 13.0348 2.04206 13.0218C2.02874 13.0088 2.01816 12.9932 2.01094 12.976C2.00371 12.9588 2 12.9404 2 12.9217V1.14008C2 1.12157 2.00367 1.10323 2.0108 1.08614C2.01793 1.06905 2.02838 1.05355 2.04154 1.04052C2.0547 1.0275 2.07032 1.01721 2.08748 1.01026C2.10464 1.00331 2.12302 0.999825 2.14153 1.00002Z"
        fill="#FF6250"
      />
      <path
        className="path"
        d="M6.23057 23C8.56704 23 10.4611 21.1058 10.4611 18.7694C10.4611 16.4329 8.56704 14.5388 6.23057 14.5388C3.89409 14.5388 2 16.4329 2 18.7694C2 21.1058 3.89409 23 6.23057 23Z"
        fill="#FFDF90"
      />
      <path
        className="path"
        d="M14.8781 22.7489C13.6813 22.292 13.0448 20.975 13.4503 19.809L16.6439 10.6952C17.0531 9.52921 18.3548 8.95501 19.5516 9.41185C20.7484 9.86945 21.3849 11.1858 20.9794 12.3525L17.7857 21.4663C17.3765 22.6323 16.0749 23.2072 14.8781 22.7489Z"
        fill="#3366FF"
      />
    </StyledTypeSymbol>
  );
};
