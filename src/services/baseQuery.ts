import { store } from "@/redux/store";
import {
  BaseQueryFn,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import { Mutex } from "async-mutex";

const baseUrl = `${API_BASE_URL}`;

// Create a new mutex
const mutex = new Mutex();

let csrfToken: string | null = null;

const baseQuery = fetchBaseQuery({
  baseUrl,
  prepareHeaders: (headers) => {
    let apiKey = store.getState().appReducer.apiKey || null;

    if (apiKey) {
      headers.set("X-API-KEY", `${apiKey}`);
      headers.set("Accept", "application/json");

      if (csrfToken) {
        headers.set("X-CSRF-Token", csrfToken);
      }
    }
    return headers;
  },
});

const fetchCSRFToken = async () => {
  const response = await fetch(`https://httpbin.org/get`, {
    // const response = await fetch(`${baseUrl}csrf-token-endpoint`, {
    method: "GET",
    headers: {
      "X-API-KEY": store.getState().appReducer.apiKey || "",
      Accept: "application/json",
    },
  });

  if (response.ok) {
    const data = await response.json();
    return data.origin;
    // return data.csrfToken;
  }

  throw new Error("Failed to fetch CSRF token");
};

const customFetchBase: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  await mutex.waitForUnlock();

  if (!csrfToken) {
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();
      try {
        csrfToken = await fetchCSRFToken();
      } catch (error) {
        console.error("Error fetching CSRF token:", error);
      } finally {
        release();
      }
    } else {
      await mutex.waitForUnlock();
    }
  }

  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();

      try {
        csrfToken = await fetchCSRFToken();
      } catch (error) {
        console.error("Error refreshing CSRF token:", error);
      } finally {
        release();
      }

      result = await baseQuery(args, api, extraOptions);
    } else {
      await mutex.waitForUnlock();
      result = await baseQuery(args, api, extraOptions);
    }
  }

  return result;
};

export default customFetchBase;
