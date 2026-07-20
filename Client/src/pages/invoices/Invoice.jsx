import { ArrowLeft } from 'lucide-react';

const Invoice = () => {
  return (
    <div>
        <div class="flex items-center justify-between mb-6">
            <button className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 transition-colors cursor-pointer">
                <ArrowLeft size={15} />
                <span>Back to clients</span>
            </button>
        </div>
    </div>
  )
}

export default Invoice