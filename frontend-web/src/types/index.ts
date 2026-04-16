export interface BuildingType {
  id?: number
  name: string
  description?: string
  isActive?: boolean
}

export interface RoomType {
  id?: number
  name: string
  classroomNumber: number
  floor: number
  buildingId: string
  building: {
    id: number
    name: string
    description: string
  }
}

export interface GradeLevelType {
  id?: number
  level: string
  description: string
}

export interface AcademicLevelType {
  id?: number
  level: AcademicLevelEnum
  description?: string
}

export interface SessionTimeType {
  id?: number
  shift: StudyShiftEnum
  firstSessionStartTime: string
  firstSessionEndTime: string
  secondSessionStartTime: string
  secondSessionEndTime: string
  description?: string
  isActive?: boolean
}

export interface ClassesType {
  id?: number
  name: string
  year?: string
  gradeLevelId: number
  roomId: number
  homeroomTeacherId: number
}

export interface GenerationsType {
  id?: number
  name: string
  description: string
}

export interface FacultiesType {
  id?: number
  name: string
  faculty?: {
    id?: number
    name: string
  }
  description: string
}

export interface DepartmentsType {
  id?: number
  name: string
  description: string
  facultyId: string
  faculty?: {
    id?: number
    name: string
  }
}

export interface MajorsType {
  id?: number
  name: string
  description: string
  facultyId?: number
  faculty?: {
    id?: number
    name: string
  }
}

export interface AcademicYearsType {
  id?: number
  name: string
  startDate: string
  endDate: string
  isCurrent: boolean
}

export interface SubjectsType {
  id?: number
  name: string
  gender: GenderEnum
  gradeLevelId: number
  teacherId: number

  gradeLevel?: {
    id?: number
    name?: string
  }
  teacher?: {
    id?: number
    name?: string
  }
}

export interface TeachersType {
  id?: string
  name: string
  gender: GenderEnum
  academicLevelId: number
  facultyId: number
  email: string
  phone: string
  password: string
  education_level?: string
  address?: string
  profile?: string
  departmentId?: number
}

export interface StudentsType {
  id?: string
  name: string
  phone: string
  email: string
  password: string
  facultyId: number
  departmentId: number
  academicLevelId: number
  academicYearId: number | null
  educationalStatus: EducationalStatusEnum
  year: number | null
  gender: GenderEnum
  generation: number | null
  semester: number | null
  isActive?: boolean

  academicYear?: {
    id?: number
    name?: string
  }
}

export interface CoursesType {
  id?: number
  name: string
  code: string
  credit: number
  description: string
  day: DayEnum
  teacherId: number
  subjectId: number
  sessionTimeId: number
  firstSessionNote: string
  secondSessionNote: string
  isActive: boolean

  teacher?: {
    id?: number
    name?: string
  }
  subject?: {
    id?: number
    name?: string
  }
  sessionTime?: {
    id?: number
    name?: string
  }
}

export interface AttendancesType {
  id?: number
  studentId: number
  classId: number
  date: Date
  status: AttendanceStatusEnum
  note: string

  student?: {
    name: string
  }
  class?: {
    name: string
  }
}

export interface ScheduleType {
  id?: number
  gradeLavel: string // កម្រិតថ្នាក់
  generations: string // ជំនាន់
  year: string // ឆ្នាំទី
  programId: string // ជំនាញ
  startDay: string // ថ្ងៃចាប់ផ្ដើម
  endDay: string // ថ្ងៃបញ្ចប់
  sessionId: string // វេនសិក្សា
  classId: string // បន្ទប់
  buildingId: string // អគារ
  floor: string // ជាន់ទី
  time: string // ពេលវេលា
  studyDaysId: string // ច្ងៃ
  subjectId: string // មុខវិជ្ជា
  teacherId: string // ឈ្មោះគ្រូ
  phone: string // លេខគ្រូ
}

export interface TranslationType {
  id?: number
  key: string
  value: string
}

export interface UsersType {
  id?: number
  username?: string
  email: string
  password: string
  role: string
  profile?: string
}

// Enums
type DayEnum =
  | 'Monday'
  | 'Tuesday'
  | 'Wednesday'
  | 'Thursday'
  | 'Friday'
  | 'Saturday'
  | 'Sunday'

type StudyShiftEnum = 'morning' | 'evening' | 'night'

type AcademicLevelEnum = 'Associate' | 'Bachelor' | 'Master' | 'PhD'

type GenderEnum = 'male' | 'female' | 'other'

type EducationalStatusEnum =
  | 'enrolled'
  | 'graduated'
  | 'dropped out'
  | 'transferred'

type AttendanceStatusEnum = 'present' | 'absent' | 'late' | 'excused'
