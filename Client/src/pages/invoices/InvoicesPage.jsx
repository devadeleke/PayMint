import { useEffect, useState } from "react";
import {
    Archive,
    ChevronLeft,
    ChevronRight,
    Eye,
    FileText,
    Plus,
    Search,
} from "lucide-react";
import { useInvoiceStore } from "../../store/invoiceStore";
import GlobalModal from "../../components/modals/GlobalModal";
import InvoiceModal from "../../components/modals/InvoiceModal";
import InvoiceDetailModal from "../../components/modals/InvoiceDetailModal";
import DeleteModal from "../../components/modals/DeleteModal";
import PaymentModal from "../../components/modals/PaymentModal";


const InvoicesPage = () => {

    const {
    invoices,
    getInvoices,
    isFetchingInvoices,
    pagination,
    archiveInvoice,
    restoreInvoice,
    isArchivingInvoice,
    isRestoringInvoice,
} = useInvoiceStore();

 const [modal, setModal] = useState(null);
const [selectedInvoice, setSelectedInvoice] = useState(null);
const [invoiceArchiveId, setInvoiceArchiveId] = useState(null);
const [invoiceRestoreId, setInvoiceRestoreId] = useState(null);

const [search, setSearch] = useState("");
const [status, setStatus] = useState("");
const [paymentStatus, setPaymentStatus] = useState("");
const [showArchived, setShowArchived] = useState(false);
const [paymentInvoice, setPaymentInvoice] = useState(null);

const [page, setPage] = useState(1);

    useEffect(() => {
        getInvoices({
            page,
            search,
            status,
            paymentStatus,
            archived: showArchived,
        });
    }, [
        page,
        search,
        status,
        paymentStatus,
        showArchived,
        getInvoices,
    ]);

    const openInvoice = (invoice) => {
        setSelectedInvoice(invoice);
        setModal("details");
    };

    const clearFilters = () => {
        setSearch("");
        setStatus("");
        setPaymentStatus("");
        setShowArchived(false);
        setPage(1);
    };

const handleArchiveInvoice = () => {
    if (!selectedInvoice) return;

    setInvoiceArchiveId(selectedInvoice._id);
};

    const confirmArchiveInvoice = async () => {
    if (!invoiceArchiveId) return;

    try {
        await archiveInvoice(invoiceArchiveId);

        setInvoiceArchiveId(null);
        setSelectedInvoice(null);
        setModal(null);

        await getInvoices({
            page,
            search,
            status,
            paymentStatus,
            archived: showArchived,
        });
    } catch (error) {
        console.error("Failed to archive invoice:", error);
    }
};

const handleRestoreInvoice = () => {
    if (!selectedInvoice) return;

    setInvoiceRestoreId(selectedInvoice._id);
};

const confirmRestoreInvoice = async () => {
    if (!invoiceRestoreId) return;

    try {
        await restoreInvoice(invoiceRestoreId);

        setInvoiceRestoreId(null);
        setSelectedInvoice(null);
        setModal(null);

        await getInvoices({
            page,
            search,
            status,
            paymentStatus,
            archived: true,
        });
    } catch (error) {
        console.error("Failed to restore invoice:", error);
    }
};

const handleInvoiceSaved = async () => {
    setModal(null);
    setSelectedInvoice(null);

    await getInvoices({
        page,
        search,
        status,
        paymentStatus,
        archived: showArchived,
    });
};

const handleRecordPayment = () => {
    if (!selectedInvoice) return;

    setPaymentInvoice(selectedInvoice);
    setModal("payment");
};

    return (
        <div className="space-y-6">

            {/* HEADER */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-slate-900">
                        Invoices
                    </h1>

                    <p className="mt-1 text-sm text-slate-400">
                        Manage all your invoices in one place.
                    </p>
                </div>

                <button
                    onClick={() => setModal("create")}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 active:scale-95"
                >
                    <Plus size={16} />
                    Create Invoice
                </button>
            </div>


            {/* FILTERS */}
            <div className="rounded-xl border border-slate-200 bg-white p-4">

                <div className="flex flex-col gap-3 lg:flex-row">

                    {/* SEARCH */}
                    <div className="relative flex-1">
                        <Search
                            size={16}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                        />

                        <input
                            type="text"
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setPage(1);
                            }}
                            placeholder="Search invoice number or title..."
                            className="w-full rounded-lg border border-slate-200 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-primary"
                        />
                    </div>


                    {/* INVOICE STATUS */}
                    <select
                        value={status}
                        onChange={(e) => {
                            setStatus(e.target.value);
                            setPage(1);
                        }}
                        className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-primary"
                    >
                        <option value="">
                            All invoice statuses
                        </option>

                        <option value="draft">
                            Draft
                        </option>

                        <option value="sent">
                            Sent
                        </option>

                        <option value="paid">
                            Paid
                        </option>

                        <option value="overdue">
                            Overdue
                        </option>
                    </select>


                    {/* PAYMENT STATUS */}
                    <select
                        value={paymentStatus}
                        onChange={(e) => {
                            setPaymentStatus(e.target.value);
                            setPage(1);
                        }}
                        className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-primary"
                    >
                        <option value="">
                            All payment statuses
                        </option>

                        <option value="unpaid">
                            Unpaid
                        </option>

                        <option value="partially_paid">
                            Partially Paid
                        </option>

                        <option value="paid">
                            Paid
                        </option>
                    </select>


                    {/* ARCHIVED */}
                    <button
                        onClick={() => {
                            setShowArchived(!showArchived);
                            setPage(1);
                        }}
                        className={`inline-flex items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition ${
                            showArchived
                                ? "border-primary bg-primary text-white"
                                : "border-slate-200 text-slate-600 hover:bg-slate-50"
                        }`}
                    >
                        <Archive size={15} />

                        {showArchived
                            ? "Archived"
                            : "Active"}
                    </button>


                    {/* CLEAR */}
                    {(search ||
                        status ||
                        paymentStatus ||
                        showArchived) && (
                        <button
                            onClick={clearFilters}
                            className="px-3 py-2 text-sm font-medium text-slate-500 hover:text-slate-800"
                        >
                            Clear
                        </button>
                    )}

                </div>
            </div>


            {/* INVOICE TABLE */}
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">

                {isFetchingInvoices ? (
                    <div className="flex h-64 items-center justify-center">
                        <p className="text-sm text-slate-400">
                            Loading invoices...
                        </p>
                    </div>
                ) : invoices.length === 0 ? (
                    <div className="flex h-64 flex-col items-center justify-center gap-3">
                        <div className="flex size-12 items-center justify-center rounded-full bg-blue-100 text-blue-500">
                            <FileText size={20} />
                        </div>

                        <p className="text-sm text-slate-400">
                            No invoices found.
                        </p>

                        <button
                            onClick={() => setModal("create")}
                            className="text-sm font-semibold text-primary"
                        >
                            Create an invoice
                        </button>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">

                            <thead>
                                <tr className="border-b border-slate-200 text-xs text-slate-500">
                                    <th className="px-5 py-4 font-medium">
                                        Invoice
                                    </th>

                                    <th className="px-5 py-4 font-medium">
                                        Client
                                    </th>

                                    <th className="px-5 py-4 font-medium">
                                        Issue Date
                                    </th>

                                    <th className="px-5 py-4 font-medium">
                                        Due Date
                                    </th>

                                    <th className="px-5 py-4 font-medium">
                                        Total
                                    </th>

                                    <th className="px-5 py-4 font-medium">
                                        Payment
                                    </th>

                                    <th className="px-5 py-4 font-medium">
                                        Status
                                    </th>

                                    <th className="px-5 py-4" />
                                </tr>
                            </thead>

                            <tbody>
                                {invoices.map((invoice) => (
                                    <tr
                                        key={invoice._id}
                                        onClick={() =>
                                            openInvoice(invoice)
                                        }
                                        className="cursor-pointer border-b border-slate-100 last:border-none hover:bg-slate-50"
                                    >
                                        <td className="px-5 py-4">
                                            <div>
                                                <p className="text-sm font-semibold text-slate-800">
                                                    {
                                                        invoice.invoiceNumber
                                                    }
                                                </p>

                                                <p className="text-xs text-slate-400">
                                                    {invoice.title}
                                                </p>
                                            </div>
                                        </td>

                                        <td className="px-5 py-4">
                                            <p className="text-sm font-medium">
                                                {
                                                    invoice.client
                                                        ?.fullName
                                                }
                                            </p>

                                            <p className="text-xs text-slate-400">
                                                {
                                                    invoice.client
                                                        ?.company
                                                }
                                            </p>
                                        </td>

                                        <td className="px-5 py-4 text-sm text-slate-500">
                                            {new Date(
                                                invoice.issueDate
                                            ).toLocaleDateString()}
                                        </td>

                                        <td className="px-5 py-4 text-sm text-slate-500">
                                            {new Date(
                                                invoice.dueDate
                                            ).toLocaleDateString()}
                                        </td>

                                        <td className="px-5 py-4 text-sm font-semibold">
                                            {invoice.currency}{" "}
                                            {Number(
                                                invoice.total
                                            ).toLocaleString(
                                                undefined,
                                                {
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2,
                                                }
                                            )}
                                        </td>

                                        <td className="px-5 py-4">
                                            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium">
                                                {invoice.paymentStatus
                                                    ?.replaceAll(
                                                        "_",
                                                        " "
                                                    )
                                                    .replace(
                                                        /\b\w/g,
                                                        (char) =>
                                                            char.toUpperCase()
                                                    )}
                                            </span>
                                        </td>

                                        <td className="px-5 py-4">
                                            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium">
                                                {invoice.status
                                                    ?.replaceAll(
                                                        "_",
                                                        " "
                                                    )
                                                    .replace(
                                                        /\b\w/g,
                                                        (char) =>
                                                            char.toUpperCase()
                                                    )}
                                            </span>
                                        </td>

                                        <td className="px-5 py-4">
                                            <button
                                                onClick={(event) => {
                                                    event.stopPropagation();
                                                    openInvoice(invoice);
                                                }}
                                                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                                            >
                                                <Eye size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>

                        </table>
                    </div>
                )}


                {/* PAGINATION */}
                {!isFetchingInvoices &&
                    invoices.length > 0 &&
                    pagination && (
                        <div className="flex items-center justify-between border-t border-slate-200 px-5 py-4">

                            <p className="text-sm text-slate-400">
                                Page {pagination.page} of{" "}
                                {pagination.totalPages}
                            </p>

                            <div className="flex items-center gap-2">

                                <button
                                    disabled={page <= 1}
                                    onClick={() =>
                                        setPage(
                                            (prev) =>
                                                prev - 1
                                        )
                                    }
                                    className="rounded-lg border border-slate-200 p-2 text-slate-500 disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    <ChevronLeft size={16} />
                                </button>

                                <button
                                    disabled={
                                        page >=
                                        pagination.totalPages
                                    }
                                    onClick={() =>
                                        setPage(
                                            (prev) =>
                                                prev + 1
                                        )
                                    }
                                    className="rounded-lg border border-slate-200 p-2 text-slate-500 disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    <ChevronRight size={16} />
                                </button>

                            </div>
                        </div>
                    )}
            </div>


            {/* CREATE INVOICE */}
{/* CREATE INVOICE */}
<GlobalModal
    title="Create Invoice"
    open={modal === "create"}
    onClose={() => setModal(null)}
>
    <InvoiceModal
        isOpen={modal === "create"}
        onClose={async () => {
            setModal(null);

            await getInvoices({
                page,
                search,
                status,
                paymentStatus,
                archived: showArchived,
            });
        }}
    />
</GlobalModal>

            {/* INVOICE DETAILS */}
<GlobalModal
    title="Invoice Details"
    open={modal === "details"}
    onClose={() => {
        setModal(null);
        setSelectedInvoice(null);
    }}
>
    <InvoiceDetailModal
        invoice={selectedInvoice}
        onClose={() => {
            setModal(null);
            setSelectedInvoice(null);
        }}
        onEdit={() => {
            setModal("edit");
        }}
        onArchive={handleArchiveInvoice}
        onRestore={handleRestoreInvoice}
        onRecordPayment={handleRecordPayment}
        isRestoring={isRestoringInvoice}
    />
</GlobalModal>

            <GlobalModal
    title="Edit Invoice"
    open={modal === "edit"}
    onClose={() => setModal(null)}
>
    <InvoiceModal
        isOpen={modal === "edit"}
        invoice={selectedInvoice}
        onClose={async () => {
            setModal(null);
            setSelectedInvoice(null);

            await getInvoices({
                page,
                search,
                status,
                paymentStatus,
                archived: showArchived,
            });
        }}
    />
</GlobalModal>

{/* RECORD PAYMENT */}
<GlobalModal
    title="Record Payment"
    open={modal === "payment"}
    onClose={() => {
        setModal(null);
        setPaymentInvoice(null);
    }}
>
    <PaymentModal
        invoice={paymentInvoice}
        onClose={async () => {
            setModal(null);
            setPaymentInvoice(null);
            setSelectedInvoice(null);

            await getInvoices({
                page,
                search,
                status,
                paymentStatus,
                archived: showArchived,
            });
        }}
    />
</GlobalModal>

          <DeleteModal
    open={!!invoiceArchiveId}
    onClose={() => setInvoiceArchiveId(null)}
    onConfirm={confirmArchiveInvoice}
    title="Archive Invoice"
    message={`Are you sure you want to archive ${selectedInvoice?.invoiceNumber}?`}
/>

<DeleteModal
    open={!!invoiceRestoreId}
    onClose={() => setInvoiceRestoreId(null)}
    onConfirm={confirmRestoreInvoice}
    title="Restore Invoice"
    message={`Are you sure you want to restore ${selectedInvoice?.invoiceNumber}?`}
/>

        </div>
    );
};

export default InvoicesPage;






// import { useState } from 'react'
// import { ArrowUpDown, MoreHorizontal, Search} from 'lucide-react';

// import GlobalModal from '../../components/modals/GlobalModal';
// import InvoiceModal from '../../components/modals/InvoiceModal';

// const statuses = [
//   {id: 1, label: 'All', size: 14, color: "bg-slate-800 text-white"},
//   {id: 2, label: 'Draft', size: 2, color: "bg-slate-100 text-slate-700"},
//   {id: 3, label: 'Sent', size: 3, color: "bg-indigo-100 text-indigo-700"},
//   {id: 4, label: 'Viewed', size: 2, color: "bg-teal-100 text-teal-700"},
//   {id: 5, label: 'Paid', size: 4, color: "bg-emerald-100 text-emerald-700"},
//   {id: 6, label: 'Overdue', size: 3, color: "bg-rose-100 text-rose-700"}
// ];


// const invoices = [
//   {id: 1, invoiceId: "INV-008", label: "Nexus Consulting", price: "2,850.00", items: 4, startDate: "Mar 15, 2026", dueDate: "Apr 15, 2026", status: "Overdue"},
//   {id: 1, invoiceId: "INV-008", label: "Nexus Consulting", price: "2,850.00", items: 4, startDate: "Mar 15, 2026", dueDate: "Apr 15, 2026", status: "Overdue"},
//   {id: 1, invoiceId: "INV-008", label: "Nexus Consulting", price: "2,850.00", items: 4, startDate: "Mar 15, 2026", dueDate: "Apr 15, 2026", status: "Overdue"},
//   {id: 1, invoiceId: "INV-008", label: "Nexus Consulting", price: "2,850.00", items: 4, startDate: "Mar 15, 2026", dueDate: "Apr 15, 2026", status: "Overdue"},
//   {id: 1, invoiceId: "INV-008", label: "Nexus Consulting", price: "2,850.00", items: 4, startDate: "Mar 15, 2026", dueDate: "Apr 15, 2026", status: "Overdue"}
// ];

// const InvoicesPage = () => {
//   const [modal, setModal] = useState(null)

//   return (
//    <div>
//     <div className="mb-6">
//       <div className="space-y-3">

//         {/* BOX 1 */}
//         <div className="flex flex-col md:flex-row gap-8">
//           <div className='relative flex-1 min-w-0'>
//             <Search size={18} className='absolute top-1/2 -translate-y-1/2 left-3 text-gray-400'/>
//             <input type='text' 
//               placeholder='Search invoices, clients...'
//               className='w-full bg-white border border-slate-200 py-2 pl-10 pr-3 text-sm rounded-md text-slate-700 placeholder:text-slate-400
//                           outline-none focus:border-indigo-300 transition-all
//               '
//             />
//           </div>

//           <div className='relative'>
//             <ArrowUpDown size={18} className='absolute top-1/2 -translate-y-1/2 left-3 text-gray-700'/>
//             <select className='py-2 px-9 bg-white border border-gray-200 rounded-md '>
//               <option>Newest First</option>
//               <option>Newest First</option>
//               <option>Newest First</option>
//               <option>Newest First</option>
//               <option>Newest First</option>
//             </select>
//           </div>
//         </div>

//         {/* BOX 2 */}
//         <div className="flex flex-wrap items-center gap-2">
//           <div className='relative'>
//             <ArrowUpDown size={18} className='absolute top-1/2 -translate-y-1/2 left-3 text-gray-700'/>
//             <select className='py-2 px-9 bg-white border border-gray-200 rounded-md '>
//               <option>All Statuses</option>
//               <option>Newest First</option>
//               <option>Newest First</option>
//               <option>Newest First</option>
//               <option>Newest First</option>
//             </select>
//           </div>
//           <div className="flex items-center gap-2">
//             <input className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-sm text-slate-700 outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 transition-all cursor-pointer" type="date"/>
//             <span className="text-xs text-slate-400">to</span>
//             <input className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-sm text-slate-700 outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 transition-all cursor-pointer" type="date"/>
//           </div>
//         </div>

//         {/* BOX 3 */}
//         <div className='flex flex-wrap items-center gap-2 mb-4'>
//           {statuses.map((status) => (
//             <button key={status.id} className={`px-3 py-1.5 rounded-full text-sm ${status.color} font-medium transition-all cursor-pointer whitespace-nowrap`}>
//               {status.label}
//               <span className="text-[10px] px-1 py-0.5 rounded-full bg-white/20">{status.size}</span>
//             </button>
//           ))}
//         </div>

//         {/* BOX 4 */}
//         <div className="flex items-center justify-between mb-3">
//           <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer select-none">
//             <input className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer accent-indigo-600" type="checkbox" />
//             Select all
//           </label>
//           <span className="text-sm text-slate-500">14 invoices</span>
//         </div>

//         {/* BOX 5 */}
//         <div className="group bg-white rounded-xl border transition-all duration-200 hover:shadow-card-hover border-slate-200">
//           <div className='space-y-4'>
//             {invoices.map((invoice) => (
//               <div key={invoice.id} className="flex items-center gap-3 px-4 py-3.5">
//                 <input type='checkbox' 
//                     className='size-4 border border-red-300' 
//                 />

//                 <div className="size-2.5 rounded-full bg-rose-500 shrink-0"></div>

//                 <button className="flex-1 min-w-0 text-left cursor-pointer">
//                   <div className="flex items-center gap-2 flex-wrap">
//                     <span className="font-mono text-sm font-semibold text-slate-900">{invoice.invoiceId}</span>
//                     <span className="text-[10px] font-semibold uppercase tracking-wider bg-rose-100 text-rose-700 px-1.5 py-0.5 rounded">
//                       {invoice.status}
//                     </span>
//                   </div>
//                   <p className="text-sm text-slate-500 truncate mt-0.5">{invoice.label}</p>
//                 </button>

//                 <div className="text-right shrink-0 hidden sm:block">
//                   <p className="text-sm font-bold text-slate-900 font-mono">${invoice.price}</p>
//                   <p className="text-xs text-slate-400 mt-0.5">{invoice.items} items</p>
//                 </div>

//                 <div className="text-xs text-right shrink-0 hidden md:block min-w-25">
//                   <p className="text-slate-500">{invoice.startDate}</p>
//                   <p className="mt-0.5 text-rose-600 font-medium">Due {invoice.dueDate}</p>
//                 </div>

//                 <div className="shrink-0 hidden lg:block">
//                   <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-rose-100 text-rose-700">
//                     <span className="size-1.5 rounded-full bg-rose-500"></span>
//                     {invoice.status}
//                   </span>
//                 </div>

//                 <div className="relative shrink-0">
//                   <button className="size-8 rounded-lg text-slate-500 hover:text-gray-700 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer">
//                     <MoreHorizontal size={18} />
//                   </button>
//                 </div>

//               </div>
//             ))}
//           </div>
//         </div>

//       </div>
//     </div>
//     <GlobalModal title="Invoice form" open={modal === "add"} onClose={() => setModal(null)}>
//       <InvoiceModal onClose={() => setModal(null)}/>
//     </GlobalModal>
//    </div>
//   )
// }

// export default InvoicesPage