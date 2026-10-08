'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Controller, useForm, type Control } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ArrowLeft, ArrowRight, Check, Loader2 } from 'lucide-react';
import { createShipment, getHubs } from '@/lib/api/shipments';
import {
  createShipmentSchema,
  type CreateShipmentFormValues,
} from '@/lib/validations/shipment.schema';
import { cn, formatCurrency, getErrorMessage } from '@/lib/utils';
import { Hub } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const STEPS: { title: string; fields: (keyof CreateShipmentFormValues)[] }[] = [
  { title: 'Route', fields: ['originHubId', 'destinationHubId'] },
  { title: 'Recipient', fields: ['recipientName', 'recipientPhone', 'recipientAddress'] },
  { title: 'Package & Review', fields: ['weightKg'] },
];

// Backend-এর pricing formula-র সাথে মিলিয়ে (শুধু estimate, আসল দাম backend ঠিক করে)
const BASE_FEE = 60;
const PER_KG_RATE = 15;

function HubSelectField({
  name,
  control,
  hubs,
  placeholder,
}: {
  name: 'originHubId' | 'destinationHubId';
  control: Control<CreateShipmentFormValues>;
  hubs: Hub[];
  placeholder: string;
}) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <Select value={field.value} onValueChange={field.onChange}>
          <SelectTrigger>
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {hubs.map((hub) => (
              <SelectItem key={hub.id} value={hub.id}>
                {hub.name} — {hub.address}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    />
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-sm text-red-500 mt-1">{message}</p>;
}

export default function NewShipmentPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [step, setStep] = useState(0);

  const { data: hubs = [], isLoading: hubsLoading } = useQuery({
    queryKey: ['hubs'],
    queryFn: getHubs,
  });

  const {
    register,
    control,
    handleSubmit,
    trigger,
    getValues,
    setError,
    watch,
    formState: { errors },
  } = useForm<CreateShipmentFormValues>({
    resolver: zodResolver(createShipmentSchema),
    defaultValues: {
      originHubId: '',
      destinationHubId: '',
      recipientName: '',
      recipientPhone: '',
      recipientAddress: '',
    },
  });

  const values = watch();
  const weight = Number(values.weightKg);
  const estimatedPrice = weight > 0 ? Math.round(BASE_FEE + weight * PER_KG_RATE) : null;
  const hubName = (id: string) => hubs.find((h) => h.id === id)?.name ?? '—';

  const mutation = useMutation({
    mutationFn: createShipment,
    onSuccess: (shipment) => {
      queryClient.invalidateQueries({ queryKey: ['shipments'] });
      toast.success(`Shipment ${shipment.trackingCode} created`);
      router.push(`/dashboard/shipments/${shipment.id}`);
    },
    onError: (error) => toast.error(getErrorMessage(error, 'Failed to create shipment')),
  });

  const handleNext = async () => {
    const valid = await trigger(STEPS[step].fields);
    if (!valid) return;

    if (step === 0 && getValues('originHubId') === getValues('destinationHubId')) {
      setError('destinationHubId', {
        message: 'Origin and destination hubs must be different',
      });
      return;
    }
    setStep((s) => s + 1);
  };

  const onSubmit = (data: CreateShipmentFormValues) => mutation.mutate(data);
  const isLastStep = step === STEPS.length - 1;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Create Shipment</h1>
        <p className="text-sm text-gray-500">Fill in the details in three quick steps.</p>
      </div>

      {/* Step indicator */}
      <ol className="flex items-center gap-2">
        {STEPS.map((s, i) => (
          <li key={s.title} className="flex items-center gap-2 flex-1">
            <span
              className={cn(
                'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-medium',
                i < step && 'bg-green-600 text-white',
                i === step && 'bg-blue-600 text-white',
                i > step && 'bg-gray-200 text-gray-500'
              )}
            >
              {i < step ? <Check className="h-4 w-4" /> : i + 1}
            </span>
            <span className="hidden sm:inline text-sm font-medium">{s.title}</span>
            {i < STEPS.length - 1 && <div className="h-px flex-1 bg-gray-200" />}
          </li>
        ))}
      </ol>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{STEPS[step].title}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {step === 0 &&
              (hubsLoading ? (
                <div className="space-y-3">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ) : (
                <>
                  <div>
                    <Label>Origin Hub</Label>
                    <HubSelectField
                      name="originHubId"
                      control={control}
                      hubs={hubs}
                      placeholder="Where will we pick up from?"
                    />
                    <FieldError message={errors.originHubId?.message} />
                  </div>
                  <div>
                    <Label>Destination Hub</Label>
                    <HubSelectField
                      name="destinationHubId"
                      control={control}
                      hubs={hubs}
                      placeholder="Where should it be delivered?"
                    />
                    <FieldError message={errors.destinationHubId?.message} />
                  </div>
                </>
              ))}

            {step === 1 && (
              <>
                <div>
                  <Label htmlFor="recipientName">Recipient Name</Label>
                  <Input id="recipientName" placeholder="Jane Roe" {...register('recipientName')} />
                  <FieldError message={errors.recipientName?.message} />
                </div>
                <div>
                  <Label htmlFor="recipientPhone">Recipient Phone</Label>
                  <Input
                    id="recipientPhone"
                    placeholder="01700000000"
                    {...register('recipientPhone')}
                  />
                  <FieldError message={errors.recipientPhone?.message} />
                </div>
                <div>
                  <Label htmlFor="recipientAddress">Delivery Address</Label>
                  <Input
                    id="recipientAddress"
                    placeholder="House 12, Road 5, Gulshan, Dhaka"
                    {...register('recipientAddress')}
                  />
                  <FieldError message={errors.recipientAddress?.message} />
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <div>
                  <Label htmlFor="weightKg">Parcel Weight (kg)</Label>
                  <Input
                    id="weightKg"
                    type="number"
                    step="0.1"
                    min="0"
                    placeholder="2.5"
                    {...register('weightKg', { valueAsNumber: true })}
                  />
                  <FieldError message={errors.weightKg?.message} />
                </div>

                <div className="rounded-lg bg-gray-50 p-4 text-sm space-y-2">
                  <p className="font-medium mb-2">Review</p>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Route</span>
                    <span>
                      {hubName(values.originHubId)} → {hubName(values.destinationHubId)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Recipient</span>
                    <span>{values.recipientName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Phone</span>
                    <span>{values.recipientPhone}</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-gray-500">Address</span>
                    <span className="text-right">{values.recipientAddress}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2 font-semibold">
                    <span>Estimated price</span>
                    <span>{estimatedPrice ? formatCurrency(estimatedPrice) : '—'}</span>
                  </div>
                </div>
              </>
            )}

            <div className="flex justify-between pt-2">
              <Button
                type="button"
                variant="outline"
                disabled={step === 0 || mutation.isPending}
                onClick={() => setStep((s) => s - 1)}
              >
                <ArrowLeft className="h-4 w-4 mr-1" /> Back
              </Button>

              {isLastStep ? (
                <Button key="submit" type="submit" disabled={mutation.isPending}>
                  {mutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Create Shipment
                </Button>
              ) : (
                <Button key="next" type="button" onClick={handleNext}>
                  Next <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}