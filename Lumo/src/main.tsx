import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import ShaderAnimationComponent from "./shader-anim.tsx";
import { AnimatedShaderBackground } from "./anim-shader.tsx";
import { LastHero } from "./last-hero.tsx";
import { GridEffect } from "./grid.tsx";
import { NavBar } from "./navbar.tsx";
import "./index.css";
import { Dashboard } from "./dashboard.tsx";


/*createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <NavBar />
    <ShaderAnimationComponent />
    <GridEffect />
    <LastHero />
  </StrictMode>
);*/


createRoot(document.getElementById("root")!).render(
  <Dashboard />
);