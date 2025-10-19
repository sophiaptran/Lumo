import { useRef, useState } from "react";
import bcrypt from 'bcryptjs'
import { useNavigate } from "react-router-dom";
import supabase from "@/assets/supabase-client";
import { createCustomer, createAccount } from "@/lib/nessie";
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
  const [nessieCustomerId, setNessieCustomerId] = useState("");
  const [streetNumber, setStreetNumber] = useState("")
  const [streetName, setStreetName] = useState("")
  const [city, setCity] = useState("")
  const [stateRegion, setStateRegion] = useState("")
  const [zip, setZip] = useState("")
  const [genLoading, setGenLoading] = useState(false)
  const [genError, setGenError] = useState<string | null>(null)
  const nessieIdInputRef = useRef<HTMLInputElement>(null)
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
    // Basic address validation for Nessie
    if (!streetNumber || !streetName || !city || !stateRegion || !zip) {
      setError('Address fields are required for Nessie customer creation');
      return;
    }
    if (!/^\d{1,10}$/.test(streetNumber)) {
      setError('Street number must be numeric');
      return;
    }
    if (!/^[A-Za-z]{2}$/.test(stateRegion)) {
      setError('State must be a 2-letter code (e.g., IL)');
      return;
    }
    if (!/^\d{5}$/.test(zip)) {
      setError('ZIP must be 5 digits');
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

      // Auto-create Nessie customer if none provided
      let nessieIdToSave = nessieCustomerId.trim()
      if (!nessieIdToSave) {
        try {
          const created = await createCustomer({
            first_name: firstName,
            last_name: lastName,
            address: {
              street_number: streetNumber,
              street_name: streetName,
              city: city,
              state: stateRegion.toUpperCase(),
              zip: zip,
            },
          })
          nessieIdToSave = created._id
        } catch (e) {
          // Non-fatal; allow signup without Nessie mapping
          console.error('Failed creating Nessie customer', e)
        }
      }

      // Note: Auto account creation disabled per request.

      const salt = bcrypt.genSaltSync(10)
      const passwordHash = bcrypt.hashSync(password, salt)

      const { error: dbError } = await supabase
        .from('userLogin')
        .insert({ email: normalizedEmail, password: passwordHash, first_name: firstName, last_name: lastName, nessie_customer_id: nessieIdToSave || null });
      if (dbError) {
        setError(dbError.message);
      } else {
        try {
          if (nessieIdToSave) {
            localStorage.setItem('nessieCustomerId', nessieIdToSave)
          } else {
            localStorage.removeItem('nessieCustomerId')
          }
          localStorage.setItem('userEmail', normalizedEmail)
        } catch {}
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
      {/* Go Back button */}
      <button 
        onClick={() => navigate('/')}
        className="absolute top-6 left-6 z-20 text-white/80 hover:text-white transition-colors text-sm font-medium"
      >
        ← Go Back
      </button>
      <section className="w-1/2 flex items-center justify-center p-8 relative">
        <div className="absolute inset-0 z-0">
          <InteractiveNebulaShader />
        </div>
        <div className="w-full max-w-xl relative z-10 ml-16">
            <div className="flex flex-col gap-4 p-6 rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10 shadow-2xl">
            <h1 className="text-4xl md:text-5xl font-semibold leading-tight text-white">Create your account</h1>
            <p className="text-white/80">Welcome to Lumo</p>

            <form className="space-y-4" onSubmit={onSubmit}>
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


              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <GlassInputWrapper>
                  <input
                    name="street_number"
                    type="text"
                    placeholder="Street number"
                    value={streetNumber}
                    onChange={(e)=>setStreetNumber(e.target.value)}
                    className="w-full bg-transparent text-sm p-4 rounded-2xl focus:outline-none text-white placeholder:text-white/60"
                    required
                  />
                </GlassInputWrapper>
                <GlassInputWrapper>
                  <input
                    name="street_name"
                    type="text"
                    placeholder="Street name"
                    value={streetName}
                    onChange={(e)=>setStreetName(e.target.value)}
                    className="w-full bg-transparent text-sm p-4 rounded-2xl focus:outline-none text-white placeholder:text-white/60"
                    required
                  />
                </GlassInputWrapper>
                <GlassInputWrapper>
                  <input
                    name="city"
                    type="text"
                    placeholder="City"
                    value={city}
                    onChange={(e)=>setCity(e.target.value)}
                    className="w-full bg-transparent text-sm p-4 rounded-2xl focus:outline-none text-white placeholder:text-white/60"
                    required
                  />
                </GlassInputWrapper>
                <GlassInputWrapper>
                  <input
                    name="state"
                    type="text"
                    placeholder="State (e.g., IL)"
                    value={stateRegion}
                    onChange={(e)=>setStateRegion(e.target.value)}
                    className="w-full bg-transparent text-sm p-4 rounded-2xl focus:outline-none text-white placeholder:text-white/60"
                    required
                  />
                </GlassInputWrapper>
                <GlassInputWrapper>
                  <input
                    name="zip"
                    type="text"
                    placeholder="ZIP"
                    value={zip}
                    onChange={(e)=>setZip(e.target.value)}
                    className="w-full bg-transparent text-sm p-4 rounded-2xl focus:outline-none text-white placeholder:text-white/60"
                    required
                  />
                </GlassInputWrapper>
                
              </div>
              <div>
                <label className="text-sm font-medium text-white/90">Nessie Customer ID (optional)</label>
                <div className="flex items-center gap-2">
                  <GlassInputWrapper>
                    <input ref={nessieIdInputRef} name="nessie_customer_id" type="text" placeholder="e.g. 55e94a6cf8d8770527e0a7c2" value={nessieCustomerId} onChange={(e)=>setNessieCustomerId(e.target.value)} className="w-full bg-transparent text-sm p-4 rounded-2xl focus:outline-none text-white placeholder:text-white/60" />
                  </GlassInputWrapper>
                  <button
                    type="button"
                    onClick={async () => {
                      setGenError(null)
                      if (!firstName || !lastName || !streetNumber || !streetName || !city || !stateRegion || !zip) {
                        setGenError('Fill name and address to generate ID')
                        return
                      }
                      if (!/^\d{1,10}$/.test(streetNumber)) {
                        setGenError('Street number must be numeric')
                        return
                      }
                      if (!/^[A-Za-z]{2}$/.test(stateRegion)) {
                        setGenError('State must be a 2-letter code')
                        return
                      }
                      if (!/^\d{5}$/.test(zip)) {
                        setGenError('ZIP must be 5 digits')
                        return
                      }
                      setGenLoading(true)
                      try {
                        const created = await createCustomer({
                          first_name: firstName,
                          last_name: lastName,
                          address: {
                            street_number: streetNumber,
                            street_name: streetName,
                            city,
                            state: stateRegion.toUpperCase(),
                            zip,
                          },
                        })
                        setNessieCustomerId(created._id)
                        if (nessieIdInputRef.current) {
                          nessieIdInputRef.current.value = created._id
                        }
                      } catch (e: any) {
                        setGenError(e?.message || 'Failed to generate Nessie ID')
                      } finally {
                        setGenLoading(false)
                      }
                    }}
                    className="rounded-2xl bg-white text-black px-4 py-3 text-sm font-medium hover:bg-white/90 disabled:opacity-60 disabled:cursor-not-allowed"
                    disabled={genLoading}
                  >
                    {genLoading ? 'Generating...' : 'Generate'}
                  </button>
                </div>
                {genError && <p className="text-red-400 text-sm mt-2">{genError}</p>}
              </div>

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
