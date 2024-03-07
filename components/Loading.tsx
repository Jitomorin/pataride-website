import React from "react";
import styled from "styled-components";
import { useTheme } from "./Theme";

const Loader = () => {
  const { theme }: any = useTheme();
  return (
    <Wrapper theme={theme}>
      <div className="centered">
        <div className="blob-1"></div>
        <div className="blob-2"></div>
      </div>
    </Wrapper>
  );
};

export default Loader;

const Wrapper = styled.div<{ theme: any }>`
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background: ${(props) => (props.theme === "light" ? "#fff" : "#010103")};
  .centered {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: ${(props) => (props.theme === "light" ? "#fff" : "#010103")};
    filter: blur(10px) contrast(20);
  }
  .blob-1,
  .blob-2 {
    width: 70px;
    height: 70px;
    position: absolute;
    background: ${(props) => (props.theme !== "light" ? "#fff" : "#010103")};
    border-radius: 50%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  .blob-1 {
    left: 20%;
    animation: osc-l 2.5s ease infinite;
  }
  .blob-2 {
    left: 80%;
    animation: osc-r 2.5s ease infinite;
    background: #f8d521;
  }
  @keyframes osc-l {
    0% {
      left: 20%;
    }
    50% {
      left: 50%;
    }
    100% {
      left: 20%;
    }
  }
  @keyframes osc-r {
    0% {
      left: 80%;
    }
    50% {
      left: 50%;
    }
    100% {
      left: 80%;
    }
  }
`;
