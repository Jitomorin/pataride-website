import React, { useState } from "react";
import Pagination from "./Pagination";
import CarModelCardDashboard from "./CarModelCarDashboard";

const RentalsGrid = (carData: any) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState(carData.carData);
  console.log("car data:", carData);
  return (
    <>
      <div className="grid gap-4 xl:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 p-10 text-center py-12 px-auto mx-auto">
        {data !== null ? (
          <>
            {data.map((car: any) => {
              return <CarModelCardDashboard car={car} />;
            })}
          </>
        ) : (
          <div className="grid gap-4 xl:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 p-10 text-center py-12 px-auto mx-auto">
            <div className="h-full w-full">
              <h1 className="text-2xl font-bold text-black dark:text-white">
                No cars available
              </h1>
            </div>
          </div>
        )}
      </div>
      <Pagination
        itemsPerPage={2}
        data={data}
        onPageChange={(pageNumber: any, currentPageData: any) => {}}
      />
    </>
  );
};

export default RentalsGrid;
