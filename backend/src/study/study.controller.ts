import { Controller, Get, Post, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { ActiveUser } from '../auth/user.decorator';
import { PrismaService } from '../prisma/prisma.service';
import { AiService } from '../ai/ai.service';

@Controller('study')
@UseGuards(AuthGuard)
export class StudyController {
  constructor(
    private prisma: PrismaService,
    private aiService: AiService,
  ) {}

  @Get()
  async getStudyData(@ActiveUser() user: any) {
    const courses = await this.prisma.course.findMany({
      where: { userId: user.id },
      include: { studyItems: true },
      orderBy: { createdAt: 'desc' },
    });

    // Compute GPA
    let totalGPAWeight = 0;
    let totalGPAPoints = 0;
    const gradePoints: Record<string, number> = {
      'A+': 4.0, 'A': 4.0, 'A-': 3.7,
      'B+': 3.3, 'B': 3.0, 'B-': 2.7,
      'C+': 2.3, 'C': 2.0, 'C-': 1.7,
      'D+': 1.3, 'D': 1.0, 'F': 0.0,
    };

    for (const c of courses) {
      if (c.grade && gradePoints[c.grade.toUpperCase()] !== undefined) {
        totalGPAWeight += c.gpaWeight;
        totalGPAPoints += gradePoints[c.grade.toUpperCase()] * c.gpaWeight;
      }
    }

    const gpa = totalGPAWeight > 0 ? totalGPAPoints / totalGPAWeight : 4.0;

    return {
      courses: courses.map(c => ({
        ...c,
        studyItems: c.studyItems.map(item => ({
          ...item,
          flashcards: item.flashcards ? JSON.parse(item.flashcards) : null,
        })),
      })),
      gpa: Math.round(gpa * 100) / 100,
    };
  }

  @Post('courses')
  async createCourse(
    @ActiveUser() user: any,
    @Body() body: { name: string; code?: string; gpaWeight?: number; grade?: string },
  ) {
    return this.prisma.course.create({
      data: {
        userId: user.id,
        name: body.name,
        code: body.code || null,
        gpaWeight: body.gpaWeight || 3.0,
        grade: body.grade || null,
      },
    });
  }

  @Post('items')
  async addStudyItem(
    @Body() body: { courseId: string; title: string; type: string; dueDate?: string; flashcards?: any },
  ) {
    const item = await this.prisma.studyItem.create({
      data: {
        courseId: body.courseId,
        title: body.title,
        type: body.type || 'ASSIGNMENT',
        dueDate: body.dueDate ? new Date(body.dueDate) : null,
        flashcards: body.flashcards ? JSON.stringify(body.flashcards) : null,
      },
    });

    return {
      ...item,
      flashcards: item.flashcards ? JSON.parse(item.flashcards) : null,
    };
  }

  @Patch('items/:id')
  async toggleStudyItem(
    @Param('id') id: string,
    @Body() body: { isCompleted: boolean },
  ) {
    return this.prisma.studyItem.update({
      where: { id },
      data: { isCompleted: body.isCompleted },
    });
  }

  @Post('generate-quiz')
  async generateQuiz(
    @Body() body: { topic: string; content: string },
  ) {
    const prompt = `Based on the following content regarding the topic "${body.topic}", generate a multiple choice quiz of 3 questions with 4 choices each. Indicate the correct answer index (0-3). Respond ONLY in valid JSON format:
    [
      {
        "question": "question text",
        "choices": ["choice 0", "choice 1", "choice 2", "choice 3"],
        "correctIndex": 0
      }
    ]
    Do not output markdown code blocks.`;

    const response = await this.aiService.generateText(prompt, body.content);
    try {
      const cleanJson = response.replace(/```json|```/gi, '').trim();
      return JSON.parse(cleanJson);
    } catch (e) {
      return [
        {
          question: `Sample Quiz Question regarding ${body.topic}?`,
          choices: ['Option A (Correct)', 'Option B', 'Option C', 'Option D'],
          correctIndex: 0,
        },
      ];
    }
  }

  @Post('items/:id/generate-flashcards')
  async generateFlashcards(
    @Param('id') id: string,
    @Body() body: { topic: string; content: string },
  ) {
    const prompt = `Based on the topic "${body.topic}" and details: "${body.content}", generate a set of 5 flashcards.
    Return ONLY a JSON list of objects: [{"front": "Question/Term", "back": "Answer/Definition"}]. Do not output markdown code blocks.`;

    const response = await this.aiService.generateText(prompt);
    let flashcards = [];
    try {
      const cleanJson = response.replace(/```json|```/gi, '').trim();
      flashcards = JSON.parse(cleanJson);
    } catch (e) {
      flashcards = [
        { front: `Core concept of ${body.topic}?`, back: `Definition of core concept of ${body.topic}` },
      ];
    }

    const updated = await this.prisma.studyItem.update({
      where: { id },
      data: { flashcards: JSON.stringify(flashcards) },
    });

    return {
      ...updated,
      flashcards: updated.flashcards ? JSON.parse(updated.flashcards) : null,
    };
  }
}
