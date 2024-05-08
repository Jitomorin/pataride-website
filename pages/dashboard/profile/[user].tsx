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
        <Breadcrumb pageName="Profile" />
        <div className="overflow-hidden  rounded-lg  bg-white shadow-lg ">
          {profile.coverImageURL === "" ? (
            <div className="relative w-full h-48 bg-gray-400">
              <h1 className="w-full p-4 text-xl">No Cover Image</h1>
              <div className="absolute bottom-1 right-1 z-10 xsm:bottom-4 xsm:right-4">
                <label
                  htmlFor="cover"
                  className="flex cursor-pointer items-center justify-center gap-2 rounded bg-primary px-2 py-1 text-sm font-medium text-white hover:bg-opacity-80 xsm:px-4"
                >
                  <input
                    type="file"
                    name="cover"
                    onChange={async (e: any) => {
                      setNewCoverImage(e.target.files[0]);
                      await uploadCoverImage(e.target.files[0], user.uid).then(
                        (res) => {
                          setSnackbarMessage(res.message);
                          setSnackbarOpen(true);
                        }
                      );
                    }}
                    id="cover"
                    className="sr-only"
                  />
                  <span>
                    <svg
                      className="fill-current"
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M4.76464 1.42638C4.87283 1.2641 5.05496 1.16663 5.25 1.16663H8.75C8.94504 1.16663 9.12717 1.2641 9.23536 1.42638L10.2289 2.91663H12.25C12.7141 2.91663 13.1592 3.101 13.4874 3.42919C13.8156 3.75738 14 4.2025 14 4.66663V11.0833C14 11.5474 13.8156 11.9925 13.4874 12.3207C13.1592 12.6489 12.7141 12.8333 12.25 12.8333H1.75C1.28587 12.8333 0.840752 12.6489 0.512563 12.3207C0.184375 11.9925 0 11.5474 0 11.0833V4.66663C0 4.2025 0.184374 3.75738 0.512563 3.42919C0.840752 3.101 1.28587 2.91663 1.75 2.91663H3.77114L4.76464 1.42638ZM5.56219 2.33329L4.5687 3.82353C4.46051 3.98582 4.27837 4.08329 4.08333 4.08329H1.75C1.59529 4.08329 1.44692 4.14475 1.33752 4.25415C1.22812 4.36354 1.16667 4.51192 1.16667 4.66663V11.0833C1.16667 11.238 1.22812 11.3864 1.33752 11.4958C1.44692 11.6052 1.59529 11.6666 1.75 11.6666H12.25C12.4047 11.6666 12.5531 11.6052 12.6625 11.4958C12.7719 11.3864 12.8333 11.238 12.8333 11.0833V4.66663C12.8333 4.51192 12.7719 4.36354 12.6625 4.25415C12.5531 4.14475 12.4047 4.08329 12.25 4.08329H9.91667C9.72163 4.08329 9.53949 3.98582 9.4313 3.82353L8.43781 2.33329H5.56219Z"
                        fill="white"
                      />
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M6.99992 5.83329C6.03342 5.83329 5.24992 6.61679 5.24992 7.58329C5.24992 8.54979 6.03342 9.33329 6.99992 9.33329C7.96642 9.33329 8.74992 8.54979 8.74992 7.58329C8.74992 6.61679 7.96642 5.83329 6.99992 5.83329ZM4.08325 7.58329C4.08325 5.97246 5.38909 4.66663 6.99992 4.66663C8.61075 4.66663 9.91659 5.97246 9.91659 7.58329C9.91659 9.19412 8.61075 10.5 6.99992 10.5C5.38909 10.5 4.08325 9.19412 4.08325 7.58329Z"
                        fill="white"
                      />
                    </svg>
                  </span>
                  <span>Edit</span>
                </label>
              </div>
            </div>
          ) : (
            <div className="relative w-full h-48">
              <Image
                src={profile!.coverImageURL}
                alt="profile cover"
                className="h-full w-full rounded-tl-sm rounded-tr-sm object-cover object-center"
                width={970}
                height={260}
                style={{
                  width: "100%",
                  height: "160px",
                }}
              />
              <div className="absolute bottom-1 right-1 z-10 xsm:bottom-4 xsm:right-4">
                <label
                  htmlFor="cover"
                  className="flex cursor-pointer items-center justify-center gap-2 rounded bg-primary px-2 py-1 text-sm font-medium text-white hover:bg-opacity-80 xsm:px-4"
                >
                  <input
                    type="file"
                    name="cover"
                    onChange={async (e: any) => {
                      setNewCoverImage(e.target.files[0]);
                      await uploadCoverImage(e.target.files[0], user.uid).then(
                        (res) => {
                          setSnackbarMessage(res.message);
                          setSnackbarOpen(true);
                        }
                      );
                    }}
                    id="cover"
                    className="sr-only"
                  />
                  <span>
                    <svg
                      className="fill-current"
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M4.76464 1.42638C4.87283 1.2641 5.05496 1.16663 5.25 1.16663H8.75C8.94504 1.16663 9.12717 1.2641 9.23536 1.42638L10.2289 2.91663H12.25C12.7141 2.91663 13.1592 3.101 13.4874 3.42919C13.8156 3.75738 14 4.2025 14 4.66663V11.0833C14 11.5474 13.8156 11.9925 13.4874 12.3207C13.1592 12.6489 12.7141 12.8333 12.25 12.8333H1.75C1.28587 12.8333 0.840752 12.6489 0.512563 12.3207C0.184375 11.9925 0 11.5474 0 11.0833V4.66663C0 4.2025 0.184374 3.75738 0.512563 3.42919C0.840752 3.101 1.28587 2.91663 1.75 2.91663H3.77114L4.76464 1.42638ZM5.56219 2.33329L4.5687 3.82353C4.46051 3.98582 4.27837 4.08329 4.08333 4.08329H1.75C1.59529 4.08329 1.44692 4.14475 1.33752 4.25415C1.22812 4.36354 1.16667 4.51192 1.16667 4.66663V11.0833C1.16667 11.238 1.22812 11.3864 1.33752 11.4958C1.44692 11.6052 1.59529 11.6666 1.75 11.6666H12.25C12.4047 11.6666 12.5531 11.6052 12.6625 11.4958C12.7719 11.3864 12.8333 11.238 12.8333 11.0833V4.66663C12.8333 4.51192 12.7719 4.36354 12.6625 4.25415C12.5531 4.14475 12.4047 4.08329 12.25 4.08329H9.91667C9.72163 4.08329 9.53949 3.98582 9.4313 3.82353L8.43781 2.33329H5.56219Z"
                        fill="white"
                      />
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M6.99992 5.83329C6.03342 5.83329 5.24992 6.61679 5.24992 7.58329C5.24992 8.54979 6.03342 9.33329 6.99992 9.33329C7.96642 9.33329 8.74992 8.54979 8.74992 7.58329C8.74992 6.61679 7.96642 5.83329 6.99992 5.83329ZM4.08325 7.58329C4.08325 5.97246 5.38909 4.66663 6.99992 4.66663C8.61075 4.66663 9.91659 5.97246 9.91659 7.58329C9.91659 9.19412 8.61075 10.5 6.99992 10.5C5.38909 10.5 4.08325 9.19412 4.08325 7.58329Z"
                        fill="white"
                      />
                    </svg>
                  </span>
                  <span>Edit</span>
                </label>
              </div>
            </div>
          )}
          <div className="px-4 pb-6 text-center lg:pb-8 xl:pb-11">
            <div className="relative  drop-shadow-2  rounded-full">
              <img
                className="rounded-full object-cover w-64 h-64"
                src={
                  profile!.profileUrl === ""
                    ? "/images/profile.png"
                    : profile!.profileUrl
                }
                alt="profile"
              />
            </div>
            <div className="mt-4">
              <h3 className="mb-1 text-2xl font-semibold text-black dark:text-white">
                {profile.fullName}
              </h3>
              {/* <p className="font-medium">Ui/Ux Designer</p> */}
              <div className="mx-auto mb-5 mt-4 pb-4 grid max-w-94 grid-cols-3 rounded-md border-b-2 border-[#f8d421b7] py-2.5 shadow-1 dark:border-strokedark dark:bg-[#37404F]">
                <div className="flex flex-col items-center justify-center gap-1 px-4 dark:border-strokedark xsm:flex-row">
                  <span className="text-2xl font-semibold text-black dark:text-white">
                    {rentals.length}
                  </span>
                  <span className="text-xl">Rentals</span>
                </div>
                <div className="flex flex-col items-center justify-center gap-1 px-4 dark:border-strokedark xsm:flex-row">
                  <span className="text-2xl font-semibold text-black dark:text-white">
                    3,000Ksh
                  </span>
                  <span className="text-xl">Balance</span>
                </div>
                <div className="flex flex-col items-center justify-center gap-1 px-4 xsm:flex-row">
                  <span className="text-2xl font-semibold text-black dark:text-white">
                    2K
                  </span>
                  <span className="text-xl">Following</span>
                </div>
              </div>

              <div className="mx-auto max-w-180 pt-10">
                <h4 className="font-semibold text-3xl pb-4 text-black dark:text-white">
                  About Me
                </h4>
                <p className="mt-4 text-xl">
                  {profile!.bio === "" ? "No bio available" : profile!.bio}
                </p>
              </div>
              <div className="mx-auto max-w-180 pt-4">
                <Divider />
              </div>

              <div className="mt-10 text-left">
                {/* <h4 className="mb-3 text-3xl font-semibold  text-black dark:text-white">
                  Rentals
                </h4> */}

                {isRentalsLoading ? (
                  <div className="mt-14 w-full h-full">
                    <Spinner />
                  </div>
                ) : (
                  <div className="h-full">
                    <h1 className="font-semibold text-2xl">Owned Rentals</h1>
                    <AdminRentalsTable rentals={rentals} />
                  </div>
                  // <RentalsTable rentals={rentals} />
                  // <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">

                  // </div>
                )}
              </div>
            </div>
          </div>
        </div>
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
