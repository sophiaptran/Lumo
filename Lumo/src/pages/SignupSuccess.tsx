import React from "react";

function SignupSuccess() {
  return (
    <div className="min-h-screen w-full bg-black text-white flex items-center justify-center px-4">
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-semibold">Signup successful</h1>
        <p className="text-white/70">Your account has been created.</p>
        <div className="flex gap-3 justify-center">
          <a href="/login" className="rounded-full bg-white text-black font-medium px-6 py-2 hover:bg-white/90 transition-colors">Go to login</a>
          <a href="/home" className="rounded-full bg-white/10 text-white font-medium px-6 py-2 border border-white/20 hover:bg-white/15 transition-colors">Back to home</a>
        </div>
      </div>
    </div>
  );
}

export { SignupSuccess };
export default SignupSuccess;


