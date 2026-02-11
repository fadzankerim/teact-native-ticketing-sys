import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Ticket, 
  Users, 
  BarChart3, 
  Settings,
  LogOut,
  X,
  Kanban
} from 'lucide-react';
import useAuthStore from '../../Stores/authStore';
import useUIStore from '../../Stores/uiStore';
import Avatar from '../common/Avatar';
import { useShallow } from 'zustand/react/shallow';


const Sidebar = () => {
  const location = useLocation();
  const { user, logout } = useAuthStore(
    useShallow((state) => ({ user: state.user, logout: state.logout })),
  );
  const { sidebarOpen, setSidebarOpen } = useUIStore(
    useShallow((state) => ({
      sidebarOpen: state.sidebarOpen,
      setSidebarOpen: state.setSidebarOpen,
    })),
  );

  const menuItems = [
    { 
      path: '/dashboard', 
      icon: LayoutDashboard, 
      label: 'Dashboard',
      roles: ['AGENT', 'MANAGER', 'ADMIN']
    },
    { 
      path: '/tickets', 
      icon: Ticket, 
      label: 'Tickets',
      roles: ['CUSTOMER', 'AGENT', 'MANAGER', 'ADMIN']
    },
    { 
      path: '/tickets/board', 
      icon: Kanban, 
      label: 'Board',
      roles: ['AGENT', 'MANAGER', 'ADMIN']
    },
    { 
      path: '/analytics', 
      icon: BarChart3, 
      label: 'Analytics',
      roles: ['MANAGER', 'ADMIN']
    },
    { 
      path: '/users', 
      icon: Users, 
      label: 'Users',
      roles: ['ADMIN']
    },
    { 
      path: '/settings', 
      icon: Settings, 
      label: 'Settings',
      roles: ['CUSTOMER', 'AGENT', 'MANAGER', 'ADMIN']
    },
  ];

  const filteredMenuItems = menuItems.filter(item => 
    item.roles.includes(user?.role)
  );

  const handleLogout = () => {
    logout();
  };

  if (!sidebarOpen) {
    return null;
  }

  return (
    <>
      {/* Mobile overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-surface/85 text-textPrimary z-30 flex flex-col backdrop-blur border-r border-border/60">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border/60">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary/10 rounded-xl flex items-center justify-center">
              <img src='/src/assets/OrionLogo.jpeg' alt="Orion Logo" className="w-full h-full object-fill rounded-xl" />
            </div>
            <span className="text-xl font-bold">Orion</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-textSecondary hover:text-textPrimary"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User info */}
        <div className="p-4 border-b border-border/60">
          <div className="flex items-center space-x-3">
            <Avatar src={user?.avatar} name={user?.name} size="md" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.name}</p>
              <p className="text-xs text-textSecondary truncate">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-thin">
          {filteredMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || 
                           (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  flex items-center space-x-3 px-4 py-3 rounded-lg
                  transition-colors duration-200
                  ${isActive 
                    ? 'bg-primary/10 text-textPrimary' 
                    : 'text-textSecondary hover:bg-primary/10 hover:text-textPrimary'
                  }
                `}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-border/60">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 px-4 py-3 w-full rounded-lg text-textSecondary hover:bg-primary/10 hover:text-textPrimary hover:cursor-pointer transition-colors duration-200"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
