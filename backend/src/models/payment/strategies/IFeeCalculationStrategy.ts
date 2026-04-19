import { Student, Payment } from '@prisma/client';

export interface FeeContext {
  student: Student & { roomAllocations?: any[], messSubscriptions?: any[] };
  payment?: Payment; 
  month?: string; // Example: "OCT-2026"
  daysLate?: number;
}

export interface IFeeCalculationStrategy {
  calculateFee(context: FeeContext): Promise<number>;
}
