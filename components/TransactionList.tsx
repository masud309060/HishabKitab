"use client";

import { useState, useEffect } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  subMonths,
  startOfWeek,
  endOfWeek,
  subWeeks,
  endOfDay
} from "date-fns";
import {
  Trash2,
  Edit2,
  ArrowUpRight,
  ArrowDownLeft,
  MoreVertical,
  Search, Calendar as CalendarIcon,
  X
} from "lucide-react";
import { toast } from "sonner";
import TransactionForm from "./TransactionForm";
import { ALL_CATEGORIES } from "@/lib/constants";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useSettings } from "./SettingsProvider";

interface Transaction {
  _id: string;
  amount: number;
  category: string;
  date: string;
  note: string;
  type: "income" | "expense";
}

export default function TransactionList({ refreshKey }: { refreshKey: number }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRange, setFilterRange] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [customDate, setCustomDate] = useState<{ from: Date; to?: Date } | undefined>();
  const { formatCurrency } = useSettings();

  const getFilterDates = () => {
    const now = new Date();
    switch (filterRange) {
      case "this-month":
        return { start: startOfMonth(now), end: endOfMonth(now) };
      case "last-month":
        const lastMonth = subMonths(now, 1);
        return { start: startOfMonth(lastMonth), end: endOfMonth(lastMonth) };
      case "this-week":
        return { start: startOfWeek(now), end: endOfWeek(now) };
      case "last-week":
        const lastWeek = subWeeks(now, 1);
        return { start: startOfWeek(lastWeek), end: endOfWeek(lastWeek) };
      case "custom":
        return customDate ? { 
            start: customDate.from, 
            end: customDate.to ? endOfDay(customDate.to) : endOfDay(customDate.from) 
        } : { start: null, end: null };
      default:
        return { start: null, end: null };
    }
  };

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const { start, end } = getFilterDates();
      const params = new URLSearchParams();
      if (start) params.append("startDate", start.toISOString());
      if (end) params.append("endDate", end.toISOString());
      if (filterCategory !== "all") params.append("category", filterCategory);

      const res = await fetch(`/api/transactions?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setTransactions(data);
      }
    } catch (error) {
      toast.error("Failed to load transactions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [refreshKey, filterRange, filterCategory, customDate]);


  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this transaction?")) return;

    try {
      const res = await fetch(`/api/transactions/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success("Transaction deleted");
        fetchTransactions();
      } else {
        toast.error("Failed to delete transaction");
      }
    } catch (err) {
      toast.error("An unexpected error occurred");
    }
  };

  const filteredTransactions = transactions.filter((t) =>
    t.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.note?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input 
            placeholder="Search notes or categories..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-xl"
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          <Select value={filterRange} onValueChange={setFilterRange}>
            <SelectTrigger className="w-[140px] rounded-xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
              <SelectValue placeholder="Date Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="this-month">This Month</SelectItem>
              <SelectItem value="last-month">Last Month</SelectItem>
              <SelectItem value="this-week">This Week</SelectItem>
              <SelectItem value="last-week">Last Week</SelectItem>
              <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>

          {filterRange === "custom" && (
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="rounded-xl border-slate-200 dark:border-slate-800 gap-2">
                  <CalendarIcon className="h-4 w-4" />
                  {customDate?.from ? (
                    customDate.to ? (
                      <>
                        {format(customDate.from, "LLL dd")} - {format(customDate.to, "LLL dd")}
                      </>
                    ) : (
                      format(customDate.from, "LLL dd")
                    )
                  ) : (
                    "Pick a range"
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 border-none shadow-2xl rounded-2xl" align="end">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={customDate?.from}
                  selected={{ from: customDate?.from, to: customDate?.to }}
                  onSelect={(range: any) => setCustomDate(range)}
                  className="rounded-2xl"
                />
              </PopoverContent>
            </Popover>
          )}

          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-[160px] rounded-xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {ALL_CATEGORIES.map(cat => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {(filterRange !== "all" || filterCategory !== "all") && (
            <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-xl text-slate-500 hover:text-slate-900"
                onClick={() => {
                    setFilterRange("all");
                    setFilterCategory("all");
                    setCustomDate(undefined);
                }}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/50 dark:bg-slate-800/50">
              <TableHead className="w-[100px]">Type</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="hidden md:table-cell">Note</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              [...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={6}>
                    <div className="h-12 w-full bg-slate-100 dark:bg-slate-800 animate-pulse rounded-xl" />
                  </TableCell>
                </TableRow>
              ))
            ) : filteredTransactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center text-slate-500">
                  No transactions found.
                </TableCell>
              </TableRow>
            ) : (
              filteredTransactions.map((t) => (
                <TableRow key={t._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                  <TableCell>
                    <div className={cn(
                      "p-2 rounded-lg w-fit",
                      t.type === "income" ? "bg-green-100 dark:bg-green-900/30 text-green-600" : "bg-red-100 dark:bg-red-900/30 text-red-600"
                    )}>
                      {t.type === "income" ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownLeft className="h-4 w-4" />}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{t.category}</TableCell>
                  <TableCell className="text-slate-500 dark:text-slate-400">
                    {format(new Date(t.date), "MMM dd, yyyy")}
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-slate-500 dark:text-slate-400">
                    {t.note || "-"}
                  </TableCell>
                  <TableCell className={cn(
                    "text-right font-bold",
                    t.type === "income" ? "text-green-600" : "text-slate-900 dark:text-slate-100"
                  )}>
                    {t.type === "income" ? "+" : "-"}{formatCurrency(t.amount)}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="rounded-xl border-slate-200 dark:border-slate-800 p-2 shadow-xl">
                        <TransactionForm 
                          onSuccess={fetchTransactions} 
                          editTransaction={t} 
                          trigger={
                            <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="rounded-lg gap-2 cursor-pointer">
                              <Edit2 className="h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                          }
                        />
                        <DropdownMenuItem 
                          className="rounded-lg gap-2 text-red-600 focus:text-red-600 cursor-pointer"
                          onClick={() => handleDelete(t._id)}
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
