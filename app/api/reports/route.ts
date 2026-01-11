import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/mongodb";
import Transaction from "@/models/Transaction";
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek } from "date-fns";
import mongoose from "mongoose";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();
        const userId = (session.user as any).id;

        // Total Summary (All time)
        const summary = await Transaction.aggregate([
            { $match: { userId: new mongoose.Types.ObjectId(userId) } },
            {
                $group: {
                    _id: "$type",
                    total: { $sum: "$amount" },
                },
            },
        ]);

        const stats = {
            income: summary.find((s) => s._id === "income")?.total || 0,
            expense: summary.find((s) => s._id === "expense")?.total || 0,
        };

        // Monthly Summary
        const now = new Date();
        const monthlySummary = await Transaction.aggregate([
            {
                $match: {
                    userId: new mongoose.Types.ObjectId(userId),
                    date: { $gte: startOfMonth(now), $lte: endOfMonth(now) },
                },
            },
            {
                $group: {
                    _id: "$type",
                    total: { $sum: "$amount" },
                },
            },
        ]);

        const monthlyStats = {
            income: monthlySummary.find((s) => s._id === "income")?.total || 0,
            expense: monthlySummary.find((s) => s._id === "expense")?.total || 0,
        };

        // Weekly Summary
        const weeklySummary = await Transaction.aggregate([
            {
                $match: {
                    userId: new mongoose.Types.ObjectId(userId),
                    date: { $gte: startOfWeek(now), $lte: endOfWeek(now) },
                },
            },
            {
                $group: {
                    _id: "$type",
                    total: { $sum: "$amount" },
                },
            },
        ]);

        const weeklyStats = {
            income: weeklySummary.find((s) => s._id === "income")?.total || 0,
            expense: weeklySummary.find((s) => s._id === "expense")?.total || 0,
        };

        return NextResponse.json({
            allTime: stats,
            monthly: monthlyStats,
            weekly: weeklyStats,
        });
    } catch (error: any) {
        return NextResponse.json({ message: "Server error", error: error.message }, { status: 500 });
    }
}
