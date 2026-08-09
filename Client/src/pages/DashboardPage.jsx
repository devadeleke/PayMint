import {
    ArrowLeftRight,
    BellElectric,
    CheckCircle,
    Wallet,
} from "lucide-react";
import { useEffect } from "react";

import useDashboardStore from "../store/dashboardStore";
import { useAuthStore } from "../store/authStore";

import PageHeader from "../layouts/PageHeader";
import StatCard from "../components/ui/StatCard";
import RevenueChart from "../components/dashboard/RevenueChart";
import InvoiceSummary from "../components/dashboard/InvoiceSummary";
import RecentActivity from "../components/dashboard/RecentActivity";

import { formatCurrency } from "../utils/formatCurrency";

const DashboardPage = () => {
    const { user } = useAuthStore();

    const {
        stats,
        revenue,
        invoiceSummary,
        recentActivity,
        isFetchingDashboard,
        dashboardError,
        fetchDashboard,
    } = useDashboardStore();

    useEffect(() => {
        fetchDashboard();
    }, [fetchDashboard]);

    // ============================================
    // STAT CARDS
    // ============================================

    const statCards = [
        {
            id: 1,
            label: "Total Revenue",
            value: formatCurrency(stats?.totalRevenue),
            icon: Wallet,
            color: "bg-indigo-200 text-indigo-600",
        },
        {
            id: 2,
            label: "Outstanding",
            value: formatCurrency(stats?.outstanding),
            icon: ArrowLeftRight,
            color: "bg-teal-200 text-teal-600",
        },
        {
            id: 3,
            label: "Paid",
            value: formatCurrency(stats?.paid),
            icon: CheckCircle,
            color: "bg-purple-200 text-purple-600",
        },
        {
            id: 4,
            label: "Overdue",
            value: formatCurrency(stats?.overdue),
            icon: BellElectric,
            color: "bg-amber-200 text-amber-600",
        },
    ];

    // ============================================
    // LOADING STATE
    // ============================================

    if (isFetchingDashboard) {
        return (
            <div>
                <PageHeader
                    title={`Welcome, ${user?.fullName || "there"} 👋`}
                    subtitle="Here's a snapshot of your activity."
                />

                {/* STAT SKELETONS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map((item) => (
                        <div
                            key={item}
                            className="bg-white rounded-2xl p-5 border border-gray-200 animate-pulse"
                        >
                            <div className="size-10 rounded-xl bg-gray-200 mb-4" />

                            <div className="h-7 w-28 bg-gray-200 rounded mb-2" />

                            <div className="h-4 w-24 bg-gray-200 rounded" />
                        </div>
                    ))}
                </div>

                {/* CHART SKELETONS */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                    <div className="lg:col-span-2 h-80 bg-white rounded-2xl border border-gray-200 animate-pulse" />

                    <div className="h-80 bg-white rounded-2xl border border-gray-200 animate-pulse" />
                </div>

                {/* ACTIVITY SKELETON */}
                <div className="h-64 bg-white rounded-2xl border border-gray-200 animate-pulse mt-6" />
            </div>
        );
    }

    // ============================================
    // ERROR STATE
    // ============================================

    if (dashboardError) {
        return (
            <div>
                <PageHeader
                    title={`Welcome, ${user?.fullName || "there"} 👋`}
                    subtitle="Here's a snapshot of your activity."
                />

                <div className="bg-white rounded-2xl border border-red-200 p-8 text-center">
                    <div className="size-12 mx-auto rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xl font-bold">
                        !
                    </div>

                    <h2 className="text-lg font-bold text-gray-800 mt-4">
                        Unable to load dashboard
                    </h2>

                    <p className="text-sm text-gray-500 mt-2">
                        {dashboardError}
                    </p>

                    <button
                        type="button"
                        onClick={fetchDashboard}
                        disabled={isFetchingDashboard}
                        className="mt-5 px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                    >
                        Try again
                    </button>
                </div>
            </div>
        );
    }

    // ============================================
    // DASHBOARD
    // ============================================

    return (
        <div className="space-y-6">
            {/* PAGE HEADER */}
            <PageHeader
                title={`Welcome, ${user?.fullName || "there"} 👋`}
                subtitle="Here's a snapshot of your activity."
            />

            {/* STAT CARDS */}
            <StatCard data={statCards} />

            {/* REVENUE + INVOICE */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* REVENUE OVERVIEW */}
                <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-200">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="font-bold text-lg text-gray-700">
                                Revenue Overview
                            </h2>

                            <p className="text-xs text-gray-400 mt-1">
                                Invoice revenue for the last 6 months
                            </p>
                        </div>

                        <span className="text-xs font-medium text-gray-400">
                            Last 6 months
                        </span>
                    </div>

                    <RevenueChart data={revenue} />
                </div>

                {/* INVOICE SUMMARY */}
                <div className="bg-white rounded-2xl p-6 border border-gray-200">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="font-bold text-lg text-gray-700">
                                Invoice
                            </h2>

                            <p className="text-xs text-gray-400 mt-1">
                                Payment status overview
                            </p>
                        </div>

                        <span className="text-xs font-medium text-gray-400">
                            Overview
                        </span>
                    </div>

                    <InvoiceSummary data={invoiceSummary} />
                </div>
            </div>

            {/* RECENT ACTIVITY */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-5">
                    <div>
                        <h2 className="font-bold text-lg text-gray-700">
                            Recent Activity
                        </h2>

                        <p className="text-xs text-gray-400 mt-1">
                            Your latest invoice activity
                        </p>
                    </div>

                    <button
                        type="button"
                        className="text-sm text-indigo-600 hover:text-indigo-700 font-medium cursor-pointer"
                    >
                        View all
                    </button>
                </div>

                <RecentActivity data={recentActivity} />
            </div>
        </div>
    );
};

export default DashboardPage;