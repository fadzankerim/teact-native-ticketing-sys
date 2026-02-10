import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, ArrowRight, Building } from 'lucide-react';
import { toast } from 'react-hot-toast';
import useAuthStore from '../../Stores/authStore';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Dropdown from '../../components/common/Dropdown';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register, isLoading } = useAuthStore();
  
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    company: '',
    role: 'CUSTOMER',
  });

  const [errors, setErrors] = useState({});

  const roleOptions = [
    { value: 'CUSTOMER', label: 'Customer' },
    { value: 'AGENT', label: 'Support Agent' },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleRoleChange = (value) => {
    setFormData(prev => ({ ...prev, role: value }));
  };

  const validateStep1 = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep1()) {
      setStep(2);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await register(formData);
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Progress indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className={`text-sm font-medium ${step >= 1 ? 'text-primary' : 'text-textSecondary'}`}>
                Account Info
              </span>
              <span className={`text-sm font-medium ${step >= 2 ? 'text-primary' : 'text-textSecondary'}`}>
                Profile Setup
              </span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${(step / 2) * 100}%` }}
              />
            </div>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-textPrimary mb-2">Create Account</h2>
            <p className="text-textSecondary">
              {step === 1 ? 'Enter your details to get started' : 'Complete your profile'}
            </p>
          </div>

          <form onSubmit={step === 2 ? handleSubmit : (e) => e.preventDefault()} className="space-y-6">
            {step === 1 && (
              <>
                <Input
                  label="Full Name"
                  name="name"
                  type="text"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  error={errors.name}
                  required
                  leftIcon={<User className="w-5 h-5 text-textSecondary" />}
                />

                <Input
                  label="Email Address"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  error={errors.email}
                  required
                  leftIcon={<Mail className="w-5 h-5 text-textSecondary" />}
                />

                <Input
                  label="Password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  error={errors.password}
                  helperText="At least 6 characters"
                  required
                  leftIcon={<Lock className="w-5 h-5 text-textSecondary" />}
                />

                <Input
                  label="Confirm Password"
                  name="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  error={errors.confirmPassword}
                  required
                  leftIcon={<Lock className="w-5 h-5 text-textSecondary" />}
                />

                <Button
                  type="button"
                  variant="primary"
                  size="lg"
                  fullWidth
                  onClick={handleNextStep}
                  rightIcon={<ArrowRight className="w-5 h-5" />}
                >
                  Next
                </Button>
              </>
            )}

            {step === 2 && (
              <>
                <Input
                  label="Company Name (Optional)"
                  name="company"
                  type="text"
                  placeholder="Acme Inc."
                  value={formData.company}
                  onChange={handleChange}
                  leftIcon={<Building className="w-5 h-5 text-textSecondary" />}
                />

                <Dropdown
                  label="I am a"
                  options={roleOptions}
                  value={formData.role}
                  onChange={handleRoleChange}
                />

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    fullWidth
                    onClick={() => setStep(1)}
                  >
                    Back
                  </Button>

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    fullWidth
                    isLoading={isLoading}
                    rightIcon={<ArrowRight className="w-5 h-5" />}
                  >
                    Create Account
                  </Button>
                </div>
              </>
            )}

            <div className="text-center">
              <p className="text-sm text-textSecondary">
                Already have an account?{' '}
                <Link 
                  to="/login" 
                  className="text-primary hover:text-primary-600 font-medium"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* Right side - Decorative */}
      <div className="hidden lg:flex lg:w-2/5 bg-linear-to-br from-secondary to-primary relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-20 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>
        
        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
          <h2 className="text-4xl font-bold mb-6">Join TicketHub Today</h2>
          <ul className="space-y-4">
            <li className="flex items-start space-x-3">
              <svg className="w-6 h-6 shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <div>
                <h3 className="font-semibold mb-1">Smart Ticket Management</h3>
                <p className="text-white/80">Organize and track all your support tickets in one place</p>
              </div>
            </li>
            <li className="flex items-start space-x-3">
              <svg className="w-6 h-6 shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <div>
                <h3 className="font-semibold mb-1">AI-Powered Insights</h3>
                <p className="text-white/80">Get intelligent recommendations and predictions</p>
              </div>
            </li>
            <li className="flex items-start space-x-3">
              <svg className="w-6 h-6 shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <div>
                <h3 className="font-semibold mb-1">Real-time Collaboration</h3>
                <p className="text-white/80">Work together with your team seamlessly</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;