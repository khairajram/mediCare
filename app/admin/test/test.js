import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("password123", 10);

  // ✅ fetch medicines first
  const medicines = await prisma.medicine.findMany();
  if (medicines.length === 0) {
    throw new Error("⚠️ No medicines found. Please seed medicines first!");
  }

  let medRecordCount = 0;

  for (let i = 1; i <= 100; i++) {
    const name = `user${i}`;
    const phoneNo = `9000000${i.toString().padStart(3, "0")}`;
    const email = `user${i}@example.com`;
    const address = `Address of ${name}`;

    // create user
    const user = await prisma.user.create({
      data: {
        name,
        phoneNo,
        address,
        email,
        password: hashedPassword,
      },
    });

    // random pets per user
    const petCount = Math.floor(Math.random() * 3) + 1;

    for (let j = 1; j <= petCount; j++) {
      const pet = await prisma.pet.create({
        data: {
          userId: user.id,
          name: `Pet${j}_of_${user.name}`,
          species: ["Dog", "Cat", "Bird"][Math.floor(Math.random() * 3)],
          breed: "Unknown",
          gender: Math.random() > 0.5 ? "Male" : "Female",
          dob: new Date(
            2020 + Math.floor(Math.random() * 4),
            Math.floor(Math.random() * 12),
            Math.floor(Math.random() * 28) + 1
          ),
        },
      });

      // ✅ create 1–2 medicine records per pet until ~150 total
      const recordCount = Math.floor(Math.random() * 2) + 1;

      for (let k = 0; k < recordCount && medRecordCount < 150; k++) {
        const medicine =
          medicines[Math.floor(Math.random() * medicines.length)];

        // random date in 2025
        const dateGiven = new Date(
          2025,
          Math.floor(Math.random() * 12),
          Math.floor(Math.random() * 28) + 1
        );

        // some records have nextDoseDue before, some after
        const intervalDays = [15, 30, 60][Math.floor(Math.random() * 3)];
        const nextDoseDue =
          Math.random() > 0.5
            ? new Date(dateGiven.getTime() + intervalDays * 24 * 60 * 60 * 1000) // after
            : new Date(dateGiven.getTime() - intervalDays * 24 * 60 * 60 * 1000); // before

        await prisma.medicineRecord.create({
          data: {
            petId: pet.id,
            medicineId: medicine.id,
            dateGiven,
            isDoseDate: Math.random() > 0.5, // some true, some false
            nextDoseDue,
            reminder: null,
            isCompleted: null,
            notes: "Auto-generated record",
          },
        });

        medRecordCount++;
      }
    }
  }

  console.log(`🎉 Seeded ${medRecordCount} medicine records.`);
}

main()
  .then(() => {
    console.log("✅ Users, Pets, and MedicineRecords seeded");
  })
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
