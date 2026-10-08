import type { Metadata } from 'next';
import ProfileForm from '@/components/shared/ProfileForm';

export const metadata: Metadata = { title: 'Profile & Settings' };

export default function CustomerProfilePage() {
  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Profile & Settings</h1>
        <p className="text-sm text-gray-500">Manage your personal information.</p>
      </div>
      <ProfileForm />
    </div>
  );
}