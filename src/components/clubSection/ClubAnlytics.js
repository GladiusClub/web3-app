import React from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

const data = [
  { name: "January", Sales: 3000 },
  { name: "February", Sales: 2000 },
  { name: "March", Sales: 2000 },
  { name: "April", Sales: 1000 },
  { name: "May", Sales: 5000 },
  { name: "June", Sales: 4000 },
];

const CustomLineChart = () => {
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <LineChart width={600} height={300} data={data}>
        <Line type="monotone" dataKey="Sales" stroke="#8884d8" />
        <CartesianGrid stroke="#ccc" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
      </LineChart>
    </div>
  );
};

export default CustomLineChart;
