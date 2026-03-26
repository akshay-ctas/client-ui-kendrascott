"use server";

export type AddressFormData = {
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

export async function addAddress(
  userId: string,
  address: AddressFormData,
  token: string,
) {
  if (!token) throw new Error("User not authenticated");

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/${userId}/addresses`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(address),
    },
  );
  if (!res.ok) throw new Error("Failed to save address");

  return { success: true };
}

export async function editAddress(
  userId: string,
  address: AddressFormData,
  token: string,
  addressId: string,
) {
  if (!token) throw new Error("User not authenticated");

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/${userId}/addresses/${addressId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(address),
    },
  );
  if (!res.ok) throw new Error("Failed to save1 address");

  return { success: true };
}

export async function deleteAddress(
  userId: string,
  token: string,
  addressId: string,
) {
  if (!token) throw new Error("User not authenticated");

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/${userId}/addresses/${addressId}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  );
  if (!res.ok) throw new Error("Failed to save address");

  return { success: true };
}
