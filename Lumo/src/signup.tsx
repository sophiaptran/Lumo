import { useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "@/assets/supabase-client";
import { RadialOrbitalTimelineDemo } from "./radial-orbital-timeline";
import { InteractiveNebulaShader } from "./components/ui/liquid-shader";

const GlassInputWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md shadow-lg transition-all duration-300 focus-within:border-violet-400/60 focus-within:bg-white/15 focus-within:shadow-xl focus-within:shadow-violet-500/20">
    {children}
  </div>
);

function SignUpPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const normalizedEmail = email.trim().toLowerCase();

    if (!emailRegex.test(normalizedEmail)) {
      setError('Please enter a valid email address');
      return;
    }

    if ((password ?? '').length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      // Check for existing email (case-insensitive exact match)
      const { count: existingCount, error: checkErr } = await supabase
        .from('userLogin')
        .select('*', { count: 'exact', head: true })
        .ilike('email', normalizedEmail);

      if (checkErr) {
        setError(checkErr.message);
        return;
      }

      if ((existingCount ?? 0) > 0) {
        setError('This email is already registered');
        return;
      }

      const { error: dbError } = await supabase
        .from('userLogin')
        .insert({ email: normalizedEmail, password, first_name: firstName, last_name: lastName });
      if (dbError) {
        setError(dbError.message);
      } else {
        navigate('/signup-success', { replace: true });
      }
    } catch (err: any) {
      setError(err?.message || 'Unexpected error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[100dvh] flex flex-row font-geist w-[100dvw] bg-black">
      <section className="w-1/2 flex items-center justify-center p-8 relative">
        <div className="absolute inset-0 z-0">
          <InteractiveNebulaShader />
        </div>
        <div className="w-full max-w-md relative z-10">
            <div className="flex flex-col gap-6 p-8 rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10 shadow-2xl">
            <h1 className="text-4xl md:text-5xl font-semibold leading-tight text-white">Create your account</h1>
            <p className="text-white/80">Welcome to Lumo</p>

            <form className="space-y-5" onSubmit={onSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <GlassInputWrapper>
                  <input
                    name="firstName"
                    type="text"
                    placeholder="First name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full bg-transparent text-sm p-4 rounded-2xl focus:outline-none text-white placeholder:text-white/60"
                    required
                  />
                </GlassInputWrapper>
                <GlassInputWrapper>
                  <input
                    name="lastName"
                    type="text"
                    placeholder="Last name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full bg-transparent text-sm p-4 rounded-2xl focus:outline-none text-white placeholder:text-white/60"
                    required
                  />
                </GlassInputWrapper>
              </div>

              <div>
                <label className="text-sm font-medium text-white/90">Email Address</label>
                <GlassInputWrapper>
                  <input name="email" type="email" placeholder="Enter your email address" value={email} onChange={(e)=>setEmail(e.target.value)} className="w-full bg-transparent text-sm p-4 rounded-2xl focus:outline-none text-white placeholder:text-white/60" />
                </GlassInputWrapper>
              </div>

              <div>
                <label className="text-sm font-medium text-white/90">Password</label>
                <GlassInputWrapper>
                  <input name="password" type="password" minLength={8} placeholder="Enter your password" value={password} onChange={(e)=>setPassword(e.target.value)} className="w-full bg-transparent text-sm p-4 rounded-2xl focus:outline-none text-white placeholder:text-white/60" />
                </GlassInputWrapper>
              </div>

              <div>
                <label className="text-sm font-medium text-white/90">Confirm Password</label>
                <GlassInputWrapper>
                  <input name="confirmPassword" type="password" minLength={8} placeholder="Re-enter your password" value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)} className="w-full bg-transparent text-sm p-4 rounded-2xl focus:outline-none text-white placeholder:text-white/60" />
                </GlassInputWrapper>
              </div>

              {error && <p className="text-red-400 text-sm">{error}</p>}

              <button type="submit" disabled={loading} className="w-full rounded-2xl bg-primary py-4 font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
                {loading ? 'Creating...' : 'Create Account'}
              </button>
            </form>
          </div>
        </div>
      </section>

      <section className="w-1/2">
        <RadialOrbitalTimelineDemo />
      </section>
    </div>
  );
}

export { SignUpPage };
export default SignUpPage;
