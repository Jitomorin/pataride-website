import { useEffect, useState } from "react";
import ProfileColumn from "./ProfileColumn";
import Snackbar from "./Snackbar";
import RegisterUserModal from "./RegisterUserModal";

const people = [
  {
    name: "Lindsay Walton",
    title: "Front-end Developer",
    department: "Optimization",
    email: "lindsay.walton@example.com",
    role: "Member",
    image:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  },
  // More people...
];

export default function UsersTable({ users }: any) {
  const [openProfile, setOpenProfile] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(users[0]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("Default Message");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  console.log("Users in table : ", users);

  useEffect(() => {
    setFilteredUsers(users);
  }, [users]);

  return (
    <div className="w-full">
      <ProfileColumn
        user={selectedUser}
        open={openProfile}
        setOpen={setOpenProfile}
        callSnackBar={(message: string) => {
          setSnackbarMessage(message);
          setSnackbarOpen(true);
        }}
      />
      <RegisterUserModal open={openModal} setOpen={setOpenModal} />
      <div className="lg:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">
            Users
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all the users in including their name, number, unique id,
            email and role.
          </p>
          <input
            type="text"
            className="p-2 w-1/2  border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            placeholder="Search for name, email, or uid..."
            onChange={(e: any) => {
              const res = users.filter(
                (user: any) =>
                  user.fullName
                    .toLowerCase()
                    .includes(e.target.value.toLowerCase()) ||
                  user.email
                    .toLowerCase()
                    .includes(e.target.value.toLowerCase()) ||
                  user.uid
                    .toLowerCase()
                    .includes(e.target.value.toLowerCase()) ||
                  user.role.toLowerCase().includes(e.target.value.toLowerCase())
              );
              // console.log("Filtered Cars: ", res);
              setFilteredUsers(res);
            }}
          />
        </div>

        {/* <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            type="button"
            className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Add user
          </button>
        </div> */}
      </div>
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    User ID
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Number
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Verified
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Role
                  </th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                    {/* <span className="sr-only">Edit</span> */}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {filteredUsers.map((person: any) => (
                  <tr key={person.uid}>
                    <td className="whitespace-nowrap py-5 pl-4 pr-3 text-sm sm:pl-0">
                      <div className="flex items-center">
                        <div className="h-11 w-11 flex-shrink-0">
                          <img
                            className="h-11 w-11 rounded-full"
                            src={
                              person!.profileURL !== ""
                                ? "/images/profile.png"
                                : person!.profileUrl
                            }
                            alt=""
                          />
                        </div>
                        <div className="ml-4">
                          <div className="font-medium text-gray-900">
                            {person.fullName}
                          </div>
                          <div className="mt-1 text-gray-500">
                            {person.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                      <span className="inline-flex items-center rounded-md  px-2 py-1 text-lg font-medium text-black ">
                        {person!.uid}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                      <div className="text-gray-900">{person.phoneNumber}</div>
                      {/* <div className="mt-1 text-gray-500">
                        {person.department}
                      </div> */}
                    </td>
                    <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                      {person!.isVerified ? (
                        <div className="mt-8 inline-flex items-center rounded-md bg-green-100 px-2 py-1 text-sm font-semibold text-green-700 ring-1 ring-inset ring-green-600/20">
                          Verified
                        </div>
                      ) : (
                        <div className="mt-8 inline-flex items-center rounded-md bg-red-100 px-2 py-1 text-sm font-semibold text-red-700 ring-1 ring-inset ring-green-600/20">
                          Not Verified
                        </div>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                      {person.role}
                    </td>
                    <td className="relative whitespace-nowrap py-5 pl-3 pr-4 text-center text-sm font-medium sm:pr-0">
                      <button
                        onClick={() => {
                          setSelectedUser(person);
                          setOpenProfile(true);
                        }}
                        className="text-indigo-600 hover:text-indigo-900 hover:underline "
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
  );
}
