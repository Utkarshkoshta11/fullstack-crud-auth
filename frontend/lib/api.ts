const API_URL = process.env.NEXT_PUBLIC_API_URL;

console.log("API_URL at runtime:", API_URL);

if (!API_URL) {
  throw new Error("NEXT_PUBLIC_API_URL is not defined");
}

type ApiOptions = RequestInit & {
  auth?: boolean;
};

export async function apiFetch(
  path: string,
  options: ApiOptions = {}
) {
  const { auth = false, ...fetchOptions } = options;

  console.log("➡️ apiFetch called");
  console.log("➡️ URL:", `${API_URL}${path}`);
  console.log("➡️ auth:", auth);
  console.log("➡️ fetchOptions:", fetchOptions);

  const res = await fetch(`${API_URL}${path}`, {
    ...fetchOptions,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(fetchOptions.headers || {})
    }
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("❌ API error response:", text);
    throw new Error(text || "API request failed");
  }

  return res.json();
}
