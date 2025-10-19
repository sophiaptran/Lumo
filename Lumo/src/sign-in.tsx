import { SignInPage } from "@/components/ui/sign-in";
import supabase from "@/assets/supabase-client";
import bcrypt from 'bcryptjs'
import { useNavigate } from "react-router-dom";
import React from "react";
import { useSession } from "./session";

const SignInPageDemo = () => {
  const navigate = useNavigate();
  const { setSession } = useSession();
  const [emailError, setEmailError] = React.useState<string | undefined>();
  const [passwordError, setPasswordError] = React.useState<string | undefined>();
  const [formError, setFormError] = React.useState<string | undefined>();
  const handleSignIn = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = (formData.get('email') as string || '').trim().toLowerCase();
    const password = (formData.get('password') as string || '');

    setEmailError(undefined);
    setPasswordError(undefined);
    setFormError(undefined);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address');
      return;
    }
    if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters long');
      return;
    }

    const { data, error } = await supabase
      .from('userLogin')
      .select('id, nessie_customer_id, password')
      .eq('email', email)
      .limit(1)
      .single();

    if (error || !data) {
      setFormError('Invalid email or password');
      return;
    }

    const isValid = bcrypt.compareSync(password, (data as any).password || '')
    if (!isValid) {
      setFormError('Invalid email or password');
      return;
    }

    try {
      localStorage.setItem('userEmail', email);
    } catch {}
    try {
      const cid = (data as any)?.nessie_customer_id as string | undefined
      if (cid) {
        localStorage.setItem('nessieCustomerId', cid)
      } else {
        localStorage.removeItem('nessieCustomerId')
      }
    } catch {}
    setSession({ email });
    navigate('/login-success', { replace: true });
  };

  const handleGoogleSignIn = () => {
    console.log("Continue with Google clicked");
    alert("Continue with Google clicked");
  };
  
  const handleResetPassword = () => {
    alert("Reset Password clicked");
  }

  const handleCreateAccount = () => {
    navigate('/signup');
  }

  return (
    <div className="bg-background text-foreground relative">
      {/* Go Back button */}
      <button 
        onClick={() => navigate('/')}
        className="absolute top-6 left-6 z-20 text-white/80 hover:text-white transition-colors text-sm font-medium"
      >
        ← Go Back
      </button>
      <SignInPage
        heroImageSrc="https://images.unsplash.com/photo-1642615835477-d303d7dc9ee9?w=2160&q=80"
        onSignIn={handleSignIn}
        emailError={emailError}
        passwordError={passwordError}
        formError={formError}
        onResetPassword={handleResetPassword}
        onCreateAccount={handleCreateAccount}
      />
    </div>
  );
};

export default SignInPageDemo;