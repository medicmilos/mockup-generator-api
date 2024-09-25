import { appApi } from "@/services/app";
import { ICollection, IMockup, SingleRenderRes } from "@/services/types";
import { createSlice } from "@reduxjs/toolkit";
import { fitModes } from "./types";
import { SmartObject, tempApi } from "@/services/temp";
import { IAssetFileConfig } from "@/features/screens/editor/Editor";

interface AppState {
  themeMode: "inherit" | "light" | "dark" | undefined;
  apiKey: string;
  accessToken: string;
  selectedMockup: IMockup;
  color: string;
  fitMode: fitModes;
  singleRender: { data: SingleRenderRes; isLoading: boolean };
  activeSmartObject: SmartObject;
  design: {
    file?: File;
    url?: string;
  };
  activeDesignAsset: IAssetFileConfig;

  collections: ICollection[];
  mockups: {
    data: IMockup[];
    isLoading: boolean;
  };
}

const userPrefferedThemeMode = window.localStorage.getItem("app-theme");
const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
  ? "dark"
  : "light";

const dynamicMockupsApiKey = localStorage.getItem(
  "dynamicMockupsApiKey"
) as string;
const dynamicMockupsAccessToken = localStorage.getItem(
  "dynamicMockupsAccessToken"
) as string;

const initialState: AppState = {
  themeMode: (userPrefferedThemeMode ||
    systemTheme ||
    "light") as AppState["themeMode"],
  apiKey:
    "32c220b4-fe65-48ae-8f5a-424693e50ca7:a3781e846a816ffd9496e2ea0f921111ab8e562cbba2cba6c530bc5977c47357" ||
    "",
  accessToken: dynamicMockupsAccessToken || "",

  color: "#5753c6",
  fitMode: "contain",
  selectedMockup: null!,
  singleRender: {
    data: {
      export_label: "",
      export_path: "",
    },
    isLoading: false,
  },
  activeSmartObject: null! as any,
  design: {
    file: null!,
    url: "https://app-dynamicmockups-production.s3.eu-central-1.amazonaws.com/design/257/cat-doing-space-surfing.png",
  },
  activeDesignAsset: {
    id: 2360,
    design_area_height: 1104,
    design_area_left: 174,
    design_area_top: 208,
    design_area_width: 790,
    height: 722,
    rotate: 0,
    smartObjectHeight: 1457,
    smartObjectWidth: 1244,
    transformX: 174,
    transformY: 399,
    url: "",
    width: 790,

    left: 174,
    top: 399,
  },
  collections: [],
  mockups: { data: [], isLoading: true },
};

export const appSlice = createSlice({
  initialState,
  name: "appSlice",
  reducers: {
    setThemeMode(state, { payload }) {
      const root = window.document.documentElement;
      root.classList.remove("light", "dark", "light-theme", "dark-theme");
      root.classList.add(payload);
      state.themeMode = payload;
    },
    setApiKey(state, { payload }) {
      state.apiKey = payload;
      localStorage.setItem("dynamicMockupsApiKey", payload);
    },
    setAccessToken(state, { payload }) {
      state.accessToken = payload;
      localStorage.setItem("dynamicMockupsAccessToken", payload);
    },
    setSelectedMockup(state, { payload }) {
      state.selectedMockup = payload;
    },
    setColor(state, { payload }) {
      state.color = payload;
    },
    setFitMode(state, { payload }) {
      state.fitMode = payload;
    },
    updateActiveSmartObject(state, { payload }) {
      state.activeSmartObject = {
        ...state.activeSmartObject,
        print_area: payload.print_area,
        fit: payload.fit,

        global_asset_top: payload.global_asset_top,
        global_asset_left: payload.global_asset_left,
        global_asset_width: payload.global_asset_width,
        global_asset_height: payload.global_asset_height,
      };
    },
    setDesignFile(state, { payload }) {
      console.log("setDesignFile");
      state.design.file = payload;
      state.design.url = "";
    },
    setDesignUrl(state, { payload }) {
      console.log("setDesignUrl");
      state.design.url = payload;
      state.design.file = null!;
    },
    setActiveSmartObject(state, { payload }) {
      state.activeSmartObject = payload;
    },
    resetAppState: (state) => {
      localStorage.removeItem("dynamicMockupsApiKey");
      localStorage.removeItem("dynamicMockupsAccessToken");
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        appApi.endpoints.generateSingleRender.matchFulfilled,
        (state, response) => {
          state.singleRender.data = response.payload.data;
          state.singleRender.isLoading = false;
        }
      )
      .addMatcher(
        appApi.endpoints.generateSingleRender.matchPending,
        (state, response) => {
          state.singleRender.isLoading = true;
        }
      )
      .addMatcher(
        appApi.endpoints.getCollections.matchFulfilled,
        (state, response) => {
          state.collections = response.payload.data;
        }
      )
      .addMatcher(
        appApi.endpoints.getMockups.matchFulfilled,
        (state, response) => {
          state.mockups.data = response.payload.data;
          state.mockups.isLoading = false;
        }
      )
      .addMatcher(
        appApi.endpoints.getMockups.matchPending,
        (state, response) => {
          state.mockups.isLoading = true;
        }
      );
  },
});

export default appSlice.reducer;

export const {
  setThemeMode,
  setApiKey,
  resetAppState,
  setSelectedMockup,
  setColor,
  setFitMode,
  setAccessToken,
  updateActiveSmartObject,
  setDesignUrl,
  setDesignFile,
  setActiveSmartObject,
} = appSlice.actions;
