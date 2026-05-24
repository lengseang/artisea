'use client';

import { useEffect, useState } from 'react';
import { Avatar } from '@/components/ui/avatar';
import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/components/providers/auth-provider';
import { Camera, MapPin, Link as LinkIcon, Loader2 } from 'lucide-react';
import { SocialLayout } from '@/components/layout/social-layout';
import { getMyProfile, updateMyProfile } from '@/lib/api/authors';

export default function ProfilePage() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [stats, setStats] = useState({
    followers: 0,
    following: 0,
    articles: 0,
  });
  const [formData, setFormData] = useState({
    display_name: user?.display_name ?? '',
    bio: 'Passionate writer exploring technology and culture.',
    location: 'San Francisco, CA',
    website: 'https://example.com',
  });

  useEffect(() => {
    getMyProfile()
      .then((profile) => {
        setFormData({
          display_name: profile.name,
          bio: profile.bio ?? '',
          location: profile.location ?? '',
          website: profile.social_links?.website ?? '',
        });
        setStats({
          followers: profile.follower_count,
          following: profile.following_count,
          articles: profile.article_count,
        });
      })
      .catch((error) => {
        setErrorMessage(error instanceof Error ? error.message : 'Unable to load profile.');
      });
  }, []);

  const updateField = (field: string, value: string) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const handleSave = async () => {
    setIsSaving(true);
    setErrorMessage(null);
    try {
      await updateMyProfile({
        display_name: formData.display_name,
        bio: formData.bio,
        location: formData.location,
        social_links: formData.website ? { website: formData.website } : undefined,
      });
      setIsEditing(false);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unable to save profile.');
    } finally {
      setIsSaving(false);
    }
  };

  const inputCls = 'w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-50';

  return (
    <SocialLayout>
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <PageHeader title="My Profile" description="Manage your personal information." action={
          <button onClick={() => isEditing ? handleSave() : setIsEditing(true)} disabled={isSaving}
            className="inline-flex items-center gap-2 rounded-xl bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 px-5 py-2.5 text-sm font-semibold hover:opacity-80 transition-opacity disabled:opacity-50">
            {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
            {isEditing ? (isSaving ? 'Saving…' : 'Save Changes') : 'Edit Profile'}
          </button>
        } />

        {errorMessage && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-950/20 dark:text-red-300">
            {errorMessage}
          </div>
        )}
        
        <div className="space-y-6">
          <Card className="border-zinc-200 dark:border-zinc-800 shadow-sm">
            <CardContent className="flex items-center gap-6 p-6">
              <div className="relative group">
                <Avatar src={user?.avatar_url} alt={user?.display_name ?? 'User'} size="xl" />
                {isEditing && <button className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity"><Camera className="h-6 w-6" /></button>}
              </div>
              <div>
                <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">{user?.display_name ?? 'Your Name'}</h2>
                <p className="text-sm text-zinc-500">@{user?.username ?? 'username'}</p>
                <div className="flex gap-4 mt-3 text-sm">
                  <span><strong className="text-zinc-900 dark:text-zinc-50">{stats.followers.toLocaleString()}</strong> <span className="text-zinc-500 font-medium">followers</span></span>
                  <span><strong className="text-zinc-900 dark:text-zinc-50">{stats.following.toLocaleString()}</strong> <span className="text-zinc-500 font-medium">following</span></span>
                  <span><strong className="text-zinc-900 dark:text-zinc-50">{stats.articles}</strong> <span className="text-zinc-500 font-medium">articles</span></span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-zinc-200 dark:border-zinc-800 shadow-sm">
            <CardContent className="p-6 space-y-5">
              <ProfileField label="Display Name" value={formData.display_name} isEditing={isEditing} onChange={(v) => updateField('display_name', v)} inputCls={inputCls} />
              <div>
                <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">Bio</label>
                {isEditing ? <textarea value={formData.bio} onChange={(e) => updateField('bio', e.target.value)} rows={3} className={`${inputCls} resize-none`} /> : <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">{formData.bio || '—'}</p>}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="flex items-center gap-1 text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5"><MapPin className="h-3.5 w-3.5 text-zinc-400" />Location</label>
                  {isEditing ? <input value={formData.location} onChange={(e) => updateField('location', e.target.value)} className={inputCls} /> : <p className="text-zinc-700 dark:text-zinc-300">{formData.location || '—'}</p>}
                </div>
                <div>
                  <label className="flex items-center gap-1 text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5"><LinkIcon className="h-3.5 w-3.5 text-zinc-400" />Website</label>
                  {isEditing ? <input value={formData.website} onChange={(e) => updateField('website', e.target.value)} className={inputCls} /> : <p className="text-blue-600 dark:text-blue-400 font-medium">{formData.website || '—'}</p>}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </SocialLayout>
  );
}

function ProfileField({ label, value, isEditing, onChange, inputCls }: { label: string; value: string; isEditing: boolean; onChange: (v: string) => void; inputCls: string }) {
  return (
    <div>
      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">{label}</label>
      {isEditing ? <input value={value} onChange={(e) => onChange(e.target.value)} className={inputCls} /> : <p className="text-zinc-900 dark:text-zinc-50">{value || '—'}</p>}
    </div>
  );
}
