// src/pages/LoginPage.tsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, useLocation, redirect } from 'react-router-dom';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ErrorBanner } from '@/components/common/ErrorBanner';
import { useLoginMutation } from '@/store/api/authApi';
import { useAppDispatch } from '@/hooks/redux';
import { login } from '@/store/slices/authSlice';
import { UserLogin, UserPassword, TelgramRedirect } from '@/components/icons';

const loginSchema = z.object({
  email: z.string().min(3, 'Please enter a valid username'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loginMutation, { isLoading, error }] = useLoginMutation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || '/dashboard';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const result = await loginMutation(data).unwrap();
      console.log("res",result)
      dispatch(login({ user: result.type, token: result.accessToken }));
      navigate('/mfa');
    } catch (err) {
      console.log(err)
    }
  };

  return (
    <div className="space-y-6 h-full bg-white my-auto px-[38px] py-[44px] rounded-[12px] shadow-[0px_0px_10px_-2px_rgba(0,0,0,0.1)]">
      <div className="space-y-2 text-center h-full items-center">
        <div className="mx-auto">
          <span className="text-3xl font-bold text-blue-500">CASS-INNO</span>
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">Welcome to GAP Platform!</h1>
        <p className="text-sm">Login to your account</p>
      </div>

      {error && (
        <ErrorBanner
          type="error"
          title="Login Failed"
          message={(error as any)?.data?.message || 'Invalid username or password'}
        />
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Username */}
        <div className="space-y-2">
          <Label htmlFor="username">Username*</Label>
          <div className="flex border border-foreground rounded-[7px] h-12 items-center px-2">
            <img src={UserLogin} alt="" className="w-6 h-6" />
            <Input
              id="email"
              type="text"
              placeholder="Username"
              {...register('email')}
              className={`bg-transparent border-0 focus:ring-0 focus:bg-transparent focus:outline-none pr-10 ${errors.email ? 'border-destructive' : ''}`}
            />
          </div>
          {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
        </div>

        {/* Password */}
        <div className="space-y-2">
          <Label htmlFor="password">Password*</Label>
          <div className="relative">
            <div className="flex border border-foreground rounded-[7px] h-12 items-center px-2">
              <img src={UserPassword} alt="" className="w-6 h-6" />
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                {...register('password')}
                className={`bg-transparent border-0 focus:ring-0 focus:bg-transparent focus:outline-none pr-10 ${errors.password ? 'border-destructive' : ''}`}
              />
            </div>
            <Button
              type="button"
              variant="normal"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 py-2 bg-transparent"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="hover:text-black h-4 w-4" />
              )}
            </Button>
          </div>
          {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
        </div>

        {/* Submit */}
        <Button
          type="submit"
          className="w-full rounded-[50px] bg-primary text-white py-[18px] h-12"
          disabled={isLoading}
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Sign In
        </Button>
      </form>

      <hr />
      <div className="text-center text-sm">
        <Button type="button" className="w-full rounded-[50px] bg-white py-[18px] h-12 border">
          <div className="flex text-primary gap-3">
            <img src={TelgramRedirect} alt="" /> <span>Join our Telegram</span>
          </div>
        </Button>
      </div>
    </div>
  );
};

export default LoginPage;
