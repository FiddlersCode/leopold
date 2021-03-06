import {GigType, Gig} from "../src/gig";
import {Concert} from "../src/concert";

export const makeTestConcert = (dressCode = "all black"): Concert | Gig => {
    return {
        dressCode,
        rehearsals: [],
        endDate: new Date("2020-01-18 17:00"),
        fee: {amount: 324, currencySymbol: "£"},
        gigType: GigType.Concert,
        repertoire: [{
            title: "lots of kiddie music",
            composer: "various"
        }],
        org: {
            name: "Cambridge Philharmonic",
            fixer: {
                firstName: "testFixerFirst",
                lastName: "testFixerLast",
                phoneNumber: "000002727",
                email: "tester@test.com"
            }
        },
        standRequired: false,
        startDate: new Date("2020-01-18 10:00"),
        venue: {
            name: "West Road Concert Hall"
        }
    };
};
