import React from "react";
import { Link } from "react-router-dom";

function LoginSuccess() {
  return (
    <div className="min-h-screen w-full bg-black text-white flex items-center justify-center px-4">
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-semibold">Login successful</h1>
        <p className="text-white/70">Welcome back.</p>
        <div className="flex gap-3 justify-center">
          <Link to="/home" className="rounded-full bg-white text-black font-medium px-6 py-2 hover:bg-white/90 transition-colors">Go to home</Link>
          <Link to="/dashboard" className="rounded-full bg-white/10 text-white font-medium px-6 py-2 border border-white/20 hover:bg-white/15 transition-colors">Go to dashboard</Link>
        </div>
      </div>
    </div>
  );
}

export { LoginSuccess };
export default LoginSuccess;


