import HeroPages from "../../components/HeroPages";
import { useEffect, useState } from "react";
import { getData } from "@/utils/firebase/firestore";
import CarModelCard from "@/components/CarModelCard";
import { Car } from "@/components/CarData";
import { GetServerSideProps } from "next";
import { getClient } from "@/sanity/lib/client";
import { readToken } from "@/sanity/env";
import { useTheme } from "@/components/Theme";
import styled from "styled-components";
import Container from "@/components/Container";
import { media } from "@/utils/media";

export interface RentNowProps {
  cars: Car[];
}

const Wrapper = styled.section<{ theme: any }>`
  background-color: ${(props) =>
    props.theme === "light" ? "#fff" : "#050505"};
`;
const Models = styled.section<{ theme: any }>`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: auto;
  gap: 3rem;
  align-items: center;
  text-align: center;
  padding: 10rem 0;
  width: 110rem;
  margin: 0 auto;
  ${media("<=desktop")} {
    grid-template-columns: 1fr 1fr;
    width: -moz-fit-content;
    width: fit-content;
  }
  ${media("<=tablet")} {
    grid-template-columns: 1fr;
    width: -moz-fit-content;
    width: fit-content;
  }
`;

function RentNow(props: RentNowProps) {
  // const [cars, setCars] = useState([]);
  const { cars } = props;
  const { theme }: any = useTheme();

  return (
    <>
      <Wrapper theme={theme}>
        <HeroPages subRoute={false} name="Cars" />
        <Container>
          <Models>
            {cars !== null ? (
              <>
                {cars.map((car: any) => {
                  return <CarModelCard car={car} />;
                })}
              </>
            ) : (
              <></>
            )}
          </Models>
        </Container>
        {/* <div className="book-banner">
          <div className="book-banner__overlay"></div>
          <div className="container">
            <div className="text-content">
              <h2>Book a car by getting in touch with us</h2>
              <span>
                <i className="fa-solid fa-phone"></i>
                <h3> +254 (20) 202 0099 </h3>
              </span>
            </div>
          </div>
        </div> */}
      </Wrapper>
    </>
  );
}

export default RentNow;

export const getServerSideProps: GetServerSideProps<RentNowProps> = async (
  ctx
) => {
  const { draftMode = false, params = {} } = ctx;
  const client = getClient(draftMode ? { token: readToken } : undefined);
  const cars = await getData("rentals");
  console.log("Server Side Props: ", cars);

  if (!cars) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      cars,
      draftMode,
      token: draftMode ? readToken : "",
    },
  };
};
