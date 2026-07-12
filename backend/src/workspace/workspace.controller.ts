import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { ActiveUser } from '../auth/user.decorator';
import { PrismaService } from '../prisma/prisma.service';

@Controller('workspace')
@UseGuards(AuthGuard)
export class WorkspaceController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async getWorkspaceData(@ActiveUser() user: any) {
    const projects = await this.prisma.project.findMany({
      where: { userId: user.id },
      include: { tasks: true },
      orderBy: { createdAt: 'desc' },
    });
    return projects.map(p => ({
      ...p,
      snippets: p.snippets ? JSON.parse(p.snippets) : [],
    }));
  }

  @Post('projects')
  async createProject(
    @ActiveUser() user: any,
    @Body() body: { name: string; githubRepo?: string; status?: string },
  ) {
    const project = await this.prisma.project.create({
      data: {
        userId: user.id,
        name: body.name,
        githubRepo: body.githubRepo || null,
        status: body.status || 'PLANNING',
        snippets: '[]',
      },
    });
    return {
      ...project,
      snippets: [],
    };
  }

  @Post('projects/:id/snippets')
  async addSnippet(
    @Param('id') id: string,
    @Body() body: { title: string; code: string; language?: string },
  ) {
    const project = await this.prisma.project.findUnique({ where: { id } });
    if (!project) return { error: 'Project not found' };

    const snippets = project.snippets ? JSON.parse(project.snippets) : [];
    const newSnippet = {
      id: Math.random().toString(36).substring(7),
      title: body.title,
      code: body.code,
      language: body.language || 'typescript',
      createdAt: new Date(),
    };
    snippets.push(newSnippet);

    const updated = await this.prisma.project.update({
      where: { id },
      data: { snippets: JSON.stringify(snippets) },
    });

    return {
      ...updated,
      snippets,
    };
  }

  @Get('github-activity')
  async getGithubActivity(@ActiveUser() user: any, @Query('repo') repo: string) {
    // Generate realistic developer activity logs (mock Git commits for the premium feel)
    return [
      {
        id: '1',
        message: 'refactor: implement modular AI assistant routing',
        author: 'Youssef Manssouri',
        date: new Date(Date.now() - 3600000 * 2), // 2 hours ago
        sha: 'a5c8e2b',
      },
      {
        id: '2',
        message: 'feat: add premium glassmorphism OS sidebar with lucide icons',
        author: 'Youssef Manssouri',
        date: new Date(Date.now() - 3600000 * 5), // 5 hours ago
        sha: 'e92d4f1',
      },
      {
        id: '3',
        message: 'chore: configure SQLite Prisma provider for local development override',
        author: 'Youssef Manssouri',
        date: new Date(Date.now() - 3600000 * 24), // 1 day ago
        sha: 'c4a9d70',
      },
    ];
  }
}
