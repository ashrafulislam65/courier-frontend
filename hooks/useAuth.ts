'use client';

import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';
import { loginUser, logoutUser, registerUser } from '@/lib/api/auth';
import { LoginFormValues, RegisterFormValues } from '@/lib/validations/auth.schema';
import { toast } from 'sonner';

const roleRedirectMap: Record<string, string> = {
  ADMIN: '/admin',
  CUSTOMER: '/dashboard',
  COURIER: '/provider',
};

// Middleware যাতে role চেক করতে পারে, তার জন্য একটা lightweight cookie সেট করি
function setAuthCookie(role: string) {
  document.cookie = `courier-auth-role=${role}; path=/; max-age=${60 * 60 * 24 * 7}`;
}

function clearAuthCookie() {
  document.cookie = 'courier-auth-role=; path=/; max-age=0';
}

export function useAuth() {
  const router = useRouter();
  const { user, accessToken, refreshToken, isAuthenticated, login, logout } = useAuthStore();

  const handleLogin = async (values: LoginFormValues) => {
    try {
      const data = await loginUser(values);
      login(data.user, data.accessToken, data.refreshToken);
      setAuthCookie(data.user.role);
      toast.success('Login successful');
      router.push(roleRedirectMap[data.user.role] || '/');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Login failed');
      throw err;
    }
  };

  const handleRegister = async (values: RegisterFormValues) => {
    try {
      const data = await registerUser(values);
      login(data.user, data.accessToken, data.refreshToken);
      setAuthCookie(data.user.role);
      toast.success('Account created successfully');
      router.push(roleRedirectMap[data.user.role] || '/');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Registration failed');
      throw err;
    }
  };

  const handleLogout = async () => {
    try {
      if (refreshToken) await logoutUser(refreshToken);
    } catch {
      // ignore network errors on logout
    } finally {
      logout();
      clearAuthCookie();
      toast.success('Logged out');
      router.push('/login');
    }
  };

  return {
    user,
    accessToken,
    isAuthenticated,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
  };
}