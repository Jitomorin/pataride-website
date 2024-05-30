import Link from "next/link";
import { useTheme } from "./Theme";
import styled from "styled-components";
import { media } from "@/utils/media";
import NextImage from "next/image";
import { FacebookIcon, LinkedinIcon } from "react-share";
import { useNewsletterModalContext } from "@/contexts/newsletter-modal.context";
import { useEffect, useState } from "react";
import { getAllLinks, getClient } from "@/sanity/lib/client";

const FooterWrapper = styled.div<{ theme: any }>`
  background-color: ${(props) =>
    props.theme === "light" ? "#fff" : "#17191a"};
  padding: 15rem 0;
`;
const Wrapper = styled.div<{ theme: any }>`
  max-width: 133rem !important;
  margin: 0 auto !important;
  padding: 0 2.5rem !important;
  background: ${(props) => (props.theme === "light" ? "#fff" : "#17191a")};
`;
const Content = styled.div<{ theme: any }>`
  display: grid;
  color: #010103;
  grid-template-columns: 27fr 21fr 21fr 21fr;
  gap: 8rem;
  justify-content: center;
  text-align: left;
  color: ${(props) => (props.theme === "light" ? "#010103" : "#fff")};
  div {
    display: flex;
    gap: 1rem;
  }
  ${media("<=desktop")} {
    grid-template-columns: 1fr 1fr;
  }
  ${media("<=tablet")} {
    grid-template-columns: 1fr;
  }
`;
const DocContent = styled.div<{ theme: any }>`
  display: grid;
  margin-top: 2rem;
  color: #010103;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
  gap: 8rem;
  justify-content: center;
  text-align: left;
  list-style: none;

  color: ${(props) => (props.theme === "light" ? "#010103" : "#fff")};
  div {
    display: flex;
    gap: 1rem;
  }
  a {
    text-decoration: none;
    color: ${(props) => (props.theme === "light" ? "#010103" : "#fff")};
    transition: all 0.2s;
    font-size: 1.3rem;
  }
  a:hover {
    color: #f8d521;
  }
  li {
    font-size: 1.6rem;
  }
  ${media("<=desktop")} {
    grid-template-columns: 1fr 1fr;
  }
  ${media("<=tablet")} {
    grid-template-columns: 1fr;
  }
  ${media("<=tablet")} {
    text-align: center;
  }
`;
const Title = styled.li`
  font-family: "Oswald", sans-serif;
`;
const FirstList = styled.ul<{ theme: any }>`
  list-style: none;
  li a {
    text-decoration: none;
    color: ${(props) => (props.theme === "light" ? "#010103" : "#fff")};
    transition: all 0.2s;
  }
  li a:hover {
    color: #f8d521;
  }
  li:nth-child(1) {
    font-size: 2.4rem;
    margin-bottom: 1.5rem;
  }
  li:nth-child(1) span {
    font-weight: 700;
  }
  li:nth-child(2) {
    font-size: 1.6rem;
    color: #706f7b;
    line-height: 1.7;
    margin-bottom: 3rem;
  }
  li:nth-child(3),
  li:nth-child(4) {
    font-size: 1.6rem;
    font-family: "Oswald", sans-serif;
    font-weight: 500;
    margin-bottom: 1rem;
  }
  ${media("<=tablet")} {
    text-align: center;
  }
`;
const SecondList = styled.ul<{ theme: any }>`
  list-style: none;
  a {
    text-decoration: none;
    color: ${(props) => (props.theme === "light" ? "#010103" : "#fff")};
    transition: all 0.2s;
  }
  a:hover {
    color: #f8d521;
  }
  li {
    font-size: 1.6rem;
    margin-bottom: 1rem;
  }
  li:nth-child(1) {
    font-size: 2.4rem;
    font-weight: 700;
    text-transform: uppercase;
    font-family: "Oswald", sans-serif;
    cursor: auto;
  }
  input {
    font-family: "Oswald", sans-serif;
    font-size: 14px;
    font-weight: 400;
    line-height: 26px;
    background-color: ${(props) =>
      props.theme === "light" ? "#ececec" : "#272a2c"};
    border-width: 1px;
    border-color: transparent;
    padding: 10px 60px;
    outline: none;
    margin-top: 1rem;
  }
  div {
    display: flex;
    gap: 1rem;
  }
  ${media("<=tablet")} {
    text-align: center;
  }
  ${media("<=desktop")} {
    input {
      width: 100%;
    }
  }
`;
const SocialMediaList = styled.ul<{ theme: any }>`
  list-style: none;
  display: none;
  a {
    text-decoration: none;
    color: ${(props) => (props.theme === "light" ? "#010103" : "#fff")};
    transition: all 0.2s;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  a:hover {
    color: #f8d521;
  }
  li {
    font-size: 1.6rem;
    margin-bottom: 1rem;
  }
  li:nth-child(1) {
    font-size: 2.4rem;
    font-weight: 700;
    text-transform: uppercase;
    font-family: "Oswald", sans-serif;
    cursor: auto;
  }
  input {
    font-family: "Oswald", sans-serif;
    font-size: 14px;
    font-weight: 400;
    line-height: 26px;
    background-color: ${(props) =>
      props.theme === "light" ? "#ececec" : "#272a2c"};
    border-width: 1px;
    border-color: transparent;
    padding: 10px 60px;
    outline: none;
    margin-top: 1rem;
  }
  ${media("<=tablet")} {
    text-align: center;
  }
  ${media("<=desktop")} {
    input {
      width: 100%;
    }
  }
  @media (max-width: 425px) {
    display: block;
  }
`;
const SubmitButton = styled.button`
  text-decoration: none;
  color: white;
  font-weight: 700;
  background-color: #f8d521;
  padding: 1.5rem 2.5rem;
  border-radius: 0.3rem;
  /* box-shadow: 0 10px 15px 0 rgba(255, 83, 48, 0.25); */
  transition: all 0.3s;
  /* border: 2px solid #bcc8cc; */
  font-size: 1.6rem;
  width: -moz-fit-content;
  width: fit-content;
  cursor: pointer;
  width: 100%;
  transition: ease-in-out 0.3s;
  :hover {
    scale: 1.03;
    transition: ease-in-out 0.3s;
  }
`;

function Footer() {
  const { theme }: any = useTheme();
  const { setIsModalOpened } = useNewsletterModalContext();
  const [links, setLinks] = useState<any[]>([]);

  useEffect(() => {
    async function fetchLinks() {
      const client = getClient();
      const res: any = await getAllLinks(client);
      // console.log("Links: ", res);
      setLinks(res);
    }
    fetchLinks();
  }, []);

  return (
    <>
      <FooterWrapper theme={theme}>
        <Wrapper theme={theme}>
          <Content theme={theme}>
            <FirstList theme={theme}>
              <Title>
                <span>Pata-ride</span> Hires
              </Title>
              <li>
                We offers a big range of vehicles for all your driving needs. We
                have the perfect car to meet your needs.
              </li>
              <li>
                <Link href="tel: +254 (20) 202 0099 ">
                  <i className="fa-solid fa-phone"></i> +254 (20) 202 0099
                </Link>
              </li>

              <li>
                <Link
                  href="mailto: 
                  info@pata-ride.com"
                >
                  <i className="fa-solid fa-envelope"></i>
                  info@pata-ride.com
                </Link>
              </li>
              <li>
                <p style={{ fontSize: "14px", fontFamily: "Oswald" }}>
                  Powered by:
                </p>
                <Link
                  href="https://mocapital.co.ke/"
                  target="_blank"
                  style={{ fontSize: "14px", fontFamily: "Oswald" }}
                >
                  {/* <i className="fa-solid fa-envelope"></i> */}
                  Mo Capital Company Limited
                </Link>
              </li>

              <li>
                <p style={{ fontSize: "14px" }}>icons by Icons8</p>
              </li>
            </FirstList>

            <SecondList theme={theme}>
              <Title>Company</Title>
              <li>
                <Link href="#home">Home</Link>
              </li>
              <li>
                <Link href="#home">Hire now</Link>
              </li>
              <li>
                <Link href="#home">Become a host</Link>
              </li>
              <li>
                <Link href="#home">About</Link>
              </li>
              <li>
                <Link href="#home">Contact</Link>
              </li>
            </SecondList>

            <SecondList theme={theme}>
              <Title>Working Hours</Title>
              <li>Mon - Fri: 9:00AM - 9:00PM</li>
              <li>Sat: 9:00AM - 19:00PM</li>
              <li>Sun: Closed</li>
            </SecondList>
            <SocialMediaList theme={theme}>
              <Title>Find us on:</Title>
              {links[0]?.linkedin && (
                <li>
                  <Link target="_blank" href="#" passHref>
                    <LinkedinIcon size={40} round={true} />
                  </Link>
                </li>
              )}
              {links[0]?.instagram && (
                <li>
                  <Link target="_blank" href="#" passHref>
                    {/* <TwitterIcon size={50} round={true} /> */}
                    <NextImage
                      src="/instagram_logo.webp"
                      alt="Instagram Link"
                      width={50}
                      height={50}
                    />
                  </Link>
                </li>
              )}
              {links[0]?.facebook && (
                <li>
                  <Link target="_blank" href="#" passHref>
                    <FacebookIcon size={40} round={true} />
                  </Link>
                </li>
              )}
              {links[0]?.whatsapp && (
                <li>
                  <Link target="_blank" href="#" passHref>
                    {/* <TwitterIcon size={50} round={true} /> */}
                    <NextImage
                      src="/whatsapp_logo.webp"
                      alt="Whatsapp Link"
                      width={45}
                      height={45}
                    />
                  </Link>
                </li>
              )}
            </SocialMediaList>

            <SecondList theme={theme}>
              <Title>Subscription</Title>
              <li>
                <p>Subscribe your Email address for latest news & updates.</p>
              </li>

              <li>
                <SubmitButton
                  onClick={() => {
                    setIsModalOpened(true);
                  }}
                >
                  Submit
                </SubmitButton>
              </li>
            </SecondList>
          </Content>
          <DocContent theme={theme}>
            <li>
              <Link href="/privacy-policy">Privacy Policy</Link>
            </li>
            <li>
              <Link href="/terms-and-conditions">Terms & Conditions</Link>
            </li>
            <li>
              <Link href="/return-policy">Return Policy</Link>
            </li>
            <li>
              <Link href="/terms-of-use">Terms of Use</Link>
            </li>
            <li>
              <Link href="/terms-of-service">Terms of Service</Link>
            </li>
            <li>
              <Link href="/disclaimer">Disclaimer</Link>
            </li>
            <li>
              <Link href="/copyright">Copyright</Link>
            </li>
          </DocContent>
        </Wrapper>
      </FooterWrapper>
    </>
  );
}

export default Footer;
