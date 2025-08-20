import { create } from 'zustand'
// import api from '@/lib/axios'
import type {
  Actions,
  State,
  TeacherCreate,
  TeacherType,
} from '@/types/teachersType'
import axios from 'axios'

export const useTeacherStore = create<State & Actions>((set) => ({
  teachers: [],
  teacher: null,
  loading: false,
  error: null,
  message: null,

  fetchTeachers: async () => {
    set({ loading: true, error: null })
    try {
      const response = await axios.get<TeacherType[]>(
        'http://127.0.0.1:5000/teachers',
      )
      const updatedTeachers = response.data.map((teacher) => {
        if (teacher.education_level === 'បរិញ្ញាបត្រជាន់ខ្ពស់') {
          return { ...teacher, name: `អនុបណ្ឌិត ${teacher.name}` }
        } else if (teacher.education_level === 'បណ្ឌិត') {
          return { ...teacher, name: `បណ្ឌិត ${teacher.name}` }
        }
        return teacher
      })
      set({ teachers: updatedTeachers })
    } catch (err: any) {
      set({ error: [err.message] })
    } finally {
      set({ loading: false })
    }
  },

  fetchOneTeacher: async (id: number) => {
    set({ loading: true, error: null })
    try {
      const response = await axios.get<TeacherType>(
        `http://127.0.0.1:5000/teachers/${id}`,
      )
      const teacher = response.data
      if (teacher.education_level === 'បរិញ្ញាបត្រជាន់ខ្ពស់') {
        teacher.name = `អនុបណ្ឌិត ${teacher.name}`
      }
      set({ teacher: response.data })
    } catch (err: any) {
      set({ error: [err.message] })
    } finally {
      set({ loading: false })
    }
  },

  createTeacher: async (addTeacher: TeacherCreate) => {
    set({ loading: true, error: null })
    try {
      const response = await axios.post<TeacherType>(
        'http://127.0.0.1:5000/teachers',
        addTeacher,
      )

      set({ teacher: response.data })
    } catch (err: any) {
      set({ error: [err.message] })
    } finally {
      set({ loading: false })
    }
  },

  updateTeacher: async (id: number, editTeacher: TeacherType) => {
    set({ loading: true, error: null })
    try {
      const response = await axios.put<TeacherType>(
        `http://127.0.0.1:5000/teachers${id}`,
        editTeacher,
      )

      set({ teacher: response.data })
    } catch (err: any) {
      set({ error: [err.message] })
    } finally {
      set({ loading: false })
    }
  },

  deleteTeacher: async (id: number) => {
    try {
      await axios.put(`http://127.0.0.1:5000/teachers${id}`)

      set({ message: 'deleted successfully.' })
    } catch (err: any) {
      set({ error: [err.message] })
    } finally {
      set({ loading: false })
    }
  },
}))
