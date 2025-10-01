import { DataTable } from '@/components/table/DataTable'
import type { ClassesType } from '@/types'
import { ClassColumns } from './Columns'

interface Props {
  data: ClassesType[]
}

export function ClassTable({ data }: Props) {
  return <DataTable data={data} columns={ClassColumns} />
}
