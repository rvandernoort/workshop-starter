import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function formatPrice(cents: number) {
  return new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR",
  }).format(cents / 100);
}

export default async function Shop() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const products = await prisma.product.findMany({ orderBy: { name: "asc" } });

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-12 sm:py-16">
      <header className="mb-10">
        <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl text-hw-off-white">
          Shop.
        </h1>
        <p className="mt-2 text-hw-border">HomeWizard products.</p>
      </header>

      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => (
          <li
            key={p.id}
            className="flex flex-col rounded-3xl border border-hw-border bg-hw-header p-5"
          >
            <span className="mb-3 self-start rounded-full bg-gradient-to-r from-[#20F29B] to-[#02DACE] px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-hw-dark">
              {p.category}
            </span>
            <h2 className="font-display text-lg font-semibold text-hw-off-white">
              {p.name}
            </h2>
            <p className="mt-2 flex-1 text-sm text-hw-border">{p.description}</p>
            <div className="mt-4 font-mono text-base font-semibold hw-gradient-text">
              {formatPrice(p.priceCents)}
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
