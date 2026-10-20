"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const DATA = [
  { month: "May", earnings: 84000 },
  { month: "Jun", earnings: 112000 },
  { month: "Jul", earnings: 96500 },
  { month: "Aug", earnings: 148000 },
  { month: "Sep", earnings: 131000 },
  { month: "Oct", earnings: 174500 },
];

export default function EarningsChart() {
  return (
    <div style={{ width: "100%", height: 220 }} role="img" aria-label="Earnings over the last six months">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={DATA} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
          <defs>
            <linearGradient id="awEarnings" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#a8cf45" stopOpacity={0.55} />
              <stop offset="100%" stopColor="#a8cf45" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#eef1e8" vertical={false} />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 11, fill: "#7b857e" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 10, fill: "#7b857e" }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(value: number) => `${Math.round(value / 1000)}k`}
          />
          <Tooltip
            formatter={(value: number) => [`KES ${value.toLocaleString("en-KE")}`, "Earnings"]}
            contentStyle={{
              border: "1px solid #e2e7db",
              borderRadius: 4,
              fontSize: 12,
              fontFamily: "Noto Sans, sans-serif",
            }}
          />
          <Area
            type="monotone"
            dataKey="earnings"
            stroke="#86a92f"
            strokeWidth={2}
            fill="url(#awEarnings)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
