/* eslint-disable no-unused-vars */
import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  Send,
  Paperclip,
  Clock,
  User,
  Mail,
  Calendar,
} from "lucide-react";
import { toast } from "react-hot-toast";
import useTicketStore from "../../Stores/ticketStore";
import useAuthStore from "../../Stores/authStore";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Badge from "../../components/common/Badge";
import Avatar from "../../components/common/Avatar";
import Dropdown from "../../components/common/Dropdown";
import Skeleton from "../../components/common/Skeleton";
import { formatDateTime, formatRelativeTime } from "../../utils/helpers";
import {
  TICKET_STATUS,
  TICKET_PRIORITY,
  TICKET_STATUS_LABELS,
  TICKET_PRIORITY_LABELS,
} from "../../utils/constants";
import { useShallow } from "zustand/react/shallow";

const TicketDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const {
    currentTicket,
    fetchTicketById,
    updateTicket,
    addComment,
    isLoading,
    clearCurrentTicket,
  } = useTicketStore(
    useShallow((state) => ({
      currentTicket: state.currentTicket,
      fetchTicketById: state.fetchTicketById,
      updateTicket: state.updateTicket,
      addComment: state.addComment,
      isLoading: state.isLoading,
      clearCurrentTicket: state.clearCurrentTicket,
    })),
  );

  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchTicketById(id);
    return () => clearCurrentTicket();
  }, [id, fetchTicketById, clearCurrentTicket]);

  const handleStatusChange = async (newStatus) => {
    try {
      await updateTicket(id, { status: newStatus });
      toast.success("Status updated successfully");
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const handlePriorityChange = async (newPriority) => {
    try {
      await updateTicket(id, { priority: newPriority });
      toast.success("Priority updated successfully");
    } catch (error) {
      toast.error("Failed to update priority");
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setIsSubmitting(true);
    try {
      await addComment(id, comment);
      setComment("");
      toast.success("Comment added");
    } catch (error) {
      toast.error("Failed to add comment");
    } finally {
      setIsSubmitting(false);
    }
  };

  const statusOptions = useMemo(
    () =>
      Object.values(TICKET_STATUS).map((status) => ({
        value: status,
        label: TICKET_STATUS_LABELS[status],
      })),
    [],
  );

  const priorityOptions = useMemo(
    () =>
      Object.values(TICKET_PRIORITY).map((priority) => ({
        value: priority,
        label: TICKET_PRIORITY_LABELS[priority],
      })),
    [],
  );

  if (isLoading || !currentTicket) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-6 w-24" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card hover>
              <div className="space-y-4">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            </Card>
            <Card title="Activity" hover>
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="flex space-x-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-1/3" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
          <div className="space-y-6">
            <Card title="Ticket Details" hover>
              <div className="space-y-3">
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-10 w-full" />
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case TICKET_STATUS.NEW:
        return "default";
      case TICKET_STATUS.OPEN:
        return "info";
      case TICKET_STATUS.IN_PROGRESS:
        return "warning";
      case TICKET_STATUS.RESOLVED:
        return "success";
      case TICKET_STATUS.CLOSED:
        return "secondary";
      default:
        return "default";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case TICKET_PRIORITY.URGENT:
        return "error";
      case TICKET_PRIORITY.HIGH:
        return "warning";
      case TICKET_PRIORITY.MEDIUM:
        return "info";
      case TICKET_PRIORITY.LOW:
        return "default";
      default:
        return "default";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate("/tickets")}
            className="p-2 hover:bg-primary/10 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-textSecondary" />
          </button>
          <div>
            <div className="flex items-center space-x-3 mb-1">
            <h1 className="text-2xl font-bold text-textPrimary tracking-tight">
              Ticket #{currentTicket.id}
            </h1>
              <Badge variant={getPriorityColor(currentTicket.priority)}>
                {TICKET_PRIORITY_LABELS[currentTicket.priority]}
              </Badge>
            </div>
            <p className="text-textSecondary">
              Created {formatRelativeTime(currentTicket.createdAt)}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Ticket Info */}
          <Card hover>
            <h2 className="text-xl font-semibold text-textPrimary mb-4">
              {currentTicket.subject}
            </h2>

            <div className="flex items-center space-x-4 mb-6 pb-6 border-b border-border">
              <Avatar name={currentTicket.customerName} size="lg" />
              <div>
                <p className="font-medium text-textPrimary">
                  {currentTicket.customerName}
                </p>
                <p className="text-sm text-textSecondary">
                  {currentTicket.customerEmail}
                </p>
                <p className="text-xs text-textSecondary mt-1">
                  {formatDateTime(currentTicket.createdAt)}
                </p>
              </div>
            </div>

            <div className="prose max-w-none">
              <p className="text-textPrimary whitespace-pre-wrap">
                {currentTicket.description}
              </p>
            </div>

            {currentTicket.attachments &&
              currentTicket.attachments.length > 0 && (
                <div className="mt-6 pt-6 border-t border-border">
                  <h3 className="text-sm font-medium text-textPrimary mb-3">
                    Attachments
                  </h3>
                  <div className="space-y-2">
                    {currentTicket.attachments.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center p-3 surface-muted rounded-lg"
                      >
                        <Paperclip className="w-5 h-5 text-textSecondary mr-3" />
                        <span className="text-sm text-textPrimary">
                          {file.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
          </Card>

          {/* Comments */}
          <Card title="Activity" hover>
            <div className="space-y-6">
              {currentTicket.comments && currentTicket.comments.length > 0 ? (
                currentTicket.comments.map((comment) => (
                  <div key={comment.id} className="flex space-x-4">
                    <Avatar name={comment.author} size="md" />
                    <div className="flex-1">
                      <div className="surface-muted rounded-lg p-4 glass-hover">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-textPrimary">
                              {comment.author}
                            </span>
                            <Badge
                              variant={
                                comment.authorRole === "AGENT"
                                  ? "primary"
                                  : "default"
                              }
                              size="sm"
                            >
                              {comment.authorRole}
                            </Badge>
                          </div>
                          <span className="text-xs text-textSecondary">
                            {formatRelativeTime(comment.createdAt)}
                          </span>
                        </div>
                        <p className="text-textPrimary whitespace-pre-wrap">
                          {comment.content}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-textSecondary py-8">
                  No comments yet
                </p>
              )}
            </div>

            {/* Add Comment Form */}
            <form
              onSubmit={handleAddComment}
              className="mt-6 pt-6 border-t border-border"
            >
              <div className="flex space-x-4">
                <Avatar name={user?.name} size="md" />
                <div className="flex-1">
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Add a comment..."
                    rows={3}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary/60 resize-none bg-surface"
                  />
                  <div className="flex items-center justify-between mt-3">
                    <button
                      type="button"
                      className="text-textSecondary hover:text-textPrimary transition-colors"
                    >
                      <Paperclip className="w-5 h-5" />
                    </button>
                    <Button
                      type="submit"
                      variant="primary"
                      isLoading={isSubmitting}
                      leftIcon={<Send className="w-4 h-4" />}
                      disabled={!comment.trim()}
                    >
                      Send
                    </Button>
                  </div>
                </div>
              </div>
            </form>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Ticket Details */}
          <Card title="Ticket Details" hover>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-textSecondary mb-2 block">
                  Status
                </label>
                <Dropdown
                  options={statusOptions}
                  value={currentTicket.status}
                  onChange={handleStatusChange}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-textSecondary mb-2 block">
                  Priority
                </label>
                <Dropdown
                  options={priorityOptions}
                  value={currentTicket.priority}
                  onChange={handlePriorityChange}
                />
              </div>

              <div className="pt-4 border-t border-border">
                <div className="flex items-center text-sm text-textSecondary mb-2">
                  <User className="w-4 h-4 mr-2" />
                  <span>Customer</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Avatar name={currentTicket.customerName} size="sm" />
                  <div>
                    <p className="text-sm font-medium text-textPrimary">
                      {currentTicket.customerName}
                    </p>
                    <p className="text-xs text-textSecondary">
                      {currentTicket.customerEmail}
                    </p>
                  </div>
                </div>
              </div>

              {currentTicket.assignedToName && (
                <div className="pt-4 border-t border-border">
                  <div className="flex items-center text-sm text-textSecondary mb-2">
                    <User className="w-4 h-4 mr-2" />
                    <span>Assigned To</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Avatar name={currentTicket.assignedToName} size="sm" />
                    <p className="text-sm font-medium text-textPrimary">
                      {currentTicket.assignedToName}
                    </p>
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-border">
                <div className="flex items-center text-sm text-textSecondary mb-2">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>Created</span>
                </div>
                <p className="text-sm text-textPrimary">
                  {formatDateTime(currentTicket.createdAt)}
                </p>
              </div>

              <div className="pt-4 border-t border-border">
                <div className="flex items-center text-sm text-textSecondary mb-2">
                  <Clock className="w-4 h-4 mr-2" />
                  <span>Last Updated</span>
                </div>
                <p className="text-sm text-textPrimary">
                  {formatDateTime(currentTicket.updatedAt)}
                </p>
              </div>
            </div>
          </Card>

          {/* AI Suggestions */}
          <Card
            title="AI Suggestions"
            className="bg-linear-to-br from-primary-50/70 to-secondary-50/60 border-primary-100"
            hover
          >
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-textPrimary mb-2">
                  Suggested Category
                </h4>
                <Badge variant="primary">{currentTicket.category}</Badge>
              </div>

              <div>
                <h4 className="text-sm font-medium text-textPrimary mb-2">
                  Similar Tickets
                </h4>
                <p className="text-sm text-textSecondary">
                  3 similar tickets found with average resolution time of 2.5
                  hours
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TicketDetailPage;
