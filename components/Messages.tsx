import {
  AddMessageToChat,
  deleteDocument,
  startChatListener,
} from "@/utils/firebase/firestore";
import { getTimeSince, getUser } from "@/utils/formatString";
import { Menu, Transition } from "@headlessui/react";
import React, { Fragment, useState } from "react";

const Messages = ({
  users,
  selectedChat,
  setSelectedChat,
  currentUser,
}: any) => {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const senderUID = selectedChat.users.find(
    (user: any) => user === currentUser.uid
  );
  const recieverUID = selectedChat.users.find(
    (user: any) => user !== currentUser.uid
  );
  const sender = getUser(senderUID, users) && getUser(senderUID, users);
  const reciever = getUser(recieverUID, users) && getUser(recieverUID, users);

  const sendMessage = async () => {
    await AddMessageToChat(selectedChat.uid, {
      message,
      seen: false,
      sender: senderUID,
      timestamp: new Date(),
    }).then((res) => {});
  };

  // Start listening for real-time updates
  startChatListener(selectedChat.uid, (data) => {
    setSelectedChat(data);
  });

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      // Call your function here
      setLoading(true);
      sendMessage().then(() => {
        setMessage("");
        setLoading(false);
      });
    }
  };

  return (
    <div className="flex-grow h-full flex flex-col">
      <div className="w-full h-15 p-1 bg-gray-800  shadow-md rounded-xl rounded-bl-none rounded-br-none">
        <div className="flex p-2 align-middle items-center">
          <div className="border rounded-full p-1/2">
            <img
              className="w-14 h-14 rounded-full"
              src={
                reciever.profileUrl === ""
                  ? "/images/profile.png"
                  : reciever.profileUrl
              }
              alt="avatar"
            />
          </div>
          <div className="flex-grow p-2">
            <div className="text-lg text-white font-semibold">
              {reciever.fullName}
            </div>
          </div>
          <div className="p-2 text-white cursor-pointer transition-all ease-in-out rounded-full">
            <Menu as="div" className="relative inline-block text-left">
              <div>
                <Menu.Button className="inline-flex items-center w-full justify-center gap-x-1.5 rounded-md bg-transparent px-3 py-2 text-sm font-semibold text-gray-900 ">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-white"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                    />
                  </svg>
                </Menu.Button>
              </div>

              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="py-1">
                    <Menu.Item>
                      <button
                        onClick={async () => {
                          await deleteDocument("chats", selectedChat.uid).then(
                            () => {
                              setSelectedChat({});
                            }
                          );
                        }}
                        className={`block px-4 py-2 text-lg w-full text-left text-red-700 font-semibold hover:bg-gray-50`}
                      >
                        Delete chat
                      </button>
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </div>
      </div>
      <div className="w-full flex-grow  bg-white shadow-lg rounded-lg my-2 p-2 overflow-y-auto">
        {selectedChat.chat.length === 0 ? (
          <div className="flex h-full  justify-center">
            <h1 className="text-3xl text-gray-400 font-semibold">
              Send your first message
            </h1>
          </div>
        ) : (
          <>
            {selectedChat.chat.map((message: any) => {
              if (message.sender === sender.uid) {
                return (
                  <div className="flex justify-end">
                    <div className="flex items-end bg-gray-500 dark:bg-gray-800 m-1 rounded-xl rounded-br-none  w-auto max-w-[75%] lg:max-w-[50%]">
                      <div className="p-2">
                        <div className="text-gray-200">{message.message}</div>
                        <div className="text-xs text-gray-400">
                          {getTimeSince(message.timestamp)}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              } else {
                return (
                  <div className="flex items-end w-3/4 max-w-1/2">
                    <div className="p-3 bg-gray-300 dark:bg-gray-800 mx-3 my-1 rounded-2xl rounded-bl-none w-auto max-w-3/4 lg:max-w-[50%]">
                      <div className="text-gray-700 dark:text-gray-200">
                        {message.message}
                      </div>
                      <div className="text-xs text-gray-400">
                        {getTimeSince(message.timestamp)}
                      </div>
                    </div>
                  </div>
                );
              }
            })}
          </>
        )}
        {/* <div className="flex items-end w-3/4">
          <div className="p-3 bg-gray-300 dark:bg-gray-800 mx-3 my-1 rounded-2xl rounded-bl-none sm:w-3/4 md:w-3/6">
            <div className="text-gray-700 dark:text-gray-200">
              gsegjsghjbdg bfb sbjbfsj fsksnf jsnfj snf nnfnsnfsnj
            </div>
            <div className="text-xs text-gray-400">2 day ago</div>
          </div>
        </div>
        <div className="flex items-end w-3/4">
          <div className="p-3 bg-gray-300 dark:bg-gray-800  mx-3 my-1 rounded-2xl rounded-bl-none sm:w-3/4 md:w-3/6">
            <div className="text-gray-700 dark:text-gray-200">
              gsegjsghjbdg bfb sbjbfsj fsksnf jsnfj snf nnfnsnfsnj
            </div>
            <div className="text-xs text-gray-400">1 day ago</div>
          </div>
        </div>

        <div className="flex justify-end">
          <div className="flex items-end w-auto bg-gray-500 dark:bg-gray-800 m-1 rounded-xl rounded-br-none sm:w-3/4 md:w-auto">
            <div className="p-2">
              <div className="text-gray-200">Hello ? How Can i help you ?</div>
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <div className="flex items-end w-3/4 bg-gray-500 dark:bg-gray-800 m-1 rounded-xl rounded-br-none sm:w-3/4 md:w-auto">
            <div className="p-2">
              <div className="text-gray-200">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <div className="flex items-end w-3/4 bg-gray-500 dark:bg-gray-800 m-1 rounded-xl rounded-br-none sm:w-3/4 max-w-xl md:w-auto">
            <div className="p-2">
              <div className="text-gray-200 ">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-end w-3/4">
          <div className="p-3 bg-gray-300 dark:bg-gray-800 mx-3 my-1 rounded-2xl rounded-bl-none sm:w-3/4 md:w-3/6">
            <div className="text-gray-700 dark:text-gray-200">
              Hello po ang pogi niyo :)
            </div>
            <div className="text-xs text-gray-400">just now</div>
          </div>
        </div> */}
      </div>
      <div className="h-15  p-3 rounded-xl rounded-tr-none rounded-tl-none bg-gray-100 dark:bg-gray-800">
        <div className="flex items-center">
          <div className="search-chat flex flex-grow p-2">
            {loading ? (
              <input
                disabled
                value={message}
                onKeyDown={handleKeyPress}
                onChange={(e) => {
                  setMessage(e.target.value);
                }}
                className="p-2 w-full  border-2 border-gray-300 bg-gray-300 rounded-md focus:outline-none focus:ring-0 focus:border-gray-300"
                type="text"
                placeholder="Type your message ..."
              />
            ) : (
              <input
                value={message}
                onKeyDown={handleKeyPress}
                onChange={(e) => {
                  setMessage(e.target.value);
                }}
                className="p-2 w-full  border-2 border-gray-300 rounded-md focus:outline-none focus:ring-0 focus:border-gray-300"
                type="text"
                placeholder="Type your message ..."
              />
            )}
            <div className="bg-gray-100 dark:bg-gray-800 dark:text-gray-200  flex justify-center items-center text-gray-400 rounded-r-md">
              {message === "" ? (
                <button
                  disabled
                  className="ml-2 bg-transparent opacity-60 text-[#f8d521] hover:scale-[1.03] text-lg transition-all ease-in-out font-semibold"
                >
                  Send
                </button>
              ) : (
                <button
                  onClick={() => {
                    setLoading(true);
                    sendMessage().then(() => {
                      setMessage("");
                      setLoading(false);
                    });
                  }}
                  className="ml-2 bg-transparent text-[#f8d521] hover:scale-[1.03] text-lg transition-all ease-in-out font-semibold"
                >
                  Send
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;
