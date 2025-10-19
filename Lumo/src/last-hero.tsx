"use client";
import React, { useState } from "react";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { Input } from "@/components/ui/input";

function LastHero() {
  const [email, setEmail] = useState("");
  return (
    <div className="h-[60rem] w-full rounded-md bg-black text-white relative flex flex-col items-center justify-center antialiased">
      <div className="max-w-2xl mx-auto p-4">
        <h1 className="relative z-10 text-lg md:text-4xl text-white text-center font-sans font-bold whitespace-nowrap">
          Join the Newsletter
        </h1>
        <p></p>
        <p className="text-white/70 max-w-lg mx-auto my-2 text-sm text-center relative z-10">
          Get future updates on Lumo—the fintech app that makes learning to bank fun! Subscribe for feature drops, streak challenges, and quick wins for your wallet.
        </p>
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mt-4 relative z-10"
        />
      </div>
      <BackgroundBeams />
    </div>
  );
}

export { LastHero };