توثيق الخادم (Server)

نظرة عامة
---------
هذا المستند يشرح بنية الكود الخلفي (backend)، أسماء الملفات، مسؤولياتها، وكيفية ارتباط كل جزء بنمط التصميم MVC المستخدم في المشروع. كما يغطي المصطلحات التجارية (Business terminology)، كيفية اختبار الـ Routes باستخدام Postman، ونصائح استكشاف الأخطاء وإصلاحها.

الهيكل العام (MVC)
------------------
رغم أن تطبيقات Node/Express لا تتطابق تمامًا مع MVC في أطر العرض التقليدية، فقد نظّم المشروع بحيث يمكن التفكير به وفق MVC:

- النماذج (Models)
  - المسار: `server/models/`.
  - تعريف مخططات Mongoose وقواعد التحقق للبيانات المخزنة في قاعدة البيانات (مثل المستخدمين).
  - مثال: `User.js` يعرّف الحقول: `name`, `username`, `email`, `password`, `role`.

- العرض (Views)
  - في خوادم الـ API العرض هو استجابات JSON المرسلة للعميل؛ لا توجد قوالب HTML في هذا المشروع الخلفي.
  - واجهة المستخدم موجودة في المجلد `front/`.

- المتحكمات (Controllers)
  - المسار: `server/controllers/`.
  - تستقبل الطلبات، تتحقق من المدخلات، تستدعي الخدمات (services)، وتعيد JSON.
  - مثال: `authController.js` يتعامل مع التسجيل، تسجيل الدخول، وإنشاء مستخدم بواسطة الأدمن.

- الخدمات (Services)
  - المسار: `server/services/`.
  - تحتوي على منطق العمل (business logic) والتعامل مع قاعدة البيانات. تستدعيها المتحكمات.
  - مثال: `authService.js` يحتوي دوال `createAdmin`, `adminCreateUser`, و `login`.

- الراوترز (Routes)
  - المسار: `server/routes/`.
  - تربط عناوين الـ HTTP (endpoints) بدوال المتحكمات وتطبّق الـ middleware مثل التحقق والتفويض.
  - مثال: `routes/auth.js` يربط `/api/auth/login`, `/api/auth/admin`, و `/api/auth/users`.

- الـ Middleware
  - المسار: `server/middleware/`.
  - منطق يعاد استخدامه قبل الوصول للمتحكمات: المصادقة (`auth.js`)، تحليل الطلبات، والمتحققن (`validators/auth.js`).

الملفات الأساسية ومسؤولياتها
-----------------------------
- `server/index.js`
  - تهيئة التطبيق: تحميل المتغيرات البيئية، الاتصال بقاعدة البيانات، تطبيق middleware عامة (JSON parsing, cookie parser, CORS)، تركيب الراوترز، وتشغيل السيرفر.

- `server/config/database.js`
  - يتصل بـ MongoDB عبر `mongoose.connect(process.env.MONGODB_URI, ...)`.

- `server/models/User.js`
  - مخطط Mongoose للمستخدم (User). الحقول المهمة:
    - `name` (نص، مطلوب)
    - `username` (نص، مطلوب، فريد، صغير الأحرف)
    - `email` (نص، مطلوب، فريد)
    - `password` (نص، مطلوب)
    - `role` (نص، قيم مسموحة: 'user', 'trainer', 'admin')
  - قبل الحفظ (`pre('save')`) يتم تشفير كلمة المرور بـ bcrypt عند الإنشاء أو التعديل.
  - دالة مثيل `comparePassword` لمقارنة كلمة المرور النصية بالمخزنة (المشفرة).

- `server/validators/auth.js`
  - التحقق من مدخلات الـ API باستخدام `express-validator`. يصدِر `validateCreateAdmin`, `validateLogin`, و `validateAdminCreateUser`.

- `server/controllers/authController.js`
  - دوال المتحكم:
    - `createAdmin(req, res)` - يتحقق من المدخلات وينادي `authService.createAdmin`.
    - `login(req, res)` - يتحقق، ينادي `authService.login`، ويضع كوكي JWT.
    - `adminCreateUser(req, res)` - خاص بالأدمن: يتحقق وينادي `authService.adminCreateUser`.
    - `logout(req, res)` - يمسح الكوكي.
  - يستخدم `buildCookieOptions()` لتخصيص إعدادات الكوكي اعتمادًا على المتغيرات البيئية.

- `server/services/authService.js`
  - منطق العمل والتعامل مع قاعدة البيانات لعمليات المصادقة:
  - `createAdmin` - تنظيف وتحويل الاسم واسم المستخدم والإيميل، التحقق من التفرّد، وإنشاء مستخدم بدور 'admin'.
  - `login` - البحث عن المستخدم بالإيميل، مقارنة كلمة المرور، وإنشاء JWT.
  - `adminCreateUser` - مسار الأدمن لإنشاء مستخدم أو مدرب: التحقق من التفرّد، إنشاء المستخدم.

- `server/routes/auth.js`
  - تعريف المسارات وربطها بالمتحكمات والـ middleware:
  - POST `/admin` -> `validateCreateAdmin`, `createAdmin`
  - POST `/login` -> `validateLogin`, `login`
  - POST `/users` -> `authenticate`, `authorize('admin')`, `validateAdminCreateUser`, `adminCreateUser`

- `server/middleware/auth.js`
  - `authenticate(req, res, next)` يقرأ التوكن من هيدر `Authorization` أو من الكوكي، يتحقق من JWT، ويضع `req.user = { id, role }`.
  - `authorize(...allowedRoles)` يتحقق من دور المستخدم للسماح بالوصول فقط للأدوار المصرح بها.

المصطلحات التجارية (Business terminology)
-----------------------------------------
- Admin: مستخدم بدور `admin` لديه صلاحية إنشاء مستخدمين آخرين (users أو trainers).
- Trainer: مستخدم بدور `trainer` قد يحصل على صلاحيات إضافية لاحقًا.
- User: مستخدم عادي بدور `user`.
- JWT / Auth token: توكن موقع رقميًا يحتوي معرف المستخدم والدور؛ يستخدم للمصادقة.
- Cookie-based vs Bearer token: السيرفر يضع كوكي HTTP-only بعد تسجيل الدخول أو يمكن استخدام هيدر `Authorization: Bearer <token>`.

سير الطلب (مثال: الأدمن ينشئ مستخدمًا)
--------------------------------------
1. يرسل العميل POST `/api/auth/users` مع الجسم `{ name, username, email, password, role }`.
2. في `routes/auth.js` تُطبق الوسائط: `authenticate` (يُحقق JWT)، `authorize('admin')` (يتحقق الدور)، ثم التحقق `validateAdminCreateUser`.
3. في `authController.adminCreateUser` يتم فحص المدخلات ثم ينادي `authService.adminCreateUser`.
4. في `authService.adminCreateUser` يتم تنظيف الاسم واسم المستخدم والإيميل، التحقق من عدم التكرار، وإنشاء مستند `User` في MongoDB.
5. يعيد المتحكم استجابة 201 وبها بيانات المستخدم المنشأ.

كيفية الاختبار باستخدام Postman
-------------------------------
أ. إنشاء أدمن (إذا لم يكن موجودًا مسبقًا):
- POST http://localhost:5000/api/auth/admin
- Body (raw JSON):
  {
    "name": "Admin One",
    "username": "admin1",
    "email": "admin1@example.com",
    "password": "adminpass"
  }
- المتوقع: 201 وإرجاع بيانات الأدمن المنشأ.

ب. تسجيل الدخول كأدمن:
- POST http://localhost:5000/api/auth/login
- Body (JSON): { "email": "admin1@example.com", "password": "adminpass" }
- المتوقع: 200 ووجود كوكي باسم `token` أو JSON يتضمن التوكن.
- إذا وُضع الكوكي: سيخزنه Postman في Cookie Jar تلقائيًا (تأكد من تفعيل Cookies في Postman).
- إذا رجع التوكن في JSON: انسخه واستخدمه في الطلبات التالية في هيدر `Authorization: Bearer <token>`.

ج. الأدمن ينشئ مستخدمًا:
- POST http://localhost:5000/api/auth/users
- Headers: إما كوكي المصادقة أو `Authorization: Bearer <token>`
- Body (JSON):
  {
    "name": "John Doe",
    "username": "johndoe_001",
    "email": "john001@example.com",
    "password": "12345678",
    "role": "user"
  }
- المتوقع: 201 وإرجاع بيانات المستخدم؛ أو خطأ 409 إذا كان البريد/اسم المستخدم مستخدمًا؛ أو 401/403 إذا كانت المصادقة/الصلاحية مفقودة.

مشاكل شائعة وحلولها
--------------------
- "Path `username` is required": يعني أن حقل `username` مفقود أو فارغ. تأكد من إرسال `username` صالح في جسم الطلب وأن الـ validator يعمل.
- "Invalid credentials": تحقق أن الإيميل موجود في القاعدة وأن كلمة المرور صحيحة. تذكّر أن كلمة المرور مخزنة مشفرة؛ أرسل النص العادي عند تسجيل الدخول.
- الكوكي لا يُرسل/يُستقبل: تأكد من إعدادات CORS (`credentials: true`) وأن العميل يرسل الاعتمادات (في المتصفح استخدم `fetch(..., { credentials: 'include' })`).

ملاحظات أمنيّة
---------------
- لا تستورد كلمات مرور نصية إلى قاعدة البيانات؛ استعمل دائمًا هاش bcrypt.
- استخدم قيمة قوية وخصوصية لـ JWT_SECRET في الإنتاج.
- خيارات الكوكي: `secure: true` و `sameSite: 'None'` للكوكيز عبر النطاقات على HTTPS.

الخطوات التالية الممكن تنفيذها
-------------------------------
- أستطيع إضافة سكربت اختبار آلي Node.js يقوم بإنشاء أدمن → تسجيل الدخول → إنشاء مستخدم، ويتحقق من النتائج. سيحتاج ملف `.env` مع `MONGODB_URI` و `JWT_SECRET`.
- أو أستطيع حذف ملفات غير مستخدمة إذا أخبرتني أي ملفات تريد حذفها.

هل تريد أن أنشئ سكربت الاختبار الآن؟ إذا أردت ذلك، سأضعه في `server/tests/` وأشغّله محليًا (يحتاج عنوان MongoDB في المتغيرات البيئية).