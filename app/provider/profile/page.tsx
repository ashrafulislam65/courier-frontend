import type { Metadata } from 'next';
import AvailabilityCard from '@/components/provider/AvailabilityCard';
import ProfileForm from '@/components/shared/ProfileForm';

export const metadata: Metadata = { title: 'Profile & Availability' };

export default function ProviderProfilePage() {
  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Profile & Availability</h1>
        <p className="text-sm text-gray-500">Manage your details and whether you accept new work.</p>
      </div>
      <AvailabilityCard />
      <ProfileForm />
    </div>
  );
}