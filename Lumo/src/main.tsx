import { StrictMode } from 'react'
import { HeroScrollDemo } from "./scroller.tsx"
import { TestimonialsSectionDisplay } from "./reviews.tsx"
import { LoginButtonComp } from "./login-btn.tsx"
import { SignupButtonComp } from "./su-btn.tsx"


import { createRoot } from 'react-dom/client'
import { LastHero } from "./last-hero.tsx"
import { GridEffect } from "./grid.tsx"
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <div className="w-full flex items-center justify-end gap-2 p-4">
      <LoginButtonComp />
      <SignupButtonComp />
    </div>
    <HeroScrollDemo />
    <GridEffect />
    <TestimonialsSectionDisplay />
    <LastHero />
  </StrictMode>
)

