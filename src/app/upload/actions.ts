"use server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

const EXPECTED_HEADER = "read_at,kind,value,unit";

function fail(message: string): never {
  redirect(`/upload?error=${encodeURIComponent(message)}`);
}

export async function importReadings(formData: FormData): Promise<void> {
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) fail("No file selected.");

  const user = await prisma.user.findUnique({
    where: { email: "demo@homewizard.local" },
  });
  if (!user) fail("Demo user not found. Run: npm run db:seed");

  const text = await file.text();
  const lines = text.trim().split("\n");

  if (lines[0].trim() !== EXPECTED_HEADER) {
    fail(`Unexpected header. Expected: ${EXPECTED_HEADER}`);
  }

  let skipped = 0;
  const rows = [];
  for (const line of lines.slice(1)) {
    const [readAt, kind, value, unit] = line.split(",");
    const parsedValue = parseFloat(value);
    const parsedDate = new Date(readAt);
    if (isNaN(parsedValue) || isNaN(parsedDate.getTime())) {
      skipped++;
      continue;
    }
    rows.push({ readAt: parsedDate, kind, value: parsedValue, unit, userId: user.id });
  }

  if (rows.length === 0) fail(`No valid rows found (${skipped} skipped).`);

  await prisma.meterReading.createMany({ data: rows });
  redirect("/");
}
