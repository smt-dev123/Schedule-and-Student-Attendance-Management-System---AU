import { DataTable } from '@/components/table/DataTable'
import type { UsersType } from '@/types'
import { UserColumns } from './Columns'

interface Props {
  data: UsersType[]
}

export function UserTable({ data }: Props) {
  return <DataTable data={data} columns={UserColumns} />
}
