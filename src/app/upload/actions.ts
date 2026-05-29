"use server";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const EXPECTED_HEADER = "read_at,kind,value,unit";

function fail(message: string): never {
  redirect(`/upload?error=${encodeURIComponent(message)}`);
}

export async function importReadings(formData: FormData): Promise<void> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) fail("No file selected.");

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
    rows.push({ readAt: parsedDate, kind, value: parsedValue, unit, userId: session.user.id });
  }

  if (rows.length === 0) fail(`No valid rows found (${skipped} skipped).`);

  await prisma.meterReading.createMany({ data: rows });
  redirect("/");
}
