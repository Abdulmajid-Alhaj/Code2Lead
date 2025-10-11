import mongoose from "mongoose";

const quizSchema = new mongoose.Schema({
  // الدرس الذي يتبع له هذا الكويز
  lesson_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Lesson",
    required: true
  },

  // ترتيب الأسئلة في هذا الكويز (مصفوفة من IDs)
  questionsOrder: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Question"
  }],

  // المستخدم الذي أنشأ الكويز (عادة المدرّس)
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  // عنوان الكويز (مثلاً: "Quiz 1 – HTML Basics")
  title: {
    type: String,
    required: true,
    trim: true
  },

  // وصف أو ملاحظات إضافية للكويز
  description: {
    type: String,
    trim: true
  }

  // timestamps يضيف تلقائياً createdAt و updatedAt
}, { timestamps: true });

export default mongoose.model("Quiz", quizSchema);
