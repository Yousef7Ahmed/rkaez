require("dotenv").config();

const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const cloudinary = require("cloudinary").v2;

const PdfFile = require("./server/models/PdfFile");

const PDF_ROOT = path.join(__dirname, "public", "assets", "PDFS");

// قيمة شكلية فقط.
// سنستخدم collection مباشرة، لذلك لن يوقفنا enum.
const CATEGORY = "warranty";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

function getAllPDFs(dir) {
  let files = [];

  if (!fs.existsSync(dir)) {
    return files;
  }

  for (const entry of fs.readdirSync(dir, {
    withFileTypes: true,
  })) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      files.push(...getAllPDFs(fullPath));
    } else if (entry.isFile() && entry.name.toLowerCase().endsWith(".pdf")) {
      files.push(fullPath);
    }
  }

  return files;
}

function getTitle(filePath) {
  return path
    .basename(filePath, path.extname(filePath))
    .replace(/\s+/g, " ")
    .trim();
}

function getPublicId(filePath) {
  const relative = path
    .relative(PDF_ROOT, filePath)
    .replace(/\\/g, "/")
    .replace(/\.pdf$/i, "");

  const cleaned = relative
    .replace(/[^\w\u0600-\u06FF\-\/]+/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_+|_+$/g, "");

  return `rakaez/pdfs/${cleaned}`;
}

function getCloudinaryUrl(publicId) {
  return cloudinary.url(publicId, {
    resource_type: "raw",
    secure: true,
    format: "pdf",
  });
}

async function main() {
  console.log("\n==============================================");
  console.log(" RAKAEZ PDF DATABASE SYNC");
  console.log(" Cloudinary -> MongoDB");
  console.log("==============================================\n");

  const pdfFiles = getAllPDFs(PDF_ROOT);

  console.log(`Found ${pdfFiles.length} PDF files.\n`);

  if (!pdfFiles.length) {
    console.log("No PDF files found.");
    return;
  }

  await mongoose.connect(process.env.MONGODB_URI);

  console.log("MongoDB connected.\n");

  // استخدام collection مباشرة لتجنب mongoose enum validation
  const collection = PdfFile.collection;

  // الحصول على آخر order
  const lastPdf = await collection.find({}).sort({ order: -1 }).limit(1).next();

  let nextOrder =
    lastPdf && Number.isFinite(Number(lastPdf.order))
      ? Number(lastPdf.order) + 1
      : 1;

  let inserted = 0;
  let updated = 0;
  let skipped = 0;
  let failed = 0;

  for (const filePath of pdfFiles) {
    const title = getTitle(filePath);
    const publicId = getPublicId(filePath);
    const fileUrl = getCloudinaryUrl(publicId);

    console.log("----------------------------------------------");
    console.log(`File: ${path.basename(filePath)}`);
    console.log(`Title: ${title}`);
    console.log(`Public ID: ${publicId}`);
    console.log(`URL: ${fileUrl}`);

    try {
      // البحث أولًا باستخدام publicId
      let existing = await collection.findOne({
        publicId: publicId,
      });

      // لو لم يوجد، ابحث بالعنوان
      if (!existing) {
        existing = await collection.findOne({
          title: title,
        });
      }

      if (existing) {
        await collection.updateOne(
          { _id: existing._id },
          {
            $set: {
              title: title,
              category: CATEGORY,
              filePath: fileUrl,
              publicId: publicId,
              updatedAt: new Date(),
            },
          },
        );

        updated++;

        console.log("MongoDB: UPDATED");
        continue;
      }

      const now = new Date();

      await collection.insertOne({
        title: title,
        category: CATEGORY,
        filePath: fileUrl,
        publicId: publicId,
        order: nextOrder++,
        createdAt: now,
        updatedAt: now,
      });

      inserted++;

      console.log("MongoDB: INSERTED");
    } catch (error) {
      failed++;

      console.error("FAILED:");
      console.error(error.message || error);
    }
  }

  console.log("\n==============================================");
  console.log(" DATABASE SYNC COMPLETE");
  console.log("==============================================");

  console.log(`Found:   ${pdfFiles.length}`);
  console.log(`Inserted:${inserted}`);
  console.log(`Updated: ${updated}`);
  console.log(`Skipped: ${skipped}`);
  console.log(`Failed:  ${failed}`);

  console.log("==============================================\n");

  await mongoose.disconnect();

  console.log("MongoDB connection closed.");
}

main().catch(async (error) => {
  console.error("\nFATAL ERROR:");
  console.error(error);

  try {
    await mongoose.disconnect();
  } catch {}

  process.exit(1);
});
