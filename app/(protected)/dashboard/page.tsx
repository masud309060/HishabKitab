"use client";

import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  ArrowDownLeft,
  Wallet,
  TrendingUp, Calendar,
  Clock
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import TransactionList from "@/components/TransactionList";
import { useSettings } from "@/components/SettingsProvider";

interface Stats {
  income: number;
  expense: number;
}

interface ReportData {
  allTime: Stats;
  monthly: Stats;
  weekly: Stats;
}

export default function DashboardPage() {
  const [data, setData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const { formatCurrency } = useSettings();

  useEffect(() => {
    fetch("/api/reports")
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="flex justify-between items-center">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-32 w-full rounded-2xl" />
          <Skeleton className="h-32 w-full rounded-2xl" />
          <Skeleton className="h-32 w-full rounded-2xl" />
        </div>
        <Skeleton className="h-96 w-full rounded-2xl" />
      </div>
    );
  }

  const balance = (data?.allTime.income || 0) - (data?.allTime.expense || 0);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Overview</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Welcome back! Here's what's happening with your money.
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <Calendar className="h-4 w-4 text-blue-600" />
          <span className="text-sm font-medium">Jan 2026</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-none shadow-xl bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-3xl overflow-hidden relative">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Wallet className="h-24 w-24" />
          </div>
          <CardHeader className="pb-2">
            <CardTitle className="text-blue-100 text-sm font-medium flex items-center gap-2">
              <Wallet className="h-4 w-4" />
              Total Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold tracking-tight mb-1">
               {formatCurrency(balance)}
            </div>
            <p className="text-blue-100 text-xs flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              +2.5% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-xl bg-white dark:bg-slate-900 rounded-3xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-slate-500 dark:text-slate-400 text-sm font-medium flex items-center gap-2">
              <div className="p-1.5 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <ArrowUpRight className="h-4 w-4 text-green-600" />
              </div>
              Total Income
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold tracking-tight mb-1">
              {formatCurrency(data?.allTime.income || 0)}
            </div>
            <div className="flex items-center gap-4 mt-4">
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">This Month</p>
                <p className="text-sm font-bold text-green-600">+{formatCurrency(data?.monthly.income || 0)}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">This Week</p>
                <p className="text-sm font-bold text-green-600">+{formatCurrency(data?.weekly.income || 0)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-xl bg-white dark:bg-slate-900 rounded-3xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-slate-500 dark:text-slate-400 text-sm font-medium flex items-center gap-2">
              <div className="p-1.5 bg-red-100 dark:bg-red-900/30 rounded-lg">
                <ArrowDownLeft className="h-4 w-4 text-red-600" />
              </div>
              Total Expenses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold tracking-tight mb-1">
              {formatCurrency(data?.allTime.expense || 0)}
            </div>
            <div className="flex items-center gap-4 mt-4">
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">This Month</p>
                <p className="text-sm font-bold text-red-600">-{formatCurrency(data?.monthly.expense || 0)}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">This Week</p>
                <p className="text-sm font-bold text-red-600">-{formatCurrency(data?.weekly.expense || 0)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-600" />
              Recent Transactions
            </h2>
            <Link href="/transactions" className="text-sm text-blue-600 font-semibold hover:underline">View All</Link>
          </div>
          <TransactionList refreshKey={0} />
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            Insights
          </h2>
          <Card className="border-none shadow-xl bg-slate-100 dark:bg-slate-800 rounded-3xl border-dashed border-2 border-slate-200 dark:border-slate-700">
            <CardContent className="p-6 flex flex-col items-center justify-center text-center h-64">
              <PieChart className="h-12 w-12 text-slate-300 mb-4" />
              <p className="text-slate-500 font-medium">
                Add more transactions to see personalized financial insights and spending patterns.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Missing component import in dashboard
import { PieChart } from "lucide-react";
import Link from "next/link";

