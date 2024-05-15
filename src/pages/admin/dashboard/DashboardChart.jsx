import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const DashboardChart = () => {
    const data = [
        { name: 'Jan', Sales: 4000, Purchase: 2400 },
        { name: 'Feb', Sales: 3000, Purchase: 1398 },
        { name: 'Mar', Sales: 2000, Purchase: 9800 },
        { name: 'Apr', Sales: 2780, Purchase: 3908 },
        { name: 'May', Sales: 1890, Purchase: 4800 },
        { name: 'Jun', Sales: 2390, Purchase: 3800 },
        { name: 'Jul', Sales: 3490, Purchase: 4300 },
    ];

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-medium line leading-none text-gray-800 mb-6">Sales and Purchase Chart</h2>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data} barGap={10}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="name" tick={{ fill: '#4B5563' }} />
                    <YAxis tick={{ fill: '#4B5563' }} />
                    <Tooltip
                        contentStyle={{ backgroundColor: '#F3F4F6', color: '#4B5563', border: 'none', borderRadius: '5px' }}
                        cursor={{ fill: 'rgba(75, 85, 99, 0.1)' }}
                    />
                    <Legend wrapperStyle={{ color: '#4B5563' }} />
                    <Bar dataKey="Purchase" fill="#F59E0B" barSize={30} />
                    <Bar dataKey="Sales" fill="#10B981" barSize={30} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default DashboardChart;
