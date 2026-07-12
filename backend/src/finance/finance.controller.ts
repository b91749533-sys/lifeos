import { Controller, Get, Post, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { ActiveUser } from '../auth/user.decorator';
import { PrismaService } from '../prisma/prisma.service';
import { AiService } from '../ai/ai.service';

@Controller('finance')
@UseGuards(AuthGuard)
export class FinanceController {
  constructor(
    private prisma: PrismaService,
    private aiService: AiService,
  ) {}

  @Get()
  async getFinanceData(@ActiveUser() user: any) {
    const expenses = await this.prisma.expense.findMany({
      where: { userId: user.id },
      orderBy: { date: 'desc' },
    });

    const budgets = await this.prisma.budget.findMany({
      where: { userId: user.id },
    });

    // Compute metrics
    const totalIncome = expenses
      .filter(e => e.type === 'INCOME')
      .reduce((sum, e) => sum + e.amount, 0);

    const totalExpense = expenses
      .filter(e => e.type === 'EXPENSE')
      .reduce((sum, e) => sum + e.amount, 0);

    const totalSavings = expenses
      .filter(e => e.type === 'SAVING')
      .reduce((sum, e) => sum + e.amount, 0);

    const totalInvestments = expenses
      .filter(e => e.type === 'INVESTMENT')
      .reduce((sum, e) => sum + e.amount, 0);

    return {
      expenses,
      budgets,
      summary: {
        income: totalIncome,
        expenses: totalExpense,
        savings: totalSavings,
        investments: totalInvestments,
        netBalance: totalIncome - totalExpense - totalSavings - totalInvestments,
      },
    };
  }

  @Post('expenses')
  async logExpense(
    @ActiveUser() user: any,
    @Body() body: { amount: number; category: string; description?: string; type?: string; date?: string },
  ) {
    return this.prisma.expense.create({
      data: {
        userId: user.id,
        amount: body.amount,
        category: body.category,
        description: body.description,
        type: body.type || 'EXPENSE',
        date: body.date ? new Date(body.date) : new Date(),
      },
    });
  }

  @Post('budgets')
  async createOrUpdateBudget(
    @ActiveUser() user: any,
    @Body() body: { category: string; limit: number; period?: string },
  ) {
    const existing = await this.prisma.budget.findFirst({
      where: { userId: user.id, category: body.category },
    });

    if (existing) {
      return this.prisma.budget.update({
        where: { id: existing.id },
        data: { limit: body.limit, period: body.period || 'MONTHLY' },
      });
    }

    return this.prisma.budget.create({
      data: {
        userId: user.id,
        category: body.category,
        limit: body.limit,
        period: body.period || 'MONTHLY',
      },
    });
  }

  @Delete('expenses/:id')
  async deleteExpense(@Param('id') id: string) {
    await this.prisma.expense.delete({ where: { id } });
    return { success: true };
  }

  @Get('insights')
  async getInsights(@ActiveUser() user: any) {
    const expenses = await this.prisma.expense.findMany({
      where: { userId: user.id },
      take: 100, // Limit context to recent 100 items
    });
    const budgets = await this.prisma.budget.findMany({
      where: { userId: user.id },
    });

    const insights = await this.aiService.analyzeExpenses(expenses, budgets);
    return { insights };
  }
}
