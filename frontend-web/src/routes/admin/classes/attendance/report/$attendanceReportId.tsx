import {
  BodyTable,
  CellTable,
  HeaderTable,
  RootTable,
  RowTable,
} from '@/components/ui/tables/table'
import { Button, Flex, Text } from '@radix-ui/themes'
import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import { FaArrowLeft } from 'react-icons/fa'

export const Route = createFileRoute(
  '/admin/classes/attendance/report/$attendanceReportId',
)({
  component: RouteComponent,
})

function RouteComponent() {
  const router = useRouter()

  return (
    <>
      <Flex direction="column" gap="4">
        {/*  */}
        <Flex direction="row" justify="between">
          <Flex gap="2" align="center">
            <button
              onClick={() => router.history.back()}
              className="cursor-pointer hover:text-xl transition-all"
            >
              <FaArrowLeft />
            </button>
            <Text size="5" className="font-bold">
              របាយការណ៍វត្តមាននិស្សិត
            </Text>
          </Flex>
          <Flex gap="2">
            {/* Export */}
            <Button variant="solid" style={{ cursor: 'pointer' }} asChild>
              <Link
                to="/admin/classes/attendance/report/$attendanceReportId"
                params={{ attendanceReportId: '1' }}
              >
                ព្រីនរបាយការណ៍
              </Link>
            </Button>
          </Flex>
        </Flex>
        <Flex direction="column" gap="2" className="text-center mb-4 font-bold">
          <Text>សម្រង់វត្តមាននិស្សិតថ្នាក់បរិញ្ញាបត្រ</Text>
          <Text>
            ជំនាន់ទី១៩ ឆ្នាំទី៤ ឆមាស១ មុខជំនាញ៖ វិទ្យាសាស្រ្ដកុំព្យូទ័រ
          </Text>
          <Text>
            វេនសិក្សា៖ ពេលយប់ បន្ទប់៖ ស្រុកកងមាស (អគារ អ្នកឧកញ៉ា បណ្ឌិត សៀង ណាំ
            ជាន់ទី១)
          </Text>
          <Text>បង្រៀនដោយ៖ ល. សេង ស៊ង់ មុខវិជ្ជា៖ Web Development</Text>
        </Flex>
      </Flex>
      <RootTable>
        <HeaderTable>
          <RowTable isHeader>
            <CellTable className="w-16" isHeader>
              ល.រ
            </CellTable>
            <CellTable isHeader>ឈ្មោះនិស្សិត</CellTable>
            <CellTable className="w-20" isHeader>
              ភេទ
            </CellTable>
            <CellTable className="w-10" isHeader>
              1
            </CellTable>
            <CellTable className="w-10" isHeader>
              2
            </CellTable>
            <CellTable className="w-10" isHeader>
              3
            </CellTable>
            <CellTable className="w-10" isHeader>
              4
            </CellTable>
            <CellTable className="w-10" isHeader>
              5
            </CellTable>
            <CellTable className="w-20" isHeader>
              ច្បាប់
            </CellTable>
            <CellTable className="w-20" isHeader>
              ឥតច្បាប់
            </CellTable>
            <CellTable className="w-20" isHeader>
              សរុប
            </CellTable>
            <CellTable className="w-20" isHeader noRightBorder>
              ភារយ
            </CellTable>
          </RowTable>
        </HeaderTable>
        <BodyTable>
          <RowTable>
            <CellTable>1</CellTable>
            <CellTable className="text-left">លុយ សុមាត្រា</CellTable>
            <CellTable>ប្រុស</CellTable>
            <CellTable>⎷</CellTable>
            <CellTable>⎷</CellTable>
            <CellTable>⎷</CellTable>
            <CellTable>P</CellTable>
            <CellTable>⎷</CellTable>
            <CellTable>1</CellTable>
            <CellTable>0</CellTable>
            <CellTable>1</CellTable>
            <CellTable noRightBorder>0.33</CellTable>
          </RowTable>
        </BodyTable>
      </RootTable>
    </>
  )
}
