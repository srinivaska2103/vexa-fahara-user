import { Printer, Download } from 'lucide-react';
import PriceBreakdown from './PriceBreakdown';
import { motion } from 'framer-motion';

export default function ReceiptCard({ receiptData }) {
  if (!receiptData) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    import('jspdf').then(({ default: jsPDF }) => {
      import('jspdf-autotable').then(({ default: autoTable }) => {
        const doc = new jsPDF();
        const marginX = 14;
        let currentY = 20;

        // Header
        doc.setFontSize(24);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(111, 78, 55);
        doc.text('RECEIPT', marginX, currentY);

        currentY += 10;
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(150, 150, 150);
        doc.text(`Receipt No: `, marginX, currentY);
        doc.setTextColor(0, 0, 0);
        doc.text(receiptData.receiptNumber || '', marginX + 22, currentY);
        
        currentY += 6;
        doc.setTextColor(150, 150, 150);
        doc.text(`Date: `, marginX, currentY);
        doc.setTextColor(0, 0, 0);
        doc.text(receiptData.paymentDate || '', marginX + 10, currentY);

        // Fahara Info (Right Side)
        const rightX = 140;
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(18);
        doc.text('Fahara', rightX, 22);
        
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.setTextColor(150, 150, 150);
        doc.text('vexatech.connect@gmail.com', rightX, 28);

        currentY = 50;

        // Billed To
        doc.setFontSize(10);
        doc.setTextColor(150, 150, 150);
        doc.text('Billed To:', marginX, currentY);
        
        doc.setTextColor(0, 0, 0);
        currentY += 6;
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text(receiptData.customerName || 'Customer', marginX, currentY);

        // Booking Info (Right Side)
        currentY = 50;
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(150, 150, 150);
        doc.text('Booking Info:', rightX, currentY);
        
        doc.setTextColor(0, 0, 0);
        currentY += 6;
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.text(receiptData.cafeName || 'Cafe', rightX, currentY);
        
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.setTextColor(150, 150, 150);
        currentY += 6;
        doc.text(`ID: ${receiptData.bookingId || ''}`, rightX, currentY);
        currentY += 6;
        doc.text(receiptData.bookingDate || '', rightX, currentY);

        currentY = 80;

        if (receiptData.eventCompany) {
          doc.setFontSize(10);
          doc.setTextColor(150, 150, 150);
          doc.text('Event Arrangements:', marginX, currentY);
          
          doc.setTextColor(0, 0, 0);
          currentY += 6;
          doc.setFontSize(11);
          doc.setFont('helvetica', 'bold');
          doc.text(`${receiptData.eventCompany} - ${receiptData.eventPackage}`, marginX, currentY);
          currentY += 15;
        }

        // Table
        const txnFee = receiptData.priceData?.transactionFee || ((receiptData.priceData?.subtotal || 0) * 0.03);
        const gstVal = receiptData.priceData?.gst || (txnFee * 0.18);

        const tableData = [];
        tableData.push(['Subtotal', `Rs. ${(receiptData.priceData?.subtotal || 0).toFixed(2)}`]);
        tableData.push(['Platform Fee (3%)', `Rs. ${(receiptData.priceData?.platformFee || 0).toFixed(2)}`]);
        tableData.push(['Transaction Fee (3%)', `Rs. ${txnFee.toFixed(2)}`]);
        tableData.push(['GST (18% on Txn Fee)', `Rs. ${gstVal.toFixed(2)}`]);
        tableData.push(['Total Amount', `Rs. ${(receiptData.priceData?.grandTotal || 0).toFixed(2)}`]);

        autoTable(doc, {
          startY: currentY,
          body: tableData,
          theme: 'plain',
          styles: { fontSize: 11, cellPadding: 5 },
          columnStyles: { 0: { fontStyle: 'normal' }, 1: { halign: 'right', fontStyle: 'bold' } },
          didParseCell: function(data) {
            if (data.row.index === 4) {
              data.cell.styles.fontStyle = 'bold';
              data.cell.styles.fontSize = 13;
              data.cell.styles.textColor = [111, 78, 55];
            }
          }
        });

        currentY = doc.lastAutoTable.finalY + 15;

        // Payment Status
        doc.setFillColor(240, 253, 244);
        doc.setDrawColor(187, 247, 208);
        doc.roundedRect(marginX, currentY, 180, 15, 3, 3, 'FD');
        
        doc.setFontSize(11);
        doc.setTextColor(21, 128, 61);
        doc.setFont('helvetica', 'bold');
        doc.text('Payment Status: ', marginX + 5, currentY + 10);
        
        doc.setFont('helvetica', 'normal');
        doc.text(`Paid via ${receiptData.paymentMethod || 'Online'}`, marginX + 40, currentY + 10);

        doc.save(`Receipt_${receiptData.receiptNumber || 'Document'}.pdf`);
      });
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      id="receipt-content" 
      className="bg-white/95 backdrop-blur-xl rounded-3xl border border-stone-200/90 overflow-hidden shadow-[0_16px_50px_rgba(0,0,0,0.06)] max-w-2xl mx-auto font-sans w-full print:shadow-none print:border-none print:rounded-none print:max-w-full print:bg-white print:m-0 print:p-0"
    >
      <div className="p-5 sm:p-8 border-b border-stone-200/80 flex flex-wrap gap-4 justify-between items-start bg-[#FFF8F0]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#6F4E37] tracking-tight mb-1.5">RECEIPT</h1>
          <p className="text-xs text-stone-500 font-extrabold flex flex-wrap gap-1">Receipt No: <span className="font-black text-[#2C1810] font-mono break-all">{receiptData.receiptNumber}</span></p>
          <p className="text-xs text-stone-500 font-extrabold mt-0.5">Date: <span className="font-black text-[#2C1810]">{receiptData.paymentDate}</span></p>
        </div>
        <div className="text-left sm:text-right">
          <h2 className="text-xl sm:text-2xl font-black text-[#2C1810] tracking-wide">Fahara</h2>
          <p className="text-xs text-stone-500 font-bold truncate max-w-[200px] sm:max-w-full">vexatech.connect@gmail.com</p>
        </div>
      </div>

      <div className="p-5 sm:p-8">
        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6 pb-6 border-b border-stone-100">
          <div>
            <p className="text-[10px] font-black uppercase tracking-wider text-stone-400 mb-1">Billed To:</p>
            <p className="font-black text-sm sm:text-base text-[#2C1810]">{receiptData.customerName}</p>
          </div>
          <div className="text-left sm:text-right">
            <p className="text-[10px] font-black uppercase tracking-wider text-stone-400 mb-1">Booking Info:</p>
            <p className="font-black text-xs sm:text-sm text-[#2C1810]">{receiptData.cafeName}</p>
            <p className="text-xs text-stone-500 font-mono font-bold">ID: {receiptData.bookingId}</p>
            <p className="text-xs text-stone-500 font-semibold">{receiptData.bookingDate}</p>
          </div>
        </div>

        {receiptData.eventCompany && (
          <div className="mb-6 p-3.5 bg-[#FFF8F0] border border-[#DDB892]/40 rounded-2xl">
            <p className="text-[10px] font-black uppercase tracking-wider text-[#6F4E37] mb-1">Event Arrangements:</p>
            <p className="font-black text-xs sm:text-sm text-[#2C1810]">{receiptData.eventCompany} - {receiptData.eventPackage}</p>
          </div>
        )}

        <div className="mb-6">
          <PriceBreakdown data={receiptData.priceData} />
        </div>
        
        <div className="flex items-center gap-2 text-xs sm:text-sm text-emerald-800 bg-emerald-50/80 p-3.5 sm:p-4 rounded-2xl border border-emerald-200/80">
          <span className="font-black">Payment Status:</span>
          <span className="font-bold">Paid via {receiptData.paymentMethod}</span>
        </div>
      </div>

      <div className="p-4 sm:p-6 bg-stone-50/90 border-t border-stone-200/80 flex flex-wrap justify-end gap-3 print:hidden" data-html2canvas-ignore="true">
        <motion.button 
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.95 }}
          onClick={handlePrint} 
          className="flex items-center justify-center gap-2 px-5 sm:px-6 py-2.5 rounded-2xl border border-stone-200 text-stone-700 bg-white hover:bg-stone-50 transition-all font-black text-xs cursor-pointer shadow-2xs flex-1 sm:flex-initial"
        >
          <Printer size={15} />
          <span>Print</span>
        </motion.button>
        <motion.button 
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleDownloadPDF} 
          className="flex items-center justify-center gap-2 px-5 sm:px-6 py-2.5 rounded-2xl bg-gradient-to-r from-[#4A2C11] to-[#6F4E37] text-white transition-all font-black text-xs shadow-md hover:shadow-lg cursor-pointer flex-1 sm:flex-initial"
        >
          <Download size={15} />
          <span>Download PDF</span>
        </motion.button>
      </div>
    </motion.div>
  );
}
