import React, { useState } from 'react';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import useAuthStore from '../../Stores/authStore';
import useUIStore from '../../Stores/uiStore';
import { toast } from 'react-hot-toast';
import { Settings as SettingsIcon, Bell, Palette, Shield } from 'lucide-react';
import { useShallow } from 'zustand/react/shallow';

const SettingsPage = () => {
  const { user, updateUser } = useAuthStore(
    useShallow((state) => ({ user: state.user, updateUser: state.updateUser })),
  );
  const { theme, toggleTheme } = useUIStore(
    useShallow((state) => ({ theme: state.theme, toggleTheme: state.toggleTheme })),
  );
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    role: user?.role || 'AGENT',
  });
  const [prefs, setPrefs] = useState({
    emailNotifications: true,
    inAppNotifications: true,
    weeklySummary: false,
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePrefChange = (event) => {
    const { name, checked } = event.target;
    setPrefs((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSaveProfile = (event) => {
    event.preventDefault();
    updateUser({ name: formData.name, email: formData.email });
    toast.success('Profile updated');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-textPrimary mb-2 tracking-tight">Settings</h1>
        <p className="text-textSecondary">Manage your account and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card title="Profile">
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <Input
                label="Full name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your name"
              />
              <Input
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
              />
              <div className="flex items-center gap-3 pt-2">
                <Button type="submit" variant="primary">Save changes</Button>
                <Button type="button" variant="ghost">Cancel</Button>
              </div>
            </form>
          </Card>

          <Card title="Notifications" subtitle="Control how you stay informed">
            <div className="space-y-3">
              {[
                { id: 'emailNotifications', label: 'Email notifications' },
                { id: 'inAppNotifications', label: 'In-app notifications' },
                { id: 'weeklySummary', label: 'Weekly summary report' },
              ].map((item) => (
                <label key={item.id} className="flex items-center justify-between p-3 rounded-xl border border-border/60 bg-slate-50">
                  <div>
                    <p className="text-sm font-medium text-textPrimary">{item.label}</p>
                    <p className="text-xs text-textSecondary">Recommended for faster response</p>
                  </div>
                  <input
                    type="checkbox"
                    name={item.id}
                    checked={prefs[item.id]}
                    onChange={handlePrefChange}
                    className="h-4 w-4 text-primary border-border rounded focus:ring-primary-500"
                  />
                </label>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center text-primary">
                  <SettingsIcon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-textPrimary">Workspace</p>
                  <p className="text-xs text-textSecondary">TicketHub • Default</p>
                </div>
              </div>
              <div className="border-t border-border/60 pt-4 space-y-3 text-sm text-textSecondary">
                <div className="flex items-center justify-between">
                  <span>Role</span>
                  <span className="text-textPrimary font-medium">{formData.role}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Status</span>
                  <span className="text-emerald-600 font-medium">Active</span>
                </div>
              </div>
            </div>
          </Card>

          <Card title="Appearance">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-textPrimary">Theme</p>
                <p className="text-xs text-textSecondary">Currently {theme}</p>
              </div>
              <Button type="button" variant="outline" onClick={toggleTheme}>
                Toggle
              </Button>
            </div>
          </Card>

          <Card title="Security">
            <div className="space-y-3">
              <Button type="button" variant="outline" fullWidth leftIcon={<Shield className="w-4 h-4" />}>
                Change password
              </Button>
              <Button type="button" variant="ghost" fullWidth leftIcon={<Bell className="w-4 h-4" />}>
                Alert preferences
              </Button>
              <Button type="button" variant="ghost" fullWidth leftIcon={<Palette className="w-4 h-4" />}>
                Brand settings
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
