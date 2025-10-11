import mongoose from "mongoose";

const quizAttemptSchema = new mongoose.Schema({
  // الكويز الذي أجاب عليه الطالب
  quiz_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Quiz",
    required: true
  },

  exerciseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Exercise",
  },

  // الطالب الذي قام بالمحاولة
  student_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  // قائمة بالإجابات التي أدخلها الطالب
  answers: [{
    // معرف السؤال الذي تمت الإجابة عليه
    question_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "QuizQuestion",
      required: true
    },

    // الإجابة التي اختارها الطالب
    selectedAnswer: {
      type: String,
      required: true
    },

    // هل كانت الإجابة صحيحة أم لا
    isCorrect: {
      type: Boolean,
      default: false
    }
  }],

  // العلامة التي حصل عليها الطالب فعلاً
  score: {
    type: Number,
    default: 0
  },

  // العلامة الكاملة للكويز (الحد الأقصى)
  maxScore: {
    type: Number,
    default: 0
  }

  // نحتاج فقط createdAt بدون updatedAt
}, { timestamps: { createdAt: true, updatedAt: false } });

export default mongoose.model("QuizAttempt", quizAttemptSchema);
