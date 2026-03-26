type FetchOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  body?: unknown;
  headers?: Record<string, string>;
  token?: string;
};

export async function apiFetch(endpoint: string, options: FetchOptions = {}) {
  const { method = "GET", body, headers = {}, token: serverToken } = options;

  let token: string | null = serverToken || null;

  if (typeof window !== "undefined" && !token) {
    const rawToken = sessionStorage.getItem("accessToken");
    token =
      rawToken && rawToken !== "undefined" && rawToken !== "null"
        ? JSON.parse(rawToken)
        : null;
  }

  const isFormData = body instanceof FormData;

  const request = async (accessToken?: string | null) => {
    return fetch(`${process.env.BASE_URL}${endpoint}`, {
      method,
      headers: {
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
        ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
        ...headers,
      },
      credentials: "include",
      body: body ? (isFormData ? body : JSON.stringify(body)) : undefined,
    });
  };

  let res = await request(token);

  if (res.status === 401) {
    try {
      const refreshRes = await fetch(`${process.env.BASE_URL}/auth/refresh`, {
        method: "GET",
        credentials: "include",
      });

      const refreshData = await refreshRes.json();
      const newToken =
        refreshData?.data?.accessToken || refreshData?.accessToken;

      if (!newToken) throw new Error("Refresh token failed");

      if (typeof window !== "undefined") {
        sessionStorage.setItem("accessToken", JSON.stringify(newToken));
      }

      res = await request(newToken);
    } catch {
      if (typeof window !== "undefined") {
        sessionStorage.clear();
        window.location.href = "/login";
      }
      throw new Error("Session expired");
    }
  }

  const data = await res.json();

  if (!res.ok) throw new Error(data.message || "Something went wrong");

  return data;
}
