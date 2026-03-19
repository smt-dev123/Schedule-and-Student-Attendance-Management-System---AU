import api from '@/lib/axios'
import type { AttendancesType } from '@/types'

const ENDPOINT = '/attendances'

export const getAttendances = async () => {
    const res = await api.get(ENDPOINT)
    return res.data
}

export const createAttendance = async (data: AttendancesType) => {
    const res = await api.post(ENDPOINT, data)
    return res.data
}

export const updateAttendance = async (id: number, data: AttendancesType) => {
    const res = await api.put(`${ENDPOINT}/${id}`, data)
    return res.data
}

export const deleteAttendance = async (id: number) => {
    const res = await api.delete(`${ENDPOINT}/${id}`)
    return res.data
}