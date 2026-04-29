'use client';

import React, { useEffect, useState } from 'react';
import { signIn, getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FcGoogle } from 'react-icons/fc';
import { FiEye, FiEyeOff, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { postJson } from '@/lib/api';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type AuthApiResponse = {
  message: string;
  nextResend?: string;
};

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [view, setView] = useState<
    'login' | 'signup' | 'verify' | 'forgot' | 'reset'
  >('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [resendLockTime, setResendLockTime] = useState<Date | null>(null);
  const [countdownStr, setCountdownStr] = useState('');

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    if (resendLockTime) {
      interval = setInterval(() => {
        const now = new Date().getTime();
        const diff = resendLockTime.getTime() - now;

        if (diff <= 0) {
          setCountdownStr('');
          setResendLockTime(null);
          clearInterval(interval);
        } else {
          const minutes = Math.floor(diff / 60000);
          const seconds = Math.floor((diff % 60000) / 1000);

          if (minutes >= 60) {
            setCountdownStr('Try again tomorrow');
          } else {
            setCountdownStr(
              `${minutes}:${seconds.toString().padStart(2, '0')}`
            );
          }
        }
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [resendLockTime]);

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) return;

    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      if (event.data === 'auth-success') {
        toast.success('Successfully logged in with Google!');
        onClose();
        window.location.reload();
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const getPasswordStrength = (pass: string) => {
    let score = 0;
    if (!pass) return 0;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;
    return score;
  };

  const passToMeasure = view === 'reset' ? newPassword : password;
  const passwordScore = getPasswordStrength(passToMeasure);
  const isWeak = passToMeasure.length > 0 && passwordScore < 2;

  const labelClass =
    'mb-2 block pl-1 text-[14px] font-medium text-slate-700 sm:text-[15px]';
  const fieldClass =
    'h-11 w-full rounded-2xl border border-slate-200 bg-secondary px-4 text-[15px] text-slate-800 shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:opacity-60 sm:h-12';
  const passwordFieldClass = `${fieldClass} pr-12`;
  const primaryButtonClass =
    'flex h-11 w-full cursor-pointer items-center justify-center rounded-2xl bg-indigo-600 px-5 text-[15px] font-medium text-white shadow-[0_14px_30px_rgba(79,70,229,0.2)] transition hover:bg-indigo-700 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none sm:h-12 sm:text-base';
  const secondaryButtonClass =
    'flex h-11 w-full cursor-pointer items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 text-[15px] font-medium text-slate-700 shadow-[0_10px_24px_rgba(15,23,42,0.05)] transition hover:border-indigo-200 hover:bg-indigo-50/40 disabled:cursor-not-allowed disabled:opacity-50 sm:h-12 sm:text-base';
  const inlineLinkClass =
    'cursor-pointer text-sm font-medium text-indigo-600 transition hover:text-indigo-700 hover:underline';
  const mutedLinkClass =
    'cursor-pointer text-sm font-medium text-slate-500 transition hover:text-slate-900';

  const getMeterColor = (index: number) => {
    if (passwordScore <= index) return 'bg-gray-200';
    if (passwordScore === 1) return 'bg-red-500';
    if (passwordScore === 2) return 'bg-orange-500';
    if (passwordScore === 3) return 'bg-yellow-400';
    return 'bg-emerald-500';
  };

  const getStrengthLabel = () => {
    if (passwordScore === 0) return '';
    if (passwordScore === 1) return 'Weak';
    if (passwordScore === 2) return 'Fair';
    if (passwordScore === 3) return 'Good';
    return 'Strong';
  };

  const handleGoogleAuth = () => {
    const width = 550;
    const height = 700;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;

    window.open(
      '/auth/popup-signin',
      'FreshResumeLogin',
      `width=${width},height=${height},left=${left},top=${top}`
    );
  };

  // Removed from here to place above the early return

  const handleForgotPassword = async (
    event?: React.FormEvent | React.MouseEvent
  ) => {
    event?.preventDefault();

    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    try {
      setIsLoading(true);
      const result = await postJson<AuthApiResponse>(
        '/api/auth/forgot-password',
        { email }
      );
      const data = result.data;

      if (!result.ok) {
        if (result.status === 429 && data.nextResend) {
          setResendLockTime(new Date(data.nextResend));
          toast.error(data.message);
          setView('reset');
        } else {
          toast.error(data.message || 'Error initiating password reset');
        }
      } else {
        toast.success(data.message);
        if (data.nextResend) setResendLockTime(new Date(data.nextResend));
        if (view !== 'reset') setView('reset');
      }
    } catch {
      toast.error('Failed to request reset. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (event: React.FormEvent) => {
    event.preventDefault();

    if (otp.length !== 6) {
      toast.error('Enter the pure 6-digit code');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (isWeak) {
      toast.error('Password is too weak. Please improve it.');
      return;
    }

    try {
      setIsLoading(true);
      const result = await postJson<AuthApiResponse>(
        '/api/auth/reset-password',
        {
          email,
          otp,
          newPassword,
        }
      );
      const data = result.data;

      if (!result.ok) {
        toast.error(data.message || 'Reset failed');
      } else {
        toast.success('Password successfully reset! You can now log in.');
        setView('login');
        setPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setOtp('');
      }
    } catch {
      toast.error('Failed to finalize reset. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async (event: React.FormEvent) => {
    event.preventDefault();

    if (otp.length !== 6) {
      toast.error('OTP must be exactly 6 digits');
      return;
    }

    try {
      setIsLoading(true);
      const result = await postJson<AuthApiResponse>('/api/auth/verify', {
        email,
        otp,
      });
      const data = result.data;

      if (!result.ok) {
        toast.error(data.message || 'Verification failed');
        return;
      }

      toast.success('Email verified successfully!');

      const signInRes = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (signInRes?.error) {
        toast.error(signInRes.error || 'Login failed after verification');
      } else {
        onClose();
        const session = await getSession();
        if (session?.user?.isProfileCompleted) {
          router.push('/dashboard');
        } else {
          router.push('/resume/builder');
        }
      }
    } catch {
      toast.error('An error occurred during verification');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (resendLockTime) return;

    try {
      setIsLoading(true);
      const result = await postJson<AuthApiResponse>('/api/auth/resend-otp', {
        email,
      });
      const data = result.data;

      if (!result.ok) {
        if (result.status === 429 && data.nextResend) {
          setResendLockTime(new Date(data.nextResend));
          toast.error(data.message);
        } else {
          toast.error(data.message || 'Resend failed');
        }
      } else {
        toast.success('A fresh OTP has been dispatched to your email!');
        if (data.nextResend) setResendLockTime(new Date(data.nextResend));
      }
    } catch {
      toast.error('Failed to request new code');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCredentialsAuth = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!email || !password || (view === 'signup' && !name)) {
      toast.error('Please fill in all fields');
      return;
    }

    if (view === 'signup' && isWeak) {
      toast.error('Password is too weak. Please improve it.');
      return;
    }

    try {
      setIsLoading(true);

      if (view === 'signup') {
        const result = await postJson<AuthApiResponse>('/api/auth/register', {
          name,
          email,
          password,
        });

        const data = result.data;

        if (!result.ok) {
          if (result.status === 429 && data.nextResend) {
            setResendLockTime(new Date(data.nextResend));
            toast.error('You are registering too quickly. Check email.');
            setView('verify');
            setIsLoading(false);
            return;
          }

          toast.error(data.message || 'Failed to create account');
          setIsLoading(false);
          return;
        }

        if (data.nextResend) setResendLockTime(new Date(data.nextResend));
        toast.success(data.message || 'Account created successfully!');
        setView('verify');
        setIsLoading(false);
        return;
      }

      const res = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        if (res.error.startsWith('unverified_email')) {
          const parts = res.error.split('_');
          if (parts.length === 3) {
            setResendLockTime(new Date(parts[2]));
          }
          toast.success(
            "Verification required! We've sent a new OTP to your email."
          );
          setView('verify');
        } else {
          toast.error(res.error || 'Invalid credentials');
        }
      } else {
        toast.success('Successfully logged in!');
        onClose();
        const session = await getSession();
        if (session?.user?.isProfileCompleted) {
          router.push('/dashboard');
        } else {
          router.push('/resume/builder');
        }
      }
    } catch {
      toast.error('An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const renderStrengthMeter = (
    weakLabel: string,
    okLabel: string,
    className = 'mt-2'
  ) => {
    if (passToMeasure.length === 0) return null;

    return (
      <div className={`w-full ${className}`}>
        <div className="flex h-1.5 w-full gap-1 overflow-hidden rounded-full bg-gray-100">
          {[0, 1, 2, 3].map((index) => (
            <div
              key={index}
              className={`h-full flex-1 transition-colors duration-300 ${getMeterColor(index)}`}
            />
          ))}
        </div>
        <div className="mt-1.5 flex items-center justify-between px-1 text-xs">
          <span
            className={isWeak ? 'font-medium text-red-500' : 'text-gray-500'}
          >
            {isWeak ? weakLabel : okLabel}
          </span>
          <span
            className={`font-medium ${
              passwordScore >= 3
                ? 'text-emerald-500'
                : passwordScore === 2
                  ? 'text-orange-500'
                  : 'text-red-500'
            }`}
          >
            {getStrengthLabel()}
          </span>
        </div>
      </div>
    );
  };

  const renderPasswordToggle = (
    visible: boolean,
    onToggle: () => void,
    label: string
  ) => (
    <button
      type="button"
      onClick={onToggle}
      aria-label={label}
      className="absolute right-3 top-1/2 flex size-9 cursor-pointer -translate-y-1/2 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 focus:outline-none"
    >
      {visible ? <FiEyeOff size={18} /> : <FiEye size={18} />}
    </button>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-3 sm:p-4 md:items-center md:p-6">
      <div
        className="absolute inset-0 bg-slate-950/45 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
        className="relative my-auto flex w-full max-w-[900px] flex-col overflow-hidden rounded-[24px] border border-slate-200/60 bg-white shadow-[0_32px_96px_rgba(15,23,42,0.22)] max-md:max-h-none md:max-h-[calc(100dvh-4rem)] lg:flex-row lg:max-h-[660px] lg:min-h-[600px]"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close authentication modal"
          className="absolute right-3 top-3 z-50 flex size-10 cursor-pointer items-center justify-center rounded-full border border-white/70 bg-white/70 text-slate-500 shadow-sm backdrop-blur transition hover:text-slate-900 sm:right-4 sm:top-4 sm:size-11 md:right-5 md:top-5"
        >
          <FiX className="h-5 w-5" />
        </button>

        <div className="relative flex min-h-0 w-full flex-col justify-center overflow-y-auto px-6 py-6 sm:px-7 sm:py-7 lg:w-[54%] lg:px-9 lg:py-8">
          <h2
            id="auth-modal-title"
            className="mb-2 pr-10 text-[1.8rem] font-semibold tracking-tight text-text sm:text-[2.05rem] lg:text-[2rem] xl:text-[2.3rem]"
          >
            {view === 'verify'
              ? 'Verification Required'
              : view === 'forgot'
                ? 'Reset Password'
                : view === 'reset'
                  ? 'Create New Password'
                  : view === 'login'
                    ? 'Welcome Back'
                    : 'Create Account'}
          </h2>

          <p className="mb-5 max-w-md text-[0.94rem] leading-6 text-slate-500 sm:mb-6 sm:text-[0.98rem] sm:leading-7">
            {view === 'verify'
              ? 'Check your email for the 6-digit OTP code'
              : view === 'forgot'
                ? 'Enter your email to receive a secure reset code'
                : view === 'reset'
                  ? 'Enter your newly received OTP to authorize reset'
                  : view === 'login'
                    ? 'Sign in to your account to continue'
                    : 'Sign up to build your perfect resume'}
          </p>

          {(view === 'login' || view === 'signup') && (
            <>
              <button
                type="button"
                onClick={handleGoogleAuth}
                disabled={isLoading}
                className={secondaryButtonClass}
              >
                <FcGoogle className="text-xl" />
                Continue with Google
              </button>

              <div className="my-4 flex items-center sm:my-5">
                <div className="flex-1 border-t border-slate-200"></div>
                <span className="px-4 text-sm font-normal tracking-[0.18em] text-slate-400">
                  OR
                </span>
                <div className="flex-1 border-t border-slate-200"></div>
              </div>
            </>
          )}

          {view === 'verify' && (
            <div className="space-y-4">
              <form onSubmit={handleVerify} className="flex flex-col gap-4">
                <div>
                  <label htmlFor="verify-otp" className={labelClass}>
                    6-Digit Code
                  </label>
                  <input
                    id="verify-otp"
                    type="text"
                    value={otp}
                    onChange={(event) =>
                      setOtp(event.target.value.replace(/[^0-9]/g, ''))
                    }
                    className={`${fieldClass} text-center text-2xl font-semibold tracking-[0.8rem] sm:text-3xl`}
                    placeholder="------"
                    maxLength={6}
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading || otp.length < 6}
                  className={`${primaryButtonClass} mt-2`}
                >
                  {isLoading ? 'Verifying...' : 'Verify Email & Sign In'}
                </button>
              </form>

              <div className="mt-3 text-center">
                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={isLoading || !!resendLockTime}
                  className={`${inlineLinkClass} disabled:cursor-not-allowed disabled:text-slate-400 disabled:no-underline`}
                >
                  {countdownStr
                    ? `Resend code in ${countdownStr}`
                    : "Didn't receive code? Resend"}
                </button>
              </div>
            </div>
          )}

          {view === 'forgot' && (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div>
                <label htmlFor="forgot-email" className={labelClass}>
                  Account Email
                </label>
                <input
                  id="forgot-email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className={fieldClass}
                  placeholder="you@example.com"
                  disabled={isLoading}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`${primaryButtonClass} mt-2`}
              >
                {isLoading ? 'Sending...' : 'Send Reset Code'}
              </button>
            </form>
          )}

          {view === 'reset' && (
            <>
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div>
                  <label htmlFor="reset-otp" className={labelClass}>
                    Reset Code from Email
                  </label>
                  <input
                    id="reset-otp"
                    type="text"
                    value={otp}
                    onChange={(event) =>
                      setOtp(event.target.value.replace(/[^0-9]/g, ''))
                    }
                    className={`${fieldClass} mb-3 text-center text-xl font-semibold tracking-[0.45rem]`}
                    placeholder="------"
                    maxLength={6}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="new-password" className={labelClass}>
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      id="new-password"
                      type={showNewPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(event) => setNewPassword(event.target.value)}
                      className={passwordFieldClass}
                      placeholder="Create a new password"
                      disabled={isLoading}
                      required
                    />
                    {renderPasswordToggle(
                      showNewPassword,
                      () => setShowNewPassword((value) => !value),
                      showNewPassword
                        ? 'Hide new password'
                        : 'Show new password'
                    )}
                  </div>
                </div>

                {renderStrengthMeter(
                  'Too Weak (add numbers and symbols)',
                  'Good',
                  'mt-1.5 mb-3'
                )}

                <div>
                  <label
                    htmlFor="confirm-password"
                    className={`${labelClass} mt-2`}
                  >
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      id="confirm-password"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(event) =>
                        setConfirmPassword(event.target.value)
                      }
                      className={passwordFieldClass}
                      placeholder="Confirm your new password"
                      disabled={isLoading}
                      required
                    />
                    {renderPasswordToggle(
                      showConfirmPassword,
                      () => setShowConfirmPassword((value) => !value),
                      showConfirmPassword
                        ? 'Hide confirm password'
                        : 'Show confirm password'
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading || isWeak}
                  className={`${primaryButtonClass} mt-2`}
                >
                  {isLoading ? 'Updating...' : 'Update Password'}
                </button>
              </form>

              <div className="mt-3 text-center">
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  disabled={isLoading || !!resendLockTime}
                  className={`${inlineLinkClass} disabled:cursor-not-allowed disabled:text-slate-400 disabled:no-underline`}
                >
                  {countdownStr
                    ? `Resend code in ${countdownStr}`
                    : "Didn't receive code? Resend"}
                </button>
              </div>
            </>
          )}

          {(view === 'login' || view === 'signup') && (
            <form
              onSubmit={handleCredentialsAuth}
              className="space-y-3.5 sm:space-y-4"
            >
              {view === 'signup' && (
                <div>
                  <label htmlFor="signup-name" className={labelClass}>
                    Full Name
                  </label>
                  <input
                    id="signup-name"
                    type="text"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    className={fieldClass}
                    placeholder="John Doe"
                    disabled={isLoading}
                  />
                </div>
              )}

              <div>
                <label htmlFor="auth-email" className={labelClass}>
                  Email
                </label>
                <input
                  id="auth-email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className={fieldClass}
                  placeholder="you@example.com"
                  disabled={isLoading}
                />
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label
                    htmlFor="auth-password"
                    className="block pl-1 text-[15px] font-medium text-slate-700"
                  >
                    Password
                  </label>
                  {view === 'login' && (
                    <button
                      type="button"
                      onClick={() => {
                        setView('forgot');
                        setPassword('');
                        setOtp('');
                      }}
                      className={inlineLinkClass}
                    >
                      Forgot Password?
                    </button>
                  )}
                </div>

                <div className="relative">
                  <input
                    id="auth-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className={passwordFieldClass}
                    placeholder="Enter your password"
                    disabled={isLoading}
                  />
                  {renderPasswordToggle(
                    showPassword,
                    () => setShowPassword((value) => !value),
                    showPassword ? 'Hide password' : 'Show password'
                  )}
                </div>

                {view === 'signup' &&
                  renderStrengthMeter(
                    'Strength Required: Weak',
                    'Score Passed'
                  )}
              </div>

              <button
                type="submit"
                disabled={isLoading || (view === 'signup' && isWeak)}
                className={`${primaryButtonClass} mt-2`}
              >
                {isLoading
                  ? view === 'login'
                    ? 'Logging in...'
                    : 'Signing up...'
                  : view === 'login'
                    ? 'Log In'
                    : 'Sign Up'}
              </button>
            </form>
          )}

          <div className="mt-4 text-center text-[14px] text-slate-500 sm:mt-5 sm:text-[15px]">
            {view === 'verify' ? (
              <button
                type="button"
                onClick={() => {
                  setView('signup');
                  setOtp('');
                  setResendLockTime(null);
                }}
                className={inlineLinkClass}
              >
                Back to Sign Up
              </button>
            ) : view === 'forgot' || view === 'reset' ? (
              <button
                type="button"
                onClick={() => {
                  setView('login');
                  setOtp('');
                }}
                className={mutedLinkClass}
              >
                &larr; Return to Login
              </button>
            ) : view === 'login' ? (
              <>
                Don&apos;t have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setView('signup');
                    setPassword('');
                  }}
                  className={inlineLinkClass}
                >
                  Create account
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setView('login');
                    setPassword('');
                  }}
                  className={inlineLinkClass}
                >
                  Log in
                </button>
              </>
            )}
          </div>
        </div>

        <div className="relative hidden min-h-0 w-[46%] overflow-hidden lg:flex" style={{ background: 'linear-gradient(150deg, #1e1b4b 0%, #312e81 40%, #4c1d95 100%)' }}>
          {/* Subtle dot grid */}
          <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
          {/* Glow orbs */}
          <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-violet-500/20 blur-3xl" />
          <div className="absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-indigo-400/20 blur-3xl" />

          <div className="relative z-10 flex h-full min-h-0 flex-col justify-between px-8 py-8">
            {/* Brand mark */}
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 backdrop-blur-sm">
              <span className="h-2 w-2 rounded-full bg-indigo-300" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/80">FreshResume</span>
            </div>

            {/* Main copy */}
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-indigo-300">
                AI Resume Builder
              </p>
              <h3 className="mt-2.5 text-[1.75rem] font-bold leading-tight tracking-tight text-white">
                Land interviews<br />faster than ever.
              </h3>
              <p className="mt-3 text-[13.5px] leading-6 text-white/60">
                Join professionals who build standout resumes in minutes with AI-guided writing and ATS-ready templates.
              </p>

              <div className="mt-5 space-y-3">
                {[
                  'Tailored phrasing for every job application',
                  'ATS-friendly layouts recruiters love',
                  'One-click export in PDF & DOCX',
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2.5">
                    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-400/30">
                      <svg className="h-2.5 w-2.5 text-indigo-200" fill="none" viewBox="0 0 12 12" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2 6l3 3 5-5" />
                      </svg>
                    </div>
                    <p className="text-[13px] text-white/70">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Social proof */}
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm">
              <p className="text-[12px] font-medium text-white/50 uppercase tracking-widest mb-1">Trusted by</p>
              <p className="text-[15px] font-semibold text-white">10,000+ job seekers</p>
              <div className="mt-2 flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="h-3.5 w-3.5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                <span className="ml-1.5 text-[12px] text-white/50">4.9 / 5</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
