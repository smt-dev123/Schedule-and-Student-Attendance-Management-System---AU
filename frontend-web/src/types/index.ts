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

export interface GradeLevelType {
  id?: number
  name: string
}

export interface ClassesType {
  id?: number
  name: string
  year?: string
  gradeLevelId: number
  roomId: number
  homeroomTeacherId: number
}

export interface GenerationsType{
  id?: number
  name: string
}

export interface FacultiesType{
  id?: number
  name: string
}

export interface MajorsType{
  id?: number
  name: string
  departmentId: string
  department?:{
    name: string
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

export interface UsersType{
  id?: number,
  username?: string
  email: string
  password: string
  role: string
  profile?: string
}