import { DataTable } from '@/components/table/DataTable'
import { TeachaerColumns } from './Columns'
import type { TeachersType } from '@/types'

interface Props {
  data: TeachersType[]
}

export function TeacherTable({ data }: Props) {
  return <DataTable data={data} columns={TeachaerColumns} />
}
