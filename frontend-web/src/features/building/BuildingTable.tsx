import { DataTable } from '@/components/table/DataTable'
import type { BuildingType } from '@/types'
import { BuildingColumns } from './Columns'

interface Props {
  data: BuildingType[]
}

export function BuildingTable({ data }: Props) {
  return <DataTable data={data} columns={BuildingColumns} />
}
