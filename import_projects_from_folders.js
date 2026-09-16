require("dotenv").config();

const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const { v2: cloudinary } = require("cloudinary");

const Project = require("./server/models/Project");

const PROJECTS_DIR = path.join(__dirname, "public", "assets", "projects");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const SECTION_MAP = {
  "raka A": "rakah_a",
  "raka B": "rakah_bz",
  "raka Z": "rakah_bz",
};

const IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".avif"];

function uploadBuffer(buffer, options = {}) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      options,
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      },
    );

    stream.end(buffer);
  });
}

async function main() {
  console.log("");
  console.log("==============================================");
  console.log(" RAKAEZ PROJECT IMPORT");
  console.log(" LOCAL PROJECT FOLDERS -> CLOUDINARY -> MONGODB");
  console.log("==============================================");
  console.log("");

  if (!fs.existsSync(PROJECTS_DIR)) {
    throw new Error(`Projects folder not found: ${PROJECTS_DIR}`);
  }

  await mongoose.connect(process.env.MONGODB_URI);

  console.log("MongoDB connected.");
  console.log("");

  const folders = fs
    .readdirSync(PROJECTS_DIR, { withFileTypes: true })
    .filter((item) => item.isDirectory());

  console.log(`Found ${folders.length} project folders.`);
  console.log("");

  let created = 0;
  let skipped = 0;
  let failed = 0;

  for (const folder of folders) {
    const folderName = folder.name;
    const section = SECTION_MAP[folderName];

    console.log("----------------------------------------------");
    console.log(`Folder: ${folderName}`);

    if (!section) {
      console.log(`SKIPPED: No section mapping for "${folderName}"`);
      skipped++;
      continue;
    }

    const folderPath = path.join(PROJECTS_DIR, folderName);

    const files = fs
      .readdirSync(folderPath, { withFileTypes: true })
      .filter((item) => {
        if (!item.isFile()) return false;

        const ext = path.extname(item.name).toLowerCase();

        return IMAGE_EXTENSIONS.includes(ext);
      })
      .map((item) => item.name)
      .sort((a, b) => a.localeCompare(b));

    console.log(`Section: ${section}`);
    console.log(`Images found: ${files.length}`);

    if (!files.length) {
      console.log("SKIPPED: No images found.");
      skipped++;
      continue;
    }

    try {
      /*
       * Prevent duplicate import.
       * If a project with the same title + section already exists,
       * we don't create another one.
       */
      const existing = await Project.findOne({
        section,
        title: folderName,
      });

      if (existing) {
        console.log("SKIPPED: Project already exists.");
        skipped++;
        continue;
      }

      const images = [];

      for (let i = 0; i < files.length; i++) {
        const fileName = files[i];
        const filePath = path.join(folderPath, fileName);

        console.log("");
        console.log(`Uploading ${i + 1}/${files.length}: ${fileName}`);

        const buffer = fs.readFileSync(filePath);

        const result = await uploadBuffer(buffer, {
          folder: `rakaez/projects/${folderName}`,
          resource_type: "image",
          use_filename: false,
        });

        images.push({
          path: result.secure_url,
          sortOrder: i,
          publicId: result.public_id,
        });

        console.log("Uploaded successfully.");
        console.log(`URL: ${result.secure_url}`);
      }

      const project = await Project.create({
        section,
        title: folderName,
        subtitle: "",
        description: "",
        status: "",
        year: undefined,

        coverImage: images[0]?.path || "",

        images,

        video: "",
        landArea: "",
        builtArea: "",
        rooms: "",

        order: 0,
      });

      console.log("");
      console.log("MongoDB: CREATED");
      console.log(`Project ID: ${project._id}`);
      console.log(`Title: ${project.title}`);
      console.log(`Section: ${project.section}`);
      console.log(`Images: ${project.images.length}`);

      created++;
    } catch (error) {
      console.log("");
      console.log("FAILED:");
      console.log(error.message);
      failed++;
    }
  }

  console.log("");
  console.log("==============================================");
  console.log(" IMPORT COMPLETE");
  console.log("==============================================");
  console.log(`Folders found: ${folders.length}`);
  console.log(`Created:       ${created}`);
  console.log(`Skipped:       ${skipped}`);
  console.log(`Failed:        ${failed}`);
  console.log("==============================================");
  console.log("");

  await mongoose.disconnect();

  console.log("MongoDB connection closed.");
}

main().catch(async (error) => {
  console.error("");
  console.error("FATAL ERROR:");
  console.error(error);

  try {
    await mongoose.disconnect();
  } catch {}

  process.exit(1);
});
