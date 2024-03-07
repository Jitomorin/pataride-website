import React from "react";
import styled from "styled-components";

const Wrapper = styled.button`
  background-color: #f8d521;
  color: white;
  font-weight: 700;
  font-size: 20px;
  border-radius: 15px;
  padding: 20px;
  width: 100%;
  transition: ease-in-out 0.3s;

  &:hover {
    scale: 1.02;
    transition: ease-in-out 0.3s;
  }
`;

const AuthButton = ({ text, onClick }: any) => {
  return <Wrapper onClick={onClick}>{text}</Wrapper>;
};

export default AuthButton;
