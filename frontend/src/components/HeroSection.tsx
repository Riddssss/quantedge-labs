import { ChevronDown } from "lucide-react";

export function HeroSection() {
  return (
    <section className="text-center py-20 md:py-28 px-6">
      <h1
        className="font-serif text-5xl md:text-6xl lg:text-7xl font-normal tracking-wide text-slate animate-fade-up"
        style={{ fontFamily: "'Playfair Display', serif" }}
      >
        QuantEdge Labs
      </h1>
      <p
        className="mt-4 text-lg md:text-2xl font-light text-dusty-blue animate-fade-up"
        style={{
          fontFamily: "'Playfair Display', serif",
          animationDelay: "250ms",
          animationFillMode: "backwards",
        }}
      >
        Engineering{" "}
        <span className="text-copper italic">Alpha</span>{" "}
        Through Evolution
      </p>
      <button
        onClick={() => {
          document.getElementById("dashboard")?.scrollIntoView({ behavior: "smooth" });
        }}
        className="mt-10 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 animate-fade-in"
        style={{ animationDelay: "500ms", animationFillMode: "backwards" }}
      >
        Explore Dashboard
        <ChevronDown className="h-4 w-4" />
      </button>
    </section>
  );
}
