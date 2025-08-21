import { Injectable } from '@nestjs/common';
import { PrismaService } from '@repo/prisma';

@Injectable()
export class AppService {
  public constructor(private readonly prisma: PrismaService) {}

  public getHello(): string {
    return 'Hello World!';
  }

  public async checkDatabaseHealth(): Promise<{ status: string }> {
    try {
      // Simple query to test database connection
      await this.prisma.$queryRaw`SELECT 1`;
      return {
        status: 'healthy',
      };
    } catch (error) {
      throw new Error(
        `Database health check failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }
}
