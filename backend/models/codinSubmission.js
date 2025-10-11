import mongoose from "mongoose";

const codingSubmissionSchema = new mongoose.Schema({
  codingId: {
    type: mongoose.Schema.Types.ObjectId, // معرّف التمرين البرمجي الأساسي (بيربط التقديم مع تحدي الكود)
    ref: "Coding",
    required: true,
  },
  exerciseId: {
    type: mongoose.Schema.Types.ObjectId, // معرّف التمرين الفرعي إذا كان في أكثر من تمرين ضمن الدرس
    ref: "Exercise",
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId, // المعرّف الخاص بالطالب اللي قدّم الحل
    ref: "User",
    required: true,
  },
  code: {
    type: String, // الكود اللي كتبه الطالب أثناء الحل
    required: true,
  },
  score: {
    type: Number, // العلامة اللي حصل عليها الطالب بعد التقييم
    default: 0,
  },
  attemptNumber: {
    type: Number, // رقم المحاولة (أول محاولة، ثانية، وهكذا)
    required: true,
  },
  createdAt: {
    type: Date, // تاريخ إنشاء التقديم
    default: Date.now,
  },
  updatedAt: {
    type: Date, // تاريخ آخر تعديل على التقديم
    default: Date.now,
  },
});

// تصدير المودل لاستخدامه في باقي أجزاء المشروع (الكونترولر، السيرفس...)
export default mongoose.model("CodingSubmission", codingSubmissionSchema);
