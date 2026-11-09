"use client";

import { useState, useEffect } from "react";
import { useAccount, useChainId, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { REPTRACK_CONTRACT_ADDRESS, REPTRACK_ABI } from "@/lib/contract";
import { botchainTestnet } from "@/lib/wagmi";
import { PlusCircle, Loader2, CheckCircle2, AlertCircle, Dumbbell, Sparkles, ExternalLink } from "lucide-react";

const CATEGORIES = [
  "Chest",
  "Back",
  "Legs",
  "Shoulders",
  "Arms",
  "Core",
  "Cardio",
  "Full Body",
] as const;

interface WorkoutFormProps {
  onWorkoutRecorded?: () => void;
}

export function WorkoutForm({ onWorkoutRecorded }: WorkoutFormProps) {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();

  const [exerciseName, setExerciseName] = useState("");
  const [sets, setSets] = useState<number | "">("");
  const [reps, setReps] = useState<number | "">("");
  const [weightKg, setWeightKg] = useState<number | "">("");
  const [category, setCategory] = useState<string>("Chest");
  const [validationError, setValidationError] = useState<string | null>(null);
  const [txError, setTxError] = useState<string | null>(null);

  const isWrongNetwork = isConnected && chainId !== botchainTestnet.id;
  const isContractConfigured =
    REPTRACK_CONTRACT_ADDRESS !== "0x0000000000000000000000000000000000000000";

  const {
    data: hash,
    isPending: isWritePending,
    error: writeError,
    writeContract,
    reset: resetWrite,
  } = useWriteContract();

  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    error: confirmError,
  } = useWaitForTransactionReceipt({
    hash,
  });

  const isSubmitting = isWritePending || isConfirming;

  // Handle successful transaction confirmation
  useEffect(() => {
    if (isConfirmed) {
      setExerciseName("");
      setSets("");
      setReps("");
      setWeightKg("");
      setValidationError(null);
      setTxError(null);
      if (onWorkoutRecorded) {
        onWorkoutRecorded();
      }
    }
  }, [isConfirmed, onWorkoutRecorded]);

  // Handle errors
  useEffect(() => {
    if (writeError) {
      setTxError(writeError.message || "Failed to submit transaction.");
    } else if (confirmError) {
      setTxError(confirmError.message || "Transaction failed on blockchain.");
    }
  }, [writeError, confirmError]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    setTxError(null);

    if (!isConnected) {
      setValidationError("Please connect your wallet first.");
      return;
    }

    if (isWrongNetwork) {
      setValidationError("Please switch your wallet to Botchain Testnet (Chain ID: 968).");
      return;
    }

    if (!isContractConfigured) {
      setValidationError(
        "Smart contract address is not configured yet. Please deploy the contract to Botchain."
      );
      return;
    }

    if (!exerciseName.trim()) {
      setValidationError("Exercise name cannot be empty.");
      return;
    }

    const setsNum = Number(sets);
    if (!sets || isNaN(setsNum) || setsNum <= 0) {
      setValidationError("Sets must be a positive number greater than 0.");
      return;
    }

    const repsNum = Number(reps);
    if (!reps || isNaN(repsNum) || repsNum <= 0) {
      setValidationError("Repetitions must be a positive number greater than 0.");
      return;
    }

    const weightNum = Number(weightKg);
    if (weightKg === "" || isNaN(weightNum) || weightNum < 0) {
      setValidationError("Weight must be 0 or a positive number (in kg).");
      return;
    }

    if (!category.trim()) {
      setValidationError("Please select a workout category.");
      return;
    }

    resetWrite();

    // Call RepTrack.recordWorkout
    writeContract({
      address: REPTRACK_CONTRACT_ADDRESS,
      abi: REPTRACK_ABI,
      functionName: "recordWorkout",
      args: [
        exerciseName.trim(),
        BigInt(setsNum),
        BigInt(repsNum),
        BigInt(weightNum),
        category,
      ],
    });
  };

  return (
    <section id="record-workout" className="py-12 border-b border-borderGreen/50 scroll-mt-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-dim border border-accent/20 text-accent text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>On-Chain Recording</span>
          </div>
          <h2 className="text-3xl font-black text-primaryText tracking-tight uppercase">
            Log Workout Session
          </h2>
          <p className="mt-2 text-sm text-secondaryText">
            Record your fitness accomplishments directly on Botchain Testnet.
          </p>
        </div>

        {/* Workout Form Card */}
        <div className="p-6 sm:p-8 rounded-2xl bg-card border border-borderGreen glow-card">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Exercise Name */}
            <div>
              <label
                htmlFor="exerciseName"
                className="block text-xs font-bold uppercase tracking-wider text-secondaryText mb-2"
              >
                Exercise Name
              </label>
              <div className="relative">
                <input
                  id="exerciseName"
                  type="text"
                  placeholder="e.g. Barbell Bench Press, Deadlift, Pull-ups"
                  value={exerciseName}
                  onChange={(e) => setExerciseName(e.target.value)}
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 rounded-xl bg-background border border-borderGreen text-primaryText placeholder-secondaryText/50 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all text-sm font-medium"
                />
              </div>
            </div>

            {/* Category Selector */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-secondaryText mb-2">
                Workout Category
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {CATEGORIES.map((cat) => {
                  const isSelected = category === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategory(cat)}
                      disabled={isSubmitting}
                      className={`px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border ${
                        isSelected
                          ? "bg-accent text-background border-accent shadow-sm"
                          : "bg-background/80 text-secondaryText border-borderGreen hover:border-accent/40 hover:text-primaryText"
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sets, Reps, Weight Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label
                  htmlFor="sets"
                  className="block text-xs font-bold uppercase tracking-wider text-secondaryText mb-2"
                >
                  Sets
                </label>
                <input
                  id="sets"
                  type="number"
                  min="1"
                  step="1"
                  placeholder="e.g. 4"
                  value={sets}
                  onChange={(e) =>
                    setSets(e.target.value === "" ? "" : Math.max(1, parseInt(e.target.value) || 0))
                  }
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 rounded-xl bg-background border border-borderGreen text-primaryText placeholder-secondaryText/50 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all text-sm font-semibold"
                />
              </div>

              <div>
                <label
                  htmlFor="reps"
                  className="block text-xs font-bold uppercase tracking-wider text-secondaryText mb-2"
                >
                  Reps per Set
                </label>
                <input
                  id="reps"
                  type="number"
                  min="1"
                  step="1"
                  placeholder="e.g. 10"
                  value={reps}
                  onChange={(e) =>
                    setReps(e.target.value === "" ? "" : Math.max(1, parseInt(e.target.value) || 0))
                  }
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 rounded-xl bg-background border border-borderGreen text-primaryText placeholder-secondaryText/50 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all text-sm font-semibold"
                />
              </div>

              <div>
                <label
                  htmlFor="weightKg"
                  className="block text-xs font-bold uppercase tracking-wider text-secondaryText mb-2"
                >
                  Weight (kg)
                </label>
                <input
                  id="weightKg"
                  type="number"
                  min="0"
                  step="1"
                  placeholder="0 for bodyweight"
                  value={weightKg}
                  onChange={(e) =>
                    setWeightKg(e.target.value === "" ? "" : Math.max(0, parseInt(e.target.value) || 0))
                  }
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 rounded-xl bg-background border border-borderGreen text-primaryText placeholder-secondaryText/50 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all text-sm font-semibold"
                />
              </div>
            </div>

            {/* Validation Message */}
            {validationError && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-medium">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{validationError}</span>
              </div>
            )}

            {/* Tx Error Message */}
            {txError && (
              <div className="flex items-start gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-medium">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <div className="flex-1 break-words">
                  <p className="font-bold">Transaction Failed</p>
                  <p className="opacity-90 mt-0.5">{txError}</p>
                </div>
              </div>
            )}

            {/* Tx Success Message */}
            {isConfirmed && hash && (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs space-y-1.5 animate-in fade-in">
                <div className="flex items-center gap-2 font-bold text-sm">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Workout Confirmed On-Chain!</span>
                </div>
                <p className="opacity-90">
                  Your workout was securely written to the Botchain blockchain.
                </p>
                <a
                  href={`https://scan.bohr.life/tx/${hash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-mono text-[11px] underline hover:text-emerald-300 pt-1"
                >
                  <span>View transaction: {hash.slice(0, 10)}...{hash.slice(-8)}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 rounded-xl bg-accent text-background font-black uppercase tracking-wider text-base hover:bg-accent-hover transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-accent/20"
            >
              {isWritePending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Confirm in Wallet...</span>
                </>
              ) : isConfirming ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Confirming on Botchain...</span>
                </>
              ) : (
                <>
                  <PlusCircle className="w-5 h-5" />
                  <span>Save Workout</span>
                </>
              )}
            </button>

            {/* Context helpers */}
            <div className="text-center text-[11px] text-secondaryText">
              {!isConnected ? (
                <span className="text-amber-400">Wallet connection required to submit</span>
              ) : isWrongNetwork ? (
                <span className="text-amber-400">Switch to Botchain Testnet to record</span>
              ) : (
                <span>Gas fee paid in testnet native currency</span>
              )}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

