import { User, DashboardData } from './User';
import { UserRole } from '../../interfaces/enums';

export class Admin extends User {
  // Admins also don't have separate sub-tables.

  constructor(data: any) {
    super(data);
  }

  async getDashboard(): Promise<DashboardData> {
    return {
      title: 'Admin Dashboard',
      stats: {
        totalUsers: 0,
        totalRooms: 0,
        systemOccupancy: 0,
        totalRevenue: 0
      },
      quickActions: ['Manage Users', 'Configure Rooms', 'System Analytics']
    };
  }

  getPermissions(): string[] {
    return [
      'ALL_PERMISSIONS' // Admin has access to everything
    ];
  }
}
