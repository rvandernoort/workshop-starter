import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { importReadings } from "./actions";

export default async function UploadPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const { error } = await searchParams;

  return (
    <main className="mx-auto w-full max-w-4xl px-6 py-12 sm:py-16">
      <header className="mb-10">
        <div className="border-l-4 border-[#20F29B] pl-4">
          <h1 className="font-display text-3xl font-semibold tracking-tight text-hw-off-white sm:text-4xl">
            Import meter readings
          </h1>
          <p className="mt-2 text-sm text-hw-off-white/70">
            Upload a CSV with columns{" "}
            <code className="rounded bg-hw-dark px-1 py-0.5">
              read_at,kind,value,unit
            </code>
            .
          </p>
        </div>
      </header>

      <form action={importReadings} className="flex flex-col gap-4">
        <input
          type="file"
          name="file"
          accept=".csv"
          required
          className="text-sm text-hw-off-white"
        />
        <div>
          <button
            type="submit"
            className="rounded-xl bg-gradient-to-r from-[#20F29B] to-[#02DACE] px-6 py-2 text-sm font-semibold text-hw-header hover:opacity-90"
          >
            Import
          </button>
        </div>
      </form>

      {error && (
        <p className="mt-4 text-sm text-red-400">{error}</p>
      )}
    </main>
  );
}
