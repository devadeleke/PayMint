import { useEffect, useMemo, useState } from "react";
import { X, Plus, Trash2 } from "lucide-react";

import {useInvoiceStore} from "../../store/invoiceStore";
import {useClientStore} from "../../store/clientStore";


const emptyItem = {
    description: "",
    quantity: 1,
    unitPrice: 0,
};


const InvoiceModal = ({
    isOpen,
    onClose,
    invoice = null,
}) => {
    const {
        createInvoice,
        updateInvoice,
        isCreatingInvoice,
        isUpdatingInvoice,
    } = useInvoiceStore();

    const {
        clients,
        fetchClients,
        isFetchingClients,
    } = useClientStore();


    const isEditMode = Boolean(invoice);

    const [formData, setFormData] = useState({
        client: "",
        title: "",
        description: "",
        dueDate: "",
        items: [{ ...emptyItem }],
        tax: 0,
        discount: 0,
        currency: "USD",
        notes: "",
        status: "draft",
    });


    // ============================================
    // LOAD CLIENTS
    // ============================================

    useEffect(() => {
        if (isOpen && clients.length === 0) {
            fetchClients();
        }
    }, [isOpen, clients.length, fetchClients]);


    // ============================================
    // POPULATE FORM FOR EDITING
    // ============================================

    useEffect(() => {
        if (!isOpen) return;

        if (invoice) {
            setFormData({
                client: invoice.client?._id || invoice.client || "",
                title: invoice.title || "",
                description: invoice.description || "",
                dueDate: invoice.dueDate
                    ? new Date(invoice.dueDate)
                          .toISOString()
                          .split("T")[0]
                    : "",
                items:
                    invoice.items?.length > 0
                        ? invoice.items.map((item) => ({
                              description: item.description || "",
                              quantity: item.quantity || 1,
                              unitPrice: item.unitPrice || 0,
                          }))
                        : [{ ...emptyItem }],
                tax: invoice.tax || 0,
                discount: invoice.discount || 0,
                currency: invoice.currency || "USD",
                notes: invoice.notes || "",
                status: invoice.status || "draft",
            });
        } else {
            setFormData({
                client: "",
                title: "",
                description: "",
                dueDate: "",
                items: [{ ...emptyItem }],
                tax: 0,
                discount: 0,
                currency: "USD",
                notes: "",
                status: "draft",
            });
        }
    }, [isOpen, invoice]);


    // ============================================
    // CALCULATIONS
    // ============================================

    const subTotal = useMemo(() => {
        return formData.items.reduce((total, item) => {
            const quantity = Number(item.quantity) || 0;
            const unitPrice = Number(item.unitPrice) || 0;

            return total + quantity * unitPrice;
        }, 0);
    }, [formData.items]);


    const total = useMemo(() => {
        const tax = Number(formData.tax) || 0;
        const discount = Number(formData.discount) || 0;

        return Math.max(0, subTotal + tax - discount);
    }, [subTotal, formData.tax, formData.discount]);


    // ============================================
    // FORM HANDLERS
    // ============================================

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };


    // ============================================
    // ITEM HANDLERS
    // ============================================

    const handleItemChange = (index, field, value) => {
        setFormData((prev) => {
            const updatedItems = [...prev.items];

            updatedItems[index] = {
                ...updatedItems[index],
                [field]: value,
            };

            return {
                ...prev,
                items: updatedItems,
            };
        });
    };


    const addItem = () => {
        setFormData((prev) => ({
            ...prev,
            items: [
                ...prev.items,
                {
                    ...emptyItem,
                },
            ],
        }));
    };


    const removeItem = (index) => {
        if (formData.items.length === 1) return;

        setFormData((prev) => ({
            ...prev,
            items: prev.items.filter(
                (_, itemIndex) => itemIndex !== index
            ),
        }));
    };


    // ============================================
    // SUBMIT
    // ============================================

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            client: formData.client,
            title: formData.title.trim(),
            description: formData.description.trim(),
            dueDate: formData.dueDate,

            items: formData.items.map((item) => ({
                description: item.description.trim(),
                quantity: Number(item.quantity),
                unitPrice: Number(item.unitPrice),
            })),

            tax: Number(formData.tax) || 0,
            discount: Number(formData.discount) || 0,
            currency: formData.currency,
            notes: formData.notes.trim(),
        };


        try {
            if (isEditMode) {
                await updateInvoice(invoice._id, {
                    ...payload,
                    status: formData.status,
                });
            } else {
                await createInvoice(payload);
            }

            onClose();
        } catch (error) {
            console.error(
                "Invoice submission failed:",
                error
            );
        }
    };


    // ============================================
    // CLOSE MODAL
    // ============================================

    const handleClose = () => {
        if (isCreatingInvoice || isUpdatingInvoice) return;

        onClose();
    };


    if (!isOpen) return null;


    const isSubmitting =
        isCreatingInvoice || isUpdatingInvoice;


    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-xl bg-white shadow-xl dark:bg-slate-900">

                {/* ========================================
                    HEADER
                ======================================== */}

                <div className="flex items-center justify-between border-b px-6 py-4 dark:border-slate-700">
                    <div>
                        <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                            {isEditMode
                                ? "Edit Invoice"
                                : "Create Invoice"}
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            {isEditMode
                                ? "Update invoice information"
                                : "Create a new invoice for a client"}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={handleClose}
                        disabled={isSubmitting}
                        className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed dark:hover:bg-slate-800"
                    >
                        <X size={20} />
                    </button>
                </div>


                {/* ========================================
                    FORM
                ======================================== */}

                <form
                    onSubmit={handleSubmit}
                    className="flex-1 overflow-y-auto"
                >
                    <div className="space-y-6 p-6">

                        {/* ====================================
                            BASIC INFORMATION
                        ==================================== */}

                        <section>
                            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
                                Invoice Information
                            </h3>

                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                                {/* Client */}

                                <div>
                                    <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                                        Client *
                                    </label>

                                    <select
                                        name="client"
                                        value={formData.client}
                                        onChange={handleChange}
                                        required
                                        disabled={isFetchingClients}
                                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                    >
                                        <option value="">
                                            {isFetchingClients
                                                ? "Loading clients..."
                                                : "Select client"}
                                        </option>

                                        {clients
                                            .filter(
                                                (client) =>
                                                    !client.isArchived
                                            )
                                            .map((client) => (
                                                <option
                                                    key={client._id}
                                                    value={client._id}
                                                >
                                                    {client.fullName}
                                                    {client.company
                                                        ? ` — ${client.company}`
                                                        : ""}
                                                </option>
                                            ))}
                                    </select>
                                </div>


                                {/* Title */}

                                <div>
                                    <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                                        Invoice Title *
                                    </label>

                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        placeholder="e.g. Website Development"
                                        required
                                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                    />
                                </div>


                                {/* Due Date */}

                                <div>
                                    <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                                        Due Date *
                                    </label>

                                    <input
                                        type="date"
                                        name="dueDate"
                                        value={formData.dueDate}
                                        onChange={handleChange}
                                        required
                                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                    />
                                </div>


                                {/* Currency */}

                                <div>
                                    <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                                        Currency
                                    </label>

                                    <select
                                        name="currency"
                                        value={formData.currency}
                                        onChange={handleChange}
                                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                    >
                                        <option value="USD">
                                            USD — US Dollar
                                        </option>

                                        <option value="NGN">
                                            NGN — Nigerian Naira
                                        </option>

                                        <option value="EUR">
                                            EUR — Euro
                                        </option>

                                        <option value="GBP">
                                            GBP — British Pound
                                        </option>
                                    </select>
                                </div>

                            </div>
                        </section>


                        {/* ====================================
                            DESCRIPTION
                        ==================================== */}

                        <section>
                            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                                Description
                            </label>

                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={3}
                                placeholder="Describe what this invoice is for..."
                                className="w-full resize-none rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                            />
                        </section>


                        {/* ====================================
                            ITEMS
                        ==================================== */}

                        <section>
                            <div className="mb-4 flex items-center justify-between">
                                <div>
                                    <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                                        Invoice Items
                                    </h3>

                                    <p className="mt-1 text-xs text-slate-400">
                                        Add the products or services being billed.
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={addItem}
                                    className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
                                >
                                    <Plus size={16} />
                                    Add Item
                                </button>
                            </div>


                            <div className="space-y-3">

                                {formData.items.map(
                                    (item, index) => {
                                        const amount =
                                            (Number(
                                                item.quantity
                                            ) || 0) *
                                            (Number(
                                                item.unitPrice
                                            ) || 0);

                                        return (
                                            <div
                                                key={index}
                                                className="rounded-lg border border-slate-200 p-4 dark:border-slate-700"
                                            >
                                                <div className="grid grid-cols-1 gap-3 md:grid-cols-12">

                                                    {/* Description */}

                                                    <div className="md:col-span-5">
                                                        <label className="mb-1 block text-xs font-medium text-slate-500">
                                                            Description
                                                        </label>

                                                        <input
                                                            type="text"
                                                            value={
                                                                item.description
                                                            }
                                                            onChange={(e) =>
                                                                handleItemChange(
                                                                    index,
                                                                    "description",
                                                                    e.target.value
                                                                )
                                                            }
                                                            placeholder="e.g. Website design"
                                                            required
                                                            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                                        />
                                                    </div>


                                                    {/* Quantity */}

                                                    <div className="md:col-span-2">
                                                        <label className="mb-1 block text-xs font-medium text-slate-500">
                                                            Quantity
                                                        </label>

                                                        <input
                                                            type="number"
                                                            min="1"
                                                            step="1"
                                                            value={
                                                                item.quantity
                                                            }
                                                            onChange={(e) =>
                                                                handleItemChange(
                                                                    index,
                                                                    "quantity",
                                                                    e.target.value
                                                                )
                                                            }
                                                            required
                                                            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                                        />
                                                    </div>


                                                    {/* Unit Price */}

                                                    <div className="md:col-span-2">
                                                        <label className="mb-1 block text-xs font-medium text-slate-500">
                                                            Unit Price
                                                        </label>

                                                        <input
                                                            type="number"
                                                            min="0"
                                                            step="0.01"
                                                            value={
                                                                item.unitPrice
                                                            }
                                                            onChange={(e) =>
                                                                handleItemChange(
                                                                    index,
                                                                    "unitPrice",
                                                                    e.target.value
                                                                )
                                                            }
                                                            required
                                                            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                                        />
                                                    </div>


                                                    {/* Amount */}

                                                    <div className="md:col-span-2">
                                                        <label className="mb-1 block text-xs font-medium text-slate-500">
                                                            Amount
                                                        </label>

                                                        <div className="flex h-[38px] items-center rounded-lg bg-slate-100 px-3 text-sm font-medium dark:bg-slate-800 dark:text-white">
                                                            {formData.currency}{" "}
                                                            {amount.toFixed(
                                                                2
                                                            )}
                                                        </div>
                                                    </div>


                                                    {/* Delete */}

                                                    <div className="flex items-end justify-end md:col-span-1">
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                removeItem(
                                                                    index
                                                                )
                                                            }
                                                            disabled={
                                                                formData
                                                                    .items
                                                                    .length ===
                                                                1
                                                            }
                                                            className="rounded-lg p-2 text-red-500 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40 dark:hover:bg-red-950/30"
                                                        >
                                                            <Trash2
                                                                size={18}
                                                            />
                                                        </button>
                                                    </div>

                                                </div>
                                            </div>
                                        );
                                    }
                                )}

                            </div>
                        </section>


                        {/* ====================================
                            TAX / DISCOUNT / TOTAL
                        ==================================== */}

                        <section>
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

                                <div className="space-y-4">

                                    <div>
                                        <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                                            Tax
                                        </label>

                                        <input
                                            type="number"
                                            name="tax"
                                            min="0"
                                            step="0.01"
                                            value={formData.tax}
                                            onChange={handleChange}
                                            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                        />
                                    </div>


                                    <div>
                                        <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                                            Discount
                                        </label>

                                        <input
                                            type="number"
                                            name="discount"
                                            min="0"
                                            step="0.01"
                                            value={formData.discount}
                                            onChange={handleChange}
                                            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                        />
                                    </div>

                                </div>


                                {/* Summary */}

                                <div className="rounded-xl bg-slate-50 p-5 dark:bg-slate-800">

                                    <div className="space-y-3 text-sm">

                                        <div className="flex justify-between">
                                            <span className="text-slate-500">
                                                Subtotal
                                            </span>

                                            <span className="font-medium">
                                                {formData.currency}{" "}
                                                {subTotal.toFixed(2)}
                                            </span>
                                        </div>


                                        <div className="flex justify-between">
                                            <span className="text-slate-500">
                                                Tax
                                            </span>

                                            <span>
                                                {formData.currency}{" "}
                                                {(
                                                    Number(
                                                        formData.tax
                                                    ) || 0
                                                ).toFixed(2)}
                                            </span>
                                        </div>


                                        <div className="flex justify-between">
                                            <span className="text-slate-500">
                                                Discount
                                            </span>

                                            <span>
                                                -{" "}
                                                {formData.currency}{" "}
                                                {(
                                                    Number(
                                                        formData.discount
                                                    ) || 0
                                                ).toFixed(2)}
                                            </span>
                                        </div>


                                        <div className="border-t pt-3 dark:border-slate-700">
                                            <div className="flex justify-between text-base font-semibold">
                                                <span>
                                                    Total
                                                </span>

                                                <span>
                                                    {formData.currency}{" "}
                                                    {total.toFixed(2)}
                                                </span>
                                            </div>
                                        </div>

                                    </div>
                                </div>

                            </div>
                        </section>


                        {/* ====================================
                            STATUS - EDIT ONLY
                        ==================================== */}

                        {isEditMode && (
                            <section>
                                <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                                    Invoice Status
                                </label>

                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                >
                                    <option value="draft">
                                        Draft
                                    </option>

                                    <option value="sent">
                                        Sent
                                    </option>

                                    <option value="overdue">
                                        Overdue
                                    </option>

                                    <option value="cancelled">
                                        Cancelled
                                    </option>
                                </select>
                            </section>
                        )}


                        {/* ====================================
                            NOTES
                        ==================================== */}

                        <section>
                            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                                Notes
                            </label>

                            <textarea
                                name="notes"
                                value={formData.notes}
                                onChange={handleChange}
                                rows={3}
                                placeholder="Additional notes for the client..."
                                className="w-full resize-none rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                            />
                        </section>

                    </div>


                    {/* ========================================
                        FOOTER
                    ======================================== */}

                    <div className="flex items-center justify-end gap-3 border-t bg-white px-6 py-4 dark:border-slate-700 dark:bg-slate-900">

                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={isSubmitting}
                            className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {isSubmitting
                                ? isEditMode
                                    ? "Updating..."
                                    : "Creating..."
                                : isEditMode
                                ? "Update Invoice"
                                : "Create Invoice"}
                        </button>

                    </div>
                </form>

            </div>
        </div>
    );
};

export default InvoiceModal;