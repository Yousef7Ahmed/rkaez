require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Admin = require("./server/models/Admin");

(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const username = process.env.ADMIN_USERNAME || "admin";
    const password = process.env.ADMIN_PASSWORD || "ChangeMe123!";

    const passwordHash = await bcrypt.hash(password, 12);

    const admin = await Admin.findOneAndUpdate(
      {},
      {
        username,
        passwordHash,
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      },
    );

    console.log("Admin updated successfully:", admin.username);

    await mongoose.disconnect();
  } catch (error) {
    console.error("Admin reset error:", error);
    process.exit(1);
  }
})();
