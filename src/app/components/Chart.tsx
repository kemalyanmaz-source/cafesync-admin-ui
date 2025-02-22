"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import dayjs from "dayjs";

// Örnek veri seti (Tarih + Gün adı)
const data = [
  { date: "2024-02-17", value: 100 },
  { date: "2024-02-18", value: 200 },
  { date: "2024-02-19", value: 150 },
  { date: "2024-02-20", value: 300 },
  { date: "2024-02-21", value: 400 },
  { date: "2024-02-22", value: 100 },
  { date: "2024-02-23", value: 250 },
];

const Chart = () => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        
        {/* X Ekseni: Sadece Gün Adlarını Göster */}
        <XAxis 
          dataKey="date" 
          tickFormatter={(date) => dayjs(date).format("ddd")} // Sadece gün adı (Sat, Sun, Mon vb.)
        />

        <YAxis />

        {/* Tooltip: Mouse ile Üzerine Gelince Tam Tarih Göster */}
        <Tooltip 
          labelFormatter={(label) => dayjs(label).format("DD MMM YYYY (dddd)")} // Örn: 17 Feb 2024 (Saturday)
        />

        <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default Chart;
