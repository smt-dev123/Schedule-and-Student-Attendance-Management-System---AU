import { DataTable } from '@/components/table/DataTable'
import type { GenerationsType } from '@/types'
import { GenerationColumns } from './Columns'

interface Props {
  data: GenerationsType[]
}

export function GenerationTable({ data }: Props) {
  return <DataTable data={data} columns={GenerationColumns} />
}
