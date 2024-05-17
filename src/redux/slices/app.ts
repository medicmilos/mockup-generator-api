import { appApi } from "@/services/app";
import { IMockup, SingleRenderRes } from "@/services/types";
import { createSlice } from "@reduxjs/toolkit";
import { fitModes } from "./types";

interface AppState {
  themeMode: "inherit" | "light" | "dark" | undefined;
  apiKey: string;
  selectedMockup: IMockup;
  mockups: {
    data: IMockup[];
    isLoading: boolean;
  };
  color: string;
  fitMode: fitModes;
  singleRender: { data: SingleRenderRes; isLoading: boolean };
}

const userPrefferedThemeMode = window.localStorage.getItem("app-theme");
const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
  ? "dark"
  : "light";

const dynamicMockupsApiKey = localStorage.getItem(
  "dynamicMockupsApiKey"
) as string;

const initialState: AppState = {
  themeMode: (userPrefferedThemeMode ||
    systemTheme ||
    "light") as AppState["themeMode"],
  apiKey: dynamicMockupsApiKey || "",
  mockups: {
    data: [],
    isLoading: false,
  },
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
    setSelectedMockup(state, { payload }) {
      state.selectedMockup = payload;
    },
    setColor(state, { payload }) {
      state.color = payload;
    },
    setFitMode(state, { payload }) {
      state.fitMode = payload;
    },
    resetAppState: (state) => {
      localStorage.removeItem("dynamicMockupsApiKey");
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
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
      )
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
} = appSlice.actions;
