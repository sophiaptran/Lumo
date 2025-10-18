import { StrictMode } from 'react'
import { HeroScrollDemo } from "./scroller.tsx"

import { createRoot } from 'react-dom/client'
import ShaderAnimationComponent from "./shader-anim.tsx"
import { AnimatedShaderBackground } from "./anim-shader.tsx"
import { LastHero } from "./last-hero.tsx"
import { GridEffect } from "./grid.tsx"
import { NavBar } from "./navbar.tsx"
import './index.css'

// import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <NavBar />
    <HeroScrollDemo />
    {/* <ShaderAnimationComponent /> */}
    <GridEffect />
    <LastHero />
  </StrictMode>
)

