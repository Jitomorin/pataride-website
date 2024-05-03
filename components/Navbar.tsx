import Link from "next/link";
import { useState } from "react";
import NextImage from "next/image";
import styled from "styled-components";
import ColorSwitcher from "./ColorSwitcher";
import { useAuthContext } from "@/contexts/AuthContext";
import { useTheme } from "./Theme";
import { media } from "@/utils/media";
import { useProfileModalContext } from "@/contexts/profile-modal.context";
import Image from "next/image";

const ColorSwitcherContainer = styled.div`
  width: 4rem;
  margin: 0 1rem;
`;
const MobileNavbarDiv = styled.div<{ nav: boolean; theme: any }>`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  position: fixed;
  top: 0;
  left: -100%;
  background-color: ${(props) => (props.theme === "light" ? "#fff" : "#000")};
  z-index: 999998;
  justify-content: center;
  align-items: center;
  transition: all 0.5s ease-in-out;
  ${(props) => (props.nav ? "left: 0;" : "")}
`;
const NavbarDiv = styled.div`
  max-width: 133rem;
  width: 100%;
  height: auto;
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 2.7rem 2rem;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 99999;
  margin: 0 auto;
  ${media("<=desktop")} {
    justify-content: space-between;
  }
  ${media("<=tablet")} {
    padding: 0 3rem;
  }
`;
const CloseNavDiv = styled.div`
  font-size: 3rem;
  position: absolute;
  top: 3.5rem;
  right: 3.5rem;
  cursor: pointer;
  transition: all 0.3s;
  :hover {
    color: #3b3b3b;
  }
`;
const MobileNavLinks = styled.div<{ theme: any }>`
  display: flex;
  flex-direction: column;
  list-style: none;
  font-size: 2.3rem;
  gap: 3rem;
  text-align: center;
  li a {
    text-decoration: none;
    color: ${(props) => (props.theme === "light" ? "#010103" : "#fff")};
    font-weight: 500;
    transition: all 0.3s;
    :hover {
      color: #313131;
    }
  }
  li button {
    display: flex;
    margin: 0 auto;
    align-items: center;
    justify-content: center;
    text-decoration: none;
    color: ${(props) => (props.theme === "light" ? "#010103" : "#fff")};
    font-weight: 500;
    transition: all 0.3s;
    :hover {
      color: #313131;
    }
  }
`;
const NavLinks = styled.div<{ theme: any }>`
  display: flex;
  list-style: none;
  gap: 2.7rem;
  a {
    font-size: 2rem;
    font-family: "Oswald", sans-serif;
    font-weight: 500;
    color: ${(props) => (props.theme === "light" ? "#010103" : "#fff")};
    text-decoration: none;
    cursor: pointer;
    transition: all 0.3s;
    position: relative;
    display: inline-block;
    padding-bottom: 1rem;
  }
  a:hover {
    color: #f8d521;
  }
  a:hover::after {
    width: 100%;
  }
  a::after {
    content: "";
    position: absolute;
    left: 0;
    bottom: 0;
    width: 0;
    height: 3px;
    background-color: #f8d521; /* Change the color as needed */
    transition: width 0.3s ease; /* Add animation effect */
  }
  ${media("<=tablet")} {
    display: none;
  }
`;
const ImageContainer = styled.div`
  width: 14.5rem;
  img {
    width: 100%;
    height: 100%;
  }
`;
const HamburgerContainer = styled.div`
  font-size: 2.8rem;
  display: none;
  cursor: pointer;
  transition: all 0.3s;
  ${media("<=tablet")} {
    display: flex;
  }
`;
const NavButtons = styled.div<{ theme: any }>`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2.7rem;
  font-size: 2rem;
  font-family: "Oswald", sans-serif;
  font-weight: 500;
  align-items: center;
  a {
    color: ${(props) => (props.theme === "light" ? "#010103" : "#fff")};
    cursor: pointer;
    transition: all 0.3s;
    position: relative;
    display: inline-block;
    padding-bottom: 1rem;
  }
  a::after {
    content: "";
    position: absolute;
    left: 0;
    bottom: 0;
    width: 0;
    height: 3px;
    background-color: #f8d521; /* Change the color as needed */
    transition: width 0.3s ease; /* Add animation effect */
  }
  a:hover {
    color: #f8d521;
  }
  a:hover::after {
    width: 100%;
  }
  div {
    color: ${(props) => (props.theme === "light" ? "#010103" : "#fff")};
    cursor: pointer;
    transition: all 0.3s;
    position: relative;
    display: inline-block;
    padding-bottom: 1rem;
  }
  div::after {
    content: "";
    position: absolute;
    left: 0;
    bottom: 0;
    width: 0;
    height: 3px;
    background-color: #f8d521; /* Change the color as needed */
    transition: width 0.3s ease; /* Add animation effect */
  }
  div:hover {
    color: #f8d521;
  }
  div:hover::after {
    width: 100%;
  }
  li {
    display: flex;
    gap: 1rem;
    align-items: center;
  }
  ${media("<=tablet")} {
    display: none;
  }
`;

function Navbar() {
  const [nav, setNav] = useState(false);
  const { user }: any = useAuthContext();
  const { theme }: any = useTheme();
  const { setIsProfileModalOpened } = useProfileModalContext();

  const openNav = () => {
    setNav(!nav);
  };

  return (
    <>
      <nav>
        {/* mobile */}
        <MobileNavbarDiv theme={theme} nav={nav}>
          <CloseNavDiv onClick={openNav}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="24"
              height="24"
              fill="none"
              stroke={theme === "dark" ? "#fff" : "#000"}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </CloseNavDiv>
          <MobileNavLinks theme={theme}>
            <li>
              <Link onClick={openNav} href="/">
                Home
              </Link>
            </li>
            <li>
              <Link onClick={openNav} href="/dashboard/rentals">
                Hire now
              </Link>
            </li>
            <li>
              <Link onClick={openNav} href="/seller">
                Become a host
              </Link>
            </li>
            <li>
              <Link onClick={openNav} href="/about">
                About
              </Link>
            </li>
            <li>
              <Link onClick={openNav} href="/contact">
                Contact
              </Link>
            </li>
            {user != null ? (
              <>
                <li
                  onClick={() => {
                    setIsProfileModalOpened(true);
                  }}
                >
                  {/* <ProfileMenu /> */}
                  <div>
                    <Image
                      className="rounded-full"
                      width={40}
                      height={40}
                      src={
                        user?.profileUrl === ""
                          ? "/images/profile.png"
                          : user?.profileUrl
                      }
                      alt="avatar"
                    />
                  </div>
                </li>
                {/* <li>
                  <button
                    onClick={async () => {
                      await logout();
                    }}
                    className="navbar__buttons__sign-in"
                  >
                    Log out
                  </button>
                </li> */}
              </>
            ) : (
              <>
                <li>
                  <Link onClick={openNav} href="/login">
                    Sign In
                  </Link>
                </li>
                <li>
                  <Link onClick={openNav} href="/signup">
                    Register
                  </Link>
                </li>
              </>
            )}

            <li
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginTop: "1rem",
              }}
            >
              <ColorSwitcher />
            </li>
          </MobileNavLinks>
        </MobileNavbarDiv>

        {/* desktop */}

        <NavbarDiv>
          <ImageContainer>
            <Link href="/" onClick={() => window.scrollTo(0, 0)}>
              <NextImage
                src={"/images/logo/Pata Ride Text.png"}
                alt="logo-img"
                width={40}
                height={40}
              />
            </Link>
          </ImageContainer>
          <NavLinks theme={theme}>
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="/dashboard/rentals">Hire now</Link>
            </li>
            <li>
              <Link href="/seller">Become a host</Link>
            </li>
            <li>
              <Link href="/about">About</Link>
            </li>
            <li>
              <Link href="/contact">Contact</Link>
            </li>
          </NavLinks>

          {user != null ? (
            <NavButtons theme={theme}>
              <li>
                {/* <ProfileMenu /> */}
                <div
                  className="w-14 h-14 rounded-full cursor-pointer overflow-hidden"
                  onClick={() => {
                    setIsProfileModalOpened(true);
                  }}
                >
                  <img
                    className=" object-cover"
                    src={
                      user?.profileUrl === ""
                        ? "/images/profile.png"
                        : user?.profileUrl
                    }
                    alt="avatar"
                  />
                </div>
              </li>
              {/* <div
                onClick={async () => {
                  await logout();
                }}
              >
                Log out
              </div> */}
              <ColorSwitcherContainer>
                <ColorSwitcher />
              </ColorSwitcherContainer>
            </NavButtons>
          ) : (
            <NavButtons theme={theme}>
              <Link href="/login">Sign In</Link>
              <Link href="/signup">Register</Link>
              <ColorSwitcherContainer>
                <ColorSwitcher />
              </ColorSwitcherContainer>
            </NavButtons>
          )}

          {/* mobile */}
          <HamburgerContainer onClick={openNav}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="28"
              height="28"
              fill="none"
              stroke={theme === "dark" ? "#fff" : "#000"}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="3" width="16" height="1" rx="1" ry="1" />
              <rect x="3" y="9" width="20" height="1" rx="1" ry="1" />
              <rect x="3" y="15" width="16" height="1" rx="1" ry="1" />
            </svg>
          </HamburgerContainer>
        </NavbarDiv>
      </nav>
    </>
  );
}

export default Navbar;
