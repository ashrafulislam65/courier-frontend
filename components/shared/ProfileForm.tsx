'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { getMe, updateMe } from '@/lib/api/auth';
import { useAuthStore } from '@/store/auth-store';
import {
  updateProfileSchema,
  type UpdateProfileFormValues,
} from '@/lib/validations/profile.schema';
import { getErrorMessage } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ProfileForm() {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((state) => state.setUser);

  const {
    data: profile,
    isLoading,
    isError,
  } = useQuery({ queryKey: ['me'], queryFn: getMe });

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<UpdateProfileFormValues>({
    resolver: zodResolver(updateProfileSchema),
    values: profile ? { name: profile.name, phone: profile.phone ?? '' } : undefined,
  });

  const mutation = useMutation({
    mutationFn: updateMe,
    onSuccess: (updated) => {
      setUser(updated);
      queryClient.invalidateQueries({ queryKey: ['me'] });
      toast.success('Profile updated');
    },
    onError: (error) => toast.error(getErrorMessage(error, 'Failed to update profile')),
  });

  if (isLoading) return <Skeleton className="h-72 w-full" />;

  if (isError || !profile) {
    return <p className="text-sm text-red-500">Failed to load your profile.</p>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Personal Information</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit((values) => mutation.mutate(values))} className="space-y-4">
          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" {...register('name')} />
            {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" value={profile.email} disabled readOnly />
          </div>

          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" placeholder="01700000000" {...register('phone')} />
            {errors.phone && <p className="text-sm text-red-500 mt-1">{errors.phone.message}</p>}
          </div>

          <div>
            <Label>Role</Label>
            <p className="text-sm font-medium capitalize">{profile.role.toLowerCase()}</p>
          </div>

          <Button type="submit" disabled={!isDirty || mutation.isPending}>
            {mutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Save Changes
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}