import { create } from "zustand";
import toast from "react-hot-toast";

import { axiosInstance } from "../lib/axios";

export const useInvoiceStore = create((set) => ({
  // =========================
  // STATE
  // =========================
  invoices: [],
  invoice: null,
  pagination: null,

  isFetchingInvoices: false,
  isFetchingInvoice: false,
  isCreatingInvoice: false,
  isUpdatingInvoice: false,
  isArchivingInvoice: false,
  isRestoringInvoice: false,

  // =========================
  // GET ALL INVOICES
  // =========================
  getInvoices: async (params = {}) => {
    set({ isFetchingInvoices: true });

    try {
      const { data } = await axiosInstance.get("/invoices", {
        params,
      });

      set({
        invoices: data.data,
        pagination: data.pagination,
      });
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to fetch invoices."
      );
    } finally {
      set({ isFetchingInvoices: false });
    }
  },

  // =========================
  // GET SINGLE INVOICE
  // =========================
  getInvoice: async (id) => {
    set({ isFetchingInvoice: true });

    try {
      const { data } = await axiosInstance.get(`/invoices/${id}`);

      set({
        invoice: data.data,
      });
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to fetch invoice."
      );
    } finally {
      set({ isFetchingInvoice: false });
    }
  },

  // =========================
  // CREATE INVOICE
  // =========================
  createInvoice: async (invoiceData) => {
    set({ isCreatingInvoice: true });

    try {
      const { data } = await axiosInstance.post(
        "/invoices",
        invoiceData
      );

      set((state) => ({
        invoices: [data.data, ...state.invoices],
      }));

      toast.success(data.message);
      return data.data;
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to create invoice."
      );
      throw error;
    } finally {
      set({ isCreatingInvoice: false });
    }
  },

  // =========================
  // UPDATE INVOICE
  // =========================
  updateInvoice: async (id, invoiceData) => {
    set({ isUpdatingInvoice: true });

    try {
      const { data } = await axiosInstance.patch(
        `/invoices/${id}`,
        invoiceData
      );

      set((state) => ({
        invoices: state.invoices.map((invoice) =>
          invoice._id === id ? data.data : invoice
        ),
        invoice:
          state.invoice?._id === id
            ? data.data
            : state.invoice,
      }));

      toast.success(data.message);

      return data.data;
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update invoice."
      );
      throw error;
    } finally {
      set({ isUpdatingInvoice: false });
    }
  },

  // =========================
  // ARCHIVE INVOICE
  // =========================
  archiveInvoice: async (id) => {
    set({ isArchivingInvoice: true });

    try {
      const { data } = await axiosInstance.patch(
        `/invoices/${id}/archive`
      );

      set((state) => ({
        invoices: state.invoices.filter(
          (invoice) => invoice._id !== id
        ),
      }));

      toast.success(data.message);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to archive invoice."
      );
    } finally {
      set({ isArchivingInvoice: false });
    }
  },

  // =========================
  // RESTORE INVOICE
  // =========================
  restoreInvoice: async (id) => {
    set({ isRestoringInvoice: true });

    try {
      const { data } = await axiosInstance.patch(
        `/invoices/${id}/restore`
      );

      set((state) => ({
        invoices: [data.data, ...state.invoices],
      }));

      toast.success(data.message);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to restore invoice."
      );
    } finally {
      set({ isRestoringInvoice: false });
    }
  },

  // =========================
  // CLEAR CURRENT INVOICE
  // =========================
  clearInvoice: () => set({ invoice: null }),
}));