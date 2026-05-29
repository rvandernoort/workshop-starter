"use client";
import {
  AreaChart,
  Area,
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
  { key: "electricity", label: "Electricity", unit: "kWh", color: "#a78bfa", fill: true },
  { key: "gas",         label: "Gas",         unit: "m3",  color: "#f87171", fill: true },
  { key: "water",       label: "Water",        unit: "m3",  color: "#06b6d4", fill: false },
] as const;

export default function ReadingsChart({ readings }: { readings: ChartReading[] }) {
  return (
    <div className="grid gap-6 sm:grid-cols-3">
      {KINDS.map(({ key, label, unit, color, fill }) => {
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
              <AreaChart data={data} margin={{ top: 4, right: 8, bottom: 4, left: 8 }}>
                <defs>
                  <linearGradient id={`fill-${key}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={color} stopOpacity={0} />
                  </linearGradient>
                </defs>
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
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke={color}
                  strokeWidth={2}
                  fill={fill ? `url(#fill-${key})` : "transparent"}
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        );
      })}
    </div>
  );
}
