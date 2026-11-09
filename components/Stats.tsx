"use client";

import { useAccount } from "wagmi";
import { REPTRACK_CONTRACT_ADDRESS, WorkoutRecord } from "@/lib/contract";
import { Dumbbell, Flame, Calendar, Activity } from "lucide-react";
import { useMemo } from "react";

interface StatsProps {
  workouts?: WorkoutRecord[];
  isLoading?: boolean;
}

export function Stats({ workouts = [], isLoading = false }: StatsProps) {
  const { address, isConnected } = useAccount();

  const safeWorkouts = useMemo(() => {
    return Array.isArray(workouts) ? workouts : [];
  }, [workouts]);

  // Total active workouts count derived from unified dataset
  const totalWorkouts = safeWorkouts.length;

  // Connected user workouts derived in-memory without extra RPC calls
  const userWorkouts = useMemo(() => {
    if (!address) return [];
    return safeWorkouts.filter(
      (w) => w && w.author && w.author.toLowerCase() === address.toLowerCase()
    );
  }, [safeWorkouts, address]);

  const userWorkoutsCount = userWorkouts.length;

  // Compute latest workout date from user workouts
  const latestWorkoutDateFormatted = useMemo(() => {
    if (!isConnected || !address) {
      return "Connect wallet";
    }
    if (isLoading) {
      return "Loading...";
    }
    if (userWorkouts.length === 0) {
      return "No workouts recorded";
    }

    let maxTimestamp = 0n;
    for (const w of userWorkouts) {
      if (w && w.timestamp > maxTimestamp) {
        maxTimestamp = w.timestamp;
      }
    }

    if (maxTimestamp === 0n) return "No workouts recorded";

    const date = new Date(Number(maxTimestamp) * 1000);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }, [isConnected, address, isLoading, userWorkouts]);

  const isContractSet =
    REPTRACK_CONTRACT_ADDRESS !== "0x0000000000000000000000000000000000000000";

  return (
    <section id="dashboard" className="py-12 border-b border-borderGreen/50 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-accent text-xs font-bold uppercase tracking-wider mb-2">
              <Activity className="w-4 h-4" />
              <span>Live Blockchain Metrics</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-primaryText tracking-tight uppercase">
              Fitness Dashboard
            </h2>
          </div>
          <p className="text-xs text-secondaryText font-mono">
            Directly synced with Botchain Testnet (Chain ID 968)
          </p>
        </div>

        {!isContractSet && (
          <div className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-sm flex items-center justify-between">
            <div>
              <p className="font-semibold">Notice: Contract Address Not Configured Yet</p>
              <p className="text-xs text-amber-200/80 mt-0.5">
                Deploy the contract using <code className="bg-background/80 px-1 py-0.5 rounded">npm run deploy:botchain</code> and set <code className="bg-background/80 px-1 py-0.5 rounded">NEXT_PUBLIC_REPTRACK_CONTRACT_ADDRESS</code> in <code className="bg-background/80 px-1 py-0.5 rounded">.env.local</code>.
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Total Workouts */}
          <div className="p-6 rounded-2xl bg-card border border-borderGreen glow-card transition-all">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-secondaryText">
                Total Workouts
              </span>
              <div className="p-2.5 rounded-xl bg-accent-dim text-accent">
                <Dumbbell className="w-5 h-5" />
              </div>
            </div>
            <div className="space-y-1">
              {isLoading ? (
                <div className="h-10 w-24 bg-borderGreen/50 rounded-lg animate-pulse" />
              ) : (
                <div className="text-4xl font-black text-primaryText tracking-tight">
                  {totalWorkouts.toLocaleString()}
                </div>
              )}
              <p className="text-xs text-secondaryText">
                Global sessions recorded across all athletes
              </p>
            </div>
          </div>

          {/* Card 2: Your Workouts */}
          <div className="p-6 rounded-2xl bg-card border border-borderGreen glow-card transition-all">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-secondaryText">
                Your Workouts
              </span>
              <div className="p-2.5 rounded-xl bg-accent-dim text-accent">
                <Flame className="w-5 h-5" />
              </div>
            </div>
            <div className="space-y-1">
              {!isConnected ? (
                <div className="text-lg font-bold text-secondaryText italic">
                  Wallet not connected
                </div>
              ) : isLoading ? (
                <div className="h-10 w-24 bg-borderGreen/50 rounded-lg animate-pulse" />
              ) : (
                <div className="text-4xl font-black text-accent tracking-tight">
                  {userWorkoutsCount.toLocaleString()}
                </div>
              )}
              <p className="text-xs text-secondaryText">
                {isConnected
                  ? "Your confirmed sessions on Botchain"
                  : "Connect your wallet to view personal stats"}
              </p>
            </div>
          </div>

          {/* Card 3: Latest Workout Date */}
          <div className="p-6 rounded-2xl bg-card border border-borderGreen glow-card transition-all">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-secondaryText">
                Latest Workout Date
              </span>
              <div className="p-2.5 rounded-xl bg-accent-dim text-accent">
                <Calendar className="w-5 h-5" />
              </div>
            </div>
            <div className="space-y-1">
              {isLoading && isConnected ? (
                <div className="h-8 w-32 bg-borderGreen/50 rounded-lg animate-pulse" />
              ) : (
                <div className="text-2xl font-black text-primaryText tracking-tight truncate">
                  {latestWorkoutDateFormatted}
                </div>
              )}
              <p className="text-xs text-secondaryText">
                Timestamp of your most recent logged exercise
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
