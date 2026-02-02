export type TransactionType = "income" | "expense";

export const TRANSACTION_CATEGORIES: Record<TransactionType, string[]> = {
    income: [
        "Salary",
        "Freelance",
        "Investment",
        "Gift",
        "Business",
        "Other Income",
    ],
    expense: [
        "Food",
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
        "Other Expense",
    ],
};

export const ALL_CATEGORIES = [
    ...TRANSACTION_CATEGORIES.income,
    ...TRANSACTION_CATEGORIES.expense,
].sort();
