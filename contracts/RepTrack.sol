// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title RepTrack
 * @dev Decentralized workout-tracking smart contract for recording fitness sessions on-chain.
 */
contract RepTrack {
    struct Workout {
        uint256 id;
        address author;
        string exerciseName;
        uint256 sets;
        uint256 reps;
        uint256 weightKg;
        string category;
        uint256 timestamp;
        bool isActive;
    }

    // Workout counter for unique IDs
    uint256 private _workoutIdCounter;

    // Total active workouts currently stored
    uint256 private _activeWorkoutCount;

    // Mapping from workout ID to Workout struct
    mapping(uint256 => Workout) private _workouts;

    // Mapping from user address to their list of workout IDs
    mapping(address => uint256[]) private _userWorkoutIds;

    // Array of all active workout IDs
    uint256[] private _allActiveWorkoutIds;

    // Mapping to track index in _allActiveWorkoutIds for O(1) removal
    mapping(uint256 => uint256) private _allActiveWorkoutIndex;

    // Events
    event WorkoutRecorded(
        uint256 indexed id,
        address indexed author,
        string exerciseName,
        uint256 sets,
        uint256 reps,
        uint256 weightKg,
        string category,
        uint256 timestamp
    );

    event WorkoutRemoved(
        uint256 indexed id,
        address indexed author,
        uint256 timestamp
    );

    /**
     * @notice Records a new workout session.
     * @param exerciseName Name of the exercise performed.
     * @param sets Number of sets performed (must be > 0).
     * @param reps Number of repetitions performed (must be > 0).
     * @param weightKg Weight used in kilograms.
     * @param category Workout muscle or activity category.
     * @return The unique ID of the recorded workout.
     */
    function recordWorkout(
        string calldata exerciseName,
        uint256 sets,
        uint256 reps,
        uint256 weightKg,
        string calldata category
    ) external returns (uint256) {
        require(bytes(exerciseName).length > 0, "Exercise name cannot be empty");
        require(sets > 0, "Sets must be greater than zero");
        require(reps > 0, "Repetitions must be greater than zero");
        require(bytes(category).length > 0, "Category cannot be empty");

        _workoutIdCounter++;
        uint256 newId = _workoutIdCounter;

        Workout memory newWorkout = Workout({
            id: newId,
            author: msg.sender,
            exerciseName: exerciseName,
            sets: sets,
            reps: reps,
            weightKg: weightKg,
            category: category,
            timestamp: block.timestamp,
            isActive: true
        });

        _workouts[newId] = newWorkout;
        _userWorkoutIds[msg.sender].push(newId);

        _allActiveWorkoutIndex[newId] = _allActiveWorkoutIds.length;
        _allActiveWorkoutIds.push(newId);
        _activeWorkoutCount++;

        emit WorkoutRecorded(
            newId,
            msg.sender,
            exerciseName,
            sets,
            reps,
            weightKg,
            category,
            block.timestamp
        );

        return newId;
    }

    /**
     * @notice Removes a workout record by its ID. Only the original author can remove it.
     * @param id The ID of the workout to remove.
     */
    function removeWorkout(uint256 id) external {
        require(id > 0 && id <= _workoutIdCounter, "Invalid workout ID");
        Workout storage workout = _workouts[id];
        require(workout.isActive, "Workout does not exist or has already been removed");
        require(workout.author == msg.sender, "Unauthorized: only the author can remove this workout");

        workout.isActive = false;
        _activeWorkoutCount--;

        // Remove from _allActiveWorkoutIds array using swap and pop
        uint256 indexToRemove = _allActiveWorkoutIndex[id];
        uint256 lastIndex = _allActiveWorkoutIds.length - 1;

        if (indexToRemove != lastIndex) {
            uint256 lastId = _allActiveWorkoutIds[lastIndex];
            _allActiveWorkoutIds[indexToRemove] = lastId;
            _allActiveWorkoutIndex[lastId] = indexToRemove;
        }
        _allActiveWorkoutIds.pop();
        delete _allActiveWorkoutIndex[id];

        emit WorkoutRemoved(id, msg.sender, block.timestamp);
    }

    /**
     * @notice Returns the details of a single workout by ID.
     * @param id The ID of the workout.
     */
    function getWorkout(uint256 id) external view returns (Workout memory) {
        require(id > 0 && id <= _workoutIdCounter, "Invalid workout ID");
        Workout memory workout = _workouts[id];
        require(workout.isActive, "Workout has been removed");
        return workout;
    }

    /**
     * @notice Returns total number of active workouts currently stored on-chain.
     */
    function getTotalWorkouts() external view returns (uint256) {
        return _activeWorkoutCount;
    }

    /**
     * @notice Returns all active workout IDs.
     */
    function getAllWorkoutIds() external view returns (uint256[] memory) {
        return _allActiveWorkoutIds;
    }

    /**
     * @notice Returns all active workouts recorded on-chain.
     */
    function getAllWorkouts() external view returns (Workout[] memory) {
        uint256 total = _allActiveWorkoutIds.length;
        Workout[] memory result = new Workout[](total);

        for (uint256 i = 0; i < total; i++) {
            result[i] = _workouts[_allActiveWorkoutIds[i]];
        }
        return result;
    }

    /**
     * @notice Returns total number of active workouts recorded by a particular user address.
     * @param user The wallet address of the user.
     */
    function getUserWorkoutCount(address user) external view returns (uint256) {
        uint256 count = 0;
        uint256[] memory ids = _userWorkoutIds[user];
        for (uint256 i = 0; i < ids.length; i++) {
            if (_workouts[ids[i]].isActive) {
                count++;
            }
        }
        return count;
    }

    /**
     * @notice Returns all active workouts recorded by a particular user address.
     * @param user The wallet address of the user.
     */
    function getUserWorkouts(address user) external view returns (Workout[] memory) {
        uint256[] storage ids = _userWorkoutIds[user];
        uint256 count = 0;
        for (uint256 i = 0; i < ids.length; i++) {
            if (_workouts[ids[i]].isActive) {
                count++;
            }
        }

        Workout[] memory result = new Workout[](count);
        uint256 currentIndex = 0;
        for (uint256 i = 0; i < ids.length; i++) {
            if (_workouts[ids[i]].isActive) {
                result[currentIndex] = _workouts[ids[i]];
                currentIndex++;
            }
        }
        return result;
    }
}

