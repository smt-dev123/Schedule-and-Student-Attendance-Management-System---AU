import type { DepartmentsType } from '@/types'
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { KhmerOSsiemreap } from '@/fonts/KhmerOSsiemreap'
import { Button } from '@radix-ui/themes';

const ExportPDF = ({ data }: { data: DepartmentsType[] }) => {
    const handleExportPDF = () => {
        if (!data) return;

        try {
            KhmerOSsiemreap();

            const doc = new jsPDF();

            const tableColumn = ["ល.រ", "តេប៉ាតឺម៉ង់", "មហាវិទ្យាល័យ", "ការពិពណ៌នា"];
            const tableRows = data.map((item: DepartmentsType, index: number) => [
                index + 1,
                item.name ?? "",
                item.faculty?.name ?? "",
                item.description ?? "",
            ]);

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
                    2: { halign: 'center', cellWidth: 40 },
                    3: { halign: 'center', cellWidth: 40 },
                },
                didDrawPage: (dataArg) => {
                    doc.setFont("KhmerOSsiemreap");
                    doc.setFontSize(14);
                    doc.text("តារាងតេប៉ាតឺម៉ង់", dataArg.settings.margin.left, 15);
                },
            });

            const fileName = `តារាងតេប៉ាតឺម៉ង់${new Date().toLocaleDateString('kh-KH')}.pdf`;
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