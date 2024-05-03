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

function Booking(props: any) {
  const { user, loading }: any = useAuthContext();
  const { booking }: any = props;
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

  const refreshPage = () => {
    router.replace(router.asPath);
  };

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.push("/login");
    }
    // check if the other belongs to the user
    const checkOrderUser = async () => {
      if (user.uid !== booking.userID) {
        router.push("/dashboard/bookings");
      }
      setOrderLoading(false);
    };
    checkOrderUser();
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
    if (transaction) {
      return (
        <DefaultLayout>
          <div className="mx-auto">
            <Breadcrumb pageName={booking.uid} index="Orders" />

            <div className="w-full h-screen flex justify-between flex-col md:flex-row">
              {/* <div className="shadow-md rounded-md flex w-full md:w-[49.5%] p-4 h-full bg-white">
                Chat
              </div> */}
              <div className="shadow-md rounded-md flex flex-col w-full p-4 h-auto bg-white">
                <h1 className="font-bold text-3xl py-2">Delivery Details</h1>
                <h1 className="font-bold text-xl py-2">Request made on</h1>
                <p>
                  {/* hsow the date an hour of the booking time */}
                  {`${new Date(
                    booking.delivery_timestamp.seconds * 1000
                  ).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}`}
                </p>
                <h1 className="font-bold text-xl py-2 mt-4">Client</h1>
                <Link
                  className="hover:text-[#F8D521] hover:underline transition    -all ease-in-out"
                  href={`/dashboard/profile/${booking.userID}`}
                >
                  View client profile
                </Link>{" "}
                <h1 className="font-bold text-xl py-2">Dropoff Address</h1>
                <p>
                  {
                    // show the pickup address
                    booking.locations.pickup_address_1
                  }
                </p>
                <p>
                  {
                    // show the pickup address
                    booking.locations.pickup_address_2
                  }
                </p>
                <h1 className="font-bold text-base py-2">Additional notes:</h1>
                <p>
                  {
                    // show the additional notes
                    booking.locations.pickup_notes
                  }
                </p>
                <h1 className="font-bold text-xl py-2 mt-4">Pickup Address</h1>
                <p>
                  {
                    // show the dropoff address
                    booking.locations.dropoff_address_1
                  }
                </p>
                <p>
                  {
                    // show the dropoff address
                    booking.locations.dropoff_address_2
                  }
                </p>
                <h1 className="font-bold text-base py-2">Additional notes:</h1>
                <p>
                  {
                    // show the additional notes
                    booking.locations.dropoff_notes
                  }
                </p>
                <Divider />
                <button className="bg-[#F8D521] text-white mr-auto mt-5 px-4 py-2 rounded-lg text-xl font-semibold hover:scale-105 transition-all ease-in-out">
                  Send dropoff confirmation request
                </button>
                <p className="text-gray-600 font-normal text-sm pt-3">
                  Send a request to confirm the dropoff of the rental
                </p>
                {/* products section */}
                {/* <h1 className="font-bold text-xl py-2">Products</h1> */}
                {
                  // show the total price of the order
                }
                <p className="text-black font-semibold pt-9 text-3xl">
                  Total: {formatNumber(booking.total)} Ksh
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

export default Booking;

export const getServerSideProps: GetServerSideProps<any, Query> = async (
  ctx
) => {
  const { params = {} } = ctx;
  //   console.log("params", params);
  const booking = await getDocument("bookings", params.booking);

  if (!booking) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      booking: JSON.parse(JSON.stringify(booking)),
      //   rentalSlug: rentalSlug,
    },
  };
};
