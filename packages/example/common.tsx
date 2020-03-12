import React from "react";
import styled, { createGlobalStyle } from "styled-components";
import LogoImg from "../../doc/logo.png";
import LogoText from "../../doc/text.png";

export const Logo = () => (
  <div>
    <img src={LogoImg}></img>
    <img src={LogoText}></img>
  </div>
);

export const Container = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
`;

export const Global = createGlobalStyle`
  body, html {
    height: 100%;
    background: #181a1b;
  }
`;
