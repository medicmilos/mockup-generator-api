import { store } from "@/redux/store";
import {
  BaseQueryFn,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import { Mutex } from "async-mutex";

const baseUrl = `https://design-copilot-laravel-develop.gitlab.designcopilot.io/api/v1/internal/`;

// Create a new mutex
const mutex = new Mutex();

const baseQueryTemp = fetchBaseQuery({
  baseUrl,
  prepareHeaders: (headers) => {
    let accessToken = store.getState().appReducer.accessToken || null;

    if (accessToken) {
      headers.set("authorization", `Bearer ${accessToken}`);
      headers.set("Accept", "application/json");
    }

    return headers;
  },
});

const customFetchBase: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  // wait until the mutex is available without locking it
  await mutex.waitForUnlock();
  let result = await baseQueryTemp(args, api, extraOptions);
  if (result.error && result.error.status === 401) {
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();

      release();
    } else {
      // wait until the mutex is available without locking it
      await mutex.waitForUnlock();
      result = await baseQueryTemp(args, api, extraOptions);
    }
  }

  return result;
};

export default customFetchBase;
