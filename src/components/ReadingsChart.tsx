"use client";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export type ChartReading = {
  readAt: string;
  kind: string;
  value: number;
  unit: string;
};

const KINDS = [
  { key: "electricity", label: "Electricity", unit: "kWh", color: "#f59e0b" },
  { key: "gas", label: "Gas", unit: "m3", color: "#3b82f6" },
  { key: "water", label: "Water", unit: "m3", color: "#06b6d4" },
] as const;

export default function ReadingsChart({ readings }: { readings: ChartReading[] }) {
  return (
    <div className="grid gap-6 sm:grid-cols-3">
      {KINDS.map(({ key, label, unit, color }) => {
        const data = readings
          .filter((r) => r.kind === key)
          .sort((a, b) => a.readAt.localeCompare(b.readAt));
        return (
          <div
            key={key}
            className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800"
          >
            <h3 className="mb-3 text-sm font-medium">
              {label} ({unit})
            </h3>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={data} margin={{ top: 4, right: 8, bottom: 4, left: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
                <XAxis
                  dataKey="readAt"
                  tickFormatter={(s) =>
                    new Date(s).toLocaleDateString("en", {
                      month: "short",
                      day: "numeric",
                    })
                  }
                  tick={{ fontSize: 11 }}
                />
                <YAxis domain={["auto", "auto"]} tick={{ fontSize: 11 }} width={60} />
                <Tooltip
                  labelFormatter={(s) => new Date(s).toLocaleDateString()}
                  formatter={(v) => [`${String(v)} ${unit}`, label]}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke={color}
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        );
      })}
    </div>
  );
}
