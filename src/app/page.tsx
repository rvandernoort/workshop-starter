import { prisma } from "@/lib/prisma";

export default async function Home() {
  const readings = await prisma.meterReading.findMany({
    orderBy: { readAt: "desc" },
    take: 10,
    include: { user: { select: { name: true, email: true } } },
  });

  return (
    <main className="mx-auto w-full max-w-4xl px-6 py-12 sm:py-16">
      <header className="mb-10 border-l-4 border-[#20F29B] pl-4">
        <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl text-hw-off-white">
          HomeWizard Dashboard.
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-hw-border">
          Your energy usage at a glance.
        </p>
      </header>

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
