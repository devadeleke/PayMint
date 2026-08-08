import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { ArrowLeft, House, Mail, Pen, Phone, MapPin, FileText, Receipt, CircleDollarSign,  Clock3, Trash,} from 'lucide-react';
import { useClientStore } from '../../store/clientStore';
import StatCard from "../../components/ui/StatCard";
import GlobalModal from '../../components/modals/GlobalModal';
import ClientModal from "../../components/modals/ClientModal";
import DeleteModal from "../../components/modals/DeleteModal";

const ClientPage = () => {
  const [modal, setModal] = useState(null);
  const [delId, setDelId] = useState(null)
  const { id } = useParams();
  const { getClient, isFetchingClient, client, archiveClient } = useClientStore();
  const navigate = useNavigate()

  useEffect(() => {
    getClient(id);
  }, [id, getClient])

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

  const handleDelete = async () => {
  await archiveClient(delId);
  setDelId(null);
  navigate("/clients");
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

      <div className='bg-white rounded-lg border border-gray-200'>
        {/* HEADER */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-slate-200">
          <h2 className="text-lg font-semibold">Invoice history</h2>
          <p className="text-sm text-gray-400">invoices</p>
        </div>

        <div className="w-full h-60 flex flex-col items-center justify-center gap-2">
          <div className="size-10 rounded-full bg-blue-100 text-blue-500 flex items-center justify-center">
            <FileText size={18} />
          </div>
          <p className="text-sm text-slate-400">No invoices for this client yet.</p>
          <p className="text-blue-500 font-semibold">Create an invoice</p>
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
    </div>
  )
}

export default ClientPage