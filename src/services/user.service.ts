import { apiFetch } from "@/lib/api";

export const getAddresses = async (userId: string) => {
  return await apiFetch(`/users/${userId}/addresses`, {
    method: "GET",
  });
};

export const getMe = async () => {
  return await apiFetch(`/users/me`, {
    method: "GET",
  });
};

export const getEditUser = async (data: FormData) => {
  return await apiFetch(`/users`, {
    method: "PATCH",
    body: data,
  });
};

export type ChangePasswordType = {
  oldPassword: string;
  newPassword: string;
};

export const changePassword = async (data: ChangePasswordType) => {
  return await apiFetch(`/auth/change-password`, {
    method: "POST",
    body: data,
  });
};
export const getwish = async () => {
  return await apiFetch(`/users/wish`, {
    method: "GET",
  });
};
