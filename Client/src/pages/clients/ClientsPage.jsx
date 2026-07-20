import { ArrowRight, Mail, Map, Phone, Plus, Search } from 'lucide-react';

const Clients = [
  {id: 1, company: "Acme Corporation", email: "marcus@acmecorp.com", contact: "+1 (555) 234-5678", location: "San Francisco, USA", invoiceList: 3, payment: "$2,450.00", outstanding: "$0.00"},
  {id: 2, company: "Acme Corporation", email: "marcus@acmecorp.com", contact: "+1 (555) 234-5678", location: "San Francisco, USA", invoiceList: 3, payment: "$2,450.00", outstanding: "$0.00"},
  {id: 3, company: "Acme Corporation", email: "marcus@acmecorp.com", contact: "+1 (555) 234-5678", location: "San Francisco, USA", invoiceList: 3, payment: "$2,450.00", outstanding: "$0.00"},
  {id: 4, company: "Acme Corporation", email: "marcus@acmecorp.com", contact: "+1 (555) 234-5678", location: "San Francisco, USA", invoiceList: 3, payment: "$2,450.00", outstanding: "$0.00"},
  {id: 5, company: "Acme Corporation", email: "marcus@acmecorp.com", contact: "+1 (555) 234-5678", location: "San Francisco, USA", invoiceList: 3, payment: "$2,450.00", outstanding: "$0.00"},
  {id: 6, company: "Acme Corporation", email: "marcus@acmecorp.com", contact: "+1 (555) 234-5678", location: "San Francisco, USA", invoiceList: 3, payment: "$2,450.00", outstanding: "$0.00"},
  {id: 7, company: "Acme Corporation", email: "marcus@acmecorp.com", contact: "+1 (555) 234-5678", location: "San Francisco, USA", invoiceList: 3, payment: "$2,450.00", outstanding: "$0.00"},
  {id: 8, company: "Acme Corporation", email: "marcus@acmecorp.com", contact: "+1 (555) 234-5678", location: "San Francisco, USA", invoiceList: 3, payment: "$2,450.00", outstanding: "$0.00"},
  {id: 9, company: "Acme Corporation", email: "marcus@acmecorp.com", contact: "+1 (555) 234-5678", location: "San Francisco, USA", invoiceList: 3, payment: "$2,450.00", outstanding: "$0.00"},
  {id: 10, company: "Acme Corporation", email: "marcus@acmecorp.com", contact: "+1 (555) 234-5678", location: "San Francisco, USA", invoiceList: 3, payment: "$2,450.00", outstanding: "$0.00"},
  {id: 11, company: "Acme Corporation", email: "marcus@acmecorp.com", contact: "+1 (555) 234-5678", location: "San Francisco, USA", invoiceList: 3, payment: "$2,450.00", outstanding: "$0.00"},
  {id: 12, company: "Acme Corporation", email: "marcus@acmecorp.com", contact: "+1 (555) 234-5678", location: "San Francisco, USA", invoiceList: 3, payment: "$2,450.00", outstanding: "$0.00"},
  {id: 13, company: "Acme Corporation", email: "marcus@acmecorp.com", contact: "+1 (555) 234-5678", location: "San Francisco, USA", invoiceList: 3, payment: "$2,450.00", outstanding: "$0.00"},
  {id: 14, company: "Acme Corporation", email: "marcus@acmecorp.com", contact: "+1 (555) 234-5678", location: "San Francisco, USA", invoiceList: 3, payment: "$2,450.00", outstanding: "$0.00"},
  {id: 15, company: "Acme Corporation", email: "marcus@acmecorp.com", contact: "+1 (555) 234-5678", location: "San Francisco, USA", invoiceList: 3, payment: "$2,450.00", outstanding: "$0.00"},
  {id: 16, company: "Acme Corporation", email: "marcus@acmecorp.com", contact: "+1 (555) 234-5678", location: "San Francisco, USA", invoiceList: 3, payment: "$2,450.00", outstanding: "$0.00"},
  {id: 17, company: "Acme Corporation", email: "marcus@acmecorp.com", contact: "+1 (555) 234-5678", location: "San Francisco, USA", invoiceList: 3, payment: "$2,450.00", outstanding: "$0.00"},
  {id: 18, company: "Acme Corporation", email: "marcus@acmecorp.com", contact: "+1 (555) 234-5678", location: "San Francisco, USA", invoiceList: 3, payment: "$2,450.00", outstanding: "$0.00"},
  {id: 19, company: "Acme Corporation", email: "marcus@acmecorp.com", contact: "+1 (555) 234-5678", location: "San Francisco, USA", invoiceList: 3, payment: "$2,450.00", outstanding: "$0.00"},
  {id: 20, company: "Acme Corporation", email: "marcus@acmecorp.com", contact: "+1 (555) 234-5678", location: "San Francisco, USA", invoiceList: 3, payment: "$2,450.00", outstanding: "$0.00"},
]

const ClientsPage = () => {
  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center gap-3 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search size={15} className='absolute left-3 top-1/2 -translate-y-1/2 text-slate-400' />
            <input placeholder="Search clients by name, company, email..." className="w-full pl-9 pr-9 py-2.5 rounded-md border border-slate-200 text-sm text-slate-700 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200 outline-none transition-colors" type="text" value="" />
          </div>
        </div>
        <button className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2.5 rounded-md transition-all duration-200 hover:scale-[1.02] whitespace-nowrap cursor-pointer">
          <Plus size={15} />
          Add client
        </button>
      </div>

      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-slate-500">14 clients</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Clients.map((client) => (
          <div key={client.id} className="bg-white rounded-xl border border-slate-200 px-4 py-3 cursor-pointer transition-all duration-200 hover:shadow-card-sm hover:-translate-y-0.5 group">
            <div className="flex items-start gap-4">
              <div className="size-12 rounded-full flex items-center justify-center shrink-0 font-semibold text-sm bg-indigo-100 text-indigo-700">MR</div>
              <div className="flex-1 min-w-0 text-sm">
                <h3 className="font-semibold text-slate-900 truncate group-hover:text-indigo-700 transition-colors">Marcus Reynolds</h3>
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
                <span>{client.contact}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Map size={12} className='text-slate-400' />
                <span className="truncate">{client.location}</span>
              </div>
            </div>

            <div className="h-px bg-slate-100 my-4"></div>
            <div className="grid grid-cols-3 gap-2 ">
              <div className="text-center">
                <p className="text-xs text-slate-400 mb-0.5">Invoices</p>
                <p className="text-sm font-semibold text-slate-900 font-mono">{client.invoiceList}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-slate-400 mb-0.5">Paid</p>
                <p className="text-sm font-semibold text-emerald-600 font-mono">{client.payment}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-slate-400 mb-0.5">Outstanding</p>
                <p className="text-sm font-semibold font-mono text-slate-900">{client.outstanding}</p>
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  )
}

export default ClientsPage