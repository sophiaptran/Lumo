import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import ShaderAnimationComponent from "./shader-anim.tsx"
import { AnimatedShaderBackground } from "./anim-shader.tsx"
import { LastHero } from "./last-hero.tsx"
import { GridEffect } from "./grid.tsx"
import { NavBar } from "./navbar.tsx"
import StreaksPage from './pages/StreaksPage.tsx'
import PlanetBadgesPage from './pages/PlanetBadgesPage.tsx'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={
          <>
            <ShaderAnimationComponent />
            <GridEffect />
            <LastHero />
          </>
        } />
        <Route path="/streaks" element={<StreaksPage />} />
        <Route path="/badges" element={<PlanetBadgesPage />} />
      </Routes>
    </Router>
  </StrictMode>
)

