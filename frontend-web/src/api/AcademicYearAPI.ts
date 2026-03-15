import api from '@/lib/axios'
import type { AcademicYearsType } from '@/types'
export const getAcademicYear = async () => {
  const res = await api.get('/academic_years')
  return res.data
}

export const createAcademicYear = async (
  newAcademicYear: AcademicYearsType,
) => {
  const res = await api.post('/academic_years', newAcademicYear)
  return res.data
}

export const updateAcademicYear = async (
  id: number,
  updateAcademicYear: AcademicYearsType,
) => {
  const res = await api.put(`/academic_years/${id}`, updateAcademicYear)
  return res.data
}

export const deleteAcademicYear = async (id: number) => {
  const res = await api.delete(`/academic_years/${id}`)
  return res.data
}
