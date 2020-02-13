import * as fse from 'fs-extra'
import {InvoiceGenerator} from "../../../src/invoices/invoiceGenerator"
import * as TestTypes from "../testTypes"
import {PdfReader} from 'pdfreader';

describe('Invoice Generator', () => {
    let pdfReader: PdfReader;
    let invoiceGenerator: InvoiceGenerator;
    let outputFile: string;
    beforeAll(() => {
        pdfReader = new PdfReader();
        invoiceGenerator = new InvoiceGenerator();
        outputFile = "generated.pdf";
    });
    it("ss100.T10: calculates the total due", () => {
        const totalDue = invoiceGenerator.calculateTotalDue(TestTypes.invoiceData);
        expect(totalDue).toEqual(360);
    });

    it("ss100.T20: generates a PDF invoice", async () => {
        await invoiceGenerator.generateInvoice(TestTypes.invoiceData, outputFile);
        const rows = [];
        const expectedRows = [
            "From: Keiko O'Brien",
            "keiko.obrien@starfleet.com",
            "Attention: Deanna Troi",
            "Date: 2020-10-31",
            "Concert 2020-05-01 £120",
            "Concert 2020-05-01 £120",
            "Concert 2020-10-10 £120",
            "Total due: £360",
            "Bank Details:",
            "Bank of Starfleet",
            "000000",
            "12345678",
        ];

        const executeAssertion = () => {
            rows.forEach((row, i) => {
                expect(row).toEqual(expectedRows[i]);
                expect(rows.length).toEqual(expectedRows.length);
            });
        };

        pdfReader.parseFileItems(outputFile, (err, item) => {
            if (!item || item.page) {
                executeAssertion();
            } else if (item.text) {
                rows.push(item.text);
            }
        });
    });

    afterAll( async () => {
        pdfReader = null;
        invoiceGenerator = null;
        await fse.unlink(outputFile, function (err) {
            if (err) throw err;
        });
    });
});
