import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { ActiveUser } from '../auth/user.decorator';
import { PrismaService } from '../prisma/prisma.service';
import { AiService } from '../ai/ai.service';

@Controller('goals')
@UseGuards(AuthGuard)
export class GoalsController {
  constructor(
    private prisma: PrismaService,
    private aiService: AiService,
  ) {}

  @Get()
  async getGoals(@ActiveUser() user: any) {
    return this.prisma.goal.findMany({
      where: { userId: user.id },
      include: { milestones: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  @Post()
  async createGoal(
    @ActiveUser() user: any,
    @Body() body: { title: string; targetValue: number; unit: string; deadline?: string; notes?: string },
  ) {
    // Generate AI suggestions for milestones immediately
    const goal = await this.prisma.goal.create({
      data: {
        userId: user.id,
        title: body.title,
        targetValue: body.targetValue,
        unit: body.unit,
        deadline: body.deadline ? new Date(body.deadline) : null,
        notes: body.notes,
      },
      include: { milestones: true },
    });

    // Auto-generate AI Suggestions
    try {
      const suggestions = await this.aiService.generateText(
        `Provide 3 milestones and a brief strategic plan to achieve this goal: "${body.title}" (Target: ${body.targetValue} ${body.unit}). Format as a clean bulleted list.`,
      );
      return this.prisma.goal.update({
        where: { id: goal.id },
        data: { aiSuggestions: suggestions },
        include: { milestones: true },
      });
    } catch (e) {
      return goal;
    }
  }

  @Patch(':id')
  async updateGoal(
    @Param('id') id: string,
    @Body() body: { title?: string; targetValue?: number; currentValue?: number; unit?: string; deadline?: string; notes?: string },
  ) {
    return this.prisma.goal.update({
      where: { id },
      data: {
        title: body.title,
        targetValue: body.targetValue,
        currentValue: body.currentValue,
        unit: body.unit,
        deadline: body.deadline ? new Date(body.deadline) : undefined,
        notes: body.notes,
      },
      include: { milestones: true },
    });
  }

  @Delete(':id')
  async deleteGoal(@Param('id') id: string) {
    await this.prisma.goal.delete({ where: { id } });
    return { success: true };
  }

  @Post(':id/milestones')
  async addMilestone(
    @Param('id') id: string,
    @Body() body: { title: string },
  ) {
    return this.prisma.milestone.create({
      data: {
        goalId: id,
        title: body.title,
      },
    });
  }

  @Patch('milestones/:milestoneId')
  async toggleMilestone(
    @Param('milestoneId') id: string,
    @Body() body: { isCompleted: boolean },
  ) {
    return this.prisma.milestone.update({
      where: { id },
      data: { isCompleted: body.isCompleted },
    });
  }
}
