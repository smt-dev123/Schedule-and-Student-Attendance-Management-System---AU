import api from '@/lib/axios'

export async function fetchStudents() {
  const response = await api('/students')
  return response.data
}
