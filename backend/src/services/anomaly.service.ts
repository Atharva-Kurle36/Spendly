import { Expense } from '../types';

export class AnomalyService {
  /**
   * Detects spending leaks based on multiple small transactions.
   */
  public detectSpendingLeaks(expenses: Expense[]): any | null {
    // Basic Spending Leak Detector
    // E.g., multiple small transactions (< 50000 paise = ₹500) within a short timeframe (e.g., last 7 days)
    const recentExpenses = expenses.filter(e => {
      const diffDays = (new Date().getTime() - new Date(e.date).getTime()) / (1000 * 3600 * 24);
      return diffDays <= 7;
    });

    const smallTransactions = recentExpenses.filter(e => e.amount < 50000); // under 500 INR
    const totalSmallAmount = smallTransactions.reduce((sum, e) => sum + e.amount, 0);

    if (smallTransactions.length >= 5) {
      return {
        type: 'Spending Leak',
        severity: 'medium',
        title: 'Frequent Small Purchases',
        description: `${smallTransactions.length} small purchases became ₹${totalSmallAmount / 100} this week.`,
        evidence: `You made ${smallTransactions.length} transactions under ₹500 in the last 7 days.`,
        impact: `At this pace, you might spend ₹${(totalSmallAmount * 4) / 100} this month on small items.`,
        recommendation: 'Create a weekly cap for discretionary spending.',
        action_type: 'create_weekly_cap'
      };
    }

    return null;
  }
}
