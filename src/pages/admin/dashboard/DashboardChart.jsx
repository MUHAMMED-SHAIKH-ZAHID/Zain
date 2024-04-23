import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LabelList,
  Line,
} from "recharts";

const DashboardChart = () => {
    const data = [
        { name: 'Jan', uv: 4000, pv: 2400, amt: 2400 },
        { name: 'Feb', uv: 3000, pv: 1398, amt: 2210 },
        { name: 'Mar', uv: 2000, pv: 9800, amt: 2290 },
        { name: 'Apr', uv: 2780, pv: 3908, amt: 2000 },
        { name: 'May', uv: 1890, pv: 4800, amt: 2181 },
        { name: 'Jun', uv: 2390, pv: 3800, amt: 2500 },
        { name: 'Jul', uv: 3490, pv: 4300, amt: 2100 },
      ];

  return (
    <div>
        {/* <p className="font-medium text-xl text-[#343C6A]">Monthly Chart</p> */}
    <BarChart className="mt-2 bg-[#000000cc] p-4 rounded-xl shadow-md" width={730} height={300} data={data}>
      {/* <CartesianGrid strokeDasharray="1" /> */}
      <XAxis dataKey="name" axisLine={false} />
      <YAxis axisLine={false} />
      <Tooltip />
      {/* <Legend /> */}
      <Bar dataKey="pv" fill="#8884d8">
        {/* <LabelList dataKey="pv" position="top" /> */}
      </Bar>
      <Bar dataKey="uv" fill="#16DBCC" radius={[0, 0, 0, 0]} barSize={40}>
        {/* <LabelList dataKey="uv" position="top" /> */}
      </Bar>
      <Line type="linear" dataKey="uv" stroke="#8884d8" strokeWidth={2} />
    </BarChart>
    </div>
  );
};

export default DashboardChart;
