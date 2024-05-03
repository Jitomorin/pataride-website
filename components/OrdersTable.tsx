import { useEffect, useState } from "react";
import ProfileColumn from "./ProfileColumn";
import Snackbar from "./Snackbar";
import RegisterUserModal from "./RegisterUserModal";
import { useRouter } from "next/router";
import { calculateSubtotal, formatNumber } from "@/utils/formatNumber";
import { deleteDocument } from "@/utils/firebase/firestore";

const people = [
  {
    name: "Lindsay Walton",
    title: "Front-end Developer",
    department: "Optimization",
    email: "lindsay.walton@example.com",
    role: "Member",
    image:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  },
  // More people...
];

export default function OrdersTable({ orders, loading }: any) {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("Default Message");
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const router = useRouter();
  //   console.log("Users in table : ", users);

  useEffect(() => {
    setFilteredOrders(orders);
  }, [orders, loading]);

  return (
    <div className="w-full">
      <div className="lg:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">
            Orders
          </h1>
          <p className="mt-2 text-sm text-gray-700">A list of your orders</p>
          <input
            type="text"
            className="p-2 w-1/2  border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            placeholder="Search for order ID..."
            onChange={(e: any) => {
              const res = orders.filter(
                (order: any) =>
                  order.status
                    .toLowerCase()
                    .includes(e.target.value.toLowerCase()) ||
                  order.uid.toLowerCase().includes(e.target.value.toLowerCase())
              );
              // console.log("Filtered Cars: ", res);
              setFilteredOrders(res);
            }}
          />
        </div>

        {/* <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            type="button"
            className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Add user
          </button>
        </div> */}
      </div>
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                  >
                    Order ID
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Date of order
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Amount
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Amount of rentals
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900"
                  >
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {loading ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-3 py-3.5 whitespace-nowrap text-sm font-medium text-gray-900"
                    >
                      Loading...
                    </td>
                  </tr>
                ) : (
                  <>
                    {
                      // check if there are orders
                      filteredOrders.length > 0 ? (
                        filteredOrders.map((order: any) => (
                          <tr key={order.uid}>
                            <td className="whitespace-nowrap py-5 pl-4 pr-3 text-sm sm:pl-0">
                              <div className="flex items-center">
                                <div className="ml-4">
                                  <div className="font-medium text-lg text-gray-900">
                                    {order.uid}
                                  </div>
                                  <div className="mt-1 text-gray-500">
                                    {order.email}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                              <span className="inline-flex items-center rounded-md  px-2 py-1 text-lg font-medium text-black ">
                                {`${new Date(
                                  order.booking_timestamp.seconds * 1000
                                ).toLocaleDateString(undefined, {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}`}
                              </span>
                            </td>
                            <td className="whitespace-nowrap px-3 py-5 text-lg text-gray-500">
                              <div className="text-gray-900">{`${formatNumber(
                                order.total
                              )}Ksh`}</div>
                              {/* <div className="mt-1 text-gray-500">
                        {person.department}
                      </div> */}
                            </td>
                            <td className="whitespace-nowrap px-3 py-5 text-center text-lg text-gray-500">
                              {order.products.length}
                            </td>

                            <td className="flex space-x-2 whitespace-nowrap py-5 pl-3 pr-4 text-center text-sm font-medium sm:pr-0">
                              <button
                                onClick={() => {
                                  router.push(`/dashboard/orders/${order.uid}`);
                                }}
                                className="text-indigo-600 hover:text-indigo-900 hover:underline "
                              >
                                Open
                              </button>
                              <button
                                onClick={async () => {
                                  if (
                                    window.confirm(
                                      `Are you sure you want to delete order ${order.uid}`
                                    )
                                  ) {
                                    await deleteDocument(
                                      "orders",
                                      order.uid
                                    ).then(() => {
                                      setSnackbarMessage("Order deleted");
                                      setSnackbarOpen(true);
                                      router.reload();
                                    });
                                  }
                                }}
                                className="text-red-600 hover:text-red-900 hover:underline "
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan={5}
                            className="px-3 py-3.5 whitespace-nowrap text-sm font-medium text-gray-900"
                          >
                            No orders found
                          </td>
                        </tr>
                      )
                    }
                  </>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Snackbar
        message={snackbarMessage}
        isVisible={snackbarOpen}
        onClose={() => {
          setSnackbarOpen(false);
        }}
      />
    </div>
  );
}
