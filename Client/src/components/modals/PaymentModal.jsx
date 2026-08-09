import { useState } from "react";
import { useInvoiceStore } from "../../store/invoiceStore";

const PaymentModal = ({
    invoice,
    onClose,
}) => {
    const [amount, setAmount] = useState("");

    const {
        recordPayment,
        isRecordingPayment,
    } = useInvoiceStore();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await recordPayment(
                invoice._id,
                Number(amount)
            );

            onClose();
        } catch (error) {
            console.error(
                "Failed to record payment:",
                error
            );
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-5"
        >
            <div>
                <p className="text-sm text-slate-500">
                    Invoice
                </p>

                <p className="font-semibold">
                    {invoice.invoiceNumber}
                </p>
            </div>

            <div>
                <p className="text-sm text-slate-500">
                    Outstanding Balance
                </p>

                <p className="text-xl font-semibold">
                    {invoice.currency}{" "}
                    {Number(
                        invoice.balanceDue
                    ).toLocaleString(
                        undefined,
                        {
                            minimumFractionDigits: 2,
                        }
                    )}
                </p>
            </div>

            <div>
                <label className="mb-2 block text-sm font-medium">
                    Payment Amount
                </label>

                <input
                    type="number"
                    min="0.01"
                    max={invoice.balanceDue}
                    step="0.01"
                    value={amount}
                    onChange={(e) =>
                        setAmount(e.target.value)
                    }
                    placeholder="Enter payment amount"
                    required
                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-primary"
                />
            </div>

            <div className="flex justify-end gap-3 border-t border-slate-200 pt-4">
                <button
                    type="button"
                    onClick={onClose}
                    disabled={isRecordingPayment}
                    className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium"
                >
                    Cancel
                </button>

                <button
                    type="submit"
                    disabled={
                        isRecordingPayment ||
                        !amount
                    }
                    className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
                >
                    {isRecordingPayment
                        ? "Recording..."
                        : "Record Payment"}
                </button>
            </div>
        </form>
    );
};

export default PaymentModal;