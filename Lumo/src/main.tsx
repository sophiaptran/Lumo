import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { HeroScrollDemo } from "./scroller.tsx"
import { TestimonialsSectionDisplay } from "./reviews.tsx"
import { LoginButtonComp } from "./login-btn.tsx"
import { SignupButtonComp } from "./su-btn.tsx"
import { LastHero } from "./last-hero.tsx"
import { GridEffect } from "./grid.tsx"
import SignInPageDemo from "./sign-in.tsx"
import './index.css'

// Home component that contains the main content
function HomePage() {
  return (
    <>
      <div className="w-full flex items-center justify-end gap-2 p-4">
        <LoginButtonComp />
        <SignupButtonComp />
      </div>
      <HeroScrollDemo />
      <GridEffect />
      <TestimonialsSectionDisplay />
      <LastHero />
    </>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<SignInPageDemo />} />
      </Routes>
    </Router>
  </StrictMode>
)

