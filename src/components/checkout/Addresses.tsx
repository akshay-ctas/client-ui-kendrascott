"use client";

import { useAuth } from "@/context/AuthContext";
import { Dispatch, SetStateAction, useEffect } from "react";
import AddAddressForm from "./AddAddresses";
import { Edit2, Trash2 } from "lucide-react";
import { useAddress } from "@/context/AddressContext";

type AddressesProps = {
  setCheckout: Dispatch<
    SetStateAction<{
      addressId: string;
      paymentMethod: string;
    }>
  >;
};

export default function Addresses({ setCheckout }: AddressesProps) {
  const {
    selectedId,
    setSelectedId,
    addresses,
    handleEditAddress,
    handleDeleteAddress,
    showEditForm,
    setShowEditForm,
    editUserData,
    setEditUserData,
    showForm,
    setShowForm,
  } = useAddress();
  const { user, accessToken } = useAuth();

  useEffect(() => {
    if (selectedId) {
      setCheckout((prev) => ({ ...prev, addressId: selectedId }));
    }
  }, [selectedId, setCheckout]);

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Shipping Address</h2>

      {addresses.length === 0 ? (
        <p className="text-gray-500">No addresses found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {addresses.map((addr) => (
            <label
              key={addr._id}
              className={`flex items-start p-4 border rounded-lg cursor-pointer hover:border-blue-500 transition ${
                selectedId === addr._id
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-300"
              }`}
            >
              <input
                type="radio"
                name="selectedAddress"
                checked={selectedId === addr._id}
                onChange={() => setSelectedId(addr._id)}
                className="w-5 h-5 mt-1 text-blue-600 border-gray-300 focus:ring-2 focus:ring-blue-500 mr-4"
              />

              <div className="flex-1 space-y-1">
                <p className="font-semibold">
                  {addr.fullName}{" "}
                  {addr.isDefault && (
                    <span className="text-green-600 text-sm font-normal">
                      Default
                    </span>
                  )}
                </p>
                <p>
                  {addr.addressLine1} {addr.addressLine2 || ""}
                </p>
                <p>
                  {addr.city}, {addr.state}, {addr.country} - {addr.zipCode}
                </p>
                <p className="text-sm text-gray-600">Phone: {addr.phone}</p>
              </div>

              <div className="flex ml-2">
                <button
                  onClick={() => handleEditAddress(addr)}
                  className="p-2 text-blue-600  cursor-pointer rounded-full hover:bg-blue-100 hover:text-blue-950 transition"
                >
                  <Edit2 className="w-4 h-4" />
                </button>

                <button
                  onClick={() => handleDeleteAddress(addr._id)}
                  className="p-2 text-red-600  cursor-pointer  hover:bg-red-100 rounded-full hover:text-red-950 transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </label>
          ))}
        </div>
      )}

      {!showEditForm && (
        <button
          onClick={() => setShowForm(true)}
          className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-500 hover:text-blue-500 transition"
        >
          + Add New Address
        </button>
      )}
      {showForm && user && accessToken && (
        <AddAddressForm
          token={accessToken}
          userId={user.id}
          onClose={() => setShowForm(false)}
        />
      )}
      {showEditForm && user && accessToken && editUserData && (
        <AddAddressForm
          token={accessToken}
          userId={user.id}
          onClose={() => {
            setShowEditForm(false);
            setEditUserData(null);
          }}
          editUserData={editUserData}
        />
      )}
    </div>
  );
}
