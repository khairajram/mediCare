const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting production-safe database seeding...");

  // 1. Check if Admin already exists
  const existingAdmin = await prisma.admin.findUnique({
    where: { phoneNo: "9876543210" }
  });

  if (!existingAdmin) {
    const adminPasswordHash = await bcrypt.hash("adminpassword123", 10);
    const admin = await prisma.admin.create({
      data: {
        name: "Karni Medical Admin",
        phoneNo: "9876543210",
        email: "shreekarnimedical01@gmail.com",
        password: adminPasswordHash,
      },
    });
    console.log(`👤 Seeded Admin: ${admin.name} (Phone: ${admin.phoneNo})`);
  } else {
    console.log("👤 Admin account already exists. Skipping.");
  }

  // 2. Seed Medicines only if the catalog is empty
  const medicineCount = await prisma.medicine.count();
  if (medicineCount === 0) {
    await prisma.medicine.createMany({
      data: [
        {
          name: "Paracetamol Vet Tablets",
          type: "TABLET",
          dose: "100mg",
          quantityInStock: 50,
          minimumStockLevel: 10,
          price: 120.0,
        },
        {
          name: "Amoxicillin Antibiotic Syrup",
          type: "SYRUP",
          dose: "250mg/5ml",
          quantityInStock: 25,
          minimumStockLevel: 5,
          price: 185.0,
        },
        {
          name: "Rabies Vaccine Injection",
          type: "INJECTION",
          dose: "1ml vial",
          quantityInStock: 4,
          minimumStockLevel: 10,
          price: 450.0,
        },
        {
          name: "Ivermectin Anti-Parasitic Topical",
          type: "TOPICAL",
          dose: "0.5% w/v",
          quantityInStock: 15,
          minimumStockLevel: 3,
          price: 240.0,
        },
        {
          name: "Calcium Booster Powder",
          type: "POWDER",
          dose: "200g jar",
          quantityInStock: 30,
          minimumStockLevel: 8,
          price: 320.0,
        },
      ],
    });
    console.log("💊 Seeded default medicines in stock.");
  } else {
    console.log(`💊 Medicine catalog has ${medicineCount} items. Skipping seed.`);
  }

  console.log("🌿 Production-safe database seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
