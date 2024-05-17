import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from "./baseQuery";
import { DataModelArray, IMockup } from "./types";

export const appApi = createApi({
  reducerPath: "appApi",
  baseQuery: baseQuery,
  endpoints: (builder) => ({
    getMockups: builder.query<DataModelArray<IMockup>, any>({
      query: () => `/mockups`,
    }),
  }),
});

export const {} = appApi;
