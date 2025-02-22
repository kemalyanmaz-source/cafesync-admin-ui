"use client";

import { ArrowUpRight, DollarSign, LineChart, ShoppingCart } from "lucide-react";
import dynamic from "next/dynamic";
import { Card, CardContent } from "./ui/card";
import { JSX } from "react";

// Grafik bileşenini dinamik olarak yükleyelim (SSR kapalı)
const Chart = dynamic(() => import("./components/Chart"), { ssr: false });

export default function Dashboard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Kartlar */}
      <StatCard title="Borrowed" value="$62,076.00" icon={<DollarSign />} percent="48%" color="bg-red-500" />
      <StatCard title="Annual Profit" value="$1,958,104.00" icon={<ArrowUpRight />} percent="55%" color="bg-green-500" />
      <StatCard title="Lead Conversion" value="$234,769.00" icon={<ShoppingCart />} percent="87%" color="bg-orange-500" />
      <StatCard title="Average Income" value="$1,200.00" icon={<LineChart />} percent="87%" color="bg-blue-500" />

      {/* Grafikler */}
      <div className="col-span-2 bg-white shadow rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-4">Revenue by Location</h2>
        <Chart />
      </div>

      <div className="col-span-2 bg-white shadow rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-4">Order Statistics</h2>
        <Chart />
      </div>
    </div>
  );
}

// Kart bileşeni
const StatCard = ({ title, value, icon, percent, color }: { title: string; value: string; icon: JSX.Element; percent: string; color: string }) => (
  <Card className="p-4 flex items-center space-x-4 shadow-md bg-white">
    <div className={`p-3 rounded-full text-white ${color}`}>{icon}</div>
    <CardContent>
      <p className="text-sm text-gray-500">{title}</p>
      <h3 className="text-xl font-bold">{value}</h3>
      <p className="text-xs text-gray-400">{percent} target reached</p>
    </CardContent>
  </Card>
);
