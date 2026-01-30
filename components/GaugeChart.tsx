
import React from 'react';
import { RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer } from 'recharts';

interface GaugeChartProps {
    value: number;
    target: number;
    label: string;
}

const GaugeChart: React.FC<GaugeChartProps> = ({ value, target, label }) => {
    const percentage = target > 0 ? (value / target) * 100 : 0;
    const endAngle = 0;
    const startAngle = 180;
    const fullAngle = startAngle - endAngle;

    // Determine color based on value vs target
    const color = value >= target ? '#38B2AC' : (value > target * 0.8 ? '#D69E2E' : '#E53E3E');

    const chartData = [{ name: label, value: Math.min(percentage, 100), fill: color }];

    return (
        <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart
                innerRadius="65%"
                outerRadius="95%"
                data={chartData}
                startAngle={startAngle}
                endAngle={endAngle}
                barSize={35}
            >
                <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                <RadialBar
                    background={{ fill: '#4A5568' }}
                    dataKey="value"
                    cornerRadius={15}
                    angleAxisId={0}
                />
                
                {/* Target Line */}
                <g>
                    <line 
                        x1="50%" y1="50%" 
                        x2="50%" y2="5%" 
                        transform={`rotate(${(startAngle + fullAngle * (target/target * 100 / 100))}, 50%, 50%)`}
                        stroke="#FFFFFF" 
                        strokeWidth="2"
                    />
                </g>
                
                <text x="50%" y="55%" textAnchor="middle" dominantBaseline="middle" className="fill-current text-white text-4xl font-bold">
                    {value.toFixed(1)}
                </text>
                <text x="50%" y="70%" textAnchor="middle" dominantBaseline="middle" className="fill-current text-gray-400 text-sm">
                    {`Target: ${target}`}
                </text>
            </RadialBarChart>
        </ResponsiveContainer>
    );
};

export default GaugeChart;
