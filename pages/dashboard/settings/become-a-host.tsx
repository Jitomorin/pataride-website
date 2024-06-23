"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Image from "next/image";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import styled from "styled-components";
import Avatar from "@/components/Avatar";
import { useAuthContext } from "@/contexts/AuthContext";
import Loading from "@/components/Loading";
import { useEffect, useState } from "react";
import {
  deleteProfileDirectory,
  uploadProfileImage,
} from "@/utils/firebase/storage";
import Snackbar from "@/components/Snackbar";
import { updateUserProfile } from "@/utils/firebase/firestore";
import { useRouter } from "next/router";
import {
  UserCircleIcon,
  UserIcon,
  UserPlusIcon,
} from "@heroicons/react/20/solid";
import { getUrl } from "@/utils/formatString";
import { classNames } from "@/contexts/utils";

function BecomeHostPage() {
  const { user, loading }: any = useAuthContext();
  const [IDFront, setIDFront] = useState<any>(null);
  const [IDBack, setIDBack] = useState<any>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [email, setEmail] = useState(!user?.email ? "" : user?.email);
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber);
  const [fullName, setFullName] = useState(user?.fullName);
  const [bio, setBio] = useState(user?.bio);
  const [snackbarMessage, setSnackbarMessage] = useState("Default Message");
  const [t, setT] = useState(true);
  const router = useRouter();
  let subNavigation = [];
  if (user?.role === "admin") {
    subNavigation = [
      {
        name: "Profile",
        href: "/dashboard/settings/profile",
        icon: UserCircleIcon,
        current: true,
      },
      {
        name: "Admin",
        href: "/dashboard/settings/admin",
        icon: UserIcon,
        current: true,
      },
      {
        name: "Host",
        href: "/dashboard/settings/become-a-host",
        icon: UserPlusIcon,
        current: true,
      },
      // {
      //   name: "Password",
      //   href: "/dashboard/settings/profile",
      //   icon: KeyIcon,
      //   current: false,
      // },
      // {
      //   name: "Notifications",
      //   href: "/dashboard/settings/profile",
      //   icon: BellIcon,
      //   current: false,
      // },
      // {
      //   name: "Billing",
      //   href: "/dashboard/settings/profile",
      //   icon: CreditCardIcon,
      //   current: false,
      // },
    ];
  } else {
    subNavigation = [
      {
        name: "Profile",
        href: "/dashboard/settings/profile",
        icon: UserCircleIcon,
        current: true,
      },
      {
        name: "Become a host",
        href: "/dashboard/settings/become-a-host",
        icon: UserPlusIcon,
        current: true,
      },
      // {
      //   name: "Account",
      //   href: "/dashboard/settings/profile",
      //   icon: CogIcon,
      //   current: false,
      // },
      // {
      //   name: "Password",
      //   href: "/dashboard/settings/profile",
      //   icon: KeyIcon,
      //   current: false,
      // },
      // {
      //   name: "Notifications",
      //   href: "/dashboard/settings/profile",
      //   icon: BellIcon,
      //   current: false,
      // },
      // {
      //   name: "Billing",
      //   href: "/dashboard/settings/profile",
      //   icon: CreditCardIcon,
      //   current: false,
      // },
    ];
  }
  useEffect(() => {
    // router.push("/dashboard/settings/profile");
  }, [user]);

  return (
    <DefaultLayout>
      <div className="mx-auto">
        <Breadcrumb pageName="Become a host" index="Settings" />
        <main className="">
          <div className="mx-auto max-w-screen-xl px-4 pb-6 sm:px-6 lg:px-8 lg:pb-16 rounded-lg">
            <div className="overflow-hidden rounded-lg bg-white shadow-lg">
              <div className="divide-y divide-gray-200 lg:grid lg:grid-cols-12 lg:divide-x lg:divide-y-0">
                <aside className="py-6 lg:col-span-3">
                  <nav className="space-y-1">
                    {subNavigation.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        className={classNames(
                          getUrl(router) ===
                            item.name.toLowerCase().replace(/ /g, "-")
                            ? "border-primary-500 bg-primary-50 text-primary-700 hover:bg-primary-50 hover:primary-primary-700"
                            : "border-transparent text-gray-900 hover:bg-gray-50 hover:text-gray-900",
                          "group flex items-center border-l-4 px-3 py-2 text-sm font-medium"
                        )}
                        aria-current={
                          getUrl(router) ===
                          item.name.toLowerCase().replace(/ /g, "-")
                            ? "page"
                            : undefined
                        }
                      >
                        <item.icon
                          className={classNames(
                            getUrl(router) ===
                              item.name.toLowerCase().replace(/ /g, "-")
                              ? "text-primary-500 group-hover:text-primary-500"
                              : "text-gray-400 group-hover:text-gray-500",
                            "-ml-1 mr-3 h-6 w-6 flex-shrink-0"
                          )}
                          aria-hidden="true"
                        />
                        <span className="truncate">{item.name}</span>
                      </a>
                    ))}
                  </nav>
                </aside>

                <div className="divide-y divide-gray-200 lg:col-span-9">
                  {/* Profile section */}
                  <div className="px-4 py-6 sm:p-6 lg:pb-8">
                    <div>
                      <h2 className="text-lg font-medium leading-6 text-gray-900">
                        Become a host
                      </h2>
                      <p className="mt-1 text-sm text-gray-500">
                        {user.role === "client"
                          ? "Provide the following details and await approval."
                          : "You are already a host."}
                      </p>
                    </div>

                    <div className="mt-6 flex flex-col lg:flex-row">
                      <div className="mt-6 flex-grow lg:ml-6 lg:mt-0 lg:flex-shrink-0 lg:flex-grow-0">
                        <p
                          className="text-sm font-medium leading-6 text-gray-900"
                          aria-hidden="true"
                        >
                          Photo of National ID (front)
                        </p>
                        <div className="mt-2 lg:hidden">
                          <div className="flex items-center">
                            <div
                              className="inline-block h-12 w-12 flex-shrink-0 overflow-hidden rounded-full"
                              aria-hidden="true"
                            >
                              <img
                                className="h-full w-full  rounded-full"
                                src={
                                  user?.profileUrl === ""
                                    ? "/images/profile.png"
                                    : user?.profileUrl
                                }
                                alt=""
                              />
                            </div>

                            <div className="relative ml-5">
                              <input
                                id="mobile-user-photo"
                                name="user-photo"
                                type="file"
                                className="peer absolute h-full w-full rounded-md opacity-0"
                                onChange={async (e: any) => {
                                  setIDFront(e.target.files[0]);
                                  console.log(e.target.files[0]);
                                }}
                              />
                              <label
                                htmlFor="mobile-user-photo"
                                className="pointer-events-none block rounded-md px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 peer-hover:ring-gray-400 peer-focus:ring-2 peer-focus:ring-sky-500"
                              >
                                <span
                                  onClick={async () => {
                                    // await changeProfilePicture();
                                  }}
                                >
                                  Change
                                </span>
                                <span className="sr-only"> user photo</span>
                              </label>
                            </div>
                          </div>
                        </div>

                        <div className="relative hidden overflow-hidden rounded-full lg:block">
                          <img
                            className="relative h-40 w-40 rounded-full object-cover"
                            src={!IDFront ? "/images/profile.png" : IDFront}
                            alt=""
                          />
                          <label
                            htmlFor="desktop-user-photo"
                            className="absolute inset-0 flex h-full w-full items-center justify-center bg-black bg-opacity-75 text-sm font-medium text-white opacity-0 focus-within:opacity-100 hover:opacity-100"
                          >
                            <span>Change</span>
                            <span className="sr-only"> user photo</span>
                            <input
                              type="file"
                              id="desktop-user-photo"
                              name="user-photo"
                              accept="image/*"
                              className="absolute inset-0 h-full w-full cursor-pointer rounded-md border-gray-300 opacity-0"
                              onChange={async (e: any) => {
                                setIDFront(e.target.files[0]);
                                console.log(e.target.files[0]);
                                // await changeProfilePicture();
                              }}
                            />
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 grid grid-cols-12 gap-6">
                      <div className="col-span-12">
                        <label
                          htmlFor="url"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          Mpesa Number
                        </label>
                        <input
                          type="text"
                          name="url"
                          id="url"
                          value={phoneNumber}
                          onChange={(e) => {
                            const inputValue: any = e.target.value;
                            if (!isNaN(inputValue)) {
                              // If it's a number, update the state
                              setPhoneNumber(inputValue);
                            }
                          }}
                          className="mt-2 block w-full rounded-md border-0 px-3 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:border-0 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Privacy section */}
                  <div className="mt-4 flex justify-end gap-x-3 px-4 py-4 sm:px-6">
                    {IDFront === null ? (
                      <></>
                    ) : (
                      <button
                        onClick={async () => {
                          //   await changeProfilePicture();
                        }}
                        className="ml-5 inline-flex justify-center rounded-md bg-transparent px-3 py-2 text-sm font-semibold text-primary hover:scale-[1.03] transition-all ease-in-out"
                      >
                        Save Image
                      </button>
                    )}
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        // changeProfileDetails();
                      }}
                      type="submit"
                      className="inline-flex justify-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white hover:scale-[1.03] transition-all ease-in-out"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
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

export default BecomeHostPage;
