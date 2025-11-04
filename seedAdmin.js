import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();
const prisma = new PrismaClient();

export const seedAdmin = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    const adminName = process.env.ADMIN_NAME || "Default Admin";

    if (!adminEmail || !adminPassword) {
      console.warn("Skipping admin seeding: ADMIN_EMAIL or ADMIN_PASSWORD missing in .env");
      return;
    }

    const existingAdmin = await prisma.user.findUnique({
      where: { email: adminEmail },
    });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);

      await prisma.user.create({
        data: {
          name: adminName,
          email: adminEmail,
          password: hashedPassword,
          role: "ADMIN",
        },
      });

      console.log(`Admin user created: ${adminEmail}`);
    } 
  } catch (error) {
    console.error("Error seeding admin:", error.message);
  } finally {
    await prisma.$disconnect();
  }
};
