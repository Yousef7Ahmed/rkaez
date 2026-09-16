/* ============================================================
   JS 01 — القائمة والتنقل
   ============================================================ */
const nav = document.getElementById("nav");
const burger = document.getElementById("burger");
const scrim = document.getElementById("scrim");
const drawer = document.getElementById("drawer");

const onScroll = () => nav.classList.toggle("is-stuck", window.scrollY > 40);
onScroll();
window.addEventListener("scroll", onScroll, { passive: true });

const closeMenu = () => {
  nav.classList.remove("is-open");
  burger.setAttribute("aria-expanded", "false");
  document.body.style.overflow = "";
};
burger.addEventListener("click", () => {
  const open = nav.classList.toggle("is-open");
  burger.setAttribute("aria-expanded", String(open));
  document.body.style.overflow = open ? "hidden" : "";
});
scrim.addEventListener("click", closeMenu);
drawer
  .querySelectorAll("a")
  .forEach((a) => a.addEventListener("click", closeMenu));

/* ============================================================
   JS 02 — الفيديو: خلفية بديلة إن تعذّر التحميل
   ============================================================ */
const heroVideo = document.getElementById("heroVideo");
const failVideo = () =>
  document.getElementById("hero").classList.add("no-video");
heroVideo.addEventListener("error", failVideo, true);
heroVideo.querySelector("source").addEventListener("error", failVideo);
setTimeout(() => {
  if (heroVideo.readyState === 0) failVideo();
}, 2500);

/* ============================================================
   JS 03 — الظهور عند التمرير
   ============================================================ */
const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("in");
        io.unobserve(e.target);
      }
    });
  },
  { threshold: 0.15, rootMargin: "0px 0px -60px" },
);
document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

/* ============================================================
   JS 04 — معرض الصور  ★ هنا تضيف صورك ★
   ------------------------------------------------------------
   كل مفتاح هنا مرتبط بعنصر في الصفحة عن طريق data-gallery.
   ضع الصور في مجلد assets/ واكتب مساراتها داخل images.
   أول صورة تصبح غلاف العنصر، والباقي يُتصفَّح بالأسهم.
   لو تركت المصفوفة فارغة، يبقى الرسم التوضيحي كما هو.

   المفاتيح الجاهزة:
     work-*  → كروت قسم "أعمالنا السابقة"
     svc-*   → كروت قسم "خدماتنا"
     plan-*  → شريط صور أسفل مخطط كل دور
   ============================================================ */
const GALLERIES = {
  "rakah-a-01": {
    title: "مشروع الراكه A — آخر مشاريعنا",
    sub: "مشروع سكني · الراكه A · تم التنفيذ والتسليم",
    images: [
      "assets/projects/raka A/WhatsApp Image 2026-08-27 at 7.10.52 PM.jpeg",
      "assets/projects/raka A/WhatsApp Image 2026-08-27 at 7.11.16 PM.jpeg",
    ],
  },

  "rakah-B-02": {
    title: "مشروع الراكه B",
    sub: "مشروع سكني · الراكه B · تم التنفيذ والتسليم",
    images: [
      "assets/projects/raka B/WhatsApp Image 2026-09-06 at 8.34.54 PM (1).jpeg",
      "assets/projects/raka B/WhatsApp Image 2026-09-06 at 8.34.54 PM (2).jpeg",
      "assets/projects/raka B/WhatsApp Image 2026-09-06 at 8.34.54 PM (3).jpeg",
      "assets/projects/raka B/WhatsApp Image 2026-09-06 at 8.34.54 PM.jpeg",
      "assets/projects/raka B/WhatsApp Image 2026-09-06 at 8.34.55 PM (1).jpeg",
      "assets/projects/raka B/WhatsApp Image 2026-09-06 at 8.34.55 PM (2).jpeg",
      "assets/projects/raka B/WhatsApp Image 2026-09-06 at 8.34.55 PM (3).jpeg",
      "assets/projects/raka B/WhatsApp Image 2026-09-06 at 8.34.55 PM.jpeg",
      "assets/projects/raka B/WhatsApp Image 2026-09-06 at 8.34.56 PM.jpeg",
    ],
  },

  "rakah-Z-03": {
    title: "مشروع الراكه Z",
    sub: "مشروع سكني · الراكه Z · تم التنفيذ والتسليم",
    images: [
      "assets/projects/raka Z/WhatsApp Image 2026-09-06 at 8.26.57 PM (1).jpeg",
      "assets/projects/raka Z/WhatsApp Image 2026-09-06 at 8.26.57 PM (2).jpeg",
      "assets/projects/raka Z/WhatsApp Image 2026-09-06 at 8.26.57 PM.jpeg",
      "assets/projects/raka Z/WhatsApp Image 2026-09-06 at 8.26.58 PM.jpeg",
    ],
  },
  /* ---------- أعمالنا السابقة ---------- */
  "work-hosh": {
    title: "مشروع فلل الياسمين — حي الياسمين",
    sub: "فلل مستقلة · 6 وحدات · تم البيع بالكامل · 2025",
    images: [
      "assets/WhatsApp Image 2026-08-26 at 6.44.45 PM (1).jpeg",
      "assets/WhatsApp Image 2026-08-26 at 6.44.45 PM (2).jpeg",
      "assets/WhatsApp Image 2026-08-26 at 6.44.45 PM (3).jpeg",
    ],
  },
  "work-railing": {
    title: "فيلا الملقا A7 — حي الملقا",
    sub: "فيلا مستقلة · 520 م² مسطح بناء · مشروع مكتمل · 2025",
    images: [
      "assets/WhatsApp Image 2026-08-26 at 6.44.45 PM.jpeg",
      "assets/WhatsApp Image 2026-08-26 at 6.44.46 PM (1).jpeg",
      "assets/WhatsApp Image 2026-08-26 at 6.44.46 PM.jpeg",
    ],
  },
  "work-pergola": {
    title: "شقق حطين السكنية — حي حطين",
    sub: "شقق تمليك · 12 وحدة · تم البيع بالكامل · 2024",
    images: [
      "assets/WhatsApp Image 2026-08-26 at 6.45.19 PM.jpeg",
      "assets/WhatsApp Image 2026-08-26 at 6.45.53 PM (1).jpeg",
      "assets/WhatsApp Image 2026-08-26 at 6.45.53 PM.jpeg",
    ],
  },
  "work-partition": {
    title: "دوبلكس النرجس — حي النرجس",
    sub: "دوبلكس · 4 وحدات · مشروع مكتمل · 2024",
    images: ["assets/WhatsApp Image 2026-08-26 at 6.45.54 PM.jpeg"],
  },
  "work-entrance": {
    title: "تاون هاوس القيروان — حي القيروان",
    sub: "تاون هاوس · 3 وحدات متلاصقة · تم البيع بالكامل · 2023",
    images: [],
  },

  /* ---------- خدماتنا ---------- */
  "svc-facades": {
    title: "جودة التصميم",
    sub: "نماذج من مشاريعنا",
    images: [],
  },
  "svc-enclose": {
    title: "اختيار المواقع",
    sub: "نماذج من مشاريعنا",
    images: [],
  },
  "svc-railing": {
    title: "استغلال المساحات",
    sub: "نماذج من مشاريعنا",
    images: [],
  },
  "svc-shower": { title: "التشطيبات", sub: "نماذج من مشاريعنا", images: [] },
  "svc-doors": {
    title: "المواقف والخصوصية",
    sub: "نماذج من مشاريعنا",
    images: [],
  },
  "svc-service": {
    title: "سهولة إجراءات الشراء",
    sub: "نماذج من مشاريعنا",
    images: [],
  },

  /* ---------- صور الأدوار (تظهر أسفل المخطط) ---------- */
  "plan-ground": {
    title: "الدور الأرضي — صور الوحدة",
    sub: "المجالس والصالة والمطبخ",
    images: [],
  },
  "plan-first": {
    title: "الدور الأول — صور الوحدة",
    sub: "الجناح الرئيسي وغرف النوم",
    images: [],
  },
  "plan-annex": {
    title: "الملحق والسطح — صور الوحدة",
    sub: "الملحق وجلسة السطح",
    images: [],
  },
  "plan-site": {
    title: "الأرض والمواقف — صور الوحدة",
    sub: "المدخل والمواقف والحديقة",
    images: [],
  },
};

/* ============================================================
   محرّك العارض — لا حاجة لتعديل ما تحته
   ============================================================ */
const lb = document.getElementById("lb");
const lbFrame = document.getElementById("lbFrame");
const lbThumbs = document.getElementById("lbThumbs");
const lbCount = document.getElementById("lbCount");
const lbPrev = document.getElementById("lbPrev");
const lbNext = document.getElementById("lbNext");
let album = []; // الصور المعروضة حالياً
let cursor = 0;
let lastFocus = null;

const hasPhotos = (key) =>
  !!(GALLERIES[key] && GALLERIES[key].images && GALLERIES[key].images.length);

/* --- عرض صورة بالمؤشر الحالي --- */
function show(i) {
  if (!album.length) return;
  cursor = (i + album.length) % album.length;
  lbFrame.innerHTML = "";
  const img = new Image();
  img.src = album[cursor];
  img.alt =
    document.getElementById("lbTitle").textContent + " — صورة " + (cursor + 1);
  lbFrame.appendChild(img);
  lbCount.textContent = cursor + 1 + " / " + album.length;
  lbThumbs
    .querySelectorAll("button")
    .forEach((b, n) => b.setAttribute("aria-current", String(n === cursor)));
  const single = album.length < 2;
  lbPrev.disabled = single;
  lbNext.disabled = single;
  lbCount.style.display = single ? "none" : "";
}

/* --- فتح العارض: إما صور المفتاح، أو الرسم التوضيحي إن لم توجد صور --- */
function openLB(key, el) {
  const g = GALLERIES[key] || {};
  document.getElementById("lbTitle").textContent =
    g.title || el.dataset.title || "";
  document.getElementById("lbSub").textContent = g.sub || el.dataset.sub || "";
  album = (g.images || []).slice();
  lbThumbs.innerHTML = "";

  if (album.length) {
    if (album.length > 1) {
      album.forEach((src, n) => {
        const b = document.createElement("button");
        b.type = "button";
        b.setAttribute("aria-label", "عرض الصورة " + (n + 1));
        const t = new Image();
        t.src = src;
        t.alt = "";
        b.appendChild(t);
        b.addEventListener("click", () => show(n));
        lbThumbs.appendChild(b);
      });
    }
    show(0);
  } else {
    /* لا توجد صور بعد → اعرض الرسم التوضيحي الموجود داخل العنصر */
    const art = el.querySelector(".tile__art, svg");
    lbFrame.innerHTML = "";
    if (art) {
      const c = art.cloneNode(true);
      c.removeAttribute("class");
      lbFrame.appendChild(c);
    }
    lbCount.style.display = "none";
    lbPrev.disabled = lbNext.disabled = true;
  }

  lastFocus = document.activeElement;
  lb.classList.add("is-open");
  document.body.style.overflow = "hidden";
  document.getElementById("lbClose").focus();
}

function closeLB() {
  lb.classList.remove("is-open");
  document.body.style.overflow = "";
  if (lastFocus) lastFocus.focus();
}

lbPrev.addEventListener("click", () => show(cursor - 1));
lbNext.addEventListener("click", () => show(cursor + 1));
document.getElementById("lbClose").addEventListener("click", closeLB);
lb.addEventListener("click", (e) => {
  if (e.target === lb || e.target === lbFrame) closeLB();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeLB();
    closeMenu();
  }
  if (!lb.classList.contains("is-open") || album.length < 2) return;
  if (e.key === "ArrowLeft") show(cursor + 1); // يسار = التالي في RTL
  if (e.key === "ArrowRight") show(cursor - 1);
});

/* السحب بالإصبع على الجوال */
let touchX = null;
lb.addEventListener(
  "touchstart",
  (e) => {
    touchX = e.changedTouches[0].clientX;
  },
  { passive: true },
);
lb.addEventListener("touchend", (e) => {
  if (touchX === null || album.length < 2) return;
  const d = e.changedTouches[0].clientX - touchX;
  if (Math.abs(d) > 50) show(cursor + (d < 0 ? 1 : -1));
  touchX = null;
});

/* --- تركيب الأغلفة وربط النقر بكل عنصر يحمل data-gallery --- */
function mountGalleries(scope) {
  (scope || document).querySelectorAll("[data-gallery]").forEach((el) => {
    if (el.dataset.mounted) return;
    el.dataset.mounted = "1";

    const key = el.dataset.gallery;
    const first = hasPhotos(key) ? GALLERIES[key].images[0] : null;

    if (first) {
      el.classList.add("has-photos");
      const art = el.querySelector(".tile__art");
      if (art) {
        /* كرت أعمال: الصورة تحل محل الرسم التوضيحي، وتعود له إن فشل التحميل */
        const img = new Image();
        img.className = "tile__art";
        img.src = first;
        img.alt = GALLERIES[key].title || "";
        img.onerror = () => {
          img.remove();
          art.style.display = "";
        };
        art.style.display = "none";
        art.insertAdjacentElement("afterend", img);
      } else if (el.classList.contains("svc")) {
        /* كرت خدمة: غلاف أعلى الكرت */
        const box = document.createElement("div");
        box.className = "cover";
        const img = new Image();
        img.src = first;
        img.alt = GALLERIES[key].title || "";
        img.onerror = () => box.remove();
        box.appendChild(img);
        el.prepend(box);
      }
    }

    if (!el.matches("button,a")) {
      el.tabIndex = 0;
      el.setAttribute("role", "button");
    }
    el.addEventListener("click", () => openLB(key, el));
    el.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openLB(key, el);
      }
    });
  });
}
mountGalleries();

/* --- شريط صور الدور المعروض في قسم المساحات --- */
function renderShots(planKey) {
  const box = document.getElementById("planShots");

  // العنصر غير موجود في الصفحة الحالية
  if (!box) return;

  const key = "plan-" + planKey;

  box.innerHTML = "";

  if (!hasPhotos(key)) return;

  const imgs = GALLERIES[key].images;

  imgs.slice(0, 3).forEach((src, n) => {
    const b = document.createElement("button");

    b.type = "button";
    b.setAttribute("aria-label", "عرض صور هذا الدور");

    const t = new Image();

    t.src = src;
    t.alt = "";

    t.onerror = () => b.remove();

    b.appendChild(t);

    b.addEventListener("click", () => {
      openLB(key, box);
      show(n);
    });

    box.appendChild(b);
  });

  if (imgs.length > 3) {
    const more = document.createElement("button");

    more.type = "button";
    more.className = "shots__more";

    more.textContent = "+" + (imgs.length - 3);

    more.addEventListener("click", () => {
      openLB(key, box);
      show(3);
    });

    box.appendChild(more);
  }
}

/* ============================================================
   JS 05 — توزيع المساحات
   glass  → الواجهات والفتحات الرئيسية المميّزة على المخطط
   عدّل الأرقام هنا فقط، والمخطط والجدول يتحدثان تلقائياً
   ============================================================ */
const PLANS = {
  ground: {
    title: "الدور الأرضي",
    label: "Ground floor",
    total: 215,
    desc: "استقبال منفصل للضيوف عن جناح العائلة، مع صالة عائلية مطلّة على الحديقة ومطبخ رئيسي وآخر تحضيري.",
    rooms: [
      { x: 30, y: 40, w: 195, h: 150, n: "مجلس رجال", a: 46 },
      { x: 235, y: 40, w: 130, h: 150, n: "مقلط وطعام", a: 34 },
      { x: 375, y: 40, w: 215, h: 150, n: "صالة عائلية", a: 52 },
      { x: 30, y: 200, w: 150, h: 175, n: "مطبخ رئيسي", a: 26 },
      { x: 190, y: 200, w: 115, h: 175, n: "مطبخ تحضيري", a: 14 },
      { x: 315, y: 200, w: 110, h: 175, n: "غرفة خادمة", a: 12 },
      { x: 435, y: 200, w: 155, h: 175, n: "درج ومستودع", a: 31 },
    ],
    glass: [
      { x1: 375, y1: 190, x2: 590, y2: 190 },
      { x1: 590, y1: 40, x2: 590, y2: 190 },
    ],
    dims: [{ x1: 30, y1: 398, x2: 590, y2: 398, t: "23.4 m" }],
    list: [
      ["مجلس رجال", 46],
      ["مقلط وطعام", 34],
      ["صالة عائلية", 52],
      ["مطبخ رئيسي وتحضيري", 40],
      ["غرفة خادمة ودورة مياه", 12],
      ["درج ومستودع وممرات", 31],
    ],
    glassNote: ["واجهة الصالة المطلّة على الحديقة", "34 م²"],
  },
  first: {
    title: "الدور الأول",
    label: "First floor",
    total: 205,
    desc: "أربع غرف نوم وجناح رئيسي بغرفة ملابس وحمام خاص، وصالة علوية تفصل الجناح عن بقية الغرف.",
    rooms: [
      { x: 30, y: 40, w: 225, h: 170, n: "الجناح الرئيسي", a: 44 },
      { x: 265, y: 40, w: 145, h: 170, n: "غرفة ملابس", a: 16 },
      { x: 420, y: 40, w: 170, h: 170, n: "غرفة نوم 2", a: 26 },
      { x: 30, y: 220, w: 170, h: 155, n: "غرفة نوم 3", a: 24 },
      { x: 210, y: 220, w: 170, h: 155, n: "غرفة نوم 4", a: 24 },
      { x: 390, y: 220, w: 200, h: 155, n: "صالة علوية", a: 38 },
    ],
    glass: [
      { x1: 390, y1: 220, x2: 390, y2: 375 },
      { x1: 390, y1: 220, x2: 590, y2: 220 },
    ],
    dims: [{ x1: 30, y1: 398, x2: 590, y2: 398, t: "23.4 m" }],
    list: [
      ["الجناح الرئيسي وغرفة الملابس", 60],
      ["غرفة نوم 2 بحمام", 26],
      ["غرفة نوم 3", 24],
      ["غرفة نوم 4", 24],
      ["صالة علوية", 38],
      ["ممرات ودرج", 33],
    ],
    glassNote: ["فراغ الدرج والإطلالة الداخلية", "19 م²"],
  },
  annex: {
    title: "الملحق والسطح",
    label: "Annex + roof",
    total: 60,
    desc: "ملحق مستقل بمدخله الخاص من الدرج الخارجي، مع سطح مجهّز بجلسة وتمديدات مطبخ خارجي.",
    rooms: [
      { x: 60, y: 60, w: 215, h: 165, n: "غرفة الملحق", a: 28 },
      { x: 285, y: 60, w: 130, h: 165, n: "مطبخ صغير", a: 12 },
      { x: 425, y: 60, w: 135, h: 165, n: "دورة مياه", a: 6 },
      { x: 60, y: 240, w: 500, h: 130, n: "جلسة السطح المغطاة", a: 14 },
    ],
    glass: [
      { x1: 60, y1: 240, x2: 560, y2: 240 },
      { x1: 60, y1: 370, x2: 560, y2: 370 },
      { x1: 60, y1: 240, x2: 60, y2: 370 },
      { x1: 560, y1: 240, x2: 560, y2: 370 },
    ],
    dims: [{ x1: 60, y1: 395, x2: 560, y2: 395, t: "19.0 m" }],
    list: [
      ["غرفة الملحق", 28],
      ["مطبخ صغير", 12],
      ["دورة مياه", 6],
      ["جلسة السطح المغطاة", 14],
    ],
    glassNote: ["جلسة السطح المغطاة", "62 م²"],
  },
  site: {
    title: "الأرض والمواقف",
    label: "Land area",
    total: 320,
    desc: "أرض بواجهتين تسمحان بفصل مدخل السيارات عن مدخل المشاة، مع حديقة خلفية تبقى مظللة بعد الظهر.",
    rooms: [
      { x: 40, y: 50, w: 335, h: 245, n: "بصمة المبنى", a: 215 },
      { x: 390, y: 50, w: 185, h: 145, n: "مواقف مغطاة", a: 36 },
      { x: 390, y: 210, w: 185, h: 85, n: "ممر المدخل", a: 14 },
      { x: 40, y: 310, w: 535, h: 70, n: "الحديقة الخلفية", a: 55 },
    ],
    glass: [
      { x1: 40, y1: 310, x2: 575, y2: 310 },
      { x1: 40, y1: 380, x2: 575, y2: 380 },
      { x1: 40, y1: 310, x2: 40, y2: 380 },
      { x1: 575, y1: 310, x2: 575, y2: 380 },
      { x1: 390, y1: 50, x2: 575, y2: 50 },
    ],
    dims: [{ x1: 40, y1: 400, x2: 575, y2: 400, t: "20.0 m" }],
    list: [
      ["بصمة المبنى على الأرض", 215],
      ["مواقف مغطاة لسيارتين", 36],
      ["ممر المدخل والمشاة", 14],
      ["الحديقة الخلفية وارتدادات", 55],
    ],
    glassNote: ["المدخل الرئيسي ومظلة المواقف", "96 م²"],
  },
};

const svg = document.getElementById("planSvg");
const NS = "http://www.w3.org/2000/svg";
const mk = (tag, attrs) => {
  const el = document.createElementNS(NS, tag);
  for (const k in attrs) el.setAttribute(k, attrs[k]);
  return el;
};

function drawPlan(key) {
  const p = PLANS[key];

  // لو الـ plan غير موجود، ما توقفش باقي السكربت
  if (!p) {
    console.warn("Plan not found:", key);
    return;
  }

  // =========================
  // SVG
  // =========================
  if (svg) {
    svg.innerHTML = "";
    svg.classList.remove("is-drawn");

    (p.rooms || []).forEach((r, i) => {
      const rect = mk("rect", {
        x: r.x,
        y: r.y,
        width: r.w,
        height: r.h,
        rx: 2,
        class: "room",
      });

      rect.style.animationDelay = i * 55 + "ms";
      svg.appendChild(rect);

      const l = mk("text", {
        x: r.x + r.w / 2,
        y: r.y + r.h / 2 - 3,
        class: "rlabel",
        "text-anchor": "middle",
      });

      l.textContent = r.n;
      l.style.animationDelay = i * 55 + 110 + "ms";
      svg.appendChild(l);

      const a = mk("text", {
        x: r.x + r.w / 2,
        y: r.y + r.h / 2 + 17,
        class: "rarea",
        "text-anchor": "middle",
      });

      a.textContent = r.a + " m²";
      a.style.animationDelay = i * 55 + 150 + "ms";
      svg.appendChild(a);
    });

    (p.glass || []).forEach((g, i) => {
      const line = mk("line", {
        x1: g.x1,
        y1: g.y1,
        x2: g.x2,
        y2: g.y2,
        class: "glassmark",
      });

      line.style.animationDelay = 300 + i * 70 + "ms";
      svg.appendChild(line);
    });

    (p.dims || []).forEach((d) => {
      svg.appendChild(
        mk("line", {
          x1: d.x1,
          y1: d.y1,
          x2: d.x2,
          y2: d.y2,
          class: "dimline",
        }),
      );

      svg.appendChild(
        mk("line", {
          x1: d.x1,
          y1: d.y1 - 5,
          x2: d.x1,
          y2: d.y1 + 5,
          class: "dimline",
        }),
      );

      svg.appendChild(
        mk("line", {
          x1: d.x2,
          y1: d.y2 - 5,
          x2: d.x2,
          y2: d.y2 + 5,
          class: "dimline",
        }),
      );

      const t = mk("text", {
        x: (d.x1 + d.x2) / 2,
        y: (d.y1 + d.y2) / 2 - 8,
        class: "dimtext",
        "text-anchor": "middle",
      });

      t.textContent = d.t;
      svg.appendChild(t);
    });

    requestAnimationFrame(() => {
      if (svg) svg.classList.add("is-drawn");
    });
  }

  // =========================
  // معلومات الـ Plan
  // =========================

  const planTitle = document.getElementById("planTitle");
  const planDesc = document.getElementById("planDesc");
  const planTotal = document.getElementById("planTotal");
  const planTotalLabel = document.getElementById("planTotalLabel");
  const planRows = document.getElementById("planRows");

  if (planTitle) {
    planTitle.textContent = p.title || "";
  }

  if (planDesc) {
    planDesc.textContent = p.desc || "";
  }

  if (planTotal) {
    planTotal.textContent = p.total || "";
  }

  if (planTotalLabel) {
    planTotalLabel.textContent = p.label || "";
  }

  // =========================
  // Rows
  // =========================

  if (planRows) {
    const rows = (p.list || [])
      .map(
        ([n, a]) =>
          `<div class="plan__row">
            <span>${n}</span>
            <span class="num">${a} م²</span>
          </div>`,
      )
      .join("");

    const gn = p.glassNote
      ? `<div class="plan__row" style="color:var(--edge)">
          <span>◧ ${p.glassNote[0]}</span>
          <span class="num">${p.glassNote[1]}</span>
        </div>`
      : "";

    planRows.innerHTML = rows + gn;
  }

  // =========================
  // صور الـ Plan
  // =========================

  // renderShots نفسها أصبحت آمنة بعد التعديل السابق
  renderShots(key);
}

const tabs = [...document.querySelectorAll(".tab")];
tabs.forEach((tab, i) => {
  tab.addEventListener("click", () => {
    tabs.forEach((t) => t.setAttribute("aria-selected", "false"));
    tab.setAttribute("aria-selected", "true");
    drawPlan(tab.dataset.plan);
  });
  tab.addEventListener("keydown", (e) => {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    const dir = e.key === "ArrowLeft" ? 1 : -1; // اتجاه RTL
    const next = tabs[(i + dir + tabs.length) % tabs.length];
    next.focus();
    next.click();
  });
});
drawPlan("ground");

/* ============================================================
   JS 06 — العدادات
   ============================================================ */
const easeOut = (t) => 1 - Math.pow(1 - t, 3);
const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const countIO = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const el = e.target,
        target = +el.dataset.target,
        dur = 1900,
        t0 = performance.now();
      if (reduce) {
        el.textContent = target.toLocaleString("en-US");
        countIO.unobserve(el);
        return;
      }
      const tick = (now) => {
        const p = Math.min((now - t0) / dur, 1);
        el.textContent = Math.round(target * easeOut(p)).toLocaleString(
          "en-US",
        );
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      countIO.unobserve(el);
    });
  },
  { threshold: 0.6 },
);
document.querySelectorAll(".counter").forEach((el) => countIO.observe(el));

/* ============================================================
   JS 07 — الأسئلة الشائعة
   ============================================================ */
document.querySelectorAll(".acc").forEach((acc) => {
  const btn = acc.querySelector(".acc__btn");
  const panel = acc.querySelector(".acc__panel");
  btn.addEventListener("click", () => {
    const open = acc.classList.contains("is-open");
    document.querySelectorAll(".acc.is-open").forEach((o) => {
      o.classList.remove("is-open");
      o.querySelector(".acc__panel").style.height = "0px";
      o.querySelector(".acc__btn").setAttribute("aria-expanded", "false");
    });
    if (!open) {
      acc.classList.add("is-open");
      panel.style.height = panel.firstElementChild.offsetHeight + "px";
      btn.setAttribute("aria-expanded", "true");
    }
  });
});
window.addEventListener("resize", () => {
  const open = document.querySelector(".acc.is-open .acc__panel");
  if (open) open.style.height = open.firstElementChild.offsetHeight + "px";
});
/* ============================================================
   TEMP · مبدّل الألوان — احذف هذه الكتلة بعد اختيار اللون النهائي
   ============================================================ */
document.querySelectorAll(".themer button").forEach((b) => {
  b.addEventListener("click", () => {
    document.documentElement.dataset.theme = b.dataset.theme;
    document
      .querySelectorAll(".themer button")
      .forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
  });
});
/* ============================================================
   PDF DOCUMENT SYSTEM
   ============================================================ */

/* ============================================================
   PDF DOCUMENT SYSTEM — CMS / API VERSION
   ============================================================ */

(async function initPDFSystem() {
  const filesGrid = document.getElementById("filesGrid");

  if (!filesGrid) {
    console.warn("PDF system: #filesGrid was not found.");
    return;
  }

  /* ------------------------------------------------------------
     Load PDF.js
     ------------------------------------------------------------ */

  let pdfjsLib;

  try {
    pdfjsLib =
      await import("https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.min.mjs");

    pdfjsLib.GlobalWorkerOptions.workerSrc =
      "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.worker.min.mjs";
  } catch (error) {
    console.error("PDF system: Failed to load PDF.js:", error);

    return;
  }

  /* ------------------------------------------------------------
     State
     ------------------------------------------------------------ */

  const renderedCards = new WeakSet();
  const loadingCards = new WeakSet();

  /* ------------------------------------------------------------
     Load PDFs from CMS API
     ------------------------------------------------------------ */

  async function loadCMSPDFs() {
    try {
      const response = await fetch("/api/pdfs", {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("PDF API returned HTTP " + response.status);
      }

      const data = await response.json();

      if (!Array.isArray(data)) {
        throw new Error("PDF API did not return an array.");
      }

      console.log("CMS PDFs loaded:", data);

      return data

        .map((pdf) => ({
          id: pdf._id,

          name: pdf.title || "مستند PDF",

          file: pdf.filePath,

          category: pdf.category || "other",

          order: Number(pdf.order || 0),
        }))

        .filter((pdf) => pdf.file)

        .sort((a, b) => {
          return a.order - b.order;
        });
    } catch (error) {
      console.error("PDF system: Failed to load CMS PDFs:", error);

      return [];
    }
  }

  /* ------------------------------------------------------------
     Create PDF Card
     ------------------------------------------------------------ */

  function createPDFCard(pdf) {
    const card = document.createElement("a");

    card.className = "file-card";

    card.href = pdf.file;

    card.target = "_blank";

    card.rel = "noopener";

    card.dataset.pdfId = pdf.id || "";

    card.dataset.category = pdf.category || "other";

    card.innerHTML = `

      <div class="pdf-preview">

        <div class="pdf-loading">
          جاري تحميل الملف...
        </div>

        <canvas></canvas>

      </div>


      <div class="file-name">
        ${escapeHTML(pdf.name)}
      </div>

    `;

    return card;
  }

  /* ------------------------------------------------------------
     Escape HTML
     ------------------------------------------------------------ */

  function escapeHTML(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")

      .replace(/</g, "&lt;")

      .replace(/>/g, "&gt;")

      .replace(/"/g, "&quot;")

      .replace(/'/g, "&#039;");
  }

  /* ------------------------------------------------------------
     Render first PDF page
     ------------------------------------------------------------ */

  async function renderPDFPreview(card) {
    if (renderedCards.has(card) || loadingCards.has(card)) {
      return;
    }

    const pdfUrl = card.getAttribute("href");

    const canvas = card.querySelector("canvas");

    const preview = card.querySelector(".pdf-preview");

    const loading = card.querySelector(".pdf-loading");

    if (!pdfUrl || !canvas || !preview) {
      return;
    }

    loadingCards.add(card);

    try {
      console.log("Rendering PDF preview:", pdfUrl);

      const pdf = await pdfjsLib.getDocument({
        url: pdfUrl,
      }).promise;

      const page = await pdf.getPage(1);

      const containerWidth = preview.clientWidth;

      if (!containerWidth) {
        throw new Error("PDF preview has zero width.");
      }

      const originalViewport = page.getViewport({
        scale: 1,
      });

      const scale = containerWidth / originalViewport.width;

      const viewport = page.getViewport({
        scale: scale,
      });

      canvas.width = Math.floor(viewport.width);

      canvas.height = Math.floor(viewport.height);

      canvas.style.width = viewport.width + "px";

      canvas.style.height = viewport.height + "px";

      const context = canvas.getContext("2d", {
        alpha: false,
      });

      await page.render({
        canvasContext: context,

        viewport: viewport,
      }).promise;

      if (loading) {
        loading.style.display = "none";
      }

      renderedCards.add(card);

      /*
       * Release PDF resources
       */

      pdf.cleanup();

      pdf.destroy();
    } catch (error) {
      console.error("PDF Preview Error:", pdfUrl, error);

      if (loading) {
        loading.style.display = "none";
      }

      if (preview && !preview.querySelector(".pdf-error")) {
        const errorBox = document.createElement("div");

        errorBox.className = "pdf-error";

        errorBox.innerHTML = `

          <strong>
            تعذر عرض المعاينة
          </strong>

          <span>
            اضغط لفتح ملف PDF
          </span>

        `;

        preview.appendChild(errorBox);
      }
    } finally {
      loadingCards.delete(card);
    }
  }

  /* ------------------------------------------------------------
     Lazy Loading
     ------------------------------------------------------------ */

  function setupPDFLazyLoading() {
    const cards = filesGrid.querySelectorAll(".file-card");

    if (!cards.length) {
      console.log("PDF system: No PDF cards found.");

      return;
    }

    if (!("IntersectionObserver" in window)) {
      cards.forEach((card, index) => {
        if (index < 2) {
          renderPDFPreview(card);
        }
      });

      return;
    }

    const observer = new IntersectionObserver(
      (entries, observerInstance) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          const card = entry.target;

          renderPDFPreview(card);

          observerInstance.unobserve(card);
        });
      },

      {
        root: null,

        rootMargin: "600px 0px",

        threshold: 0.01,
      },
    );

    cards.forEach((card) => {
      observer.observe(card);
    });
  }

  /* ------------------------------------------------------------
     Load CMS PDFs
     ------------------------------------------------------------ */

  const cmsPDFs = await loadCMSPDFs();

  /* ------------------------------------------------------------
     Replace Static PDFs with CMS PDFs
     ------------------------------------------------------------ */

  if (cmsPDFs.length) {
    filesGrid.innerHTML = "";

    cmsPDFs.forEach((pdf) => {
      const card = createPDFCard(pdf);

      filesGrid.appendChild(card);
    });

    console.log(`PDF system: ${cmsPDFs.length} CMS PDF(s) rendered.`);
  } else {
    console.warn(
      "PDF system: No CMS PDFs returned. Keeping existing HTML PDFs.",
    );
  }

  /* ------------------------------------------------------------
     Start Lazy Loading
     ------------------------------------------------------------ */

  setupPDFLazyLoading();
})();

/* ============================================================
   RAKAEZ CMS - MongoDB dynamic projects
   ============================================================ */

window.GALLERIES = GALLERIES;

/* HTML escape مستقل عن نظام الـ PDF */
function escapeCMSHTML(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

(function loadCmsProjects() {
  async function renderCMSProjects() {
    const sections = {
      rakah_a: document.querySelector("#rakah-a-projects .gallery"),
      rakah_bz: document.querySelector("#rakah-bz-projects .gallery"),
    };

    if (!sections.rakah_a && !sections.rakah_bz) {
      console.warn("CMS projects containers were not found.");
      return;
    }

    try {
      const res = await fetch("/api/projects", {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error("Projects API returned " + res.status);
      }

      const projects = await res.json();

      console.log("CMS projects loaded:", projects);

      /* تنظيف الأقسام قبل إضافة مشاريع MongoDB */
      Object.values(sections).forEach((el) => {
        if (el) el.innerHTML = "";
      });

      projects.forEach((project) => {
        /*
         * ترتيب الصور:
         * images → حسب sortOrder
         * ولو مفيش images نستخدم coverImage
         */
        const images = (project.images || [])
          .slice()
          .sort((a, b) => Number(a.sortOrder || 0) - Number(b.sortOrder || 0))
          .map((image) => image.path)
          .filter(Boolean);

        if (!images.length && project.coverImage) {
          images.push(project.coverImage);
        }

        /*
         * لو المشروع مفيهوش أي صورة، ما نلغيش المشروع.
         * نستخدم رسم الكارت الموجود بدل الصورة.
         */
        const galleryKey = "cms-" + project._id;

        GALLERIES[galleryKey] = {
          title: project.title || "مشروع",
          sub: project.subtitle || project.description || "",
          images,
        };

        const button = document.createElement("button");

        button.type = "button";
        button.className = "tile tile--half reveal";

        button.dataset.gallery = galleryKey;
        button.dataset.title = project.title || "مشروع";
        button.dataset.sub = project.subtitle || project.description || "";

        if (images.length) {
          button.innerHTML = `
            <img
              class="tile__art"
              src="${escapeCMSHTML(images[0])}"
              alt="${escapeCMSHTML(project.title || "مشروع")}"
              loading="lazy"
              decoding="async"
            >
            <span class="tile__shade"></span>

            <span class="tile__meta">
              <em>${escapeCMSHTML(project.section || "")}</em>
              <h3>${escapeCMSHTML(project.title || "مشروع")}</h3>
              <p>${escapeCMSHTML(
                project.subtitle || project.description || "",
              )}</p>
            </span>
          `;
        } else {
          button.innerHTML = `
            <span class="tile__shade"></span>

            <span class="tile__meta">
              <em>${escapeCMSHTML(project.section || "")}</em>
              <h3>${escapeCMSHTML(project.title || "مشروع")}</h3>
              <p>${escapeCMSHTML(
                project.subtitle || project.description || "",
              )}</p>
            </span>
          `;
        }

        /*
         * تحديد القسم الصحيح
         */
        let target = sections[project.section];

        if (!target) {
          target = sections.rakah_bz || sections.rakah_a;
        }

        if (!target) return;

        target.appendChild(button);

        /*
         * مهم جداً:
         * mountGalleries() الأصلي اشتغل قبل تحميل MongoDB.
         * لذلك لازم نربط الكارت الجديد بالـ Lightbox هنا.
         */
        mountGalleries(button);

        /*
         * إضافة reveal observer للكارت الجديد
         */
        if (typeof io !== "undefined") {
          io.observe(button);
        }
      });

      console.log(`CMS: ${projects.length} project(s) rendered successfully.`);
    } catch (error) {
      console.error("CMS projects unavailable:", error);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", renderCMSProjects, {
      once: true,
    });
  } else {
    renderCMSProjects();
  }
})();
