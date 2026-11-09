import { expect } from "chai";
import hre from "hardhat";
const { ethers } = hre;
import { RepTrack } from "../typechain-types";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

describe("RepTrack Smart Contract", function () {
  let repTrack: RepTrack;
  let owner: HardhatEthersSigner;
  let user1: HardhatEthersSigner;
  let user2: HardhatEthersSigner;

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();
    const RepTrackFactory = await ethers.getContractFactory("RepTrack");
    repTrack = (await RepTrackFactory.deploy()) as RepTrack;
    await repTrack.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should start with 0 total workouts", async function () {
      expect(await repTrack.getTotalWorkouts()).to.equal(0);
      const allIds = await repTrack.getAllWorkoutIds();
      expect(allIds.length).to.equal(0);
      const allWorkouts = await repTrack.getAllWorkouts();
      expect(allWorkouts.length).to.equal(0);
    });
  });

  describe("Record Workout Session", function () {
    it("Should record a valid workout successfully and emit WorkoutRecorded event", async function () {
      const tx = await repTrack.connect(user1).recordWorkout(
        "Bench Press",
        4,
        10,
        80,
        "Chest"
      );

      await expect(tx)
        .to.emit(repTrack, "WorkoutRecorded")
        .withArgs(1, user1.address, "Bench Press", 4, 10, 80, "Chest", (await ethers.provider.getBlock("latest"))?.timestamp);

      expect(await repTrack.getTotalWorkouts()).to.equal(1);
      expect(await repTrack.getUserWorkoutCount(user1.address)).to.equal(1);

      const workout = await repTrack.getWorkout(1);
      expect(workout.id).to.equal(1);
      expect(workout.author).to.equal(user1.address);
      expect(workout.exerciseName).to.equal("Bench Press");
      expect(workout.sets).to.equal(4);
      expect(workout.reps).to.equal(10);
      expect(workout.weightKg).to.equal(80);
      expect(workout.category).to.equal("Chest");
      expect(workout.isActive).to.be.true;
    });

    it("Should reject empty exercise name", async function () {
      await expect(
        repTrack.connect(user1).recordWorkout("", 4, 10, 80, "Chest")
      ).to.be.revertedWith("Exercise name cannot be empty");
    });

    it("Should reject zero sets", async function () {
      await expect(
        repTrack.connect(user1).recordWorkout("Squat", 0, 10, 100, "Legs")
      ).to.be.revertedWith("Sets must be greater than zero");
    });

    it("Should reject zero repetitions", async function () {
      await expect(
        repTrack.connect(user1).recordWorkout("Squat", 4, 0, 100, "Legs")
      ).to.be.revertedWith("Repetitions must be greater than zero");
    });

    it("Should reject empty category", async function () {
      await expect(
        repTrack.connect(user1).recordWorkout("Deadlift", 3, 5, 140, "")
      ).to.be.revertedWith("Category cannot be empty");
    });

    it("Should allow 0kg weight (bodyweight exercises)", async function () {
      await expect(
        repTrack.connect(user1).recordWorkout("Pull-ups", 4, 12, 0, "Back")
      ).to.not.be.reverted;

      const workout = await repTrack.getWorkout(1);
      expect(workout.weightKg).to.equal(0);
    });
  });

  describe("Retrieve Workout Records & Statistics", function () {
    beforeEach(async function () {
      await repTrack.connect(user1).recordWorkout("Bench Press", 4, 10, 80, "Chest");
      await repTrack.connect(user1).recordWorkout("Incline Dumbbell Press", 3, 12, 30, "Chest");
      await repTrack.connect(user2).recordWorkout("Barbell Squat", 5, 5, 120, "Legs");
    });

    it("Should correctly report total active workouts", async function () {
      expect(await repTrack.getTotalWorkouts()).to.equal(3);
    });

    it("Should return all active workout IDs", async function () {
      const ids = await repTrack.getAllWorkoutIds();
      expect(ids.map((id) => Number(id))).to.deep.equal([1, 2, 3]);
    });

    it("Should return all workouts list", async function () {
      const workouts = await repTrack.getAllWorkouts();
      expect(workouts.length).to.equal(3);
      expect(workouts[0].exerciseName).to.equal("Bench Press");
      expect(workouts[1].exerciseName).to.equal("Incline Dumbbell Press");
      expect(workouts[2].exerciseName).to.equal("Barbell Squat");
    });

    it("Should return correct user-specific workout count and history", async function () {
      expect(await repTrack.getUserWorkoutCount(user1.address)).to.equal(2);
      expect(await repTrack.getUserWorkoutCount(user2.address)).to.equal(1);
      expect(await repTrack.getUserWorkoutCount(owner.address)).to.equal(0);

      const user1Workouts = await repTrack.getUserWorkouts(user1.address);
      expect(user1Workouts.length).to.equal(2);
      expect(user1Workouts[0].exerciseName).to.equal("Bench Press");
      expect(user1Workouts[1].exerciseName).to.equal("Incline Dumbbell Press");

      const user2Workouts = await repTrack.getUserWorkouts(user2.address);
      expect(user2Workouts.length).to.equal(1);
      expect(user2Workouts[0].exerciseName).to.equal("Barbell Squat");
    });

    it("Should get workout by ID", async function () {
      const workout = await repTrack.getWorkout(2);
      expect(workout.exerciseName).to.equal("Incline Dumbbell Press");
      expect(workout.author).to.equal(user1.address);
    });

    it("Should reject getWorkout with invalid ID", async function () {
      await expect(repTrack.getWorkout(0)).to.be.revertedWith("Invalid workout ID");
      await expect(repTrack.getWorkout(99)).to.be.revertedWith("Invalid workout ID");
    });
  });

  describe("Remove Workout Records", function () {
    beforeEach(async function () {
      await repTrack.connect(user1).recordWorkout("Deadlift", 3, 5, 140, "Back");
      await repTrack.connect(user2).recordWorkout("Overhead Press", 4, 8, 50, "Shoulders");
    });

    it("Should allow author to remove their own workout and emit WorkoutRemoved", async function () {
      const tx = await repTrack.connect(user1).removeWorkout(1);

      await expect(tx)
        .to.emit(repTrack, "WorkoutRemoved")
        .withArgs(1, user1.address, (await ethers.provider.getBlock("latest"))?.timestamp);

      expect(await repTrack.getTotalWorkouts()).to.equal(1);
      expect(await repTrack.getUserWorkoutCount(user1.address)).to.equal(0);

      const activeIds = await repTrack.getAllWorkoutIds();
      expect(activeIds.map((id) => Number(id))).to.deep.equal([2]);

      const allActive = await repTrack.getAllWorkouts();
      expect(allActive.length).to.equal(1);
      expect(allActive[0].id).to.equal(2);
    });

    it("Should prevent unauthorized users from removing someone else's workout", async function () {
      await expect(
        repTrack.connect(user2).removeWorkout(1)
      ).to.be.revertedWith("Unauthorized: only the author can remove this workout");

      // Verify record is still intact
      expect(await repTrack.getTotalWorkouts()).to.equal(2);
    });

    it("Should reject removing non-existent or zero ID", async function () {
      await expect(repTrack.connect(user1).removeWorkout(0)).to.be.revertedWith(
        "Invalid workout ID"
      );
      await expect(repTrack.connect(user1).removeWorkout(999)).to.be.revertedWith(
        "Invalid workout ID"
      );
    });

    it("Should reject removing an already removed workout", async function () {
      await repTrack.connect(user1).removeWorkout(1);

      await expect(
        repTrack.connect(user1).removeWorkout(1)
      ).to.be.revertedWith("Workout does not exist or has already been removed");
    });

    it("Should reject getWorkout for a removed workout", async function () {
      await repTrack.connect(user1).removeWorkout(1);
      await expect(repTrack.getWorkout(1)).to.be.revertedWith("Workout has been removed");
    });
  });
});

