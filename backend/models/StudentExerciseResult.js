const mongoose = require("mongoose");

const StudentExerciseResultSchema = new mongoose.Schema(
    {
        // Reference to the exercise this result belongs to
        exerciseId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Exercise",
            required: true,
        },

        // Reference to the student who completed the exercise
        studentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User", 
            required: true,
        },

        // The score or grade the student achieved on this exercise
        score: {
            type: Number,
            required: true,
            min: 0, 
        },
    },
    {
        timestamps: true,
    }
);

const studentExerciseResult = mongoose.model("StudentExerciseResult", StudentExerciseResultSchema);
export default studentExerciseResult;