import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
} from "recharts";

import { formatCurrency } from "../../utils/formatCurrency";

const RevenueChart = ({ data = [] }) => {
    const chartData = data.map((item) => ({
        ...item,

        name: new Date(
            item.year,
            item.month - 1
        ).toLocaleString("en-US", {
            month: "short",
        }),
    }));

    return (
        <div className="w-full h-72">
            {chartData.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center">
                    <p className="text-sm font-medium text-gray-500">
                        No revenue data available
                    </p>

                    <p className="text-xs text-gray-400 mt-1">
                        Revenue will appear here once you create invoices.
                    </p>
                </div>
            ) : (
                <ResponsiveContainer
                    width="100%"
                    height="100%"
                >
                    <AreaChart
                        data={chartData}
                        margin={{
                            top: 10,
                            right: 10,
                            left: 10,
                            bottom: 0,
                        }}
                    >
                        <defs>
    <linearGradient
        id="revenueGradient"
        x1="0"
        y1="0"
        x2="0"
        y2="1"
    >
        <stop
            offset="0%"
            stopColor="#4f46e5"
            stopOpacity={0.2}
        />

        <stop
            offset="100%"
            stopColor="#4f46e5"
            stopOpacity={0}
        />
    </linearGradient>
</defs>

                        <CartesianGrid
                            strokeDasharray="3 3"
                            vertical={false}
                            stroke="#e5e7eb"
                        />

                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{
                                fontSize: 12,
                                fill: "#94a3b8",
                            }}
                            dy={8}
                        />

                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            width={70}
                            tick={{
                                fontSize: 11,
                                fill: "#94a3b8",
                            }}
                            tickFormatter={(value) =>
                                formatCurrency(value, "USD")
                            }
                        />

                        <Tooltip
                            cursor={{
                                stroke: "#cbd5e1",
                                strokeDasharray: "4 4",
                            }}
                            formatter={(value) => [
                                formatCurrency(value, "USD"),
                                "Revenue",
                            ]}
                            labelFormatter={(label) =>
                                `Month: ${label}`
                            }
                            contentStyle={{
                                borderRadius: "12px",
                                border: "1px solid #e5e7eb",
                                boxShadow:
                                    "0 4px 12px rgba(0, 0, 0, 0.08)",
                            }}
                            labelStyle={{
                                color: "#374151",
                                fontWeight: 600,
                                marginBottom: "4px",
                            }}
                        />

                        <Area
                            type="monotone"
                            dataKey="amount"
                            stroke="#4f46e5"
                            strokeWidth={2}
                            fill="url(#revenueGradient)"
                            fillOpacity={1}
                            dot={false}
                            activeDot={{
                                r: 5,
                            }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            )}
        </div>
    );
};

export default RevenueChart;