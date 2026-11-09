const configuredAddress = process.env.NEXT_PUBLIC_REPTRACK_CONTRACT_ADDRESS;
export const REPTRACK_CONTRACT_ADDRESS = (
  configuredAddress && configuredAddress !== "0x0000000000000000000000000000000000000000"
    ? configuredAddress
    : "0x839Ea7614CD798f1Cf31e3397635CD7Ed0b3B4A1"
) as `0x${string}`;

export const REPTRACK_ABI = [
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "uint256", name: "id", type: "uint256" },
      { indexed: true, internalType: "address", name: "author", type: "address" },
      { indexed: false, internalType: "string", name: "exerciseName", type: "string" },
      { indexed: false, internalType: "uint256", name: "sets", type: "uint256" },
      { indexed: false, internalType: "uint256", name: "reps", type: "uint256" },
      { indexed: false, internalType: "uint256", name: "weightKg", type: "uint256" },
      { indexed: false, internalType: "string", name: "category", type: "string" },
      { indexed: false, internalType: "uint256", name: "timestamp", type: "uint256" }
    ],
    name: "WorkoutRecorded",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "uint256", name: "id", type: "uint256" },
      { indexed: true, internalType: "address", name: "author", type: "address" },
      { indexed: false, internalType: "uint256", name: "timestamp", type: "uint256" }
    ],
    name: "WorkoutRemoved",
    type: "event"
  },
  {
    inputs: [
      { internalType: "string", name: "exerciseName", type: "string" },
      { internalType: "uint256", name: "sets", type: "uint256" },
      { internalType: "uint256", name: "reps", type: "uint256" },
      { internalType: "uint256", name: "weightKg", type: "uint256" },
      { internalType: "string", name: "category", type: "string" }
    ],
    name: "recordWorkout",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [{ internalType: "uint256", name: "id", type: "uint256" }],
    name: "removeWorkout",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "getAllWorkoutIds",
    outputs: [{ internalType: "uint256[]", name: "", type: "uint256[]" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "getAllWorkouts",
    outputs: [
      {
        components: [
          { internalType: "uint256", name: "id", type: "uint256" },
          { internalType: "address", name: "author", type: "address" },
          { internalType: "string", name: "exerciseName", type: "string" },
          { internalType: "uint256", name: "sets", type: "uint256" },
          { internalType: "uint256", name: "reps", type: "uint256" },
          { internalType: "uint256", name: "weightKg", type: "uint256" },
          { internalType: "string", name: "category", type: "string" },
          { internalType: "uint256", name: "timestamp", type: "uint256" },
          { internalType: "bool", name: "isActive", type: "bool" }
        ],
        internalType: "struct RepTrack.Workout[]",
        name: "",
        type: "tuple[]"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "getTotalWorkouts",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "address", name: "user", type: "address" }],
    name: "getUserWorkoutCount",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "address", name: "user", type: "address" }],
    name: "getUserWorkouts",
    outputs: [
      {
        components: [
          { internalType: "uint256", name: "id", type: "uint256" },
          { internalType: "address", name: "author", type: "address" },
          { internalType: "string", name: "exerciseName", type: "string" },
          { internalType: "uint256", name: "sets", type: "uint256" },
          { internalType: "uint256", name: "reps", type: "uint256" },
          { internalType: "uint256", name: "weightKg", type: "uint256" },
          { internalType: "string", name: "category", type: "string" },
          { internalType: "uint256", name: "timestamp", type: "uint256" },
          { internalType: "bool", name: "isActive", type: "bool" }
        ],
        internalType: "struct RepTrack.Workout[]",
        name: "",
        type: "tuple[]"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "uint256", name: "id", type: "uint256" }],
    name: "getWorkout",
    outputs: [
      {
        components: [
          { internalType: "uint256", name: "id", type: "uint256" },
          { internalType: "address", name: "author", type: "address" },
          { internalType: "string", name: "exerciseName", type: "string" },
          { internalType: "uint256", name: "sets", type: "uint256" },
          { internalType: "uint256", name: "reps", type: "uint256" },
          { internalType: "uint256", name: "weightKg", type: "uint256" },
          { internalType: "string", name: "category", type: "string" },
          { internalType: "uint256", name: "timestamp", type: "uint256" },
          { internalType: "bool", name: "isActive", type: "bool" }
        ],
        internalType: "struct RepTrack.Workout",
        name: "",
        type: "tuple"
      }
    ],
    stateMutability: "view",
    type: "function"
  }
] as const;

export interface WorkoutRecord {
  id: bigint;
  author: `0x${string}`;
  exerciseName: string;
  sets: bigint;
  reps: bigint;
  weightKg: bigint;
  category: string;
  timestamp: bigint;
  isActive: boolean;
}

