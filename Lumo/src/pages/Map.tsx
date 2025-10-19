import { Starfield } from "@/components/ui/starfield-background";

export default function VideoMap() {
  return (
    <div className="relative min-h-screen">
      <Starfield />
      <main className="relative z-10 p-6">
        {/* your dashboard content */}
      </main>
    </div>
  );
}
