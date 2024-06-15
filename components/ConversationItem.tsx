import React from "react";

const ConversationItem = ({
  active,
  pressFunction,
  time,
  name,
  message,
  profileURL,
  isAdmin,
}: any) => {
  const _class = active ? "bg-gray-100" : "bg-white";
  return (
    <div>
      <div
        onClick={() => {
          pressFunction();
        }}
        className={`conversation-item p-1  hover:bg-gray-150 m-1 rounded-md ${_class} hover:bg-gray-100 transition-all ease-in-out`}
      >
        <div className={"flex items-center p-2  cursor-pointer  "}>
          <div className="w-7 h-7 m-1">
            <img
              className="rounded-full"
              src={profileURL === "" ? "/images/profile.png" : profileURL}
              alt="avatar"
            />
          </div>
          <div className="flex-grow p-2">
            {isAdmin && (
              <div className="text-xs font-semibold text-red-600">Admin</div>
            )}
            <div className="flex justify-between text-md ">
              <div className="text-sm font-medium text-gray-700 dark:text-gray-200">
                {name}
              </div>
              <div className="text-xs text-gray-400 dark:text-gray-300">
                {time}
              </div>
            </div>

            <div className="text-sm text-gray-500 dark:text-gray-400  w-40 truncate">
              {message}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConversationItem;
