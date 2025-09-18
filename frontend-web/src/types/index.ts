//
export interface BuildingType {
  id?: number
  name: string
  description?: string
}
//
export interface RoomType {
  id?: number
  name: string
  buildingId: string
  floor: string
  building?: {
    name?: string
  }
}
//
export interface GradeLavelType {
  id?: number
  name: string
  description?: string
}
//
export interface ClassesType {
  id?: number
  name: string
  year?: string
  gradeLevelId: number
  roomId: number
  homeroomTeacherId: number

  gradeLevel?: {
    name?: string
  }
  room?: {
    name?: string
  }
  homeroomTeacher?: {
    name?: string
  }
}
//
export interface SubjectsType {
  id?: number
  name: string
  gender: string
  gradeLevelId: number
  teacherId: number

  gradeLevel?: {
    name?: string
  }
  teacher?: {
    name?: string
  }
}
//
export interface TeachersType {
  id?: number
  name: string
  email: string
  phone: string
  role: string
  address: string
}

export interface StudentsType {
  id?: number
  name: string
  gender: string
  dob: string
  pob: string
  phone: string
  email: string
  statusId: number
  photo: string
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
