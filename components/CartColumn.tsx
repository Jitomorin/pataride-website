import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { calculatePrice, formatNumber } from "@/utils/formatNumber";
import { removeProductFromCart } from "@/utils/firebase/firestore";
import { useRouter } from "next/router";

import Axios from "axios";

const PUBLIC_KEY = "ISPubKey_test_02dfb039-6730-49de-99ce-9ce630ac0198";

export default function CartColumn({
  cart,
  user,
  open,
  setOpen,
  callSnackBar,
}: {
  cart: any;
  user: any;
  open?: boolean;
  setOpen?: any;
  callSnackBar: any;
}) {
  const router = useRouter();
  //   const [open, setOpen] = useState(true);
  // const { user, loading } = useAuthContext();
  const [buttonText, setButtonText] = useState("Checkout");

  const calculateSubtotal = (cart: any) => {
    let subtotal = 0;
    cart.forEach((product: any) => {
      subtotal += calculatePrice(
        product.item.price,
        product.selectedDates[0].startDate,
        product.selectedDates[0].endDate
      );
    });
    return subtotal;
  };

  const payHandler = async (event: any) => {
    console.log("user: ", user);
    event.preventDefault();
    setButtonText("Processing");

    await Axios.post("https://sandbox.intasend.com/api/v1/checkout/", {
      public_key: "ISPubKey_test_cd5109e1-16d5-4961-a2ab-9f459db4f908",
      first_name: user?.fullName.split(" ")[0],
      last_name: user?.fullName.split(" ")[1],
      email: user?.email,
      phone_number: user?.phoneNumber,
      host: "http://localhost:3000/dashboard/home",
      redirect_url: "http://localhost:3000/dashboard/home",
      amount: calculateSubtotal(cart.products),
      currency: "KES",
    })
      .then((res: any) => {
        // setData(res.data);
        // router.push(res.data.url);
        // open link in new tab
        window.open(res.data.url, "_blank");
        console.log("Result: ", res);
      })
      .catch((error: any) => {
        console.log(error);
        setButtonText("Error");
      });
  };
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                    <div className="px-4 py-10 sm:px-6"></div>
                    <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                      <div className="flex items-start justify-between">
                        <Dialog.Title className="text-lg font-medium text-gray-900">
                          Shopping cart
                        </Dialog.Title>
                        <div className="ml-3 flex h-7 items-center">
                          <button
                            type="button"
                            className="relative -m-2 p-2 text-gray-400 hover:text-gray-500"
                            onClick={() => setOpen(false)}
                          >
                            <span className="absolute -inset-0.5" />
                            <span className="sr-only">Close panel</span>
                            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                      </div>

                      <div className="mt-8">
                        <div className="flow-root">
                          <ul
                            role="list"
                            className="-my-6 divide-y divide-gray-200"
                          >
                            {cart.products.map((product: any, index: any) => (
                              <li key={index} className="flex py-6">
                                <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                  <img
                                    src={product.item.image[0]}
                                    alt={product.item.name}
                                    className="h-full w-full object-cover object-center"
                                  />
                                </div>

                                <div className="ml-4 flex flex-1 flex-col">
                                  <div>
                                    <div className="flex justify-between text-base font-medium text-gray-900">
                                      <h3>
                                        <a
                                          href={`/rentals/${product.item.uid}`}
                                        >
                                          {product.item.name}
                                        </a>
                                      </h3>
                                      <p className="ml-4">
                                        {`${formatNumber(
                                          calculatePrice(
                                            product.item.price,
                                            product.selectedDates[0].startDate,
                                            product.selectedDates[0].endDate
                                          )
                                        )}Ksh`}
                                      </p>
                                    </div>
                                    <p className="mt-1 text-sm text-gray-500">
                                      {product.color}
                                    </p>
                                  </div>
                                  <div className="flex flex-1 items-end justify-between text-sm">
                                    <p className="text-gray-500">
                                      {`from: ${new Date(
                                        product.selectedDates[0].startDate
                                          .seconds * 1000
                                      ).toLocaleDateString()} to: ${new Date(
                                        product.selectedDates[0].endDate
                                          .seconds * 1000
                                      ).toLocaleDateString()}`}
                                    </p>

                                    <div className="flex">
                                      <button
                                        onClick={async () => {
                                          console.log(product.item);
                                          await removeProductFromCart(
                                            product.item,
                                            user.uid
                                          ).then((res) => {
                                            console.log(res);
                                            callSnackBar(res.message);
                                            router.push("/rentals");
                                          });
                                        }}
                                        type="button"
                                        className="font-medium text-indigo-600 hover:scale-105"
                                      >
                                        Remove
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                      <div className="flex justify-between text-base font-medium text-gray-900">
                        <p>Subtotal</p>
                        <p>{`${formatNumber(
                          calculateSubtotal(cart.products)
                        )}Ksh`}</p>
                      </div>
                      <p className="mt-0.5 text-sm text-gray-500">
                        Additional fees calculated at checkout.
                      </p>
                      <div className="mt-6">
                        <button
                          onClick={() => {
                            router.push("/dashboard/cart");
                          }}
                          className="flex items-center justify-center rounded-md border border-transparent bg-[#F8D521] px-6 py-3 text-base font-medium text-white shadow-sm hover:scale-105 transition-all ease-in-out"
                        >
                          Go to cart
                        </button>

                        {/* <PaystackButton
                          text="Checkout"
                          email={user?.email}
                          amount={calculateSubtotal(cart.products)}
                          publicKey={
                            "pk_test_883b466636fece57692b48a00f57007f7939b5ab"
                          }
                          onClose={() => {}}
                          onSuccess={() => {
                            console.log("success");
                          }}
                        /> */}
                      </div>
                      <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                        <p>
                          <button
                            type="button"
                            className="font-medium text-indigo-600 hover:scale-105 transition-all ease-in-out"
                            onClick={() => setOpen(false)}
                          >
                            Continue Shopping
                            <span aria-hidden="true"> &rarr;</span>
                          </button>
                        </p>
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
