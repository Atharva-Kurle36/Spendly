import { LayoutDashboard, Receipt, Wallet, PieChart, ShieldAlert, Target } from 'lucide-react';
import { ROUTES } from './routes';

export const MAIN_NAV = [
  { name: 'Overview', href: ROUTES.dashboard.root, icon: LayoutDashboard },
  { name: 'Transactions', href: ROUTES.dashboard.transactions, icon: Receipt },
  { name: 'Budgets', href: ROUTES.dashboard.budgets, icon: Wallet },
  { name: 'Insights', href: ROUTES.dashboard.insights, icon: PieChart },
  { name: 'Bills', href: ROUTES.dashboard.bills, icon: ShieldAlert },
  { name: 'Goals', href: ROUTES.dashboard.goals, icon: Target },
] as const;
