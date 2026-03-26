import { apiFetch } from "@/lib/api";

type RegisterPayload = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  zipCode: string;
};

type LoginPayload = {
  email: string;
  password: string;
};

export const registerUser = async (data: RegisterPayload) => {
  return await apiFetch("/auth/register", {
    method: "POST",
    body: data,
  });
};

export const loginUser = async (data: LoginPayload) => {
  const res = await apiFetch("/auth/login", {
    method: "POST",
    body: data,
  });
  const accessToken = res.token?.accessToken;

  if (!accessToken) {
    throw new Error("No access token received");
  }
  const userRes = await apiFetch("/auth/self", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return { user: userRes?.user, accessToken };
};

export const sendOtpEmailVerify = async (data: { email: string }) => {
  return await apiFetch("/auth/send-otp", {
    method: "POST",
    body: data,
  });
};

export const otpVerifyEmail = async (data: { email: string; otp: string }) => {
  return await apiFetch("/auth/verify-email", {
    method: "POST",
    body: data,
  });
};

export const sendOtpForForgotPassword = async (data: { email: string }) => {
  return await apiFetch("/auth/forgot-password", {
    method: "POST",
    body: data,
  });
};

export const VerifyOtpForForgotPassword = async (data: {
  email: string;
  otp: string;
}) => {
  return await apiFetch("/auth/verify-reset-otp", {
    method: "POST",
    body: data,
  });
};
