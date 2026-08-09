import {
    FileText,
    CheckCircle2,
    Clock3,
    CircleDollarSign,
} from "lucide-react";

import { timeAgo } from "../../utils/timeAgo";

const RecentActivity = ({ data = [] }) => {
    const getActivity = (invoice) => {
        switch (invoice.paymentStatus) {
            case "paid":
                return {
                    text: `Invoice #${invoice.invoiceNumber} was paid`,
                    icon: CheckCircle2,
                    color: "bg-emerald-100 text-emerald-600",
                };

            case "partially_paid":
                return {
                    text: `Invoice #${invoice.invoiceNumber} was partially paid`,
                    icon: CircleDollarSign,
                    color: "bg-purple-100 text-purple-600",
                };

            case "unpaid":
                return {
                    text: `Invoice #${invoice.invoiceNumber} is awaiting payment`,
                    icon: Clock3,
                    color: "bg-amber-100 text-amber-600",
                };

            default:
                return {
                    text: `Invoice #${invoice.invoiceNumber} was created`,
                    icon: FileText,
                    color: "bg-indigo-100 text-indigo-600",
                };
        }
    };

    // ============================================
    // EMPTY STATE
    // ============================================

    if (!data.length) {
        return (
            <div className="py-10 text-center">
                <div className="size-11 mx-auto rounded-xl bg-gray-100 text-gray-400 flex items-center justify-center mb-3">
                    <FileText size={20} />
                </div>

                <p className="text-sm font-medium text-gray-600">
                    No recent activity
                </p>

                <p className="text-xs text-gray-400 mt-1">
                    Your latest invoice activity will appear here.
                </p>
            </div>
        );
    }

    // ============================================
    // ACTIVITY LIST
    // ============================================

    return (
        <div className="space-y-1">
            {data.map((invoice) => {
                const activity = getActivity(invoice);
                const Icon = activity.icon;

                const clientName =
                    invoice.client?.company ||
                    invoice.client?.fullName;

                return (
                    <div
                        key={invoice._id}
                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group"
                    >
                        {/* ICON */}
                        <div
                            className={`size-9 rounded-full ${activity.color} flex items-center justify-center shrink-0`}
                        >
                            <Icon size={16} />
                        </div>

                        {/* CONTENT */}
                        <div className="flex-1 min-w-0">
                            <p className="text-sm text-slate-700 group-hover:text-slate-900 transition-colors truncate">
                                {activity.text}
                            </p>

                            <div className="flex items-center gap-2 mt-1">
                                {clientName && (
                                    <>
                                        <span className="text-xs text-slate-400 truncate">
                                            {clientName}
                                        </span>

                                        <span className="size-1 rounded-full bg-slate-300 shrink-0" />
                                    </>
                                )}

                                <span className="text-xs text-slate-400 shrink-0">
                                    {timeAgo(invoice.createdAt)}
                                </span>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default RecentActivity;