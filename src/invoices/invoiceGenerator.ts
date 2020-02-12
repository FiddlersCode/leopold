import {Gig} from "../mongo/gig"
import * as fse from 'fs-extra'

export interface InvoiceData {
    gigs: Gig[],
    dueDate: Date,
}

export class InvoiceGenerator {
    generateInvoice = async (invoiceData: InvoiceData, outputFile: string) => {
        const PDFDocument = require('pdfkit');
        const doc = new PDFDocument;
        const text = this.formatInvoiceText(invoiceData);

        doc.pipe(fse.createWriteStream(outputFile));
        doc.text(text);
        await doc.end();
    };

    calculateTotalDue = (invoiceData: InvoiceData) => {
        const reducer = (accumulator, currentValue) => accumulator + currentValue;
        const fees = invoiceData.gigs.map(currentValue => currentValue.fee.amount);
        return fees.reduce(reducer);
    };

    formatInvoiceText = (invoiceData: InvoiceData) => {
        const totalDue = `${invoiceData.gigs[0].fee.currencySymbol}${this.calculateTotalDue(invoiceData)}`;
        const array = [];
        invoiceData.gigs.map(gig => array.push(`${gig.gigType} ${this.formatFullDate(gig.endDate)} ${gig.fee.currencySymbol}${gig.fee.amount}\n`));
        array.push(`Total due: ${totalDue}`);
        return array.join("");
    };

    private formatFullDate = (date: Date) => {
      return `${date.getFullYear()}-${this.formatMonth(date)}-${this.formatDate(date)}`
    };

    private formatMonth = (date: Date) => {
        return date.getMonth() > 8 ? date.getMonth() + 1 : `0${date.getMonth() + 1}`
    };

    private formatDate = (date: Date) => {
        return date.getDate() > 9 ? date.getDate() : `0${date.getDate()}`
    };
}
