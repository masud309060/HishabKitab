export type TransactionType = "income" | "expense";

export const TRANSACTION_CATEGORIES: Record<TransactionType, string[]> = {
    income: [
        "Salary",
        "Business",
        "Freelance",
        "Investment",
        "Gift",
        "Other Income",
    ],
    expense: [
        "Food & Groceries",
        "Rent",
        "Utilities",
        "Transport",
        "Shopping",
        "Entertainment",
        "Health",
        "Bill",
        "Subscription",
        "Education",
        "Travel",
        "Insurance",
        "Tax",
        "Personal Care",
        "Other Expense",
    ],
};

export const ALL_CATEGORIES = [
    ...TRANSACTION_CATEGORIES.income,
    ...TRANSACTION_CATEGORIES.expense,
].sort();
