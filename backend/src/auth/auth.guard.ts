import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    
    // Check for x-user-email header or Authorization header (e.g., mock token)
    let email = request.headers['x-user-email'] as string;
    
    // In developer mode, if no email is supplied, default to the seeded user
    if (!email) {
      const authHeader = request.headers['authorization'];
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        if (token.includes('@')) {
          email = token; // Allow passing email directly as Bearer token for mock testing
        }
      }
    }

    if (!email) {
      email = 'youssef@example.com'; // Global development bypass default
    }

    // Find or create the user in the database
    let user = await this.prisma.user.findUnique({
      where: { email },
      include: { settings: true },
    });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email,
          name: email === 'youssef@example.com' ? 'Youssef Manssouri' : email.split('@')[0],
          settings: {
            create: {
              theme: 'dark',
              accentColor: 'emerald',
            },
          },
        },
        include: { settings: true },
      });
    }

    // Attach user to request
    request.user = user;
    return true;
  }
}
