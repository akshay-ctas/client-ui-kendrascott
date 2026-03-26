"use server";

import { cookies } from "next/headers";

export async function serverApiFetch(url: string, options: RequestInit = {}) {
  const cookieStore = await cookies();

  const token = cookieStore.get("accessToken")?.value;
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
  });

  return res.json();
}
