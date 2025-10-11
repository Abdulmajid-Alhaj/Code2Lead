const mongoose = require('mongoose'); // استدعاء مكتبة mongoose

// تعريف سكيمه (مخطط) لجدول ملاحظات المدرب
const instructorNotesSchema = new mongoose.Schema({

  // معرف المدرب اللي كتب الملاحظة
  trainer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trainer', // اسم موديل المدرب (لو عندك موديل باسم Trainer)
    required: true
  },

  // معرف الطالب اللي تخصه الملاحظة
  student_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },

  // معرف الكورس المرتبط بالملاحظة
  course_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },

  // نص الملاحظة نفسها
  note: {
    type: String,
    required: true
  },

  // الوسوم أو الكلمات المفتاحية للملاحظة (ممكن تكون Array of strings)
  tags: {
    type: [String], // مصفوفة من النصوص
    default: [] // افتراضيًا فاضية
  },

  // تاريخ إنشاء الملاحظة
  createdAt: {
    type: Date,
    default: Date.now
  },

  // تاريخ آخر تعديل للملاحظة
  updatedAt: {
    type: Date,
    default: Date.now
  }

});

// تصدير الموديل لاستخدامه في باقي أجزاء المشروع
module.exports = mongoose.model('InstructorNote', instructorNotesSchema);
