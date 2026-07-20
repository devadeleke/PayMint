import { ArrowLeft, Building, CreditCard, Shield, File} from 'lucide-react';
import BusinessInfo from './BusinessInfo';

const links = [
  {id: 1, label: 'Business Info', path: '/settings/business-info', icon: Building },
  {id: 2, label: 'Invoice Default', path: '/settings/business-info', icon: File },
  {id: 3, label: 'Payment', path: '/settings/business-info', icon: CreditCard },
  {id: 4, label: 'Security', path: '/settings/business-info', icon: Shield }
]

const SettingsPage = () => {
  return (
    <>
      <div className='flex items-center gap-3 mb-6'>
        <button className='size-8 rounded-m text-gray-800 hover:text-blue-800 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer shrink-0'>
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className='text-lg font-semibold text-slate-900'>Settings</h1>
          <p className='text-xs text-slate-500 mt-0.5'>Manage your business profile, invoices, and account preferences</p>
        </div>
      </div>

      <div className='flex flex-col lg:flex-row gap-6'>
        <div className='lg:w-64 shrink-0'>
          <div className='bg-white border border-slate-200 p-1.5 rounded-xl lg:p-2 space-y-2 overflow-x-auto'>
            {links.map((item) => {
              const Icon = item.icon;
              return (
                <button key={item.id} className='w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap cursor-pointer relative bg-indigo-50 text-indigo-500'>
                  <Icon size={15} className='text-slate-500' />
                  <span className='flex-1 text-left'>{item.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        <div className='flex-1 min-w-0'>
          <div className='bg-white rounded-xl border border-slate-200 p-5 md:p-6'>
            <BusinessInfo />
          </div>
        </div>

      </div>
    </>
  )
}

export default SettingsPage