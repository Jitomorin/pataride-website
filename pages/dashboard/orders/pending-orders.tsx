import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import DeliveriesTable from "@/components/BookingsTable";
import React, { useEffect, useState } from "react";
import { useAuthContext } from "@/contexts/AuthContext";
import { getFilteredData } from "@/utils/firebase/firestore";
import BookingsTable from "@/components/BookingsTable";
import Link from "next/link";
import { classNames } from "@/contexts/utils";
import { useRouter } from "next/router";
import { getUrl } from "@/utils/formatString";
import OrdersTable from "@/components/OrdersTable";

const tabs = [
  {
    name: "All Orders",
    slug: "all-orders",
    href: "http://localhost:3000/dashboard/orders/all-orders",
    current: false,
  },
  {
    name: "Completed",
    slug: "completed-orders",
    href: "http://localhost:3000/dashboard/orders/completed-orders",
    current: false,
  },
  {
    name: "Pending",
    slug: "pending-orders",
    href: "http://localhost:3000/dashboard/orders/pending-orders",
    current: true,
  },
];
function PendingOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user }: any = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await getFilteredData("bookings", "rental.userID", "==", user.uid).then(
        (res: any) => {
          // sort deliveries by date in field called delivery_timestamp
          res.sort((a: any, b: any) => {
            return b.createdAt - a.createdAt;
          });
          let result = res.filter((item: any) => item.status === "pending");

          setOrders(result);
        }
      );
    };
    fetchData();
  }, [user]);

  return (
    <DefaultLayout>
      <div className="mx-auto">
        <Breadcrumb pageName="Orders" />
        <div className="w-full h-full flex-col justify-center">
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
                placeholder="Tabs"
                defaultValue={tabs
                  .find((tab) => getUrl(router) === tab.slug)
                  ?.toString()}
              >
                {tabs.map((tab: any) => (
                  <option
                    onClick={() => {
                      router.push(tab.href);
                    }}
                    key={tab.name}
                  >
                    {tab.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="hidden sm:block">
              <nav className="flex space-x-4" aria-label="Tabs">
                {tabs.map((tab: any) => (
                  <Link
                    key={tab.name}
                    href={tab.href}
                    className={classNames(
                      getUrl(router) === tab.slug.toLowerCase()
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
          {orders.length !== 0 ? (
            <OrdersTable router={router} bookings={[...orders]} />
          ) : (
            <div className="flex h-full mt-10 justify-center">
              <h1 className="text-3xl text-gray-600 font-semibold">
                No Orders Found
              </h1>
            </div>
          )}
        </div>
      </div>
    </DefaultLayout>
  );
}

export default PendingOrders;
