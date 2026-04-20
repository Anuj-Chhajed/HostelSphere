# HostelSphere 🏢 

<div align="center">
  <img src="https://img.shields.io/badge/Status-Production%20Ready-success" />
  <img src="https://img.shields.io/badge/Stack-React%20%7C%20Node.js%20%7C%20Prisma-blue" />
  <img src="https://img.shields.io/badge/Architecture-Design%20Patterns%20Implemented-purple" />
</div>

<br />

## 🌐 Live Demo
👉 Experience the live project here: https://hostel-sphere.vercel.app

---

**HostelSphere** is a next-generation, all-in-one dynamic operating system designed to elevate campus housing infrastructure. Built on a clean-architecture foundation, it seamlessly handles complex operations—from dynamic room allocations and automated mess fee calculation to robust complaint escalation pipelines—all wrapped in a premium, glassmorphic UI.

---

## 🌟 Why HostelSphere?

Most campus housing management systems are heavily outdated, scattered across Excel spreadsheets, and lack modern security standards. **HostelSphere** solves this by offering a unified, high-performance ecosystem:

- **Zero Data Fragmentation**: Every action is interconnected. If a student vacates a room, the Accountant dashboard reflects the billing cessation instantly.
- **Enterprise-Grade Architecture**: Built strictly on Gang of Four (GoF) design patterns to ensure it can gracefully handle spikes of thousands of concurrent students during enrollment periods.
- **Aesthetic Excellence**: Rejects the boring MVP look. Instead, it utilizes an advanced CSS Glassmorphism design system with modern typography and subtle micro-animations, making the platform feel incredibly premium and responsive.

---

## ✨ System Architecture & Patterns

HostelSphere isn't just a basic CRUD app; it acts as a showcase of scalable software engineering principles and Gang of Four (GoF) design patterns:

- 🎭 **State Pattern**: The `RoomAllocationContext` leverages a state machine (Requested → Approved → Occupied → Vacated). This ensures an application cannot skip lifecycle hooks (like triggering payment engines only during the Occupied state).
- 🧩 **Strategy Pattern**: The billing module calculates invoices dynamically. Whether computing standard block rents, parsing mess plan inclusions, or levying late-fee penalties, the `IFeeCalculationStrategy` ensures rules can be swapped dynamically at checkout without bloated `if/else` statements.
- 📡 **Observer Pattern**: State-of-the-art observer pipelines listen for events globally. When a student raises a ticket, the `AdminEscalationObserver` and `WardenNotificationObserver` automatically trigger push notifications asynchronously without holding up the HTTP response.
- 🏭 **Factory Method**: The Dashboard API utilizes a `UserFactory` to dynamically instantiate sub-classes (Student, Warden, Accountant, Admin) ensuring Polymorphism when determining which UI elements and data aggregations are returned upon login.

---

## 🚀 Core Features by Role

The system is secured behind robust JWT Authentication with strict Role-Based Access Control (RBAC).

| 👑 **Admins** | 🛡️ **Wardens** | 📊 **Accountants** | 🎓 **Students** |
| :--- | :--- | :--- | :--- |
| **Complete Infrastructure Management**: Dynamically register new residential blocks and mount room entities out of thin air. | **Allocation Triage**: Approve or reject incoming student housing applications with one click. | **Financial Auditing**: Scan the database to review Pending vs. Collected income. | **Dynamic Re-allocation**: Apply for specific room types across campuses. |
| **Deep Reporting**: Global eagle-eye view over total capacity, available beds, and occupied thresholds. | **Security/Gatepass**: Complete overview of active roll-calls with fast Present/Absent logging toggles. | **Bulk Invoicing Engine**: Run the Strategy Pattern globally to auto-generate the current month's fee for thousands of students. | **Ticketing System**: Submit maintenance issues and watch them be escalated or resolved in real time. |
| **Menu Deployment**: Push real-time, week-wide Mess menus (Breakfast, Lunch, Dinner). | **Ticket Resolution**: Close and mark maintenance/safety complaints as resolved. | **Automated Penalties**: Execute a single command to scan late payers and append daily grace-period fines. | **Live Billing**: Pay generated room & mess bills directly from the dashboard. |

---

## 🛠️ Technology Stack

**Frontend**
* **Framework**: React 18 (Vite)
* **Language**: TypeScript
* **Styling**: Tailwind CSS v3 (Custom Utility Classes, Variables, and Animations)
* **Icons**: Lucide React
* **Design System**: Premium Dark Theme, Heavy Glassmorphism, CSS Perspective variables, Custom Scrollbars.

**Backend**
* **Environment**: Node.js + Express
* **Language**: TypeScript
* **ORM**: Prisma
* **Database**: PostgreSQL (Supabase)
* **Security**: JWT tokens, bcrypt hash passwords, Custom Role Middlewares.

---

## 📦 Getting Started

### Prerequisites
* Node.js (v18+)
* PostgreSQL Database (Locally or via Supabase)

### 1. Database Setup (Backend)
Navigate to the `backend` directory:
```bash
cd backend
npm install
```

Create a `.env` file in the `backend` folder:
```env
PORT=5000
DATABASE_URL="postgresql://user:pass@host:port/dbname"
JWT_SECRET="your_super_secret_key"
FRONTEND_URL="http://localhost:5173"
```

Push the Prisma schema to the database and seed it with the default Admin user (`admin@hostelsphere.com` / `admin123`):
```bash
npx prisma generate
npx prisma db push
npx prisma db seed
npm run dev
```

### 2. Launch the Client (Frontend)
Navigate to the `frontend` directory in a new terminal:
```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:5173` to view the application!

---

## 🎯 Usage & Testing Flow

For a full demonstration of the system's capabilities, we recommend following this testing circuit:

1. **Infrastructure Prep**: Log in as an `ADMIN`. Navigate to your dashboard and create a new Block (e.g., "Alpha Tower"). Then, create two Rooms inside that block.
2. **Student Integration**: Create a completely new account. Since you have no room, the system will actively restrict you from the Mess and Attendance panels. Request a Room.
3. **Allocation Cycle**: Log in as a `WARDEN`. You will see the pent-up request. Approve it. The system will auto-assign the emptiest matching room. 
4. **Move-in**: As the `STUDENT`, confirm your move-in. Your dashboard will dynamically unlock, revealing your new block, floor, room number, and your mess subscription settings.
5. **Billing**: Log in as an `ACCOUNTANT`. Hit the "Generate Invoices" terminal. The system will automatically compute the base room fee + any active mess plans and bill the student.

---

<p align="center">
  <i>Engineered for Scale. Built with ❤️.</i>
</p>
