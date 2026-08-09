import { create } from "zustand";
import { axiosInstance } from '../lib/axios';

export const useInvoiceStore = create((set) => ({
    // ============================================
    // STATE
    // ============================================

    invoices: [],
    invoice: null,
    dashboardStats: null,

    pagination: {
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
    },

    isFetchingInvoices: false,
    isFetchingInvoice: false,
    isCreatingInvoice: false,
    isUpdatingInvoice: false,
    isArchivingInvoice: false,
    isRestoringInvoice: false,
    isFetchingDashboardStats: false,
    isRecordingPayment: false,
    payments: [],
    isFetchingPayments: false,

    // ============================================
    // FETCH ALL INVOICES
    // ============================================

    getInvoices: async (params = {}) => {
    set({ isFetchingInvoices: true });

    try {
        const response = await axiosInstance.get("/invoices", {
            params,
        });

        set({
            invoices: response.data.data,
            pagination: response.data.pagination || {
                total: 0,
                page: 1,
                limit: 10,
                totalPages: 0,
            },
            isFetchingInvoices: false,
        });

        return response.data;
    } catch (error) {
        set({ isFetchingInvoices: false });
        throw error;
    }
},
    // ============================================
    // FETCH SINGLE INVOICE
    // ============================================

    getInvoice: async (id) => {
        set({
            isFetchingInvoice: true,
            invoice: null,
        });

        try {
            const response = await axiosInstance.get(
                `/invoices/${id}`
            );

            set({
                invoice: response.data.data,
                isFetchingInvoice: false,
            });

            return response.data;
        } catch (error) {
            set({ isFetchingInvoice: false });

            throw error;
        }
    },

    // ============================================
    // CREATE INVOICE
    // ============================================

    createInvoice: async (invoiceData) => {
        set({ isCreatingInvoice: true });

        try {
            const response = await axiosInstance.post(
                "/invoices",
                invoiceData
            );

            const newInvoice = response.data.data;

            set((state) => ({
                invoices: [newInvoice, ...state.invoices],
                isCreatingInvoice: false,
            }));

            return response.data;
        } catch (error) {
            set({ isCreatingInvoice: false });

            throw error;
        }
    },

    // ============================================
    // UPDATE INVOICE
    // ============================================

    updateInvoice: async (id, invoiceData) => {
        set({ isUpdatingInvoice: true });

        try {
            const response = await axiosInstance.patch(
                `/invoices/${id}`,
                invoiceData
            );

            const updatedInvoice = response.data.data;

            set((state) => ({
                invoices: state.invoices.map((invoice) =>
                    invoice._id === id
                        ? updatedInvoice
                        : invoice
                ),

                invoice:
                    state.invoice?._id === id
                        ? updatedInvoice
                        : state.invoice,

                isUpdatingInvoice: false,
            }));

            return response.data;
        } catch (error) {
            set({ isUpdatingInvoice: false });

            throw error;
        }
    },

    // ============================================
    // ARCHIVE INVOICE
    // ============================================

    archiveInvoice: async (id) => {
        set({ isArchivingInvoice: true });

        try {
            const response = await axiosInstance.patch(
                `/invoices/${id}/archive`
            );

            const archivedInvoice = response.data.data;

            set((state) => ({
                invoices: state.invoices.filter(
                    (invoice) => invoice._id !== id
                ),

                invoice:
                    state.invoice?._id === id
                        ? archivedInvoice
                        : state.invoice,

                isArchivingInvoice: false,
            }));

            return response.data;
        } catch (error) {
            set({ isArchivingInvoice: false });

            throw error;
        }
    },

    // ============================================
    // RESTORE INVOICE
    // ============================================

    restoreInvoice: async (id) => {
        set({ isRestoringInvoice: true });

        try {
            const response = await axiosInstance.patch(
                `/invoices/${id}/restore`
            );

            const restoredInvoice = response.data.data;

            set((state) => ({
                invoices: [
                    restoredInvoice,
                    ...state.invoices,
                ],

                invoice:
                    state.invoice?._id === id
                        ? restoredInvoice
                        : state.invoice,

                isRestoringInvoice: false,
            }));

            return response.data;
        } catch (error) {
            set({ isRestoringInvoice: false });

            throw error;
        }
    },

    // ============================================
    // FETCH DASHBOARD STATS
    // ============================================

    fetchDashboardStats: async () => {
        set({ isFetchingDashboardStats: true });

        try {
            const response = await axiosInstance.get(
                "/invoices/dashboard/stats"
            );

            set({
                dashboardStats: response.data.data,
                isFetchingDashboardStats: false,
            });

            return response.data;
        } catch (error) {
            set({ isFetchingDashboardStats: false });

            throw error;
        }
    },

    // ============================================
    // CLEAR CURRENT INVOICE
    // ============================================

    clearInvoice: () => {
        set({
            invoice: null,
        });
    },

    // ============================================
    // RESET STORE
    // ============================================

    resetInvoiceStore: () => {
        set({
            invoices: [],
            invoice: null,
            dashboardStats: null,

            pagination: {
                total: 0,
                page: 1,
                limit: 10,
                totalPages: 0,
            },

            isFetchingInvoices: false,
            isFetchingInvoice: false,
            isCreatingInvoice: false,
            isUpdatingInvoice: false,
            isArchivingInvoice: false,
            isRestoringInvoice: false,
            isFetchingDashboardStats: false,
        });
    },
    recordPayment: async (id, amount) => {
        set({ isRecordingPayment: true });
    
        try {
            const response = await axiosInstance.patch(
                `/invoices/${id}/payment`,
                { amount }
            );
    
            set({ isRecordingPayment: false });
    
            return response.data;
        } catch (error) {
            set({ isRecordingPayment: false });
            throw error;
        }
    },

    getInvoicePayments: async (invoiceId) => {
    set({
        payments: [],
        isFetchingPayments: true,
    });

    try {
        const response = await axiosInstance.get(
            `/invoices/${invoiceId}/payments`
        );

        set({
            payments: response.data.data,
            isFetchingPayments: false,
        });

        return response.data.data;
    } catch (error) {
        set({
            payments: [],
            isFetchingPayments: false,
        });

        throw error;
    }
},
}));
