import { Outlet } from 'react-router';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const MainLayout = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className='flex flex-col flex-1'>
        <Topbar />
        <main className='flex-1 px-4 py-6 sm:px-6 overflow-y-scroll'>
          <div className='max-w-6xl mx-auto'>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

export default MainLayout