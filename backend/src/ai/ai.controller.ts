import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { ActiveUser } from '../auth/user.decorator';
import { PrismaService } from '../prisma/prisma.service';
import { AiService } from './ai.service';

@Controller('ai')
@UseGuards(AuthGuard)
export class AiController {
  constructor(
    private prisma: PrismaService,
    private aiService: AiService,
  ) {}

  @Get('conversations')
  async getConversations(@ActiveUser() user: any) {
    return this.prisma.aiConversation.findMany({
      where: { userId: user.id },
      orderBy: { updatedAt: 'desc' },
    });
  }

  @Post('conversations')
  async createConversation(@ActiveUser() user: any) {
    return this.prisma.aiConversation.create({
      data: {
        userId: user.id,
        title: 'New Discussion',
      },
    });
  }

  @Get('conversations/:id')
  async getConversationDetails(@Param('id') id: string) {
    return this.prisma.aiConversation.findUnique({
      where: { id },
      include: { messages: { orderBy: { createdAt: 'asc' } } },
    });
  }

  @Post('conversations/:id/messages')
  async sendMessage(
    @ActiveUser() user: any,
    @Param('id') id: string,
    @Body() body: { content: string },
  ) {
    // 1. Save user message to database
    await this.prisma.aiMessage.create({
      data: {
        conversationId: id,
        sender: 'USER',
        content: body.content,
      },
    });

    // 2. Fetch full workspace context for AI assistant personalization
    const tasks = await this.prisma.task.findMany({ where: { userId: user.id } });
    const habits = await this.prisma.habit.findMany({ where: { userId: user.id } });
    const goals = await this.prisma.goal.findMany({ where: { userId: user.id }, include: { milestones: true } });
    const expenses = await this.prisma.expense.findMany({ where: { userId: user.id }, take: 10 });
    const courses = await this.prisma.course.findMany({ where: { userId: user.id } });

    // Aggregate into a readable context
    const workspaceContext = `
Workspace Overview for User: Youssef Manssouri
---
Tasks:
${JSON.stringify(tasks.map(t => ({ title: t.title, status: t.status, priority: t.priority })))}
Habits:
${JSON.stringify(habits.map(h => ({ name: h.name, currentStreak: h.streak })))}
Goals:
${JSON.stringify(goals.map(g => ({ title: g.title, progress: `${g.currentValue}/${g.targetValue} ${g.unit}` })))}
Recent Finance:
${JSON.stringify(expenses.map(e => ({ amount: e.amount, category: e.category, type: e.type })))}
Courses/Studies:
${JSON.stringify(courses.map(c => ({ name: c.name, grade: c.grade })))}
---
Ensure your answer directly incorporates details from these lists if the user asks about their goals, tasks, workouts, study, or budget. Address them as Youssef Manssouri.
    `.trim();

    // 3. Generate Gemini response
    const aiResponseText = await this.aiService.generateText(body.content, workspaceContext);

    // 4. Save AI response to database
    const savedAiMsg = await this.prisma.aiMessage.create({
      data: {
        conversationId: id,
        sender: 'AI',
        content: aiResponseText,
      },
    });

    // Update conversation title based on user content if it's default
    const conversation = await this.prisma.aiConversation.findUnique({ where: { id } });
    if (conversation && conversation.title === 'New Discussion') {
      const generatedTitle = body.content.split(' ').slice(0, 4).join(' ') + '...';
      await this.prisma.aiConversation.update({
        where: { id },
        data: { title: generatedTitle },
      });
    }

    return savedAiMsg;
  }
}
