import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import OrdersTable from "@/components/OrdersTable";
import TableThree from "@/components/Tables/TableThree";
import { useAuthContext } from "@/contexts/AuthContext";
import { getFilteredData } from "@/utils/firebase/firestore";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

export interface OrdersProps {
  orders: any[];
}

function Orders(props: OrdersProps) {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState(orders);
  const [orderLoading, setOrderLoading] = useState(true);
  const { user, loading }: any = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    router.push("/dashboard/orders/all-orders");
  }, []);
  return (
    <DefaultLayout>
      <div className="mx-auto">
        <Breadcrumb pageName="Orders" />
        <div className="w-full h-full">
          {/* <OrdersTable loading={orderLoading} orders={orders} /> */}
        </div>
      </div>
    </DefaultLayout>
  );
}

export default Orders;
