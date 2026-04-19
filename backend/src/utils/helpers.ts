// Utility helper functions used across the app

import { v4 as uuidv4 } from 'uuid';

export class Helpers {
  // Generate a unique UUID
  static generateId(): string {
    return uuidv4();
  }

  // Generate a receipt number like RCP-2026-0001
  static generateReceiptNumber(): string {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
    return `RCP-${year}-${random}`;
  }

  // Get today's date as YYYY-MM-DD string
  static today(): string {
    return new Date().toISOString().split('T')[0];
  }

  // Calculate days between two dates
  static daysBetween(date1: Date, date2: Date): number {
    const diff = Math.abs(date2.getTime() - date1.getTime());
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }
}
