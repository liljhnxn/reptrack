"use client";

import { Dumbbell, ArrowDown, ShieldCheck, Zap, Activity } from "lucide-react";

export function Hero() {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 overflow-hidden border-b border-borderGreen/50">
      {/* Subtle radial glow background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-accent/5 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Fitness Tagline Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-card border border-borderGreen mb-6 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          <span className="text-xs font-semibold uppercase tracking-wider text-accent">
            Botchain Testnet Live
          </span>
          <span className="text-borderGreen">•</span>
          <span className="text-xs text-secondaryText">Decentralized Fitness</span>
        </div>

        {/* Main Title */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-primaryText tracking-tight uppercase leading-[1.1]">
          Your Progress. <br className="hidden sm:inline" />
          <span className="text-accent underline decoration-borderGreen decoration-4 underline-offset-8">
            Your Records.
          </span>{" "}
          Your Rules.
        </h1>

        {/* Supporting Text */}
        <p className="mt-6 text-base sm:text-lg md:text-xl text-secondaryText max-w-2xl mx-auto leading-relaxed">
          Track every workout, build consistency, and keep your fitness history on-chain.
          Immutable, decentralized, and entirely owned by you.
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => scrollTo("record-workout")}
            className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-accent text-background font-bold text-base hover:bg-accent-hover transition-all duration-200 active:scale-95 shadow-md shadow-accent/15"
          >
            <Dumbbell className="w-5 h-5 text-background" />
            <span>Record Workout</span>
          </button>

          <button
            onClick={() => scrollTo("history")}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-card border border-borderGreen text-primaryText font-semibold text-base hover:bg-card-hover hover:border-accent/40 transition-all duration-200"
          >
            <span>View History</span>
            <ArrowDown className="w-4 h-4 text-secondaryText" />
          </button>
        </div>

        {/* Feature Highlights Grid */}
        <div className="mt-14 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto pt-8 border-t border-borderGreen/60">
          <div className="flex items-center justify-center sm:justify-start gap-3 p-3 rounded-lg bg-card/40 border border-borderGreen/50">
            <div className="p-2 rounded-md bg-accent-dim text-accent">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="text-left">
              <p className="text-xs font-bold text-primaryText uppercase tracking-wider">100% On-Chain</p>
              <p className="text-[11px] text-secondaryText">Zero centralized databases</p>
            </div>
          </div>

          <div className="flex items-center justify-center sm:justify-start gap-3 p-3 rounded-lg bg-card/40 border border-borderGreen/50">
            <div className="p-2 rounded-md bg-accent-dim text-accent">
              <Zap className="w-4 h-4" />
            </div>
            <div className="text-left">
              <p className="text-xs font-bold text-primaryText uppercase tracking-wider">Botchain Testnet</p>
              <p className="text-[11px] text-secondaryText">Sub-second block confirmation</p>
            </div>
          </div>

          <div className="flex items-center justify-center sm:justify-start gap-3 p-3 rounded-lg bg-card/40 border border-borderGreen/50">
            <div className="p-2 rounded-md bg-accent-dim text-accent">
              <Activity className="w-4 h-4" />
            </div>
            <div className="text-left">
              <p className="text-xs font-bold text-primaryText uppercase tracking-wider">Self-Sovereign</p>
              <p className="text-[11px] text-secondaryText">Only you can edit your history</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

