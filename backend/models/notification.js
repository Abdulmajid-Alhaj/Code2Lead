const mongoose = require('mongoose'); // استدعاء مكتبة Mongoose

// تعريف سكيمة الإشعارات
const notificationSchema = new mongoose.Schema({

  // معرف المستخدم اللي بيستلم الإشعار
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // اسم موديل المستخدم
    required: true
  },

  // نوع الإشعار (مثلاً: تنبيه، تذكير، إشعار سيستم، ... إلخ)
  type: {
    type: String,
    required: true
  },

  // بيانات الإشعار (محتوى إضافي حسب نوع الإشعار)
  payload: {
    type: mongoose.Schema.Types.Mixed, // يسمح بأي نوع من البيانات (نص، كائن، رقم...)
    required: true
  },

  // توقيت إرسال الإشعار المجدول (مستقبلي)
  scheduledAt: {
    type: Date,
    default: null
  },

  // تاريخ إنشاء الإشعار
  createdAt: {
    type: Date,
    default: Date.now
  },

  // تاريخ آخر تعديل للإشعار
  updatedAt: {
    type: Date,
    default: Date.now
  }

});

// تصدير الموديل لاستخدامه في باقي المشروع
module.exports = mongoose.model('Notification', notificationSchema);
