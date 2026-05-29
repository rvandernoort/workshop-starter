import Link from "next/link";
import { prisma } from "@/lib/prisma";
import ReadingsChart, { type ChartReading } from "@/components/ReadingsChart";

export default async function Home() {
  const readings = await prisma.meterReading.findMany({
    orderBy: { readAt: "desc" },
    take: 10,
    include: { user: { select: { name: true, email: true } } },
  });

  const allReadings = await prisma.meterReading.findMany({
    orderBy: { readAt: "asc" },
    select: { readAt: true, kind: true, value: true, unit: true },
  });
  const chartData: ChartReading[] = allReadings.map((r) => ({
    readAt: r.readAt.toISOString(),
    kind: r.kind,
    value: r.value,
    unit: r.unit,
  }));

  return (
    <main className="mx-auto w-full max-w-4xl px-6 py-12 sm:py-16">
      <header className="mb-10 border-l-4 border-[#20F29B] pl-4">
        <h1 className="font-display text-3xl font-semibold tracking-tight text-hw-off-white sm:text-4xl">
          HomeWizard Dashboard.
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-hw-border">
          Your energy usage at a glance.
        </p>
      </header>

      <section className="mb-10">
        <h2 className="mb-3 font-display text-xl font-semibold text-hw-off-white">
          Meter readings.
        </h2>
        {chartData.length > 0 ? (
          <ReadingsChart readings={chartData} />
        ) : (
          <p className="text-sm text-hw-off-white/70">
            No readings yet.{" "}
            <Link href="/upload" className="underline underline-offset-4">
              Import a CSV
            </Link>{" "}
            to get started.
          </p>
        )}
      </section>

      <section>
        <h2 className="mb-3 font-display text-xl font-semibold text-hw-off-white">
          Recent meter readings.
        </h2>
        <div className="overflow-x-auto rounded-lg border border-hw-border">
          <table className="w-full text-sm">
            <thead className="bg-hw-header text-left text-hw-off-white">
              <tr>
                <th className="px-4 py-2 font-medium">Kind</th>
                <th className="px-4 py-2 font-medium">Value</th>
                <th className="px-4 py-2 font-medium">Unit</th>
                <th className="px-4 py-2 font-medium">Read at</th>
                <th className="px-4 py-2 font-medium">User</th>
              </tr>
            </thead>
            <tbody>
              {readings.map((r) => (
                <tr key={r.id} className="border-t border-hw-border">
                  <td className="px-4 py-2 capitalize text-hw-off-white">
                    {r.kind}
                  </td>
                  <td className="px-4 py-2 font-mono text-hw-off-white">
                    {r.value}
                  </td>
                  <td className="px-4 py-2 text-hw-off-white">{r.unit}</td>
                  <td className="px-4 py-2 font-mono text-xs text-hw-border">
                    {r.readAt.toISOString()}
                  </td>
                  <td className="px-4 py-2 text-hw-off-white">
                    {r.user.name ?? r.user.email}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {readings.length === 0 && (
          <p className="mt-4 text-sm text-hw-border">
            No readings yet. Run{" "}
            <code className="rounded bg-hw-header px-1 py-0.5">
              npx prisma db seed
            </code>
            .
          </p>
        )}
      </section>
    </main>
  );
}
