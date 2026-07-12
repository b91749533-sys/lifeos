import { Controller, Get, Post, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { ActiveUser } from '../auth/user.decorator';
import { PrismaService } from '../prisma/prisma.service';
import { AiService } from '../ai/ai.service';

@Controller('habits')
@UseGuards(AuthGuard)
export class HabitsController {
  constructor(
    private prisma: PrismaService,
    private aiService: AiService,
  ) {}

  @Get()
  async getHabits(@ActiveUser() user: any) {
    return this.prisma.habit.findMany({
      where: { userId: user.id },
      include: { completions: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  @Post()
  async createHabit(
    @ActiveUser() user: any,
    @Body() body: { name: string; frequency?: string },
  ) {
    return this.prisma.habit.create({
      data: {
        userId: user.id,
        name: body.name,
        frequency: body.frequency || 'DAILY',
      },
      include: { completions: true },
    });
  }

  @Post(':id/toggle')
  async toggleHabit(@Param('id') id: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const nextDay = new Date(today);
    nextDay.setDate(today.getDate() + 1);

    // Check if logged today
    const existingLog = await this.prisma.habitLog.findFirst({
      where: {
        habitId: id,
        date: {
          gte: today,
          lt: nextDay,
        },
      },
    });

    if (existingLog) {
      // Untoggle: delete log
      await this.prisma.habitLog.delete({ where: { id: existingLog.id } });
    } else {
      // Toggle: create log
      await this.prisma.habitLog.create({
        data: {
          habitId: id,
          date: today,
        },
      });
    }

    // Recalculate streak
    const habit = await this.prisma.habit.findUnique({
      where: { id },
      include: { completions: { orderBy: { date: 'desc' } } },
    });

    if (!habit) return { error: 'Habit not found' };

    let currentStreak = 0;
    const completedDates = habit.completions.map(c => {
      const d = new Date(c.date);
      d.setHours(0,0,0,0);
      return d.getTime();
    });

    // Remove duplicates
    const uniqueDates = Array.from(new Set(completedDates)).sort((a,b) => b - a);

    // Calculate streak
    let checkDate = new Date();
    checkDate.setHours(0, 0, 0, 0);
    
    // If not completed today, check if completed yesterday to keep streak alive
    let idx = 0;
    if (uniqueDates.length > 0) {
      const todayTime = checkDate.getTime();
      const yesterday = new Date(checkDate);
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayTime = yesterday.getTime();

      if (uniqueDates[0] === todayTime || uniqueDates[0] === yesterdayTime) {
        let expectedTime = uniqueDates[0];
        while (uniqueDates.includes(expectedTime)) {
          currentStreak++;
          const nextExpected = new Date(expectedTime);
          nextExpected.setDate(nextExpected.getDate() - 1);
          expectedTime = nextExpected.getTime();
        }
      }
    }

    const bestStreak = Math.max(habit.bestStreak, currentStreak);

    const updated = await this.prisma.habit.update({
      where: { id },
      data: {
        streak: currentStreak,
        bestStreak,
      },
      include: { completions: true },
    });

    return updated;
  }

  @Delete(':id')
  async deleteHabit(@Param('id') id: string) {
    await this.prisma.habit.delete({ where: { id } });
    return { success: true };
  }

  @Get('stats')
  async getHabitStats(@ActiveUser() user: any) {
    const habits = await this.prisma.habit.findMany({
      where: { userId: user.id },
      include: { completions: true },
    });

    // Generate AI Coaching advice for habits
    const coaching = await this.aiService.generateText(
      `You are a premium AI habits coach. Look at the user's habits list: ${JSON.stringify(
        habits.map(h => ({ name: h.name, streak: h.streak, totalCompletions: h.completions.length }))
      )}. Provide 2 sentences of highly motivating, tailored advice. Start with 'Hey Youssef,'`,
    );

    return {
      habits: habits.map(h => ({
        id: h.id,
        name: h.name,
        streak: h.streak,
        bestStreak: h.bestStreak,
        totalCompletions: h.completions.length,
        completions: h.completions,
      })),
      coaching,
    };
  }
}
