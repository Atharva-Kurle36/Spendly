export class LLMProvider {
  private openRouterKey?: string;
  private geminiKey?: string;
  
  constructor(openRouterKey?: string, geminiKey?: string) {
    this.openRouterKey = openRouterKey;
    this.geminiKey = geminiKey;
  }

  private async callGemini(prompt: string, maxTokens: number): Promise<string> {
    if (!this.geminiKey) {
      throw new Error("No Gemini API key configured");
    }

    const model = "gemini-3.5-flash-lite";
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${this.geminiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          maxOutputTokens: maxTokens,
          responseMimeType: "application/json"
        }
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Google Gemini API error: ${response.statusText} - ${errText}`);
    }

    const data: any = await response.json();
    return data.candidates[0].content.parts[0].text;
  }

  private async callOpenRouter(prompt: string, maxTokens: number): Promise<string> {
    if (!this.openRouterKey) {
      throw new Error("No OpenRouter API key configured");
    }

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${this.openRouterKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://smartwallet.app", 
        "X-Title": "SmartWallet AI" 
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash", 
        max_tokens: maxTokens,
        messages: [
          { role: "system", content: "You output strict JSON only." },
          { role: "user", content: prompt }
        ]
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`OpenRouter API error: ${response.statusText} - ${errText}`);
    }

    const data: any = await response.json();
    return data.choices[0].message.content;
  }

  async generateInsight(transactions: any[], budgets: any[]): Promise<any> {
    const prompt = `You are a financial AI. Analyze transactions and budgets. Output strict JSON only:
{"type":"Spending Leak|Budget Overrun|Optimization","severity":"low|medium|high","title":"string","description":"2 sentences on where money is spent most","evidence":"string","impact":"string","recommendation":"string","action_type":"string"}

Transactions:${JSON.stringify(transactions)}
Budgets:${JSON.stringify(budgets)}`;

    let content = "";
    
    // Prioritize Google Gemini AI Studio (fast, free/cost-effective, reliable)
    if (this.geminiKey) {
      try {
        content = await this.callGemini(prompt, 600);
      } catch (geminiError) {
        console.warn("Gemini AI Studio failed, falling back to OpenRouter...", geminiError);
        if (this.openRouterKey) {
          content = await this.callOpenRouter(prompt, 600);
        } else {
          throw geminiError;
        }
      }
    } else if (this.openRouterKey) {
      content = await this.callOpenRouter(prompt, 600);
    } else {
      throw new Error("No AI provider key configured");
    }
    
    content = content.replace(/```json/g, "").replace(/```/g, "").trim();
    
    try {
      return JSON.parse(content);
    } catch (e) {
      console.error("Failed to parse LLM response:", content);
      throw new Error("Invalid JSON response from LLM");
    }
  }

  async parseStatementText(text: string): Promise<any> {
    const prompt = `Extract financial data from text into strict JSON:
{"transactions":[{"date":"YYYY-MM-DD","merchant":"string","amount":number,"type":"debit|credit","category_name":"Food & Dining|Transport|Shopping|Bills & Utilities|Entertainment|Health & Wellness|General"}],"bills":[{"merchant":"string","amount":number,"due_date":"YYYY-MM-DD"}],"budgets":[{"category_name":"string","limit_amount":number}],"insight":{"title":"string","description":"string","action_type":"string"}}

Text:
${text}`;

    let content = "";
    
    // Prioritize Google Gemini AI Studio (fast, free/cost-effective, reliable)
    if (this.geminiKey) {
      try {
        content = await this.callGemini(prompt, 2000);
      } catch (geminiError) {
        console.warn("Gemini AI Studio failed, falling back to OpenRouter...", geminiError);
        if (this.openRouterKey) {
          content = await this.callOpenRouter(prompt, 2000);
        } else {
          throw geminiError;
        }
      }
    } else if (this.openRouterKey) {
      content = await this.callOpenRouter(prompt, 2000);
    } else {
      throw new Error("No AI provider key configured");
    }
    
    content = content.replace(/```json/g, "").replace(/```/g, "").trim();

    try {
      return JSON.parse(content);
    } catch (e) {
      console.error("Failed to parse LLM response:", content);
      throw new Error("Invalid JSON response from LLM during statement extraction");
    }
  }
}
