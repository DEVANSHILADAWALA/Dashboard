"use client";

import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  Tooltip,
  Line,
  ComposedChart,
} from "recharts";

interface Props {
  stats: {
    inPlanning: number;
    running: number;
    onHold: number;
    completed: number;
    stopped: number;
    total: number;
  };
}

const COLORS = ["#61E2F3", "#BBE7BF", "#F5E192", "#ABE64D", "#FFB3B3"];

export default function ProjectStatusChart({ stats }: Props) {
  const data = [
    { x: 1, y: stats.inPlanning, name: "Planning", fill: COLORS[0] },
    { x: 2, y: stats.running, name: "Running", fill: COLORS[1] },
    { x: 3, y: stats.onHold, name: "On Hold", fill: COLORS[2] },
    { x: 4, y: stats.completed, name: "Completed", fill: COLORS[3] },
    { x: 5, y: stats.stopped, name: "Stopped", fill: COLORS[4] },
  ];

  const labels = ["", "Planning", "Running", "On Hold", "Completed", "Stopped"];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="h-[308px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={data}
            margin={{ top: 10, right: 10, left: 5, bottom: 5 }}
          >
            <XAxis
              type="number"
              dataKey="x"
              domain={[0.5, 5.5]}
              ticks={[1, 2, 3, 4, 5]}
              tickFormatter={(value) => labels[value]}
              axisLine={false}
              tickLine={false}
              tick={{
                fontSize: 11,
                fill: "#6B7280",
              }}
            />

            <YAxis
              type="number"
              dataKey="y"
              domain={[0, stats.total]}
              allowDecimals={false}
              axisLine={false}
              tickLine={false}
              tick={{
                fontSize: 11,
                fill: "#6B7280",
              }}
            />

            <Tooltip
              cursor={false}
              content={({ active, payload }) =>
                active && payload?.length ? (
                  <div className="rounded-lg border bg-white px-3 py-2 shadow-md">
                    <p className="text-xs text-gray-500">
                      {payload[0].payload.name}
                    </p>
                    <p className="text-base font-bold text-[#194146]">
                      {payload[0].payload.y}
                    </p>
                  </div>
                ) : null
              }
            />
            <Line
              type="linear"
              dataKey="y"
              stroke="#194146"
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />

            <Scatter
              data={data}
              shape={(props: any) => (
                <circle
                  cx={props.cx}
                  cy={props.cy}
                  r={5}
                  fill={props.payload.fill}
                />
              )}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
