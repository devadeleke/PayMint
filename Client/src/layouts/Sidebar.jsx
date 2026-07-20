import { PanelLeftClose, LayoutDashboard, LogOut, Users, CreditCard, Settings, User, Zap  } from "lucide-react"
import { NavLink } from "react-router";

const NavItems = [
  { label: "Dashboard", path: "/", icon: LayoutDashboard  },
  { label: "Invoices", path: "invoices", icon: User  },
  { label: "Clients", path: "clients", icon: Users  },
  { label: "Settings", path: "settings", icon: Settings },
]

const Sidebar = ({ collapsed, toggleCollapse, toggleSidebar, isMobile}) => {
  return (
    <div className="flex flex-col h-full w-64 border-r border-gray-200">

       {/* LOGO */}
       <div className="flex items-center h-16 border-b border-slate-100 justify-between px-4">
         <button className="flex items-center gap-3 cursor-pointer min-w-0">
          <div className="size-9 rounded-lg bg-primary text-white flex items-center justify-center shrink-0">
            <Zap size={18} />
          </div>
          <span className="text-lg font-bold text-slate-900 truncate">PayMint</span>
         </button>
         <button>
           <PanelLeftClose size={18}/>
         </button>
       </div>

       {/* NAV ITEMS */}
       <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto">
       {NavItems.map((item) => {
        const Icon = item.icon;
        return (
            <NavLink key={item.path}
                to={item.path}
                end
                className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-md text-sm
                 font-medium text-slate-600 transition-all duration-150
                 ${isActive ? "bg-primary text-white shadow-sm" : "hover:text-gray-600 hover:bg-slate-200 " } `}
            >
               <Icon size={18} className="shrink-0" />
               {item.label}
            </NavLink>
        )
       })}
       </nav>

       {/* LOOUT */}
      <div className="px-3 py-4 border-t border-gray-200">
        <button className='flex items-center gap-3 text-red-500 hover:text-red-800 transition-colors duration-300'>
          <LogOut size={18} className="shrink-0" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  )
}

export default Sidebar