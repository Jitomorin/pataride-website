import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";

const filters = {
  makes: {
    id: "make",
    name: "Make",
    options: [
      { value: "", label: "All", checked: true },
      { value: "Toyota", label: "Toyota", checked: false },
      { value: "Nissan", label: "Nissan", checked: false },
      { value: "Honda", label: "Honda", checked: false },
      { value: "Mitsubishi", label: "Mitsubishi", checked: false },
      { value: "Mercedes-Benz", label: "Mercedes-Benz", checked: false },
      { value: "BMW", label: "BMW", checked: false },
      { value: "Audi", label: "Audi", checked: false },
      { value: "Volkswagen", label: "Volkswagen", checked: false },
      { value: "Land Rover", label: "Land Rover", checked: false },
      { value: "Subaru", label: "Subaru", checked: false },
      { value: "Suzuki", label: "Suzuki", checked: false },
      { value: "Isuzu", label: "Isuzu", checked: false },
      { value: "Ford", label: "Ford", checked: false },
      { value: "Chevrolet", label: "Chevrolet", checked: false },
      { value: "Hyundai", label: "Hyundai", checked: false },
      { value: "Kia", label: "Kia", checked: false },
    ],
  },
  categories: {
    id: "category",
    name: "Category",
    options: [
      { value: "", label: "All", checked: true },
      { value: "executives", label: "Executives", checked: false },
      { value: "tours", label: "Tours", checked: false },
      { value: "movers", label: "Movers", checked: false },
    ],
  },
  seats: {
    id: "seats",
    name: "Seats",
    options: [
      { value: "", label: "All", checked: true },
      { value: 2, label: "2 seats", checked: false },
      { value: 4, label: "4 seats", checked: false },
      { value: 5, label: "5 seats", checked: false },
      { value: 7, label: "7 seats", checked: false },
      { value: 8, label: "8 seats", checked: false },
    ],
  },
  fuelType: {
    id: "fuel Type",
    name: "Fuel Type",
    options: [
      { value: "", label: "All", checked: true },
      { value: "petrol", label: "Petrol", checked: false },
      { value: "diesel", label: "Diesel", checked: false },
    ],
  },
};

export default function FilterModal({ applyFilters }: any) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [selectedCategory, setSelectedCategory] = useState(
    filters.categories.options[0]
  );
  const [selectedFuelType, setSelectedFuelType] = useState(
    filters.fuelType.options[0]
  );
  const [selectedMake, setSelectedMake] = useState(filters.makes.options[0]);

  const handleApplyFilters = () => {
    const filters = {
      category: selectedCategory,
      fuelType: selectedFuelType,
      make: selectedMake,
    };
    applyFilters(filters);
    onClose();
  };
  const handleResetFilters = () => {
    setSelectedCategory(filters.categories.options[0]);
    setSelectedFuelType(filters.fuelType.options[0]);
    setSelectedMake(filters.makes.options[0]);
  };

  return (
    <>
      <Button
        variant="light"
        className="flex space-x-2  font-semibold rounded-lg text-primary "
        onPress={onOpen}
      >
        <span>Filters</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6 text-primary font-semibold"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z"
          />
        </svg>
      </Button>
      <Modal
        backdrop="blur"
        isDismissable={false}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalContent className="rounded-lg shadow-lg">
          <ModalHeader className="flex flex-col gap-1">Filters</ModalHeader>
          <ModalBody>
            <div className="grid grid-cols-3">
              <div className="flex flex-col space-y-2 justify-center">
                <label className="text-center font-semibold">Category</label>
                {/* Category */}
                <Dropdown className="rounded-lg text-lg">
                  <DropdownTrigger>
                    <Button
                      className="rounded-lg  text-primary-800"
                      variant="light"
                    >
                      {selectedCategory.label}
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu aria-label="Static Actions">
                    {filters.categories.options.map((category: any) => (
                      <DropdownItem
                        className="rounded-none"
                        onClick={() => setSelectedCategory(category)}
                      >
                        {category.label}
                      </DropdownItem>
                    ))}
                  </DropdownMenu>
                </Dropdown>
              </div>
              <div className="flex flex-col space-y-2 justify-center">
                <label className="text-center font-semibold">Make</label>
                {/* Make */}
                <Dropdown className="rounded-lg">
                  <DropdownTrigger>
                    <Button
                      className="rounded-lg  text-primary-800"
                      variant="light"
                    >
                      {selectedMake.label}
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu aria-label="Static Actions">
                    {filters.makes.options.map((make: any) => (
                      <DropdownItem
                        className="rounded-none"
                        onClick={() => setSelectedMake(make)}
                      >
                        {make.label}
                      </DropdownItem>
                    ))}
                  </DropdownMenu>
                </Dropdown>
              </div>
              <div className="flex flex-col space-y-2 justify-center">
                <label className="text-center font-semibold">Fuel Type</label>
                {/* Fuel Type */}
                <Dropdown className="rounded-lg">
                  <DropdownTrigger>
                    <Button
                      className="rounded-lg  text-primary-800"
                      variant="light"
                    >
                      {selectedFuelType.label}
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu aria-label="Static Actions">
                    {filters.fuelType.options.map((fuelType: any) => (
                      <DropdownItem
                        className="rounded-none"
                        onClick={() => setSelectedFuelType(fuelType)}
                      >
                        {fuelType.label}
                      </DropdownItem>
                    ))}
                  </DropdownMenu>
                </Dropdown>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              onPress={handleResetFilters}
              className="rounded-lg"
              color="danger"
              variant="light"
            >
              Reset
            </Button>
            <Button
              className="rounded-lg"
              color="primary"
              onPress={handleApplyFilters}
            >
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
