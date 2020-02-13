import {Gig} from "../mongo/gig"
import * as fse from 'fs-extra'
import {ContactPerson} from "../mongo/contactPerson";
import {BankDetails} from "../mongo/bankDetails";

export interface InvoiceData {
    invoiceDate: Date,
    musician: ContactPerson,
    gigs: Gig[],
    dueDate: Date,
    bankDetails: BankDetails
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

    formatInvoiceText = (invoiceData: InvoiceData) => {
        const array = [];

        array.push(`From: ${invoiceData.musician.firstName} ${invoiceData.musician.lastName}\n`);
        array.push(`${invoiceData.musician.email}\n`);

        array.push(`Attention: ${invoiceData.gigs[0].org.fixer.firstName} ${invoiceData.gigs[0].org.fixer.lastName}\n`);

        array.push(`Date: ${this.formatFullDate(invoiceData.invoiceDate)}\n`);

        invoiceData.gigs.map(gig => array.push(`${gig.gigType} ${this.formatFullDate(gig.endDate)} ${gig.fee.currencySymbol}${gig.fee.amount}\n`));

        const totalDue = `${invoiceData.gigs[0].fee.currencySymbol}${this.calculateTotalDue(invoiceData)}`;
        array.push(`Total due: ${totalDue}\n`);
        array.push("Bank Details:\n");
        array.push(`${invoiceData.bankDetails.bankName}\n`);
        array.push(`${invoiceData.bankDetails.sortCode}\n`);
        array.push(`${invoiceData.bankDetails.account}\n`);
        return array.join("");
    };

    calculateTotalDue = (invoiceData: InvoiceData) => {
        const reducer = (accumulator, currentValue) => accumulator + currentValue;
        const fees = invoiceData.gigs.map(currentValue => currentValue.fee.amount);
        return fees.reduce(reducer);
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
