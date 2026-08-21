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

  updateSettings: async (data, logo) => {
    set({ isUpdatingSettings: true });

    try {
      const formData = new FormData();

      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value);
      });

      if (logo) {
        formData.append("logo", logo);
      }

      const response = await axiosInstance.put(
        "/settings",
        formData
      );

      set({
        settings: response.data.settings,
        isUpdatingSettings: false,
      });

      return response.data.settings;
    } catch (error) {
      set({ isUpdatingSettings: false });
      throw error;
    }
  },
}));

export default settingsStore;