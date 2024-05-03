import DefaultLayout from "@/components/Layouts/DefaultLayout";
import styled from "styled-components";
import Chart from "@/components/Charts/page";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { GetServerSideProps } from "next";
import { getClient } from "@/sanity/lib/client";
import {
  getAllData,
  getAllSortedData,
  getData,
} from "@/utils/firebase/firestore";
import { Car } from "@/components/CarData";
import CarModelCard from "@/components/CarModelCard";
import CarModelCardDashboard from "@/components/CarModelCarDashboard";
import { useEffect, useState } from "react";
import Dropdown from "@/components/Dropdown";
import RegisterCarModal from "@/components/RegisterCarModal";
import { Router, useRouter } from "next/router";
import Pagination from "@/components/Pagination";
import Loader from "@/components/Loading";
import RentalsGrid from "@/components/RentalsGrid";

export interface RentalProps {
  cars: any[];
}
const filterOptions = ["Make", "Model", "Year", "Price", "Seats", "Fuel"]; // Add more options as needed

function RentalsPage(props: RentalProps) {
  let { cars } = props;
  const router = useRouter();
  const itemsPerPage = 4;
  const indexOfLastItem = 1 * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = cars.slice(indexOfFirstItem, indexOfLastItem);
  const [carData, setCarData] = useState(currentItems);
  const [filteredCars, setFilteredCars] = useState(cars);
  // const [selectedFilter, setSelectedFilter] = useState<string>("");
  const [dataLoading, setDataLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any>({
    name: "All",
    value: "all",
  });

  const [searchValue, setSearchValue] = useState("");
  const [selectedSort, setSelectedSort] = useState<any>({
    name: "Newest",
    value: "newest",
  });
  const [openModal, setOpenModal] = useState(false);

  // const handleFilterSelect = (filter: string) => {
  //   setSelectedFilter(filter);
  //   // Implement your filtering logic here based on the selected filter
  //   // Update the filtered cars state accordingly
  // };

  useEffect(() => {
    // setSelectedSort({ name: "Newest", value: "newest" });
    const sortData = (data: any, selectedSort: any, selectedCategory: any) => {
      let sortedRes = [];
      let filterValue = "";
      if (selectedCategory.value === "all") {
        filterValue = "";
      } else {
        filterValue = selectedCategory.value;
      }

      if (selectedSort.value === "newest") {
        sortedRes = data
          .filter((item: any) =>
            item.category.toLowerCase().includes(filterValue)
          )
          .sort((a: any, b: any) => {
            const dateA = new Date(a.dateAdded.seconds * 1000);
            const dateB = new Date(b.dateAdded.seconds * 1000);
            return dateB.getTime() - dateA.getTime();
          });
        return sortedRes;
      } else if (selectedSort.value === "oldest") {
        sortedRes = data
          .filter((item: any) =>
            item.category.toLowerCase().includes(filterValue)
          )
          .sort((a: any, b: any) => {
            const dateA = new Date(a.dateAdded.seconds * 1000);
            const dateB = new Date(b.dateAdded.seconds * 1000);
            return dateA.getTime() - dateB.getTime();
          });
        return sortedRes;
      } else if (selectedSort.value === "price-low-to-high") {
        sortedRes = data
          .filter((item: any) =>
            item.category.toLowerCase().includes(filterValue)
          )
          .sort((a: any, b: any) => a.price - b.price);
        return sortedRes;
      } else if (selectedSort.value === "price-high-to-low") {
        sortedRes = data
          .filter((item: any) =>
            item.category.toLowerCase().includes(filterValue)
          )
          .sort((a: any, b: any) => b.price - a.price);
        return sortedRes;
      }
    };
    const fetchData = async () => {
      // await getAllSortedData("rentals", selectedSort.value).then((res) => {
      //   setFilteredCars(res);
      // });
      setFilteredCars(sortData(cars, selectedSort, selectedCategory));
      //

      console.log("car data", carData);
      console.log("filtered data", filteredCars);
    };
    fetchData();
    console.log("selected category", selectedCategory);
  }, [selectedSort, selectedCategory]);

  return (
    <DefaultLayout>
      <div className=" mx-auto">
        <Breadcrumb pageName="Rentals" />
        <div className="w-full flex flex-col md:flex-row justify-center">
          <Dropdown
            setSelectedOrder={setSelectedSort}
            setSelectedType={setSelectedCategory}
          />
          <div>
            <div className="mx-auto p-10 w-full flex justify-between">
              <div className="flex space-x-2 w-full">
                <input
                  type="text"
                  className="p-2 w-full  border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  placeholder="Search for name, make, or number plate..."
                  onChange={(e: any) => {
                    setSearchValue(e.target.value.toLowerCase());
                  }}
                />
                <button
                  type="button"
                  className="-m-2 ml-4 p-2 text-[#F8D521] font-bold transition-all ease-in-out hover:scale-105 sm:ml-6 rouded-md"
                  onClick={() => {
                    console.log("caaaaaars", cars);
                    const res = cars.filter(
                      (car) =>
                        car.name.toLowerCase().includes(searchValue) ||
                        car.numberPlate.toLowerCase().includes(searchValue)
                    );
                    // console.log("Filtered Cars: ", res);

                    setCarData(res.slice(indexOfFirstItem, indexOfLastItem));
                  }}
                >
                  Search
                </button>
              </div>
              <button
                type="button"
                className="-m-2 ml-4 p-2 text-[#F8D521] font-bold transition-all ease-in-out hover:scale-105 sm:ml-6 rouded-md"
                onClick={() => router.push("/dashboard/register-rentals")}
              >
                Upload Your Car +
              </button>
            </div>
            <>
              <div className="grid gap-4 xl:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 p-10 text-center py-12 px-auto mx-auto">
                {carData.length > 0 ? (
                  <>
                    {carData.map((car: any) => {
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
                itemsPerPage={itemsPerPage}
                data={filteredCars}
                onPageChange={(pageNumber: any, currentPageData: any) => {
                  setCarData(currentPageData);
                }}
              />
            </>
            {/* <RentalsGrid carData={filteredCars} /> */}
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
}

export default RentalsPage;

export const getServerSideProps: GetServerSideProps<RentalProps> = async (
  ctx
) => {
  const { draftMode = false, params = {} } = ctx;
  // const client = getClient(draftMode ? { token: readToken } : undefined);
  const cars = await getData("rentals");
  // console.log("Server Side Props: ", JSON.parse(JSON.stringify(cars)));

  if (!cars) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      cars: JSON.parse(JSON.stringify(cars)),
      draftMode,
      // token: draftMode ? readToken : "",
    },
  };
};
