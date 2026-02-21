CREATE TABLE IF NOT EXISTS accounts (
    account_id SERIAL PRIMARY KEY,
    full_name TEXT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('student', 'faculty'))
);

CREATE TABLE IF NOT EXISTS attendance_history (
    history_id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES accounts(account_id),
    faculty_id INTEGER REFERENCES accounts(account_id),
    attendance_date DATE NOT NULL,
    attendance_status TEXT NOT NULL CHECK (attendance_status IN ('Present', 'Absent')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_attendance_student ON attendance_history(student_id);
