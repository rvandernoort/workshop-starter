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
  { key: "electricity", label: "Electricity", unit: "kWh", color: "#20F29B" },
  { key: "gas", label: "Gas", unit: "m3", color: "#f59e0b" },
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
            className="rounded-xl border border-hw-border bg-hw-header p-4"
          >
            <h3 className="mb-3 text-sm font-medium text-hw-off-white">
              {label} ({unit})
            </h3>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={data} margin={{ top: 4, right: 8, bottom: 4, left: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#CABBE740" />
                <XAxis
                  dataKey="readAt"
                  tickFormatter={(s) =>
                    new Date(s).toLocaleDateString("en", {
                      month: "short",
                      day: "numeric",
                    })
                  }
                  tick={{ fontSize: 11, fill: "#FBF9FF" }}
                />
                <YAxis
                  domain={["auto", "auto"]}
                  tick={{ fontSize: 11, fill: "#FBF9FF" }}
                  width={60}
                />
                <Tooltip
                  contentStyle={{
                    background: "#151318",
                    border: "1px solid #CABBE7",
                    borderRadius: "8px",
                  }}
                  labelStyle={{ color: "#FBF9FF" }}
                  itemStyle={{ color: "#FBF9FF" }}
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
