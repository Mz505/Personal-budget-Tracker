
import React from 'react';

interface BarChartProps {
    data: { name: string; income: number; expense: number }[];
}

const BarChart: React.FC<BarChartProps> = ({ data }) => {
    const maxValue = Math.max(...data.flatMap(d => [d.income, d.expense]));
    const yAxisLabels = [0, maxValue / 4, maxValue / 2, (maxValue * 3) / 4, maxValue];
    const barWidth = 35;
    const barGap = 20;
    const groupWidth = barWidth * 2 + barGap;

    return (
        <div className="w-full h-full" role="figure" aria-label="Bar chart showing monthly income versus expenses">
            <svg width="100%" height="100%" viewBox={`0 0 ${data.length * groupWidth + 50} 200`}>
                {/* Y-Axis Lines and Labels */}
                <g className="y-axis">
                    {yAxisLabels.map((val, i) => (
                        <g key={i}>
                            <line
                                x1="45"
                                x2={data.length * groupWidth + 50}
                                y1={170 - (val / maxValue) * 150}
                                y2={170 - (val / maxValue) * 150}
                                stroke="#e2e8f0"
                                className="dark:stroke-slate-700"
                                strokeDasharray="2,2"
                            />
                            <text
                                x="40"
                                y={175 - (val / maxValue) * 150}
                                textAnchor="end"
                                fontSize="10"
                                className="fill-slate-500 dark:fill-slate-400"
                            >
                                {`$${Math.round(val / 1000)}k`}
                            </text>
                        </g>
                    ))}
                </g>

                {/* Bars and X-Axis Labels */}
                {data.map((d, i) => (
                    <g key={d.name} transform={`translate(${i * groupWidth + 60}, 0)`}>
                        {/* Income Bar */}
                        <rect
                            x={0}
                            y={170 - (d.income / maxValue) * 150}
                            width={barWidth}
                            height={(d.income / maxValue) * 150}
                            className="fill-green-500"
                        >
                            <title>Income: {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(d.income)}</title>
                        </rect>
                        {/* Expense Bar */}
                        <rect
                            x={barWidth + barGap / 2}
                            y={170 - (d.expense / maxValue) * 150}
                            width={barWidth}
                            height={(d.expense / maxValue) * 150}
                            className="fill-red-500"
                        >
                             <title>Expense: {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(d.expense)}</title>
                        </rect>

                        {/* X-Axis Label */}
                        <text
                            x={groupWidth / 2 - barGap / 2}
                            y="190"
                            textAnchor="middle"
                            fontSize="10"
                            className="fill-slate-600 dark:fill-slate-300"
                        >
                            {d.name}
                        </text>
                    </g>
                ))}
                 {/* X-Axis Base Line */}
                 <line x1="45" y1="170" x2={data.length * groupWidth + 50} y2="170" className="stroke-slate-400 dark:stroke-slate-500" />
            </svg>
        </div>
    );
};

export default BarChart;
