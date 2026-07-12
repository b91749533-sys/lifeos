import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { ActiveUser } from '../auth/user.decorator';
import { PrismaService } from '../prisma/prisma.service';
import { AiService } from '../ai/ai.service';

@Controller('dashboard')
@UseGuards(AuthGuard)
export class DashboardController {
  constructor(
    private prisma: PrismaService,
    private aiService: AiService,
  ) {}

  @Get()
  async getDashboardData(@ActiveUser() user: any) {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    // 1. Today's Tasks
    const tasks = await this.prisma.task.findMany({
      where: {
        userId: user.id,
        OR: [
          { dueDate: { gte: todayStart, lte: todayEnd } },
          { status: { not: 'DONE' } },
        ],
      },
      include: { subtasks: true },
      take: 10,
    });

    // 2. Today's Calendar Events
    const events = await this.prisma.event.findMany({
      where: {
        userId: user.id,
        startTime: { lte: todayEnd },
        endTime: { gte: todayStart },
      },
      orderBy: { startTime: 'asc' },
    });

    // 3. Habits & Completion Logs
    const habits = await this.prisma.habit.findMany({
      where: { userId: user.id },
      include: {
        completions: {
          where: {
            date: { gte: todayStart, lte: todayEnd },
          },
        },
      },
    });

    // 4. Goals & Progress
    const goals = await this.prisma.goal.findMany({
      where: { userId: user.id },
      include: { milestones: true },
      take: 5,
    });

    // 5. Finance Summary
    const expensesToday = await this.prisma.expense.findMany({
      where: {
        userId: user.id,
        date: { gte: todayStart, lte: todayEnd },
      },
    });
    const totalSpentToday = expensesToday
      .filter((e) => e.type === 'EXPENSE')
      .reduce((sum, e) => sum + e.amount, 0);

    const budgets = await this.prisma.budget.findMany({
      where: { userId: user.id },
    });

    // 6. Workout & Health logs
    const workoutsToday = await this.prisma.workout.findMany({
      where: {
        userId: user.id,
        createdAt: { gte: todayStart, lte: todayEnd },
      },
      include: { exercises: true },
    });

    // Recent sleep & water total from workouts
    const latestWorkoutWithHealth = await this.prisma.workout.findFirst({
      where: { userId: user.id, sleepHours: { not: null } },
      orderBy: { createdAt: 'desc' },
    });

    // 7. AI Daily Briefing
    const briefing = await this.aiService.getDailyBriefing(habits, tasks, goals);

    // 8. Notifications
    const unreadNotifications = await this.prisma.notification.findMany({
      where: { userId: user.id, read: false },
      orderBy: { createdAt: 'desc' },
      take: 5,
    });

    return {
      user: {
        name: user.name,
        email: user.email,
        settings: user.settings,
      },
      briefing,
      tasks,
      events,
      habits: habits.map((h) => ({
        id: h.id,
        name: h.name,
        frequency: h.frequency,
        streak: h.streak,
        completedToday: h.completions.length > 0,
      })),
      goals,
      finance: {
        spentToday: totalSpentToday,
        budgets,
      },
      health: {
        workoutsToday: workoutsToday.length,
        sleep: latestWorkoutWithHealth?.sleepHours || null,
        water: latestWorkoutWithHealth?.waterIntake || null,
        calories: latestWorkoutWithHealth?.caloriesBurned || null,
      },
      notifications: unreadNotifications,
    };
  }
}
