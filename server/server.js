require("dotenv").config();
const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const bcrypt = require("bcryptjs");
const helmet = require("helmet");
const multer = require("multer");
const { v2: cloudinary } = require("cloudinary");
const Admin = require("./models/Admin");
const Project = require("./models/Project");
const PdfFile = require("./models/PdfFile");

const app = express();
const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === "production";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

if (isProduction) app.set("trust proxy", 1);
app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.SESSION_SECRET || "dev-secret-change-me",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: isProduction,
      maxAge: 86400000,
    },
  }),
);
app.use(express.static(path.join(__dirname, "..", "public")));

const imageUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024, files: 30 },
  fileFilter: (_, f, cb) =>
    cb(null, /^image\/(jpeg|png|webp|avif)$/.test(f.mimetype)),
});
const pdfUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 30 * 1024 * 1024, files: 1 },
  fileFilter: (_, f, cb) => cb(null, f.mimetype === "application/pdf"),
});

function requireCloudinary() {
  const ok =
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET;
  if (!ok)
    throw new Error(
      "Cloudinary غير مضبوط. أضف CLOUDINARY_CLOUD_NAME و CLOUDINARY_API_KEY و CLOUDINARY_API_SECRET.",
    );
}
function uploadBuffer(buffer, options = {}) {
  requireCloudinary();
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(options, (err, result) =>
      err ? reject(err) : resolve(result),
    );
    stream.end(buffer);
  });
}
async function destroyCloudinary(url) {
  if (!url || !url.includes("res.cloudinary.com")) return;
  try {
    const m = url.match(/\/upload\/(?:v\d+\/)?(.+)$/);
    if (!m) return;
    let publicId = m[1].replace(/\.[^/.]+$/, "");
    await cloudinary.uploader.destroy(publicId, {
      resource_type: "image",
      invalidate: true,
    });
  } catch (e) {
    console.warn("Cloudinary image delete failed:", e.message);
  }
}
async function destroyPdf(url) {
  if (!url || !url.includes("res.cloudinary.com")) return;
  try {
    const m = url.match(/\/upload\/(?:v\d+\/)?(.+)$/);
    if (!m) return;
    const publicId = m[1].replace(/\.[^/.]+$/, "");
    await cloudinary.uploader.destroy(publicId, {
      resource_type: "raw",
      invalidate: true,
    });
  } catch (e) {
    console.warn("Cloudinary PDF delete failed:", e.message);
  }
}

const auth = (req, res, next) =>
  req.session.admin ? next() : res.status(401).json({ error: "Unauthorized" });

app.post("/api/auth/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const a = await Admin.findOne({ username });
    if (!a || !(await bcrypt.compare(password, a.passwordHash)))
      return res.status(401).json({ error: "بيانات الدخول غير صحيحة" });
    req.session.admin = { id: String(a._id), username: a.username };
    res.json({ ok: true, username: a.username });
  } catch (e) {
    res.status(500).json({ error: "حدث خطأ في تسجيل الدخول" });
  }
});
app.post("/api/auth/logout", (req, res) =>
  req.session.destroy(() => res.json({ ok: true })),
);
app.get("/api/auth/me", (req, res) =>
  res.json({
    authenticated: !!req.session.admin,
    username: req.session.admin?.username || null,
  }),
);

app.get("/api/projects", async (req, res) => {
  try {
    res.json(await Project.find().sort({ section: 1, order: 1, createdAt: 1 }));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
app.get("/api/projects/:section", async (req, res) => {
  try {
    res.json(
      await Project.find({ section: req.params.section }).sort({
        order: 1,
        createdAt: 1,
      }),
    );
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
app.get("/api/pdfs", async (req, res) => {
  try {
    res.json(await PdfFile.find().sort({ order: 1, createdAt: 1 }));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post(
  "/api/admin/projects",
  auth,
  imageUpload.array("images", 30),
  async (req, res) => {
    try {
      const b = req.body;
      const images = [];
      for (let i = 0; i < (req.files || []).length; i++) {
        const r = await uploadBuffer(req.files[i].buffer, {
          folder: "rakaez/projects",
          resource_type: "image",
          use_filename: false,
        });
        images.push({
          path: r.secure_url,
          sortOrder: i,
          publicId: r.public_id,
        });
      }
      const p = await Project.create({
        ...b,
        year: b.year ? Number(b.year) : undefined,
        order: b.order ? Number(b.order) : 0,
        images,
        coverImage: images[0]?.path || b.coverImage,
      });
      res.json(p);
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  },
);

/* الحقول النصية المسموح بتعديلها فقط — يمنع الكتابة على images/_id/timestamps */
const PROJECT_TEXT_FIELDS = [
  "section",
  "title",
  "subtitle",
  "description",
  "status",
  "landArea",
  "builtArea",
  "rooms",
  "video",
];

app.put(
  "/api/admin/projects/:id",
  auth,
  imageUpload.array("images", 30),
  async (req, res) => {
    try {
      const p = await Project.findById(req.params.id);
      if (!p) return res.sendStatus(404);
      const b = req.body || {};

      /* لا نعدّل إلا الحقول المُرسلة فعلاً */
      for (const f of PROJECT_TEXT_FIELDS) {
        if (b[f] !== undefined) p[f] = b[f];
      }
      if (b.year !== undefined)
        p.year = String(b.year).trim() === "" ? undefined : Number(b.year);
      if (b.order !== undefined)
        p.order = String(b.order).trim() === "" ? 0 : Number(b.order);

      /* صور جديدة تُضاف لآخر القائمة */
      if (req.files?.length) {
        const start = p.images.length;
        for (let i = 0; i < req.files.length; i++) {
          const r = await uploadBuffer(req.files[i].buffer, {
            folder: "rakaez/projects",
            resource_type: "image",
          });
          p.images.push({
            path: r.secure_url,
            sortOrder: start + i,
            publicId: r.public_id,
          });
        }
        if (!p.coverImage) p.coverImage = p.images[start].path;
      }

      /* اختيار صورة الغلاف من الصور الموجودة */
      if (b.coverImage !== undefined) {
        const wanted = String(b.coverImage);
        if (wanted === "") p.coverImage = p.images[0]?.path || "";
        else if (p.images.some((x) => x.path === wanted)) p.coverImage = wanted;
      }

      await p.save();
      res.json(p);
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  },
);

/* ترتيب الصور: يستقبل مصفوفة المسارات بالترتيب المطلوب */
app.put("/api/admin/projects/:id/images/order", auth, async (req, res) => {
  try {
    const p = await Project.findById(req.params.id);
    if (!p) return res.sendStatus(404);
    const order = Array.isArray(req.body?.order) ? req.body.order : null;
    if (!order)
      return res.status(400).json({ error: "order يجب أن يكون مصفوفة مسارات" });

    const byPath = new Map(p.images.map((img) => [img.path, img]));
    const seen = new Set();
    const next = [];
    for (const path of order) {
      const img = byPath.get(path);
      if (img && !seen.has(path)) {
        seen.add(path);
        next.push(img);
      }
    }
    /* أي صورة لم تُذكر تبقى في آخر القائمة */
    for (const img of p.images)
      if (!seen.has(img.path)) {
        seen.add(img.path);
        next.push(img);
      }

    /* كائنات عادية — أأمن من إعادة استخدام الـ subdocuments */
    p.images = next.map((img, i) => ({
      path: img.path,
      sortOrder: i,
      publicId: img.publicId,
    }));
    if (!p.images.some((x) => x.path === p.coverImage))
      p.coverImage = p.images[0]?.path || "";
    await p.save();
    res.json(p);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

app.delete("/api/admin/projects/:id", auth, async (req, res) => {
  try {
    const p = await Project.findById(req.params.id);
    if (!p) return res.sendStatus(404);
    for (const img of p.images || [])
      if (img.path) await destroyCloudinary(img.path);
    if (p.coverImage && p.coverImage !== p.images?.[0]?.path)
      await destroyCloudinary(p.coverImage);
    await p.deleteOne();
    res.json({ ok: true });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

app.delete("/api/admin/projects/:id/images/:idx", auth, async (req, res) => {
  try {
    const p = await Project.findById(req.params.id);
    if (!p) return res.sendStatus(404);
    const idx = Number(req.params.idx);
    const img = p.images[idx];
    if (!img) return res.sendStatus(404);
    await destroyCloudinary(img.path);
    p.images.splice(idx, 1);
    p.images.forEach((x, i) => (x.sortOrder = i));
    if (p.coverImage === img.path) p.coverImage = p.images[0]?.path || "";
    await p.save();
    res.json(p);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

app.post(
  "/api/admin/pdfs",
  auth,
  pdfUpload.single("file"),
  async (req, res) => {
    try {
      if (!req.file) return res.status(400).json({ error: "اختر ملف PDF" });
      const r = await uploadBuffer(req.file.buffer, {
        folder: "rakaez/pdfs",
        resource_type: "raw",
        use_filename: false,
        format: "pdf",
      });
      const x = await PdfFile.create({
        title: req.body.title,
        category: req.body.category || "other",
        order: Number(req.body.order || 0),
        filePath: r.secure_url,
        publicId: r.public_id,
      });
      res.json(x);
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  },
);

app.put(
  "/api/admin/pdfs/:id",
  auth,
  pdfUpload.single("file"),
  async (req, res) => {
    try {
      const x = await PdfFile.findById(req.params.id);
      if (!x) return res.sendStatus(404);
      if (req.body.title) x.title = req.body.title;
      if (req.body.category) x.category = req.body.category;
      if (req.body.order !== undefined && String(req.body.order).trim() !== "")
        x.order = Number(req.body.order);
      if (req.file) {
        /* نرفع الجديد أولاً ثم نحذف القديم — حتى لا نفقد الملف لو فشل الرفع */
        const oldPath = x.filePath;
        const r = await uploadBuffer(req.file.buffer, {
          folder: "rakaez/pdfs",
          resource_type: "raw",
          use_filename: false,
          format: "pdf",
        });
        x.filePath = r.secure_url;
        x.publicId = r.public_id;
        await destroyPdf(oldPath);
      }
      await x.save();
      res.json(x);
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  },
);
app.delete("/api/admin/pdfs/:id", auth, async (req, res) => {
  try {
    const x = await PdfFile.findById(req.params.id);
    if (!x) return res.sendStatus(404);
    await destroyPdf(x.filePath);
    await x.deleteOne();
    res.json({ ok: true });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

/* أخطاء رفع الملفات تُعاد كـ JSON مفهوم بدل صفحة HTML */
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    const map = {
      LIMIT_FILE_SIZE: "حجم الملف أكبر من المسموح",
      LIMIT_FILE_COUNT: "عدد الملفات أكبر من المسموح",
    };
    return res
      .status(400)
      .json({ error: map[err.code] || "خطأ في رفع الملف: " + err.code });
  }
  if (err)
    return res.status(500).json({ error: err.message || "حدث خطأ غير متوقع" });
  next();
});

app.get("/admin", (req, res) =>
  res.sendFile(path.join(__dirname, "..", "public/admin/index.html")),
);
app.get(/^(?!\/api\/).*/, (req, res, next) => {
  if (req.path.startsWith("/api/")) return next();
  res.sendFile(path.join(__dirname, "..", "public/index.html"));
});

mongoose
  .connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/rakaez")
  .then(() =>
    app.listen(PORT, () => console.log(`Rakaez CMS: http://localhost:${PORT}`)),
  )
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
