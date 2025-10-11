import mongoose from "mongoose";

const codingSchema = new mongoose.Schema({
  // الدرس الذي ينتمي له هذا التمرين البرمجي
  lesson_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Lesson",
    required: true
  },

  // عنوان التحدي البرمجي
  title: {
    type: String,
    required: true,
    trim: true
  },

  // وصف التحدي البرمجي (شرح المطلوب)
  description: {
    type: String,
    trim: true
  },

  // الكود المبدئي الذي يبدأ منه الطالب
  starterCode: {
    type: String,
    default: ""
  },

  // المدخل الذي سيتم استخدامه لاختبار كود الطالب
  input: {
    type: String,
    default: ""
  },

  // الناتج المتوقع من الحل الصحيح
  expectedOutput: {
    type: String,
    required: true
  },

  // الحد الأقصى لعدد المحاولات المسموح بها
  maxAttempt: {
    type: Number,
    default: 3
  },

  // المستخدم الذي أنشأ التحدي (عادة المدرّس)
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }

// timestamps يضيف تلقائياً createdAt و updatedAt
}, { timestamps: true });

export default mongoose.model("Coding", codingSchema);
