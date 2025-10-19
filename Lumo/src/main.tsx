import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
// import { HeroScrollDemo } from "./scroller.tsx"
// import { TestimonialsSectionDisplay } from "./reviews.tsx"
// import { LoginButtonComp } from "./login-btn.tsx"
// import { SignupButtonComp } from "./su-btn.tsx"
// import { LastHero } from "./last-hero.tsx"
// import { GridEffect } from "./grid.tsx"
import SignUpPage from "./signup.tsx"
import SignInPageDemo from "./sign-in.tsx"
import HomeLoggedIn from './pages/HomeLoggedIn.tsx'
import LogoutConfirm from './pages/LogoutConfirm.tsx'
import Home from './pages/Home.tsx'
import './index.css'
import Dashboard from './pages/Dashboard.tsx'
import { SessionProvider } from './session.tsx'
import SignupSuccess from './pages/SignupSuccess.tsx'
import LoginSuccess from './pages/LoginSuccess.tsx'

// Home component that contains the main content
// HomePage no longer used; logged-in Home is default

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SessionProvider>
      <Router>
        <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<HomeLoggedIn />} />
        <Route path="/logout" element={<LogoutConfirm />} />
        <Route path="/login" element={<SignInPageDemo />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/signup-success" element={<SignupSuccess />} />
        <Route path="/login-success" element={<LoginSuccess />} />
        <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Router>
    </SessionProvider>
  </StrictMode>
)

