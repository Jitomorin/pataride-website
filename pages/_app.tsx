import "tailwindcss/tailwind.css";

import "swiper/css";
import "swiper/css/bundle";
import "swiper/css/navigation";
import "swiper/css/autoplay";
// import "./style.css";

import { AppProps } from "next/dist/shared/lib/router/router";
import Head from "next/head";
import { ColorModeScript } from "nextjs-color-mode";
import React, { PropsWithChildren, useEffect, useState } from "react";

import Footer from "components/Footer";
import { GlobalStyle } from "components/GlobalStyles";
import Navbar from "components/Navbar";
import NavigationDrawer from "components/NavigationDrawer";
import NewsletterModal from "components/NewsletterModal";
import {
  NewsletterModalContextProvider,
  useNewsletterModalContext,
} from "contexts/newsletter-modal.context";
import { NavItems } from "types";
import Router, { useRouter } from "next/router";
import CompanyFooter from "@/components/CompanyFooter";
import StickySocialMediaBar from "@/components/StickySocialMediaBar";
import styled from "styled-components";
import { ThemeProvider, useTheme } from "@/components/Theme";
import ThemeContainer from "./style";
import Loading from "@/components/Loading";
import { AuthContextProvider } from "@/contexts/AuthContext";
import {
  ProfileModalContextProvider,
  useProfileModalContext,
} from "@/contexts/profile-modal.context";
import ProfileModal from "@/components/ProfileModal";

export interface SharedPageProps {
  draftMode: boolean;
  token: string;
}
const navItems: NavItems = [];

function MyApp({ Component, pageProps }: AppProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const routerPathname = router.pathname;

  useEffect(() => {
    const startLoading = () => {
      setLoading(true);
    };

    const stopLoading = () => {
      setLoading(false);
    };

    Router.events.on("routeChangeStart", startLoading);
    Router.events.on("routeChangeComplete", stopLoading);
    Router.events.on("routeChangeError", stopLoading);

    return () => {
      Router.events.off("routeChangeStart", startLoading);
      Router.events.off("routeChangeComplete", stopLoading);
      Router.events.off("routeChangeError", stopLoading);
    };
  }, []);

  return (
    <ThemeProvider>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Oswald&family=Poppins&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" type="image/png" href="/favicon.png" />
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-6WCSKJXF5T"
        ></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag() {
                dataLayer.push(arguments);
              }
              gtag('js', new Date());
              gtag('config', 'G-6WCSKJXF5T');
            `,
          }}
        />
        {/* <link rel="alternate" type="application/rss+xml" href={EnvVars.URL + 'rss'} title="RSS 2.0" /> */}
        {/* <script
          dangerouslySetInnerHTML={{
            __html: `window.ga=window.ga||function(){(ga.q=ga.q||[]).push(arguments)};ga.l=+new Date;
          ga('create', 'UA-117119829-1', 'auto');
          ga('send', 'pageview');`,
          }}
        /> */}
        {/* <script async src="https://www.google-analytics.com/analytics.js"></script> */}
      </Head>
      <AuthContextProvider>
        <>
          <ColorModeScript />
          <GlobalStyle />
          {loading ? (
            // <Spinner />
            <Loading />
          ) : (
            <Providers>
              <Modals />
              <ProfileModals />
              {routerPathname === "/login" ||
              routerPathname.includes("dashboard") ||
              routerPathname === "/signup" ? null : (
                <Navbar />
              )}
              {/* <Navbar /> */}
              {routerPathname === "/login" ||
              routerPathname.includes("dashboard") ||
              routerPathname === "/signup" ? null : (
                <StickySocialMediaBar />
              )}
              {/* <StickySocialMediaBar /> */}
              <Component {...pageProps} />
              {/* <CompanyFooter /> */}
              {routerPathname === "/login" ||
              routerPathname.includes("dashboard") ||
              routerPathname === "/signup" ? null : (
                <Footer />
              )}
              {/* <Footer /> */}
            </Providers>
          )}
        </>
      </AuthContextProvider>
    </ThemeProvider>
  );
}

function Providers<T>({ children }: PropsWithChildren<T>) {
  return (
    <ProfileModalContextProvider>
      <NewsletterModalContextProvider>
        <NavigationDrawer items={navItems}>{children}</NavigationDrawer>
      </NewsletterModalContextProvider>
    </ProfileModalContextProvider>
  );
}

function Modals() {
  const { isModalOpened, setIsModalOpened } = useNewsletterModalContext();
  if (!isModalOpened) {
    return null;
  }
  return <NewsletterModal onClose={() => setIsModalOpened(false)} />;
}
function ProfileModals() {
  const { isProfileModalOpened, setIsProfileModalOpened } =
    useProfileModalContext();
  if (!isProfileModalOpened) {
    return null;
  }
  return <ProfileModal onClose={() => setIsProfileModalOpened(false)} />;
}

export default MyApp;
