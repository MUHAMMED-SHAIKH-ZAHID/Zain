import React from "react";
import { useSelector } from "react-redux";
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
    const { chartData, loading, error } = useSelector((state) => state?.dashboard || {});


    const newdata = chartData?.map(({
        total_expense:Purchase,
          total_income:Sales,
          ...rest
        }) => ({
            Purchase,
            Sales,
            ...rest
        })
    )


    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-medium line leading-none text-gray-800 mb-6">Sales and Purchase Chart</h2>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={newdata} barGap={10}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="month" tick={{ fill: '#4B5563' }} />
                    <YAxis tick={{ fill: '#4B5563' }} />
                    <Tooltip
                        contentStyle={{ backgroundColor: '#F3F4F6', color: '#4B5563', border: 'none', borderRadius: '5px' }}
                        cursor={{ fill: 'rgba(75, 85, 99, 0.1)' }}
                    />
                    <Legend wrapperStyle={{ color: '#4B5563' }} />
                    <Bar dataKey="Sales" fill="#F59E0B" barSize={30} />
                    <Bar dataKey="Purchase" fill="#10B981" barSize={30} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default DashboardChart;
