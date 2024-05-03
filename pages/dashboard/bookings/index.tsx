import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import DeliveriesTable from "@/components/BookingsTable";
import React, { useEffect, useState } from "react";
import { useAuthContext } from "@/contexts/AuthContext";
import { getFilteredData } from "@/utils/firebase/firestore";
import BookingsTable from "@/components/BookingsTable";

function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user }: any = useAuthContext();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await getFilteredData("bookings", "userID", "==", user.uid).then(
        (res: any) => {
          // sort deliveries by date in field called delivery_timestamp
          res.sort((a: any, b: any) => {
            return b.createdAt - a.createdAt;
          });
          setBookings(res);
          setLoading(false);
        }
      );
    };
    fetchData();
  }, [user]);

  return (
    <DefaultLayout>
      <div className="mx-auto">
        <Breadcrumb pageName="Bookings" />
        <div className="w-full h-full">
          <BookingsTable Loading={loading} deliveries={bookings} />
        </div>
      </div>
    </DefaultLayout>
  );
}

export default Bookings;
