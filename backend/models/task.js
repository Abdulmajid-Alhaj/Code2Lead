import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId, // معرّف المستخدم اللي أنشأ أو تم تعيين المهمة له
    ref: "User",
    required: true,
  },
  title: {
    type: String, // عنوان المهمة (مثلاً: "تسليم واجب البرمجة")
    required: true,
  },
  description: {
    type: String, // وصف تفصيلي للمهمة أو التعليمات المتعلقة بها
  },
  difficulty: {
    type: String, // مستوى صعوبة المهمة (مثلاً: "سهل" - "متوسط" - "صعب")
    enum: ["easy", "medium", "hard"], // نحدد القيم المسموح بها فقط
    default: "medium",
  },
  dueDate: {
    type: Date, // الموعد النهائي لتسليم المهمة
  },
  allowedFileTypes: {
    type: [String], // أنواع الملفات المسموح برفعها (مثلاً: ["pdf", "zip", "docx"])
  },
  createdAt: {
    type: Date, // تاريخ إنشاء المهمة
    default: Date.now,
  },
  updatedAt: {
    type: Date, // تاريخ آخر تعديل على المهمة
    default: Date.now,
  },
});

// تصدير المودل لاستخدامه في باقي المشروع (التحكم بالمهمات)
export default mongoose.model("Task", taskSchema);
