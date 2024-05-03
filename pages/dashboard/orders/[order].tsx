import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import CartColumn from "@/components/CartColumn";
import Divider from "@/components/Divider";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import ProductOverview from "@/components/ProductOverview";
import Snackbar from "@/components/Snackbar";
import Spinner from "@/components/Spinner";
import { useAuthContext } from "@/contexts/AuthContext";
import {
  addDataWithDocName,
  getAllRentalSlugs,
  getDocument,
  getFilteredData,
  setPickupAndDropoffLocations,
  setProductStatus,
  setRentalAvailability,
  updateOrderStatus,
  updateOrderTransaction,
} from "@/utils/firebase/firestore";
import Axios from "axios";
import { uploadCoverImage } from "@/utils/firebase/storage";
import { getNumberOfDays } from "@/utils/formatDate";
import {
  calculatePrice,
  calculateSubtotal,
  formatNumber,
} from "@/utils/formatNumber";
import { GetServerSideProps } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
// import LocationPicker from "react-location-picker";
import { set } from "sanity";
import ExampleComponent from "@/components/ExampleComponent";
import styled from "styled-components";
import Link from "next/link";

const defaultPosition = {
  lat: 27.9878,
  lng: 86.925,
};

interface Query {
  [key: string]: string;
}

const Product = styled.div<{ active: any }>`
  display: flex;
  cursor: pointer;
`;
const Details = styled.div<{ active: any }>`
  font-size: 1.6rem;
  color: #000;
  font-family: "Poppins", sans-serif;
  background-color: white;
  line-height: 1.7;
  max-height: ${(props: any) => (props.active ? "100%" : "0")};
  overflow: hidden;
  transition: 0.7s ease-in-out;
  padding: ${(props: any) => (props.active ? "2.8rem 0rem" : "0 0rem")};

  p {
    font-size: 1.8rem;
    font-weight: 500;
    font-family: "Oswald", sans-serif;
    color: ${(props) => (props.active ? "#fff" : "#706f7b")};
  }
  i {
    font-size: 2rem;
  }
`;

function Order(props: any) {
  const { user, loading }: any = useAuthContext();
  const { order }: any = props;
  const [transaction, setTransaction] = useState<any>({});
  const router = useRouter();
  const [activeProduct, setActiveProduct] = useState("");
  const [orderLoading, setOrderLoading] = useState(true);
  const [snackbarMessage, setSnackbarMessage] = useState("Default Message");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [addressOnePickup, setAddressOnePickup] = useState("");
  const [addressTwoPickup, setAddressTwoPickup] = useState("");
  const [additionalNotesPickup, setAdditionalNotesPickup] = useState("");
  const [addressOneDropoff, setAddressOneDropoff] = useState("");
  const [addressTwoDropoff, setAddressTwoDropoff] = useState("");
  const [additionalNotesDropoff, setAdditionalNotesDropoff] = useState("");
  // const [t, setT] = useState<any>(true);
  // const [cart, setCart] = useState<any>({});
  const [address, setAddress] = useState(
    "Kala Pattar Ascent Trail, Khumjung 56000, Nepal"
  );
  const refreshPage = () => {
    router.replace(router.asPath);
  };
  const [position, setPosition] = useState({
    lat: 0,
    lng: 0,
  });
  const showProductDetails = (id: any) => {
    // return activeQ === id ? "active-answer" : "";
    // console.log("Active product: ", activeProduct);
    return activeProduct === id;
  };
  const fieldCheck = () => {
    // function to check if the fields are empty
    if (
      addressOnePickup === "" ||
      addressTwoPickup === "" ||
      additionalNotesPickup === "" ||
      addressOneDropoff === "" ||
      addressTwoDropoff === "" ||
      additionalNotesDropoff === ""
    ) {
      setSnackbarMessage("Please fill in all the fields");
      setSnackbarOpen(true);
      return false;
    }
    return true;
  };

  const showProduct = (id: any) => {
    // return activeQ === id ? "active-question" : "";
    // console.log("Active product: ", activeProduct);
    return activeProduct === id;
  };
  const openDetails = (id: any) => {
    setActiveProduct(activeProduct === id ? "" : id);
    // console.log("Active product: ", activeProduct);
  };
  const setLocations = async (index: any) => {
    setPickupAndDropoffLocations(
      order.uid,
      index,
      addressOnePickup,
      addressTwoPickup,
      additionalNotesPickup,
      addressOneDropoff,
      addressTwoDropoff,
      additionalNotesDropoff
    ).then((res: any) => {
      setSnackbarMessage("Location details saved");
      setSnackbarOpen(true);
    });
  };

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.push("/login");
    }
    // check if the other belongs to the user
    const checkOrderUser = async () => {
      if (user.uid !== order.user) {
        router.push("/dashboard/orders");
      }
    };
    checkOrderUser();
    const payHandler = async () => {
      // setButtonText("Processing");
      setOrderLoading(true);

      if (order.transaction.paid) {
        setTransaction(order.transaction);
        setOrderLoading(false);
      } else {
        await Axios.post(
          "https://sandbox.intasend.com/api/v1/checkout/details/",
          {
            public_key: "ISPubKey_test_cd5109e1-16d5-4961-a2ab-9f459db4f908",
            checkout_id: order.transaction_id,
            signature: order.signature,
          }
        )
          .then((res: any) => {
            setTransaction(res.data);
            updateOrderTransaction(order.uid, res.data).then((res: any) => {
              setOrderLoading(false);
            });
          })
          .catch((error: any) => {
            console.log(error);
            setTransaction({ detail: "Invalid data or signature used" });
            setOrderLoading(false);
            // setButtonText("Error");
          });
      }
    };
    payHandler();
  }, [user]);

  if (orderLoading) {
    return (
      <DefaultLayout>
        <div className="mx-auto">
          <h1 className="text-xl">Loading...</h1>
        </div>
      </DefaultLayout>
    );
  } else {
    if (transaction.detail === "Invalid data or signature used") {
      return (
        <DefaultLayout>
          <div className="mx-auto">
            {/* <CartColumn
          cart={cart}
          user={user}
          open={cartOpen}
          setOpen={setCartOpen}
          callSnackBar={(message: string) => {
            setSnackbarMessage(message);
            setSnackbarOpen(true);
          }}
        /> */}
            <Breadcrumb pageName={order.uid} index="Orders" />

            <div className="w-full h-screen flex justify-center flex-col md:flex-row">
              <h1 className="text-3xl m-auto font-bold text-gray-700 text-center w-full p-4 h-full bg-white">
                This order has expired.{" "}
                <Link className="text-blue-500" href="/dashboard/rentals">
                  Find new rentals
                </Link>
              </h1>
            </div>
            <Snackbar
              message={snackbarMessage}
              isVisible={snackbarOpen}
              onClose={() => {
                setSnackbarOpen(false);
              }}
            />
          </div>
        </DefaultLayout>
      );
    } else if (transaction) {
      return (
        <DefaultLayout>
          <div className="mx-auto">
            <Breadcrumb pageName={order.uid} index="Orders" />

            <div className="w-full h-screen flex justify-between flex-col md:flex-row">
              {/* <div className="shadow-md rounded-md flex w-full md:w-[49.5%] p-4 h-full bg-white">
                Chat
              </div> */}
              <div className="shadow-md rounded-md flex flex-col w-full p-4 h-auto bg-white">
                <h1 className="font-bold text-3xl py-2">Order Details</h1>
                {transaction?.paid == true ? (
                  <p className="mb-4 font-lg font-semibold px-2 py-1 text-white w-auto mr-auto rounded-lg border border-green-500 bg-green-300">{`Paid`}</p>
                ) : (
                  <>
                    <p className="mb-4 font-lg mr-auto rounded-lg font-semibold px-2 py-1 text-white border border-red-500 bg-red-300">{`Not Paid`}</p>
                    <button
                      className="bg-[#F8D521] mr-auto text-white px-4 py-2 rounded-lg text-xl font-semibold hover:scale-105 transition-all ease-in-out"
                      onClick={() => {
                        // navigate to the checkout url in a new tab
                        window.open(transaction.url);
                      }}
                    >
                      Pay now
                    </button>
                  </>
                )}
                <h1 className="font-bold text-xl py-2">Booking time</h1>
                <p>
                  {/* hsow the date an hour of the booking time */}
                  {`${new Date(
                    order.booking_timestamp.seconds * 1000
                  ).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}`}
                </p>

                <Divider />
                {/* products section */}
                <h1 className="font-bold text-xl py-2">Products</h1>
                <ul role="list" className="-my-6 divide-y divide-gray-200">
                  {order.products.length > 0 ? (
                    order.products.map((product: any, index: any) => (
                      <li key={index} className="flex py-6  flex-col">
                        {transaction.paid == true ? (
                          <>
                            <Product
                              onClick={() => {
                                console.log("Product uid: ", product.item.uid);
                                openDetails(product.item.uid);
                              }}
                              active={showProductDetails(product.item.uid)}
                            >
                              <div className="flex w-full">
                                <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                  <img
                                    src={product.item.image[0]}
                                    alt={product.item.name}
                                    className="h-full w-full object-cover object-center"
                                  />
                                </div>

                                <div className="ml-4 flex flex-1 flex-col ">
                                  <div className="">
                                    <div className="flex justify-between text-xl font-medium text-gray-900">
                                      <h3>
                                        <a
                                          className="hover:underline transition-all ease-in-out"
                                          href={`/dashboard/rentals/${product.item.uid}`}
                                        >
                                          {product.item.name}
                                        </a>
                                      </h3>
                                      <p className="ml-4">
                                        {`${formatNumber(
                                          calculatePrice(
                                            product.item.price,
                                            product.selectedDates[0].startDate,
                                            product.selectedDates[0].endDate
                                          )
                                        )}Ksh`}
                                      </p>
                                    </div>
                                    <p className="mt-1 text-sm text-gray-500">
                                      {product.seats}
                                    </p>
                                  </div>
                                  <div className="flex flex-col justify-start flex-1 items-end  text-lg">
                                    <p className="text-gray-500">
                                      {`from: ${new Date(
                                        product.selectedDates[0].startDate
                                          .seconds * 1000
                                      ).toLocaleDateString()} to: ${new Date(
                                        product.selectedDates[0].endDate
                                          .seconds * 1000
                                      ).toLocaleDateString()}`}
                                    </p>
                                    <p className="text-gray-500">
                                      {`${product.item.category}`}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </Product>
                            <Details active={showProduct(product.item.uid)}>
                              <h1 className="font-bold text-xl py-2">
                                Pickup location
                              </h1>
                              <div className="flex flex-col">
                                <label>Address line 1</label>

                                <input
                                  value={addressOnePickup}
                                  onChange={(e: any) => {
                                    setAddressOnePickup(e.target.value);
                                  }}
                                  type="text"
                                  placeholder={`${
                                    product.locations?.pickup_address_1
                                      ? product.locations.pickup_address_1
                                      : "Enter Address 1"
                                  }`}
                                ></input>
                                <label>Address line 2</label>
                                <input
                                  value={addressTwoPickup}
                                  onChange={(e: any) => {
                                    setAddressTwoPickup(e.target.value);
                                  }}
                                  type="text"
                                  placeholder={`${
                                    product.locations?.pickup_address_2
                                      ? product.locations.pickup_address_2
                                      : "Enter Address 2"
                                  }`}
                                ></input>
                                <label>Additional notes</label>
                                <textarea
                                  value={additionalNotesPickup}
                                  onChange={(e: any) => {
                                    setAdditionalNotesPickup(e.target.value);
                                  }}
                                  placeholder={`${
                                    product.locations?.pickup_notes
                                      ? product.locations.pickup_notes
                                      : "Enter Additional notes"
                                  }`}
                                ></textarea>
                              </div>
                              <h1 className="font-bold text-xl py-2">
                                Dropoff location
                              </h1>
                              <div className="flex flex-col">
                                <label>Address line 1</label>
                                <input
                                  value={addressOneDropoff}
                                  onChange={(e: any) => {
                                    setAddressOneDropoff(e.target.value);
                                  }}
                                  type="text"
                                  placeholder={`${
                                    product.locations?.dropoff_address_1
                                      ? product.locations.dropoff_address_1
                                      : "Enter Address 2"
                                  }`}
                                ></input>
                                <label>Address line 2</label>
                                <input
                                  value={addressTwoDropoff}
                                  onChange={(e: any) => {
                                    setAddressTwoDropoff(e.target.value);
                                  }}
                                  type="text"
                                  placeholder={`${
                                    product.locations?.dropoff_address_2
                                      ? product.locations.dropoff_address_2
                                      : "Enter Address 2"
                                  }`}
                                ></input>
                                <label>Additional notes</label>
                                <textarea
                                  value={additionalNotesDropoff}
                                  onChange={(e: any) => {
                                    setAdditionalNotesDropoff(e.target.value);
                                  }}
                                  placeholder={`${
                                    product.locations?.dropoff_notes
                                      ? product.locations.dropoff_notes
                                      : "Enter Additional notes"
                                  }`}
                                ></textarea>
                              </div>
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => {
                                    if (fieldCheck()) {
                                      setLocations(index).then((res: any) => {
                                        refreshPage();
                                      });
                                    }
                                  }}
                                  className="bg-transparent text-black mt-5 px-4 py-2 rounded-lg text-xl font-semibold hover:scale-105 hover:underline transition-all ease-in-out"
                                >
                                  Save
                                </button>
                                {
                                  // check if product.locations exists in this object

                                  product?.locations !== undefined ? (
                                    <button
                                      onClick={async () => {
                                        await addDataWithDocName(
                                          "deliveries",
                                          product.item.uid,
                                          {
                                            rental: product.item,
                                            uid: product.item.uid,
                                            locations: product.locations,
                                            orderID: order.uid,
                                            userID: user.uid,
                                            ownerID: product.item.userID,
                                            selected_dates:
                                              product.selectedDates,
                                            status: "pending",
                                            delivery_timestamp: new Date(),
                                            total: calculatePrice(
                                              product.item.price,
                                              product.selectedDates[0]
                                                .startDate,
                                              product.selectedDates[0].endDate
                                            ),
                                          }
                                        ).then((res: any) => {
                                          setProductStatus(
                                            order.uid,
                                            false,
                                            index
                                          ).then((res: any) => {
                                            setRentalAvailability(
                                              product.item.uid,
                                              false
                                            ).then((res: any) => {
                                              setSnackbarMessage(
                                                "Successfully sent delivery request"
                                              );
                                              setSnackbarOpen(true);
                                            });
                                          });
                                        });
                                      }}
                                      className="bg-[#F8D521] text-white mt-5 px-4 py-2 rounded-lg text-xl font-semibold hover:scale-105 transition-all ease-in-out"
                                    >
                                      Send Request
                                    </button>
                                  ) : null
                                }
                              </div>
                            </Details>
                          </>
                        ) : (
                          <div className="flex w-full">
                            <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                              <img
                                src={product.item.image[0]}
                                alt={product.item.name}
                                className="h-full w-full object-cover object-center"
                              />
                            </div>

                            <div className="ml-4 flex flex-1 flex-col ">
                              <div className="">
                                <div className="flex justify-between text-xl font-medium text-gray-900">
                                  <h3>
                                    <a
                                      className="hover:underline transition-all ease-in-out"
                                      href={`/dashboard/rentals/${product.item.uid}`}
                                    >
                                      {product.item.name}
                                    </a>
                                  </h3>
                                  <p className="ml-4">
                                    {`${formatNumber(
                                      calculatePrice(
                                        product.item.price,
                                        product.selectedDates[0].startDate,
                                        product.selectedDates[0].endDate
                                      )
                                    )}Ksh`}
                                  </p>
                                </div>
                                <p className="mt-1 text-sm text-gray-500">
                                  {product.seats}
                                </p>
                              </div>
                              <div className="flex flex-col justify-start flex-1 items-end  text-lg">
                                <p className="text-gray-500">
                                  {`from: ${new Date(
                                    product.selectedDates[0].startDate.seconds *
                                      1000
                                  ).toLocaleDateString()} to: ${new Date(
                                    product.selectedDates[0].endDate.seconds *
                                      1000
                                  ).toLocaleDateString()}`}
                                </p>
                                <p className="text-gray-500">
                                  {`${product.item.category}`}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </li>
                    ))
                  ) : (
                    <div className="flex flex-col justify-center items-start py-10">
                      <p className="text-xl font-semibold text-gray-400">
                        This order contains no products
                      </p>
                    </div>
                  )}
                </ul>
                {
                  // show the total price of the order
                }
                <p className="text-black font-semibold pt-9 text-3xl">
                  Total: {formatNumber(order.total)} Ksh
                </p>
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
        </DefaultLayout>
      );
    }
  }
}

export default Order;

export const getServerSideProps: GetServerSideProps<any, Query> = async (
  ctx
) => {
  const { params = {} } = ctx;
  //   console.log("params", params);
  const order = await getDocument("orders", params.order);
  const rentalSlug = params.user as string;

  if (!order) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      order: JSON.parse(JSON.stringify(order)),
      //   rentalSlug: rentalSlug,
    },
  };
};

// export const getStaticPaths = async () => {
//   const slugs = await getAllRentalSlugs();
//   console.log("Slugs: ", slugs);

//   return {
//     paths: slugs?.map(({ slug }) => `dashboard/rentals/${slug}`) || [],
//     fallback: true,
//   };
// };
