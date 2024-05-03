import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import DeliveriesTable from "@/components/BookingsTable";
import React, { useEffect, useMemo, useState } from "react";
import { useAuthContext } from "@/contexts/AuthContext";
import { getAllData, getFilteredData } from "@/utils/firebase/firestore";
import BookingsTable from "@/components/BookingsTable";
import Conversation from "@/components/Conversation";
import Messages from "@/components/Messages";
import { useRouter } from "next/router";

function Chats() {
  const [chats, setChats] = useState([]);
  const [users, setUsers] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [usersLoading, setUsersLoading] = useState(true);
  const { user, loading }: any = useAuthContext();
  const router = useRouter();

  // const usersData = useMemo(() => fetchUsersData(), [users]);
  // const chatsData = useMemo(() => fetchChatData(), [chats]);

  useEffect(() => {
    const fetchChatData = async () => {
      setDataLoading(true);
      await getFilteredData("chats", "userID", "==", user.uid).then(
        (chatsRes: any) => {
          // sort by date in field called delivery_timestamp
          chatsRes.sort((a: any, b: any) => {
            return b.createdAt - a.createdAt;
          });
          setChats(chatsRes);
          setDataLoading(false);
          console.log("data chats:", chatsRes);
          return chatsRes;
        }
      );
    };
    const fetchUsersData = async () => {
      setUsersLoading(true);
      await getAllData("users").then((usersRes: any) => {
        setUsers(usersRes);
        setUsersLoading(false);
        console.log("data user:", usersRes);
        return usersRes;
      });
    };
    if (loading) return;
    if (!user) router.push("/login");
    else {
      fetchChatData();
      fetchUsersData();
    }
  }, [user]);

  return (
    <DefaultLayout>
      <div className="mx-auto min-h-screen">
        <Breadcrumb pageName="Chats" />
        <div className="w-full h-full min-h-screen ">
          <div className="flex space-x-4">
            <div className="w-80 h-screen dark:bg-gray-800 bg-white shadow-lg rounded-lg p-2 hidden md:block">
              <div className="h-full overflow-y-auto">
                <div className="search-chat flex p-3">
                  <input
                    className="p-2 w-full  border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    type="text"
                    placeholder="Search Messages"
                  />
                </div>
                <div className="text-lg font-semibol text-gray-600 dark:text-gray-200 p-3">
                  Recent
                </div>
                {!dataLoading && !usersLoading ? (
                  <Conversation
                    chats={chats}
                    users={users}
                    loading={dataLoading}
                  />
                ) : (
                  <></>
                )}
              </div>
            </div>
            <div className="flex-grow  h-screen p-2 rounded-md">
              {!dataLoading && !usersLoading ? (
                <Messages chats={chats} users={users} loading={dataLoading} />
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

export default Chats;
