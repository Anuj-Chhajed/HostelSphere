-- SmartHostel Database Initialization
-- Run this file ONCE to set up all tables
-- Command: psql -U postgres -d smarthostel -f src/database/init.sql

-- ===== CREATE ENUM TYPES =====

CREATE TYPE user_role AS ENUM ('STUDENT', 'WARDEN', 'ACCOUNTANT', 'ADMIN');
CREATE TYPE room_type AS ENUM ('SINGLE', 'DOUBLE');
CREATE TYPE room_status AS ENUM ('AVAILABLE', 'OCCUPIED', 'FULL', 'UNDER_MAINTENANCE');
CREATE TYPE allocation_status AS ENUM ('REQUESTED', 'APPROVED', 'REJECTED', 'OCCUPIED', 'VACATED');
CREATE TYPE payment_type AS ENUM ('HOSTEL_FEE', 'MESS_FEE', 'PENALTY', 'SECURITY_DEPOSIT');
CREATE TYPE payment_status AS ENUM ('PENDING', 'PAID', 'OVERDUE', 'PARTIALLY_PAID', 'REFUNDED');
CREATE TYPE payment_method AS ENUM ('CASH', 'UPI', 'BANK_TRANSFER', 'CARD');
CREATE TYPE complaint_category AS ENUM ('MAINTENANCE', 'HYGIENE', 'NOISE', 'ELECTRICAL', 'PLUMBING', 'OTHER');
CREATE TYPE complaint_priority AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');
CREATE TYPE complaint_status AS ENUM ('OPEN', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'CLOSED');
CREATE TYPE attendance_status AS ENUM ('PRESENT', 'ABSENT', 'ON_LEAVE');
CREATE TYPE mess_plan_type AS ENUM ('VEG', 'NON_VEG', 'SPECIAL');
CREATE TYPE meal_type AS ENUM ('BREAKFAST', 'LUNCH', 'DINNER', 'SNACKS');
CREATE TYPE notification_type AS ENUM ('ALLOCATION_UPDATE', 'PAYMENT_REMINDER', 'PAYMENT_OVERDUE', 'COMPLAINT_UPDATE', 'ATTENDANCE_ALERT', 'MESS_PLAN_UPDATE', 'SYSTEM_ANNOUNCEMENT');

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ===== TABLE 1: USERS =====

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    role user_role NOT NULL,
    phone VARCHAR(20),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ===== TABLE 2: STUDENTS =====

CREATE TABLE students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    enrollment_number VARCHAR(50) UNIQUE NOT NULL,
    department VARCHAR(100),
    year INT,
    emergency_contact VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ===== TABLE 3: WARDENS =====

CREATE TABLE wardens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    assigned_block_id UUID,
    assigned_floor INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ===== TABLE 4: BLOCKS =====

CREATE TABLE blocks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) UNIQUE NOT NULL,
    total_floors INT NOT NULL,
    total_rooms INT DEFAULT 0,
    warden_id UUID REFERENCES wardens(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add FK from wardens to blocks (circular reference)
ALTER TABLE wardens ADD CONSTRAINT fk_warden_block FOREIGN KEY (assigned_block_id) REFERENCES blocks(id) ON DELETE SET NULL;

-- ===== TABLE 5: ROOMS =====

CREATE TABLE rooms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    room_number VARCHAR(20) UNIQUE NOT NULL,
    block_id UUID NOT NULL REFERENCES blocks(id) ON DELETE CASCADE,
    floor INT NOT NULL,
    type room_type NOT NULL,
    capacity INT NOT NULL,
    current_occupancy INT DEFAULT 0,
    status room_status DEFAULT 'AVAILABLE',
    price_per_month DECIMAL(10, 2) NOT NULL,
    amenities TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ===== TABLE 6: ROOM_ALLOCATIONS =====

CREATE TABLE room_allocations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE RESTRICT,
    room_id UUID REFERENCES rooms(id) ON DELETE RESTRICT,
    status allocation_status DEFAULT 'REQUESTED',
    preferred_type room_type,
    request_date DATE DEFAULT CURRENT_DATE,
    approval_date DATE,
    occupied_date DATE,
    vacated_date DATE,
    approved_by UUID REFERENCES wardens(id) ON DELETE SET NULL,
    remarks TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ===== TABLE 7: PAYMENTS =====

CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE RESTRICT,
    type payment_type NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    penalty_amount DECIMAL(10, 2) DEFAULT 0,
    total_amount DECIMAL(10, 2) NOT NULL,
    due_date DATE NOT NULL,
    paid_date DATE,
    status payment_status DEFAULT 'PENDING',
    method payment_method,
    receipt_number VARCHAR(50) UNIQUE,
    month VARCHAR(20),
    year INT,
    recorded_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ===== TABLE 8: COMPLAINTS =====

CREATE TABLE complaints (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE RESTRICT,
    category complaint_category NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    priority complaint_priority DEFAULT 'MEDIUM',
    status complaint_status DEFAULT 'OPEN',
    assigned_to UUID REFERENCES wardens(id) ON DELETE SET NULL,
    resolution TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP
);

-- ===== TABLE 9: ATTENDANCE_RECORDS =====

CREATE TABLE attendance_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    status attendance_status NOT NULL,
    marked_by UUID REFERENCES wardens(id) ON DELETE SET NULL,
    remarks TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(student_id, date)
);

-- ===== TABLE 10: ENTRY_EXIT_LOGS =====

CREATE TABLE entry_exit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    entry_time TIMESTAMP,
    exit_time TIMESTAMP,
    gate VARCHAR(50),
    logged_by UUID REFERENCES wardens(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ===== TABLE 11: MESS_PLANS =====

CREATE TABLE mess_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL,
    type mess_plan_type NOT NULL,
    description TEXT,
    price_per_month DECIMAL(10, 2) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ===== TABLE 12: MESS_SUBSCRIPTIONS =====

CREATE TABLE mess_subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    plan_id UUID NOT NULL REFERENCES mess_plans(id) ON DELETE RESTRICT,
    start_date DATE NOT NULL,
    end_date DATE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ===== TABLE 13: MESS_MENUS =====

CREATE TABLE mess_menus (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    day_of_week VARCHAR(20) NOT NULL,
    meal_type meal_type NOT NULL,
    items TEXT NOT NULL,
    plan_type mess_plan_type NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ===== TABLE 14: NOTIFICATIONS =====

CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type notification_type NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ===== TABLE 15: AUDIT_LOGS =====

CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID,
    details JSONB,
    ip_address VARCHAR(45),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ===== INDEXES FOR PERFORMANCE =====

CREATE INDEX idx_rooms_block_status ON rooms(block_id, status);
CREATE INDEX idx_rooms_type_status ON rooms(type, status);
CREATE INDEX idx_allocations_student_status ON room_allocations(student_id, status);
CREATE INDEX idx_allocations_status_date ON room_allocations(status, request_date);
CREATE INDEX idx_payments_student_status ON payments(student_id, status);
CREATE INDEX idx_payments_status_due ON payments(status, due_date);
CREATE INDEX idx_payments_month_year ON payments(month, year);
CREATE INDEX idx_complaints_student_status ON complaints(student_id, status);
CREATE INDEX idx_complaints_status_priority ON complaints(status, priority);
CREATE INDEX idx_complaints_assigned ON complaints(assigned_to, status);
CREATE INDEX idx_attendance_student_date ON attendance_records(student_id, date);
CREATE INDEX idx_entry_exit_student ON entry_exit_logs(student_id, created_at);
CREATE INDEX idx_subscriptions_student ON mess_subscriptions(student_id, is_active);
CREATE INDEX idx_notifications_user ON notifications(user_id, is_read);
CREATE INDEX idx_audit_entity ON audit_logs(entity_type, entity_id);
