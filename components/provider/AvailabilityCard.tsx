'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getMe } from '@/lib/api/auth';
import { setAvailability } from '@/lib/api/courier';
import { getErrorMessage } from '@/lib/utils';
import { User } from '@/types';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AvailabilityCard() {
  const queryClient = useQueryClient();
  const { data: me, isLoading } = useQuery({ queryKey: ['me'], queryFn: getMe });

  const mutation = useMutation({
    mutationFn: setAvailability,
    // UI সাথে সাথে বদলে যায়, error হলে আগের অবস্থায় ফিরে যায়
    onMutate: async (next: boolean) => {
      await queryClient.cancelQueries({ queryKey: ['me'] });
      const previous = queryClient.getQueryData<User>(['me']);
      if (previous?.courierProfile) {
        queryClient.setQueryData<User>(['me'], {
          ...previous,
          courierProfile: { ...previous.courierProfile, isAvailable: next },
        });
      }
      return { previous };
    },
    onError: (error, _next, context) => {
      if (context?.previous) queryClient.setQueryData(['me'], context.previous);
      toast.error(getErrorMessage(error, 'Could not update availability'));
    },
    onSuccess: (_data, next) =>
      toast.success(next ? 'You are now available for pickups' : 'You are now unavailable'),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['me'] }),
  });

  if (isLoading) return <Skeleton className="h-40 w-full" />;

  const profile = me?.courierProfile;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Availability</CardTitle>
      </CardHeader>
      <CardContent>
        {!profile ? (
          <p className="text-sm text-gray-500">
            Your courier profile has not been set up yet. Please contact an admin.
          </p>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <Label htmlFor="availability" className="text-base">
                  Available for new assignments
                </Label>
                <p className="text-sm text-gray-500">
                  Admins can only assign shipments to couriers who are available.
                </p>
              </div>
              <Switch
                id="availability"
                checked={profile.isAvailable}
                onCheckedChange={(checked) => mutation.mutate(checked)}
              />
            </div>
            <div className="flex justify-between border-t pt-3 text-sm">
              <span className="text-gray-500">Vehicle</span>
              <span className="font-medium capitalize">{profile.vehicleType.toLowerCase()}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}