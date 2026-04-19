// All enums used across the SmartHostel system
// These map directly to PostgreSQL ENUM types

export enum UserRole {
  STUDENT = 'STUDENT',
  WARDEN = 'WARDEN',
  ACCOUNTANT = 'ACCOUNTANT',
  ADMIN = 'ADMIN'
}

export enum RoomType {
  SINGLE = 'SINGLE',
  DOUBLE = 'DOUBLE'
}

export enum RoomStatus {
  AVAILABLE = 'AVAILABLE',
  OCCUPIED = 'OCCUPIED',
  FULL = 'FULL',
  UNDER_MAINTENANCE = 'UNDER_MAINTENANCE'
}

export enum AllocationStatus {
  REQUESTED = 'REQUESTED',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  OCCUPIED = 'OCCUPIED',
  VACATED = 'VACATED'
}

export enum PaymentType {
  HOSTEL_FEE = 'HOSTEL_FEE',
  MESS_FEE = 'MESS_FEE',
  PENALTY = 'PENALTY',
  SECURITY_DEPOSIT = 'SECURITY_DEPOSIT'
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  OVERDUE = 'OVERDUE',
  PARTIALLY_PAID = 'PARTIALLY_PAID',
  REFUNDED = 'REFUNDED'
}

export enum PaymentMethod {
  CASH = 'CASH',
  UPI = 'UPI',
  BANK_TRANSFER = 'BANK_TRANSFER',
  CARD = 'CARD'
}

export enum ComplaintCategory {
  MAINTENANCE = 'MAINTENANCE',
  HYGIENE = 'HYGIENE',
  NOISE = 'NOISE',
  ELECTRICAL = 'ELECTRICAL',
  PLUMBING = 'PLUMBING',
  OTHER = 'OTHER'
}

export enum ComplaintPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT'
}

export enum ComplaintStatus {
  OPEN = 'OPEN',
  ASSIGNED = 'ASSIGNED',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED'
}

export enum AttendanceStatus {
  PRESENT = 'PRESENT',
  ABSENT = 'ABSENT',
  ON_LEAVE = 'ON_LEAVE'
}

export enum MessPlanType {
  VEG = 'VEG',
  NON_VEG = 'NON_VEG',
  SPECIAL = 'SPECIAL'
}

export enum MealType {
  BREAKFAST = 'BREAKFAST',
  LUNCH = 'LUNCH',
  DINNER = 'DINNER',
  SNACKS = 'SNACKS'
}

export enum NotificationType {
  ALLOCATION_UPDATE = 'ALLOCATION_UPDATE',
  PAYMENT_REMINDER = 'PAYMENT_REMINDER',
  PAYMENT_OVERDUE = 'PAYMENT_OVERDUE',
  COMPLAINT_UPDATE = 'COMPLAINT_UPDATE',
  ATTENDANCE_ALERT = 'ATTENDANCE_ALERT',
  MESS_PLAN_UPDATE = 'MESS_PLAN_UPDATE',
  SYSTEM_ANNOUNCEMENT = 'SYSTEM_ANNOUNCEMENT'
}
