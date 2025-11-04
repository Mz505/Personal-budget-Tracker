
import React from 'react';

interface DonutChartProps {
    data: { name: string; value: number; color: string }[];
}

const DonutChart: React.FC<DonutChartProps> = ({ data }) => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    let cumulative = 0;

    const getCoordinatesForPercent = (percent: number) => {
        const x = Math.cos(2 * Math.PI * percent);
        const y = Math.sin(2 * Math.PI * percent);
        return [x, y];
    };

    if (total === 0) {
        return (
             <div className="aspect-square w-full flex items-center justify-center">
                <svg viewBox="-1 -1 2 2" className="w-full h-full transform -rotate-90">
                    <circle cx="0" cy="0" r="0.8" fill="none" stroke="#e5e7eb" strokeWidth="0.2" />
                </svg>
            </div>
        );
    }
    

    const slices = data.map(item => {
        const percent = item.value / total;
        const [startX, startY] = getCoordinatesForPercent(cumulative);
        cumulative += percent;
        const [endX, endY] = getCoordinatesForPercent(cumulative);
        const largeArcFlag = percent > 0.5 ? 1 : 0;
        
        const pathData = [
            `M ${startX * 0.8} ${startY * 0.8}`, // Move to outer start
            `A 0.8 0.8 0 ${largeArcFlag} 1 ${endX * 0.8} ${endY * 0.8}`, // Outer arc
            `L ${endX * 0.5} ${endY * 0.5}`, // Line to inner end
            `A 0.5 0.5 0 ${largeArcFlag} 0 ${startX * 0.5} ${startY * 0.5}`, // Inner arc
            'Z' // Close path
        ].join(' ');

        return { pathData, color: item.color, name: item.name };
    });

    return (
        <div className="aspect-square w-full max-w-xs mx-auto">
            <svg viewBox="-1 -1 2 2" className="w-full h-full transform -rotate-90">
                {slices.map((slice, index) => (
                    <path key={index} d={slice.pathData} fill={slice.color}>
                        <title>{slice.name}: {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(data[index].value)}</title>
                    </path>
                ))}
            </svg>
        </div>
    );
};

export default DonutChart;
