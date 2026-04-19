import Database from '../config/db';

export class AuditService {
  private prisma = Database.getInstance().getClient();

  public async logAction(userId: string | null, action: string, entityType: string, entityId: string | null, details: any, ipAddress: string | null): Promise<void> {
    try {
      await this.prisma.auditLog.create({
        data: {
          userId,
          action,
          entityType,
          entityId,
          details,
          ipAddress
        }
      });
    } catch (e) {
      console.error('Failed to write audit log', e);
    }
  }

  public async getLogs(limit: number = 100): Promise<any[]> {
    return this.prisma.auditLog.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { email: true, role: true } }
      }
    });
  }
}
