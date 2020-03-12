import styled from "styled-components";

export const Container = styled.div`
  height: 100%;
  display: flex;
  margin-top: 100px;
  align-items: center;
  flex-direction: column;
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

export const Count = styled.h1`
  color: white;
  margin: 80px 0;
`;
