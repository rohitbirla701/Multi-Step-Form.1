import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ErrorBanner } from '@/components/common/ErrorBanner';
// import { useVerifyMFAMutation } from '@/store/api/authApi';
import { useAppDispatch } from '@/hooks/redux';

const mfaSchema = z.object({
  mfaCode: z.string().min(6, 'Please enter a valid 6-digit code').max(6, 'Code must be 6 digits'),
});

type MFAFormData = z.infer<typeof mfaSchema>;

const MFA = () => {
  //   const [verifyMFAMutation, { isLoading, error }] = useVerifyMFAMutation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || '/dashboard';
  const username = (location.state as any)?.username || 'shiv247';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MFAFormData>({
    resolver: zodResolver(mfaSchema),
  });

  const onSubmit = async (data: MFAFormData) => {
    try {
      navigate('/dashboard');
      //   const result = await verifyMFAMutation(data).unwrap();
      // Handle successful MFA verification
      // navigate(from, { replace: true });
    } catch (err) {
      // Error is handled by RTK Query
    }
  };

  return (
    <div className="space-y-6 h-full bg-white my-auto px-[38px] py-[44px] rounded-[12px] shadow-[0px_0px_10px_-2px_rgba(0,0,0,0.1)] max-w-[412px]">
      <div className="space-y-8 h-full items-center">
        <div className="mx-auto text-center">
          {/* <img className="mx-auto" src="/images/logo.png" alt="" /> */}
          <span className="text-4xl font-bold text-primary">CASS-INNO</span>
        </div>
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
          Two-Factor Authentication
        </h1>
        <p className="text-xl font-medium mb-1">Username: {username}</p>
        <p className="text-sm text-[#1E293B]">
          Please enter the six digit code from your authenticator app.
        </p>
      </div>
      {/* 
      {error && <ErrorBanner type="error" title="Verification Failed" message={error} />} */}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="mfaCode" className="text-sm font-medium">
            MFA Code*
          </Label>
          <div className="flex border border-[#D5D5D5] rounded-[7px] h-12 items-center px-3">
            <Input
              id="mfaCode"
              type="text"
              maxLength={6}
              {...register('mfaCode')}
              className={`bg-transparent border-0 focus:ring-0 focus:outline-none focus-visible:ring-0 focus-visible:outline-none focus-visible:ring-offset-0 text-center text-lg tracking-wider ${errors.mfaCode ? 'border-destructive' : ''}`}
            />
          </div>
          {errors.mfaCode && <p className="text-sm text-destructive">{errors.mfaCode.message}</p>}
        </div>

        <Button
          type="submit"
          className="w-full rounded-[50px] bg-[#2196F3] hover:bg-[#1976D2] py-[18px] px-[126px] h-12 text-white"
          //   disabled={isLoading}
        >
          {/* {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} */}
          Verify
        </Button>
      </form>
    </div>
  );
};

export default MFA;