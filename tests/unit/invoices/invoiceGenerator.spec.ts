import {InvoiceGenerator} from "../../../src/invoices/invoiceGenerator"
import * as TestTypes from "../testTypes"
import {PdfReader} from 'pdfreader';

describe('Invoice Generator', () => {
    const pdfReader = new PdfReader();
    beforeAll(async () => {
    });
    it("temp test", () => {

        const invoiceGenerator = new InvoiceGenerator();
        const totalDue = invoiceGenerator.calculateTotalDue(TestTypes.invoiceData);
        expect(totalDue).toEqual(360);
    });
    it("ss100.T10: generates a PDF invoice", async () => {
        const invoiceGenerator = new InvoiceGenerator();
        const outputFile = "generated.pdf";
        await invoiceGenerator.generateInvoice(TestTypes.invoiceData, outputFile);
        await new Promise(r => setTimeout(r, 1000));
        let rows = {};
        const sortedRows = [];

        const sortRows = () =>  {
            return Object.keys(rows)
                .sort((y1, y2) => parseFloat(y1) - parseFloat(y2))
                .map(y => sortedRows.push((rows[y] || []).join("")));
        };
        pdfReader.parseFileItems(outputFile, (err, item) => {
            if (!item || item.page) {
                // printRows();
                // console.log("PAGE:", item.page);
                // rows = {};
            } else if (item.text) {
                (rows[item.y] = rows[item.y] || []).push(item.text);
            }
        });
        await new Promise(r => setTimeout(r, 1000));

        sortRows();
        const expectedRows = [
            "Concert 2020-05-01 £120",
            "Concert 2020-05-01 £120",
            "Concert 2020-10-10 £120",
            "Total due: £360"
        ];
        sortedRows.forEach((row, i) => {
            expect(row).toEqual(expectedRows[i]);
        })
    });
});
