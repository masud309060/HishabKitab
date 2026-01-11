"use client";

import { useEffect, useState } from "react";
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  PieChart, 
  Calendar,
  ArrowRight
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
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

export default function ReportsPage() {
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
        <Skeleton className="h-10 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-64 w-full rounded-3xl" />
          <Skeleton className="h-64 w-full rounded-3xl" />
        </div>
        <Skeleton className="h-96 w-full rounded-3xl" />
      </div>
    );
  }

  const sections = [
    { title: "Weekly Report", stats: data?.weekly, description: "Your financial activity for the current week." },
    { title: "Monthly Report", stats: data?.monthly, description: "Your financial activity for the current month." },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Finance Reports</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Detailed breakdown of your financial health.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {sections.map((section, idx) => {
          const savings = (section.stats?.income || 0) - (section.stats?.expense || 0);
          const savingsRate = section.stats?.income 
            ? ((savings / section.stats.income) * 100).toFixed(1) 
            : "0";

          return (
            <Card key={idx} className="border-none shadow-xl bg-white dark:bg-slate-900 rounded-3xl overflow-hidden group hover:shadow-2xl transition-all duration-500">
              <CardHeader className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                <CardTitle className="flex items-center justify-between">
                  {section.title}
                  <Calendar className="h-4 w-4 text-blue-600" />
                </CardTitle>
                <CardDescription>{section.description}</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-sm text-slate-500 mb-1">Total Income</p>
                      <p className="text-2xl font-bold text-green-600">{formatCurrency(section.stats?.income || 0)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 mb-1 text-right">Total Expenses</p>
                      <p className="text-2xl font-bold text-red-600">{formatCurrency(section.stats?.expense || 0)}</p>
                    </div>
                  </div>

                  <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
                    <div 
                      className="h-full bg-green-500 transition-all duration-1000 ease-out" 
                      style={{ width: `${(section.stats?.income ?? 0) ? (section.stats!.income / ((section.stats!.income || 1) + (section.stats!.expense || 0)) * 100) : 50}%` }}
                    />
                    <div 
                      className="h-full bg-red-500 transition-all duration-1000 ease-out" 
                      style={{ width: `${(section.stats?.expense ?? 0) ? (section.stats!.expense / ((section.stats!.income || 0) + (section.stats!.expense || 1)) * 100) : 50}%` }}
                    />
                  </div>

                  <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Net Savings</p>
                      <p className={cn("text-xl font-bold", savings >= 0 ? "text-blue-600" : "text-red-600 text-sm")}>
                        {savings >= 0 ? formatCurrency(savings) : `-${formatCurrency(Math.abs(savings))}`}
                      </p>
                    </div>
                    <Badge variant={savings >= 0 ? "secondary" : "destructive"} className="px-3 py-1 rounded-lg">
                      {savingsRate}% Saved
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="border-none shadow-xl bg-white dark:bg-slate-900 rounded-3xl overflow-hidden">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-blue-600" />
            Spending Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex flex-col items-center justify-center text-center text-slate-500">
             <PieChart className="h-12 w-12 text-slate-200 mb-4" />
             <p className="max-w-xs mx-auto">
               You haven't spent enough yet! Add more transactions to get a visual breakdown of your spending habits.
             </p>
             <Button variant="ghost" className="mt-4 gap-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50">
               Go to Transactions <ArrowRight className="h-4 w-4" />
             </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
