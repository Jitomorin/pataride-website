import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import OrdersTable from "@/components/OrdersTable";
import TableThree from "@/components/Tables/TableThree";
import { useAuthContext } from "@/contexts/AuthContext";
import { getFilteredData } from "@/utils/firebase/firestore";
import React, { useEffect, useState } from "react";

export interface OrdersProps {
  orders: any[];
}

function Orders(props: OrdersProps) {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState(orders);
  const [orderLoading, setOrderLoading] = useState(true);
  const { user, loading }: any = useAuthContext();

  useEffect(() => {
    const fetchData = async () => {
      setOrderLoading(true);
      await getFilteredData("orders", "user", "==", user.uid).then(
        (res: any) => {
          // sort orders by date in field called bookint_timestamp
          res.sort((a: any, b: any) => {
            return b.booking_timestamp - a.booking_timestamp;
          });
          setOrders(res);
          setFilteredOrders(res);
          setOrderLoading(false);
        }
      );
    };
    fetchData();
  }, []);
  return (
    <DefaultLayout>
      <div className="mx-auto">
        <Breadcrumb pageName="Orders" />
        <div className="w-full h-full">
          <OrdersTable loading={orderLoading} orders={orders} />
        </div>
      </div>
    </DefaultLayout>
  );
}

export default Orders;
