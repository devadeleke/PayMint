import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { ArrowLeft, House, Mail, Pen, Phone, MapPin, FileText, Receipt, CircleDollarSign,  Clock3, Trash, Plus,} from 'lucide-react';
import { useClientStore } from '../../store/clientStore';
import { useInvoiceStore } from "../../store/invoiceStore";
import StatCard from "../../components/ui/StatCard";
import GlobalModal from '../../components/modals/GlobalModal';
import ClientModal from "../../components/modals/ClientModal";
import InvoiceModal from "../../components/modals/InvoiceModal";
import DeleteModal from "../../components/modals/DeleteModal";
import InvoiceDetailsModal from "../../components/modals/InvoiceDetailModal";

const ClientPage = () => {
  const [modal, setModal] = useState(null);
  const [delId, setDelId] = useState(null);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const { id } = useParams();
  const { getClient, isFetchingClient, client, archiveClient } = useClientStore();
  const { invoices, getInvoices, isFetchingInvoices, archiveInvoice, isArchivingInvoice, restoreInvoice, isRestoringInvoice } = useInvoiceStore();
  const [invoiceArchiveId, setInvoiceArchiveId] = useState(null);
  const [showArchivedInvoices, setShowArchivedInvoices] = useState(false);
  const [invoiceRestoreId, setInvoiceRestoreId] = useState(null);
  const navigate = useNavigate()

  useEffect(() => {
    getClient(id);
  }, [id, getClient]);

useEffect(() => {
    if (!id) return;

    getInvoices({
        client: id,
        archived: showArchivedInvoices,
    });
}, [id, getInvoices, showArchivedInvoices]);

  if (isFetchingClient) {
    return <p>Loading client...</p>;
  };

  if (!client) {
    return <p>Client not found.</p>;
  }

  console.log(client)

  const stats = [
    {
      id: 1,
      label: "Total Invoices",
      value: client.invoiceCount,
      icon: FileText,
      color: "bg-blue-100 text-blue-600",
    },
    {
      id: 2,
      label: "Total Invoiced",
      value: client.totalInvoiced,
      icon: Receipt,
      color: "bg-purple-100 text-purple-600",
    },
    {
      id: 3,
      label: "Total Paid",
      value: client.totalPaid,
      icon: CircleDollarSign,
      color: "bg-green-100 text-green-600",
    },
    {
      id: 4,
      label: "Outstanding",
      value: client.totalInvoiced - client.totalPaid,
      icon: Clock3,
      color: "bg-orange-100 text-orange-600",
    },
  ];

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
            client: id,
        });
    } catch (error) {
        console.error(
            "Failed to archive invoice:",
            error
        );
    }
};

  const handleDelete = async () => {
  await archiveClient(delId);
  setDelId(null);
  navigate("/clients");
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
            client: id,
            archived: true,
        });
    } catch (error) {
        console.error(
            "Failed to restore invoice:",
            error
        );
    }
};

  return (
    <div className="space-y-4">

      <div className="flex justify-between items-start">
        <button onClick={() => navigate("/clients")} className="flex items-center space-x-1 text-sm text-gray-500 hover:text-gray-800 transition-colors">
          <ArrowLeft size={15} />
          <span>Back</span>
        </button>
        <div className="flex items-center gap-6">
          <button onClick={() => setModal("edit")} className="inline-flex items-center gap-2 px-4 py-2 bg-white text-primary text-sm font-semibold rounded-xl border border-primary/40 hover:text-white hover:bg-primary active:scale-95 transition-all duration-150">
            <Pen size={12} />
            <span>Edit Client</span>
          </button>
          <button onClick={() => setDelId(client._id)} className="inline-flex items-center gap-2 px-4 py-2 bg-red-500 text-white text-sm font-semibold rounded-xl hover:bg-red-600 active:scale-95 transition-all duration-150">
            <Trash size={12} />
            <span>Delete</span>
          </button>
        </div>
      </div>

      <div className='bg-white rounded-lg p-6 border border-gray-200 flex space-x-3'>
        <div className="size-15 bg-blue-200 rounded-full flex items-center justify-center text-blue-600">
          <span>MR</span>
        </div>

        <div>
          <h2 className="text-xl font-semibold">{client.fullName}</h2>
          <p className="text-sm text-gray-400">{client.company}</p>
          <div className="flex mt-4 gap-12 flex-wrap">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Mail size={14} />
              <p>{client.email}</p>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Phone size={14} />
              <p>{client.phone}</p>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <MapPin size={14} /> 
              <p>{client.billingAddress.country}</p>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <House size={14} />
              <p>{client.billingAddress.street}, {client.billingAddress.city}, {client.billingAddress.state}</p>
            </div>
          </div>
        </div>
      </div>

      <StatCard data={stats} />

      <button onClick={() => setModal("create-invoice")} className="inline-flex items-center gap-2 px-4 py-2 bg-white text-primary text-sm font-semibold rounded-xl border border-primary/40 hover:text-white hover:bg-primary active:scale-95 transition-all duration-150">
        <Plus size={12} />
        <span>Create invoice</span>
      </button>

      <div className='bg-white rounded-lg border border-gray-200'>
          {/* HEADER */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-slate-200">
    <div>
        <h2 className="text-lg font-semibold">
            Invoice history
        </h2>

        <p className="text-sm text-gray-400">
            {showArchivedInvoices
                ? "Archived invoices"
                : "Active invoices"}
        </p>
    </div>

    <div className="flex items-center gap-2">
        <button
            onClick={() => setShowArchivedInvoices(false)}
            className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                !showArchivedInvoices
                    ? "bg-primary text-white"
                    : "text-slate-500 hover:bg-slate-100"
            }`}
        >
            Active
        </button>

        <button
            onClick={() => setShowArchivedInvoices(true)}
            className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                showArchivedInvoices
                    ? "bg-primary text-white"
                    : "text-slate-500 hover:bg-slate-100"
            }`}
        >
            Archived
        </button>
    </div>
</div>
      
        <div className="overflow-x-auto">
    {isFetchingInvoices ? (
        <div className="flex h-60 items-center justify-center">
            <p className="text-sm text-slate-400">
                Loading invoices...
            </p>
        </div>
    ) : invoices.length === 0 ? (
        <div className="flex h-60 flex-col items-center justify-center gap-2">
            <div className="flex size-10 items-center justify-center rounded-full bg-blue-100 text-blue-500">
                <FileText size={18} />
            </div>

            <p className="text-sm text-slate-400">
                No invoices for this client yet.
            </p>

            <button
                onClick={() => setModal("create-invoice")}
                className="font-semibold text-blue-500 hover:text-blue-600"
            >
                Create an invoice
            </button>
        </div>
    ) : (
        <table className="w-full text-left">
            <thead>
                <tr className="border-b border-slate-200 text-sm text-slate-500">
                    <th className="px-4 py-3 font-medium">
                        Invoice
                    </th>

                    <th className="px-4 py-3 font-medium">
                        Issue Date
                    </th>

                    <th className="px-4 py-3 font-medium">
                        Due Date
                    </th>

                    <th className="px-4 py-3 font-medium">
                        Total
                    </th>

                    <th className="px-4 py-3 font-medium">
                        Payment
                    </th>

                    <th className="px-4 py-3 font-medium">
                        Status
                    </th>
                </tr>
            </thead>

            <tbody>
                {invoices.map((invoice) => (
                    <tr
                        key={invoice._id}
                        onClick={() => {
                          setSelectedInvoice(invoice);
                          setModal("invoice-details");
                      }}
                        className="border-b border-slate-100 last:border-none hover:bg-slate-50"
                    >
                        <td className="px-4 py-4">
                            <div>
                                <p className="text-sm font-semibold text-slate-800">
                                    {invoice.invoiceNumber}
                                </p>

                                <p className="text-xs text-slate-400">
                                    {invoice.title}
                                </p>
                            </div>
                        </td>

                        <td className="px-4 py-4 text-sm text-slate-600">
                            {new Date(
                                invoice.issueDate
                            ).toLocaleDateString()}
                        </td>

                        <td className="px-4 py-4 text-sm text-slate-600">
                            {new Date(
                                invoice.dueDate
                            ).toLocaleDateString()}
                        </td>

                        <td className="px-4 py-4 text-sm font-semibold text-slate-800">
                            {invoice.currency}{" "}
                            {Number(invoice.total).toLocaleString(
                                undefined,
                                {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                }
                            )}
                        </td>

                        <td className="px-4 py-4">
                            <span
                                className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                                    invoice.paymentStatus === "paid"
                                        ? "bg-green-100 text-green-700"
                                        : invoice.paymentStatus ===
                                          "partially_paid"
                                        ? "bg-yellow-100 text-yellow-700"
                                        : "bg-red-100 text-red-700"
                                }`}
                            >
                                {invoice.paymentStatus
                                    ?.replace("_", " ")
                                    .replace(/\b\w/g, (char) =>
                                        char.toUpperCase()
                                    )}
                            </span>
                        </td>

                        <td className="px-4 py-4">
                            <span
                                className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                                    invoice.status === "paid"
                                        ? "bg-green-100 text-green-700"
                                        : invoice.status === "overdue"
                                        ? "bg-red-100 text-red-700"
                                        : invoice.status === "sent"
                                        ? "bg-blue-100 text-blue-700"
                                        : "bg-slate-100 text-slate-600"
                                }`}
                            >
                                {invoice.status
                                    ?.replace("_", " ")
                                    .replace(/\b\w/g, (char) =>
                                        char.toUpperCase()
                                    )}
                            </span>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    )}
</div>
      </div>

      <GlobalModal
    title="Edit Client"
    open={modal === "edit"}
    onClose={() => setModal(null)}
>
    <ClientModal
        mode="edit"
        initialData={client}
        onClose={() => setModal(null)}
    />
</GlobalModal>
    <DeleteModal
  open={!!delId}
  onClose={() => setDelId(null)}
  onConfirm={handleDelete}
  title="Delete Client"
  message={`Are you sure you want to delete ${client.fullName}?`}
/>

<GlobalModal
    title="Create Invoice"
    open={modal === "create-invoice"}
    onClose={() => setModal(null)}
>
    <InvoiceModal
        isOpen={modal === "create-invoice"}
        onClose={() => setModal(null)}
        initialClient={client}
    />
</GlobalModal>

<GlobalModal
    title="Invoice Details"
    open={modal === "invoice-details"}
    onClose={() => {
        setModal(null);
        setSelectedInvoice(null);
    }}
>
    <InvoiceDetailsModal
    invoice={selectedInvoice}
    onClose={() => {
        setModal(null);
        setSelectedInvoice(null);
    }}
    onEdit={() => {
        setModal("edit-invoice");
    }}
    onArchive={handleArchiveInvoice}
    onRestore={handleRestoreInvoice}
    isRestoring={isRestoringInvoice}
/>
</GlobalModal>

<DeleteModal
    open={!!invoiceArchiveId}
    onClose={() => setInvoiceArchiveId(null)}
    onConfirm={confirmArchiveInvoice}
    title="Archive Invoice"
    message="Are you sure you want to archive this invoice?"
/>

<DeleteModal
    open={!!invoiceRestoreId}
    onClose={() => setInvoiceRestoreId(null)}
    onConfirm={confirmRestoreInvoice}
    title="Restore Invoice"
    message="Are you sure you want to restore this invoice?"
/>
    </div>
  )
}

export default ClientPage