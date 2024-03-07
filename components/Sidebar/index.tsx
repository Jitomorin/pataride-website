"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import SidebarLinkGroup from "./SidebarLinkGroup";
import Divider from "../Divider";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const pathname = usePathname();

  const trigger = useRef<any>(null);
  const sidebar = useRef<any>(null);

  let storedSidebarExpanded = "true";

  const [sidebarExpanded, setSidebarExpanded] = useState(
    storedSidebarExpanded === null ? false : storedSidebarExpanded === "true"
  );

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!sidebar.current || !trigger.current) return;
      if (
        !sidebarOpen ||
        sidebar.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setSidebarOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ key }: KeyboardEvent) => {
      if (!sidebarOpen || key !== "Escape") return;
      setSidebarOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });

  useEffect(() => {
    localStorage.setItem("sidebar-expanded", sidebarExpanded.toString());
    if (sidebarExpanded) {
      document.querySelector("body")?.classList.add("sidebar-expanded");
    } else {
      document.querySelector("body")?.classList.remove("sidebar-expanded");
    }
  }, [sidebarExpanded]);

  return (
    <aside
      ref={sidebar}
      className={`absolute left-0 top-0 z-50 flex h-screen w-72 flex-col overflow-y-hidden bg-black duration-300 ease-linear dark:bg-boxdark lg:static lg:translate-x-0 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* <!-- SIDEBAR HEADER --> */}
      <div className="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5">
        <Link href="/">
          <Image
            width={176}
            height={32}
            src={"/images/logo/Pata Ride Text.png"}
            alt="logo-img"
            priority
          />
        </Link>

        <button
          ref={trigger}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-controls="sidebar"
          aria-expanded={sidebarOpen}
          className="block lg:hidden text-white"
        >
          <svg
            className="fill-current text-white"
            width="20"
            height="18"
            viewBox="0 0 20 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19 8.175H2.98748L9.36248 1.6875C9.69998 1.35 9.69998 0.825 9.36248 0.4875C9.02498 0.15 8.49998 0.15 8.16248 0.4875L0.399976 8.3625C0.0624756 8.7 0.0624756 9.225 0.399976 9.5625L8.16248 17.4375C8.31248 17.5875 8.53748 17.7 8.76248 17.7C8.98748 17.7 9.17498 17.625 9.36248 17.475C9.69998 17.1375 9.69998 16.6125 9.36248 16.275L3.02498 9.8625H19C19.45 9.8625 19.825 9.4875 19.825 9.0375C19.825 8.55 19.45 8.175 19 8.175Z"
              fill=""
            />
          </svg>
        </button>
      </div>
      {/* <!-- SIDEBAR HEADER --> */}

      <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
        {/* <!-- Sidebar Menu --> */}
        <nav className="mt-5 px-4 py-4 lg:mt-9 lg:px-6">
          {/* <!-- Menu Group --> */}
          <div>
            <ul className="mb-6 flex flex-col gap-1.5">
              {/* <!-- Menu Item Dashboard --> */}
              <SidebarLinkGroup
                activeCondition={
                  pathname === "/" || pathname!.includes("dashboard")
                }
              >
                {(handleClick, open) => {
                  return (
                    <React.Fragment>
                      <Link
                        href="/dashboard/home"
                        className={`group relative flex items-center gap-2.5 rounded-md px-4 py-3 font-medium text-white duration-300 ease-in-out hover:bg-[#F8D521] dark:hover:bg-meta-4 ${
                          (pathname === "/" || pathname!.includes("home")) &&
                          "bg-[#F8D521] dark:bg-meta-4"
                        }`}
                      >
                        <Image
                          width={18}
                          height={18}
                          src={"/images/logo/dashboard_logo.svg"}
                          alt="logo-img"
                          priority
                        />
                        Dashboard
                        {/* <svg
                          className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current text-white ${
                            open && "rotate-180"
                          }`}
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
                            fill=""
                          />
                        </svg> */}
                      </Link>
                      {/* <!-- Dropdown Menu Start --> */}

                      {/* <!-- Dropdown Menu End --> */}
                    </React.Fragment>
                  );
                }}
              </SidebarLinkGroup>
              {/* <!-- Menu Item Dashboard --> */}

              {/* <!-- Menu Item rental --> */}
              <li>
                <Link
                  href="/dashboard/rentals"
                  className={`group relative flex items-center gap-2.5 rounded-md px-4 py-3 font-medium text-white duration-300 ease-in-out hover:bg-[#F8D521] dark:hover:bg-meta-4 ${
                    pathname!.includes("rentals") &&
                    "bg-[#F8D521] dark:bg-meta-4"
                  }`}
                >
                  <Image
                    width={18}
                    height={18}
                    src={"/images/logo/car_logo.svg"}
                    alt="logo-img"
                    priority
                  />
                  Rentals
                </Link>
              </li>
              {/* <!-- Menu Item Calendar --> */}

              {/* <!-- Menu Item Profile --> */}
              <li>
                <Link
                  href="/dashboard/bookings"
                  className={`group relative flex items-center gap-2.5 rounded-md px-4 py-3 font-medium text-white duration-300 ease-in-out hover:bg-[#F8D521] dark:hover:bg-meta-4 ${
                    pathname!.includes("bookings") &&
                    "bg-[#F8D521] dark:bg-meta-4"
                  }`}
                >
                  <Image
                    width={18}
                    height={18}
                    src={"/images/logo/booking_logo.svg"}
                    alt="logo-img"
                    priority
                  />
                  Bookings
                </Link>
              </li>
              {/* <!-- Menu Item Profile --> */}

              {/* <!-- Menu Item Forms --> */}
              <SidebarLinkGroup
                activeCondition={
                  pathname === "/forms" || pathname!.includes("forms")
                }
              >
                {(handleClick, open) => {
                  return (
                    <React.Fragment>
                      <Link
                        href="#"
                        className={`group relative flex items-center gap-2.5 rounded-md px-4 py-3 font-medium text-white duration-300 ease-in-out hover:bg-[#F8D521] dark:hover:bg-meta-4 ${
                          (pathname === "/forms" ||
                            pathname!.includes("forms")) &&
                          "bg-[#F8D521] dark:bg-meta-4"
                        }`}
                        onClick={(e) => {
                          e.preventDefault();
                          sidebarExpanded
                            ? handleClick()
                            : setSidebarExpanded(true);
                        }}
                      >
                        <Image
                          width={18}
                          height={18}
                          src={"/images/logo/bell_logo.svg"}
                          alt="logo-img"
                          priority
                        />
                        Notifications
                        <svg
                          className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current text-white ${
                            open && "rotate-180"
                          }`}
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
                            fill=""
                          />
                        </svg>
                      </Link>
                      {/* <!-- Dropdown Menu Start --> */}
                      <div
                        className={`translate transform overflow-hidden ${
                          !open && "hidden"
                        }`}
                      >
                        <ul className="mb-5.5 mt-4 flex flex-col gap-2.5 pl-6">
                          <li>
                            <Link
                              href="/forms/form-elements"
                              className={`group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-white duration-300 ease-in-out hover:text-[#F8D521] ${
                                pathname === "/forms/form-elements" &&
                                "text-[#F8D521]"
                              }`}
                            >
                              Form Elements
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/forms/form-layout"
                              className={`group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-white duration-300 ease-in-out hover:text-[#F8D521] ${
                                pathname === "/forms/form-layout" &&
                                "text-[#F8D521]"
                              } `}
                            >
                              Form Layout
                            </Link>
                          </li>
                        </ul>
                      </div>
                      {/* <!-- Dropdown Menu End --> */}
                    </React.Fragment>
                  );
                }}
              </SidebarLinkGroup>
              {/* <!-- Menu Item Forms --> */}

              {/* <!-- Menu Item Tables --> */}
              <li>
                <Link
                  href="/dashboard/settings"
                  className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-white duration-300 ease-in-out hover:bg-[#F8D521] dark:hover:bg-meta-4 ${
                    pathname!.includes("settings") &&
                    "bg-[#F8D521] dark:bg-meta-4"
                  }`}
                >
                  <Image
                    width={18}
                    height={18}
                    src={"/images/logo/settings_logo.svg"}
                    alt="logo-img"
                    priority
                  />
                  Settings
                </Link>
              </li>
              {/* <!-- Menu Item Tables --> */}

              {/* <!-- Menu Item Settings --> */}

              {/* <!-- Menu Item Settings --> */}
            </ul>
          </div>

          {/* <!-- Others Group --> */}
          <div>
            <Divider />
            <h3 className="mb-4 ml-4 text-sm font-semibold text-white">
              Payment
            </h3>

            <ul className="mb-6 flex flex-col gap-1.5">
              {/* <!-- Menu Item Chart --> */}
              <li>
                <Link
                  href="/chart"
                  className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-white duration-300 ease-in-out hover:bg-[#F8D521] dark:hover:bg-meta-4 ${
                    pathname!.includes("chart") && "bg-[#F8D521] dark:bg-meta-4"
                  }`}
                >
                  <Image
                    width={18}
                    height={18}
                    src={"/images/logo/payment_logo.svg"}
                    alt="logo-img"
                    priority
                  />
                  Payment Details
                </Link>
              </li>
              {/* <!-- Menu Item Chart --> */}

              {/* <!-- Menu Item Auth Pages --> */}
            </ul>
          </div>
        </nav>
        {/* <!-- Sidebar Menu --> */}
      </div>
    </aside>
  );
};

export default Sidebar;