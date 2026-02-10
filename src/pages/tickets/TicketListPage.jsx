import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Filter, Download, Search, Grid, List } from 'lucide-react';
import useTicketStore from '../../Stores/ticketStore';
import { useShallow } from 'zustand/react/shallow';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Avatar from '../../components/common/Avatar';
import Input from '../../components/common/Input';
import Skeleton from '../../components/common/Skeleton';
import { formatRelativeTime } from '../../utils/helpers';
import { 
  TICKET_STATUS, 
  TICKET_PRIORITY,
  TICKET_STATUS_LABELS,
  TICKET_PRIORITY_LABELS 
} from '../../utils/constants';

const TicketListPage = () => {
  const { tickets, fetchTickets, isLoading, filters, setFilters } = useTicketStore(
    useShallow((state) => ({
      tickets: state.tickets,
      fetchTickets: state.fetchTickets,
      isLoading: state.isLoading,
      filters: state.filters,
      setFilters: state.setFilters,
    })),
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets, filters]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  useEffect(() => {
    const debounceId = setTimeout(() => {
      setFilters({ searchQuery });
    }, 250);
    return () => clearTimeout(debounceId);
  }, [searchQuery, setFilters]);

  const handleStatusFilter = (status) => {
    const newStatuses = filters.status.includes(status)
      ? filters.status.filter(s => s !== status)
      : [...filters.status, status];
    setFilters({ status: newStatuses });
  };

  const handlePriorityFilter = (priority) => {
    const newPriorities = filters.priority.includes(priority)
      ? filters.priority.filter(p => p !== priority)
      : [...filters.priority, priority];
    setFilters({ priority: newPriorities });
  };

  const clearFilters = () => {
    setFilters({ status: [], priority: [], searchQuery: '' });
    setSearchQuery('');
  };

  const activeFilterCount = useMemo(
    () => filters.status.length + filters.priority.length,
    [filters.status.length, filters.priority.length],
  );

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case TICKET_STATUS.NEW: return 'default';
      case TICKET_STATUS.OPEN: return 'info';
      case TICKET_STATUS.IN_PROGRESS: return 'warning';
      case TICKET_STATUS.RESOLVED: return 'success';
      case TICKET_STATUS.CLOSED: return 'secondary';
      default: return 'default';
    }
  };

  const getPriorityBadgeVariant = (priority) => {
    switch (priority) {
      case TICKET_PRIORITY.URGENT: return 'error';
      case TICKET_PRIORITY.HIGH: return 'warning';
      case TICKET_PRIORITY.MEDIUM: return 'info';
      case TICKET_PRIORITY.LOW: return 'default';
      default: return 'default';
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-textPrimary mb-2 tracking-tight">Tickets</h1>
          <p className="text-textSecondary">Manage and track all support tickets</p>
        </div>
        <Link to="/tickets/new">
          <Button variant="primary" leftIcon={<Plus className="w-5 h-5" />}>
            Create Ticket
          </Button>
        </Link>
      </div>

      {/* Filters and Actions */}
      <Card>
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <Input
              placeholder="Search tickets..."
              value={searchQuery}
              onChange={handleSearch}
              leftIcon={<Search className="w-5 h-5 text-textSecondary" />}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              leftIcon={<Filter className="w-5 h-5" />}
              onClick={() => setShowFilters(!showFilters)}
            >
              Filters
              {activeFilterCount > 0 && (
                <Badge variant="primary" className="ml-2">
                  {activeFilterCount}
                </Badge>
              )}
            </Button>

            <div className="border-l border-border mx-2" />

            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'table' 
                  ? 'bg-primary text-white shadow-sm' 
                  : 'text-textSecondary hover:bg-slate-100'
              }`}
            >
              <List className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid' 
                  ? 'bg-primary text-white shadow-sm' 
                  : 'text-textSecondary hover:bg-slate-100'
              }`}
            >
              <Grid className="w-5 h-5" />
            </button>

            <div className="border-l border-border mx-2" />

            <Button variant="ghost" leftIcon={<Download className="w-5 h-5" />}>
              Export
            </Button>
          </div>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="mt-6 pt-6 border-t border-border">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Status Filters */}
              <div>
                <h3 className="text-sm font-medium text-textPrimary mb-3">Status</h3>
                <div className="flex flex-wrap gap-2">
                  {Object.values(TICKET_STATUS).map(status => (
                    <button
                      key={status}
                      onClick={() => handleStatusFilter(status)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        filters.status.includes(status)
                          ? 'bg-primary text-white'
                          : 'bg-slate-100 text-textPrimary hover:bg-slate-200'
                      }`}
                    >
                      {TICKET_STATUS_LABELS[status]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Priority Filters */}
              <div>
                <h3 className="text-sm font-medium text-textPrimary mb-3">Priority</h3>
                <div className="flex flex-wrap gap-2">
                  {Object.values(TICKET_PRIORITY).map(priority => (
                    <button
                      key={priority}
                      onClick={() => handlePriorityFilter(priority)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        filters.priority.includes(priority)
                          ? 'bg-primary text-white'
                          : 'bg-slate-100 text-textPrimary hover:bg-slate-200'
                      }`}
                    >
                      {TICKET_PRIORITY_LABELS[priority]}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {(filters.status.length > 0 || filters.priority.length > 0) && (
              <div className="mt-4">
                <Button variant="ghost" onClick={clearFilters}>
                  Clear all filters
                </Button>
              </div>
            )}
          </div>
        )}
      </Card>

      {/* Tickets Display */}
      {isLoading ? (
        <Card>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-5 w-24" />
            </div>
            <div className="space-y-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="grid grid-cols-12 gap-4 items-center">
                  <Skeleton className="h-4 col-span-3" />
                  <Skeleton className="h-4 col-span-3" />
                  <Skeleton className="h-4 col-span-2" />
                  <Skeleton className="h-4 col-span-2" />
                  <Skeleton className="h-4 col-span-2" />
                </div>
              ))}
            </div>
          </div>
        </Card>
      ) : tickets.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-textSecondary" />
            </div>
            <h3 className="text-lg font-semibold text-textPrimary mb-2">No tickets found</h3>
            <p className="text-textSecondary mb-6">Try adjusting your filters or create a new ticket</p>
            <Link to="/tickets/new">
              <Button variant="primary">Create New Ticket</Button>
            </Link>
          </div>
        </Card>
      ) : viewMode === 'table' ? (
        <Card padding={false}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-border">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">
                    Ticket
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">
                    Assigned To
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">
                    Created
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-border">
                {tickets.map(ticket => (
                  <tr 
                    key={ticket.id}
                    className="hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <td className="px-6 py-4">
                      <Link to={`/tickets/${ticket.id}`} className="block group">
                        <div className="text-sm font-medium text-primary hover:text-primary-600">
                          #{ticket.id}
                        </div>
                        <div className="text-sm text-textPrimary max-w-xs truncate group-hover:text-slate-900">
                          {ticket.subject}
                        </div>
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <Avatar name={ticket.customerName} size="sm" />
                        <div className="ml-3">
                          <div className="text-sm font-medium text-textPrimary">
                            {ticket.customerName}
                          </div>
                          <div className="text-sm text-textSecondary">
                            {ticket.customerEmail}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={getStatusBadgeVariant(ticket.status)}>
                        {TICKET_STATUS_LABELS[ticket.status]}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={getPriorityBadgeVariant(ticket.priority)}>
                        {TICKET_PRIORITY_LABELS[ticket.priority]}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      {ticket.assignedToName ? (
                        <div className="flex items-center">
                          <Avatar name={ticket.assignedToName} size="xs" />
                          <span className="ml-2 text-sm text-textPrimary">
                            {ticket.assignedToName}
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm text-textSecondary">Unassigned</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-textSecondary">
                      {formatRelativeTime(ticket.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tickets.map(ticket => (
            <Link key={ticket.id} to={`/tickets/${ticket.id}`}>
              <Card hover className="h-full">
                <div className="flex items-start justify-between mb-3">
                  <Badge variant={getPriorityBadgeVariant(ticket.priority)}>
                    {TICKET_PRIORITY_LABELS[ticket.priority]}
                  </Badge>
                  <span className="text-sm text-textSecondary">#{ticket.id}</span>
                </div>

                <h3 className="font-semibold text-textPrimary mb-2 line-clamp-2">
                  {ticket.subject}
                </h3>

                <p className="text-sm text-textSecondary mb-4 line-clamp-2">
                  {ticket.description}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="flex items-center">
                    <Avatar name={ticket.customerName} size="sm" />
                    <span className="ml-2 text-sm text-textPrimary">
                      {ticket.customerName}
                    </span>
                  </div>
                  <Badge variant={getStatusBadgeVariant(ticket.status)}>
                    {TICKET_STATUS_LABELS[ticket.status]}
                  </Badge>
                </div>

                <div className="mt-3 text-xs text-textSecondary">
                  {formatRelativeTime(ticket.createdAt)}
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {/* Pagination */}
      {tickets.length > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-textSecondary">
            Showing {tickets.length} of {tickets.length} tickets
          </p>
          {/* Add pagination controls here */}
        </div>
      )}
    </div>
  );
};

export default TicketListPage;
