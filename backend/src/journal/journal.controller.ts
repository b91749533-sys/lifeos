import { Controller, Get, Post, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { ActiveUser } from '../auth/user.decorator';
import { PrismaService } from '../prisma/prisma.service';
import { AiService } from '../ai/ai.service';

@Controller('journal')
@UseGuards(AuthGuard)
export class JournalController {
  constructor(
    private prisma: PrismaService,
    private aiService: AiService,
  ) {}

  @Get()
  async getJournalEntries(@ActiveUser() user: any) {
    return this.prisma.journalEntry.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    });
  }

  @Post()
  async createJournalEntry(
    @ActiveUser() user: any,
    @Body() body: { title: string; content: string; mood: string; voiceNoteUrl?: string },
  ) {
    // Call AI to generate summary & reflection
    let aiSummary = 'Processing...';
    let aiReflection = 'Processing...';
    
    try {
      aiSummary = await this.aiService.generateText(
        `Summarize the following journal entry in 1 sentence:\n"${body.content}"`,
      );
      
      aiReflection = await this.aiService.generateText(
        `Read the following journal entry:\n"${body.content}"\n\nProvide a short, empathetic reflection or a guiding question to help the writer process their feelings. Keep it under 50 words.`,
      );
    } catch (e) {
      aiSummary = 'AI summary unavailable';
      aiReflection = 'AI reflection unavailable';
    }

    return this.prisma.journalEntry.create({
      data: {
        userId: user.id,
        title: body.title,
        content: body.content,
        mood: body.mood,
        voiceNoteUrl: body.voiceNoteUrl || null,
        aiSummary,
        aiReflection,
      },
    });
  }

  @Delete(':id')
  async deleteJournalEntry(@Param('id') id: string) {
    await this.prisma.journalEntry.delete({ where: { id } });
    return { success: true };
  }
}
