'use client';

import { useState } from 'react';
import Link from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { loginSchema, LoginFormValues } from '@/lib/validations/auth.schema';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DEMO_CREDENTIALS } from '@/lib/constants';
import { ShieldCheck, User, Truck, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (values: LoginFormValues) => {
    setLoading(true);
    try {
      await login(values);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (role: keyof typeof DEMO_CREDENTIALS) => {
    setDemoLoading(role);
    try {
      await login(DEMO_CREDENTIALS[role]);
    } finally {
      setDemoLoading(null);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Welcome Back 👋</CardTitle>
          <p className="text-sm text-gray-500">Login to your account</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="you@example.com" {...register('email')} />
              {errors.email && (
                <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="••••••••" {...register('password')} />
              {errors.password && (
                <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>
              )}
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              🔐 Login
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-400">OR</span>
            </div>
          </div>

          <div>
            <p className="text-center text-sm font-medium text-gray-600 mb-3">
              🚀 Quick Demo Login
            </p>
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                className="flex flex-col h-auto py-3 gap-1"
                onClick={() => handleDemoLogin('ADMIN')}
                disabled={!!demoLoading}
              >
                {demoLoading === 'ADMIN' ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <ShieldCheck className="h-5 w-5" />
                )}
                <span className="text-xs">Admin</span>
              </Button>
              <Button
                variant="outline"
                className="flex flex-col h-auto py-3 gap-1"
                onClick={() => handleDemoLogin('CUSTOMER')}
                disabled={!!demoLoading}
              >
                {demoLoading === 'CUSTOMER' ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <User className="h-5 w-5" />
                )}
                <span className="text-xs">Customer</span>
              </Button>
            </div>
            <Button
              variant="outline"
              className="flex flex-col h-auto py-3 gap-1 w-full mt-3"
              onClick={() => handleDemoLogin('COURIER')}
              disabled={!!demoLoading}
            >
              {demoLoading === 'COURIER' ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Truck className="h-5 w-5" />
              )}
              <span className="text-xs">Courier</span>
            </Button>
          </div>

          <p className="text-center text-sm text-gray-500">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-blue-600 font-medium hover:underline">
              Sign up
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}