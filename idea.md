# SmartHostel — Smart Hostel Management System

## Overview

**SmartHostel** is a backend-centric, role-based hostel management system designed to streamline hostel operations including room allocation, payments, complaints, attendance, and mess management. Built using Object-Oriented Programming principles and clean system design, it provides a structured administrative system where each user role — Student, Warden, Accountant, and Admin — has clearly defined permissions, behavior, and workflows.

This is NOT a simple hostel app — it is designed like a real administrative system with **workflows** (not just CRUD), **role-based behavior** (polymorphism), **state transitions** (room allocation lifecycle, complaint resolution), and **business rules** (late payment penalties, mess plan change restrictions, attendance thresholds).

---

## Problem Statement

1. **Manual room allocation** — Hostels rely on paper-based room allocation with no tracking of allocation lifecycle (Requested → Approved → Occupied → Vacated), leading to disputes and mismanagement.
2. **Untracked payments** — Fee collection is poorly tracked with no automated late payment penalty calculation, no payment history, and frequent discrepancies between accounts and records.
3. **Complaint black holes** — Student complaints are raised verbally or on paper and get lost. There is no status tracking, no assignment workflow, and no accountability.
4. **No attendance system** — Daily attendance and entry/exit logs are maintained in physical registers, making it impossible to generate reports or enforce hostel policies.
5. **Mess management chaos** — Mess plan subscriptions, monthly billing, and plan change requests are handled manually with no transparency or rule enforcement.

---

## Scope

### In Scope
- Role-based user management (Student, Warden, Accountant, Admin)
- Room allocation lifecycle with state transitions (Requested → Approved → Occupied → Vacated)
- Room types (Single, Double) with capacity tracking
- Monthly hostel fee billing with dynamic late payment penalty
- Payment status tracking and receipt generation
- Complaint management with assignment and resolution workflow
- Notification system for complaint updates and payment reminders
- Daily attendance tracking with entry/exit logs
- Attendance reports and defaulter identification
- Mess plan selection, monthly subscription, and change rules
- Admin dashboard with occupancy, revenue, and complaint analytics
- Audit logging for all critical operations

### Out of Scope (for Milestone 1)
- Real payment gateway integration (simulated payments only)
- Email/SMS notifications (in-app only for now)
- Biometric or RFID attendance integration
- Mobile native application
- Visitor management
- Laundry and housekeeping management
- Leave management integration with university systems

---

## Key Features

### 🎓 Student Features

#### 1. Authentication & Profile
- **Registration**: Create account with enrollment number, email, password, phone, and department.
- **Login/Logout**: Secure JWT-based authentication.
- **Profile Management**: Update personal info and emergency contact details.
- **Password Management**: Change password with validation.

#### 2. Room Allocation
- **Request Room**: Submit room allocation request specifying preferred room type (Single/Double).
- **View Allocation Status**: Track request state (Requested → Approved → Occupied → Vacated).
- **View Room Details**: See assigned room number, floor, block, roommate info (for double rooms).
- **Room Vacation Request**: Submit request to vacate room at semester end.

#### 3. Payment & Billing
- **View Fee Details**: See monthly hostel fee, mess charges, and any pending dues.
- **Make Payment**: Submit payment for hostel fees (simulated).
- **Payment History**: View all past transactions with receipts.
- **Late Payment Alert**: Get notified about approaching deadlines and penalties.

#### 4. Complaints
- **Raise Complaint**: Submit complaints with category (Maintenance, Hygiene, Noise, Electrical, Plumbing, Other) and description.
- **Track Complaint Status**: View status (Open → Assigned → In Progress → Resolved → Closed).
- **View Complaint History**: See all past complaints and resolutions.

#### 5. Attendance
- **View Attendance Record**: See daily attendance status (Present, Absent, On Leave).
- **View Monthly Report**: Check attendance percentage and defaulter warnings.

#### 6. Mess Management
- **Select Mess Plan**: Choose from available plans (Veg, Non-Veg, Special).
- **View Current Plan**: See active subscription details and billing.
- **Request Plan Change**: Submit change request (subject to change window rules).
- **View Mess Menu**: Access daily/weekly mess menu.

### 🛡️ Warden Features

#### 7. Room Management
- **View Room Inventory**: See all rooms, types, floor, block, occupancy status.
- **Approve/Reject Allocation**: Process student room allocation requests.
- **Room Status Update**: Mark rooms as Available, Occupied, Under Maintenance.
- **Allocate Room Manually**: Directly assign a student to a specific room.

#### 8. Complaint Management
- **View All Complaints**: See complaints dashboard with filters (status, category, date).
- **Assign Complaint**: Assign complaint to maintenance staff or self.
- **Update Complaint Status**: Move complaint through resolution workflow.
- **Priority Management**: Set complaint priority (Low, Medium, High, Urgent).

#### 9. Attendance Management
- **Mark Daily Attendance**: Record attendance for students in assigned hostel/floor.
- **Log Entry/Exit**: Record student entry and exit times.
- **Generate Reports**: Create attendance reports by date range, floor, or student.
- **Identify Defaulters**: Flag students below minimum attendance threshold.

### 💰 Accountant Features

#### 10. Payment Processing
- **Generate Monthly Bills**: Auto-generate hostel fee bills for all students.
- **Apply Late Penalty**: Calculate and apply late payment penalties based on days overdue.
- **Record Payments**: Mark payments as received and generate receipts.
- **View Payment Dashboard**: See pending payments, collected fees, and defaulters.
- **Payment Reports**: Generate revenue reports by month, block, or room type.

#### 11. Mess Billing
- **Generate Mess Bills**: Create monthly mess subscription bills.
- **Process Refunds**: Handle mess plan change refunds/adjustments.
- **Mess Revenue Report**: Track mess plan subscription revenue.

### 🔧 Admin Features

#### 12. System Administration
- **User Management**: Create, update, deactivate user accounts for all roles.
- **Block & Floor Management**: Configure hostel blocks, floors, and room inventory.
- **Room Configuration**: Add/modify rooms, set types, capacity, and pricing.

#### 13. Mess Plan Administration
- **Manage Plans**: Create, update, and deactivate mess plans.
- **Set Pricing**: Configure mess plan pricing by type and month.
- **Define Change Rules**: Set plan change windows and restrictions.
- **Menu Management**: Upload and manage daily/weekly mess menus.

#### 14. Dashboard & Analytics
- **Occupancy Overview**: Total rooms, occupied, vacant, under maintenance.
- **Revenue Summary**: Total hostel fees collected, pending, overdue.
- **Complaint Analytics**: Open vs resolved, average resolution time, category breakdown.
- **Attendance Overview**: Overall attendance rates, defaulter count.
- **Mess Analytics**: Plan distribution, subscription trends.

---

## Tech Stack

| Layer          | Technology                                      |
|----------------|--------------------------------------------------|
| **Frontend**   | React.js, Redux (state management), Axios       |
| **Backend**    | Node.js (Express.js), TypeScript                 |
| **Database**   | PostgreSQL (relational data)                     |
| **Auth**       | JWT (JSON Web Tokens) + bcrypt (password hash)   |
| **API**        | RESTful API design                               |
| **Testing**    | Jest, React Testing Library, Supertest           |
| **DevOps**     | Docker, GitHub Actions (CI/CD)                   |
| **Storage**    | Local file system / Cloud storage (documents)    |

---

## Architecture Principles

- **Clean Architecture**: Controllers → Services → Repositories separation
- **OOP Principles**: Encapsulation, Abstraction, Inheritance, Polymorphism
- **Design Patterns** (applied where appropriate):
  - **State** — Room allocation lifecycle (Requested → Approved → Occupied → Vacated)
  - **Strategy** — Fee calculation strategies (regular, late penalty, mess-based)
  - **Observer** — Complaint status updates trigger notifications to student
  - **Factory** — Creating different user roles (Student, Warden, Accountant, Admin)
  - **Repository** — Data access abstraction
  - **Singleton** — Database connection pool
  - **Template Method** — Dashboard generation per role (different widgets/data per role)
  - **Chain of Responsibility** — Room allocation validation pipeline
- **SOLID Principles** adherence
- **RESTful API** best practices
- **DTO Pattern** for data transfer between layers

---

## User Roles

| Role           | Description                                                        |
|----------------|--------------------------------------------------------------------|
| **Student**    | Can request rooms, pay fees, raise complaints, view attendance, select mess plans. |
| **Warden**     | Manages room allocation, complaint assignment, and daily attendance. |
| **Accountant** | Handles fee billing, payment processing, penalties, and revenue reports. |
| **Admin**      | Full system control — user management, room configuration, mess plan setup, analytics. |

---

## OOP Principles Applied

| Principle       | How It Appears                                                       |
|-----------------|----------------------------------------------------------------------|
| **Encapsulation** | Services hide DB logic; private fields with public methods in all domain models |
| **Abstraction**   | Abstract `User` class with role-specific behavior hidden behind interface |
| **Inheritance**   | `Student`, `Warden`, `Accountant`, `Admin` all extend `User` base class |
| **Polymorphism**  | Different dashboards, permissions, and actions per role at runtime |

---

## Design Patterns Applied

| Pattern                    | Where Applied                                       | Purpose                                                        |
|----------------------------|-----------------------------------------------------|----------------------------------------------------------------|
| **State**                  | Room allocation status transitions                  | Enforce valid transitions (Requested → Approved → Occupied → Vacated) |
| **Strategy**               | Fee calculation (regular, late penalty)              | Swap fee calculation logic at runtime based on payment timing   |
| **Observer**               | Complaint status changes                            | Automatically notify student when complaint status updates      |
| **Factory**                | User creation by role                               | Create correct user subclass based on role assignment            |
| **Repository**             | Data access layer                                   | Decouple business logic from database implementation            |
| **Template Method**        | Role-based dashboards                               | Same dashboard structure, different data per role               |
| **Chain of Responsibility**| Room allocation validation                          | Sequential checks (room availability, student eligibility, capacity) |
| **Singleton**              | Database connection pool                            | Single shared connection instance                                |

---

## Entity Relationships Overview

- **Users** have different roles (Student, Warden, Accountant, Admin)
- **Students** are allocated **Rooms** through **RoomAllocations** (lifecycle tracking)
- **Rooms** belong to **Blocks/Floors** and have types (Single, Double)
- **Students** generate **Payments** for hostel fees
- **Students** raise **Complaints** which are assigned and tracked by **Wardens**
- **Wardens** mark daily **Attendance** and log **EntryExitRecords** for students
- **Students** subscribe to **MessPlans** through **MessSubscriptions**
- **Notifications** are sent to users for complaint updates, payment reminders, allocation status
