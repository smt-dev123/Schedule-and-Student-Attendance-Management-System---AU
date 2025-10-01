import { DataTable } from '@/components/table/DataTable'
import type { RoomType } from '@/types'
import { RoomColumns } from './Columns'

interface Props {
  data: RoomType[]
}

export function RoomTable({ data }: Props) {
  return <DataTable data={data} columns={RoomColumns} />
}
