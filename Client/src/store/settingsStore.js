import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

const settingsStore = create((set) => ({
  settings: null,

  isFetchingSettings: false,
  isUpdatingSettings: false,

  fetchSettings: async () => {
    set({ isFetchingSettings: true });

    try {
      const response = await axiosInstance.get("/settings");

      console.log("GET SETTINGS RESPONSE:", response.data);

      set({
        settings: response.data.settings,
        isFetchingSettings: false,
      });

      return response.data.settings;
    } catch (error) {
      console.error("FETCH SETTINGS ERROR:", error);
      console.error("FETCH SETTINGS RESPONSE:", error.response?.data);
      console.error("FETCH SETTINGS STATUS:", error.response?.status);

      set({ isFetchingSettings: false });

      throw error;
    }
  },

  updateSettings: async (data) => {
    set({ isUpdatingSettings: true });

    console.log("UPDATE SETTINGS DATA:", data);

    try {
      const response = await axiosInstance.put(
        "/settings",
        data
      );

      console.log("UPDATE SETTINGS RESPONSE:", response.data);

      set({
        settings: response.data.settings,
        isUpdatingSettings: false,
      });

      return response.data.settings;
    } catch (error) {
      console.error("UPDATE SETTINGS ERROR:", error);
      console.error(
        "UPDATE SETTINGS RESPONSE:",
        error.response?.data
      );
      console.error(
        "UPDATE SETTINGS STATUS:",
        error.response?.status
      );

      set({ isUpdatingSettings: false });

      throw error;
    }
  },
}));

export default settingsStore;