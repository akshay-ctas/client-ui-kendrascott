"use client";

import { useAddress } from "@/context/AddressContext";
import { useAuth } from "@/context/AuthContext";
import { Edit2, Trash2 } from "lucide-react";
import AddAddressForm from "../checkout/AddAddresses";

export default function AddressesContent() {
  const {
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 ">
          <span className="text-xs tracking-[0.25em] uppercase text-amber-500 font-semibold">
            Shipping Addresses
          </span>
        </div>
      </div>

      <div className=" h-px bg-linear-to-r from-amber-400/40 via-stone-700 to-transparent" />

      {addresses.length === 0 ? (
        <p className="text-gray-500">No addresses found.</p>
      ) : (
        <div className="grid grid-cols-1  md:grid-cols-3 gap-4">
          {addresses.map((addr) => (
            <div
              key={addr._id}
              className={`flex items-start p-4  rounded-sm border border-yellow-200  hover:scale-102  transition  bg-yellow-50`}
            >
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
            </div>
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
