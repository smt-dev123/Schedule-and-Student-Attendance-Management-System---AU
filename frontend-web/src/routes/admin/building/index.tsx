import { getBuilding } from '@/api/BuildingAPI'
import { BuildingTable } from '@/features/building/BuildingTable'
import { useTitle } from '@/hooks/useTitle'
import { Button, Flex, Text } from '@radix-ui/themes'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import BuildingCreate from './-actions/Create'
import type { BuildingType } from '@/types'
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { KhmerOSsiemreap } from '@/fonts/KhmerOSsiemreap'

export const Route = createFileRoute('/admin/building/')({
  component: RouteComponent,
})

function RouteComponent() {
  useTitle('Building Management')

  const { data, isLoading, error } = useQuery({
    queryKey: ['buildings'],
    queryFn: getBuilding,
  })

  // --- Export Excel ---
  const handleExportExcel = () => {
    if (!data) return
    try {
      const formattedData = data.map((item: BuildingType, index: number) => ({
        "ល.រ": index + 1,
        "អាគារសិក្សា": item.name,
        "ការពិពណ៌នា": item.description || 'គ្មាន',
        "ស្ថានភាព": item.isActive ? "សកម្ម" : "មិនសកម្ម",
      }));

      const worksheet = XLSX.utils.json_to_sheet(formattedData);
      const workbook = XLSX.utils.book_new();
      const fileName = `តារាងអាគារសិក្សា_${new Date().toLocaleDateString('kh-KH')}.xlsx`;
      XLSX.utils.book_append_sheet(workbook, worksheet, "Buildings");
      XLSX.writeFile(workbook, fileName);
    } catch (err) {
      console.error(err);
      alert("មានបញ្ហាក្នុងការ Export Excel");
    }
  };

  // --- Export PDF ---
  const handleExportPDF = () => {
    if (!data) return;

    try {
      KhmerOSsiemreap();

      const doc = new jsPDF();

      const tableColumn = ["ល.រ", "អាគារសិក្សា", "ការពិពណ៌នា", "ស្ថានភាព"];
      const tableRows = data.map((item: BuildingType, index: number) => [
        index + 1,
        item.name,
        item.description || 'គ្មាន',
        item.isActive ? "សកម្ម" : "មិនសកម្ម",
      ]);

      // បង្កើត Table
      autoTable(doc, {
        startY: 25,
        head: [tableColumn],
        body: tableRows,
        styles: {
          font: "KhmerOSsiemreap",
          fontStyle: "normal",
          fontSize: 10,
          cellPadding: 3,
        },
        headStyles: {
          font: "KhmerOSsiemreap",
          fillColor: [225, 29, 72],
          halign: 'center',
        },
        columnStyles: {
          0: { halign: 'center', cellWidth: 15 },
          3: { halign: 'center', cellWidth: 25 },
        },
        didDrawPage: (dataArg) => {
          doc.setFont("KhmerOSsiemreap");
          doc.setFontSize(14);
          doc.text("តារាងអាគារសិក្សា", dataArg.settings.margin.left, 15);
        },
      });

      doc.save("តារាងអាគារសិក្សា.pdf");
    } catch (err) {
      console.error(err);
      alert("មានបញ្ហាក្នុងការ Export PDF");
    }
  };


  if (isLoading) return <Text>Loading...</Text>
  if (error) return <Text>Error loading data.</Text>

  return (
    <>
      <Flex direction="column" gap="2" mb="4">
        <div className="flex flex-col sm:flex-row justify-between gap-2">
          <Text size="5" className="font-bold">
            តារាងអាគារសិក្សា
          </Text>
          <Flex gap="2">
            <Button
              variant="outline"
              onClick={handleExportExcel}
              style={{ cursor: 'pointer' }}
              color="green"
            >
              Export Excel
            </Button>

            <Button
              variant="outline"
              onClick={handleExportPDF}
              style={{ cursor: 'pointer' }}
              color="violet"
            >
              Export PDF
            </Button>

            <BuildingCreate />
          </Flex>
        </div>
      </Flex>

      <BuildingTable data={data} />
    </>
  )
}