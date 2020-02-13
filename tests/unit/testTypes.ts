import {ContactPerson} from "../../src/mongo/contactPerson";
import {Org} from "../../src/mongo/org";
import {Gig, GigType} from "../../src/mongo/gig";
import {InvoiceData} from "../../src/invoices/invoiceGenerator"
import {Fee} from "../../src/mongo/fee";
import {Repertoire} from "../../src/mongo/repertoire";
import {Venue} from "../../src/mongo/venue";
import {BankDetails} from "../../src/mongo/bankDetails";


export const fee: Fee = {
    amount: 120,
    currencySymbol: "£"
};

export const fixer: ContactPerson = {
    firstName: "Deanna",
    lastName: "Troi",
    email: "deanna.troi@starfleet.com",
    phoneNumber: "00000000"
};

export const org: Org = {
    name: "Starfleet Orchestra",
    fixer
};

export const repertoire: Repertoire[] = [
    {
        composer: "Ludwig van Beethoven",
        title: "Missa Solemnis"
    }
];

export const venue: Venue = {
    name: "Ten Forward",
};

export const gigs: Gig[] = [
    {
        endDate: new Date("2020-05-01"),
        fee,
        gigType: GigType.Concert,
        org,
        repertoire,
        standRequired: false,
        startDate: new Date("2020-05-01"),
        venue,
    },
    {
        endDate: new Date("2020-05-01"),
        fee,
        gigType: GigType.Concert,
        org,
        repertoire,
        standRequired: false,
        startDate: new Date("2020-05-01"),
        venue,
    },
    {
        endDate: new Date("2020-10-10"),
        fee,
        gigType: GigType.Concert,
        org,
        repertoire,
        standRequired: false,
        startDate: new Date("2020-05-01"),
        venue,
    }
];


export const musician: ContactPerson = {
    firstName: "Keiko",
    lastName: "O'Brien",
    email: "keiko.obrien@starfleet.com",
    phoneNumber: "1111111111"
};

export const bankDetails: BankDetails= {
  bankName: "Bank of Starfleet",
  sortCode: "000000",
  account: "12345678"
};

export const invoiceData: InvoiceData = {
    invoiceDate: new Date("2020-10-31"),
    musician,
    gigs,
    dueDate: new Date("2020-03-01"),
    bankDetails
};
