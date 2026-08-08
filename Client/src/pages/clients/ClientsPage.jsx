import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { ArrowRight, Loader, Mail, Map, Phone, Plus, Search } from 'lucide-react';

import { useClientStore } from '../../store/clientStore';
import GlobalModal from '../../components/modals/GlobalModal';
import ClientModal from "../../components/modals/ClientModal";

const ClientsPage = () => {
  const [modal, setModal] = useState(null);
  const { isFetchingClients, clients, getClients } = useClientStore();
  const navigate = useNavigate()

  useEffect(() => {
    getClients();
  }, []);

  const getInitials = (name) => name.trim().split(/\s+/).map(word => word[0].toUpperCase()).slice(0, 2).join('');
  
  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center gap-3 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search size={15} className='absolute left-3 top-1/2 -translate-y-1/2 text-slate-400' />
            <input type="text"
              placeholder="Search clients by name, company, email..." 
              className="w-full pl-9 pr-9 py-2.5 rounded-md border border-slate-200 text-sm text-slate-700 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200 outline-none transition-colors"  />
          </div>
        </div>
        <button onClick={() => setModal("add")} className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2.5 rounded-md transition-all duration-200 hover:scale-[1.02] whitespace-nowrap cursor-pointer">
          <Plus size={15} />
          Add client
        </button>
      </div>

      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-slate-500">{clients.length} Clients</span>
      </div>

      
        {isFetchingClients ?  (
          <div className='w-full h-24 bg-white rounded-xl border border-slate-200 flex items-center justify-center'>
            <Loader size={20} className='animate-spin'/>
          </div>
        ) : (
          <div>
          {!clients ? (
            <div className='w-full h-24 bg-white rounded-xl border border-slate-200 flex items-center justify-center'>
              <p>Clients not found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {clients.map((client) => (
                <div key={client._id} onClick={() => navigate(`/clients/${client._id}`)}
                    className="bg-white rounded-xl border border-slate-200 px-4 py-3 cursor-pointer transition-all duration-200 hover:shadow-card-sm hover:-translate-y-0.5 group">
                  <div className="flex items-start gap-4">
                    <div className="size-12 rounded-full flex items-center justify-center shrink-0 font-semibold text-sm bg-indigo-100 text-indigo-700">{getInitials(client.fullName)}</div>
                    <div className="flex-1 min-w-0 text-sm">
                      <h3 className="font-semibold text-slate-900 truncate group-hover:text-indigo-700 transition-colors">{client.fullName}</h3>
                      <p className="text-slate-500 truncate mt-0.5">{client.company}</p>
                    </div>
                    <div className="size-8 rounded-lg hover:bg-slate-100 flex items-center justify-center transition-colors shrink-0">
                      <ArrowRight size={15} className='text-slate-700' />
                    </div>
                  </div>
      
                  <div className="mt-4 space-y-1.5">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <Mail size={12} className='text-slate-400' />
                      <span className="truncate">{client.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <Phone size={12} className='text-slate-400' />
                      <span>{client.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <Map size={12} className='text-slate-400' />
                      <span className="truncate">{client["billingAddress"].country}, {client["billingAddress"].state}</span>
                    </div>
                  </div>
      
                  <div className="h-px bg-slate-100 my-4"></div>
                  <div className="grid grid-cols-3 gap-2 ">
                    <div className="text-center">
                      <p className="text-xs text-slate-400 mb-0.5">Invoices</p>
                      <p className="text-sm font-semibold text-slate-900 font-mono">{client.invoiceCount}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-slate-400 mb-0.5">Paid</p>
                      <p className="text-sm font-semibold text-emerald-600 font-mono">{client.totalPaid}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-slate-400 mb-0.5">Outstanding</p>
                      <p className="text-sm font-semibold font-mono text-slate-900">{client.totalInvoiced}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          </div>
        )}
        

      <GlobalModal title="Client form" open={modal === "add"} onClose={() => setModal(null)}>
        <ClientModal onClose={() => setModal(null)} />
      </GlobalModal>
    </div>
  )
}

export default ClientsPage