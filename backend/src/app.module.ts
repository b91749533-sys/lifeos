import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AiModule } from './ai/ai.module';
import { DashboardController } from './dashboard/dashboard.controller';
import { TasksController } from './tasks/tasks.controller';
import { HabitsController } from './habits/habits.controller';
import { GoalsController } from './goals/goals.controller';
import { FinanceController } from './finance/finance.controller';
import { HealthController } from './health/health.controller';
import { JournalController } from './journal/journal.controller';
import { NotesController } from './notes/notes.controller';
import { StudyController } from './study/study.controller';
import { WorkspaceController } from './workspace/workspace.controller';
import { SettingsController } from './settings/settings.controller';
import { AiController } from './ai/ai.controller';
import { AuthGuard } from './auth/auth.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AiModule,
  ],
  controllers: [
    DashboardController,
    TasksController,
    HabitsController,
    GoalsController,
    FinanceController,
    HealthController,
    JournalController,
    NotesController,
    StudyController,
    WorkspaceController,
    SettingsController,
    AiController,
  ],
  providers: [
    AuthGuard,
  ],
})
export class AppModule {}
