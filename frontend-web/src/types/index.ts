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
  description: string
}
//
export interface SubjectsType {
  id?: number
  name: string
  gender: string
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
  gender: string
  academicLevelId: number
  facultyId: number
  email: string
  phone: string
  education_level?: string
  address?: string
  profile?: string
  departmentId?: number
}

export interface StudentsType {
  id?: number
  name: string
  gender: string
  dob: string
  pob: string
  phone: string
  email: string
  status: 'សកម្ម' | 'អសកម្ម' | 'សម្រាក' | 'បោះបង់'
  profile: string
  programId: number
}
//
export interface AttendancesType {
  id?: number
  studentId: number
  classId: number
  date: Date
  status: 'Present' | 'Absent' | 'Late' | 'Excused'
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

export interface UsersType {
  id?: number
  username?: string
  email: string
  password: string
  role: string
  profile?: string
}
