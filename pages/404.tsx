import styled from "styled-components";
import Container from "components/Container";
import { useTheme } from "@/components/Theme";
// import NotFoundIllustration from 'components/NotFoundIllustration';

// const Wrapper = styled.section<{ theme: any }>`
//   background: rgb(251, 251, 253);
//   /* margin: 10rem 0; */
//   width: 100vw;
//   height: 100vh;
//   text-align: center;
//   display: flex;
//   justify-content: center;
//   align-items: center;
// `;

const Wrapper = styled.section<{ theme: any }>`
  padding: 10rem 0;
  width: 100vw;
  height: 100vh;
  text-align: center;
  display: flex;
  justify-content: center;
  background-color: ${(props) =>
    props.theme !== "light" ? "#010103" : "#fff"};
  align-items: center;
  @media (max-width: 1000px) {
    flex-direction: column;
  }
`;

const Title = styled.h1<{ theme: any }>`
  font-family: "Oswald", sans-serif;
  font-size: 5rem;
  position: relative;
  width: auto;
  padding: 0 1rem;
  margin: auto, auto;
  margin-bottom: 3rem;
  color: ${(props) => (props.theme === "light" ? "#010103" : "#fff")};
  ::after {
    content: "";
    position: absolute;
    top: 95%;
    width: 150%;
    aspect-ratio: 3 / 1;
    left: 50%;
    transform: translate(-50%, 0);
    border-radius: 50%;
    border: 6px solid #f8d521;
    /* Use a conic gradient mask to hide and show the bits you want */
    --spread: 140deg;
    --start: 290deg;
    mask: conic-gradient(
      from var(--start),
      white 0 var(--spread),
      transparent var(--spread)
    );
  }
  /* margin-top: 5rem; */
`;

const Description = styled.div<{ theme: any }>`
  font-size: 3rem;
  opacity: 0.8;
  color: ${(props) => (props.theme === "light" ? "#010103" : "#fff")};
  font-family: "Poppins", sans-serif;
  /* margin-top: 2.5rem; */
`;
// const Card = styled.div<{ theme: any }>`
//   height: 100%;
//   width: 100%;
//   background: green;
// `;

const ImageContainer = styled.div`
  width: 25rem;
  margin: auto;
`;

export default function NotFoundPage() {
  const { theme }: any = useTheme();
  return (
    <Wrapper theme={theme}>
      {/* <Card theme={theme}> */}
      <Title theme={theme}>404</Title>
      <Description theme={theme}>Page Not Found</Description>
      {/* </Card> */}
    </Wrapper>
  );
}
