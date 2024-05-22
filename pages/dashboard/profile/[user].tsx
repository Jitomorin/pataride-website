import AdminRentalsTable from "@/components/AdminRentalsTable";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Divider from "@/components/Divider";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import RentalsTable from "@/components/RentalsTable";
import Snackbar from "@/components/Snackbar";
import Spinner from "@/components/Spinner";
import { useAuthContext } from "@/contexts/AuthContext";
import { getDocument, getFilteredData } from "@/utils/firebase/firestore";
import { uploadCoverImage } from "@/utils/firebase/storage";
import { formatNumber } from "@/utils/formatNumber";
import { GetServerSideProps } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

interface Query {
  [key: string]: string;
}

function Profile(props: any) {
  const { user, loading }: any = useAuthContext();
  const { profile }: any = props;
  const [rentals, setRentals] = useState<any>([]);
  const [newCoverImage, setNewCoverImage] = useState<any>(null);
  const router = useRouter();
  const [isRentalsLoading, setIsRentalsLoading] = useState(true);
  const [snackbarMessage, setSnackbarMessage] = useState("Default Message");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const formObject = {
    fields: {
      Phone: profile.phoneNumber,
      Email: profile.email,
      Role: profile.role,
    },
  };

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.push("/login");
    }
    const getRentals = async () => {
      setIsRentalsLoading(true);
      await getFilteredData("rentals", "userID", "==", profile.uid).then(
        (res: any) => {
          setRentals(res);
          setIsRentalsLoading(false);
        }
      );
    };
    getRentals();
  }, []);

  if (loading) {
    return <div className="m-auto w-full h-full text-4xl">Loading...</div>;
  }
  return (
    <DefaultLayout>
      <div className="mx-auto">
        <div className="relative z-0 flex flex-1 overflow-hidden">
          <main className="relative z-0 flex-1 overflow-y-auto focus:outline-none xl:order-last">
            {/* Breadcrumb */}
            {/* <nav
              className="flex items-start px-4 py-3 sm:px-6 lg:px-8 xl:hidden"
              aria-label="Breadcrumb"
            >
              <a
                href="#"
                className="inline-flex items-center space-x-3 text-lg font-medium text-gray-900"
              >
                <ChevronLeftIcon
                  className="-ml-2 h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
                <span>Directory</span>
              </a>
            </nav> */}

            <article>
              {/* Profile header */}
              <div>
                {profile.coverImageURL === "" ? (
                  <div className="relative overflow-hidden">
                    <img
                      className="h-32 w-full object-cover lg:h-48 bg-gray-600"
                      src={profile.coverImageURL}
                      alt=""
                    />
                    {user.uid === profile.uid && (
                      <label
                        htmlFor="desktop-user-photo"
                        className="absolute inset-0 flex h-full w-full items-center justify-center bg-black bg-opacity-75 text-sm font-medium text-white opacity-0 focus-within:opacity-100 hover:opacity-100"
                      >
                        <span>Change Cover Image</span>
                        <span className="sr-only"> user photo</span>
                        <input
                          type="file"
                          id="desktop-user-photo"
                          name="user-photo"
                          accept="image/*"
                          className="absolute inset-0 h-full w-full cursor-pointer rounded-md border-gray-300 opacity-0"
                          onChange={async (e: any) => {
                            setNewCoverImage(e.target.files[0]);
                            console.log(e.target.files[0]);
                            await uploadCoverImage(
                              e.target.files[0],
                              user.uid
                            ).then((res) => {
                              setSnackbarMessage(res.message);
                              setSnackbarOpen(true);
                              router.reload();
                            });
                          }}
                        />
                      </label>
                    )}
                  </div>
                ) : (
                  <div className="relative overflow-hidden">
                    <img
                      className="h-32 w-full object-cover lg:h-48"
                      src={profile.coverImageURL}
                      alt=""
                    />
                    {user.uid === profile.uid && (
                      <label
                        htmlFor="desktop-user-photo"
                        className="absolute inset-0 flex h-full w-full items-center justify-center bg-black bg-opacity-75 text-sm font-medium text-white opacity-0 focus-within:opacity-100 hover:opacity-100 transition-all ease-in-out"
                      >
                        <span>Change Cover Image</span>
                        <span className="sr-only"> user photo</span>
                        <input
                          type="file"
                          id="desktop-user-photo"
                          name="user-photo"
                          accept="image/*"
                          className="absolute inset-0 h-full w-full cursor-pointer rounded-md border-gray-300 opacity-0"
                          onChange={async (e: any) => {
                            setNewCoverImage(e.target.files[0]);
                            console.log(e.target.files[0]);
                            await uploadCoverImage(
                              e.target.files[0],
                              user.uid
                            ).then((res) => {
                              setSnackbarMessage(res.message);
                              setSnackbarOpen(true);
                              router.reload();
                            });
                          }}
                        />
                      </label>
                    )}
                  </div>
                )}
                <div className="mx-auto max-w-full px-4 sm:px-6 lg:px-8">
                  <div className="-mt-12 sm:-mt-16 sm:flex sm:items-end sm:space-x-5">
                    <div className="flex">
                      <img
                        className="h-24 w-24 rounded-full ring-4 ring-white sm:h-32 sm:w-32 z-30"
                        src={
                          profile?.profileUrl === ""
                            ? "/images/profile.png"
                            : profile?.profileUrl
                        }
                        alt=""
                      />
                    </div>
                    <div className="mt-6 sm:flex sm:min-w-0 sm:flex-1 sm:items-center sm:justify-end sm:space-x-6 sm:pb-1">
                      <div className="mt-6 min-w-0 flex-1 sm:hidden 2xl:block">
                        <h1 className="truncate text-2xl font-bold text-gray-900">
                          {profile.name}
                        </h1>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 hidden min-w-0 flex-1 sm:block 2xl:hidden">
                    <h1 className="truncate text-2xl font-bold text-gray-900">
                      {profile.name}
                    </h1>
                  </div>
                </div>
              </div>

              {/* Description list */}
              <div className="mx-auto mt-6 max-w-full px-4 sm:px-6 lg:px-8">
                <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                  {Object.keys(formObject.fields).map((field) => (
                    <div key={field} className="sm:col-span-1">
                      <dt className="text-lg font-medium text-gray-500">
                        {field}
                      </dt>
                      <dd className="mt-1 text-lg text-gray-900">
                        {formObject.fields[field]}
                      </dd>
                    </div>
                  ))}
                  <div className="sm:col-span-2">
                    <dt className="text-lg font-medium text-gray-500">Bio</dt>
                    <dd
                      className="mt-1 max-w-prose space-y-5 text-lg text-gray-900"
                      dangerouslySetInnerHTML={{ __html: profile.bio }}
                    />
                  </div>
                </dl>
              </div>

              {/* Rentals list */}
              <div className="mx-auto mt-8 max-w-full px-4 pb-12 sm:px-6 lg:px-8">
                <h2 className="text-lg font-medium text-gray-500">Rentals</h2>
                {rentals.length === 0 ? (
                  <div className="h-full w-full flex justify-center items-center">
                    <h1 className="text-xl font-semibold text-gray-500">
                      No Rentals Found
                    </h1>
                  </div>
                ) : (
                  <div className="mt-1 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {rentals.map((rental: any) => (
                      <div
                        onClick={() => {
                          router.push(`/rentals/${rental.uid}`);
                        }}
                        key={rental.uid}
                        className="relative flex items-center space-x-3 rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm focus-within:ring-2 focus-within:ring-pink-500 focus-within:ring-offset-2 hover:border-gray-400"
                      >
                        <div className="flex-shrink-0">
                          <img
                            className="h-10 w-10 rounded-full"
                            src={rental.image[0]}
                            alt=""
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <a href="#" className="focus:outline-none">
                            <span
                              className="absolute inset-0"
                              aria-hidden="true"
                            />
                            <p className="text-lg font-medium text-gray-900">
                              {rental.name}
                            </p>
                            <p className="truncate text-lg text-gray-500">
                              {`${rental.location.addressLine1}, ${rental.location.addressLine2}`}
                            </p>
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </article>
          </main>
        </div>
      </div>
    </DefaultLayout>
  );
}

export default Profile;

export const getServerSideProps: GetServerSideProps<any, Query> = async (
  ctx
) => {
  const { params = {} } = ctx;
  console.log("params", params);
  const profile = await getDocument("users", params.user);
  const userSlug = params.user as string;

  if (!profile) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      profile: profile,
      userSlug: userSlug,
    },
  };
};
