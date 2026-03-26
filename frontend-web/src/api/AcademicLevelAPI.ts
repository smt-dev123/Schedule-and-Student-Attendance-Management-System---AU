import api from '@/lib/axios'

interface AcademicLevelType {
  id: number
  level: string
}

export const getAcademicLevels = async (): Promise<AcademicLevelType[]> => {
  const res = await api.get('/academic-levels')
  return res.data
}
