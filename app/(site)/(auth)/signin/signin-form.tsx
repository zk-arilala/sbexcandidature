'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { InputGroup, InputGroupInput } from '@/components/ui/input-group';
import { Label } from '@/components/ui/label';
import { EyeCloseIcon, EyeIcon } from '@/icons/icons';
import { authValidation } from '@/lib/zod/auth.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { toast } from 'sonner';

type Inputs = z.infer<typeof authValidation.login>;

export default function SignInForm() {
  const form = useForm<Inputs>({
    resolver: zodResolver(authValidation.login),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const [rememberMe, setRememberMe] = useState(false);
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleShowPassword = () => {
    setIsShowPassword(!isShowPassword);
  };

  async function onSubmit(data: Inputs) {
    setIsLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate API call

    toast.success(
      <pre>
        <code>{JSON.stringify(data, null, 2)}</code>
      </pre>
    );

    setIsLoading(false);
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <div className="grid gap-5">
        <Controller
          control={form.control}
          name="email"
          render={({ field, fieldState }) => (
            <div className="col-span-full">
              <label className="mb-1 block text-sm font-medium">
                Email address
              </label>

              <InputGroup>
                <InputGroupInput
                  type="email"
                  placeholder="Your email address"
                  disabled={isLoading}
                  aria-invalid={!!fieldState.error}
                  {...field}
                />
              </InputGroup>

              {fieldState.error && (
                <p className="mt-1 text-sm text-destructive">
                  {fieldState.error.message}
                </p>
              )}
            </div>
          )}
        />

        <div>
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              type={isShowPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              id="password"
              disabled={isLoading}
              {...form.register('password')}
            />

            <button
              type="button"
              title={isShowPassword ? 'Hide password' : 'Show password'}
              aria-label={isShowPassword ? 'Hide password' : 'Show password'}
              onClick={handleShowPassword}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-600"
            >
              {isShowPassword ? <EyeIcon /> : <EyeCloseIcon />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between flex-wrap gap-3">
          <Checkbox
            id="remember_me"
            checked={rememberMe}
            onCheckedChange={(checked) => setRememberMe(!!checked)}
            name="remember_me"
          />
          <label
            htmlFor="remember_me"
            className="text-sm cursor-pointer"
          >
            Keep me logged in
          </label>

          <Link href="/reset-password" className="text-primary-500 text-sm">
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="bg-primary-500 hover:bg-primary-600 transition py-3 px-6 w-full font-medium text-white text-sm rounded-full"
        >
          {isLoading ? 'Signing in...' : 'Sign In'}
        </button>
      </div>
    </form>
  );
}
