import Link from "next/link";
import { importReadings } from "./actions";

export default async function UploadPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <main className="mx-auto w-full max-w-4xl px-6 py-12 sm:py-16">
      <header className="mb-10">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Import meter readings
        </h1>
        <p className="mt-3 text-zinc-600 dark:text-zinc-400">
          Upload a CSV with columns{" "}
          <code className="rounded bg-zinc-100 px-1 py-0.5 text-sm dark:bg-zinc-800">
            read_at,kind,value,unit
          </code>
          .
        </p>
        <p className="mt-2">
          <Link href="/" className="text-sm font-medium underline underline-offset-4">
            &larr; Back
          </Link>
        </p>
      </header>

      <form action={importReadings} className="flex flex-col gap-4">
        <input type="file" name="file" accept=".csv" required className="text-sm" />
        <div>
          <button
            type="submit"
            className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900"
          >
            Import
          </button>
        </div>
      </form>

      {error && (
        <p className="mt-4 text-sm text-red-700 dark:text-red-400">{error}</p>
      )}
    </main>
  );
}
