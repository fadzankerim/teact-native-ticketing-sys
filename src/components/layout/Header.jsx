import React, { useEffect, useState } from 'react';
import { Search, Bell, Menu } from 'lucide-react';
import useUIStore from '../../Stores/uiStore';
import useAuthStore from '../../Stores/authStore';
import Avatar from '../common/Avatar';
import Badge from '../common/Badge';
import useTicketStore from '../../Stores/ticketStore';
import { useShallow } from 'zustand/react/shallow';

const Header = () => {
  const { toggleSidebar, notifications } = useUIStore(
    useShallow((state) => ({
      toggleSidebar: state.toggleSidebar,
      notifications: state.notifications,
    })),
  );
  const { user } = useAuthStore(
    useShallow((state) => ({ user: state.user })),
  );
  const { filters, setFilters } = useTicketStore(
    useShallow((state) => ({
      filters: state.filters,
      setFilters: state.setFilters,
    })),
  );
  const [showNotifications, setShowNotifications] = useState(false);
  const [headerSearch, setHeaderSearch] = useState(filters.searchQuery || '');

  useEffect(() => {
    const debounceId = setTimeout(() => {
      setFilters({ searchQuery: headerSearch });
    }, 250);
    return () => clearTimeout(debounceId);
  }, [headerSearch, setFilters]);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="bg-surface/75 border-b border-border sticky top-0 z-10 backdrop-blur">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left side */}
        <div className="flex items-center space-x-4 flex-1">
          <button
            onClick={toggleSidebar}
            className="lg:hidden text-textSecondary hover:text-textPrimary"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Search */}
          <div className="relative w-full max-w-md hidden md:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-textSecondary" />
            <input
              type="text"
              placeholder="Search tickets..."
              value={headerSearch}
              onChange={(event) => setHeaderSearch(event.target.value)}
              className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-surface/70 text-textPrimary border border-border/60 backdrop-blur shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary/60 transition-all duration-200"
            />
            {headerSearch.length > 0 && (
              <button
                onClick={() => setHeaderSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-textSecondary hover:text-textPrimary"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-textSecondary hover:text-textPrimary hover:bg-primary/10 rounded-lg transition-colors"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-error text-white text-xs rounded-full flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {/* Notifications dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-surface rounded-lg shadow-card border border-border/60 overflow-hidden">
                <div className="p-4 border-b border-border">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-textPrimary">Notifications</h3>
                    {unreadCount > 0 && (
                      <Badge variant="primary">{unreadCount} new</Badge>
                    )}
                  </div>
                </div>
                
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center text-textSecondary">
                      <Bell className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>No notifications</p>
                    </div>
                  ) : (
                    notifications.slice(0, 5).map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 border-b border-border/60 hover:bg-primary/10 cursor-pointer ${
                          !notification.read ? 'surface-muted' : ''
                        }`}
                      >
                        <p className="text-sm text-textPrimary">{notification.message}</p>
                        <p className="text-xs text-textSecondary mt-1">
                          {new Date(notification.createdAt).toLocaleTimeString()}
                        </p>
                      </div>
                    ))
                  )}
                </div>

                {notifications.length > 0 && (
                  <div className="p-3 border-t border-border text-center">
                    <button className="text-sm text-primary hover:text-primary-600 font-medium">
                      View all notifications
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* User avatar */}
          <div className="flex items-center space-x-3">
            <div className="hidden md:block text-right">
              <p className="text-sm font-medium text-textPrimary">{user?.name}</p>
              <p className="text-xs text-textSecondary">{user?.role}</p>
            </div>
            <Avatar src={user?.avatar} name={user?.name} size="md" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
