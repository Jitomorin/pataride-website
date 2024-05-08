import { addDays } from "date-fns";
import { useState } from "react";
import { StarIcon } from "@heroicons/react/20/solid";
import { RadioGroup } from "@headlessui/react";
import { Swiper, SwiperSlide } from "swiper/react";
import { v4 as uuidv4 } from "uuid";
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file
import {
  BuildingOffice2Icon,
  CurrencyDollarIcon,
  GlobeAmericasIcon,
  ShoppingCartIcon,
} from "@heroicons/react/24/outline";
// import { DateRangePicker } from "react-date-range";
import { formatNumber } from "@/utils/formatNumber";
import styled from "styled-components";
import {
  addData,
  addDataWithDocName,
  addProductToCart,
  checkIfChatExists,
  getDocument,
} from "@/utils/firebase/firestore";
import { useRouter } from "next/router";
import { Navigation, Pagination } from "swiper/modules";
import ThumbSwiper from "./ThumbSwiper";
import Reviews from "./Reviews";
import { DateRangePicker } from "@nextui-org/react";
import { createDateFromObject } from "@/utils/formatDate";
import CustomDateRangePicker from "./CustomDateRangePicker";
// import Datepicker from "react-tailwindcss-datepicker";

const product = {
  name: "Basic Tee",
  price: "$35",
  rating: 3.9,
  reviewCount: 512,
  href: "#",
  breadcrumbs: [
    { id: 1, name: "Women", href: "#" },
    { id: 2, name: "Clothing", href: "#" },
  ],
  images: [
    {
      id: 1,
      imageSrc:
        "https://tailwindui.com/img/ecommerce-images/product-page-01-featured-product-shot.jpg",
      imageAlt: "Back of women's Basic Tee in black.",
      primary: true,
    },
    {
      id: 2,
      imageSrc:
        "https://tailwindui.com/img/ecommerce-images/product-page-01-product-shot-01.jpg",
      imageAlt: "Side profile of women's Basic Tee in black.",
      primary: false,
    },
    {
      id: 3,
      imageSrc:
        "https://tailwindui.com/img/ecommerce-images/product-page-01-product-shot-02.jpg",
      imageAlt: "Front of women's Basic Tee in black.",
      primary: false,
    },
  ],
  colors: [
    { name: "Black", bgColor: "bg-gray-900", selectedColor: "ring-gray-900" },
    {
      name: "Heather Grey",
      bgColor: "bg-gray-400",
      selectedColor: "ring-gray-400",
    },
  ],
  sizes: [
    { name: "XXS", inStock: true },
    { name: "XS", inStock: true },
    { name: "S", inStock: true },
    { name: "M", inStock: true },
    { name: "L", inStock: true },
    { name: "XL", inStock: false },
  ],
  description: `
    <p>The Basic tee is an honest new take on a classic. The tee uses super soft, pre-shrunk cotton for true comfort and a dependable fit. They are hand cut and sewn locally, with a special dye technique that gives each tee it's own look.</p>
    <p>Looking to stock your closet? The Basic tee also comes in a 3-pack or 5-pack at a bundle discount.</p>
  `,
  details: [
    "Only the best materials",
    "Ethically and locally made",
    "Pre-washed and pre-shrunk",
    "Machine wash cold with similar colors",
  ],
};
const policies = [
  {
    name: "Checkout",
    icon: ShoppingCartIcon,
    description: "Take all items in the cart to the checkout",
  },
  {
    name: "Pay",
    icon: CurrencyDollarIcon,
    description: "Enter your payment details in order to pay",
  },
  {
    name: "Select pickup option",
    icon: BuildingOffice2Icon,
    description: "Choose the pickup option that suits you best",
  },
];
const LeftSide = styled.div`
  .rdrDefinedRangesWrapper {
    display: none;
  }
`;

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

export default function ProductOverview({ rental, user, callSnackBar }: any) {
  const [host, setHost]: any = useState({});
  const [selectedSize, setSelectedSize] = useState(product.sizes[2]);
  const [dateValue, setDateValue] = useState({
    startDate: new Date(),
    endDate: new Date().setMonth(11),
  });
  const router = useRouter();
  const [selectedDate, setSelectedDate]: any = useState({
    startDate: new Date(),
    endDate: new Date(),
    key: "selection",
  });
  getDocument("users", rental.userID).then((res: any) => {
    setHost(res);
  });

  const createChat = async () => {
    // if chat with this user exists then navigate to it if not then create it and then navigate to it
    checkIfChatExists(host?.uid, user.uid).then((result: any) => {
      // console.log("resuuulr", result);
      if (result.length !== 0) {
        router.push(`/dashboard/chats/${result[0].uid}`);
      } else {
        const uid = uuidv4();
        addDataWithDocName("chats", uid, {
          chat: [],
          createdAt: new Date(),
          updatedLast: new Date(),
          userID: user.uid,
          users: [user.uid, host?.uid],
          uid,
        }).then(() => {
          router.push(`/dashboard/chats/${uid}`);
        });
      }
    });
  };

  const getNumberOfDays = () => {
    // console.log("selected date", selectedDate[0].startDate);
    const startDate = new Date(selectedDate.startDate);
    const endDate = new Date(selectedDate.endDate);

    const diffInTime = endDate.getTime() - startDate.getTime();
    const diffInDays = Math.ceil(diffInTime / (1000 * 60 * 60 * 24));
    return diffInDays;
  };
  const calculateTotalPrice = (price: number) => {
    const diffInDays = getNumberOfDays();
    return diffInDays * price;
  };

  return (
    <div className="bg-white">
      <div className="pb-16 pt-6 sm:pb-24">
        <div className="mx-auto mt-8 max-w-full px-4 sm:px-6 lg:max-w-full lg:px-8">
          <div className="flex flex-col w-full">
            <div className="lg:col-span-5 ">
              <div className="flex justify-between flex-col  w-auto">
                <h1 className="text-3xl font-bold text-gray-900">
                  {rental.name}
                </h1>
                <p className="text-xl font-medium text-gray-900">
                  {`${formatNumber(rental.price)}Ksh/day`}
                </p>
                {rental.availability.toString() === "true" ? (
                  <div className="mr-auto my-8 inline-flex items-center rounded-md bg-green-100 px-2 py-1 text-xl font-semibold text-green-700 ring-1 ring-inset ring-green-600/20">
                    Available
                  </div>
                ) : (
                  <div className="mr-auto my-8 inline-flex items-center rounded-md bg-red-100 px-2 py-1 text-xl font-semibold text-red-700 ring-1 ring-inset ring-green-600/20">
                    Not Available
                  </div>
                )}
                <ThumbSwiper images={rental.image} />
                {/* mobile slider */}
                <div className="flex md:hidden">
                  <Swiper
                    className="w-[30rem] z-0 md:w-full"
                    style={{
                      "--swiper": "z-index: 0",
                      "--swiper-pagination-color": "#FFBA08",
                      "--swiper-pagination-bullet-inactive-color": "#b1b1b1",
                      "--swiper-pagination-bullet-inactive-opacity": "1",
                      // "--swiper-pagination-bullet": "&hover{cursor:pointer} ",
                      "--swiper-pagination-bullet-size": "8px",
                      "--swiper-pagination-bullet-horizontal-gap": "6px",
                      "--swiper-navigation-color": "#FFBA08",
                      "--swiper-navigation": "hidden",
                      "--swiper-navigation": "z-index: 1000",
                      "--swiper-navigation": "&hover{display:block} ",
                    }}
                    modules={[Pagination]}
                    spaceBetween={200}
                    slidesPerView={1}
                    centeredSlides
                    pagination={{
                      clickable: true,
                    }}
                    navigation={false}
                    scrollbar={{ draggable: true }}
                    loop={true}
                  >
                    {rental.image.map((image: any, index: number) => (
                      <SwiperSlide key={index}>
                        <img
                          key={index}
                          src={image}
                          alt={"Rental Image"}
                          className={classNames("rounded-lg h-full")}
                        />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>
                <div className="mt-10">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Description
                  </h2>

                  <div
                    className="prose prose-sm mt-4 text-gray-500"
                    dangerouslySetInnerHTML={{ __html: rental.description }}
                  />
                  <div className="mt-10">
                    <dt className="font-medium text-xl text-gray-900">
                      Host Information
                    </dt>
                    <dd className="mt-3 space-y-3 text-gray-500">
                      <div
                        className="flex space-x-2 cursor-pointer w-auto p-2  transition-all ease-in-out rounded-lg"
                        onClick={() => {
                          router.push(`/dashboard/profile/${host?.uid}`);
                        }}
                      >
                        <div className="w-14 h-14 rounded-full  overflow-hidden">
                          <img
                            className=" object-cover"
                            src={
                              host?.profileUrl === ""
                                ? "/images/profile.png"
                                : host?.profileUrl
                            }
                            alt="avatar"
                          />
                        </div>
                        <div className="flex justify-center flex-col">
                          <p className="font-semibold">{host?.fullName}</p>
                          <p>{host?.email}</p>
                        </div>
                      </div>

                      <div className="flex space-x-4">
                        <button
                          onClick={createChat}
                          type="button"
                          className="bg-primary rounded-lg font-semibold hover:scale-[1.03] transition-all ease-in-out text-white p-2"
                        >
                          Message Host
                        </button>
                      </div>
                    </dd>
                  </div>
                </div>

                <div className="mt-8 border-t border-gray-200 pt-8">
                  <h2 className="text-2xl font-bold text-gray-900">Details</h2>

                  <div className="prose prose-sm mt-4 text-gray-500">
                    <ul role="list">
                      <li>
                        <span className="font-bold">Make:</span>
                        {` ${rental.make}`}
                      </li>
                      <li>
                        <span className="font-bold">Model:</span>
                        {` ${rental.model}`}
                      </li>
                      <li>
                        <span className="font-bold">Number plate:</span>
                        {` ${rental.numberPlate}`}
                      </li>
                      <li>
                        <span className="font-bold">Seats:</span>
                        {` ${rental.seats}`}
                      </li>
                      <li>
                        <span className="font-bold">Year:</span>
                        {` ${rental.year}`}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              {/* Reviews */}
              {/* <div className="mt-4">
                <h2 className="sr-only">Reviews</h2>
                <div className="flex items-center">
                  <p className="text-sm text-gray-700">
                    {product.rating}
                    <span className="sr-only"> out of 5 stars</span>
                  </p>
                  <div className="ml-1 flex items-center">
                    {[0, 1, 2, 3, 4].map((rating) => (
                      <StarIcon
                        key={rating}
                        className={classNames(
                          product.rating > rating
                            ? "text-yellow-400"
                            : "text-gray-200",
                          "h-5 w-5 flex-shrink-0"
                        )}
                        aria-hidden="true"
                      />
                    ))}
                  </div>
                  <div
                    aria-hidden="true"
                    className="ml-4 text-sm text-gray-300"
                  >
                    ·
                  </div>
                  <div className="ml-4 flex">
                    <a
                      href="#"
                      className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                    >
                      See all {product.reviewCount} reviews
                    </a>
                  </div>
                </div>
              </div> */}
            </div>

            {/* Image gallery */}
            {/* <div className="mt-8 lg:col-span-6 lg:col-start-1 lg:row-span-3 lg:row-start-1 lg:mt-0">
            

              <div className="hidden lg:grid grid-cols-1 lg:grid-cols-2 lg:grid-rows-3 lg:gap-8">
                {rental.image.map((image: any, index: number) => (
                  <img
                    key={index}
                    src={image}
                    alt={"Rental Image"}
                    className={classNames(
                      index === 0
                        ? "lg:col-span-2 lg:row-span-2"
                        : "hidden lg:block",
                      "rounded-lg"
                    )}
                  />
                ))}
              </div>
            </div> */}

            <LeftSide className=" mt-8 col-span-5 lg:col-span-5">
              <div className="w-auto overflow-x-scroll lg:overflow-x-auto">
                {/* Date picker */}
                <div className="flex justify-between w-full">
                  <span className="text-2xl font-bold text-left">
                    Select date range
                  </span>
                </div>
                {/* <DateRangePicker
                  label="Date range"
                  onChange={(item: any) => {
                    console.log(
                      "date pickereeeeeeeeeeeeeeeeeeeeee",
                      createDateFromObject(item)
                    );
                  }}
                  isRequired={true}
                  className="max-w-sm"
                /> */}
                <CustomDateRangePicker
                  onChangeFunction={(start: any, end: any) => {
                    setSelectedDate({
                      startDate: start,
                      endDate: end,
                    });
                  }}
                />
                {/* <DateRangePicker
                  val
                  onChange={(item: any) => {
                    setSelectedDate([item.selection]);
                    console.log(item);
                  }}
                  showSelectionPreview={false}
                  moveRangeOnFirstSelection={false}
                  months={1}
                  showDateDisplay={true} // Hide the display of selected dates
                  showMonthAndYearPickers={false}
                  ranges={selectedDate}
                  direction="vertical"
                  minDate={new Date()}
                  rangeColors={["#F8D521"]}
                  showPreview={false}
                  preview
                  retainEndDateOnFirstSelection={false}
                /> */}
              </div>

              <div>
                {/* display to see the amount of days and the total price */}
                {/* const diffInDays = Math.ceil(diffInTime / (1000 * 60 * 60 * 24));
                 */}
                <p className="text-2xl font-bold text-gray-700 mt-4">
                  {`${
                    selectedDate.startDate
                      ? ` ${getNumberOfDays()} days`
                      : "Select dates"
                  }`}
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-4">
                  {`Total: ${formatNumber(
                    calculateTotalPrice(rental.price)
                  )}Ksh`}
                </p>
              </div>

              {/* Product details */}

              {/* Policies */}
              <section aria-labelledby="policies-heading" className="mt-10">
                {getNumberOfDays() > 0 ? (
                  <>
                    {rental.availability.toString() === "true" ? (
                      <button
                        onClick={async () => {
                          const uid = uuidv4();
                          await addDataWithDocName("bookings", uid, {
                            rental: rental,
                            selectedDates: selectedDate,
                            userID: user?.uid,
                            uid,
                            createdAt: new Date(),
                            status: "pending",
                          }).then((res: any) => {
                            callSnackBar(
                              "Booking made, redirecting to checkout..."
                            );
                            router.push(`/dashboard/bookings/${uid}/checkout`);
                          });

                          // await addProductToCart(
                          //   { item: rental, selectedDates: selectedDate },
                          //   user?.uid
                          // ).then((res) => {
                          //   callSnackBar(res!.message);
                          //   router.push("/dashboard/rentals");
                          // });
                        }}
                        type="submit"
                        className="mt-8 flex  ml-0 items-center justify-center rounded-md border border-transparent bg-[#F8D521] px-8 py-3 text-xl font-bold text-white hover:scale-105 transition-all ease-in-out focus:outline-none focus:ring-2 focus:ring-transparent focus:ring-offset-0"
                      >
                        Book now
                      </button>
                    ) : (
                      <button
                        disabled
                        className=" inline-flex ml-0 items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-xl font-bold text-white bg-gray-400 cursor-not-allowed"
                      >
                        Book now
                      </button>
                    )}
                  </>
                ) : (
                  <button
                    disabled
                    className="ml-0 inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-gray-400 cursor-not-allowed"
                  >
                    Book now
                  </button>
                )}
                <div className="mt-5">
                  <Reviews reviews={rental?.reviews} />
                </div>
                <h2
                  id="policies-heading"
                  className="my-8 text-xl font-semibold"
                >
                  Whats next?
                </h2>

                <dl className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                  {policies.map((policy, index) => (
                    <div
                      key={policy.name}
                      className="rounded-lg border border-gray-200 bg-gray-50 p-6 text-center"
                    >
                      <span className="mt-4 text-xl font-medium text-gray-900">
                        {index + 1}
                      </span>
                      <dt>
                        <policy.icon
                          className="mx-auto h-6 w-6 flex-shrink-0 text-gray-400"
                          aria-hidden="true"
                        />

                        <span className="mt-4 text-sm font-medium text-gray-900">
                          {policy.name}
                        </span>
                      </dt>
                      <dd className="mt-1 text-sm text-gray-500">
                        {policy.description}
                      </dd>
                    </div>
                  ))}
                </dl>
              </section>
            </LeftSide>
            <div className="col-span-12 mt-10 justify-center items-center"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
