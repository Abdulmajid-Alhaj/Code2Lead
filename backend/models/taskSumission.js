const mongoose = require('mongoose'); // استدعاء مكتبة mongoose للتعامل مع MongoDB

// تعريف سكيمه (مخطط) لتخزين بيانات تسليم المهام
const taskSubmissionSchema = new mongoose.Schema({
  
  // معرف الطالب اللي سلم المهمة - مرتبط بجدول الطلاب
  student_id: {
    type: mongoose.Schema.Types.ObjectId, // نوعه ObjectId لأنه رابط بجدول ثاني
    ref: 'Student', // اسم الموديل المرتبط (عشان نقدر نعمل populate)
    required: true // لازم يكون موجود (إجباري)
  },

  // الدرجة اللي حصل عليها الطالب في هذه المهمة
  Grade: {
    type: Number, // نوعه رقم
    default: null // افتراضيًا مافيه قيمة
  },

  // معرف المهمة نفسها - مرتبط بجدول المهام
  task_id: {
    type: mongoose.Schema.Types.ObjectId, // نوعه ObjectId
    ref: 'Task', // اسم الموديل المرتبط
    required: true // إجباري
  },

  // مسار أو رابط الملف المرفوع (مثلاً PDF أو صورة)
  File: {
    type: String, // رابط أو اسم الملف
    required: true // لازم يكون موجود
  },

  // حالة التسليم: قيد الانتظار، تم التسليم، تم التقييم
  status: {
    type: String,
    enum: ['pending', 'submitted', 'graded'], // قيم محددة للحالة
    default: 'pending' // القيمة الافتراضية هي "pending"
  },

  // ملاحظات أو تعليقات من المعلم على التسليم
  feedback: {
    type: String,
    default: '' // افتراضيًا مافيه تعليق
  },

  // تاريخ إنشاء السجل
  createdAt: {
    type: Date,
    default: Date.now // افتراضيًا التاريخ الحالي
  },

  // تاريخ آخر تعديل على السجل
  updatedAt: {
    type: Date,
    default: Date.now // افتراضيًا التاريخ الحالي
  }

});

// تصدير الموديل للاستعمال في باقي المشروع
module.exports = mongoose.model('TaskSubmission', taskSubmissionSchema);
