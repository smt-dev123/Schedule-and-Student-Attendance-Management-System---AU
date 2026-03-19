import { getRoom } from '@/api/RoomAPI'
import { RoomTable } from '@/features/room/RoomTable'
import { useTitle } from '@/hooks/useTitle'
import { Button, Flex, Text } from '@radix-ui/themes'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import * as XLSX from 'xlsx';
import RoomCreate from './-actions/Create'
import type { RoomType } from '@/types'

export const Route = createFileRoute('/admin/room/')({
  component: RouteComponent,
})

function RouteComponent() {
  useTitle('Room Management')

  const { data, isLoading, error } = useQuery({
    queryKey: ['rooms'],
    queryFn: getRoom,
  })

  const handleExportExcel = () => {
    if (!data) return
    try {
      const formattedData = data.map((item: RoomType, index: number) => ({
        "ល.រ": index + 1,
        "បន្ទប់សិក្សា": item.name,
        "ជាន់បន្ទប់": item.number,
        "អាគារសិក្សា": item.building?.name || 'គ្មាន',
      }));

      const worksheet = XLSX.utils.json_to_sheet(formattedData);
      const workbook = XLSX.utils.book_new();
      const fileName = `តារាងបន្ទប់សិក្សា_${new Date().toLocaleDateString('kh-KH')}.xlsx`;
      XLSX.utils.book_append_sheet(workbook, worksheet, "Rooms");
      XLSX.writeFile(workbook, fileName);
    } catch (err) {
      console.error(err);
      alert("មានបញ្ហាក្នុងការ Export Excel");
    }
  };

  if (isLoading) return <Text>Loading...</Text>
  if (error) return <Text>Error loading students.</Text>
  return (
    <>
      <Flex direction="column" gap="2" mb="4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between gap-2">
          <Text size="5" className="font-bold">
            តារាងបន្ទប់សិក្សា
          </Text>
          <Flex gap="2">
            {/* Export */}
            <Button
              variant="outline"
              onClick={handleExportExcel}
              style={{ cursor: 'pointer' }}
              color="green"
            >
              Export Excel
            </Button>

            <Button variant="outline" style={{ cursor: 'pointer' }}>
              បោះពុម្ភ
            </Button>

            <RoomCreate />
          </Flex>
        </div>
      </Flex>

      <RoomTable data={data} />
    </>
  )
}
