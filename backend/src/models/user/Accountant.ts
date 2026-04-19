import { User, DashboardData } from './User';
import { UserRole } from '../../interfaces/enums';

export class Accountant extends User {
  // Accountants don't have separate sub-tables in our DB schema, 
  // but they have specialized behavior.

  constructor(data: any) {
    super(data);
  }

  async getDashboard(): Promise<DashboardData> {
    return {
      title: 'Accountant Dashboard',
      stats: {
        pendingPayments: 0,
        overduePayments: 0,
        revenueThisMonth: 0,
      },
      quickActions: ['Generate Bills', 'Record Payment', 'Apply Penalties']
    };
  }

  getPermissions(): string[] {
    return [
      'GENERATE_BILLS',
      'APPLY_PENALTIES',
      'RECORD_PAYMENTS',
      'GET_PAYMENT_DASHBOARD',
      'PROCESS_REFUND'
    ];
  }
}
