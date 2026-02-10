import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import Button from '../components/common/Button';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-primary mb-4">404</h1>
          <h2 className="text-3xl font-bold text-textPrimary mb-2">Page Not Found</h2>
          <p className="text-lg text-textSecondary max-w-md mx-auto">
            Oops! The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/dashboard">
            <Button variant="primary" leftIcon={<Home className="w-5 h-5" />}>
              Go to Dashboard
            </Button>
          </Link>
          <button onClick={() => window.history.back()}>
            <Button variant="outline" leftIcon={<ArrowLeft className="w-5 h-5" />}>
              Go Back
            </Button>
          </button>
        </div>

        <div className="mt-12">
          <svg
            className="w-64 h-64 mx-auto opacity-50"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"
              fill="currentColor"
              className="text-textSecondary"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;