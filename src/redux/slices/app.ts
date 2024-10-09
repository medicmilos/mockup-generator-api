import { appApi } from "@/services/app";
import { ICollection, IMockup, SingleRenderRes } from "@/services/types";
import { createSlice } from "@reduxjs/toolkit";
import { fitModes } from "./types";
import { IAssetFileConfig } from "@/features/screens/editor/Editor";

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
  thumbnail: string;
  print_area: 1 | 0;
  fit: assetFit;
}

interface AppState {
  themeMode: "inherit" | "light" | "dark" | undefined;
  color: string;
  fitMode: fitModes;
  singleRender: { data: SingleRenderRes; isLoading: boolean };
  activeSmartObject: SmartObject;
  design: {
    file?: File;
    url?: string;
  };
  activeDesignAsset: IAssetFileConfig;
  collections: {
    data: ICollection[];
    isLoading: boolean;
  };
  mockups: {
    data: IMockup[];
    isLoading: boolean;
  };
  selectedCollection: string | null;
  selectedMockup: IMockup | null;
}

const userPrefferedThemeMode = window.localStorage.getItem("app-theme");
const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
  ? "dark"
  : "light";

const initialState: AppState = {
  themeMode: (userPrefferedThemeMode ||
    systemTheme ||
    "light") as AppState["themeMode"],
  color: "#5753c6",
  fitMode: "contain",
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
    url: "https://dynamicmockups.com/wp-content/uploads/2023/03/design-copilot-logo-rounded.png",
  },
  activeDesignAsset: {} as any,
  collections: { data: [], isLoading: true },
  mockups: { data: [], isLoading: true },
  selectedCollection: null,
  selectedMockup: null,
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
    setSelectedMockup(state, { payload }) {
      state.selectedMockup = payload;
    },
    setColor(state, { payload }) {
      state.color = payload;
    },
    setFitMode(state, { payload }) {
      state.fitMode = payload;
    },
    setDesignFile(state, { payload }) {
      state.design.file = payload;
      state.design.url = "";
    },
    setDesignUrl(state, { payload }) {
      state.design.url = payload;
      state.design.file = null!;
    },
    setActiveSmartObject(state, { payload }) {
      state.activeSmartObject = payload;
    },
    setSelectedCollection(state, { payload }) {
      state.selectedCollection = payload;
    },
    setActiveDesignAsset(state, { payload }) {
      state.activeDesignAsset = payload;
    },
    resetAppState: () => {
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
          state.collections.data = response.payload.data;
          state.collections.isLoading = false;
        }
      )
      .addMatcher(
        appApi.endpoints.getCollections.matchPending,
        (state, response) => {
          state.collections.isLoading = true;
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
  resetAppState,
  setSelectedMockup,
  setColor,
  setFitMode,
  setDesignUrl,
  setDesignFile,
  setActiveSmartObject,
  setSelectedCollection,
  setActiveDesignAsset,
} = appSlice.actions;
