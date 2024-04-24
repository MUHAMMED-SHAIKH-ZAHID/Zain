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
    <div className="bg-[#191818] p-6 rounded-lg shadow-lg">
      <h2 className="text-lg font-semibold text-gray-100 mb-4">Sales and Purchase Chart</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#343C6A" />
          <XAxis dataKey="name" tick={{ fill: '#ccc' }} />
          <YAxis tick={{ fill: '#ccc' }} />
          <Tooltip contentStyle={{ backgroundColor: '#202020', borderColor: '#555' }} />
          <Legend wrapperStyle={{ color: '#ccc' }} />
          <Bar dataKey="Purchase" fill="#8884d8" barSize={30} />
          <Bar dataKey="Sales" fill="#16DBCC" barSize={30} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DashboardChart;
