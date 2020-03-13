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

export const Button = styled.div`
  height: 40px;
  border: 1px solid #3498db;
  border-radius: 10000px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #3498db;
  font-size: 13px;
  padding: 0 18px;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background: #3498db;
    color: white;
  }
`;

export const Container = styled.div`
  height: 100%;
  display: flex;
  margin-top: 100px;
  align-items: center;
  flex-direction: column;
`;
