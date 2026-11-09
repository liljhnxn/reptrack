"use client";

import { WorkoutRecord } from "@/lib/contract";
import { Trash2, Loader2, Calendar, Weight, Repeat, Layers, ExternalLink } from "lucide-react";

interface WorkoutCardProps {
  workout: WorkoutRecord;
  connectedAddress?: `0x${string}`;
  onDelete: (id: bigint) => void;
  isDeleting: boolean;
  deletingId: bigint | null;
}

const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  Chest: { bg: "bg-red-500/10", text: "text-red-400", border: "border-red-500/30" },
  Back: { bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/30" },
  Legs: { bg: "bg-purple-500/10", text: "text-purple-400", border: "border-purple-500/30" },
  Shoulders: { bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/30" },
  Arms: { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/30" },
  Core: { bg: "bg-cyan-500/10", text: "text-cyan-400", border: "border-cyan-500/30" },
  Cardio: { bg: "bg-orange-500/10", text: "text-orange-400", border: "border-orange-500/30" },
  "Full Body": { bg: "bg-lime-500/10", text: "text-lime-400", border: "border-lime-500/30" },
};

export function WorkoutCard({
  workout,
  connectedAddress,
  onDelete,
  isDeleting,
  deletingId,
}: WorkoutCardProps) {
  const isAuthor =
    connectedAddress &&
    connectedAddress.toLowerCase() === workout.author.toLowerCase();

  const isCurrentItemDeleting = isDeleting && deletingId === workout.id;

  const categoryStyle =
    CATEGORY_COLORS[workout.category] || {
      bg: "bg-accent-dim",
      text: "text-accent",
      border: "border-accent/30",
    };

  const formattedDate = new Date(Number(workout.timestamp) * 1000).toLocaleString(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  );

  const truncatedAuthor = `${workout.author.slice(0, 6)}...${workout.author.slice(-4)}`;

  return (
    <div className="relative p-5 rounded-2xl bg-card border border-borderGreen glow-card flex flex-col justify-between transition-all duration-200 hover:-translate-y-0.5">
      {/* Top Header */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1">
            <span
              className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider border mb-2 ${categoryStyle.bg} ${categoryStyle.text} ${categoryStyle.border}`}
            >
              {workout.category}
            </span>
            <h3 className="text-lg font-black text-primaryText tracking-tight">
              {workout.exerciseName}
            </h3>
          </div>

          {/* Delete Button (Only for Author) */}
          {isAuthor && (
            <button
              onClick={() => onDelete(workout.id)}
              disabled={isDeleting}
              title="Remove workout record"
              className="p-2 rounded-lg text-secondaryText hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all active:scale-90 disabled:opacity-50"
            >
              {isCurrentItemDeleting ? (
                <Loader2 className="w-4 h-4 animate-spin text-red-400" />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
            </button>
          )}
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-background/60 border border-borderGreen/60 my-4 text-center">
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1 text-[11px] text-secondaryText font-medium">
              <Layers className="w-3 h-3 text-accent" />
              <span>Sets</span>
            </div>
            <span className="text-lg font-black text-primaryText mt-0.5">
              {workout.sets.toString()}
            </span>
          </div>

          <div className="flex flex-col items-center border-x border-borderGreen/60">
            <div className="flex items-center gap-1 text-[11px] text-secondaryText font-medium">
              <Repeat className="w-3 h-3 text-accent" />
              <span>Reps</span>
            </div>
            <span className="text-lg font-black text-primaryText mt-0.5">
              {workout.reps.toString()}
            </span>
          </div>

          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1 text-[11px] text-secondaryText font-medium">
              <Weight className="w-3 h-3 text-accent" />
              <span>Weight</span>
            </div>
            <span className="text-lg font-black text-accent mt-0.5">
              {workout.weightKg.toString()} <span className="text-xs font-normal">kg</span>
            </span>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="pt-3 border-t border-borderGreen/50 space-y-1.5 text-xs text-secondaryText">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-secondaryText" />
            <span>{formattedDate}</span>
          </span>
          <span className="font-mono text-[10px] text-secondaryText/70">
            ID #{workout.id.toString()}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-[11px]">Author:</span>
          <a
            href={`https://scan.bohr.life/address/${workout.author}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 font-mono text-[11px] text-primaryText hover:text-accent transition-colors"
          >
            <span>{isAuthor ? `${truncatedAuthor} (You)` : truncatedAuthor}</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
}

