import mongoose from "mongoose";

const quizQuestionSchema = new mongoose.Schema({
  // الكويز الذي ينتمي له هذا السؤال
  quiz_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Quiz",
    required: true
  },

  // نوع السؤال (اختياري، صح/خطأ، إجابة قصيرة...)
  type: {
    type: String,
    enum: ["multiple_choice", "true_false", "short_answer"],
    required: true
  },

  // نص السؤال نفسه
  question: {
    type: String,
    required: true,
    trim: true
  },

  // الخيارات المحتملة (في حال كان السؤال اختياري)
  choices: [{
    type: String,
    trim: true
  }],

  // الجواب الصحيح
  correctAnswer: {
    type: String,
    required: true
  },

  // عدد النقاط المخصصة لهذا السؤال
  points: {
    type: Number,
    default: 1
  },

  // شرح للإجابة الصحيحة يظهر بعد التصحيح
  explanation: {
    type: String,
    trim: true
  }

  // timestamps يضيف createdAt و updatedAt
}, { timestamps: true });

export default mongoose.model("QuizQuestion", quizQuestionSchema);
