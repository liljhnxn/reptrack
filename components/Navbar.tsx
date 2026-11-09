"use client";

import { useState } from "react";
import { Dumbbell, Menu, X, PlusCircle, History, LayoutDashboard } from "lucide-react";
import { WalletConnect } from "./WalletConnect";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className="sticky top-0 z-40 w-full backdrop-blur-md bg-background/90 border-b border-borderGreen/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center gap-2.5 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 rounded-xl bg-card border border-borderGreen flex items-center justify-center text-accent group-hover:border-accent/60 group-hover:bg-accent-dim transition-all duration-200">
              <Dumbbell className="w-5 h-5 transition-transform group-hover:rotate-45" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xl tracking-tight text-primaryText leading-none">
                Rep<span className="text-accent">Track</span>
              </span>
              <span className="text-[10px] uppercase font-mono tracking-widest text-secondaryText">
                Botchain
              </span>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-6">
            <button
              onClick={() => scrollToSection("dashboard")}
              className="flex items-center gap-1.5 text-sm font-medium text-secondaryText hover:text-primaryText transition-colors"
            >
              <LayoutDashboard className="w-4 h-4 text-accent/70" />
              <span>Dashboard</span>
            </button>
            <button
              onClick={() => scrollToSection("history")}
              className="flex items-center gap-1.5 text-sm font-medium text-secondaryText hover:text-primaryText transition-colors"
            >
              <History className="w-4 h-4 text-accent/70" />
              <span>Workout History</span>
            </button>
            <button
              onClick={() => scrollToSection("record-workout")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-borderGreen/70 hover:bg-borderGreen text-accent border border-accent/20 hover:border-accent/50 text-sm font-medium transition-all"
            >
              <PlusCircle className="w-4 h-4 text-accent" />
              <span>Record Workout</span>
            </button>
          </div>

          {/* Right Wallet Connect & Mobile Toggle */}
          <div className="flex items-center gap-3">
            <WalletConnect />

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg bg-card border border-borderGreen text-secondaryText hover:text-primaryText"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-borderGreen bg-card/95 px-4 pt-3 pb-5 space-y-2 animate-in fade-in slide-in-from-top-2">
          <button
            onClick={() => scrollToSection("dashboard")}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-left text-sm font-medium text-primaryText hover:bg-card-hover"
          >
            <LayoutDashboard className="w-4 h-4 text-accent" />
            <span>Dashboard</span>
          </button>
          <button
            onClick={() => scrollToSection("history")}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-left text-sm font-medium text-primaryText hover:bg-card-hover"
          >
            <History className="w-4 h-4 text-accent" />
            <span>Workout History</span>
          </button>
          <button
            onClick={() => scrollToSection("record-workout")}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-left text-sm font-semibold text-accent bg-borderGreen/50 border border-accent/20"
          >
            <PlusCircle className="w-4 h-4 text-accent" />
            <span>Record Workout</span>
          </button>
        </div>
      )}
    </nav>
  );
}

