import { Fragment, useState } from "react";
import { Dialog, Menu, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { EllipsisVerticalIcon } from "@heroicons/react/20/solid";
import { set } from "sanity";
import {
  deleteDocument,
  updateRentalInformation,
  updateUserEmailAndPhone,
  updateUserRole,
  verifyRental,
  verifyUser,
} from "@/utils/firebase/firestore";
import ImageSliderComponent from "./ImageSliderComponent";
import { formatNumber } from "@/utils/formatNumber";
import { useRouter } from "next/router";

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}

export default function RentalColumn({
  rental,
  open,
  setOpen,
  callSnackBar,
}: {
  rental: any;
  open: boolean;
  setOpen: any;
  callSnackBar: any;
}) {
  //   const [open, setOpen] = useState(true);
  const [make, setMake] = useState(rental.make);
  const [model, setModel] = useState(rental.model);
  const [name, setName] = useState(rental.name);
  const [year, setYear] = useState(rental.year);
  const [seats, setSeats] = useState(rental.seats);
  const [addressLine1, setAddressLine1] = useState(
    rental.location.addressLine1
  );
  const [addressLine2, setAddressLine2] = useState(
    rental.location.addressLine2
  );
  const [numberPlate, setNumberPlate] = useState(rental.numberPlate);
  const [description, setDescription] = useState(rental.description);
  const router = useRouter();

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setOpen}>
        <div className="fixed inset-0" />

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                    <div className="px-4 py-6 sm:px-6">
                      <div className="flex items-start justify-between">
                        <h2
                          id="slide-over-heading"
                          className="text-base font-semibold leading-6 text-gray-900"
                        >
                          View Rental
                        </h2>
                        <div className="ml-3 flex h-7 items-center">
                          <button
                            type="button"
                            className="relative rounded-md bg-white text-gray-400 hover:text-gray-500 focus:ring-2 focus:ring-indigo-500"
                            onClick={() => setOpen(false)}
                          >
                            <span className="absolute -inset-2.5" />
                            <span className="sr-only">Close panel</span>
                            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </div>
                    {/* Main */}
                    <div>
                      <div className="pb-1 sm:pb-6">
                        <div>
                          <div className="relative h-40 sm:h-56">
                            <img
                              src={rental!.image[0] ? rental!.image[0] : ""}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="mt-6 px-4 sm:mt-8 sm:flex sm:items-end sm:px-6">
                            <div className="sm:flex-1">
                              <div>
                                <div className="flex space-x-2 items-center">
                                  <h3 className="text-xl font-bold text-gray-900 sm:text-2xl">
                                    {rental!.name}
                                  </h3>
                                </div>
                                <div className="mt-1 flex items-center">
                                  <p className="text-sm font-medium text-gray-900">
                                    {`${formatNumber(rental!.price)}Ksh`}
                                  </p>
                                  <p className="text-sm text-gray-500">/day</p>
                                </div>
                                <p className="text-sm text-gray-500">
                                  {rental!.uid}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {rental!.numberPlate}
                                </p>
                              </div>
                              <div className="mt-5 flex flex-wrap space-y-3 sm:space-x-3 sm:space-y-0">
                                {!rental!.isApproved ? (
                                  <button
                                    onClick={async () => {
                                      await verifyRental(
                                        rental!.uid,
                                        true
                                      ).then((res: any) => {
                                        callSnackBar("Rental approved");
                                      });
                                    }}
                                    type="button"
                                    className="inline-flex w-full flex-shrink-0 items-center justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:scale-105 transition-all ease-in-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:flex-1"
                                  >
                                    Approve Rental
                                  </button>
                                ) : (
                                  <button
                                    onClick={async () => {
                                      await verifyRental(
                                        rental!.uid,
                                        false
                                      ).then((res: any) => {
                                        callSnackBar("Rental approval removed");
                                      });
                                    }}
                                    type="button"
                                    className="inline-flex w-full flex-shrink-0 items-center justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:flex-1"
                                  >
                                    Remove Rental Approval
                                  </button>
                                )}

                                {rental!.availability ? (
                                  <></>
                                ) : (
                                  <button
                                    onClick={async () => {}}
                                    type="button"
                                    className="inline-flex w-full flex-1 items-center justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                                  >
                                    Change Role
                                  </button>
                                )}
                                <div className="ml-3 inline-flex sm:ml-0">
                                  <Menu
                                    as="div"
                                    className="relative inline-block text-left"
                                  >
                                    <Menu.Button className="relative inline-flex items-center rounded-md bg-white p-2 text-gray-400 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                                      <span className="absolute -inset-1" />
                                      <span className="sr-only">
                                        Open options menu
                                      </span>
                                      <EllipsisVerticalIcon
                                        className="h-5 w-5"
                                        aria-hidden="true"
                                      />
                                    </Menu.Button>
                                    <Transition
                                      as={Fragment}
                                      enter="transition ease-out duration-100"
                                      enterFrom="transform opacity-0 scale-95"
                                      enterTo="transform opacity-100 scale-100"
                                      leave="transition ease-in duration-75"
                                      leaveFrom="transform opacity-100 scale-100"
                                      leaveTo="transform opacity-0 scale-95"
                                    >
                                      <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                        <div className="py-1">
                                          <Menu.Item>
                                            {({ active }) => (
                                              <a
                                                href={`/dashboard/rentals/${
                                                  rental!.uid
                                                }`}
                                                className={classNames(
                                                  active
                                                    ? "bg-gray-100 text-gray-900"
                                                    : "text-gray-700",
                                                  "block px-4 py-2 text-sm"
                                                )}
                                              >
                                                View rental
                                              </a>
                                            )}
                                          </Menu.Item>
                                          {/* <Menu.Item>
                                            {({ active }) => (
                                              <button
                                                className={classNames(
                                                  active
                                                    ? "bg-gray-100 text-gray-900"
                                                    : "text-gray-700",
                                                  "block px-4 py-2 text-sm w-full text-left"
                                                )}
                                              >
                                                Copy profile link
                                              </button>
                                            )}
                                          </Menu.Item> */}
                                          <Menu.Item>
                                            {({ active }) => (
                                              <button
                                                onClick={async () => {
                                                  await deleteDocument(
                                                    "rentals",
                                                    rental!.uid
                                                  ).then((res) => {
                                                    callSnackBar(
                                                      "Rental deleted"
                                                    );
                                                  });
                                                }}
                                                className={classNames(
                                                  active
                                                    ? "bg-gray-100 text-red-900"
                                                    : "text-red-700",
                                                  "block px-4 py-2 text-sm w-full text-left"
                                                )}
                                              >
                                                Delete rental
                                              </button>
                                            )}
                                          </Menu.Item>
                                        </div>
                                      </Menu.Items>
                                    </Transition>
                                  </Menu>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="px-4 pb-5 pt-5 sm:px-0 sm:pt-0">
                        <dl className="space-y-8 px-4 sm:space-y-6 sm:px-6">
                          <div className="flex flex-col mt-1 text-sm text-gray-900 sm:col-span-2">
                            <dt className="text-xl font-bold text-black sm:w-40 sm:flex-shrink-0">
                              Description:
                            </dt>
                            <dd className="flex flex-col mt-1 text-sm text-gray-900 sm:col-span-2">
                              <textarea
                                value={description}
                                className="p-2 w-2/3  border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-transparent focus:border-gray-300"
                                onChange={(e) => {
                                  setDescription(e.target.value);
                                }}
                              ></textarea>
                            </dd>
                          </div>
                          <div>
                            <dt className="text-xl font-bold text-black sm:w-40 sm:flex-shrink-0">
                              Details:
                            </dt>
                            <dd className="flex flex-col mt-1 text-sm text-gray-900 sm:col-span-2">
                              <p className="text-gray-500 font-semibold">
                                Name:{" "}
                              </p>
                              <input
                                type="text"
                                className="p-2 w-2/3  border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-transparent focus:border-gray-300"
                                // placeholder={user?.phoneNumber}
                                value={name}
                                onChange={(e) => {
                                  //   user?.phone = e.target.value;
                                  setName(e.target.value);
                                }}
                              />
                            </dd>
                            <dd className="flex flex-col mt-1 text-sm text-gray-900 sm:col-span-2">
                              <p className="text-gray-500 font-semibold">
                                Make:{" "}
                              </p>
                              <input
                                type="text"
                                className="p-2 w-2/3  border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-transparent focus:border-gray-300"
                                // placeholder={user?.phoneNumber}
                                value={make}
                                onChange={(e) => {
                                  //   user?.phone = e.target.value;
                                  setMake(e.target.value);
                                }}
                              />
                            </dd>
                            <dd className="flex flex-col mt-1 text-sm text-gray-900 sm:col-span-2">
                              <p className="text-gray-500 font-semibold">
                                Model:{" "}
                              </p>
                              <input
                                type="text"
                                className="p-2 w-2/3  border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-transparent focus:border-gray-300"
                                // placeholder={user?.phoneNumber}
                                value={model}
                                onChange={(e) => {
                                  //   user?.phone = e.target.value;
                                  setModel(e.target.value);
                                }}
                              />
                            </dd>
                            <dd className="flex flex-col mt-1 text-sm text-gray-900 sm:col-span-2">
                              <p className="text-gray-500 font-semibold">
                                Year:{" "}
                              </p>
                              <input
                                type="text"
                                className="p-2 w-2/3  border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-transparent focus:border-gray-300"
                                // placeholder={user?.phoneNumber}
                                value={year}
                                onChange={(e: any) => {
                                  //   user?.phone = e.target.value;
                                  if (!isNaN(e.target.value)) {
                                    setYear(e.target.value);
                                  }
                                }}
                              />
                            </dd>
                            <dd className="flex flex-col mt-1 text-sm text-gray-900 sm:col-span-2">
                              <p className="text-gray-500 font-semibold">
                                Seats:{" "}
                              </p>
                              <input
                                type="text"
                                className="p-2 w-2/3  border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-transparent focus:border-gray-300"
                                // placeholder={user?.phoneNumber}
                                value={seats}
                                onChange={(e: any) => {
                                  //   user?.phone = e.target.value;
                                  if (!isNaN(e.target.value)) {
                                    setSeats(e.target.value);
                                  }
                                }}
                              />{" "}
                            </dd>
                            <dd className="flex flex-col mt-1 text-sm text-gray-900 sm:col-span-2">
                              <p className="text-gray-500 font-semibold">
                                Number Plate:{" "}
                              </p>
                              <input
                                type="text"
                                className="p-2 w-2/3  border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-transparent focus:border-gray-300"
                                // placeholder={user?.email}
                                value={numberPlate}
                                onChange={(e) => {
                                  //   user?.phone = e.target.value;
                                  setNumberPlate(e.target.value);
                                }}
                              />{" "}
                            </dd>
                            <dd className="flex flex-col mt-1 text-sm text-gray-900 sm:col-span-2">
                              <p className="text-gray-500 font-semibold">
                                Address Line 1:{" "}
                              </p>
                              <input
                                type="text"
                                className="p-2 w-2/3  border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-transparent focus:border-gray-300"
                                // placeholder={user?.email}
                                value={addressLine1}
                                onChange={(e) => {
                                  //   user?.phone = e.target.value;
                                  setAddressLine1(e.target.value);
                                }}
                              />{" "}
                            </dd>
                            <dd className="flex flex-col mt-1 text-sm text-gray-900 sm:col-span-2">
                              <p className="text-gray-500 font-semibold">
                                Address Line 2:{" "}
                              </p>
                              <input
                                type="text"
                                className="p-2 w-2/3  border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-transparent focus:border-gray-300"
                                // placeholder={user?.email}
                                value={addressLine2}
                                onChange={(e) => {
                                  //   user?.phone = e.target.value;
                                  setAddressLine2(e.target.value);
                                }}
                              />{" "}
                            </dd>
                          </div>
                          <div>
                            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2">
                              <button
                                onClick={async () => {
                                  await updateRentalInformation(rental.uid, {
                                    description,
                                    make,
                                    model,
                                    numberPlate,
                                    name,
                                    seats,
                                    year,
                                    location: { addressLine1, addressLine2 },
                                  }).then((res) => {
                                    callSnackBar(res.message);
                                    router.reload();
                                  });
                                }}
                                type="button"
                                className="inline-flex w-full flex-shrink-0 items-center justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:flex-1"
                              >
                                Save
                              </button>
                            </dd>
                          </div>

                          {/* <div>
                            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2">
                              {rental!.isApprove ? (
                                <button
                                  onClick={async () => {}}
                                  type="button"
                                  className="inline-flex w-full flex-shrink-0 items-center justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:flex-1"
                                >
                                  Unverify
                                </button>
                              ) : (
                                <button
                                  onClick={async () => {}}
                                  type="button"
                                  className="inline-flex w-full flex-shrink-0 items-center justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:flex-1"
                                >
                                  Verify
                                </button>
                              )}
                            </dd>
                          </div> */}
                        </dl>
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
