import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from "./baseQuery";
import {
  DataModelArray,
  DataModel,
  IMockup,
  SingleRenderRes,
  SingleRenderReq,
  ICollection,
} from "./types";

export const appApi = createApi({
  reducerPath: "appApi",
  baseQuery: baseQuery,
  endpoints: (builder) => ({
    getMockups: builder.query<DataModelArray<IMockup>, { uuid: string | null }>(
      {
        query: ({ uuid }) => ({
          url: uuid ? `/mockups?collection_uuid=${uuid}` : `/mockups`,
          method: "GET",
        }),
      }
    ),
    getCollections: builder.query<DataModelArray<ICollection>, any>({
      query: () => `/collections`,
    }),
    generateSingleRender: builder.mutation<
      DataModel<SingleRenderRes>,
      FormData
    >({
      query: (payload) => ({
        url: `renders`,
        method: "POST",
        body: payload,
        formData: true,
      }),
    }),
  }),
});

export const {} = appApi;
