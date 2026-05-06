'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTheme } from '@/components/providers/theme-provider';
import { Sun, Moon, Monitor, Bell, Shield, AlertTriangle, Loader2 } from 'lucide-react';

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [isSaving, setIsSaving] = useState(false);
  const [notifications, setNotifications] = useState({ email: true, push: true, comments: true, follows: true, likes: false });

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    setIsSaving(false);
  };

  const inputCls = 'w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-50';

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <PageHeader title="Settings" description="Customize your account and preferences." action={
          <button onClick={handleSave} disabled={isSaving}
            className="inline-flex items-center gap-2 rounded-xl bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 px-5 py-2.5 text-sm font-semibold hover:opacity-80 transition-opacity disabled:opacity-50">
            {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
            {isSaving ? 'Saving…' : 'Save Changes'}
          </button>
        } />

        <div className="space-y-6">
          {/* Account */}
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Shield className="h-5 w-5" />Account</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">Email</label>
                <input defaultValue="user@example.com" className={inputCls} />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">New Password</label>
                <input type="password" placeholder="Leave blank to keep current" className={inputCls} />
              </div>
            </CardContent>
          </Card>

          {/* Theme */}
          <Card>
            <CardHeader><CardTitle>Appearance</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-3">
                {([['light', Sun, 'Light'], ['dark', Moon, 'Dark'], ['system', Monitor, 'System']] as const).map(([val, Icon, label]) => (
                  <button key={val} onClick={() => setTheme(val)}
                    className={`flex flex-col items-center gap-2 rounded-xl border p-4 transition-colors ${theme === val ? 'border-zinc-900 dark:border-zinc-50 bg-zinc-50 dark:bg-zinc-800' : 'border-zinc-200 dark:border-zinc-700 hover:border-zinc-300'}`}>
                    <Icon className="h-5 w-5" /><span className="text-sm font-medium">{label}</span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Bell className="h-5 w-5" />Notifications</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {Object.entries(notifications).map(([key, enabled]) => (
                <label key={key} className="flex items-center justify-between py-2">
                  <span className="text-sm capitalize text-zinc-700 dark:text-zinc-300">{key.replace('_', ' ')} notifications</span>
                  <button onClick={() => setNotifications(p => ({ ...p, [key]: !p[key as keyof typeof p] }))}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${enabled ? 'bg-zinc-900 dark:bg-zinc-50' : 'bg-zinc-200 dark:bg-zinc-700'}`}>
                    <span className={`inline-block h-4 w-4 rounded-full bg-white dark:bg-zinc-900 transform transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </label>
              ))}
            </CardContent>
          </Card>

          {/* Danger */}
          <Card className="border-red-200 dark:border-red-900/50">
            <CardHeader><CardTitle className="flex items-center gap-2 text-red-600"><AlertTriangle className="h-5 w-5" />Danger Zone</CardTitle></CardHeader>
            <CardContent>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">Once you deactivate your account, there is no going back.</p>
              <button className="rounded-xl border border-red-300 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-2 text-sm font-medium hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors">
                Deactivate Account
              </button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
