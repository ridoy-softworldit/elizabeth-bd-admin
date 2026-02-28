"use client";

import {
  LineChart,
  Line,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

// Props type
export type OrderCardProps = {
  title: string;
  subtitle?: string;
  value: number;
  change: number;
  chartData: { value: number }[];
};

export default function OrderCard({
  title,
  subtitle = 'Last 7 days',
  value,
  change,
  chartData,
}: OrderCardProps) {
  const isPositive = change >= 0;

  return (
    <div className="relative bg-[#C9C9C926] text-card-foreground rounded-xl p-4 shadow-sm w-full max-w-full h-[200px] aspect-[358/199] flex flex-col justify-between overflow-hidden">
      {/* Title */}
      <div>
        <h3 className="text-xl font-semibold">{title}</h3>
        <p className="text-sm font-semibold text-muted-foreground">{subtitle}</p>
      </div>

      {/* Value */}
      <div className="text-3xl font-bold mt-1">
        {(value / 1000).toFixed(1)}K
      </div>

      {/* Change */}
      <div
        className={`flex items-center text-sm ${
          isPositive ? 'text-green-500' : 'text-red-500'
        }`}
      >
        {isPositive ? (
          <ArrowUpRight className="w-4 h-4 mr-1" />
        ) : (
          <ArrowDownRight className="w-4 h-4 mr-1" />
        )}
        {Math.abs(change)}%
        <span className="ml-1 text-muted-foreground">vs last 7 days</span>
      </div>

      {/* Chart */}
      <div className="absolute right-4 bottom-4 w-[50%] h-[70%] pointer-events-none">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <Tooltip wrapperStyle={{ display: "none" }} />
            <defs>
              <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22c55e" stopOpacity={0.2} />
                <stop offset="100%" stopColor="#22c55e" stopOpacity={0} />
              </linearGradient>
            </defs>
            <Line
              type="monotone"
              dataKey="value"
              stroke="#22c55e"
              strokeWidth={2}
              dot={false}
              fill="url(#colorGradient)"
              fillOpacity={1}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
