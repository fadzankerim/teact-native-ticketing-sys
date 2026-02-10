/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, Paperclip } from 'lucide-react';
import { toast } from 'react-hot-toast';
import useTicketStore from '../../Stores/ticketStore';
import useAuthStore from '../../Stores/authStore';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Dropdown from '../../components/common/Dropdown';
import { 
  TICKET_PRIORITY,
  TICKET_CATEGORIES,
  TICKET_PRIORITY_LABELS,
  TICKET_CATEGORY_LABELS 
} from '../../utils/constants';

const CreateTicketPage = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { createTicket } = useTicketStore();

  const [formData, setFormData] = useState({
    subject: '',
    description: '',
    category: 'TECHNICAL',
    priority: 'MEDIUM',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categoryOptions = Object.values(TICKET_CATEGORIES).map(cat => ({
    value: cat,
    label: TICKET_CATEGORY_LABELS[cat]
  }));

  const priorityOptions = Object.values(TICKET_PRIORITY).map(priority => ({
    value: priority,
    label: TICKET_PRIORITY_LABELS[priority]
  }));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleCategoryChange = (value) => {
    setFormData(prev => ({ ...prev, category: value }));
  };

  const handlePriorityChange = (value) => {
    setFormData(prev => ({ ...prev, priority: value }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    } else if (formData.subject.length < 5) {
      newErrors.subject = 'Subject must be at least 5 characters';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 20) {
      newErrors.description = 'Description must be at least 20 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const newTicket = await createTicket({
        ...formData,
        customerId: user?.id,
        customerName: user?.name,
        customerEmail: user?.email,
      });
      
      toast.success('Ticket created successfully!');
      navigate(`/tickets/${newTicket.id}`);
    } catch (error) {
      toast.error('Failed to create ticket');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate('/tickets')}
          className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-textSecondary" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-textPrimary tracking-tight">Create New Ticket</h1>
          <p className="text-textSecondary">Submit a support request</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit}>
            <Card>
              <div className="space-y-6">
                <Input
                  label="Subject"
                  name="subject"
                  type="text"
                  placeholder="Brief description of your issue"
                  value={formData.subject}
                  onChange={handleChange}
                  error={errors.subject}
                  required
                />

                <div>
                  <label className="block text-sm font-medium text-textPrimary mb-1">
                    Category <span className="text-error">*</span>
                  </label>
                  <Dropdown
                    options={categoryOptions}
                    value={formData.category}
                    onChange={handleCategoryChange}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-textPrimary mb-1">
                    Priority <span className="text-error">*</span>
                  </label>
                  <Dropdown
                    options={priorityOptions}
                    value={formData.priority}
                    onChange={handlePriorityChange}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-textPrimary mb-1">
                    Description <span className="text-error">*</span>
                  </label>
                  <textarea
                    name="description"
                    rows={8}
                    placeholder="Please provide detailed information about your issue..."
                    value={formData.description}
                    onChange={handleChange}
                    className={`
                      w-full px-4 py-2 border rounded-lg 
                      focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary/60 
                      transition-all duration-200 resize-none
                      ${errors.description ? 'border-error' : 'border-border'}
                    `}
                  />
                  {errors.description && (
                    <p className="mt-1 text-sm text-error">{errors.description}</p>
                  )}
                  <p className="mt-1 text-sm text-textSecondary">
                    {formData.description.length} characters (minimum 20)
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-textPrimary mb-2">
                    Attachments (Optional)
                  </label>
                  <div className="border-2 border-dashed border-border/70 rounded-xl p-8 text-center hover:border-primary/60 transition-colors cursor-pointer">
                    <Paperclip className="w-8 h-8 text-textSecondary mx-auto mb-2" />
                    <p className="text-sm text-textPrimary mb-1">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-textSecondary">
                      PNG, JPG, PDF up to 10MB
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-6 border-t border-border">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/tickets')}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    isLoading={isSubmitting}
                    leftIcon={<Send className="w-4 h-4" />}
                  >
                    Submit Ticket
                  </Button>
                </div>
              </div>
            </Card>
          </form>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Tips Card */}
          <Card title="Tips for faster resolution" className="bg-primary-50/60 border-primary-100">
            <ul className="space-y-3 text-sm text-textPrimary">
              <li className="flex items-start">
                <span className="w-5 h-5 bg-primary rounded-full flex items-center justify-center text-white text-xs mr-3 mt-0.5 shrink-0">
                  1
                </span>
                <span>Be specific and detailed in your description</span>
              </li>
              <li className="flex items-start">
                <span className="w-5 h-5 bg-primary rounded-full flex items-center justify-center text-white text-xs mr-3 mt-0.5 shrink-0">
                  2
                </span>
                <span>Include error messages or screenshots if applicable</span>
              </li>
              <li className="flex items-start">
                <span className="w-5 h-5 bg-primary rounded-full flex items-center justify-center text-white text-xs mr-3 mt-0.5 shrink-0">
                  3
                </span>
                <span>Choose the correct category for faster routing</span>
              </li>
              <li className="flex items-start">
                <span className="w-5 h-5 bg-primary rounded-full flex items-center justify-center text-white text-xs mr-3 mt-0.5 shrink-0">
                  4
                </span>
                <span>Set priority based on business impact</span>
              </li>
            </ul>
          </Card>

          {/* AI Assistance */}
          <Card title="AI Assistance" className="bg-linear-to-br from-secondary-50 to-primary-50 border-primary-100">
            <div className="space-y-3">
              <p className="text-sm text-textPrimary">
                Our AI will automatically:
              </p>
              <ul className="space-y-2 text-sm text-textSecondary">
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-success mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Suggest the best category
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-success mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Route to the right agent
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-success mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Find similar solutions
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-success mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Predict resolution time
                </li>
              </ul>
            </div>
          </Card>

          {/* Expected Response Time */}
          <Card>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-textPrimary mb-1">
                Expected Response Time
              </h3>
              <p className="text-2xl font-bold text-primary mb-2">2-4 hours</p>
              <p className="text-sm text-textSecondary">
                Based on current workload and your priority level
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CreateTicketPage;
