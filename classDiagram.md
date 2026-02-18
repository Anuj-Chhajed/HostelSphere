# Class Diagram

## Overview

This class diagram shows the major classes, their attributes, methods, and relationships across the SmartHostel Management System. The design follows **Clean Architecture** (Controller → Service → Repository) with strong **OOP principles** and **design patterns** — including **Inheritance** (User hierarchy), **State Pattern** (room allocation), **Strategy Pattern** (fee calculation), and **Observer Pattern** (complaint notifications).

---

```mermaid
classDiagram
    direction TB

    %% ===== DOMAIN MODELS — USER HIERARCHY (INHERITANCE) =====

    class User {
        <<abstract>>
        -id: string
        -email: string
        -passwordHash: string
        -name: string
        -phone: string
        -role: UserRole
        -isActive: boolean
        -createdAt: Date
        -updatedAt: Date
        +login(email: string, password: string): string
        +updateProfile(dto: UpdateProfileDto): void
        +changePassword(oldPass: string, newPass: string): void
        +getDashboard(): DashboardData*
        +getPermissions(): Permission[]*
    }

    class Student {
        -enrollmentNumber: string
        -department: string
        -year: number
        -emergencyContact: string
        -roomAllocationId: string
        -messSubscriptionId: string
        +requestRoom(dto: RoomRequestDto): RoomAllocation
        +raiseComplaint(dto: ComplaintDto): Complaint
        +makePayment(dto: PaymentDto): Payment
        +selectMessPlan(planId: string): MessSubscription
        +viewAttendance(): AttendanceRecord[]
        +getDashboard(): DashboardData
        +getPermissions(): Permission[]
    }

    class Warden {
        -assignedBlock: string
        -assignedFloor: number
        +approveAllocation(allocationId: string): void
        +rejectAllocation(allocationId: string, reason: string): void
        +assignComplaint(complaintId: string, assigneeId: string): void
        +updateComplaintStatus(complaintId: string, status: ComplaintStatus): void
        +markAttendance(dto: AttendanceDto): void
        +logEntryExit(dto: EntryExitDto): void
        +generateAttendanceReport(filters: ReportFilters): AttendanceReport
        +getDashboard(): DashboardData
        +getPermissions(): Permission[]
    }

    class Accountant {
        -department: string
        +generateMonthlyBills(): Payment[]
        +applyLatePenalty(paymentId: string): Payment
        +recordPayment(paymentId: string, dto: RecordPaymentDto): Payment
        +generatePaymentReport(filters: ReportFilters): PaymentReport
        +generateMessBills(): Payment[]
        +processRefund(paymentId: string, amount: number): void
        +getDashboard(): DashboardData
        +getPermissions(): Permission[]
    }

    class Admin {
        +createUser(dto: CreateUserDto): User
        +deactivateUser(userId: string): void
        +configureRoom(dto: RoomConfigDto): Room
        +manageBlock(dto: BlockDto): Block
        +manageMessPlan(dto: MessPlanDto): MessPlan
        +setMessChangeRules(dto: ChangeRulesDto): void
        +viewSystemAnalytics(): AnalyticsDashboard
        +getDashboard(): DashboardData
        +getPermissions(): Permission[]
    }

    class UserRole {
        <<enumeration>>
        STUDENT
        WARDEN
        ACCOUNTANT
        ADMIN
    }

    %% ===== ROOM & ALLOCATION =====

    class Room {
        -id: string
        -roomNumber: string
        -blockId: string
        -floor: number
        -type: RoomType
        -capacity: number
        -currentOccupancy: number
        -status: RoomStatus
        -pricePerMonth: number
        -amenities: string[]
        -createdAt: Date
        +isAvailable(): boolean
        +isFull(): boolean
        +addOccupant(): void
        +removeOccupant(): void
        +setStatus(status: RoomStatus): void
    }

    class RoomType {
        <<enumeration>>
        SINGLE
        DOUBLE
    }

    class RoomStatus {
        <<enumeration>>
        AVAILABLE
        OCCUPIED
        FULL
        UNDER_MAINTENANCE
    }

    class Block {
        -id: string
        -name: string
        -totalFloors: number
        -totalRooms: number
        -wardenId: string
        -createdAt: Date
        +getRooms(): Room[]
        +getOccupancyRate(): number
    }

    class RoomAllocation {
        -id: string
        -studentId: string
        -roomId: string
        -requestDate: Date
        -approvalDate: Date
        -occupiedDate: Date
        -vacatedDate: Date
        -allocationState: IAllocationState
        -preferredType: RoomType
        -remarks: string
        -approvedBy: string
        +requestAllocation(): void
        +approve(wardenId: string): void
        +occupy(): void
        +vacate(): void
        +reject(reason: string): void
        +getCurrentStatus(): AllocationStatus
    }

    class AllocationStatus {
        <<enumeration>>
        REQUESTED
        APPROVED
        REJECTED
        OCCUPIED
        VACATED
    }

    %% ===== STATE PATTERN — ROOM ALLOCATION =====

    class IAllocationState {
        <<interface>>
        +approve(allocation: RoomAllocation): void
        +reject(allocation: RoomAllocation, reason: string): void
        +occupy(allocation: RoomAllocation): void
        +vacate(allocation: RoomAllocation): void
        +getStatus(): AllocationStatus
    }

    class RequestedState {
        +approve(allocation: RoomAllocation): void
        +reject(allocation: RoomAllocation, reason: string): void
        +occupy(allocation: RoomAllocation): void
        +vacate(allocation: RoomAllocation): void
        +getStatus(): AllocationStatus
    }

    class ApprovedState {
        +approve(allocation: RoomAllocation): void
        +reject(allocation: RoomAllocation, reason: string): void
        +occupy(allocation: RoomAllocation): void
        +vacate(allocation: RoomAllocation): void
        +getStatus(): AllocationStatus
    }

    class OccupiedState {
        +approve(allocation: RoomAllocation): void
        +reject(allocation: RoomAllocation, reason: string): void
        +occupy(allocation: RoomAllocation): void
        +vacate(allocation: RoomAllocation): void
        +getStatus(): AllocationStatus
    }

    class VacatedState {
        +approve(allocation: RoomAllocation): void
        +reject(allocation: RoomAllocation, reason: string): void
        +occupy(allocation: RoomAllocation): void
        +vacate(allocation: RoomAllocation): void
        +getStatus(): AllocationStatus
    }

    %% ===== PAYMENT & BILLING =====

    class Payment {
        -id: string
        -studentId: string
        -type: PaymentType
        -amount: number
        -dueDate: Date
        -paidDate: Date
        -penaltyAmount: number
        -totalAmount: number
        -status: PaymentStatus
        -method: PaymentMethod
        -receiptNumber: string
        -month: string
        -year: number
        -createdAt: Date
        +calculateTotal(): number
        +applyPenalty(penaltyAmount: number): void
        +markPaid(method: PaymentMethod): void
        +isOverdue(): boolean
        +getDaysOverdue(): number
    }

    class PaymentType {
        <<enumeration>>
        HOSTEL_FEE
        MESS_FEE
        PENALTY
        SECURITY_DEPOSIT
    }

    class PaymentStatus {
        <<enumeration>>
        PENDING
        PAID
        OVERDUE
        PARTIALLY_PAID
        REFUNDED
    }

    class PaymentMethod {
        <<enumeration>>
        CASH
        UPI
        BANK_TRANSFER
        CARD
    }

    %% ===== STRATEGY PATTERN — FEE CALCULATION =====

    class IFeeCalculationStrategy {
        <<interface>>
        +calculateFee(student: Student, month: string): number
    }

    class RegularFeeStrategy {
        +calculateFee(student: Student, month: string): number
    }

    class LatePenaltyFeeStrategy {
        -penaltyRatePerDay: number
        -gracePeriodDays: number
        +calculateFee(student: Student, month: string): number
        +calculatePenalty(daysLate: number, baseAmount: number): number
    }

    class MessBasedFeeStrategy {
        +calculateFee(student: Student, month: string): number
        +getMessCharge(planType: MessPlanType): number
    }

    %% ===== COMPLAINT MANAGEMENT =====

    class Complaint {
        -id: string
        -studentId: string
        -category: ComplaintCategory
        -title: string
        -description: string
        -priority: ComplaintPriority
        -status: ComplaintStatus
        -assignedTo: string
        -resolution: string
        -createdAt: Date
        -updatedAt: Date
        -resolvedAt: Date
        +updateStatus(newStatus: ComplaintStatus): void
        +assignTo(wardenId: string): void
        +resolve(resolution: string): void
        +close(): void
        +escalate(): void
    }

    class ComplaintCategory {
        <<enumeration>>
        MAINTENANCE
        HYGIENE
        NOISE
        ELECTRICAL
        PLUMBING
        OTHER
    }

    class ComplaintPriority {
        <<enumeration>>
        LOW
        MEDIUM
        HIGH
        URGENT
    }

    class ComplaintStatus {
        <<enumeration>>
        OPEN
        ASSIGNED
        IN_PROGRESS
        RESOLVED
        CLOSED
    }

    %% ===== OBSERVER PATTERN — COMPLAINT NOTIFICATIONS =====

    class IComplaintObserver {
        <<interface>>
        +onComplaintUpdate(event: ComplaintEvent): void
    }

    class StudentNotificationObserver {
        +onComplaintUpdate(event: ComplaintEvent): void
    }

    class WardenNotificationObserver {
        +onComplaintUpdate(event: ComplaintEvent): void
    }

    class AdminEscalationObserver {
        +onComplaintUpdate(event: ComplaintEvent): void
    }

    %% ===== ATTENDANCE =====

    class AttendanceRecord {
        -id: string
        -studentId: string
        -date: Date
        -status: AttendanceStatus
        -markedBy: string
        -remarks: string
        -createdAt: Date
        +markPresent(): void
        +markAbsent(): void
        +markOnLeave(): void
    }

    class AttendanceStatus {
        <<enumeration>>
        PRESENT
        ABSENT
        ON_LEAVE
    }

    class EntryExitLog {
        -id: string
        -studentId: string
        -entryTime: Date
        -exitTime: Date
        -gate: string
        -loggedBy: string
        -createdAt: Date
        +logEntry(): void
        +logExit(): void
    }

    %% ===== MESS MANAGEMENT =====

    class MessPlan {
        -id: string
        -name: string
        -type: MessPlanType
        -description: string
        -pricePerMonth: number
        -isActive: boolean
        -createdAt: Date
        +activate(): void
        +deactivate(): void
        +updatePrice(newPrice: number): void
    }

    class MessPlanType {
        <<enumeration>>
        VEG
        NON_VEG
        SPECIAL
    }

    class MessSubscription {
        -id: string
        -studentId: string
        -planId: string
        -startDate: Date
        -endDate: Date
        -isActive: boolean
        -createdAt: Date
        +changePlan(newPlanId: string): void
        +cancel(): void
        +renew(): void
        +isChangeAllowed(): boolean
    }

    class MessMenu {
        -id: string
        -dayOfWeek: string
        -mealType: MealType
        -items: string[]
        -planType: MessPlanType
        -createdAt: Date
        +updateMenu(items: string[]): void
    }

    class MealType {
        <<enumeration>>
        BREAKFAST
        LUNCH
        DINNER
        SNACKS
    }

    %% ===== NOTIFICATIONS =====

    class Notification {
        -id: string
        -userId: string
        -type: NotificationType
        -title: string
        -message: string
        -isRead: boolean
        -createdAt: Date
        +markAsRead(): void
    }

    class NotificationType {
        <<enumeration>>
        ALLOCATION_UPDATE
        PAYMENT_REMINDER
        PAYMENT_OVERDUE
        COMPLAINT_UPDATE
        ATTENDANCE_ALERT
        MESS_PLAN_UPDATE
        SYSTEM_ANNOUNCEMENT
    }

    %% ===== SERVICE LAYER =====

    class AuthService {
        -userRepo: IUserRepository
        -jwtSecret: string
        +register(dto: RegisterDto): User
        +login(email: string, password: string): string
        +validateToken(token: string): User
        +hashPassword(password: string): string
        +comparePassword(plain: string, hash: string): boolean
    }

    class RoomAllocationService {
        -allocationRepo: IRoomAllocationRepository
        -roomRepo: IRoomRepository
        -notificationService: NotificationService
        -validationChain: AllocationValidator
        +requestAllocation(studentId: string, dto: RoomRequestDto): RoomAllocation
        +approveAllocation(allocationId: string, wardenId: string): RoomAllocation
        +rejectAllocation(allocationId: string, reason: string): RoomAllocation
        +markOccupied(allocationId: string): RoomAllocation
        +markVacated(allocationId: string): RoomAllocation
        +getStudentAllocation(studentId: string): RoomAllocation
        +getPendingAllocations(): RoomAllocation[]
    }

    class PaymentService {
        -paymentRepo: IPaymentRepository
        -feeStrategy: IFeeCalculationStrategy
        +generateMonthlyBills(month: string, year: number): Payment[]
        +processPayment(paymentId: string, dto: RecordPaymentDto): Payment
        +applyLatePenalties(): Payment[]
        +getStudentPayments(studentId: string): Payment[]
        +getPaymentSummary(filters: ReportFilters): PaymentReport
        +setFeeStrategy(strategy: IFeeCalculationStrategy): void
    }

    class ComplaintService {
        -complaintRepo: IComplaintRepository
        -observers: IComplaintObserver[]
        +raiseComplaint(studentId: string, dto: ComplaintDto): Complaint
        +assignComplaint(complaintId: string, wardenId: string): Complaint
        +updateStatus(complaintId: string, status: ComplaintStatus): Complaint
        +resolveComplaint(complaintId: string, resolution: string): Complaint
        +getAllComplaints(filters: ComplaintFilters): Complaint[]
        +subscribe(observer: IComplaintObserver): void
        +notifyObservers(event: ComplaintEvent): void
    }

    class AttendanceService {
        -attendanceRepo: IAttendanceRepository
        -entryExitRepo: IEntryExitRepository
        +markAttendance(dto: AttendanceDto): AttendanceRecord
        +logEntryExit(dto: EntryExitDto): EntryExitLog
        +getStudentAttendance(studentId: string, month: string): AttendanceRecord[]
        +getAttendancePercentage(studentId: string): number
        +getDefaulters(threshold: number): Student[]
        +generateReport(filters: ReportFilters): AttendanceReport
    }

    class MessService {
        -planRepo: IMessPlanRepository
        -subscriptionRepo: IMessSubscriptionRepository
        -menuRepo: IMessMenuRepository
        +getAvailablePlans(): MessPlan[]
        +subscribeToPlan(studentId: string, planId: string): MessSubscription
        +changePlan(subscriptionId: string, newPlanId: string): MessSubscription
        +cancelSubscription(subscriptionId: string): void
        +getWeeklyMenu(planType: MessPlanType): MessMenu[]
        +updateMenu(dto: UpdateMenuDto): MessMenu
        +managePlan(dto: MessPlanDto): MessPlan
    }

    class NotificationService {
        -notificationRepo: INotificationRepository
        +sendNotification(userId: string, dto: NotificationDto): Notification
        +getUserNotifications(userId: string): Notification[]
        +markAsRead(notificationId: string): void
        +sendBulkNotification(userIds: string[], dto: NotificationDto): void
    }

    class AnalyticsService {
        -paymentRepo: IPaymentRepository
        -allocationRepo: IRoomAllocationRepository
        -complaintRepo: IComplaintRepository
        -attendanceRepo: IAttendanceRepository
        +getOccupancyReport(): OccupancyReport
        +getRevenueReport(period: string): RevenueReport
        +getComplaintAnalytics(): ComplaintAnalytics
        +getAttendanceOverview(): AttendanceOverview
        +getMessAnalytics(): MessAnalytics
    }

    %% ===== VALIDATION CHAIN (Chain of Responsibility) =====

    class AllocationValidator {
        <<abstract>>
        #next: AllocationValidator
        +setNext(validator: AllocationValidator): AllocationValidator
        +validate(request: RoomRequestDto): ValidationResult
        #doValidate(request: RoomRequestDto): ValidationResult*
    }

    class RoomAvailabilityValidator {
        #doValidate(request: RoomRequestDto): ValidationResult
    }

    class StudentEligibilityValidator {
        #doValidate(request: RoomRequestDto): ValidationResult
    }

    class CapacityValidator {
        #doValidate(request: RoomRequestDto): ValidationResult
    }

    class DuplicateAllocationValidator {
        #doValidate(request: RoomRequestDto): ValidationResult
    }

    %% ===== REPOSITORY INTERFACES =====

    class IUserRepository {
        <<interface>>
        +findById(id: string): User
        +findByEmail(email: string): User
        +findByRole(role: UserRole): User[]
        +save(user: User): User
        +update(user: User): void
        +deactivate(id: string): void
    }

    class IRoomRepository {
        <<interface>>
        +findById(id: string): Room
        +findByBlock(blockId: string): Room[]
        +findAvailable(type: RoomType): Room[]
        +save(room: Room): Room
        +update(room: Room): void
    }

    class IRoomAllocationRepository {
        <<interface>>
        +findById(id: string): RoomAllocation
        +findByStudent(studentId: string): RoomAllocation
        +findPending(): RoomAllocation[]
        +findByStatus(status: AllocationStatus): RoomAllocation[]
        +save(allocation: RoomAllocation): RoomAllocation
        +update(allocation: RoomAllocation): void
    }

    class IPaymentRepository {
        <<interface>>
        +findById(id: string): Payment
        +findByStudent(studentId: string): Payment[]
        +findOverdue(): Payment[]
        +findByMonth(month: string, year: number): Payment[]
        +save(payment: Payment): Payment
        +update(payment: Payment): void
    }

    class IComplaintRepository {
        <<interface>>
        +findById(id: string): Complaint
        +findByStudent(studentId: string): Complaint[]
        +findAll(filters: ComplaintFilters): Complaint[]
        +findByStatus(status: ComplaintStatus): Complaint[]
        +save(complaint: Complaint): Complaint
        +update(complaint: Complaint): void
    }

    class IAttendanceRepository {
        <<interface>>
        +findByStudent(studentId: string, month: string): AttendanceRecord[]
        +findByDate(date: Date): AttendanceRecord[]
        +save(record: AttendanceRecord): AttendanceRecord
        +getPercentage(studentId: string): number
    }

    class IEntryExitRepository {
        <<interface>>
        +findByStudent(studentId: string): EntryExitLog[]
        +findByDate(date: Date): EntryExitLog[]
        +save(log: EntryExitLog): EntryExitLog
    }

    class IMessPlanRepository {
        <<interface>>
        +findById(id: string): MessPlan
        +findActive(): MessPlan[]
        +save(plan: MessPlan): MessPlan
        +update(plan: MessPlan): void
    }

    class IMessSubscriptionRepository {
        <<interface>>
        +findByStudent(studentId: string): MessSubscription
        +findByPlan(planId: string): MessSubscription[]
        +save(subscription: MessSubscription): MessSubscription
        +update(subscription: MessSubscription): void
    }

    class IMessMenuRepository {
        <<interface>>
        +findByDay(day: string): MessMenu[]
        +findByPlanType(type: MessPlanType): MessMenu[]
        +save(menu: MessMenu): MessMenu
        +update(menu: MessMenu): void
    }

    class INotificationRepository {
        <<interface>>
        +findByUser(userId: string): Notification[]
        +save(notification: Notification): Notification
        +update(notification: Notification): void
    }

    %% ===== RELATIONSHIPS =====

    %% Inheritance (User hierarchy)
    User <|-- Student : extends
    User <|-- Warden : extends
    User <|-- Accountant : extends
    User <|-- Admin : extends
    User --> UserRole

    %% Room relationships
    Block "1" --> "*" Room : contains
    Room --> RoomType
    Room --> RoomStatus

    %% Allocation relationships
    Student "1" --> "0..1" RoomAllocation : has
    RoomAllocation --> Room : allocates
    RoomAllocation --> AllocationStatus
    RoomAllocation --> IAllocationState : currentState

    %% State pattern
    IAllocationState <|.. RequestedState : implements
    IAllocationState <|.. ApprovedState : implements
    IAllocationState <|.. OccupiedState : implements
    IAllocationState <|.. VacatedState : implements

    %% Payment relationships
    Student "1" --> "*" Payment : makes
    Payment --> PaymentType
    Payment --> PaymentStatus
    Payment --> PaymentMethod

    %% Strategy pattern
    PaymentService --> IFeeCalculationStrategy
    IFeeCalculationStrategy <|.. RegularFeeStrategy : implements
    IFeeCalculationStrategy <|.. LatePenaltyFeeStrategy : implements
    IFeeCalculationStrategy <|.. MessBasedFeeStrategy : implements

    %% Complaint relationships
    Student "1" --> "*" Complaint : raises
    Warden "1" --> "*" Complaint : manages
    Complaint --> ComplaintCategory
    Complaint --> ComplaintPriority
    Complaint --> ComplaintStatus

    %% Observer pattern
    ComplaintService --> IComplaintObserver
    IComplaintObserver <|.. StudentNotificationObserver : implements
    IComplaintObserver <|.. WardenNotificationObserver : implements
    IComplaintObserver <|.. AdminEscalationObserver : implements

    %% Attendance relationships
    Student "1" --> "*" AttendanceRecord : has
    Warden "1" --> "*" AttendanceRecord : marks
    AttendanceRecord --> AttendanceStatus
    Student "1" --> "*" EntryExitLog : has

    %% Mess relationships
    MessPlan --> MessPlanType
    Student "1" --> "0..1" MessSubscription : has
    MessSubscription --> MessPlan : subscribes to
    MessMenu --> MessPlanType
    MessMenu --> MealType

    %% Notification
    User "1" --> "*" Notification : receives
    Notification --> NotificationType

    %% Service dependencies
    AuthService --> IUserRepository
    RoomAllocationService --> IRoomAllocationRepository
    RoomAllocationService --> IRoomRepository
    RoomAllocationService --> NotificationService
    RoomAllocationService --> AllocationValidator

    PaymentService --> IPaymentRepository
    PaymentService --> IFeeCalculationStrategy

    ComplaintService --> IComplaintRepository
    ComplaintService --> IComplaintObserver

    AttendanceService --> IAttendanceRepository
    AttendanceService --> IEntryExitRepository

    MessService --> IMessPlanRepository
    MessService --> IMessSubscriptionRepository
    MessService --> IMessMenuRepository

    NotificationService --> INotificationRepository

    AnalyticsService --> IPaymentRepository
    AnalyticsService --> IRoomAllocationRepository
    AnalyticsService --> IComplaintRepository
    AnalyticsService --> IAttendanceRepository

    %% Validation chain
    AllocationValidator <|-- RoomAvailabilityValidator : extends
    AllocationValidator <|-- StudentEligibilityValidator : extends
    AllocationValidator <|-- CapacityValidator : extends
    AllocationValidator <|-- DuplicateAllocationValidator : extends
```

---

## Design Patterns in the Class Diagram

| Pattern | Where Applied | Purpose |
|---------|---------------|---------|
| **Inheritance** | `User` → `Student`, `Warden`, `Accountant`, `Admin` | Different roles with shared base attributes but specialized behavior and permissions |
| **State** | `IAllocationState` with `RequestedState`, `ApprovedState`, `OccupiedState`, `VacatedState` | Enforce valid room allocation state transitions; each state knows what transitions are legal |
| **Strategy** | `IFeeCalculationStrategy` with regular, late penalty, mess-based | Swap fee calculation algorithms at runtime based on payment context |
| **Observer** | `ComplaintService` + `IComplaintObserver` implementations | Decouple complaint status changes from notification logic; auto-notify students, wardens, and admin |
| **Chain of Responsibility** | `AllocationValidator` chain | Validate room allocation requests through a pipeline (availability, eligibility, capacity, duplicate check) |
| **Repository** | `I*Repository` interfaces | Abstract data access from business logic, enable easy testing and database switching |
| **Factory** | User creation by role (in AuthService) | Create correct user subclass (Student, Warden, Accountant, Admin) based on role |
| **Template Method** | `getDashboard()` abstract method in User | Each role overrides to provide role-specific dashboard data with a common structure |
| **Singleton** | Database connection (not shown) | Ensure single database connection pool instance |

---

## OOP Principles Applied

| Principle | Application |
|-----------|-------------|
| **Encapsulation** | Private fields (`-`) with public methods (`+`) in all domain models. Example: `Payment.calculateTotal()` encapsulates penalty + base fee logic |
| **Abstraction** | Abstract `User` class with `getDashboard()` and `getPermissions()` as abstract methods; Repository interfaces hide DB implementation |
| **Inheritance** | `Student`, `Warden`, `Accountant`, `Admin` extend `User` — each inherits common fields (email, name, phone) and overrides role-specific behavior |
| **Polymorphism** | `getDashboard()` returns different data per role; `IFeeCalculationStrategy` implementations can be swapped at runtime; `IAllocationState` handles transitions differently per state |

---

## Layer Architecture

```
┌─────────────────────────────────────┐
│     Controllers (API Endpoints)     │
├─────────────────────────────────────┤
│     Services (Business Logic)       │
│  - AuthService                      │
│  - RoomAllocationService            │
│  - PaymentService                   │
│  - ComplaintService                 │
│  - AttendanceService                │
│  - MessService                      │
│  - NotificationService              │
│  - AnalyticsService                 │
├─────────────────────────────────────┤
│   Repositories (Data Access)        │
│  - IUserRepository                  │
│  - IRoomRepository                  │
│  - IRoomAllocationRepository        │
│  - IPaymentRepository              │
│  - IComplaintRepository            │
│  - IAttendanceRepository           │
│  - IMessPlanRepository             │
│  - IMessSubscriptionRepository     │
├─────────────────────────────────────┤
│        Database (PostgreSQL)        │
└─────────────────────────────────────┘
```

---

## Key Class Responsibilities

| Class | Responsibility |
|-------|----------------|
| `User` (abstract) | Base class for all users — shared auth, profile, and role behavior |
| `Student` | Request rooms, pay fees, raise complaints, view attendance, select mess plans |
| `Warden` | Approve/reject allocations, manage complaints, mark attendance, log entry/exit |
| `Accountant` | Generate bills, apply penalties, record payments, generate financial reports |
| `Admin` | System administration — users, rooms, blocks, mess plans, analytics |
| `RoomAllocation` | Track room allocation lifecycle using State pattern (Requested → Approved → Occupied → Vacated) |
| `Payment` | Represent fee/payment entity with due dates, penalties, and receipt tracking |
| `Complaint` | Track student complaints through assignment and resolution workflow |
| `PaymentService` | Orchestrate billing with Strategy pattern for fee calculation |
| `ComplaintService` | Manage complaints with Observer pattern for automatic notifications |
| `RoomAllocationService` | Handle room allocation with validation chain and state transitions |
| `AttendanceService` | Mark attendance, log entry/exit, generate reports, identify defaulters |
| `MessService` | Manage mess plans, subscriptions, menus, and change rules |
