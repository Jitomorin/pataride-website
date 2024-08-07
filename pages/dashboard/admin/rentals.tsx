import DefaultLayout from "@/components/Layouts/DefaultLayout";
import styled from "styled-components";
import Chart from "@/components/Charts/page";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { GetServerSideProps } from "next";
import { getClient } from "@/sanity/lib/client";
import {
  getAllData,
  getAllSortedData,
  getData,
} from "@/utils/firebase/firestore";
import { Car } from "@/components/CarData";
import CarModelCard from "@/components/CarModelCard";
import CarModelCardDashboard from "@/components/CarModelCarDashboard";
import { useEffect, useState } from "react";
import Dropdown from "@/components/Dropdown";
import { FunnelIcon } from "@heroicons/react/20/solid";
import UsersTable from "@/components/UsersTable";
import { set } from "sanity";
import RentalsTable from "@/components/RentalsTable";
import { useRouter } from "next/router";
import Link from "next/link";
import AdminRentalsTable from "@/components/AdminRentalsTable";
import { getUrl } from "@/utils/formatString";

const tabs = [
  {
    name: "Users",
    href: "http://localhost:3000/dashboard/admin/users",
    current: false,
  },
  {
    name: "Rentals",
    href: "http://localhost:3000/dashboard/admin/rentals",
    current: false,
  },
  {
    name: "Bookings",
    href: "http://localhost:3000/dashboard/admin/bookings",
    current: true,
  },
];

function AdminRentals() {
  const [rentals, setRentals] = useState<any[]>([]);
  const router = useRouter();

  function classNames(...classes: any) {
    return classes.filter(Boolean).join(" ");
  }

  useEffect(() => {
    const fetchData = async () => {
      await getAllData("rentals").then((res) => {
        res.sort((a: any, b: any) => {
          return b.dateAdded - a.dateAdded;
        });
        setRentals(res);
      });
    };
    fetchData();
  }, []);

  return (
    <DefaultLayout>
      <div className=" mx-auto">
        <Breadcrumb pageName="Admin" />
        <div className="w-full space-y-4 flex flex-col justify-center">
          <div>
            <div className="sm:hidden">
              <label htmlFor="tabs" className="sr-only">
                Select a tab
              </label>
              {/* Use an "onChange" listener to redirect the user to the selected tab URL. */}
              <select
                id="tabs"
                name="tabs"
                className="block w-full rounded-md border-gray-300 focus:border-primary-500 focus:ring-primary-500"
                defaultValue={tabs
                  .find((tab) => getUrl(router) === tab.name)
                  ?.toString()}
              >
                {tabs.map((tab) => (
                  <option key={tab.name}>{tab.name}</option>
                ))}
              </select>
            </div>
            <div className="hidden sm:block">
              <nav className="flex space-x-4" aria-label="Tabs">
                {tabs.map((tab) => (
                  <Link
                    key={tab.name}
                    href={tab.href}
                    className={classNames(
                      getUrl(router) === tab.name.toLowerCase()
                        ? "bg-primary-100 text-primary-700"
                        : "text-gray-500 hover:text-gray-700",
                      "rounded-md px-3 py-2 text-sm font-medium"
                    )}
                    aria-current={tab.current ? "page" : undefined}
                  >
                    {tab.name}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
          {/* <UsersTable users={filteredUsers} /> */}
          {rentals.length <= 0 ? (
            <></>
          ) : (
            <AdminRentalsTable rentals={rentals} />
          )}
        </div>
      </div>
    </DefaultLayout>
  );
}

export default AdminRentals;

// export const getServerSideProps: GetServerSideProps<RentalProps> = async (
//   ctx
// ) => {
//   const { draftMode = false, params = {} } = ctx;
//   // const client = getClient(draftMode ? { token: readToken } : undefined);
//   const cars = await getData("rentals");
//   // console.log("Server Side Props: ", JSON.parse(JSON.stringify(cars)));

//   if (!cars) {
//     return {
//       notFound: true,
//     };
//   }

//   return {
//     props: {
//       cars: JSON.parse(JSON.stringify(cars)),
//       draftMode,
//       // token: draftMode ? readToken : "",
//     },
//   };
// };
