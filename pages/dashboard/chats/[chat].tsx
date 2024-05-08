import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import CartColumn from "@/components/CartColumn";
import Divider from "@/components/Divider";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import ProductOverview from "@/components/ProductOverview";
import Snackbar from "@/components/Snackbar";
import Spinner from "@/components/Spinner";
import { useAuthContext } from "@/contexts/AuthContext";
import {
  addDataWithDocName,
  getAllRentalSlugs,
  getData,
  getDocument,
  getFilteredData,
  setPickupAndDropoffLocations,
  setProductStatus,
  setRentalAvailability,
  updateOrderStatus,
  updateOrderTransaction,
} from "@/utils/firebase/firestore";
import Axios from "axios";
import { uploadCoverImage } from "@/utils/firebase/storage";
import { getNumberOfDays } from "@/utils/formatDate";
import {
  calculatePrice,
  calculateSubtotal,
  formatNumber,
} from "@/utils/formatNumber";
import { GetServerSideProps } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
// import LocationPicker from "react-location-picker";
import { set } from "sanity";
import ExampleComponent from "@/components/ExampleComponent";
import styled from "styled-components";
import Link from "next/link";
import { StatusPill } from "@/components/StatusPill";
import ProgressBar from "@/components/ProgressBar";
import { PaidPill } from "@/components/PaidPill";
import { getUser } from "@/utils/formatString";
import Messages from "@/components/Messages";
import Conversation from "@/components/Conversation";

const defaultPosition = {
  lat: 27.9878,
  lng: 86.925,
};

interface Query {
  [key: string]: string;
}

function Chat(props: any) {
  const { user, loading }: any = useAuthContext();
  const { chat, users, pathName, settings }: any = props;
  const [transaction, setTransaction] = useState<any>({});
  const router = useRouter();
  const patarideCut = parseInt(settings.companyCut);
  const [chats, setChats] = useState();
  const [activeProduct, setActiveProduct] = useState("");
  const [chatLoading, setChatLoading] = useState(true);
  const [selectedChat, setSelectedChat] = useState(chat);
  const [snackbarMessage, setSnackbarMessage] = useState("Default Message");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [host, setHost]: any = useState({});
  const [sender, setSender]: any = useState({});
  const [reciever, setReceiver]: any = useState({});
  //   console.log("chats", chats);
  //   console.log("x", selectedChat);

  const refreshPage = () => {
    router.replace(router.asPath);
  };

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.push("/login");
    }
    // check if the other belongs to the user
    const checkChatUser = async () => {
      if (!chat.users.includes(user.uid)) {
        router.push("/dashboard/chats");
      }
      //   console.log("x", user);
      //   setChatLoading(false);
    };
    const recieverUID = chat.users.find(
      (userObject: any) => userObject !== user.uid
    );
    const senderUID = chat.users.find(
      (userObject: any) => userObject === user.uid
    );
    // console.log("pathname", router.pathname);

    const fetchUserData = async () => {
      //   console.log("start");
      await getDocument("users", senderUID).then((senderRes: any) => {
        setSender(senderRes);
        // console.log("sender", senderRes);
        getDocument("users", recieverUID).then((recieverRes: any) => {
          setReceiver(recieverRes);
          //   console.log("host", recieverRes);
          getFilteredData("chats", "users", "array-contains", user.uid).then(
            (chatsRes: any) => {
              // sort by date in field called delivery_timestamp
              chatsRes.sort((a: any, b: any) => {
                return b.createdAt - a.createdAt;
              });
              setChats(chatsRes);
              setChatLoading(false);
              //   console.log("data chats:", chatsRes);
              return chatsRes;
            }
          );
        });
      });
    };

    checkChatUser().then(() => {
      fetchUserData();
    });
  }, [user]);

  //  const senderUID = chat.users.find((user: any) => user === user.uid);
  //  const recieverUID = chat.users.find((user: any) => user !== user.uid);
  //  const sender = getUser(senderUID, users) && getUser(senderUID, users);
  //  const reciever =
  //    getUser(recieverUID, users) && getUser(recieverUID, users);
  if (chatLoading) {
    return (
      <DefaultLayout>
        <div className="mx-auto">
          <h1 className="text-xl">Loading...</h1>
        </div>
      </DefaultLayout>
    );
  } else {
    if (transaction) {
      return (
        <DefaultLayout>
          <div className="mx-auto min-h-screen">
            <Breadcrumb pageName="Chats" />
            <div className="w-full h-full min-h-screen ">
              <div className="flex space-x-4">
                <div className="w-80 h-screen dark:bg-gray-800 bg-white shadow-lg rounded-lg p-2 hidden md:block">
                  <div className="h-full overflow-y-auto">
                    <div className="text-lg font-semibol text-gray-600 dark:text-gray-200 p-3">
                      Recent
                    </div>
                    {!chatLoading ? (
                      <Conversation
                        router={router}
                        chats={chats}
                        users={users}
                        loading={chatLoading}
                        currentUser={user}
                        pathName={pathName}
                      />
                    ) : (
                      <></>
                    )}
                  </div>
                </div>
                <div className="flex-grow  h-screen p-2 rounded-md">
                  {!chatLoading ? (
                    <>
                      <Messages
                        setSelectedChat={setSelectedChat}
                        selectedChat={selectedChat}
                        users={users}
                        loading={chatLoading}
                        currentUser={user}
                      />
                    </>
                  ) : (
                    <></>
                  )}
                </div>
              </div>
            </div>
          </div>
        </DefaultLayout>
      );
    }
  }
}

export default Chat;

export const getServerSideProps: GetServerSideProps<any, Query> = async (
  ctx
) => {
  const { params = {} } = ctx;
  const users = await getData("users");
  //   console.log("useeeers", users);
  const chat = await getDocument("chats", params.chat);
  const settings = await getDocument("settings", "admin");

  const pathName = params.chat;

  if (!chat) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      chat: JSON.parse(JSON.stringify(chat)),
      users: JSON.parse(JSON.stringify(users)),
      settings: JSON.parse(JSON.stringify(settings)),
      pathName,
    },
  };
};
