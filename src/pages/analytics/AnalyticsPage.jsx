import React from 'react';
import Card from '../../components/common/Card';
import { BarChart3 } from 'lucide-react';

const AnalyticsPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-textPrimary mb-2">Analytics</h1>
        <p className="text-textSecondary">Track performance and insights</p>
      </div>

      <Card>
        <div className="text-center py-12">
          <BarChart3 className="w-16 h-16 text-textSecondary mx-auto mb-4 opacity-50" />
          <h2 className="text-xl font-semibold text-textPrimary mb-2">Analytics Dashboard</h2>
          <p className="text-textSecondary">Advanced analytics coming soon...</p>
        </div>
      </Card>
    </div>
  );
};

export default AnalyticsPage;