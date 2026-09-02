export class LLMProvider {
  private apiKey: string;
  
  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generateInsight(transactions: any[], budgets: any[]): Promise<any> {
    const prompt = `
You are an expert AI financial awareness assistant for the SmartWallet AI app.
Your goal is to analyze the user's recent transactions and budget context and provide a structured, highly detailed financial insight.
Pay special attention to WHERE the user spends the most money. 
Identify their top spending categories and provide specific, actionable suggestions on how they can reduce expenditure.
If many transactions are uncategorized, highlight the need to categorize them.

You must ONLY output JSON in the following format:
{
  "type": "string (e.g., Spending Leak, Budget Overrun, Unusual Activity, Optimization)",
  "severity": "low|medium|high",
  "title": "string (e.g., High Dining Expenses, Uncategorized Spending)",
  "description": "string (A detailed 2-3 sentence paragraph explaining where they spend the most money and exactly what is happening)",
  "evidence": "string (Specific data points backing up your claim)",
  "impact": "string (How this affects their overall financial health)",
  "recommendation": "string (Concrete, actionable advice on how to cut back or optimize)",
  "action_type": "string (A short action button label, e.g., 'Review Dining', 'Categorize Transactions', 'Adjust Budget')"
}

Do NOT output anything other than this JSON. Do NOT wrap it in markdown block quotes.

Transactions Context:
${JSON.stringify(transactions, null, 2)}

Budgets Context:
${JSON.stringify(budgets, null, 2)}
    `;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${this.apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "openrouter/auto", // Or specific free model if preferred
        messages: [
          { role: "system", content: "You are a specialized AI assistant that only outputs JSON for the SmartWallet AI application." },
          { role: "user", content: prompt }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.statusText}`);
    }

    const data: any = await response.json();
    let content = data.choices[0].message.content;
    
    // Clean up potential markdown formatting that some models ignore instructions to omit
    content = content.replace(/```json/g, "").replace(/```/g, "").trim();
    
    try {
      return JSON.parse(content);
    } catch (e) {
      console.error("Failed to parse LLM response:", content);
      throw new Error("Invalid JSON response from LLM");
    }
  }
  async parseStatementText(text: string): Promise<any> {
    const prompt = `
You are a highly accurate financial data extraction assistant.
I will provide you with the raw extracted text from a bank statement PDF.
Your task is to extract the transactions, detect recurring bills, recommend budgets, and generate a primary insight.
Return a strict JSON object. Do NOT include anything else, NO markdown wrapper, JUST the JSON object.

Required format:
{
  "transactions": [
    {
      "date": "YYYY-MM-DD",
      "merchant": "Name of the entity",
      "amount": 120.50,
      "type": "debit|credit",
      "category_name": "Food & Dining | Transport | Shopping | Bills & Utilities | Entertainment | Health & Wellness | General"
    }
  ],
  "bills": [
    {
      "merchant": "Netflix",
      "amount": 649,
      "due_date": "YYYY-MM-DD"
    }
  ],
  "budgets": [
    {
      "category_name": "Food & Dining",
      "limit_amount": 10000
    }
  ],
  "insight": {
    "title": "High Dining Expenses",
    "description": "You spent heavily on food this month. Try cooking at home to save up.",
    "action_type": "Review Dining"
  }
}

Text:
${text}
    `;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${this.apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "openrouter/auto", 
        messages: [
          { role: "system", content: "You are a specialized AI assistant that only outputs JSON objects for the SmartWallet AI application." },
          { role: "user", content: prompt }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.statusText}`);
    }

    const data: any = await response.json();
    let content = data.choices[0].message.content;
    
    // Clean up potential markdown formatting that some models ignore instructions to omit
    content = content.replace(/```json/g, "").replace(/```/g, "").trim();

    try {
      return JSON.parse(content);
    } catch (e) {
      console.error("Failed to parse LLM response:", content);
      throw new Error("Invalid JSON response from LLM during statement extraction");
    }
  }
}
