import React, { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Ticket, 
  CheckCircle, 
  Clock, 
  TrendingUp,
  ArrowUp,
  ArrowDown,
  Users
} from 'lucide-react';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Avatar from '../../components/common/Avatar';
import { formatRelativeTime } from '../../utils/helpers';
import useTicketStore from '../../Stores/ticketStore';
import KPICard from '../../components/common/KPICard';
import { useShallow } from 'zustand/react/shallow';

const DashboardPage = () => {
  const { tickets, fetchTickets } = useTicketStore(
    useShallow((state) => ({
      tickets: state.tickets,
      fetchTickets: state.fetchTickets,
    })),
  );

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  // Calculate KPIs
  const kpis = useMemo(() => ({
    openTickets: tickets.filter(t => ['NEW', 'OPEN', 'IN_PROGRESS'].includes(t.status)).length,
    resolvedToday: tickets.filter(t => {
      const today = new Date().toDateString();
      const ticketDate = new Date(t.updatedAt).toDateString();
      return t.status === 'RESOLVED' && today === ticketDate;
    }).length,
    avgResponseTime: '2.5h',
    satisfaction: 94.5,
  }), [tickets]);

  const recentTickets = useMemo(() => tickets.slice(0, 5), [tickets]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-textPrimary mb-2 tracking-tight">Dashboard</h1>
        <p className="text-textSecondary">Welcome back! Here's what's happening today.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Open Tickets"
          value={kpis.openTickets}
          change="12%"
          trend="down"
          icon={Ticket}
          color="text-warning"
        />
        <KPICard
          title="Resolved Today"
          value={kpis.resolvedToday}
          change="18%"
          trend="up"
          icon={CheckCircle}
          color="text-success"
        />
        <KPICard
          title="Avg Response Time"
          value={kpis.avgResponseTime}
          change="5%"
          trend="down"
          icon={Clock}
          color="text-info"
        />
        <KPICard
          title="Satisfaction"
          value={`${kpis.satisfaction}%`}
          change="2.3%"
          trend="up"
          icon={TrendingUp}
          color="text-secondary"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Tickets */}
        <Card 
          title="Recent Tickets" 
          className="lg:col-span-2"
          hover
          headerAction={
            <Link to="/tickets" className="text-sm text-primary hover:text-primary-600 font-medium">
              View all
            </Link>
          }
        >
          <div className="space-y-4">
            {recentTickets.length === 0 ? (
              <div className="text-center py-8 text-textSecondary">
                <Ticket className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No tickets yet</p>
              </div>
            ) : (
              recentTickets.map(ticket => (
                <Link
                  key={ticket.id}
                  to={`/tickets/${ticket.id}`}
                  className="block p-4 border border-border/60 rounded-xl hover:border-primary/60 hover:bg-primary-50/50 transition-all duration-200"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-textPrimary truncate mb-1">
                        {ticket.subject}
                      </h4>
                      <p className="text-sm text-textSecondary truncate">
                        {ticket.customerName} • {formatRelativeTime(ticket.createdAt)}
                      </p>
                    </div>
                    <Badge 
                      variant={
                        ticket.priority === 'URGENT' ? 'error' :
                        ticket.priority === 'HIGH' ? 'warning' :
                        'default'
                      }
                      className="ml-3"
                    >
                      {ticket.priority}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={
                      ticket.status === 'RESOLVED' ? 'success' :
                      ticket.status === 'IN_PROGRESS' ? 'warning' :
                      'default'
                    }>
                      {ticket.status.replace('_', ' ')}
                    </Badge>
                    {ticket.assignedToName && (
                      <div className="flex items-center text-sm text-textSecondary">
                        <Avatar name={ticket.assignedToName} size="xs" className="mr-1" />
                        <span className="truncate">{ticket.assignedToName}</span>
                      </div>
                    )}
                  </div>
                </Link>
              ))
            )}
          </div>
        </Card>

        {/* Quick Stats */}
        <Card title="Quick Stats" hover>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-primary-50/60 rounded-xl">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center mr-3">
                  <Ticket className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-textSecondary">Total Tickets</p>
                  <p className="text-lg font-semibold text-textPrimary">{tickets.length}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-xl">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-success rounded-xl flex items-center justify-center mr-3">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-textSecondary">Resolved</p>
                  <p className="text-lg font-semibold text-textPrimary">
                    {tickets.filter(t => t.status === 'RESOLVED').length}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-amber-50 rounded-xl">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-warning rounded-xl flex items-center justify-center mr-3">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-textSecondary">In Progress</p>
                  <p className="text-lg font-semibold text-textPrimary">
                    {tickets.filter(t => t.status === 'IN_PROGRESS').length}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-teal-50 rounded-xl">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center mr-3">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-textSecondary">Active Agents</p>
                  <p className="text-lg font-semibold text-textPrimary">8</p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Ticket Distribution + Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card title="Tickets by Status" hover className="lg:col-span-2">
          <div className="space-y-3">
            {[
              { status: 'NEW', count: tickets.filter(t => t.status === 'NEW').length, color: 'bg-slate-500' },
              { status: 'OPEN', count: tickets.filter(t => t.status === 'OPEN').length, color: 'bg-blue-500' },
              { status: 'IN_PROGRESS', count: tickets.filter(t => t.status === 'IN_PROGRESS').length, color: 'bg-yellow-500' },
              { status: 'RESOLVED', count: tickets.filter(t => t.status === 'RESOLVED').length, color: 'bg-green-500' },
            ].map(item => {
              const percentage = tickets.length > 0 ? (item.count / tickets.length * 100).toFixed(1) : 0;
              return (
                <div key={item.status}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-textPrimary">{item.status.replace('_', ' ')}</span>
                    <span className="text-sm text-textSecondary">{item.count} ({percentage}%)</span>
                  </div>
                  <div className="w-full surface-muted rounded-full h-2">
                    <div 
                      className={`${item.color} h-2 rounded-full transition-all duration-300`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card title="Weekly Volume" subtitle="New tickets per day" hover>
          <div className="h-48 flex items-end gap-2">
            {[22, 30, 18, 36, 28, 42, 33].map((value, index) => (
              <div key={index} className="flex-1 flex flex-col items-center gap-2">
                <div
                  className="w-full rounded-xl bg-linear-to-t from-primary-600/70 to-primary-400/60 shadow-sm"
                  style={{ height: `${value * 2.2}px` }}
                />
                <span className="text-xs text-textSecondary">
                  {['M','T','W','T','F','S','S'][index]}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Tickets by Priority" hover>
          <div className="space-y-3">
            {[
              { priority: 'URGENT', count: tickets.filter(t => t.priority === 'URGENT').length, color: 'bg-red-500' },
              { priority: 'HIGH', count: tickets.filter(t => t.priority === 'HIGH').length, color: 'bg-orange-500' },
              { priority: 'MEDIUM', count: tickets.filter(t => t.priority === 'MEDIUM').length, color: 'bg-blue-500' },
              { priority: 'LOW', count: tickets.filter(t => t.priority === 'LOW').length, color: 'bg-slate-500' },
            ].map(item => {
              const percentage = tickets.length > 0 ? (item.count / tickets.length * 100).toFixed(1) : 0;
              return (
                <div key={item.priority}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-textPrimary">{item.priority}</span>
                    <span className="text-sm text-textSecondary">{item.count} ({percentage}%)</span>
                  </div>
                  <div className="w-full surface-muted rounded-full h-2">
                    <div 
                      className={`${item.color} h-2 rounded-full transition-all duration-300`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card title="SLA Health" subtitle="Resolution within SLA" hover>
          <div className="flex items-center justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-textSecondary">On time</span>
                <span className="text-sm font-medium text-textPrimary">86%</span>
              </div>
              <div className="w-full surface-muted rounded-full h-2">
                <div className="h-2 rounded-full bg-emerald-500" style={{ width: '86%' }} />
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-textSecondary">At risk</span>
                <span className="text-sm font-medium text-textPrimary">9%</span>
              </div>
              <div className="w-full surface-muted rounded-full h-2">
                <div className="h-2 rounded-full bg-amber-500" style={{ width: '9%' }} />
              </div>
            </div>
          </div>
          <div className="mt-4 text-xs text-textSecondary">
            Trend is improving week-over-week.
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
