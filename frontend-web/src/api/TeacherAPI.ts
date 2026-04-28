import api from '@/lib/axios'
import type { TeachersType } from '@/types'

export const getTeachers = async () => {
  const res = await api.get('/teachers')
  return res.data?.data ?? []
}

export const createTeachers = async (data: any) => {
  const res = await api.post('/teachers', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return res.data?.data ?? []
}

export const updateTeachers = async (id: string, data: any) => {
  const res = await api.put(`/teachers/${id}`, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return res.data?.data
}

export const deleteTeachers = async (id: string) => {
  const res = await api.delete(`/teachers/${id}`)
  return res.data?.data
}
