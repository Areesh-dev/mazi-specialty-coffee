import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, Coffee, LayoutGrid, Calendar, Users, Star, 
  Settings, FileText, LogOut, Menu, X, ChevronRight 
} from 'lucide-react';

const AdminLayout = () => {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await signOut();
    navigate('/admin/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Categories', path: '/admin/categories', icon: LayoutGrid },
    { name: 'Menu', path: '/admin/menu', icon: Coffee },
    { name: 'Collaborations', path: '/admin/collaborations', icon: Users },
    { name: 'Events', path: '/admin/events', icon: Calendar },
    { name: 'Upcoming Events', path: '/admin/upcoming-events', icon: Calendar },
    { name: 'Reviews', path: '/admin/reviews', icon: Star },
    { name: 'Website Content', path: '/admin/content', icon: FileText },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-primary text-white transition-transform duration-300 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:inset-0 flex flex-col`}>
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <span className="font-heading text-2xl font-bold">MAZI Admin</span>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-white/70 hover:text-white"><X size={24} /></button>
        </div>
        <nav className="flex-1 overflow-y-auto py-4">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={() => setIsSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-6 py-3 transition-colors ${isActive ? 'bg-accent text-primary font-semibold' : 'text-white/70 hover:bg-white/5 hover:text-white'}`
              }
            >
              <item.icon size={20} />
              <span className="text-sm">{item.name}</span>
              <ChevronRight size={16} className="ml-auto opacity-50" />
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-white/10">
          <div className="text-xs text-white/50 mb-2 truncate">{user?.email}</div>
          <button onClick={handleLogout} className="flex items-center gap-2 text-sm text-red-300 hover:text-red-100 transition-colors w-full p-2 rounded hover:bg-white/5">
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6 lg:hidden">
          <button onClick={() => setIsSidebarOpen(true)} className="text-primary"><Menu size={24} /></button>
          <span className="font-heading font-bold text-primary">MAZI Admin</span>
          <div className="w-6" />
        </header>
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;