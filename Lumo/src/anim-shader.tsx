import AnoAI from "@/components/ui/animated-shader-background";

const AnimatedShaderBackground = () => {
  return (
    <section className="relative w-full h-[100svh] bg-black overflow-hidden">
      <div className="absolute inset-0">
        <AnoAI/>
      </div>
    </section>
  );
};

export { AnimatedShaderBackground };