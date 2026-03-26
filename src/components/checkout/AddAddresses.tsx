"use client";

import { addAddress, editAddress } from "@/app/actions/address.server";
import { Address } from "@/context/AddressContext";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

type AddressFormData = {
  fullName: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  phone: string;
  isDefault: boolean;
};

const initialForm: AddressFormData = {
  fullName: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  country: "",
  zipCode: "",
  phone: "",
  isDefault: false,
};

type AddAddressFormProps = {
  userId: string;
  onClose: () => void;
  token: string;
  editUserData?: Address;
};

export default function AddAddressForm({
  userId,
  token,
  onClose,
  editUserData,
}: AddAddressFormProps) {
  const [form, setForm] = useState<AddressFormData>(
    editUserData
      ? {
          fullName: editUserData.fullName || "",
          addressLine1: editUserData.addressLine1 || "",
          addressLine2: editUserData.addressLine2 || "",
          city: editUserData.city || "",
          state: editUserData.state || "",
          country: editUserData.country || "",
          zipCode: editUserData.zipCode || "",
          phone: editUserData.phone || "",
          isDefault: editUserData.isDefault || false,
        }
      : initialForm,
  );

  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (
      !form.fullName ||
      !form.addressLine1 ||
      !form.city ||
      !form.state ||
      !form.country ||
      !form.zipCode ||
      !form.phone
    ) {
      alert("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);

      if (editUserData) {
        await editAddress(userId, form, token, editUserData._id);
      } else {
        await addAddress(userId, form, token);
      }

      await queryClient.invalidateQueries({ queryKey: ["addresses", userId] });
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to save address");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="space-y-4"
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <h3 className="text-lg font-semibold">Add New Address</h3>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Full Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="fullName"
          value={form.fullName}
          onChange={handleChange}
          placeholder="John Doe"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Address Line 1 <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="addressLine1"
          value={form.addressLine1}
          onChange={handleChange}
          placeholder="House No, Street Name"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Address Line 2{" "}
          <span className="text-gray-400 text-xs">(Optional)</span>
        </label>
        <input
          type="text"
          name="addressLine2"
          value={form.addressLine2}
          onChange={handleChange}
          placeholder="Apartment, Suite, etc."
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            City <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="city"
            value={form.city}
            onChange={handleChange}
            placeholder="Mumbai"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            State <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="state"
            value={form.state}
            onChange={handleChange}
            placeholder="Maharashtra"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Country <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="country"
            value={form.country}
            onChange={handleChange}
            placeholder="India"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Zip Code <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="zipCode"
            value={form.zipCode}
            onChange={handleChange}
            placeholder="400001"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Phone <span className="text-red-500">*</span>
        </label>
        <input
          type="tel"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="+91 9876543210"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          name="isDefault"
          id="isDefault"
          checked={form.isDefault}
          onChange={handleChange}
          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
        <label htmlFor="isDefault" className="text-sm text-gray-700">
          Set as default address
        </label>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition"
        >
          {editUserData
            ? loading
              ? "Updating..."
              : "Update Address"
            : loading
              ? "Saving..."
              : "Save Address"}
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onClose();
          }}
          className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-50 transition"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
