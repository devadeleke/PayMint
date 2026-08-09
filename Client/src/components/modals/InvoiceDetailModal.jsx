import {
    Calendar,
    FileText,
    Pencil,
    User,
    X,
} from "lucide-react";
import { useEffect } from "react";
import { useInvoiceStore } from "../../store/invoiceStore";


const formatCurrency = (amount, currency = "USD") => {
    return `${currency} ${Number(amount || 0).toLocaleString(
        undefined,
        {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }
    )}`;
};


const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
};


const formatStatus = (status) => {
    if (!status) return "-";

    return status
        .replaceAll("_", " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());
};


const getPaymentStatusStyle = (status) => {
    switch (status) {
        case "paid":
            return "bg-green-100 text-green-700";

        case "partially_paid":
            return "bg-yellow-100 text-yellow-700";

        case "unpaid":
            return "bg-red-100 text-red-700";

        default:
            return "bg-slate-100 text-slate-600";
    }
};


const getInvoiceStatusStyle = (status) => {
    switch (status) {
        case "sent":
            return "bg-blue-100 text-blue-700";

        case "overdue":
            return "bg-red-100 text-red-700";

        case "cancelled":
            return "bg-red-100 text-red-700";

        case "draft":
            return "bg-slate-100 text-slate-600";

        default:
            return "bg-slate-100 text-slate-600";
    }
};


const InvoiceDetailModal = ({
    invoice,
    onClose,
    onEdit,
    onArchive,
    onRestore,
    isRestoring = false,
    onRecordPayment
}) => {
const {
        payments,
        getInvoicePayments,
        isFetchingPayments,
    } = useInvoiceStore();

    useEffect(() => {
        if (invoice?._id) {
            getInvoicePayments(invoice._id);
        }
    }, [invoice?._id, getInvoicePayments]);

    if (!invoice) return null;

    return (
        <div className="space-y-6">

            {/* ============================================
                HEADER
            ============================================ */}

            <div className="flex items-start justify-between">
                <div>
                    <div className="flex items-center gap-2">
                        <FileText
                            size={20}
                            className="text-primary"
                        />

                        <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                            {invoice.invoiceNumber}
                        </h2>
                    </div>

                    <p className="mt-1 text-sm text-slate-400">
                        {invoice.title}
                    </p>
                </div>

                <button
                    type="button"
                    onClick={onClose}
                    className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800"
                >
                    <X size={18} />
                </button>
            </div>


            {/* ============================================
                STATUS
            ============================================ */}

            <div className="flex flex-wrap gap-2">
                <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${getInvoiceStatusStyle(
                        invoice.status
                    )}`}
                >
                    {formatStatus(invoice.status)}
                </span>

                <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${getPaymentStatusStyle(
                        invoice.paymentStatus
                    )}`}
                >
                    {formatStatus(invoice.paymentStatus)}
                </span>
            </div>


            {/* ============================================
                CLIENT
            ============================================ */}

            <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
                <div className="mb-3 flex items-center gap-2">
                    <User
                        size={16}
                        className="text-slate-400"
                    />

                    <h3 className="text-sm font-semibold">
                        Client
                    </h3>
                </div>

                <div className="space-y-1">
                    <p className="text-sm font-medium">
                        {invoice.client?.fullName || "-"}
                    </p>

                    {invoice.client?.company && (
                        <p className="text-xs text-slate-400">
                            {invoice.client.company}
                        </p>
                    )}

                    {invoice.client?.email && (
                        <p className="text-xs text-slate-400">
                            {invoice.client.email}
                        </p>
                    )}
                </div>
            </div>


            {/* ============================================
                DATES
            ============================================ */}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800">
                    <div className="flex items-center gap-2 text-slate-400">
                        <Calendar size={15} />

                        <span className="text-xs">
                            Issue Date
                        </span>
                    </div>

                    <p className="mt-2 text-sm font-semibold">
                        {formatDate(invoice.issueDate)}
                    </p>
                </div>


                <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800">
                    <div className="flex items-center gap-2 text-slate-400">
                        <Calendar size={15} />

                        <span className="text-xs">
                            Due Date
                        </span>
                    </div>

                    <p className="mt-2 text-sm font-semibold">
                        {formatDate(invoice.dueDate)}
                    </p>
                </div>

            </div>


            {/* ============================================
                DESCRIPTION
            ============================================ */}

            {invoice.description && (
                <div>
                    <h3 className="mb-2 text-sm font-semibold">
                        Description
                    </h3>

                    <p className="text-sm leading-6 text-slate-500">
                        {invoice.description}
                    </p>
                </div>
            )}


            {/* ============================================
                ITEMS
            ============================================ */}

            <div>
                <h3 className="mb-3 text-sm font-semibold">
                    Invoice Items
                </h3>

                <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 dark:bg-slate-800">
                            <tr className="text-xs text-slate-500">
                                <th className="px-4 py-3 font-medium">
                                    Description
                                </th>

                                <th className="px-4 py-3 text-center font-medium">
                                    Qty
                                </th>

                                <th className="px-4 py-3 text-right font-medium">
                                    Unit Price
                                </th>

                                <th className="px-4 py-3 text-right font-medium">
                                    Amount
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {invoice.items?.map((item, index) => (
                                <tr
                                    key={index}
                                    className="border-t border-slate-100 dark:border-slate-700"
                                >
                                    <td className="px-4 py-3 text-sm">
                                        {item.description}
                                    </td>

                                    <td className="px-4 py-3 text-center text-sm text-slate-500">
                                        {item.quantity}
                                    </td>

                                    <td className="px-4 py-3 text-right text-sm text-slate-500">
                                        {formatCurrency(
                                            item.unitPrice,
                                            invoice.currency
                                        )}
                                    </td>

                                    <td className="px-4 py-3 text-right text-sm font-medium">
                                        {formatCurrency(
                                            item.amount,
                                            invoice.currency
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>


            {/* ============================================
                TOTALS
            ============================================ */}

            <div className="flex justify-end">
                <div className="w-full max-w-sm space-y-3 rounded-xl bg-slate-50 p-5 dark:bg-slate-800">

                    <div className="flex justify-between text-sm">
                        <span className="text-slate-500">
                            Subtotal
                        </span>

                        <span>
                            {formatCurrency(
                                invoice.subTotal,
                                invoice.currency
                            )}
                        </span>
                    </div>


                    <div className="flex justify-between text-sm">
                        <span className="text-slate-500">
                            Tax
                        </span>

                        <span>
                            {formatCurrency(
                                invoice.tax,
                                invoice.currency
                            )}
                        </span>
                    </div>


                    <div className="flex justify-between text-sm">
                        <span className="text-slate-500">
                            Discount
                        </span>

                        <span>
                            -{" "}
                            {formatCurrency(
                                invoice.discount,
                                invoice.currency
                            )}
                        </span>
                    </div>


                    <div className="border-t border-slate-200 pt-3 dark:border-slate-700">
                        <div className="flex justify-between font-semibold">
                            <span>Total</span>

                            <span>
                                {formatCurrency(
                                    invoice.total,
                                    invoice.currency
                                )}
                            </span>
                        </div>
                    </div>


                    <div className="flex justify-between text-sm">
                        <span className="text-slate-500">
                            Amount Paid
                        </span>

                        <span className="text-green-600">
                            {formatCurrency(
                                invoice.amountPaid,
                                invoice.currency
                            )}
                        </span>
                    </div>


                    <div className="flex justify-between text-sm font-semibold">
                        <span>
                            Balance Due
                        </span>

                        <span className="text-orange-600">
                            {formatCurrency(
                                invoice.balanceDue,
                                invoice.currency
                            )}
                        </span>
                    </div>

                </div>
            </div>


            {/* ============================================
                NOTES
            ============================================ */}

            {invoice.notes && (
                <div>
                    <h3 className="mb-2 text-sm font-semibold">
                        Notes
                    </h3>

                    <p className="text-sm leading-6 text-slate-500">
                        {invoice.notes}
                    </p>
                </div>
            )}

            <div className="mt-6 border-t border-slate-200 pt-6">
    <div className="mb-4 flex items-center justify-between">
        <div>
            <h3 className="text-base font-semibold text-slate-800">
                Payment History
            </h3>

            <p className="text-xs text-slate-400">
                Payments recorded against this invoice
            </p>
        </div>
    </div>

    {isFetchingPayments ? (
        <div className="py-8 text-center">
            <p className="text-sm text-slate-400">
                Loading payment history...
            </p>
        </div>
    ) : payments.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-200 py-8 text-center">
            <p className="text-sm text-slate-400">
                No payments recorded yet.
            </p>
        </div>
    ) : (
        <div className="divide-y divide-slate-100 rounded-lg border border-slate-200">
            {payments.map((payment) => (
                <div
                    key={payment._id}
                    className="flex items-center justify-between gap-4 p-4"
                >
                    <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-800">
                            {invoice.currency}{" "}
                            {Number(payment.amount).toLocaleString(
                                undefined,
                                {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                }
                            )}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                            {new Date(
                                payment.paymentDate
                            ).toLocaleDateString()}
                        </p>

                        {payment.reference && (
                            <p className="mt-1 truncate text-xs text-slate-400">
                                Ref: {payment.reference}
                            </p>
                        )}
                    </div>

                    <div className="text-right">
                        <p className="text-xs font-medium capitalize text-slate-600">
                            {payment.paymentMethod?.replace(
                                "_",
                                " "
                            )}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    )}
</div>


            {/* ============================================
                FOOTER
            ============================================ */}

            <div className="flex items-center justify-between border-t border-slate-200 pt-5 dark:border-slate-700">

    {invoice.isArchived ? (
        <button
            type="button"
            onClick={onRestore}
            disabled={isRestoring}
            className="inline-flex items-center gap-2 rounded-lg border border-green-200 px-4 py-2 text-sm font-medium text-green-600 hover:bg-green-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
            {isRestoring
                ? "Restoring..."
                : "Restore Invoice"}
        </button>
    ) : (
        <button
            type="button"
            onClick={onArchive}
            className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
        >
            Archive
        </button>
    )}

    <div className="flex gap-3">
        <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium hover:bg-slate-50"
        >
            Close
        </button>

        {!invoice.isArchived && (
            <button
                type="button"
                onClick={onEdit}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:opacity-90"
            >
                <Pencil size={14} />
                Edit Invoice
            </button>
        )}

        {!invoice.isArchived && (
    <button
        type="button"
        onClick={onRecordPayment}
        disabled={
            invoice.paymentStatus === "paid"
        }
        className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
    >
        {invoice.paymentStatus === "paid"
            ? "Fully Paid"
            : "Record Payment"}
    </button>
)}
    </div>
</div>

        </div>
    );
};

export default InvoiceDetailModal;