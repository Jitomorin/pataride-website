import React from "react";
import ConversationItem from "./ConversationItem";
const Conversation = ({ chats, users }: any) => {
  const data = [
    {
      name: "Rey Jhon",
      time: "just now",
      message: "Hey there! Are you finish creating the chat app?",
      active: true,
    },
    {
      name: "Cherry Ann",
      time: "12:00",
      message: "Hello? Are you available tonight?",
    },
    {
      name: "Lalaine",
      time: "yesterday",
      message: "I'm thingking of resigning",
    },
    { name: "Princess", time: "1 day ago", message: "I found a job :)" },
    {
      name: "Charm",
      time: "1 day ago",
      message: "Can you me some chocolates?",
    },
    {
      name: "Garen",
      time: "1 day ago",
      message: "I'm the bravest of all kind",
    },
  ];
  console.log("conversations", chats);

  const getTimeSince = (timestamp: any) => {
    const oneDay = 24 * 60 * 60 * 1000; // Number of milliseconds in a day
    const currentTimestamp = Date.now(); // Current timestamp in milliseconds
    const difference = currentTimestamp - timestamp; // Difference between current timestamp and provided timestamp in milliseconds
    const daysDifference = Math.floor(difference / oneDay); // Convert difference to days

    return `${daysDifference} days ago`;
  };
  const getLatestElement = (array: any[]) => {
    // Sort the array based on the timestamps in descending order
    const sortedArray = array.slice().sort((a, b) => b.timestamp - a.timestamp);
    console.log("latest chat", sortedArray[0]);
    // Return the first element, which will be the one with the latest timestamp
    return sortedArray[0];
  };

  return (
    <div className="p-1">
      {chats.map((chat: any, index: number) => (
        <ConversationItem
          message={getLatestElement(chat.chat).message}
          time={getTimeSince(getLatestElement(chat.chat).timestamp)}
          name={"test"}
          active={true}
        />
      ))}
    </div>
  );
};

export default Conversation;
