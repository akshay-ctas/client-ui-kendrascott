"use client";

import { deleteAddress } from "@/app/actions/address.server";
import { getAddresses } from "@/services/user.service";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

export type Address = {
  _id: string;
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  phone: string;
  isDefault: boolean;
};

type AddressContextType = {
  addresses: Address[];
  selectedId: string | null;
  setSelectedId: (id: string) => void;
  isLoading: boolean;
  isError: boolean;
  loading: boolean;
  showForm: boolean;
  setShowForm: (val: boolean) => void;
  showEditForm: boolean;
  setShowEditForm: (val: boolean) => void;
  editUserData: Address | null;
  setEditUserData: (addr: Address | null) => void;
  handleEditAddress: (addr: Address) => void;
  handleDeleteAddress: (addressId: string) => Promise<void>;
};

const AddressContex = createContext<AddressContextType | undefined>(undefined);

export function AddressProvider({ children }: { children: React.ReactNode }) {
  const { user, accessToken } = useAuth();
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["addresses", user?.id],
    queryFn: () => getAddresses(user!.id),
    enabled: !!user,
  });

  const addresses: Address[] = data?.data?.addresses ?? data?.addresses ?? [];

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editUserData, setEditUserData] = useState<Address | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (addresses.length > 0 && !selectedId) {
      const defaultAddr = addresses.find((a) => a.isDefault);
      setSelectedId(defaultAddr?._id || addresses[0]._id);
    }
  }, [addresses, selectedId]);

  const handleEditAddress = (addr: Address) => {
    setShowEditForm(true);
    setEditUserData(addr);
  };

  const handleDeleteAddress = async (addressId: string) => {
    if (!user || !accessToken) return;
    try {
      setLoading(true);
      await deleteAddress(user.id, accessToken, addressId);
      await queryClient.invalidateQueries({
        queryKey: ["addresses", user.id],
      });
    } catch (err) {
      console.error(err);
      alert("Failed to delete address");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AddressContex.Provider
      value={{
        addresses,
        selectedId,
        setSelectedId,
        isLoading,
        isError,
        loading,
        showForm,
        setShowForm,
        showEditForm,
        setShowEditForm,
        editUserData,
        setEditUserData,
        handleEditAddress,
        handleDeleteAddress,
      }}
    >
      {children}
    </AddressContex.Provider>
  );
}

export function useAddress() {
  const context = useContext(AddressContex);
  if (!context) {
    throw new Error("useAddress must be used within an AddressProvider");
  }
  return context;
}
