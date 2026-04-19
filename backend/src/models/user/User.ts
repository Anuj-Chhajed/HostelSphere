import { UserRole } from '../../interfaces/enums';

export interface DashboardData {
  [key: string]: any;
}

export abstract class User {
  protected id: string;
  protected email: string;
  protected name: string;
  protected role: UserRole;
  protected phone?: string;
  protected isActive: boolean;

  constructor(data: any) {
    this.id = data.id;
    this.email = data.email;
    this.name = data.name;
    this.role = data.role as UserRole;
    this.phone = data.phone;
    this.isActive = data.isActive !== undefined ? data.isActive : true;
  }

  // Getters for common properties
  public getId(): string { return this.id; }
  public getEmail(): string { return this.email; }
  public getName(): string { return this.name; }
  public getRole(): UserRole { return this.role; }
  public getPhone(): string | undefined { return this.phone; }
  public getIsActive(): boolean { return this.isActive; }

  // Abstract methods enforcing polymorphism
  abstract getDashboard(): Promise<DashboardData>;
  abstract getPermissions(): string[];

  // Common business logic could go here
  public toJSON(): object {
    return {
      id: this.id,
      email: this.email,
      name: this.name,
      role: this.role,
      phone: this.phone,
      isActive: this.isActive,
    };
  }
}
