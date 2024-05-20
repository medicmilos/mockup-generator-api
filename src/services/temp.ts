import { createApi } from "@reduxjs/toolkit/query/react";
import baseQueryTemp from "./baseQueryTemp";
import { DataModel, DataModelArray } from "./types";

interface Project {
  id: number;
  uuid: string;
  user_id: number;
  name: string;
  project_id?: number;
  psd_availability_id: number;
  psd_category_id: number;
  thumbnail: string;
}

type assetFit = "contain" | "cover" | "stretch";

export interface SmartObject {
  id: number;
  uuid: string;
  mockup_id: number;
  smart_object_name: string;
  smart_object_uuid: string;
  top: number;
  left: number;
  width: number;
  height: number;
  global_asset_top: number | null;
  global_asset_left: number | null;
  global_asset_width: number | null;
  global_asset_height: number | null;
  thumbnail: string;
  print_area: 1 | 0;
  fit: assetFit;
}

export interface DesignAsset {
  id: number;
  user_id: number;
  name: string;
  uuid: string;
  smart_object_id: number;
  asset_path: string;
  top: number | null;
  left: number | null;
  width: number | null;
  height: number | null;
  design_area_width: number | null;
  design_area_height: number | null;
  design_area_left: number | null;
  design_area_top: number | null;
  rotate: number | null;
  print_area?: number;
  fit?: assetFit;
  original_design_id: number;
}

export const tempApi = createApi({
  reducerPath: "tempApi",
  baseQuery: baseQueryTemp,
  endpoints: (builder) => ({
    getMyProjects: builder.query<DataModelArray<Project>, void>({
      query: () => `mockup/catalogs/my_projects`,
    }),
    getMockupSmartObjects: builder.query<
      DataModelArray<SmartObject>,
      { mockup_id: number }
    >({
      query: ({ mockup_id }) => `mockups/${mockup_id}/smart-objects`,
    }),
    updateDesignAsset: builder.mutation<
      DataModel<DesignAsset>,
      Partial<DesignAsset>
    >({
      query: (payload) => ({
        url: `assets/${payload.id}`,
        method: "PUT",
        body: payload,
      }),
    }),
  }),
});

export const {} = tempApi;
