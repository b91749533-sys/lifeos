import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { ActiveUser } from '../auth/user.decorator';
import { PrismaService } from '../prisma/prisma.service';

@Controller('settings')
@UseGuards(AuthGuard)
export class SettingsController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async getSettings(@ActiveUser() user: any) {
    return this.prisma.settings.findUnique({
      where: { userId: user.id },
    });
  }

  @Patch()
  async updateSettings(
    @ActiveUser() user: any,
    @Body() body: { theme?: string; accentColor?: string; notificationsOn?: boolean; connectedGithub?: string },
  ) {
    return this.prisma.settings.update({
      where: { userId: user.id },
      data: {
        theme: body.theme,
        accentColor: body.accentColor,
        notificationsOn: body.notificationsOn,
        connectedGithub: body.connectedGithub,
      },
    });
  }
}
