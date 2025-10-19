"use client";

import React from "react";
import { motion } from "framer-motion";
import { BentoGrid, BentoGridItem } from "@/components/ui/dashboard";
import { PieCharts } from "@/components/ui/pie-chart";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { cn } from "@/lib/utils";
import { BarChart, Trophy, Zap, MapPin } from "lucide-react";
import { MonthlyBarGraph } from "@/components/ui/bar-graph";

const AuroraBackground = () => {
  const Blob = ({ style, animateProps }) => (
    <motion.div
      className="absolute rounded-full mix-blend-soft-light filter blur-3xl opacity-10"
      style={style}
      animate={animateProps}
      transition={{
        duration: 40,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut",
      }}
    />
  );

  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      <Blob
        style={{
          top: "10%",
          left: "10%",
          width: "40rem",
          height: "40rem",
          background: "rgba(100, 100, 120, 0.4)",
        }}
        animateProps={{ x: [0, 80, 0], y: [0, -60, 0] }}
      />
    </div>
  );
};

// Helper component to wrap content and include GlowingEffect correctly
const GlowingBentoItem = ({
  children,
  className,
  gradientFrom,
  gradientTo,
  ...props
}) => {
  return (
    <BentoGridItem
      className={cn(className, "relative")}
      gradientFrom={gradientFrom}
      gradientTo={gradientTo}
      {...props}
    >
      <GlowingEffect
        spread={40}
        glow={true}
        disabled={false}
        proximity={64}
        inactiveZone={0.01}
        borderWidth={3}
        className="rounded-[inherit]"
      />
      <div className="relative z-10 h-full p-4 rounded-[inherit]">
        {children}
      </div>
    </BentoGridItem>
  );
};

const Sidebar = () => {
  const menuItems = [
    { name: "Analytics", icon: BarChart, current: true },
    { name: "Streaks", icon: Zap, current: false },
    { name: "Badges", icon: Trophy, current: false },
    { name: "Map", icon: MapPin, current: false },
  ];

  return (
    <div className="flex flex-col space-y-4 pt-16 px-4">
      {menuItems.map((item) => (
        <a
          key={item.name}
          href={`#${item.name.toLowerCase()}`}
          className={cn(
            "flex items-center space-x-3 p-3 rounded-lg transition-colors duration-200",
            item.current
              ? "bg-purple-600/30 text-purple-300 border border-purple-600 shadow-lg"
              : "text-white/70 hover:bg-slate-800/50 hover:text-white"
          )}
        >
          <item.icon className="w-5 h-5" />
          <span className="font-medium">{item.name}</span>
        </a>
      ))}
    </div>
  );
};

// Updated Dashboard Component
export const Dashboard = () => {
  // Data for the Pie Chart (Spending Breakdown)
  const spendingData = [
    { name: "Food", value: 400 },
    { name: "Travel", value: 150 },
    { name: "Entertainment", value: 100 },
    { name: "Bills", value: 250 },
  ];

  // Data for the new Bar Graph (Monthly Spending)
  const monthlySpendingData = [
    { month: "Jan", amount: 850 },
    { month: "Feb", amount: 920 },
    { month: "Mar", amount: 780 },
    { month: "Apr", amount: 900 },
    { month: "May", amount: 1100 },
    { month: "Jun", amount: 950 },
  ];

  const colors = {
    Food: "#8B5CF6",
    Travel: "#3B82F6",
    Entertainment: "#14B8A6",
    Bills: "#22D3EE",
  };

  return (
    <div className="min-h-screen bg-slate-950 relative">
      <AuroraBackground />

      {/* Main Grid: Sidebar (1 column) and Content (rest) */}
      <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-12 gap-6 pt-12 pb-12 px-6">
        {/* Sidebar Column */}
        <div className="col-span-12 md:col-span-3 lg:col-span-2">
          <Sidebar />
        </div>

        {/* Main Content Column */}
        <div className="col-span-12 md:col-span-9 lg:col-span-10">
          {/* Header */}
          <div className="mb-8">
            <h1
              className="
                pl-6 text-4xl md:text-6xl font-extrabold tracking-tight text-white
              "
            >
              Analytics
            </h1>
            <p className="pl-6 text-white/30 text-sm">
              Track your spending and savings
            </p>
          </div>

          {/* Bento Grid Content */}
          <BentoGrid>
            {/* Spending Chart (Pie Chart) */}
            <GlowingBentoItem
              className="md:col-span-4 md:row-span-2"
              gradientFrom="from-slate-800/60"
              gradientTo="to-slate-700/60"
            >
              <PieCharts
                data={spendingData}
                colors={colors}
                title="Spending Breakdown"
              />
            </GlowingBentoItem>

            {/* Monthly Budget */}
            <GlowingBentoItem
              className="md:col-span-2 md:row-span-2"
              gradientFrom="from-slate-800/60"
              gradientTo="to-slate-700/60"
            >
              <div className="text-white h-full flex flex-col justify-between">
                <div>
                  <h2 className="text-lg font-semibold mb-1 opacity-80">
                    Monthly Budget
                  </h2>
                  <p className="text-4xl font-bold text-white">$2,450</p>
                </div>
                <div>
                  {/* Progress bar */}
                  <div className="bg-white/20 rounded-full h-1.5 mb-2">
                    <div className="bg-white rounded-full h-1.5 w-3/4"></div>
                  </div>
                  <p className="text-sm opacity-50">$550 remaining</p>
                </div>
              </div>
            </GlowingBentoItem>

            {/* Recent Transactions (md:col-span-3) */}
            <GlowingBentoItem
              className="md:col-span-3"
              gradientFrom="from-slate-800/40"
              gradientTo="to-slate-800/40"
            >
              <div className="text-white">
                <h2 className="text-lg font-semibold mb-3 opacity-80">
                  Recent Transactions
                </h2>

                <div className="space-y-2 divide-y divide-white/20">
                  <div className="flex justify-between items-center py-1">
                    <span className="text-sm opacity-60">Coffee Shop</span>
                    <span className="font-medium text-red-500">-$5.50</span>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="text-sm opacity-60">Grocery Store</span>
                    <span className="font-medium text-red-500">-$87.32</span>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="text-sm opacity-60">Salary Deposit</span>
                    <span className="font-medium text-green-500">+$3,200</span>
                  </div>
                </div>
              </div>
            </GlowingBentoItem>

            {/* NEW BOX: Bar Graph (md:col-span-3) - Now using MonthlyBarGraph */}
            <GlowingBentoItem
              className="md:col-span-3"
              gradientFrom="from-slate-800/40"
              gradientTo="to-slate-800/40"
            >
              <div className="text-white h-full flex flex-col">
                <h2 className="text-lg font-semibold mb-2 opacity-80 text-center">
                  Monthly Spending
                </h2>
                {/* Ensure the container has height for the ResponsiveContainer */}
                <div className="flex-grow min-h-[150px]">
                  <MonthlyBarGraph data={monthlySpendingData} />
                </div>
              </div>
            </GlowingBentoItem>

            {/* Savings Goal */}
            <GlowingBentoItem
              className="md:col-span-2"
              gradientFrom="from-slate-800/60"
              gradientTo="to-slate-700/60"
            >
              <div className="text-white">
                <h2 className="text-lg font-semibold mb-1 opacity-80">
                  Savings Goal
                </h2>
                <p className="text-3xl font-bold  text-white">65%</p>
                <p className="text-xs opacity-40 mt-1">$6,500 / $10,000</p>
              </div>
            </GlowingBentoItem>

            {/* Credit Score */}
            <GlowingBentoItem
              className="md:col-span-2"
              gradientFrom="from-slate-800/60"
              gradientTo="to-slate-700/60"
            >
              <div className="text-white">
                <h2 className="text-lg font-semibold mb-1 opacity-80">
                  Credit Score
                </h2>
                <p className="text-3xl font-bold  text-white-500">742</p>
                <p className="text-xs opacity-40 mt-1">↑ 12 points</p>
              </div>
            </GlowingBentoItem>

            {/* Investment Portfolio */}
            <GlowingBentoItem
              className="md:col-span-2"
              gradientFrom="from-slate-800/60"
              gradientTo="to-slate-700/60"
            >
              <div className="text-white">
                <h2 className="text-lg font-semibold mb-1 opacity-80">
                  Investment
                </h2>
                <p className="text-3xl font-bold text-white-500">$15,840</p>
                <p className="text-xs opacity-40 mt-1">+8.5% YTD</p>
              </div>
            </GlowingBentoItem>
          </BentoGrid>
        </div>
      </div>
    </div>
  );
};
