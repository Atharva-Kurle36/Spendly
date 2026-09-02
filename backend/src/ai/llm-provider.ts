export class LLMProvider {
  private apiKey: string;
  
  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generateInsight(transactions: any[], budgets: any[]): Promise<any> {
    const prompt = `
You are an expert AI financial awareness assistant for the SmartWallet AI app.
Your goal is to analyze the user's recent transactions and budget context and provide a structured financial insight.
You must ONLY output JSON in the following format:
{
  "type": "string (e.g., Spending Leak, Budget Overrun, Unusual Activity)",
  "severity": "low|medium|high",
  "title": "string",
  "description": "string",
  "evidence": "string (explain why)",
  "impact": "string",
  "recommendation": "string",
  "action_type": "string"
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
    const content = data.choices[0].message.content;
    
    try {
      return JSON.parse(content);
    } catch (e) {
      console.error("Failed to parse LLM response:", content);
      throw new Error("Invalid JSON response from LLM");
    }
  }
}
