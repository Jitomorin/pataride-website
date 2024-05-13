import Head from "next/head";
// import Link from "components/Link";
import { EnvVars } from "env";
import { getAllPartners, getAllPosts, getClient } from "@/sanity/lib/client";
import Hero from "@/components/Hero";
import PlanTrip from "@/components/PlanTrip";
import PickCar from "@/components/PickCar";
import Banner from "@/components/Banner";
import ChooseUs from "@/components/ChooseUs";
import Testimonials from "@/components/Testimonials";
import RestAPI from "@/components/RestAPI";
import { useEffect } from "react";
import { auth } from "@/utils/firebase/config";
import { sendEmailVerification } from "firebase/auth";
import { LogoSlider } from "@/components/LogoSlider";

const client = getClient();

export default function Homepage() {
  return (
    <>
      <Head>
        <title>{EnvVars.SITE_NAME}</title>
        <meta name="description" content="A car rental website" />
      </Head>
      <Hero />
      {/* <RestAPI /> */}

      <PlanTrip />
      <div className="mt-0 bg-white overflow-x-hidden">
        <LogoSlider />
      </div>
      <PickCar />
      <Banner />
      <ChooseUs />
      <Testimonials />
      {/* <Faq /> */}
      {/* <Footer /> */}
    </>
  );
}

export async function getServerSideProps() {
  return {
    props: {
      posts: await getAllPosts(client),
      partners: await getAllPartners(client),
    },
  };
}
