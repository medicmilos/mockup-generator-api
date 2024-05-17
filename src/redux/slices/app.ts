import { createSlice } from "@reduxjs/toolkit";

interface AppState {
  themeMode: "inherit" | "light" | "dark" | undefined;
  apiKey: string;
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
    resetAppState: () => initialState,
  },
});

export default appSlice.reducer;

export const { setThemeMode, setApiKey, resetAppState } = appSlice.actions;
