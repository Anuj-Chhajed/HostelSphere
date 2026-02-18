# ER Diagram

## Overview

This Entity-Relationship diagram shows the complete database schema for the SmartHostel Management System. All tables, columns, data types, primary keys (PK), foreign keys (FK), and unique constraints (UK) are defined below.

---

```mermaid
erDiagram
    USERS {
        uuid id PK
        varchar email UK
        varchar password_hash
        varchar name
        enum role "STUDENT, WARDEN, ACCOUNTANT, ADMIN"
        varchar phone
        boolean is_active
        timestamp created_at
        timestamp updated_at
    }

    STUDENTS {
        uuid id PK
        uuid user_id FK UK
        varchar enrollment_number UK
        varchar department
        int year
        varchar emergency_contact
        timestamp created_at
    }

    WARDENS {
        uuid id PK
        uuid user_id FK UK
        uuid assigned_block_id FK
        int assigned_floor
        timestamp created_at
    }

    BLOCKS {
        uuid id PK
        varchar name UK
        int total_floors
        int total_rooms
        uuid warden_id FK
        timestamp created_at
    }

    ROOMS {
        uuid id PK
        varchar room_number UK
        uuid block_id FK
        int floor
        enum type "SINGLE, DOUBLE"
        int capacity
        int current_occupancy
        enum status "AVAILABLE, OCCUPIED, FULL, UNDER_MAINTENANCE"
        decimal price_per_month
        text amenities
        timestamp created_at
        timestamp updated_at
    }

    ROOM_ALLOCATIONS {
        uuid id PK
        uuid student_id FK
        uuid room_id FK
        enum status "REQUESTED, APPROVED, REJECTED, OCCUPIED, VACATED"
        enum preferred_type "SINGLE, DOUBLE"
        date request_date
        date approval_date
        date occupied_date
        date vacated_date
        uuid approved_by FK
        text remarks
        timestamp created_at
        timestamp updated_at
    }

    PAYMENTS {
        uuid id PK
        uuid student_id FK
        enum type "HOSTEL_FEE, MESS_FEE, PENALTY, SECURITY_DEPOSIT"
        decimal amount
        decimal penalty_amount
        decimal total_amount
        date due_date
        date paid_date
        enum status "PENDING, PAID, OVERDUE, PARTIALLY_PAID, REFUNDED"
        enum method "CASH, UPI, BANK_TRANSFER, CARD"
        varchar receipt_number UK
        varchar month
        int year
        uuid recorded_by FK
        timestamp created_at
        timestamp updated_at
    }

    COMPLAINTS {
        uuid id PK
        uuid student_id FK
        enum category "MAINTENANCE, HYGIENE, NOISE, ELECTRICAL, PLUMBING, OTHER"
        varchar title
        text description
        enum priority "LOW, MEDIUM, HIGH, URGENT"
        enum status "OPEN, ASSIGNED, IN_PROGRESS, RESOLVED, CLOSED"
        uuid assigned_to FK
        text resolution
        timestamp created_at
        timestamp updated_at
        timestamp resolved_at
    }

    ATTENDANCE_RECORDS {
        uuid id PK
        uuid student_id FK
        date date
        enum status "PRESENT, ABSENT, ON_LEAVE"
        uuid marked_by FK
        text remarks
        timestamp created_at
    }

    ENTRY_EXIT_LOGS {
        uuid id PK
        uuid student_id FK
        timestamp entry_time
        timestamp exit_time
        varchar gate
        uuid logged_by FK
        timestamp created_at
    }

    MESS_PLANS {
        uuid id PK
        varchar name UK
        enum type "VEG, NON_VEG, SPECIAL"
        text description
        decimal price_per_month
        boolean is_active
        timestamp created_at
        timestamp updated_at
    }

    MESS_SUBSCRIPTIONS {
        uuid id PK
        uuid student_id FK
        uuid plan_id FK
        date start_date
        date end_date
        boolean is_active
        timestamp created_at
        timestamp updated_at
    }

    MESS_MENUS {
        uuid id PK
        varchar day_of_week
        enum meal_type "BREAKFAST, LUNCH, DINNER, SNACKS"
        text items
        enum plan_type "VEG, NON_VEG, SPECIAL"
        timestamp created_at
        timestamp updated_at
    }

    NOTIFICATIONS {
        uuid id PK
        uuid user_id FK
        enum type "ALLOCATION_UPDATE, PAYMENT_REMINDER, PAYMENT_OVERDUE, COMPLAINT_UPDATE, ATTENDANCE_ALERT, MESS_PLAN_UPDATE, SYSTEM_ANNOUNCEMENT"
        varchar title
        text message
        boolean is_read
        timestamp created_at
    }

    AUDIT_LOGS {
        uuid id PK
        uuid user_id FK
        varchar action
        varchar entity_type
        uuid entity_id
        jsonb details
        varchar ip_address
        timestamp created_at
    }

    %% ===== RELATIONSHIPS =====

    USERS ||--o| STUDENTS : "is a"
    USERS ||--o| WARDENS : "is a"
    USERS ||--o{ NOTIFICATIONS : "receives"
    USERS ||--o{ AUDIT_LOGS : "generates"

    BLOCKS ||--|{ ROOMS : "contains"
    BLOCKS ||--o| WARDENS : "managed by"

    STUDENTS ||--o{ ROOM_ALLOCATIONS : "requests"
    ROOMS ||--o{ ROOM_ALLOCATIONS : "allocated in"
    WARDENS ||--o{ ROOM_ALLOCATIONS : "approves"

    STUDENTS ||--o{ PAYMENTS : "makes"
    STUDENTS ||--o{ COMPLAINTS : "raises"
    WARDENS ||--o{ COMPLAINTS : "manages"

    STUDENTS ||--o{ ATTENDANCE_RECORDS : "has"
    WARDENS ||--o{ ATTENDANCE_RECORDS : "marks"

    STUDENTS ||--o{ ENTRY_EXIT_LOGS : "has"
    WARDENS ||--o{ ENTRY_EXIT_LOGS : "logs"

    STUDENTS ||--o{ MESS_SUBSCRIPTIONS : "has"
    MESS_PLANS ||--o{ MESS_SUBSCRIPTIONS : "subscribed in"
```

---

## Table Descriptions

| Table | Description | Key Relationships |
|-------|-------------|-------------------|
| **USERS** | All system users with auth and role info | → Students, Wardens (1:1), Notifications (1:N) |
| **STUDENTS** | Student-specific data (enrollment, department) | ← User (1:1), → Allocations, Payments, Complaints, Attendance |
| **WARDENS** | Warden-specific data (assigned block/floor) | ← User (1:1), → Allocations (approver), Complaints, Attendance |
| **BLOCKS** | Hostel blocks with floor count and warden | → Rooms (1:N), ← Warden |
| **ROOMS** | Individual rooms with type, capacity, status | ← Block, → Allocations (1:N) |
| **ROOM_ALLOCATIONS** | Allocation lifecycle tracking with state | ← Student, ← Room, ← Warden (approver) |
| **PAYMENTS** | Fee and penalty payments with receipts | ← Student, tracked by Accountant |
| **COMPLAINTS** | Student complaints with resolution workflow | ← Student (raiser), ← Warden (assignee) |
| **ATTENDANCE_RECORDS** | Daily attendance status per student | ← Student, ← Warden (marker) |
| **ENTRY_EXIT_LOGS** | Gate entry/exit timestamps | ← Student, ← Warden (logger) |
| **MESS_PLANS** | Available mess plans with pricing | → Subscriptions (1:N) |
| **MESS_SUBSCRIPTIONS** | Student plan subscriptions | ← Student, ← MessPlan |
| **MESS_MENUS** | Daily menus per meal and plan type | Standalone |
| **NOTIFICATIONS** | In-app notifications for users | ← User |
| **AUDIT_LOGS** | System-wide audit trail | ← User (optional) |

---

## Key Constraints & Indexes

### Primary Keys
- All tables use `uuid` as primary key for distributed scalability

### Unique Constraints
- `USERS.email` — Prevent duplicate accounts
- `STUDENTS.enrollment_number` — One enrollment per student
- `STUDENTS.user_id` — One-to-one with Users
- `WARDENS.user_id` — One-to-one with Users
- `ROOMS.room_number` — Unique room identification
- `BLOCKS.name` — Prevent duplicate block names
- `PAYMENTS.receipt_number` — Unique receipt tracking
- `MESS_PLANS.name` — Prevent duplicate plan names

### Foreign Key Constraints
- `STUDENTS.user_id → USERS.id` (ON DELETE CASCADE)
- `WARDENS.user_id → USERS.id` (ON DELETE CASCADE)
- `WARDENS.assigned_block_id → BLOCKS.id` (ON DELETE SET NULL)
- `ROOMS.block_id → BLOCKS.id` (ON DELETE CASCADE)
- `ROOM_ALLOCATIONS.student_id → STUDENTS.id` (ON DELETE RESTRICT)
- `ROOM_ALLOCATIONS.room_id → ROOMS.id` (ON DELETE RESTRICT)
- `ROOM_ALLOCATIONS.approved_by → WARDENS.id` (ON DELETE SET NULL)
- `PAYMENTS.student_id → STUDENTS.id` (ON DELETE RESTRICT)
- `PAYMENTS.recorded_by → USERS.id` (ON DELETE SET NULL)
- `COMPLAINTS.student_id → STUDENTS.id` (ON DELETE RESTRICT)
- `COMPLAINTS.assigned_to → WARDENS.id` (ON DELETE SET NULL)
- `ATTENDANCE_RECORDS.student_id → STUDENTS.id` (ON DELETE CASCADE)
- `ATTENDANCE_RECORDS.marked_by → WARDENS.id` (ON DELETE SET NULL)
- `ENTRY_EXIT_LOGS.student_id → STUDENTS.id` (ON DELETE CASCADE)
- `ENTRY_EXIT_LOGS.logged_by → WARDENS.id` (ON DELETE SET NULL)
- `MESS_SUBSCRIPTIONS.student_id → STUDENTS.id` (ON DELETE CASCADE)
- `MESS_SUBSCRIPTIONS.plan_id → MESS_PLANS.id` (ON DELETE RESTRICT)
- `NOTIFICATIONS.user_id → USERS.id` (ON DELETE CASCADE)
- `AUDIT_LOGS.user_id → USERS.id` (ON DELETE SET NULL)

### Recommended Indexes

| Table | Index | Purpose |
|-------|-------|---------|
| `ROOMS` | `(block_id, status)` | Fast room filtering by block and availability |
| `ROOMS` | `(type, status)` | Room type availability queries |
| `ROOM_ALLOCATIONS` | `(student_id, status)` | Student allocation lookup |
| `ROOM_ALLOCATIONS` | `(status, request_date)` | Pending allocation processing |
| `PAYMENTS` | `(student_id, status)` | Student payment history |
| `PAYMENTS` | `(status, due_date)` | Overdue payment detection |
| `PAYMENTS` | `(month, year)` | Monthly billing queries |
| `COMPLAINTS` | `(student_id, status)` | Student complaint tracking |
| `COMPLAINTS` | `(status, priority)` | Complaint dashboard filtering |
| `COMPLAINTS` | `(assigned_to, status)` | Warden workload queries |
| `ATTENDANCE_RECORDS` | `(student_id, date)` | Daily attendance lookup |
| `ENTRY_EXIT_LOGS` | `(student_id, created_at)` | Student movement history |
| `MESS_SUBSCRIPTIONS` | `(student_id, is_active)` | Active subscription lookup |
| `NOTIFICATIONS` | `(user_id, is_read)` | Unread notification count |
| `AUDIT_LOGS` | `(entity_type, entity_id)` | Entity audit trail lookup |

---

## Data Integrity Rules

1. **Allocation Validation**: Room allocations check room availability, capacity limits, and prevent duplicate active allocations for the same student.
2. **State Machine**: Room allocation status transitions follow strict rules (Requested → Approved/Rejected, Approved → Occupied, Occupied → Vacated).
3. **Payment Deadlines**: Late penalties are auto-calculated based on days past due date using configurable penalty rate.
4. **Occupancy Tracking**: `ROOMS.current_occupancy` is updated atomically when allocations move to OCCUPIED or VACATED state.
5. **Complaint Workflow**: Complaints follow assignment workflow — only assigned complaints can be moved to IN_PROGRESS.
6. **Mess Change Rules**: Plan changes are restricted to defined change windows (e.g., first 5 days of month).
7. **Audit Trail**: All critical operations (allocation changes, payment records, complaint updates) are logged in `AUDIT_LOGS`.
