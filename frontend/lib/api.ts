const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error("NEXT_PUBLIC_API_URL is not defined");
}

type ApiOptions = RequestInit & {
  auth?: boolean; // semantic flag
};

type ApiError = {
  message?: string;
};

export async function apiFetch<T = any>(
  path: string,
  options: ApiOptions = {}
): Promise<T> {
  const { auth = false, ...fetchOptions } = options;

  const res = await fetch(`${API_URL}${path}`, {
    ...fetchOptions,
    credentials: "include", // REQUIRED for cookie-based JWT
    headers: {
      "Content-Type": "application/json",
      ...(fetchOptions.headers || {}),
    },
  });

  if (!res.ok) {
    let errorMessage = "API request failed";

    try {
      const data: ApiError = await res.json();
      if (data?.message) errorMessage = data.message;
    } catch {
      // fallback if response is not JSON
      errorMessage = await res.text();
    }

    throw new Error(errorMessage);
  }

  return res.json();
}
