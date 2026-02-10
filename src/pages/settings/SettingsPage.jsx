import React from 'react';
import Card from '../../components/common/Card';
import { Settings as SettingsIcon } from 'lucide-react';

const SettingsPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-textPrimary mb-2">Settings</h1>
        <p className="text-textSecondary">Manage your account and preferences</p>
      </div>

      <Card>
        <div className="text-center py-12">
          <SettingsIcon className="w-16 h-16 text-textSecondary mx-auto mb-4 opacity-50" />
          <h2 className="text-xl font-semibold text-textPrimary mb-2">Settings</h2>
          <p className="text-textSecondary">Settings page coming soon...</p>
        </div>
      </Card>
    </div>
  );
};

export default SettingsPage;