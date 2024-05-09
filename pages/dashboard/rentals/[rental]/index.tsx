import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import CartColumn from "@/components/CartColumn";
import Divider from "@/components/Divider";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import ProductOverview from "@/components/ProductOverview";
import Snackbar from "@/components/Snackbar";
import Spinner from "@/components/Spinner";
import { useAuthContext } from "@/contexts/AuthContext";
import {
  getAllRentalSlugs,
  getDocument,
  getFilteredData,
  getMultipleFilteredData,
} from "@/utils/firebase/firestore";
import { uploadCoverImage } from "@/utils/firebase/storage";
import { dateToObject, timestampToISOString } from "@/utils/formatDate";
import { formatNumber } from "@/utils/formatNumber";
import {
  DateFormatter,
  parseAbsolute,
  parseAbsoluteToLocal,
  parseZonedDateTime,
} from "@internationalized/date";
import { GetServerSideProps } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

interface Query {
  [key: string]: string;
}

function Rental(props: any) {
  const { user, loading }: any = useAuthContext();
  const { rental, bookings }: any = props;
  const router = useRouter();
  const [snackbarMessage, setSnackbarMessage] = useState("Default Message");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(true);
  const [cart, setCart] = useState<any>({});
  const disabledDates = bookings.map((booking: any) => {
    return [
      parseAbsoluteToLocal(
        timestampToISOString(
          bookings[0].selectedDates[0].startDate.seconds * 1000
        )
      ),
      parseAbsoluteToLocal(
        timestampToISOString(
          bookings[0].selectedDates[0].endDate.seconds * 1000
        )
      ),
    ];
  });
  console.log("okok", disabledDates);
  const wueh = parseAbsoluteToLocal(
    timestampToISOString(bookings[0].selectedDates[0].startDate.seconds * 1000)
  );
  console.log("daaaaates1", wueh);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.push("/login");
    }
    // const temp=DateFormatter
    const fetchCartData = async () => {
      await getDocument("carts", user?.uid).then((res) => {
        if (res) {
          setCart(res);
          // console.log("Cart: ", res);
        }
      });
    };

    // fetchCartData();
  }, [user]);

  if (loading) {
    return <div className="m-auto w-full h-full text-4xl">Loading...</div>;
  }
  return (
    <DefaultLayout>
      <div className="mx-auto">
        <Breadcrumb pageName={rental.name} index="Rentals" />
        <ProductOverview
          disabledDates={disabledDates}
          callSnackBar={(message: any) => {
            setSnackbarMessage(message);
            setSnackbarOpen(true);
          }}
          rental={rental}
          user={user}
        />
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

export default Rental;

export const getServerSideProps: GetServerSideProps<any, Query> = async (
  ctx
) => {
  const { params = {} } = ctx;
  //   console.log("params", params);
  const rental = await getDocument("rentals", params.rental);
  const bookings = await getMultipleFilteredData("bookings", [
    { field: "transaction.paid", operator: "==", value: true },
    { field: "rental.uid", operator: "==", value: rental.uid },
  ]);
  console.log("bookings", bookings);
  const rentalSlug = params.user as string;

  if (!rental) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      rental: JSON.parse(JSON.stringify(rental)),
      bookings: JSON.parse(JSON.stringify(bookings)),
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
