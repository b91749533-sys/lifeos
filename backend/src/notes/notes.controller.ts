import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { ActiveUser } from '../auth/user.decorator';
import { PrismaService } from '../prisma/prisma.service';

@Controller('notes')
@UseGuards(AuthGuard)
export class NotesController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async getNotes(@ActiveUser() user: any) {
    return this.prisma.note.findMany({
      where: { userId: user.id },
      orderBy: { updatedAt: 'desc' },
    });
  }

  @Post()
  async createNote(
    @ActiveUser() user: any,
    @Body() body: { title: string; content: string; folder?: string; tags?: string; backlinks?: string },
  ) {
    return this.prisma.note.create({
      data: {
        userId: user.id,
        title: body.title,
        content: body.content,
        folder: body.folder || 'General',
        tags: body.tags || '',
        backlinks: body.backlinks || '',
      },
    });
  }

  @Patch(':id')
  async updateNote(
    @Param('id') id: string,
    @Body() body: { title?: string; content?: string; folder?: string; tags?: string; backlinks?: string },
  ) {
    return this.prisma.note.update({
      where: { id },
      data: {
        title: body.title,
        content: body.content,
        folder: body.folder,
        tags: body.tags,
        backlinks: body.backlinks,
      },
    });
  }

  @Delete(':id')
  async deleteNote(@Param('id') id: string) {
    await this.prisma.note.delete({ where: { id } });
    return { success: true };
  }

  @Get('search')
  async searchNotes(
    @ActiveUser() user: any,
    @Query('q') query: string,
  ) {
    return this.prisma.note.findMany({
      where: {
        userId: user.id,
        OR: [
          { title: { contains: query } },
          { content: { contains: query } },
          { tags: { contains: query } },
        ],
      },
      orderBy: { updatedAt: 'desc' },
    });
  }
}
