"use client";

import { useState, useEffect, useMemo } from "react";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { REPTRACK_CONTRACT_ADDRESS, REPTRACK_ABI, WorkoutRecord } from "@/lib/contract";
import { WorkoutCard } from "./WorkoutCard";
import { History, RefreshCw, Filter, Dumbbell, AlertCircle, CheckCircle2 } from "lucide-react";

interface WorkoutHistoryProps {
  workouts?: WorkoutRecord[];
  isLoading: boolean;
  isRefetching: boolean;
  refetch: () => void;
  readError: Error | null;
  onRefresh?: () => void;
}

export function WorkoutHistory({
  workouts = [],
  isLoading,
  isRefetching,
  refetch,
  readError,
  onRefresh,
}: WorkoutHistoryProps) {
  const { address, isConnected } = useAccount();
  const [activeTab, setActiveTab] = useState<"all" | "my">("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [deletingId, setDeletingId] = useState<bigint | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleteSuccess, setDeleteSuccess] = useState<string | null>(null);

  // Write contract for removal
  const {
    data: deleteTxHash,
    isPending: isDeleteWritePending,
    error: deleteWriteError,
    writeContract: writeRemoveWorkout,
    reset: resetDeleteWrite,
  } = useWriteContract();

  const {
    isLoading: isDeleteConfirming,
    isSuccess: isDeleteConfirmed,
    error: deleteConfirmError,
  } = useWaitForTransactionReceipt({
    hash: deleteTxHash,
  });

  const isDeleting = isDeleteWritePending || isDeleteConfirming;

  // Refetch when delete confirms
  useEffect(() => {
    if (isDeleteConfirmed) {
      setDeleteSuccess("Workout record was successfully removed from Botchain.");
      setDeletingId(null);
      resetDeleteWrite();
      refetch();
      if (onRefresh) onRefresh();
    }
  }, [isDeleteConfirmed, onRefresh, refetch, resetDeleteWrite]);

  useEffect(() => {
    if (deleteWriteError) {
      setDeleteError(deleteWriteError.message || "Failed to submit removal transaction.");
      setDeletingId(null);
    } else if (deleteConfirmError) {
      setDeleteError(deleteConfirmError.message || "Removal transaction failed.");
      setDeletingId(null);
    }
  }, [deleteWriteError, deleteConfirmError]);

  const handleDelete = (id: bigint) => {
    if (!isConnected) return;
    setDeleteError(null);
    setDeleteSuccess(null);
    setDeletingId(id);

    writeRemoveWorkout({
      address: REPTRACK_CONTRACT_ADDRESS,
      abi: REPTRACK_ABI,
      functionName: "removeWorkout",
      args: [id],
    });
  };

  const safeWorkouts = useMemo(() => {
    return Array.isArray(workouts) ? workouts : [];
  }, [workouts]);

  // Filter based on Tab (All vs My) and Category
  const filteredWorkouts = useMemo(() => {
    return safeWorkouts
      .filter((w) => {
        if (!w || !w.author) return false;
        if (activeTab === "my") {
          if (!address) return false;
          return w.author.toLowerCase() === address.toLowerCase();
        }
        return true;
      })
      .filter((w) => {
        if (categoryFilter === "All") return true;
        return w.category?.toLowerCase() === categoryFilter.toLowerCase();
      })
      // Sort newest first
      .sort((a, b) => Number(b.timestamp - a.timestamp));
  }, [safeWorkouts, activeTab, categoryFilter, address]);

  const categories = useMemo(() => {
    const set = new Set<string>();
    safeWorkouts.forEach((w) => {
      if (w && w.category) set.add(w.category);
    });
    return ["All", ...Array.from(set)];
  }, [safeWorkouts]);

  return (
    <section id="history" className="py-12 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-accent text-xs font-bold uppercase tracking-wider mb-2">
              <History className="w-4 h-4" />
              <span>Immutable Ledger</span>
            </div>
            <h2 className="text-3xl font-black text-primaryText tracking-tight uppercase">
              Workout History
            </h2>
          </div>

          <button
            onClick={() => {
              refetch();
              if (onRefresh) onRefresh();
            }}
            disabled={isRefetching || isLoading}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-card border border-borderGreen text-secondaryText hover:text-primaryText hover:border-accent/40 transition-all text-xs font-semibold self-start sm:self-auto disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefetching ? "animate-spin text-accent" : ""}`} />
            <span>{isRefetching ? "Refreshing..." : "Refresh Records"}</span>
          </button>
        </div>

        {/* Delete Notifications */}
        {deleteError && (
          <div className="mb-6 flex items-start gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-medium">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-bold">Error Deleting Workout</p>
              <p className="opacity-90">{deleteError}</p>
            </div>
          </div>
        )}

        {deleteSuccess && (
          <div className="mb-6 flex items-center gap-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{deleteSuccess}</span>
          </div>
        )}

        {/* Controls: Tabs & Category Filter */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6">
          {/* Tabs */}
          <div className="flex p-1 rounded-xl bg-card border border-borderGreen w-fit">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                activeTab === "all"
                  ? "bg-accent text-background shadow-sm"
                  : "text-secondaryText hover:text-primaryText"
              }`}
            >
              All Workouts ({workouts.length})
            </button>
            <button
              onClick={() => setActiveTab("my")}
              className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                activeTab === "my"
                  ? "bg-accent text-background shadow-sm"
                  : "text-secondaryText hover:text-primaryText"
              }`}
            >
              My Workouts (
              {isConnected
                ? workouts.filter((w) => w.author.toLowerCase() === address?.toLowerCase()).length
                : 0}
              )
            </button>
          </div>

          {/* Category Dropdown/Pills */}
          {categories.length > 1 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
              <Filter className="w-3.5 h-3.5 text-secondaryText shrink-0" />
              <div className="flex gap-1.5">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                      categoryFilter === cat
                        ? "bg-borderGreen text-accent border border-accent/40"
                        : "bg-card/50 text-secondaryText hover:text-primaryText border border-transparent"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Main Content: Loading, Empty, or Cards Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="h-56 rounded-2xl bg-card/60 border border-borderGreen animate-pulse p-6 space-y-4"
              >
                <div className="h-4 w-24 bg-borderGreen/50 rounded" />
                <div className="h-6 w-48 bg-borderGreen/50 rounded" />
                <div className="h-16 bg-borderGreen/30 rounded-xl" />
              </div>
            ))}
          </div>
        ) : readError ? (
          <div className="p-12 text-center rounded-2xl bg-card border border-borderGreen">
            <AlertCircle className="w-10 h-10 text-amber-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-primaryText">Unable to Load Records</h3>
            <p className="text-xs text-secondaryText max-w-md mx-auto mt-1 mb-4">
              Could not retrieve workout records from the Botchain Testnet contract. Verify that your contract address is configured.
            </p>
            <button
              onClick={() => refetch()}
              className="px-4 py-2 rounded-lg bg-accent text-background font-semibold text-xs hover:bg-accent-hover transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : filteredWorkouts.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-card border border-borderGreen">
            <div className="w-12 h-12 rounded-2xl bg-borderGreen/60 text-accent flex items-center justify-center mx-auto mb-4">
              <Dumbbell className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-primaryText">No Workouts Found</h3>
            <p className="text-xs text-secondaryText max-w-sm mx-auto mt-1 mb-6">
              {activeTab === "my"
                ? isConnected
                  ? "You haven't recorded any workouts yet. Log your first session above!"
                  : "Connect your wallet to see workouts recorded by your address."
                : "No workout sessions have been recorded on this smart contract yet."}
            </p>
            <a
              href="#record-workout"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent text-background font-bold text-xs uppercase tracking-wider hover:bg-accent-hover transition-all"
            >
              Record First Workout
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWorkouts.map((workout) => (
              <WorkoutCard
                key={workout.id.toString()}
                workout={workout}
                connectedAddress={address}
                onDelete={handleDelete}
                isDeleting={isDeleting}
                deletingId={deletingId}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
