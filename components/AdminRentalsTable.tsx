import React, { useMemo, useEffect, useState } from "react";
import {
  useTable,
  useGlobalFilter,
  useAsyncDebounce,
  usePagination,
  useRowSelect,
} from "react-table";
import { useRowSelectColumn } from "@lineup-lite/hooks";
import { Button, PageButton } from "../contexts/Button";
import { classNames, customersData } from "../contexts/utils";
import { DOTS, useCustomPagination } from "./useCustomPagination";
import { faColumns } from "@fortawesome/free-solid-svg-icons";
import ProfileColumn from "./ProfileColumn";
import RentalColumn from "./RentalColumn";
import { formatNumber } from "@/utils/formatNumber";

export function GlobalFilter({
  globalFilter,
  setGlobalFilter,
  placeholder,
}: any) {
  const [value, setValue] = useState(globalFilter);
  const onChange = useAsyncDebounce((value) => {
    setGlobalFilter(value || undefined);
  }, 200);

  return (
    <span className="flex justify-between  pt-10 pb-10 ">
      {/* <p>search</p> */}
      <input
        value={value || ""}
        onChange={(e) => {
          setValue(e.target.value);
          onChange(e.target.value);
        }}
        className="p-2 w-1/2  border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
        placeholder="Search for name, email, or uid..."
        type="search"
      />
      <button className="bg-white rounded-xl p-4 border-1 cursor-pointer">
        Export
      </button>
    </span>
  );
}

export function StatusPill({ value }: any) {
  const isApproved = value ? value : false;

  return (
    <span
      className={classNames(
        "px-3 py-1 uppercase leading-wide font-bold text-xs rounded-full shadow-sm",
        isApproved ? "bg-green-100 text-green-700" : null,
        !isApproved ? "bg-red-100 text-red-700" : null
      )}
    >
      {isApproved.toString()}
    </span>
  );
}

export function AvatarCell({ value, column, row }: any) {
  return (
    <div className="flex items-center">
      <div
        onClick={() => {
          console.log(row.original);
        }}
        className="flex-shrink-0 h-20 w-20"
      >
        <img className="h-20 w-20" src={row.original.image[0]} alt="" />
      </div>
      <div className="ml-4">
        <div className="text-sm font-medium text-gray-900">{value}</div>
        <div className="text-sm text-gray-500">
          {row.original[column.numAccessor]}
        </div>
      </div>
    </div>
  );
}
export function ActionCell({
  value,
  column,
  row,
  setSelectedUser,
  setOpenProfile,
}: any) {
  return (
    <div className="flex items-center">
      <button
        onClick={() => {
          setSelectedUser(value.row.original);
          setOpenProfile(true);
        }}
        className="text-indigo-600 hover:text-indigo-900 hover:underline "
      >
        Edit
      </button>
    </div>
  );
}

const AdminRentalsTable = ({ placeholder, rentals }: any) => {
  const [openRental, setOpenRental] = useState(false);
  const [selectedRental, setSelectedRental] = useState<any>(rentals[0]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("Default Message");
  const data = useMemo(() => rentals, []);

  const columns = useMemo(
    () => [
      {
        Header: "Name",
        accessor: "name",
        Cell: AvatarCell,
        imgAccessor: (value: any) => `${value.image[0]}`,
        numAccessor: "uid",
      },
      {
        Header: "Price per day",
        accessor: (value: any) => `Ksh ${formatNumber(value.price)}`,
      },
      {
        Header: "Location",
        accessor: (value: any) =>
          `${value.location.addressLine1}, ${value.location.addressLine2}`,
      },
      {
        Header: "Year",
        accessor: "year",
      },
      {
        Header: "Approved",
        accessor: "isApproved",
        Cell: StatusPill,
      },
      {
        Header: "Action",
        Cell: (value: any, row: any) => (
          <ActionCell
            setOpenProfile={setOpenRental}
            setSelectedUser={setSelectedRental}
            value={value}
            row={row}
          />
        ),
      },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    nextPage,
    previousPage,
    gotoPage,
    pageCount,
    setPageSize,
    state,
    preGlobalFilteredRows,
    setGlobalFilter,
  }: any = useTable(
    {
      columns,
      data,
    },
    useGlobalFilter,
    usePagination
  );
  const { pageIndex } = state;
  const paginationRange = useCustomPagination({
    totalPageCount: pageCount,
    currentPage: pageIndex,
  });
  console.log(paginationRange);

  useEffect(() => {
    setPageSize(5);
  }, [setPageSize]);

  return (
    <div>
      <RentalColumn
        rental={selectedRental}
        open={openRental}
        setOpen={setOpenRental}
        callSnackBar={(message: string) => {
          setSnackbarMessage(message);
          setSnackbarOpen(true);
        }}
      />
      <GlobalFilter
        preGlobalFilteredRows={preGlobalFilteredRows}
        globalFilter={state.globalFilter}
        setGlobalFilter={setGlobalFilter}
        placeholder={placeholder}
      />
      <div className="mt-2 flex flex-col">
        <div className="-my-2 overflow-x-auto -mx-4 sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <table
                {...getTableProps()}
                className="min-w-full divide-y divide-gray-200"
              >
                <thead className="bg-gray-10">
                  {headerGroups.map((headerGroup: any) => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                      {headerGroup.headers.map((column: any) => (
                        <th
                          {...column.getHeaderProps()}
                          className="px-6 py-5 text-left text-20 font-medium text-gray-400 uppercase rounded-sm tracking-wider"
                        >
                          {column.render("Header")}
                          {column.id === "selection" &&
                            column.render("Summary")}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody
                  {...getTableBodyProps()}
                  className="bg-white divide-y divide-gray-200"
                >
                  {page.map((row: any, i: any) => {
                    prepareRow(row);
                    return (
                      <tr {...row.getRowProps()}>
                        {row.cells.map((cell: any) => {
                          return (
                            <td
                              {...cell.getCellProps()}
                              className="px-6 py-10 whitespace-nowrap"
                            >
                              {cell.render("Cell")}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div className="py-3 flex items-center text-center justify-center pt-10">
        <div className="flex-1 flex justify-between md:hidden">
          <Button onClick={() => previousPage()} disabled={!canPreviousPage}>
            Previous
          </Button>
          <Button onClick={() => nextPage()} disabled={!canNextPage}>
            Next
          </Button>
        </div>
        <div
          className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between"
          aria-label="Pagination"
        >
          <div
            className="relative z-0 inline-flex items-center ml-auto mr-auto rounded-md shadow-sm space-x-10"
            aria-label="Pagination"
          >
            {paginationRange?.map((pageNumber, index) => {
              if (pageNumber === DOTS) {
                return <PageButton key={index}>...</PageButton>;
              }

              if (pageNumber - 1 === pageIndex) {
                return (
                  <PageButton
                    key={index}
                    className=" active:bg-gray-500 active:border-gray-300"
                    onClick={() => gotoPage(pageNumber - 1)}
                  >
                    {pageNumber}
                  </PageButton>
                );
              }

              return (
                <PageButton
                  key={index}
                  className="active:bg-gray-500 active:border-gray-300"
                  onClick={() => gotoPage(pageNumber - 1)}
                >
                  {pageNumber}
                </PageButton>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminRentalsTable;
