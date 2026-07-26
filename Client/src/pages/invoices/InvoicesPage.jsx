import { useState } from 'react'
import { ArrowUpDown, MoreHorizontal, Search} from 'lucide-react';

import GlobalModal from '../../components/modals/GlobalModal';
import InvoiceModal from '../../components/modals/InvoiceModal';

const statuses = [
  {id: 1, label: 'All', size: 14, color: "bg-slate-800 text-white"},
  {id: 2, label: 'Draft', size: 2, color: "bg-slate-100 text-slate-700"},
  {id: 3, label: 'Sent', size: 3, color: "bg-indigo-100 text-indigo-700"},
  {id: 4, label: 'Viewed', size: 2, color: "bg-teal-100 text-teal-700"},
  {id: 5, label: 'Paid', size: 4, color: "bg-emerald-100 text-emerald-700"},
  {id: 6, label: 'Overdue', size: 3, color: "bg-rose-100 text-rose-700"}
];


const invoices = [
  {id: 1, invoiceId: "INV-008", label: "Nexus Consulting", price: "2,850.00", items: 4, startDate: "Mar 15, 2026", dueDate: "Apr 15, 2026", status: "Overdue"},
  {id: 1, invoiceId: "INV-008", label: "Nexus Consulting", price: "2,850.00", items: 4, startDate: "Mar 15, 2026", dueDate: "Apr 15, 2026", status: "Overdue"},
  {id: 1, invoiceId: "INV-008", label: "Nexus Consulting", price: "2,850.00", items: 4, startDate: "Mar 15, 2026", dueDate: "Apr 15, 2026", status: "Overdue"},
  {id: 1, invoiceId: "INV-008", label: "Nexus Consulting", price: "2,850.00", items: 4, startDate: "Mar 15, 2026", dueDate: "Apr 15, 2026", status: "Overdue"},
  {id: 1, invoiceId: "INV-008", label: "Nexus Consulting", price: "2,850.00", items: 4, startDate: "Mar 15, 2026", dueDate: "Apr 15, 2026", status: "Overdue"}
];

const InvoicesPage = () => {
  const [modal, setModal] = useState(null)

  return (
   <div>
    <div className="mb-6">
      <div className="space-y-3">

        {/* BOX 1 */}
        <div className="flex flex-col md:flex-row gap-8">
          <div className='relative flex-1 min-w-0'>
            <Search size={18} className='absolute top-1/2 -translate-y-1/2 left-3 text-gray-400'/>
            <input type='text' 
              placeholder='Search invoices, clients...'
              className='w-full bg-white border border-slate-200 py-2 pl-10 pr-3 text-sm rounded-md text-slate-700 placeholder:text-slate-400
                          outline-none focus:border-indigo-300 transition-all
              '
            />
          </div>

          <div className='relative'>
            <ArrowUpDown size={18} className='absolute top-1/2 -translate-y-1/2 left-3 text-gray-700'/>
            <select className='py-2 px-9 bg-white border border-gray-200 rounded-md '>
              <option>Newest First</option>
              <option>Newest First</option>
              <option>Newest First</option>
              <option>Newest First</option>
              <option>Newest First</option>
            </select>
          </div>
        </div>

        {/* BOX 2 */}
        <div className="flex flex-wrap items-center gap-2">
          <div className='relative'>
            <ArrowUpDown size={18} className='absolute top-1/2 -translate-y-1/2 left-3 text-gray-700'/>
            <select className='py-2 px-9 bg-white border border-gray-200 rounded-md '>
              <option>All Statuses</option>
              <option>Newest First</option>
              <option>Newest First</option>
              <option>Newest First</option>
              <option>Newest First</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <input className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-sm text-slate-700 outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 transition-all cursor-pointer" type="date"/>
            <span className="text-xs text-slate-400">to</span>
            <input className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-sm text-slate-700 outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 transition-all cursor-pointer" type="date"/>
          </div>
        </div>

        {/* BOX 3 */}
        <div className='flex flex-wrap items-center gap-2 mb-4'>
          {statuses.map((status) => (
            <button key={status.id} className={`px-3 py-1.5 rounded-full text-sm ${status.color} font-medium transition-all cursor-pointer whitespace-nowrap`}>
              {status.label}
              <span className="text-[10px] px-1 py-0.5 rounded-full bg-white/20">{status.size}</span>
            </button>
          ))}
        </div>

        {/* BOX 4 */}
        <div className="flex items-center justify-between mb-3">
          <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer select-none">
            <input className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer accent-indigo-600" type="checkbox" />
            Select all
          </label>
          <span className="text-sm text-slate-500">14 invoices</span>
        </div>

        {/* BOX 5 */}
        <div className="group bg-white rounded-xl border transition-all duration-200 hover:shadow-card-hover border-slate-200">
          <div className='space-y-4'>
            {invoices.map((invoice) => (
              <div key={invoice.id} className="flex items-center gap-3 px-4 py-3.5">
                <input type='checkbox' 
                    className='size-4 border border-red-300' 
                />

                <div className="size-2.5 rounded-full bg-rose-500 shrink-0"></div>

                <button className="flex-1 min-w-0 text-left cursor-pointer">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-sm font-semibold text-slate-900">{invoice.invoiceId}</span>
                    <span className="text-[10px] font-semibold uppercase tracking-wider bg-rose-100 text-rose-700 px-1.5 py-0.5 rounded">
                      {invoice.status}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 truncate mt-0.5">{invoice.label}</p>
                </button>

                <div className="text-right shrink-0 hidden sm:block">
                  <p className="text-sm font-bold text-slate-900 font-mono">${invoice.price}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{invoice.items} items</p>
                </div>

                <div className="text-xs text-right shrink-0 hidden md:block min-w-25">
                  <p className="text-slate-500">{invoice.startDate}</p>
                  <p className="mt-0.5 text-rose-600 font-medium">Due {invoice.dueDate}</p>
                </div>

                <div className="shrink-0 hidden lg:block">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-rose-100 text-rose-700">
                    <span className="size-1.5 rounded-full bg-rose-500"></span>
                    {invoice.status}
                  </span>
                </div>

                <div className="relative shrink-0">
                  <button className="size-8 rounded-lg text-slate-500 hover:text-gray-700 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer">
                    <MoreHorizontal size={18} />
                  </button>
                </div>

              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
    <GlobalModal title="Invoice form" open={modal === "add"} onClose={() => setModal(null)}>
      <InvoiceModal onClose={() => setModal(null)}/>
    </GlobalModal>
   </div>
  )
}

export default InvoicesPage