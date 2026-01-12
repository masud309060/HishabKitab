# <p align="center">Hishab Kitab - Your Personal Finance Companion</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/masud309060/HishabKitab/refs/heads/main/public/dashboard.png" alt="Hishab Kitab Banner" width="100%">
</p>

<p align="center">
  <strong>Master your money with ease and elegance.</strong><br>
  Track transactions, visualize your spending, and achieve your financial goals with Hishab Kitab.
</p>

---

## 🌟 Overview

**Hishab Kitab** is a modern, full-stack personal finance management application designed to give you complete control over your financial life. Built with a focus on user experience and data security, it allows you to effortlessly track income and expenses, monitor your balance in real-time, and gain deep insights through detailed visual reports.

## ✨ Key Features

-   **🔐 Secure Authentication**: Multi-factor ready authentication powered by NextAuth.js.
-   **📊 Dynamic Dashboard**: A comprehensive overview of your financial health, including total balance, recent transactions, and spending summaries.
-   **📈 Transaction Management**: Effortlessly add, edit, and categorize your income and expenses.
-   **📅 Insightful Reports**: Weekly and monthly analytical reports to help you understand your spending patterns.
-   **🌍 Multi-Currency Support**: Manage your finances in your preferred currency (BDT, USD, EUR, etc.).
-   **🌓 Theme Customization**: Elegant light and dark modes to suit your preference.
-   **📱 Responsive Design**: Fully optimized for a seamless experience across all devices.

## 🚀 Tech Stack

-   **Frontend**: [Next.js](https://nextjs.org/) (App Router), [React](https://reactjs.org/), [Tailwind CSS](https://tailwindcss.com/)
-   **Backend**: [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
-   **Database**: [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
-   **Authentication**: [NextAuth.js](https://next-auth.js.org/)
-   **Form Management**: [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)
-   **Icons & UI**: [Lucide React](https://lucide.dev/), [Radix UI](https://www.radix-ui.com/), [Shadcn UI](https://ui.shadcn.com/)

## 🛠️ Getting Started

### Prerequisites

-   [Node.js](https://nodejs.org/) (v18.0 or later)
-   [MongoDB](https://www.mongodb.com/try/download/community) (Local or Atlas)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/masud309060/HishabKitab.git
    cd HishabKitab
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env.local` file in the root directory and add the following:
    ```env
    MONGODB_URI=your_mongodb_connection_string
    NEXTAUTH_SECRET=your_nextauth_secret
    NEXTAUTH_URL=http://localhost:3000
    ```
    *(See `.example.env.local` for a template)*

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

5.  **Open the app:**
    Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

## 📂 Project Structure

```text
├── app/             # Next.js App Router (Pages, API, Layouts)
├── (protected)/     # Authenticated routes
├── components/      # Reusable UI components
├── lib/             # Utility functions and shared logic
├── models/          # Mongoose schemas and models
├── public/          # Static assets
└── types/           # TypeScript definitions
```

<!-- ## 🗺️ Roadmap

-   [ ] **Plan Generator**: AI-driven budget planning for various projects (Renovation, Decoration, etc.).
-   [ ] **Savings Goals**: Set and track progress towards specific financial targets.
-   [ ] **Bill Reminders**: Automated notifications for upcoming payments.
-   [ ] **Export Data**: Download your financial reports in PDF or CSV format. -->

<!-- ## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. -->

<!-- ## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. -->

<!-- --- -->

<p align="center">Made with ❤️ by <a href="https://github.com/masud309060">Masud Rana</a></p>
