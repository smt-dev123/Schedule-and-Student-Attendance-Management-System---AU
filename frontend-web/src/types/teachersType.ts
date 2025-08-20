export interface TeacherType {
  id: number
  name: string
  gender: string
  marital_status: string
  education_level: string
  email: string
  phone: string
}

export type TeacherCreate = Omit<TeacherType, 'id'>

export type State = {
  teachers: TeacherType[]
  teacher: TeacherType | null
  loading: boolean
  error: string[] | null
  message: string | null
}

export type Actions = {
  fetchTeachers: () => Promise<void>
  fetchOneTeacher: (id: number) => Promise<void>
  createTeacher: (addTeacher: TeacherCreate) => Promise<void>
  updateTeacher: (id: number, editTeacher: TeacherType) => Promise<void>
  deleteTeacher: (id: number) => Promise<void>
}
