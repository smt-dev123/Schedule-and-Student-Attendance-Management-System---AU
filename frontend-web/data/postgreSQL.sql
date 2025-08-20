-- =====================
-- Academic Structures
-- =====================
CREATE TABLE levels (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL
);

CREATE TABLE generations (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  level_id INT REFERENCES levels(id)
);

CREATE TABLE faculties (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL
);

CREATE TABLE departments (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  faculty_id INT REFERENCES faculties(id)
);

CREATE TABLE majors (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  department_id INT REFERENCES departments(id)
);

-- =====================
-- Locations
-- =====================
CREATE TABLE buildings (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL
);

CREATE TABLE rooms (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  building_id INT REFERENCES buildings(id)
);

-- =====================
-- Time Management
-- =====================
CREATE TABLE shifts (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  start_time TIME,
  end_time TIME
);

CREATE TABLE sessions (
  id SERIAL PRIMARY KEY,
  shift_id INT REFERENCES shifts(id),
  session_order INT NOT NULL
);

CREATE TABLE study_days (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL
);

-- =====================
-- Teachers & Students
-- =====================
CREATE TABLE teachers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  gender VARCHAR(10),
  dob DATE,
  education_level VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  phone VARCHAR(20)
);

CREATE TABLE students (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  gender VARCHAR(10),
  dob DATE,
  generation_id INT REFERENCES generations(id),
  major_id INT REFERENCES majors(id)
);

-- =====================
-- Subjects & Schedules
-- =====================
CREATE TABLE subjects (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  credit INT,
  department_id INT REFERENCES departments(id)
);

CREATE TABLE schedules (
  id SERIAL PRIMARY KEY,
  subject_id INT REFERENCES subjects(id),
  teacher_id INT REFERENCES teachers(id),
  room_id INT REFERENCES rooms(id),
  generation_id INT REFERENCES generations(id),
  study_day_id INT REFERENCES study_days(id),
  session_id INT REFERENCES sessions(id),
  date_start DATE,
  date_end DATE
);

CREATE TABLE schedule_changes (
  id SERIAL PRIMARY KEY,
  schedule_id INT REFERENCES schedules(id),
  old_date DATE,
  old_session_id INT REFERENCES sessions(id),
  new_date DATE,
  new_session_id INT REFERENCES sessions(id),
  reason TEXT
);

-- =====================
-- Attendance
-- =====================
CREATE TABLE attendances (
  id SERIAL PRIMARY KEY,
  student_id INT REFERENCES students(id),
  schedule_id INT REFERENCES schedules(id),
  date DATE NOT NULL,
  status VARCHAR(20) -- present, absent, late
);

-- =====================
-- Authentication & Roles
-- =====================
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role_id INT,
  profile_id INT, -- teacher_id OR student_id
  profile_type VARCHAR(20) -- 'teacher' | 'student'
);

CREATE TABLE roles (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE permissions (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE role_permissions (
  id SERIAL PRIMARY KEY,
  role_id INT REFERENCES roles(id),
  permission_id INT REFERENCES permissions(id)
);

-- =====================
-- Translations (multi-language)
-- =====================
CREATE TABLE translations (
  id SERIAL PRIMARY KEY,
  key VARCHAR(100) NOT NULL,
  locale VARCHAR(10) NOT NULL, -- 'kh', 'en', 'zh'
  value TEXT NOT NULL
);
