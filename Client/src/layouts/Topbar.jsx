import { Menu } from 'lucide-react';

const Topbar = () => {
  return (
    <header className="flex items-center justify-between h-16 px-8 sm:px-6 bg-white border-b border-gray-200 sticky top-0 z-40">
      <div>
        <div className='flex items-center space-x-3'>
          <div className='flex lg:hidden'>
            <Menu size={20} />
          </div>
          <h1 className="text-sm font-semibold leading-tight">AOV HUB</h1>
        </div>
      </div>
    </header>
  )
}

export default Topbar