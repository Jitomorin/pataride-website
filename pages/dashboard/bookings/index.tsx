import DefaultLayout from "@/components/Layouts/DefaultLayout";
import TableThree from "@/components/Tables/TableThree";
import React from "react";

function Bookings() {
  return (
    <DefaultLayout>
      <div className="mx-auto">
        <TableThree />
      </div>
    </DefaultLayout>
  );
}

export default Bookings;
