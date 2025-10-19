import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { RadialOrbitalTimelineDemo } from '../../radial-orbital-timeline';
import { InteractiveNebulaShader } from './liquid-shader';


// --- TYPE DEFINITIONS ---

export interface Testimonial {
  avatarSrc: string;
  name: string;
  handle: string;
  text: string;
}

interface SignInPageProps {
  title?: React.ReactNode;
  description?: React.ReactNode;
  heroImageSrc?: string;
  testimonials?: Testimonial[];
  onSignIn?: (event: React.FormEvent<HTMLFormElement>) => void;
  onGoogleSignIn?: () => void;
  onResetPassword?: () => void;
  onCreateAccount?: () => void;
  emailError?: string;
  passwordError?: string;
  formError?: string;
}

// --- SUB-COMPONENTS ---

const GlassInputWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md shadow-lg transition-all duration-300 focus-within:border-violet-400/60 focus-within:bg-white/15 focus-within:shadow-xl focus-within:shadow-violet-500/20">
    {children}
  </div>
);

const TestimonialCard = ({ testimonial, delay }: { testimonial: Testimonial, delay: string }) => (
  <div className={`animate-testimonial ${delay} flex items-start gap-3 rounded-3xl bg-card/40 dark:bg-zinc-800/40 backdrop-blur-xl border border-white/10 p-5 w-64`}>
    <img src={testimonial.avatarSrc} className="h-10 w-10 object-cover rounded-2xl" alt="avatar" />
    <div className="text-sm leading-snug">
      <p className="flex items-center gap-1 font-medium">{testimonial.name}</p>
      <p className="text-muted-foreground">{testimonial.handle}</p>
      <p className="mt-1 text-foreground/80">{testimonial.text}</p>
    </div>
  </div>
);

// --- MAIN COMPONENT ---

export const SignInPage: React.FC<SignInPageProps> = ({
  title = <span className="font-bold text-white tracking-tighter">Welcome</span>,
  description = "Access your account and continue your journey with us",
  heroImageSrc,
  testimonials = [],
  onSignIn,
  onGoogleSignIn,
  onResetPassword,
  onCreateAccount,
  emailError,
  passwordError,
  formError,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="h-[100dvh] flex flex-row font-geist w-[100dvw] bg-black">
      {/* Left column: sign-in form - 50% */}
      <section className="w-1/2 flex items-center justify-center p-8 relative">
        {/* Liquid shader background for sign-in section */}
        <div className="absolute inset-0 z-0">
          <InteractiveNebulaShader />
        </div>
        <div className="w-full max-w-md relative z-10">
          <div className="flex flex-col gap-6 p-8 rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10 shadow-2xl">
            <h1 className="animate-element animate-delay-100 text-4xl md:text-5xl font-semibold leading-tight">{title}</h1>
            <p className="animate-element animate-delay-200 text-white/80">{description}</p>

            <form className="space-y-5" onSubmit={onSignIn}>
              <div className="animate-element animate-delay-300">
                <label className="text-sm font-medium text-white/90">Email Address</label>
                <GlassInputWrapper>
                  <input name="email" type="email" placeholder="Enter your email address" className="w-full bg-transparent text-sm p-4 rounded-2xl focus:outline-none text-white placeholder:text-white/60" />
                </GlassInputWrapper>
                {emailError ? (
                  <p className="mt-2 text-sm text-red-400">{emailError}</p>
                ) : null}
              </div>

              <div className="animate-element animate-delay-400">
                <label className="text-sm font-medium text-white/90">Password</label>
                <GlassInputWrapper>
                  <div className="relative">
                    <input name="password" type={showPassword ? 'text' : 'password'} placeholder="Enter your password" className="w-full bg-transparent text-sm p-4 pr-12 rounded-2xl focus:outline-none text-white placeholder:text-white/60" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-3 flex items-center">
                      {showPassword ? <EyeOff className="w-5 h-5 text-white/70 hover:text-white transition-colors" /> : <Eye className="w-5 h-5 text-white/70 hover:text-white transition-colors" />}
                    </button>
                  </div>
                </GlassInputWrapper>
                {passwordError ? (
                  <p className="mt-2 text-sm text-red-400">{passwordError}</p>
                ) : null}
              </div>

              <div className="animate-element animate-delay-500 flex items-center justify-between text-sm">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" name="rememberMe" className="custom-checkbox" />
                  <span className="text-gray-500">Keep me signed in</span>
                </label>
                <a href="#" onClick={(e) => { e.preventDefault(); onResetPassword?.(); }} className="hover:underline text-violet-400 transition-colors">Reset password</a>
              </div>

              <button type="submit" className="animate-element animate-delay-600 w-full rounded-2xl bg-primary py-4 font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
                Sign In
              </button>
              {formError ? (
                <p className="mt-3 text-sm text-center text-red-400">{formError}</p>
              ) : null}
            </form>

            <div className="animate-element animate-delay-700 relative flex items-center justify-center">
              <span className="w-full border-t border-border"></span>
            </div>

            <p className="animate-element animate-delay-900 text-center text-sm text-muted-foreground">
              New to our platform? <a href="#" onClick={(e) => { e.preventDefault(); onCreateAccount?.(); }} className="text-violet-400 hover:underline transition-colors">Create Account</a>
            </p>
          </div>
        </div>
      </section>

      {/* Right column: Radial Orbital Timeline Demo - 50% */}
      <section className="w-1/2">
        <RadialOrbitalTimelineDemo />
      </section>
    </div>
  );
};  