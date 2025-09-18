import { DataTable } from '@/components/table/DataTable'
import type { StudentsType } from '@/types'
import { StudentColumns } from './Columns'

interface Props {
  data: StudentsType[]
}

export function StudentTable({ data }: Props) {
  return <DataTable data={data} columns={StudentColumns} />
}
