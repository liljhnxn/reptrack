"use client";

import { Dumbbell, ExternalLink } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-borderGreen/80 bg-background/90 py-12 text-secondaryText text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          {/* Brand & Description */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-card border border-borderGreen flex items-center justify-center text-accent">
                <Dumbbell className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-base text-primaryText">
                Rep<span className="text-accent">Track</span>
              </span>
            </div>
            <p className="max-w-md text-secondaryText leading-relaxed">
              Decentralized fitness tracking platform. Record your sets, repetitions, and weights
              permanently on the Botchain Testnet blockchain.
            </p>
          </div>

          {/* Network & Explorer Badges */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            {/* Network pill */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-card border border-borderGreen">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="text-primaryText font-medium">Botchain Testnet</span>
              <span className="text-borderGreen">•</span>
              <span className="font-mono text-secondaryText">Chain 968</span>
            </div>

            <a
              href="https://scan.bohr.life"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-card border border-borderGreen hover:border-accent/40 text-primaryText transition-colors"
            >
              <span>BohrScan Explorer</span>
              <ExternalLink className="w-3.5 h-3.5 text-secondaryText" />
            </a>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="mt-8 pt-6 border-t border-borderGreen/50 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-secondaryText/70">
          <p>© {new Date().getFullYear()} RepTrack. Track Your Reps. Own Your Progress.</p>
          <p className="font-mono">Solidity 0.8.20 • Next.js App Router • wagmi & viem</p>
        </div>
      </div>
    </footer>
  );
}

