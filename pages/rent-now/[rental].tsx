import React, { useEffect, useState } from "react";
import { SharedPageProps } from "../_app";
import styled from "styled-components";
import { GetServerSideProps, GetStaticPathsResult, GetStaticProps } from "next";
import NextImage from "next/image";
import ImageGallery from "react-image-gallery";
import {
  getAllLinks,
  getAllServiceSlugs,
  getClient,
  getServiceBySlug,
} from "@/sanity/lib/client";
import { readToken } from "@/sanity/env";
import { useRouter } from "next/router";
import service from "@/sanity/schemas/service";
import Page from "@/components/Page";
import { RentNowProps } from ".";
import { getDocument } from "@/utils/firebase/firestore";
import { Car } from "@/components/CarData";
import HeroPages from "@/components/HeroPages";
import Loading from "@/components/Loading";
import HeroButton from "@/components/HeroButton";
import Link from "next/link";
import { useTheme } from "@/components/Theme";
import Container from "@/components/Container";
import Snackbar from "@/components/Snackbar";
import Tooltip from "@/components/Tooltip";
import Partners from "@/views/HomePage/Partners";
import ImageSliderComponent from "@/components/ImageSliderComponent";

// interface pageProps extends SharedPageProps {
//     service: Service;
// }
interface CarProps extends SharedPageProps {
  car: Car;
}

interface Query {
  [key: string]: string;
}

const Wrapper = styled.section<{ theme: any }>`
  background-color: ${(props) =>
    props.theme === "light" ? "#fff" : "#17191a"};

  width: 100%;
  height: auto;
  img {
    border-radius: 10px;
  }
`;
const BookButton = styled.div<{ theme: any }>`
  background-color: #f8d521;
  padding: 1.8rem 3rem;
  border-radius: 0.3rem;
  transition: all 0.3s;
  font-size: 1.8rem;
  color: white;
  font-weight: bold;
  cursor: pointer;
  z-index: 1;
  &:hover {
    scale: 1.07;
  }
`;
const ContainerRow = styled.div`
  height: auto;
  display: flex;
  justify-content: space-between;
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;
const Description = styled.div`
  font-size: 1.5rem;
  width: 50rem;
  @media (max-width: 425px) {
    max-width: 100%;
  }
`;
const Details = styled.div`
  display: flex;
  justify-content: space-between;
  max-width: 50rem;
  gap: 0.4rem;
  padding-top: 2rem;
  margin-top: 2rem;
  border-top: 1px solid #c6c6c6;
  border-bottom: 1px solid #c6c6c6;
  @media (max-width: 425px) {
    flex-direction: column;
  }
`;
const Item = styled.div`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  padding: 0px;
  width: auto;
  text-align: right;
  border-right: 1px solid #c6c6c6;
  padding-right: 1rem;
  padding-left: 1rem;
  h4 {
    font-weight: bold;
  }
  @media (max-width: 425px) {
    display: grid;
    grid-template-columns: 1fr 1fr;
    text-align: left;
    border-right: none;
    border-left: 1px solid #c6c6c6;
    p {
      border-left: 1px solid #c6c6c6;
      padding-right: 1rem;
      padding-left: 1rem;
    }
  }
`;
const ButtonContainer = styled.div`
  width: 50%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: end;
  margin-top: auto;
  @media (max-width: 768px) {
    align-items: start;
    margin-top: 5rem;
  }
`;
const LinkContainer = styled.div<{ show: any }>`
  display: flex;
  transform: translateY(${(props) => (props.show ? "0" : "100%")});
  transition: transform 0.4s;
  justify-content: start;
  padding: 1.8rem 3rem;
  z-index: 0;
  a {
    width: 100%;
    transition: opacity 0.3s, transform 0.3s;
    &:hover {
      scale: 1.04;
    }
  }
  @media (max-width: 768px) {
  }
`;

export default function carSlugRoute(props: CarProps) {
  const router = useRouter();
  const { theme }: any = useTheme();
  const [showLinks, setShowLinks] = useState(false);
  const [links, setLinks] = useState<any[]>([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("Default Message");
  const { car }: any = props;
  if (router.isFallback) {
    return <Loading />;
  }

  useEffect(() => {
    async function fetchLinks() {
      const client = getClient();
      const res: any = await getAllLinks(client);
      console.log("Links: ", res);
      setLinks(res);
    }
    fetchLinks();
  }, []);

  return (
    <Wrapper theme={theme}>
      <HeroPages subRoute={true} name={`${car.name}`} />
      <Container>
        <div
          style={
            theme === "light"
              ? {
                  width: "100%",
                  alignSelf: "center",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  color: "#010103",
                }
              : {
                  width: "100%",
                  alignSelf: "center",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  color: "#fff",
                }
          }
        >
          <div
            style={{
              width: "100%",

              marginBottom: "5rem",
              marginTop: "5rem",
            }}
          >
            <div className="car-model-card__img">
              {/* <img src={car.image} alt="" /> */}
              {/* <ImageSlider images={car.image} /> */}
              <ImageSliderComponent images={car.image} />
            </div>
            <ContainerRow>
              <div className="car-model-card__text">
                <h3
                  style={{
                    fontWeight: "bold",
                    fontSize: "3rem",
                    marginTop: "1rem",
                    marginBottom: "1rem",
                  }}
                >
                  {car.name}
                </h3>
                <Description>{car.description}</Description>
                <Details>
                  <Item>
                    <h4>Make</h4>
                    <p>{car.make}</p>
                  </Item>
                  <Item>
                    <h4>Price</h4>
                    <p>{`Ksh ${car.price}`}</p>
                  </Item>
                  <Item>
                    <h4>Seats</h4>
                    <p>{car.seats}</p>
                  </Item>
                  <Item>
                    <h4>Fuel</h4>
                    <p>{car.fuel}</p>
                  </Item>
                  <Item>
                    <h4>Year</h4>
                    <p>{car.year}</p>
                  </Item>
                </Details>
              </div>
              <ButtonContainer>
                <LinkContainer show={showLinks}>
                  {links[0]?.bookWhatsapp && (
                    <Tooltip text="Whatsapp us to hire a car">
                      <Link target="_blank" href={links[0]?.bookWhatsapp}>
                        <NextImage
                          src="/whatsapp_logo.webp"
                          alt="Whatsapp Link"
                          width={50}
                          height={50}
                        />
                      </Link>
                    </Tooltip>
                  )}
                  {links[0]?.bookEmail && (
                    <Tooltip text="Email us to hire a car">
                      <Link
                        target="_blank"
                        href={`mailto:${links[0]?.bookEmail}`}
                      >
                        <NextImage
                          src="/email-icon.webp"
                          alt="Whatsapp Link"
                          width={45}
                          height={45}
                        />
                      </Link>
                    </Tooltip>
                  )}
                </LinkContainer>
                <BookButton
                  onClick={() => {
                    setShowLinks(!showLinks);
                    // setSnackbarMessage("Feature not available yet");
                    // setSnackbarOpen(true);
                  }}
                  theme={theme}
                >
                  {/* <Link href="">Book Ride</Link> */}
                  Book Ride
                </BookButton>
              </ButtonContainer>
            </ContainerRow>
          </div>
        </div>
      </Container>
      <Snackbar
        message={snackbarMessage}
        isVisible={snackbarOpen}
        onClose={() => {
          setSnackbarOpen(false);
        }}
      />
    </Wrapper>
  );
}

export const getServerSideProps: GetServerSideProps<CarProps, Query> = async (
  ctx
) => {
  const { draftMode = false, params = {} } = ctx;
  const client = getClient(draftMode ? { token: readToken } : undefined);
  console.log("params", params);
  const car = await getDocument("rentals", params.rental);

  if (!car) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      car: car,
      draftMode,
      token: draftMode ? readToken : "",
    },
  };
};
// export const getStaticPaths = async () => {
//   const slugs = await getAllServiceSlugs();

//   return {
//     paths: slugs?.map(({ slug }) => `/services/${slug}`) || [],
//     fallback: true,
//   };
// };
