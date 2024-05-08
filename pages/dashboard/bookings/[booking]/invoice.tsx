import { StatusPill } from "@/components/StatusPill";
import { useAuthContext } from "@/contexts/AuthContext";
import { getDocument } from "@/utils/firebase/firestore";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { FC, useEffect, useState } from "react";

interface Query {
  [key: string]: string;
}

const InvoicePage: FC = (props: any) => {
  const { booking }: any = props;
  const [host, setHost]: any = useState({});
  const { user, loading }: any = useAuthContext();
  const [orderLoading, setOrderLoading] = useState(true);
  const [client, setClient]: any = useState({});
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.push("/login");
    }
    // check if the other belongs to the user
    const checkOrderUser = async () => {
      if (user.uid !== booking.userID) {
        router.push("/dashboard/bookings/all-bookings");
      }
      setOrderLoading(false);
    };
    const fetchUserData = async () => {
      await getDocument("users", booking.userID).then((clientRes: any) => {
        setClient(clientRes);
        console.log("client", clientRes);
        getDocument("users", booking.rental.userID).then((hostRes: any) => {
          setHost(hostRes);
          console.log("host", hostRes);
        });
      });
    };

    checkOrderUser().then(() => {
      fetchUserData();
    });
  }, [user]);

  return (
    <div className="container mx-auto py-8">
      <div className="bg-white shadow-md rounded px-8 py-6">
        {/* Invoice Header */}
        <div className="flex justify-between mb-4">
          <div className="font-bold text-xl">Invoice</div>
          <div>
            Invoice Date:{" "}
            {new Date(booking.createdAt.seconds * 1000).toLocaleDateString(
              undefined,
              {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              }
            )}
          </div>
        </div>

        {/* Customer Information */}
        <div className="mb-4">
          <div className="font-semibold">Customer Information:</div>
          <div>{booking.fullName}</div>
          <div>{booking.email}</div>
          <div>{booking.phoneNumber}</div>
          <div>{booking.address_1}</div>
          <div>{booking.address_2}</div>
          <div>{booking.zipCode}</div>
        </div>

        {/* Rental Information */}
        <div className="mb-4">
          <div className="font-semibold">Rental Details:</div>
          <div>{booking.rental.name}</div>
          {/* Add more rental details as needed */}
        </div>

        {/* Transaction Information */}
        <div className="mb-4">
          <div className="font-semibold">Transaction Details:</div>
          <div>Amount: {booking.transaction.amount}</div>
          {/* Add more transaction details as needed */}
        </div>

        {/* Additional Notes */}
        <div className="mb-4">
          <div className="font-semibold">Additional Notes:</div>
          <div>{booking.additionalNotes}</div>
        </div>

        {/* Payment Information */}
        <div className="mb-4">
          <div className="font-semibold">Payment URL:</div>
          <a
            href={booking.paymentURL}
            className="text-blue-500 hover:underline"
          >
            {booking.paymentURL}
          </a>
        </div>

        {/* Status Badge */}
        <div>
          <StatusPill status={booking.status} />
        </div>
      </div>
    </div>
  );
};

export default InvoicePage;

export const getServerSideProps: GetServerSideProps<any, Query> = async (
  ctx
) => {
  const { params = {} } = ctx;
  //   console.log("params", params);
  const booking = await getDocument("bookings", params.booking);
  const rentalSlug = params.user as string;

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
