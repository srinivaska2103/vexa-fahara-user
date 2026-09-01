'use client';

import React from 'react';
import Image from 'next/image';
import { Printer, Download, Building2, Sparkles, CheckCircle2, ShieldCheck, Calendar, Clock, MapPin, Phone, Mail } from 'lucide-react';
import { motion } from 'framer-motion';

export default function InvoiceCard({ invoiceData }) {
  if (!invoiceData) return null;

  const subtotalVal = invoiceData.priceData?.subtotal || 0;
  const platformFeeVal = invoiceData.priceData?.platformFee || (subtotalVal * 0.03);
  const txnFeeDisplay = invoiceData.priceData?.transactionFee || (subtotalVal * 0.03);
  const gstDisplay = invoiceData.priceData?.gst || (txnFeeDisplay * 0.18);
  const grandTotalVal = invoiceData.priceData?.grandTotal || (subtotalVal + platformFeeVal + txnFeeDisplay + gstDisplay);

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
        doc.text('FAHARA INVOICE', marginX, currentY);

        currentY += 10;
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(`Invoice No: ${invoiceData.invoiceNumber}`, marginX, currentY);
        currentY += 6;
        doc.text(`Date of Issue: ${invoiceData.invoiceDate}`, marginX, currentY);

        // Cafe Info
        const rightX = 130;
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(14);
        doc.text(invoiceData.cafeName || 'Cafe Name', rightX, 20);
        
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.text('Priyanka Avaneu, C-42, Malligai', rightX, 26);
        doc.text('91, APK Main Rd, Vedugal', rightX, 32);
        doc.text('Madurai, Tamil Nadu 625022', rightX, 38);
        doc.text('Phone: 089460 29205', rightX, 44);

        currentY = 60;

        // Invoice To
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(150, 150, 150);
        doc.text('INVOICE TO', marginX, currentY);
        
        doc.setTextColor(0, 0, 0);
        currentY += 6;
        doc.setFontSize(12);
        doc.text(invoiceData.customerName || 'Customer', marginX, currentY);
        
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        currentY += 6;
        doc.text(invoiceData.customerEmail || '', marginX, currentY);
        currentY += 6;
        doc.text(invoiceData.customerPhone || '', marginX, currentY);

        // Booking Details
        currentY = 60;
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(150, 150, 150);
        doc.text('BOOKING DETAILS', rightX, currentY);
        
        doc.setTextColor(0, 0, 0);
        currentY += 6;
        doc.setFontSize(12);
        doc.text(invoiceData.cafeName || 'Cafe', rightX, currentY);
        
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        currentY += 6;
        doc.text(`Date: ${invoiceData.bookingDate || ''}`, rightX, currentY);
        currentY += 6;
        doc.text(`ID: ${invoiceData.bookingId || ''}`, rightX, currentY);

        currentY = 100;
        
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Description of Services', marginX, currentY);
        currentY += 5;

        const tableData = [];
        const mainService = (!invoiceData.eventCompany && invoiceData.eventPackage) 
          ? 'Cafe Booking & Package Charges' 
          : 'Cafe Booking Charges';
          
        let mainAmount = (!invoiceData.eventCompany && invoiceData.eventPackage) 
          ? ((invoiceData.priceData?.cafeCharges || 0) + (invoiceData.priceData?.eventCharges || 0))
          : (invoiceData.priceData?.cafeCharges || 0);

        tableData.push([
          `${mainService}\n${invoiceData.cafeName} (${invoiceData.guests} Guests)`,
          `Rs. ${mainAmount.toFixed(2)}`
        ]);

        if (invoiceData.eventCompany) {
          tableData.push([
            `Event Package: ${invoiceData.eventPackage || 'Custom'}\nProvided by ${invoiceData.eventCompany}`,
            `Rs. ${(invoiceData.priceData?.eventCharges || 0).toFixed(2)}`
          ]);
        }

        autoTable(doc, {
          startY: currentY,
          head: [['Item', 'Amount']],
          body: tableData,
          theme: 'grid',
          headStyles: { fillColor: [111, 78, 55] },
          styles: { fontSize: 10, cellPadding: 5 },
          columnStyles: { 1: { halign: 'right' } }
        });

        currentY = doc.lastAutoTable.finalY + 15;

        // Payment Info
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text('Payment Information', marginX, currentY);
        
        currentY += 6;
        doc.setFont('helvetica', 'normal');
        doc.text(`Method: ${invoiceData.paymentMethod || 'Online'}`, marginX, currentY);
        currentY += 6;
        doc.text(`Status: ${invoiceData.paymentStatus || 'PAID'}`, marginX, currentY);
        currentY += 6;
        doc.text(`Date: ${invoiceData.paymentDate || ''}`, marginX, currentY);

        // Totals Box
        currentY = doc.lastAutoTable.finalY + 15;
        const totalsX = 130;
        
        doc.setFontSize(10);
        doc.text('Subtotal:', totalsX, currentY);
        doc.text(`Rs. ${(invoiceData.priceData?.subtotal || 0).toFixed(2)}`, 196, currentY, { align: 'right' });
        
        currentY += 6;
        doc.text('Platform Fee:', totalsX, currentY);
        doc.text(`Rs. ${(invoiceData.priceData?.platformFee || 0).toFixed(2)}`, 196, currentY, { align: 'right' });
        
        currentY += 8;
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.text('Total Amount:', totalsX, currentY);
        doc.text(`Rs. ${(invoiceData.priceData?.grandTotal || 0).toFixed(2)}`, 196, currentY, { align: 'right' });

        doc.save(`Invoice_${invoiceData.invoiceNumber || 'Document'}.pdf`);
      });
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      id="invoice-content" 
      className="bg-white rounded-3xl border border-[#DDB892]/60 overflow-hidden shadow-[0_16px_50px_rgba(74,44,17,0.06)] max-w-4xl mx-auto font-sans print:shadow-none print:border-0 print:rounded-none print:max-w-full print:p-0 print:m-0"
    >
      <style jsx global>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 8mm 10mm;
          }
          body {
            background-color: #ffffff !important;
            margin: 0 !important;
            padding: 0 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          /* Hide non-printable headers, navbars and footers */
          header, nav, footer, .print\\:hidden {
            display: none !important;
          }
        }
      `}</style>
      
      {/* Top Header Section */}
      <div className="p-4 sm:p-6 print:p-4 border-b border-stone-100 bg-gradient-to-r from-white via-[#FFF8F0]/40 to-white flex flex-row justify-between items-start gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-8 h-8 rounded-xl bg-[#6F4E37] text-white flex items-center justify-center font-black text-xs shadow-md border border-amber-200/50 print:w-7 print:h-7">
              F
            </div>
            <div>
              <span className="text-[9px] print:text-[8px] font-black text-[#6F4E37] uppercase tracking-widest block leading-none">FAHARA CAFE & EVENTS</span>
              <span className="text-[10px] print:text-[9px] font-bold text-stone-400">Official Invoice Document</span>
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl print:text-xl font-black text-[#2C1810] tracking-tight mb-1">INVOICE</h1>
          <div className="space-y-0.5 text-[11px] print:text-[10px] text-stone-500 font-medium">
            <p>Invoice No: <span className="font-black text-[#6F4E37]">{invoiceData.invoiceNumber}</span></p>
            <p>Date of Issue: <span className="font-bold text-[#2C1810]">{invoiceData.invoiceDate}</span></p>
          </div>
        </div>

        <div className="text-right bg-stone-50/80 p-3 print:p-2.5 rounded-xl border border-stone-200/60 max-w-[260px]">
          <div className="flex items-center gap-1.5 justify-end text-[#6F4E37] mb-1">
            <Building2 size={16} />
            <h2 className="text-sm print:text-xs font-black text-[#2C1810] truncate">{invoiceData.cafeName || 'Partner Cafe'}</h2>
          </div>
          <p className="text-[10px] print:text-[9px] text-stone-500 font-medium leading-tight">Priyanka Avaneu, C-42, Malligai, 91, APK Main Rd</p>
          <p className="text-[10px] print:text-[9px] text-stone-500 font-medium leading-tight">Vedugal, Avaniyapuram, Madurai, TN 625022</p>
          <p className="text-[10px] print:text-[9px] text-[#6F4E37] font-bold mt-0.5">Phone: 089460 29205</p>
        </div>
      </div>

      {/* Customer & Booking Details Section */}
      <div className="p-4 sm:p-6 print:p-4 border-b border-stone-100 bg-white">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-[#FFF8F0]/70 p-3.5 print:p-3 rounded-xl border border-[#DDB892]/40">
            <h3 className="text-[9px] uppercase font-black text-[#6F4E37] tracking-widest mb-1.5 flex items-center gap-1.5">
              <span>INVOICE TO</span>
            </h3>
            <p className="font-black text-xs sm:text-sm print:text-xs text-[#2C1810]">{invoiceData.customerName}</p>
            <p className="text-[11px] print:text-[10px] text-stone-600 font-medium mt-0.5">{invoiceData.customerEmail}</p>
            <p className="text-[11px] print:text-[10px] text-stone-600 font-medium">{invoiceData.customerPhone}</p>
          </div>

          <div className="bg-[#FFF8F0]/70 p-3.5 print:p-3 rounded-xl border border-[#DDB892]/40">
            <h3 className="text-[9px] uppercase font-black text-[#6F4E37] tracking-widest mb-1.5 flex items-center gap-1.5">
              <span>BOOKING DETAILS</span>
            </h3>
            <p className="font-black text-xs sm:text-sm print:text-xs text-[#2C1810]">{invoiceData.cafeName}</p>
            <p className="text-[11px] print:text-[10px] text-stone-600 font-medium mt-0.5">Date: <span className="font-bold text-[#2C1810]">{invoiceData.bookingDate}</span></p>
            <p className="text-[11px] print:text-[10px] text-stone-600 font-medium">Booking ID: <span className="font-bold text-[#6F4E37]">{invoiceData.bookingId}</span></p>
          </div>
        </div>
      </div>

      {/* Description of Services Table */}
      <div className="p-4 sm:p-6 print:p-4 bg-white space-y-4 print:space-y-3">
        <h3 className="text-sm font-black text-[#2C1810] tracking-tight border-b border-stone-100 pb-2 flex items-center gap-1.5">
          <Sparkles size={15} className="text-[#6F4E37]" />
          <span>Description of Services</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-stone-200 text-[10px] print:text-[9px] uppercase font-black text-stone-400 tracking-wider">
                <th className="pb-2 pl-1">Service & Item</th>
                <th className="pb-2 text-right pr-1">Amount</th>
              </tr>
            </thead>
            <tbody className="text-xs print:text-[11px] divide-y divide-stone-100">
              <tr>
                <td className="py-2.5 pl-1">
                  <p className="font-black text-[#2C1810]">
                    {(!invoiceData.eventCompany && invoiceData.eventPackage) ? 'Cafe Booking & Package Charges' : 'Cafe Booking Charges'}
                  </p>
                  <p className="text-stone-500 text-[11px] print:text-[10px] font-medium mt-0.5">
                    {invoiceData.cafeName} ({invoiceData.guests} Guests)
                    {(!invoiceData.eventCompany && invoiceData.eventPackage) ? ` • Includes ${invoiceData.eventPackage}` : ''}
                  </p>
                </td>
                <td className="py-2.5 text-right pr-1 font-black text-[#2C1810]">
                  ₹{(!invoiceData.eventCompany && invoiceData.eventPackage) 
                    ? ((invoiceData.priceData.cafeCharges || 0) + (invoiceData.priceData.eventCharges || 0)).toFixed(2) 
                    : (invoiceData.priceData.cafeCharges || 0).toFixed(2)}
                </td>
              </tr>

              {invoiceData.eventCompany && (
                <tr>
                  <td className="py-2.5 pl-1">
                    <p className="font-black text-[#2C1810]">Event Package: {invoiceData.eventPackage || 'Custom Package'}</p>
                    <p className="text-stone-500 text-[11px] print:text-[10px] font-medium mt-0.5">Provided by {invoiceData.eventCompany}</p>
                  </td>
                  <td className="py-2.5 text-right pr-1 font-black text-[#2C1810]">
                    ₹{(invoiceData.priceData.eventCharges || 0).toFixed(2)}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Payment Summary Box */}
        <div className="grid grid-cols-2 gap-4 pt-2">
          <div className="p-3.5 print:p-3 bg-emerald-50/60 rounded-xl border border-emerald-200/80">
            <h4 className="text-[9px] font-black text-emerald-800 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-emerald-600" />
              <span>Payment Information</span>
            </h4>
            <div className="text-[11px] print:text-[10px] text-stone-600 space-y-1 font-medium">
              <p>Status: <span className="font-black text-emerald-700">PAID & VERIFIED</span></p>
              <p>Payment Method: <span className="font-bold text-[#2C1810]">{invoiceData.paymentMethod}</span></p>
              <p>Date: <span className="font-bold text-[#2C1810]">{invoiceData.paymentDate}</span></p>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-[#FFF8F0] to-[#F5EBE0] p-3.5 print:p-3 rounded-xl border border-[#DDB892]/60 shadow-2xs">
            <div className="space-y-1.5 text-[11px] print:text-[10px] font-medium">
              <div className="flex justify-between text-stone-600">
                <span>Subtotal</span>
                <span className="font-bold text-[#2C1810]">₹{(invoiceData.priceData.subtotal || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Platform Fee (3%)</span>
                <span className="font-bold text-[#2C1810]">₹{platformFeeVal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Transaction Fee (3%)</span>
                <span className="font-bold text-[#2C1810]">₹{txnFeeDisplay.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>GST (18% on Txn Fee)</span>
                <span className="font-bold text-[#2C1810]">₹{gstDisplay.toFixed(2)}</span>
              </div>
              <div className="border-t border-[#DDB892]/60 pt-2 flex justify-between font-black text-sm print:text-xs text-[#6F4E37] mt-1">
                <span>Grand Total</span>
                <span className="text-[#4A2C11]">₹{grandTotalVal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Interactive Footer (Hidden when printing) */}
      <div className="bg-gradient-to-r from-[#4A2C11] to-[#6F4E37] text-white p-5 flex flex-row justify-between items-center gap-4 print:hidden">
        <p className="text-xs font-bold opacity-90 text-left">
          Thank you for booking with Fahara! Need help? Contact info@fahara.com
        </p>
        <div className="flex gap-2.5">
          <motion.button 
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePrint} 
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-white/15 hover:bg-white/25 transition-all text-xs font-black cursor-pointer border border-white/20"
          >
            <Printer size={15} />
            <span>Print</span>
          </motion.button>
          
          <motion.button 
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleDownloadPDF} 
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-white text-[#6F4E37] hover:bg-amber-50 transition-all text-xs font-black cursor-pointer shadow-md"
          >
            <Download size={15} />
            <span>Download PDF</span>
          </motion.button>
        </div>
      </div>

    </motion.div>
  );
}
