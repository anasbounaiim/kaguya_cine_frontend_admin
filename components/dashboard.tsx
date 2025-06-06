"use client";

import React, { useEffect, useState } from "react";
import { DollarSign, TicketCheck, TrendingUp, UsersRound } from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  Bar,
  BarChart,
  Pie,
  PieChart,
  Label,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "./ui/chart";
import { useAuthStore } from "@/store/AuthStore";
import { Skeleton } from "./ui/skeleton";

const areaChartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
];

const pieChartData = [
  { browser: "chrome", visitors: 275, fill: "#ef4444" },
  { browser: "safari", visitors: 200, fill: "#f87171" },
  { browser: "firefox", visitors: 287, fill: "#dc2626" },
  { browser: "edge", visitors: 173, fill: "#b91c1c" },
  { browser: "other", visitors: 190, fill: "#991b1b" },
];

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "#ef4444",
  },
  mobile: {
    label: "Mobile",
    color: "#dc2626",
  },
};

const Dashboard = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const totalVisitors = pieChartData.reduce((acc, curr) => acc + curr.visitors, 0);
  const userProfile = useAuthStore((state) => state.profile);

  return (
    <div className="space-y-6">
      {loading ? (
        <Skeleton className="h-[40px] w-[500px] rounded-xl bg-black animate-pulse" />
      ):(
        <h1 className="text-3xl font-bold">Bienvenue <b className="text-red-700">{userProfile?.firstName}</b> sur le tableau de bord</h1>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {loading ? (
          <>
            <Skeleton className="h-[140px] rounded-3xl bg-black animate-pulse" />
            <Skeleton className="h-[140px] rounded-3xl bg-black animate-pulse" />
            <Skeleton className="h-[140px] rounded-3xl bg-black animate-pulse" />

            <Skeleton className="h-[340px] rounded-3xl bg-black animate-pulse" />
            <Skeleton className="h-[340px] rounded-3xl bg-black animate-pulse" />
            <Skeleton className="h-[340px] rounded-3xl bg-black animate-pulse" />
          </>
        ) : (
          <>
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <h6 className="text-neutral-100 text-sm">Total Revenue</h6>
                <div
                  className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center"
                >
                  <DollarSign className="w-4 h-4 text-green-500" />
                </div>
              </div>
              <h1 className="text-white text-2xl font-bold">24,260 MAD</h1>
              <h5 className="text-zinc-400 text-xs mt-2">Last 30 days</h5>
            </Card>
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <h6 className="text-neutral-100 text-sm">Clients</h6>
                <div
                  className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center"
                >
                  <UsersRound className="w-4 h-4 text-red-500" />
                </div>
              </div>
              <h1 className="text-white text-2xl font-bold">317</h1>
              <h5 className="text-zinc-400 text-xs mt-2">Last 30 days</h5>
            </Card>
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <h6 className="text-neutral-100 text-sm">Réservations</h6>
                <div
                  className="w-8 h-8 rounded-full bg-teal-50 flex items-center justify-center"
                >
                  <TicketCheck className="w-4 h-4 text-cyan-500" />
                </div>
              </div>
              <h1 className="text-white text-2xl font-bold">21</h1>
              <h5 className="text-zinc-400 text-xs mt-2">Last 30 days</h5>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Area Chart - Stacked</CardTitle>
                <CardDescription>
                  Showing total visitors for the last 6 months
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig}>
                  <AreaChart
                    data={areaChartData}
                    margin={{ left: 12, right: 12 }}
                    width={500}
                    height={250}
                  >
                    <CartesianGrid vertical={false} strokeDasharray="3 3" />
                    <XAxis
                      dataKey="month"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      tickFormatter={(value) => value.slice(0, 3)}
                    />
                    <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
                    <Area
                      dataKey="mobile"
                      type="monotone"
                      stackId="a"
                      stroke={chartConfig.mobile.color}
                      fill={chartConfig.mobile.color}
                      fillOpacity={0.3}
                    />
                    <Area
                      dataKey="desktop"
                      type="monotone"
                      stackId="a"
                      stroke={chartConfig.desktop.color}
                      fill={chartConfig.desktop.color}
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ChartContainer>
              </CardContent>
              <CardFooter>
                <div className="flex w-full items-start gap-2 text-sm">
                  <div className="grid gap-2">
                    <div className="flex items-center gap-2 font-medium leading-none">
                      Trending up by 5.2% this month
                      <TrendingUp className="h-4 w-4" />
                    </div>
                    <div className="text-muted-foreground">
                      January - June 2024
                    </div>
                  </div>
                </div>
              </CardFooter>
            </Card>

            <Card className="flex flex-col">
              <CardHeader className="items-center pb-0">
                <CardTitle>Pie Chart - Donut with Text</CardTitle>
                <CardDescription>January - June 2024</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 pb-0">
                <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px]">
                  <PieChart>
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent hideLabel />}
                    />
                    <Pie
                      data={pieChartData}
                      dataKey="visitors"
                      nameKey="browser"
                      innerRadius={60}
                      strokeWidth={5}
                    >
                      <Label
                        content={({ viewBox }) => {
                          if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                            return (
                              <text
                                x={viewBox.cx}
                                y={viewBox.cy}
                                textAnchor="middle"
                                dominantBaseline="middle"
                              >
                                <tspan
                                  x={viewBox.cx}
                                  y={viewBox.cy}
                                  className="fill-foreground text-3xl font-bold"
                                >
                                  {totalVisitors.toLocaleString()}
                                </tspan>
                                <tspan
                                  x={viewBox.cx}
                                  y={(viewBox.cy || 0) + 24}
                                  className="fill-muted-foreground"
                                >
                                  Visitors
                                </tspan>
                              </text>
                            );
                          }
                        }}
                      />
                    </Pie>
                  </PieChart>
                </ChartContainer>
              </CardContent>
              <CardFooter className="flex-col gap-2 text-sm">
                <div className="flex items-center gap-2 font-medium leading-none">
                  Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
                </div>
                <div className="leading-none text-muted-foreground">
                  Showing total visitors for the last 6 months
                </div>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Bar Chart - Multiple</CardTitle>
                <CardDescription>January - June 2024</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig}>
                  <BarChart data={areaChartData}>
                    <CartesianGrid vertical={false} strokeDasharray="3 3" />
                    <XAxis
                      dataKey="month"
                      tickLine={false}
                      tickMargin={10}
                      axisLine={false}
                      tickFormatter={(value) => value.slice(0, 3)}
                    />
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent indicator="dashed" />}
                    />
                    <Bar dataKey="desktop" fill={chartConfig.desktop.color} radius={4} />
                    <Bar dataKey="mobile" fill={chartConfig.mobile.color} radius={4} />
                  </BarChart>
                </ChartContainer>
              </CardContent>
              <CardFooter className="flex-col items-start gap-2 text-sm">
                <div className="flex gap-2 font-medium leading-none">
                  Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
                </div>
                <div className="leading-none text-muted-foreground">
                  Showing total visitors for the last 6 months
                </div>
              </CardFooter>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;