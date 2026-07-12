import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { ActiveUser } from '../auth/user.decorator';
import { PrismaService } from '../prisma/prisma.service';
import { AiService } from '../ai/ai.service';

@Controller('tasks')
@UseGuards(AuthGuard)
export class TasksController {
  constructor(
    private prisma: PrismaService,
    private aiService: AiService,
  ) {}

  @Get()
  async getTasks(@ActiveUser() user: any) {
    return this.prisma.task.findMany({
      where: { userId: user.id },
      include: { subtasks: true, project: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  @Post()
  async createTask(
    @ActiveUser() user: any,
    @Body() body: { title: string; description?: string; priority?: string; dueDate?: string; label?: string; projectId?: string; isRecurring?: boolean; recurrence?: string },
  ) {
    return this.prisma.task.create({
      data: {
        userId: user.id,
        title: body.title,
        description: body.description,
        priority: body.priority || 'MEDIUM',
        dueDate: body.dueDate ? new Date(body.dueDate) : null,
        label: body.label,
        projectId: body.projectId || null,
        isRecurring: body.isRecurring || false,
        recurrence: body.recurrence || null,
      },
      include: { subtasks: true },
    });
  }

  @Patch(':id')
  async updateTask(
    @Param('id') id: string,
    @Body() body: { title?: string; description?: string; priority?: string; status?: string; dueDate?: string; label?: string; isRecurring?: boolean; recurrence?: string; subtasks?: { id?: string; title: string; isCompleted: boolean }[] },
  ) {
    // Basic updates
    const updated = await this.prisma.task.update({
      where: { id },
      data: {
        title: body.title,
        description: body.description,
        priority: body.priority,
        status: body.status,
        dueDate: body.dueDate ? new Date(body.dueDate) : undefined,
        label: body.label,
        isRecurring: body.isRecurring,
        recurrence: body.recurrence,
      },
    });

    // If subtasks are provided, synchronize them
    if (body.subtasks) {
      for (const st of body.subtasks) {
        if (st.id) {
          await this.prisma.subtask.update({
            where: { id: st.id },
            data: { title: st.title, isCompleted: st.isCompleted },
          });
        } else {
          await this.prisma.subtask.create({
            data: { taskId: id, title: st.title, isCompleted: st.isCompleted },
          });
        }
      }
    }

    return this.prisma.task.findUnique({
      where: { id },
      include: { subtasks: true },
    });
  }

  @Delete(':id')
  async deleteTask(@Param('id') id: string) {
    await this.prisma.task.delete({ where: { id } });
    return { success: true };
  }

  @Post(':id/ai-breakdown')
  async getAiBreakdown(@Param('id') id: string) {
    const task = await this.prisma.task.findUnique({
      where: { id },
      include: { subtasks: true },
    });

    if (!task) {
      return { error: 'Task not found' };
    }

    // Call Gemini to break task down
    const subtaskTitles = await this.aiService.breakDownTask(task.title, task.description || '');

    // Clear old subtasks (optional, or add new ones). Let's append new ones to avoid deleting existing user inputs
    const createdSubtasks = [];
    for (const title of subtaskTitles) {
      const exists = task.subtasks.some(st => st.title.toLowerCase() === title.toLowerCase());
      if (!exists) {
        const newSub = await this.prisma.subtask.create({
          data: {
            taskId: id,
            title,
            isCompleted: false,
          },
        });
        createdSubtasks.push(newSub);
      }
    }

    return this.prisma.task.findUnique({
      where: { id },
      include: { subtasks: true },
    });
  }
}
