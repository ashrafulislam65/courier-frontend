'use client';

import { useState } from 'react';
import Link from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import { registerSchema, RegisterFormValues } from '@/lib/validations/auth.schema';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';

export default function RegisterPage() {
  const { register: registerUser } = useAuth();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: 'CUSTOMER' },
  });

  const onSubmit = async (values: RegisterFormValues) => {
    setLoading(true);
    try {
      await registerUser(values);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Create an Account</CardTitle>
          <p className="text-sm text-gray-500">Join the Courier platform today</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" placeholder="John Doe" {...register('name')} />
              {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="you@example.com" {...register('email')} />
              {errors.email && (
                <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="phone">Phone (optional)</Label>
              <Input id="phone" placeholder="01700000000" {...register('phone')} />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="••••••••" {...register('password')} />
              {errors.password && (
                <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>
              )}
            </div>

            <div>
              <Label>I want to register as</Label>
              <Controller
                control={control}
                name="role"
                render={({ field }) => (
                                   <Select
                    onValueChange={(value) => value && field.onChange(value)}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CUSTOMER">Customer — I want to send parcels</SelectItem>
                      <SelectItem value="COURIER">Courier — I want to deliver parcels</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Account
            </Button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-blue-600 font-medium hover:underline">
              Login
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}