import { DataTable } from '@/components/table/DataTable'
import type { GradeLevelType } from '@/types'
import { GradeLevelColumns } from './Columns'

interface Props {
  data: GradeLevelType[]
}

export function GradeLevelTable({ data }: Props) {
  return <DataTable data={data} columns={GradeLevelColumns} />
}
