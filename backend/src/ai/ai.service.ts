import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private aiClient: any;
  private readonly useMock: boolean = false;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (!apiKey || apiKey === 'YOUR_GEMINI_API_KEY') {
      this.logger.warn('GEMINI_API_KEY is not configured or is default. Running AI service in MOCK mode.');
      this.useMock = true;
    } else {
      try {
        // Initialize the Gemini API client
        this.aiClient = new GoogleGenerativeAI(apiKey);
      } catch (error) {
        this.logger.error('Failed to initialize Google Gen AI client. Falling back to mock.', error);
        this.useMock = true;
      }
    }
  }

  /**
   * Generates text based on a prompt and optional context payload.
   */
  async generateText(prompt: string, context?: string): Promise<string> {
    if (this.useMock) {
      return this.getMockResponse(prompt);
    }

    try {
      const model = this.aiClient.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const fullPrompt = context 
        ? `Context Information:\n${context}\n\nUser Question/Instruction:\n${prompt}` 
        : prompt;

      const result = await model.generateContent(fullPrompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      this.logger.error('Gemini API call failed, using mock fallback', error);
      return this.getMockResponse(prompt) + '\n\n*(Note: This is a fallback mock response due to an upstream API error)*';
    }
  }

  /**
   * AI schedule optimization.
   */
  async optimizeSchedule(tasks: any[], events: any[]): Promise<string> {
    const context = `Tasks due: ${JSON.stringify(tasks)}\nCalendar events: ${JSON.stringify(events)}`;
    const prompt = `You are LifeOS Scheduler AI. Look at the tasks and calendar events above. Suggest an optimized, realistic time-blocking schedule for today. Ensure there are breaks, deep work blocks, and that urgent tasks are prioritized. Format as a clean markdown table.`;
    return this.generateText(prompt, context);
  }

  /**
   * AI spending analysis.
   */
  async analyzeExpenses(expenses: any[], budgets: any[]): Promise<string> {
    const context = `Expenses: ${JSON.stringify(expenses)}\nBudgets: ${JSON.stringify(budgets)}`;
    const prompt = `You are LifeOS Finance Advisor. Analyze the user's spending data and budgets. Tell them which category they are overspending on, project their savings, and give 3 highly actionable tips to optimize their finances this month. Format nicely with markdown.`;
    return this.generateText(prompt, context);
  }

  /**
   * AI Task breakdown.
   */
  async breakDownTask(taskTitle: string, description: string): Promise<string[]> {
    const prompt = `Break down the task "${taskTitle}" (${description || 'No description'}) into a JSON list of 4-6 small, concrete, and highly actionable subtask titles. Return ONLY a valid JSON string containing an array of strings. Do not include markdown code block formatting like \`\`\`json. Return only the array.`;
    const responseText = await this.generateText(prompt);
    
    try {
      const cleanJson = responseText.replace(/```json|```/gi, '').trim();
      const parsed = JSON.parse(cleanJson);
      if (Array.isArray(parsed)) {
        return parsed.map(item => String(item));
      }
    } catch (e) {
      this.logger.error('Failed to parse subtasks JSON, using standard breakdown.', e);
    }
    
    // Standard mock breakdown if JSON parse fails
    return [
      `Define requirements & initial scope for ${taskTitle}`,
      `Design the core architecture/structure`,
      `Implement the main components/logic`,
      `Write tests and verify results`,
      `Final review & deployment`
    ];
  }

  /**
   * AI Daily Briefing.
   */
  async getDailyBriefing(habits: any[], tasks: any[], goals: any[]): Promise<string> {
    const context = `Habits: ${JSON.stringify(habits)}\nTasks: ${JSON.stringify(tasks)}\nGoals: ${JSON.stringify(goals)}`;
    const prompt = `You are the LifeOS Command Center AI. Formulate a short, inspiring daily briefing (max 150 words). Include a greeting to Youssef Manssouri, a highlight of what to focus on today, and which habit is most in danger of being neglected. Keep the tone professional, premium, and motivating.`;
    return this.generateText(prompt, context);
  }

  /**
   * Mock responses for development
   */
  private getMockResponse(prompt: string): string {
    const lowerPrompt = prompt.toLowerCase();
    
    if (lowerPrompt.includes('schedule') || lowerPrompt.includes('plan my day')) {
      return `### Optimized Time-Blocking Schedule for Youssef Manssouri

Here is your AI-optimized schedule for today, balancing current meetings and high-priority tasks:

| Time | Duration | Activity | Type | Focus Area |
| :--- | :--- | :--- | :--- | :--- |
| **08:30 - 09:00** | 30m | Morning Routine & Daily Briefing | Routine | Mindset |
| **09:00 - 11:30** | 2h 30m | **Deep Work Block: LifeOS Core Architecture** | Focus | Tasks |
| **11:30 - 12:00** | 30m | Active Habit: Hydrate & Stretch Walk | Break | Health |
| **12:00 - 13:00** | 1h 00m | Admin Tasks, Email & Chat Catch-up | Management | Communication |
| **13:00 - 14:00** | 1h 00m | Lunch & Mindfulness Pause | Break | Wellness |
| **14:00 - 16:00** | 2h 00m | **Secondary Work Block: Finance & Notes Sync** | Focus | Study/Dev |
| **16:00 - 17:00** | 1h 00m | Goal Planning & Milestone Review | Review | Goals |
| **17:30 - 19:00** | 1h 30m | Gym Session (Push Day Routine) | Workout | Health |
| **21:00 - 21:30** | 30m | Daily Journal Reflection | Mindset | Habit |

**AI Insight:** Today's critical focus is completing your core architecture model. You have 2 open tasks. Make sure to hydrate during your breaks!`;
    }

    if (lowerPrompt.includes('finance') || lowerPrompt.includes('spending') || lowerPrompt.includes('expense')) {
      return `### AI Financial Insights

Based on your financial tracking data:

1. **Category Analysis:** You have spent **3,200 MAD** on **Restaurants & Food Delivery** this month, which is already **80%** of your monthly limit of 4,000 MAD.
2. **Savings Projection:** With your current income-to-expense ratio, you are on track to save **12,400 MAD** this month. This is **62%** of your monthly goal of 20,000 MAD.
3. **Actionable Recommendations:**
   - *Meal Prep:* Shifting 3 restaurant visits to home cooking will save you approximately **750 MAD** by the end of the month.
   - *Subscription Check:* We detected a subscription charge of **250 MAD** that hasn't been linked to any recent note or activity; consider cancelling if it's inactive.
   - *Investment Auto-Pay:* Set up auto-deposit for your monthly savings goal to avoid emotional spending.`;
    }

    if (lowerPrompt.includes('habit') || lowerPrompt.includes('neglect')) {
      return `### AI Habit Coaching & Streaks

Here is an analysis of your habit logs:

* **In Danger of Neglect:** **Gym & Coding** have not been completed for 3 days. Your streak of 5 days is broken.
* **Strong Performers:** **Drink Water** and **Read** are on a 12-day streak!
* **Recommendation:** Schedule your Gym session for 17:30 today (as blocked in your daily plan) to rebuild momentum. Set a trigger: *\"As soon as I close my laptop, I put on my gym shoes.\"*`;
    }

    if (lowerPrompt.includes('workout') || lowerPrompt.includes('gym')) {
      return `### AI Workout Recommendations

Based on your health records and workout logs:

- **Muscle Group Recovery:** Your chest and arms have recovered 95%. Today is optimal for a **Push Workout** focusing on chest development.
- **Adjustments:**
  - Increase weight on **Bench Press** by 2.5 kg, as you hit all reps in your last 3 sets.
  - Add one extra set of **Lateral Raises** to improve shoulder hypertrophy.
- **Nutrition tip:** Ensure you consume 140g of protein today to support recovery. Drink 3L of water.`;
    }

    if (lowerPrompt.includes('journal') || lowerPrompt.includes('reflection')) {
      return `### AI Daily Journal Reflection

**Sentiment Analysis:** Neutral-Positive with high productivity markers.

**Themes Identified:** Deep focus on building software, minor anxiety about deadlines, but strong commitment to health habits.

**Reflective Question:** *You mentioned feeling rushed during the afternoon. How can you restructure your tasks to allow a 15-minute complete pause between work blocks?*`;
    }

    return `Hello Youssef Manssouri, I am your **LifeOS Intelligence System**.

I have complete context of your personal workspace including:
- **Tasks**: 4 active tasks.
- **Habits**: 6 habits tracked (Water, Gym, Read, Code, Pray, Sleep).
- **Finance**: Monthly budgets in place with 12,400 MAD projected savings.
- **Study Hub**: Course list, GPA weight.
- **Dev Workspace**: Git sync status.

How can I help you organize or optimize your day? Ask me to:
- *"Plan my day"*
- *"Analyze my expenses"*
- *"Provide workout suggestions"*`;
  }
}
