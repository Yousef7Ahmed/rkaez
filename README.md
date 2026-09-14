# Rakaez CMS — MongoDB Atlas + Cloudinary + Render

نسخة Production من موقع ركائز الإعمار مع لوحة تحكم لإدارة المشاريع وملفات PDF.

## المعمارية
- Render: الموقع + Node.js/Express + Admin + API في Service واحدة.
- MongoDB Atlas: تخزين بيانات المشاريع والملفات والمستخدم الأدمن.
- Cloudinary: تخزين صور المشاريع وملفات PDF بشكل دائم.
- لا يتم الاعتماد على `uploads/` المحلي لتخزين الملفات المرفوعة.

## 1) MongoDB Atlas
أنشئ Database باسم `rakaez`، ثم انسخ Connection String إلى `MONGODB_URI`.

## 2) Cloudinary
من لوحة Cloudinary خذ:
- Cloud Name
- API Key
- API Secret

ضعهم في `.env` أو Environment Variables في Render.

## 3) التشغيل المحلي
```bash
npm install
```
انسخ `.env.example` إلى `.env` وعدّل القيم، ثم:
```bash
npm run seed
npm start
```

الموقع: `http://localhost:3000`
لوحة التحكم: `http://localhost:3000/admin`

## 4) Render
ارفع المشروع إلى GitHub ثم أنشئ Web Service على Render.

Build Command:
```bash
npm install
```

Start Command:
```bash
npm start
```

أضف Environment Variables:
- `NODE_ENV=production`
- `MONGODB_URI`
- `SESSION_SECRET`
- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

بعد أول Deploy، شغّل `npm run seed` مرة واحدة من Shell في Render إذا كانت البيانات الأساسية غير موجودة.

## ملاحظة عن الأصول القديمة
الـ ZIP الأصلي لا يحتوي مجلد `assets`. انسخ مجلد `assets` الأصلي إلى `public/assets` قبل رفع المشروع، حتى تظهر صور وفيديو وملفات PDF القديمة.

المشاريع/الـPDFs الجديدة التي ترفعها من لوحة التحكم يتم تخزينها على Cloudinary، وتُحفظ روابطها في MongoDB.
