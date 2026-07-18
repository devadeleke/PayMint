import { ArrowLeftRight, BellElectric, CheckCircle, Wallet } from 'lucide-react';

import { useAuthStore } from '../store/authStore';
import PageHeader from '../layouts/PageHeader';
import StatCard from '../components/ui/StatCard';

 const stats = [
    { id: 1, label: "Total Revenue", value: '45,280', icon: Wallet, color: "bg-indigo-200 text-indigo-600 " },
    { id: 2, label: "Outstanding", value: "8,420", icon: ArrowLeftRight, color: "text-teal-600 bg-teal-200" },
    { id: 3, label: "Paid", value: "32,150", icon: CheckCircle, color: "text-purple-600 bg-purple-200" },
    { id: 4, label: "Overdue", value: "4,170", icon: BellElectric, color: "text-amber-600 bg-amber-200" },
  ];

const DashboardPage = () => {
  const { user } = useAuthStore();
  console.log(user)

  return (
    <div>
      <PageHeader title={`Welcome, ${user?.fullName} 👋`} subtitle="Here's a snapshot of your activity." />
      <StatCard data={stats} />

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4 mb-8">
        {/* CARD 1 */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-bold text-lg text-gray-700">Revenue Overview</h2>  
            <p className='font-medium text-gray-300'>Last 6 month</p>
          </div> 
        </div>

        {/* CARD 2 */}
        <div className='bg-white rounded-2xl p-6 border border-gray-200'>
          <div className="mb-6">
            <h2 className="font-bold text-xl text-gray-700">Invoice</h2>  
          </div> 
        </div>
      </div>

      <div className='bg-white rounded-2xl p-6 border border-gray-200'>
        <div className='flex items-center justify-between mb-5'>
          <h2 className="font-bold text-lg text-gray-700">Recent Activity</h2>
          <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium cursor-pointer">View all</button>
        </div>

        <div className='space-y-4'>
          <div className="flex items-start gap-3 group">
            <div className="size-9 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
              <div className="size-4 flex items-center justify-center">
                <i className="ri-check-double-line text-emerald-600 text-sm"></i>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-slate-700 group-hover:text-slate-900 transition-colors">Invoice #INV-005 was paid by Acme Corp</p>
              <p className="text-xs text-slate-400 mt-0.5">2 hours ago</p>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  )
}

export default DashboardPage