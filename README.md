# Finora — AI Wealth Advisory & Portfolio Ledger (₹ INR)

**Finora** is a personalized Indian wealth advisory and institutional portfolio ledger platform designed for investors, salaried professionals, and high-net-worth individuals in India. Built with clean, human-crafted fintech design (inspired by Linear and Stripe), Finora replaces generic AI toys and flashy cyberpunk glows with genuine SEBI RIA-grade financial intelligence, Indian statutory tax optimization (Union Budget 2024-25), and retirement solvency modeling.

---

## Key Features & Capabilities

### 1. Portfolio Ledger & Real-Time Holdings
- **Consolidated Net Worth Tracking**: Real-time valuation across Mutual Funds, Direct Stocks, Fixed Income (PPF / EPF), Sovereign Gold Bonds (SGB), and Liquid Cash Reserves.
- **Indian Numbering Format & Currency**: Native ₹ INR representation with Lakhs (L) and Crores (Cr).
- **Interactive Asset Weighting Donut**: Inner donut chart showing total portfolio valuation with category-specific hover metrics and drill-down filters.
- **Client-Side CSV Statement Export**: Instant download of your investment ledger with broker and ticker details.
- **Position Management**: Intuitive modal to add positions with custom SIP amounts and broker tags.

### 2. SEBI RIA Quarterly Wealth Advisory & Tax Optimization
- **Fiduciary Advisory Memorandum**: Executive overview, macro market context (Nifty 50 TRI & CRISIL Bond benchmarks), and statutory guidance.
- **Dynamic Portfolio Rebalancing Engine**: Real-time mathematical drift analysis comparing your current allocation to institutional target mandates with actionable capital directives (Trim / Deploy orders in ₹).
- **Budget 2024 Section 112A LTCG Tax Harvester**: Monitors the updated ₹1.25 Lakhs annual Long-Term Capital Gains tax exemption limit on equity investments and provides step-by-step guidance to tax-harvest gains before March 31.
- **Section 115BAC Income Tax Regime Optimizer**: Direct side-by-side comparison between the New Tax Regime (₹75k standard deduction and revised Budget 2024 slabs) and the Old Tax Regime, calculating exact net annual tax savings.

### 3. Life Milestones & FIRE Solvency Engine
- **Retirement & FIRE Modeling**: Calculates required target corpus based on 6.0% Indian inflation and the 30x annual expenditure rule.
- **Trajectory Simulation**: Area chart comparing projected net worth compounding against target milestones from your current age to target retirement.
- **Milestone Tracking**: Visual progress bars and funding statuses for emergency runway, home purchases, travel funds, and higher education.

### 4. Demographics, Slabs & Session-Only Persistence
- **Customizable Baseline Parameters**: Manage salary, living expenses, retirement age, domicile city, tax regime, and risk tolerance.
- **Session-Scoped Storage**: User modifications are persisted safely in the browser's `sessionStorage` with a 30-minute sliding activity window.
- **Automatic Default Reset**: When the session ends, expires, or the page is reopened, Finora automatically restores default institutional baseline data.
- **1-Click Reset**: Instant "Reset Defaults" action to wipe customized session data on demand.

### 5. Institutional Dark & Light Mode
- **Top Bar Theme Switcher**: 1-click toggle with Moon/Sun icon feedback.
- **Editorial Dark Theme**: Deep slate surfaces (`bg-slate-900`, `bg-slate-950`) with high-contrast text and zero eye-straining neon glows.
- **Persistent Theme Preference**: Saved in `localStorage` and respects OS system preferences (`prefers-color-scheme`).

---

## Tech Stack

- **Framework**: React 18 with TypeScript
- **Bundler & Dev Server**: Vite 5
- **Styling**: Tailwind CSS with custom institutional design system
- **Charts & Data Visualization**: Recharts
- **Icons**: Lucide React
- **Formatting**: Native Indian Currency (`Intl.NumberFormat('en-IN')`)

---

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/<your-username>/finora.git
cd finora

# Install dependencies
npm install

# Start the Vite development server
npm run dev
```

### Production Build
```bash
npm run build
npm run preview
```

---

## License
MIT License.
