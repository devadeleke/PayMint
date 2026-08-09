import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

const useDashboardStore = create((set) => ({
    // ============================================
    // STATE
    // ============================================

    stats: {
        totalRevenue: 0,
        outstanding: 0,
        paid: 0,
        overdue: 0,
    },

    revenue: [],

    invoiceSummary: {
        total: 0,
        paid: 0,
        unpaid: 0,
        partiallyPaid: 0,
    },

    recentActivity: [],

    isFetchingDashboard: false,
    dashboardError: null,

    // ============================================
    // FETCH DASHBOARD DATA
    // ============================================

    fetchDashboard: async () => {
        set({
            isFetchingDashboard: true,
            dashboardError: null,
        });

        try {
            const response = await axiosInstance.get(
                "/invoices/dashboard/stats"
            );

            const data = response.data.data;

            set({
                stats: data.stats,
                revenue: data.revenue,
                invoiceSummary: data.invoiceSummary,
                recentActivity: data.recentActivity,

                isFetchingDashboard: false,
            });
        } catch (error) {
            set({
                isFetchingDashboard: false,
                dashboardError:
                    error.response?.data?.message ||
                    "Failed to load dashboard data.",
            });
        }
    },

    // ============================================
    // RESET DASHBOARD
    // ============================================

    resetDashboard: () => {
        set({
            stats: {
                totalRevenue: 0,
                outstanding: 0,
                paid: 0,
                overdue: 0,
            },

            revenue: [],

            invoiceSummary: {
                total: 0,
                paid: 0,
                unpaid: 0,
                partiallyPaid: 0,
            },

            recentActivity: [],

            dashboardError: null,
        });
    },
}));

export default useDashboardStore;