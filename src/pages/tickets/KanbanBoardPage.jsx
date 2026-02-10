import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Avatar from '../../components/common/Avatar';
import Skeleton from '../../components/common/Skeleton';
import Button from '../../components/common/Button';
import { Kanban as KanbanIcon, X } from 'lucide-react';
import useTicketStore from '../../Stores/ticketStore';
import { useShallow } from 'zustand/react/shallow';
import { TICKET_PRIORITY, TICKET_STATUS, TICKET_STATUS_LABELS } from '../../utils/constants';
import { formatRelativeTime } from '../../utils/helpers';
import { toast } from 'react-hot-toast';

const KanbanBoardPage = () => {
  const { tickets, fetchTickets, updateTicket, isLoading, kanbanOrder, initKanbanOrder, moveTicketInKanban, wipLimits, setWipLimit } = useTicketStore(
    useShallow((state) => ({
      tickets: state.tickets,
      fetchTickets: state.fetchTickets,
      updateTicket: state.updateTicket,
      isLoading: state.isLoading,
      kanbanOrder: state.kanbanOrder,
      initKanbanOrder: state.initKanbanOrder,
      moveTicketInKanban: state.moveTicketInKanban,
      wipLimits: state.wipLimits,
      setWipLimit: state.setWipLimit,
    })),
  );
  const [draggingId, setDraggingId] = useState(null);
  const [selectedTicketId, setSelectedTicketId] = useState(null);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  useEffect(() => {
    if (tickets.length > 0) {
      initKanbanOrder();
    }
  }, [tickets.length, initKanbanOrder]);

  const columns = useMemo(() => ([
    TICKET_STATUS.NEW,
    TICKET_STATUS.OPEN,
    TICKET_STATUS.IN_PROGRESS,
    TICKET_STATUS.AWAITING_CUSTOMER,
    TICKET_STATUS.RESOLVED,
    TICKET_STATUS.CLOSED,
  ]), []);

  const ticketsById = useMemo(() => {
    return tickets.reduce((acc, ticket) => {
      acc[ticket.id] = ticket;
      return acc;
    }, {});
  }, [tickets]);

  const ticketsByStatus = useMemo(() => {
    return columns.reduce((acc, status) => {
      const orderedIds = kanbanOrder[status] || [];
      const orderedTickets = orderedIds.map((id) => ticketsById[id]).filter(Boolean);
      const unordered = tickets.filter((t) => t.status === status && !orderedIds.includes(t.id));
      acc[status] = [...orderedTickets, ...unordered];
      return acc;
    }, {});
  }, [columns, kanbanOrder, tickets, ticketsById]);

  const handleDrop = async (status, event, toIndex = null) => {
    event.preventDefault();
    const ticketId = event.dataTransfer.getData('text/plain');
    const fromStatus = event.dataTransfer.getData('from-status');
    if (!ticketId) return;
    setDraggingId(null);
    const ticket = tickets.find((t) => t.id === ticketId);
    if (!ticket || ticket.status === status) return;
    const limit = wipLimits[status];
    const count = (ticketsByStatus[status] || []).length;
    if (Number.isFinite(limit) && count >= limit) {
      toast.error(`WIP limit reached for ${TICKET_STATUS_LABELS[status]}`);
      return;
    }
    moveTicketInKanban(ticketId, fromStatus || ticket.status, status, toIndex);
    await updateTicket(ticketId, { status });
  };

  const handleReorder = (status, event, toIndex) => {
    event.preventDefault();
    const ticketId = event.dataTransfer.getData('text/plain');
    const fromStatus = event.dataTransfer.getData('from-status');
    if (!ticketId || fromStatus !== status) return;
    moveTicketInKanban(ticketId, status, status, toIndex);
  };

  const selectedTicket = selectedTicketId ? ticketsById[selectedTicketId] : null;

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case TICKET_STATUS.NEW: return 'default';
      case TICKET_STATUS.OPEN: return 'info';
      case TICKET_STATUS.IN_PROGRESS: return 'warning';
      case TICKET_STATUS.AWAITING_CUSTOMER: return 'secondary';
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
      <div>
        <h1 className="text-3xl font-bold text-textPrimary mb-2 tracking-tight">Kanban Board</h1>
        <p className="text-textSecondary">Visual ticket management</p>
      </div>

      {isLoading ? (
        <Card>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="space-y-3">
                <Skeleton className="h-6 w-28" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
              </div>
            ))}
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {columns.map((status) => (
            <div
              key={status}
              className="bg-surface rounded-xl border border-border/60 shadow-card overflow-hidden"
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => handleDrop(status, event)}
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-border/60 bg-slate-50">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-textPrimary">
                    {TICKET_STATUS_LABELS[status]}
                  </span>
                  <Badge size="sm">{ticketsByStatus[status]?.length || 0}</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    className="w-14 text-xs px-2 py-1 rounded-md border border-border/60 bg-surface"
                    value={wipLimits[status] ?? 0}
                    onChange={(event) => setWipLimit(status, Number(event.target.value || 0))}
                    aria-label={`${TICKET_STATUS_LABELS[status]} WIP limit`}
                  />
                  <KanbanIcon className="w-4 h-4 text-textSecondary" />
                </div>
              </div>
              <div className="p-3 space-y-3 min-h-[140px]">
                {(ticketsByStatus[status] || []).map((ticket, index) => (
                  <div
                    key={ticket.id}
                    draggable
                    onDragStart={(event) => {
                      event.dataTransfer.setData('text/plain', ticket.id);
                      event.dataTransfer.setData('from-status', ticket.status);
                      setDraggingId(ticket.id);
                    }}
                    onDragEnd={() => setDraggingId(null)}
                    onDragOver={(event) => event.preventDefault()}
                    onDrop={(event) => handleReorder(status, event, index)}
                    onClick={() => {
                      if (!draggingId) setSelectedTicketId(ticket.id);
                    }}
                    className={`rounded-xl border border-border/60 bg-surface p-3 shadow-sm transition-all ${
                      draggingId === ticket.id ? 'opacity-60 scale-[0.98]' : 'hover:-translate-y-0.5 hover:shadow-card-hover'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-primary">#{ticket.id}</span>
                      <Badge size="sm" variant="secondary">{ticket.priority}</Badge>
                    </div>
                    <p className="text-sm font-semibold text-textPrimary line-clamp-2">
                      {ticket.subject}
                    </p>
                    <div className="flex items-center justify-between mt-3 text-xs text-textSecondary">
                      <div className="flex items-center gap-2">
                        <Avatar name={ticket.customerName} size="xs" />
                        <span className="truncate max-w-[90px]">{ticket.customerName}</span>
                      </div>
                      <span>{formatRelativeTime(ticket.createdAt)}</span>
                    </div>
                  </div>
                ))}
                {(ticketsByStatus[status] || []).length === 0 && (
                  <div className="text-xs text-textSecondary border border-dashed border-border/70 rounded-lg p-4 text-center">
                    Drop tickets here
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedTicket && (
        <>
          <div
            className="fixed inset-0 bg-slate-900/40 z-40"
            onClick={() => setSelectedTicketId(null)}
          />
          <div className="fixed right-0 top-0 h-full w-full max-w-md bg-surface z-50 shadow-2xl border-l border-border/60">
            <div className="flex items-center justify-between p-5 border-b border-border/60">
              <div>
                <p className="text-xs text-textSecondary">Ticket #{selectedTicket.id}</p>
                <h2 className="text-lg font-semibold text-textPrimary line-clamp-1">
                  {selectedTicket.subject}
                </h2>
              </div>
              <button
                onClick={() => setSelectedTicketId(null)}
                className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-5 overflow-y-auto h-full">
              <div className="flex items-center gap-2">
                <Badge variant={getStatusBadgeVariant(selectedTicket.status)}>
                  {TICKET_STATUS_LABELS[selectedTicket.status]}
                </Badge>
                <Badge variant={getPriorityBadgeVariant(selectedTicket.priority)}>
                  {selectedTicket.priority}
                </Badge>
              </div>

              <p className="text-sm text-textSecondary">
                Created {formatRelativeTime(selectedTicket.createdAt)}
              </p>

              <div className="bg-slate-50 rounded-xl p-4 text-sm text-textPrimary whitespace-pre-wrap">
                {selectedTicket.description}
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-textSecondary">Customer</span>
                  <div className="flex items-center gap-2">
                    <Avatar name={selectedTicket.customerName} size="xs" />
                    <span className="text-textPrimary">{selectedTicket.customerName}</span>
                  </div>
                </div>
                {selectedTicket.assignedToName && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-textSecondary">Assigned</span>
                    <span className="text-textPrimary">{selectedTicket.assignedToName}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3">
                <Link to={`/tickets/${selectedTicket.id}`} className="flex-1">
                  <Button variant="primary" fullWidth>Open ticket</Button>
                </Link>
                <Button variant="outline" onClick={() => setSelectedTicketId(null)}>
                  Close
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default KanbanBoardPage;
