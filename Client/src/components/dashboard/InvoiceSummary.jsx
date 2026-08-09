import {
    FileText,
    CheckCircle2,
    Clock3,
    CircleDollarSign,
} from "lucide-react";

const InvoiceSummary = ({ data }) => {
    const {
        total = 0,
        paid = 0,
        unpaid = 0,
        partiallyPaid = 0,
    } = data || {};

    const items = [
        {
            label: "Paid",
            value: paid,
            icon: CheckCircle2,
            color: "bg-emerald-100 text-emerald-600",
        },
        {
            label: "Unpaid",
            value: unpaid,
            icon: Clock3,
            color: "bg-amber-100 text-amber-600",
        },
        {
            label: "Partial",
            title: "Partially Paid",
            value: partiallyPaid,
            icon: CircleDollarSign,
            color: "bg-purple-100 text-purple-600",
        },
    ];

    return (
        <div>
            {/* TOTAL INVOICES */}
            <div className="flex items-center gap-3 mb-6">
                <div className="size-11 shrink-0 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                    <FileText size={20} />
                </div>

                <div className="min-w-0">
                    <p className="text-2xl font-bold text-primary-950 leading-none">
                        {total}
                    </p>

                    <p className="text-xs font-medium text-gray-500 mt-1">
                        Total invoices
                    </p>
                </div>
            </div>

            {/* PAYMENT STATUS */}
            <div className="grid grid-cols-3 gap-3">
                {items.map((item) => {
                    const Icon = item.icon;

                    return (
                        <div
                            key={item.label}
                            title={item.title || item.label}
                            className="min-w-0 rounded-xl bg-gray-50 p-3"
                        >
                            <div
                                className={`size-8 rounded-lg ${item.color} flex items-center justify-center mb-2`}
                            >
                                <Icon size={16} />
                            </div>

                            <p className="text-lg font-bold text-primary-950 leading-none">
                                {item.value}
                            </p>

                            <p className="text-[11px] font-medium text-gray-500 mt-1 truncate">
                                {item.label}
                            </p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default InvoiceSummary;