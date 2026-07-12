import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { ActiveUser } from '../auth/user.decorator';
import { PrismaService } from '../prisma/prisma.service';
import { AiService } from '../ai/ai.service';

@Controller('health')
@UseGuards(AuthGuard)
export class HealthController {
  constructor(
    private prisma: PrismaService,
    private aiService: AiService,
  ) {}

  @Get()
  async getHealthData(@ActiveUser() user: any) {
    const workouts = await this.prisma.workout.findMany({
      where: { userId: user.id },
      include: { exercises: true },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    // Extract weekly stats
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentNutrition = await this.prisma.workout.findMany({
      where: {
        userId: user.id,
        createdAt: { gte: sevenDaysAgo },
      },
      select: {
        createdAt: true,
        waterIntake: true,
        protein: true,
        sleepHours: true,
      },
    });

    return {
      workouts: workouts.map(w => ({
        ...w,
        exercises: w.exercises.map(ex => ({
          ...ex,
          sets: ex.sets ? JSON.parse(ex.sets as string) : [],
        })),
      })),
      recentNutrition,
    };
  }

  @Post('workout')
  async logWorkout(
    @ActiveUser() user: any,
    @Body() body: { title: string; duration?: number; caloriesBurned?: number; exercises: { name: string; sets: { reps: number; weight: number }[] }[] },
  ) {
    const workout = await this.prisma.workout.create({
      data: {
        userId: user.id,
        title: body.title,
        duration: body.duration || 0,
        caloriesBurned: body.caloriesBurned || 0,
      },
    });

    for (const ex of body.exercises) {
      await this.prisma.workoutExercise.create({
        data: {
          workoutId: workout.id,
          name: ex.name,
          sets: JSON.stringify(ex.sets),
        },
      });
    }

    const workoutResult = await this.prisma.workout.findUnique({
      where: { id: workout.id },
      include: { exercises: true },
    });

    return {
      ...workoutResult,
      exercises: workoutResult.exercises.map(ex => ({
        ...ex,
        sets: ex.sets ? JSON.parse(ex.sets) : [],
      })),
    };
  }

  @Post('nutrition')
  async logNutrition(
    @ActiveUser() user: any,
    @Body() body: { waterIntake?: number; protein?: number; sleepHours?: number; caloriesBurned?: number },
  ) {
    // Check if a daily workout entry already exists to attach nutrition details, or create a daily tracker workout log
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const existingToday = await this.prisma.workout.findFirst({
      where: {
        userId: user.id,
        createdAt: { gte: todayStart },
      },
    });

    if (existingToday) {
      return this.prisma.workout.update({
        where: { id: existingToday.id },
        data: {
          waterIntake: body.waterIntake !== undefined ? body.waterIntake : existingToday.waterIntake,
          protein: body.protein !== undefined ? body.protein : existingToday.protein,
          sleepHours: body.sleepHours !== undefined ? body.sleepHours : existingToday.sleepHours,
          caloriesBurned: body.caloriesBurned !== undefined ? body.caloriesBurned : existingToday.caloriesBurned,
        },
      });
    }

    return this.prisma.workout.create({
      data: {
        userId: user.id,
        title: 'Daily Health Sync',
        waterIntake: body.waterIntake || 0,
        protein: body.protein || 0,
        sleepHours: body.sleepHours || 0,
        caloriesBurned: body.caloriesBurned || 0,
      },
    });
  }

  @Get('coaching')
  async getHealthCoaching(@ActiveUser() user: any) {
    const workouts = await this.prisma.workout.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 5,
    });

    const context = `Recent Workouts & Health logs: ${JSON.stringify(workouts)}`;
    const advice = await this.aiService.generateText(
      `You are the LifeOS Gym and Health Advisor. Review the user's workouts, sleep, and protein: ${context}. Recommend 2 improvements for workout weight or volume and hydration. Address the response to Youssef Manssouri.`,
    );

    return { advice };
  }
}
