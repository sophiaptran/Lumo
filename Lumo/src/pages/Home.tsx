import { HeroScrollDemo } from "../scroller"
import { GridEffect } from "../grid"
import { LastHero } from "../last-hero"
import { LoginButtonComp } from "../login-btn.tsx"
import { SignupButtonComp } from "../su-btn.tsx"

export function Home() {
  return (
    <>
      <div className="w-full flex items-center justify-end gap-2 p-4">
        <LoginButtonComp />
        <SignupButtonComp />
      </div>
      <HeroScrollDemo />
      <GridEffect />
      <LastHero />
    </>
  )
}

export default Home;