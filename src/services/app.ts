import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from "./baseQuery";
import {
  DataModelArray,
  DataModel,
  IMockup,
  SingleRenderRes,
  SingleRenderReq,
} from "./types";

export const appApi = createApi({
  reducerPath: "appApi",
  baseQuery: baseQuery,
  endpoints: (builder) => ({
    getMockups: builder.query<DataModelArray<IMockup>, any>({
      query: () => `/mockups`,
    }),
    generateSingleRender: builder.mutation<
      DataModel<SingleRenderRes>,
      Partial<SingleRenderReq>
    >({
      query: (payload) => ({
        url: `renders`,
        method: "POST",
        body: payload,
      }),
    }),
  }),
});

export const {} = appApi;
