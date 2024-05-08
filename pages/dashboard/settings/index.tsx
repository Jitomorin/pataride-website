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

const SaveButton = styled.div`
  background-color: #f8d521;
  padding: 1rem 1rem;
  border-radius: 0.3rem;
  transition: all 0.3s;
  font-size: 1rem;
  color: white;
  font-weight: bold;
  cursor: pointer;
  z-index: 1;
  &:hover {
    scale: 1.07;
  }
`;
export const metadata: Metadata = {
  title: "Next.js Settings | TailAdmin - Next.js Dashboard Template",
  description:
    "This is Next.js Settings page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

function Settings() {
  const { user, loading }: any = useAuthContext();
  const [profileImage, setProfileImage] = useState<any>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [email, setEmail] = useState(!user?.email ? "" : user?.email);
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber);
  const [fullName, setFullName] = useState(user?.fullName);
  const [bio, setBio] = useState(user?.bio);
  const [snackbarMessage, setSnackbarMessage] = useState("Default Message");
  const [t, setT] = useState(true);
  const router = useRouter();

  useEffect(() => {
    console.log(user, loading);
  }, [user, t]);

  const refreshPage = () => {
    setT(!t);
  };
  const resetForm = () => {
    setEmail(user.email);
    setPhoneNumber(user.phoneNumber);
    setFullName(user.fullName);
    setBio(user.bio);
  };
  const resetProfileImageSelection = () => {
    setProfileImage(null);
  };
  const changeProfilePicture = async () => {
    if (profileImage === null) {
      setSnackbarMessage("Please select an image to upload");
      setSnackbarOpen(true);
      return;
    }
    const result = await uploadProfileImage(profileImage, user.uid);
    if (result.status === "success") {
      setSnackbarMessage("Profile picture updated successfully");
      setSnackbarOpen(true);
      router.reload();
    } else {
      setSnackbarMessage(result.message);
      setSnackbarOpen(true);
    }
    refreshPage();
  };
  const changeProfileDetails = async () => {
    if (
      user?.email === email &&
      user?.phoneNumber === phoneNumber &&
      user?.fullName === fullName &&
      user?.bio === bio
    ) {
      setSnackbarMessage("No changes made");
      setSnackbarOpen(true);
      return;
    }
    const result = await updateUserProfile(
      user.uid,
      email,
      fullName,
      phoneNumber,
      bio
    );
    setSnackbarMessage(result.message);
    setSnackbarOpen(true);
    refreshPage();
  };

  return (
    <DefaultLayout>
      <div className="mx-auto">
        <Breadcrumb pageName="Settings" />

        <div className="grid grid-cols-5 gap-8">
          <div className="col-span-5 xl:col-span-3">
            <div className="rounded-mg shadow-md bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke px-7 py-4 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">
                  Personal Information
                </h3>
              </div>
              <div className="p-7">
                <form action="#">
                  <div className="mb-5 flex flex-col gap-5 sm:flex-row">
                    <div className="w-full sm:w-1/2">
                      <label
                        className="mb-3 block text-sm font-medium text-black dark:text-white"
                        htmlFor="fullName"
                      >
                        Full Name
                      </label>
                      <div className="relative">
                        <input
                          className="w-full rounded border border-stroke bg-gray py-3 px-2 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                          type="text"
                          onChange={(e) => {
                            setFullName(e.target.value);
                          }}
                          name="fullName"
                          id="fullName"
                          placeholder={fullName}
                          defaultValue={fullName}
                        />
                      </div>
                    </div>

                    <div className="w-full sm:w-1/2">
                      <label
                        className="mb-3 block text-sm font-medium text-black dark:text-white"
                        htmlFor="phoneNumber"
                      >
                        Phone Number
                      </label>
                      <input
                        className="w-full rounded border border-stroke bg-gray px-2 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        type="text"
                        onChange={(e) => {
                          setPhoneNumber(e.target.value);
                        }}
                        name="phoneNumber"
                        id="phoneNumber"
                        placeholder={`${phoneNumber}`}
                        defaultValue={`${phoneNumber}`}
                      />
                    </div>
                  </div>

                  <div className="mb-5">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="emailAddress"
                    >
                      Email Address
                    </label>
                    <div className="relative">
                      <input
                        className="w-full rounded border border-stroke bg-gray py-3 px-2 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        type="email"
                        name="emailAddress"
                        onChange={(e) => {
                          setEmail(e.target.value);
                        }}
                        id="emailAddress"
                        placeholder={`${email}`}
                        defaultValue={`${email}`}
                      />
                    </div>
                  </div>

                  {/* <div className="mb-5">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="Username"
                    >
                      Username
                    </label>
                    <input
                      className="w-full rounded border border-stroke bg-gray px-2 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                      type="text"
                      name="Username"
                      id="Username"
                      placeholder="devidjhon24"
                      defaultValue="devidjhon24"  
                    />
                  </div> */}

                  <div className="mb-5">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="Bio"
                    >
                      BIO
                    </label>
                    <div className="relative">
                      <textarea
                        className="w-full rounded border border-stroke bg-gray py-3 px-2 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        name="bio"
                        id="bio"
                        onChange={(e) => {
                          setBio(e.target.value);
                        }}
                        rows={6}
                        placeholder="Write your bio here"
                        defaultValue={`${bio}`}
                      ></textarea>
                    </div>
                  </div>

                  <div className="flex justify-end gap-4">
                    <button
                      onClick={() => {
                        resetForm();
                      }}
                      className="flex justify-center rounded border border-stroke px-6 py-2 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
                      type="submit"
                    >
                      Cancel
                    </button>
                    {/* <button
                      className="flex justify-center rounded bg-primary px-6 py-2 font-medium text-gray hover:bg-opacity-90"
                      type="submit"
                    >
                      Save
                    </button> */}
                    <SaveButton
                      onClick={() => {
                        changeProfileDetails();
                      }}
                    >
                      Save
                    </SaveButton>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="col-span-5 xl:col-span-2">
            <div className="rounded-md shadow-md bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke px-7 py-4 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">
                  Your Photo
                </h3>
              </div>
              <div className="p-7">
                <form action="#">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="w-14 h-14 rounded-full cursor-pointer overflow-hidden">
                      <img
                        className=" object-cover"
                        src={
                          user?.profileUrl === ""
                            ? "/images/profile.png"
                            : user?.profileUrl
                        }
                        alt="avatar"
                      />
                    </div>
                    <div>
                      <span className="mb-1 text-black dark:text-white">
                        Edit your photo
                      </span>
                      <span className="flex gap-2">
                        <button
                          onClick={async () => {
                            await deleteProfileDirectory(user.uid).then(
                              (res) => {
                                setSnackbarMessage(res.message);
                                setSnackbarOpen(true);
                                // refreshPage();
                              }
                            );
                          }}
                          className="text-sm hover:text-primary"
                        >
                          Delete
                        </button>
                        {/* <button className="text-sm hover:text-primary">
                          Update
                        </button> */}
                      </span>
                    </div>
                  </div>

                  <div
                    id="FileUpload"
                    className={`relative mb-5 block w-full cursor-pointer appearance-none rounded border border-dashed ${
                      profileImage === null
                        ? "border-primary"
                        : "border-blue-600"
                    } bg-gray px-4 py-4 dark:bg-meta-4 sm:py-7`}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e: any) => {
                        setProfileImage(e.target.files[0]);
                        console.log(e.target.files[0]);
                      }}
                      className="absolute inset-0 z-50 m-0 h-full w-full cursor-pointer p-0 opacity-0 outline-none"
                    />
                    <div
                      className={`flex flex-col items-center justify-center space-y-3 ${
                        profileImage === null ? "text-primary" : "text-blue-600"
                      }`}
                    >
                      <p>
                        <span
                          className={`${
                            profileImage === null
                              ? "text-primary"
                              : "text-blue-600"
                          }`}
                        >
                          Click to upload
                        </span>{" "}
                        or drag and drop
                      </p>
                      <p className="mt-1">SVG, PNG, JPG or GIF</p>
                      <p>(max, 800 X 800px)</p>
                    </div>
                  </div>

                  <div className="flex justify-end gap-4">
                    <button
                      onClick={() => {
                        resetProfileImageSelection();
                      }}
                      className="flex justify-center rounded border border-stroke px-6 py-2 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
                      type="submit"
                    >
                      Cancel
                    </button>
                    {/* <button
                      className="flex justify-center rounded bg-primary px-6 py-2 font-medium text-gray hover:bg-opacity-90"
                      type="submit"
                    >
                      Save
                    </button> */}
                    <SaveButton
                      onClick={async () => {
                        await changeProfilePicture();
                      }}
                    >
                      Save
                    </SaveButton>
                  </div>
                </form>
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

export default Settings;
