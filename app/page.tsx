"use client";

import { useMemo } from "react";
import { useReadContract } from "wagmi";
import { REPTRACK_CONTRACT_ADDRESS, REPTRACK_ABI, WorkoutRecord } from "@/lib/contract";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Stats } from "@/components/Stats";
import { WorkoutForm } from "@/components/WorkoutForm";
import { WorkoutHistory } from "@/components/WorkoutHistory";
import { Footer } from "@/components/Footer";

export default function Home() {
  const isContractConfigured =
    REPTRACK_CONTRACT_ADDRESS !== "0x0000000000000000000000000000000000000000";

  // Single unified RPC query for all active workouts - eliminates N+1 query overhead
  const {
    data: allWorkoutsData,
    isLoading,
    isRefetching,
    refetch,
    error: readError,
  } = useReadContract({
    address: REPTRACK_CONTRACT_ADDRESS,
    abi: REPTRACK_ABI,
    functionName: "getAllWorkouts",
    query: {
      enabled: isContractConfigured,
    },
  });

  // Extract active workouts in memory
  const workouts = useMemo(() => {
    if (!allWorkoutsData) return [];
    const list = (allWorkoutsData as unknown as WorkoutRecord[]) || [];
    return list.filter((w) => w.isActive);
  }, [allWorkoutsData]);

  const handleDataRefresh = () => {
    refetch();
  };

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-accent selection:text-background">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Stats workouts={workouts} isLoading={isLoading} />
        <WorkoutForm onWorkoutRecorded={handleDataRefresh} />
        <WorkoutHistory
          workouts={workouts}
          isLoading={isLoading}
          isRefetching={isRefetching}
          refetch={refetch}
          readError={readError as Error | null}
          onRefresh={handleDataRefresh}
        />
      </main>
      <Footer />
    </div>
  );
}
