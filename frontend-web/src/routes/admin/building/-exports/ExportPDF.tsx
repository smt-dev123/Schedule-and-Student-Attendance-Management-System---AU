import type { BuildingType } from '@/types'
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { KhmerOSsiemreap } from '@/fonts/KhmerOSsiemreap'
import { Button } from '@radix-ui/themes';

const ExportPDF = ({ data }: { data: BuildingType[] }) => {
    const handleExportPDF = () => {
        if (!data) return;

        try {
            KhmerOSsiemreap();

            const doc = new jsPDF();

            const tableColumn = ["ល.រ", "អាគារសិក្សា", "ការពិពណ៌នា", "ស្ថានភាព"];
            const tableRows = data.map((item: BuildingType, index: number) => [
                index + 1,
                item.name,
                item.description || '',
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

            const fileName = `តារាងអាគារសិក្សា_${new Date().toLocaleDateString('kh-KH')}.pdf`;
            doc.save(fileName);
        } catch (err) {
            console.error(err);
            alert("មានបញ្ហាក្នុងការ Export PDF");
        }
    };
    return (
        <Button
            variant="outline"
            onClick={handleExportPDF}
            style={{ cursor: 'pointer' }}
            color="green"
        >
            Export PDF
        </Button>
    )
}

export default ExportPDF