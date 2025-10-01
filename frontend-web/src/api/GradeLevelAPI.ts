import api from '@/lib/axios'
import type { GradeLevelType } from '@/types'

export const getGradeLevel = async () => {
  const res = await api.get('/gradeLevels')
  return res.data
}

export const createGradeLevel = async (newGradeLevel: GradeLevelType) => {
  const res = await api.post('/gradeLevels', newGradeLevel)
  return res.data
}

export const updateGradeLevel = async (
  id: number,
  updateGradeLevel: GradeLevelType,
) => {
  const res = await api.put(`/gradeLevels/${id}`, updateGradeLevel)
  return res.data
}

export const deleteGradeLevel = async (id: number) => {
  const res = await api.delete(`/gradeLevels/${id}`)
  return res.data
}
