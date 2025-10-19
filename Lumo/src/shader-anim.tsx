import { ShaderAnimation } from "@/components/ui/shader-animation";

export default function ShaderAnimationComponent() {
  return (
    <div id="hero" className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-xl bg-blue-700">      <ShaderAnimation/>
      <span className="absolute pointer-events-none z-10 text-center text-7xl leading-none font-semibold tracking-tighter whitespace-pre-wrap text-white">
        Lumo
      </span>
    </div>
  )
}