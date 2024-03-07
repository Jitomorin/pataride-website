"use client";

import CardDataStats from "@/components/CardDataStats";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import WalletStats from "@/components/WalletStats";
import styled from "styled-components";
import Image from "next/image";
import {
  faCar,
  faCreditCard,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import TableOne from "@/components/Tables/TableOne";
import ChartOne from "@/components/Charts/ChartOne";
import ChartThree from "@/components/Charts/ChartThree";
import ChartTwo from "@/components/Charts/ChartTwo";

const Wrapper = styled.section<{ theme: any }>`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
`;

function Home() {
  return (
    <DefaultLayout>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7">
        <CardDataStats title="Total Users" total={1900}>
          <FontAwesomeIcon
            // color={theme !== "light" ? "#fff" : ""}
            style={{ color: "#656575" }}
            icon={faUsers}
          />
        </CardDataStats>
        <CardDataStats title="Total amount made" total={13600} currency={true}>
          <FontAwesomeIcon
            // color={theme !== "light" ? "#fff" : ""}
            style={{ color: "#656575" }}
            icon={faCreditCard}
          />
        </CardDataStats>
        <CardDataStats title="My Rentals" total={3} levelDown currency={false}>
          <FontAwesomeIcon
            // color={theme !== "light" ? "#fff" : ""}
            style={{ color: "#656575" }}
            icon={faCar}
          />
        </CardDataStats>
        <WalletStats title="Balance" total={6000} />
      </div>
      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        {/* <ChartOne />
        <ChartTwo />
        <ChartThree />
        <MapOne /> */}
        <div className="col-span-12 xl:col-span-12">
          <TableOne />
        </div>
        {/* <ChatCard /> */}
      </div>
      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        <ChartOne />
        <ChartTwo />
        {/* <ChartThree /> */}
        {/* <MapOne /> */}

        {/* <ChatCard /> */}
      </div>
    </DefaultLayout>
  );
}

export default Home;
