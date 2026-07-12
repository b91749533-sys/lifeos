const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding LifeOS database...');

  // 1. Create default user
  const user = await prisma.user.upsert({
    where: { email: 'youssef@example.com' },
    update: {},
    create: {
      email: 'youssef@example.com',
      name: 'Youssef Manssouri',
      settings: {
        create: {
          theme: 'dark',
          accentColor: 'emerald',
          notificationsOn: true,
          connectedGithub: 'youssef-manssouri',
        },
      },
    },
  });

  console.log(`Created user: ${user.name} (${user.email})`);

  // 2. Create goals
  const goal1 = await prisma.goal.create({
    data: {
      userId: user.id,
      title: 'Reach 75 kg',
      targetValue: 75,
      currentValue: 72,
      unit: 'kg',
      deadline: new Date(Date.now() + 3600000 * 24 * 60), // 60 days from now
      notes: 'Focus on clean caloric surplus and high protein.',
      aiSuggestions: '1. Increase daily protein intake to 140g.\n2. Work out using a progressive overload schedule 4x/week.\n3. Track bodyweight daily in the morning.',
    },
  });

  const goal2 = await prisma.goal.create({
    data: {
      userId: user.id,
      title: 'Save 50,000 MAD',
      targetValue: 50000,
      currentValue: 15000,
      unit: 'MAD',
      deadline: new Date(Date.now() + 3600000 * 24 * 120), // 120 days from now
      notes: 'Save freelance earnings and cut budget on eating out.',
      aiSuggestions: '1. Set up automatic monthly savings transfers.\n2. Keep food expense category below 4000 MAD.\n3. Log freelance revenue immediately in Finance widget.',
    },
  });

  console.log('Created goals');

  // Milestones for Goal 1
  await prisma.milestone.createMany({
    data: [
      { goalId: goal1.id, title: 'Reach 73 kg', isCompleted: true },
      { goalId: goal1.id, title: 'Reach 74 kg', isCompleted: false },
      { goalId: goal1.id, title: 'Hit bench press personal record: 85kg', isCompleted: false },
    ],
  });

  // 3. Create habits
  const habit1 = await prisma.habit.create({
    data: { userId: user.id, name: 'Drink 3L Water', frequency: 'DAILY', streak: 12, bestStreak: 15 },
  });
  const habit2 = await prisma.habit.create({
    data: { userId: user.id, name: 'Gym Workout', frequency: 'DAILY', streak: 4, bestStreak: 8 },
  });
  const habit3 = await prisma.habit.create({
    data: { userId: user.id, name: 'Coding Session', frequency: 'DAILY', streak: 5, bestStreak: 10 },
  });
  const habit4 = await prisma.habit.create({
    data: { userId: user.id, name: 'Read 20 min', frequency: 'DAILY', streak: 8, bestStreak: 8 },
  });

  console.log('Created habits');

  // Insert completions for the last 5 days
  const today = new Date();
  today.setHours(0,0,0,0);
  for (let i = 0; i < 5; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    
    await prisma.habitLog.create({ data: { habitId: habit1.id, date: d } });
    if (i !== 2) {
      await prisma.habitLog.create({ data: { habitId: habit2.id, date: d } });
      await prisma.habitLog.create({ data: { habitId: habit3.id, date: d } });
    }
    await prisma.habitLog.create({ data: { habitId: habit4.id, date: d } });
  }

  // 4. Create tasks
  const task1 = await prisma.task.create({
    data: {
      userId: user.id,
      title: 'Implement LifeOS Core Dashboard Interface',
      description: 'Design the custom layout using glassmorphic widgets and Tailwind CSS',
      priority: 'HIGH',
      status: 'IN_PROGRESS',
      dueDate: new Date(Date.now() + 3600000 * 24),
      label: 'work',
    },
  });

  await prisma.task.create({
    data: {
      userId: user.id,
      title: 'Review weekly budget spending logs',
      description: 'Verify if restaurants category spending is under control',
      priority: 'MEDIUM',
      status: 'TODO',
      dueDate: new Date(Date.now() + 3600000 * 48),
      label: 'finance',
    },
  });

  const task3 = await prisma.task.create({
    data: {
      userId: user.id,
      title: 'Generate workout plan adjusting weights',
      description: 'Review strength statistics and update sets/reps',
      priority: 'LOW',
      status: 'DONE',
      label: 'health',
    },
  });

  console.log('Created tasks');

  // Subtasks
  await prisma.subtask.createMany({
    data: [
      { taskId: task1.id, title: 'Create translucent side navigation dock', isCompleted: true },
      { taskId: task1.id, title: 'Configure Zustand widgets layout store', isCompleted: false },
      { taskId: task1.id, title: 'Connect Gemini Daily Briefing API', isCompleted: false },
      { taskId: task3.id, title: 'Check barbell squat execution speed', isCompleted: true },
    ],
  });

  // 5. Create Calendar Events
  const meetingStart = new Date();
  meetingStart.setHours(10, 0, 0, 0);
  const meetingEnd = new Date();
  meetingEnd.setHours(11, 30, 0, 0);

  const workoutStart = new Date();
  workoutStart.setHours(17, 30, 0, 0);
  const workoutEnd = new Date();
  workoutEnd.setHours(19, 0, 0, 0);

  await prisma.event.createMany({
    data: [
      {
        userId: user.id,
        title: 'Project Kickoff & Architecture Alignment',
        description: 'Review Next.js 15 App router and NestJS structure',
        startTime: meetingStart,
        endTime: meetingEnd,
        color: 'indigo',
      },
      {
        userId: user.id,
        title: 'Hypertrophy Gym Session (Push Routine)',
        description: 'Target Chest, Shoulders, and Triceps',
        startTime: workoutStart,
        endTime: workoutEnd,
        color: 'rose',
      },
    ],
  });

  console.log('Created calendar events');

  // 6. Create Transactions
  await prisma.expense.createMany({
    data: [
      { userId: user.id, amount: 4500, category: 'Freelance Dev', type: 'INCOME', description: 'Next.js project delivery payment' },
      { userId: user.id, amount: 120, category: 'Food', type: 'EXPENSE', description: 'Weekly grocery shopping' },
      { userId: user.id, amount: 150, category: 'Restaurants', type: 'EXPENSE', description: 'Dinner with colleagues' },
      { userId: user.id, amount: 250, category: 'Subscriptions', type: 'EXPENSE', description: 'Clerk Pro Plan API billing' },
      { userId: user.id, amount: 1000, category: 'Index Fund', type: 'INVESTMENT', description: 'Monthly stock purchase' },
    ],
  });

  await prisma.budget.createMany({
    data: [
      { userId: user.id, category: 'Food', limit: 4000, period: 'MONTHLY' },
      { userId: user.id, category: 'Subscriptions', limit: 1500, period: 'MONTHLY' },
    ],
  });

  console.log('Created finance logs');

  // 7. Workouts
  const workout = await prisma.workout.create({
    data: {
      userId: user.id,
      title: 'Push Day Hypertrophy',
      duration: 75,
      caloriesBurned: 450,
      waterIntake: 2.5,
      protein: 135,
      sleepHours: 7.5,
    },
  });

  await prisma.workoutExercise.create({
    data: {
      workoutId: workout.id,
      name: 'Flat Dumbbell Press',
      sets: JSON.stringify([
        { reps: 10, weight: 32 },
        { reps: 8, weight: 34 },
        { reps: 8, weight: 34 },
      ]),
    },
  });

  console.log('Created health records');

  // 8. Courses
  const course1 = await prisma.course.create({
    data: { userId: user.id, name: 'Advanced Software Architectures', code: 'CS502', gpaWeight: 4.0, grade: 'A' },
  });

  await prisma.studyItem.create({
    data: {
      courseId: course1.id,
      title: 'Midterm Research Paper on Distributed Systems',
      type: 'ASSIGNMENT',
      dueDate: new Date(Date.now() + 3600000 * 24 * 10),
    },
  });

  console.log('Created study hub records');

  // 9. Notes
  await prisma.note.create({
    data: {
      userId: user.id,
      title: 'LifeOS Architecture Concepts',
      content: '## Overview\nLifeOS is designed with a separate frontend/backend architecture...\n\n### Core Entities\n- Task Manager\n- Habit Tracker\n- Study Hub\n\n### Tech Stack\n- Next.js\n- NestJS\n- SQLite/PostgreSQL\n- Zustand',
      folder: 'Work',
      tags: 'tech,architecture',
    },
  });

  // 10. Notifications
  await prisma.notification.createMany({
    data: [
      { userId: user.id, title: 'Gym reminder', content: 'Time to hit the gym for your Push Session!', type: 'HABIT' },
      { userId: user.id, title: 'Budget Alert', content: 'You have spent 85% of your food budget limit.', type: 'BILL' },
    ],
  });

  console.log('LifeOS seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
