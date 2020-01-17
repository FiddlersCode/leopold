export enum GigType {
    Rehearsal = "rehearsal",
    Concert = "concert",
    Tuition = "tuition",
    Other = "other",
}

interface Org {
    name: string,
    fixer: ContactPerson,
    treasurer?: ContactPerson,
}

interface ContactPerson {
    firstName: string,
    lastName: string,
    phoneNumber: string,
    email: string
}

interface Venue {
    accessInfo?: string,
    name: string,
    parkingInfo?: string,
    postCode?: string,
    seatCushionNeeded?: boolean,
    streetAddress?: string
}

export interface Concert extends Gig {
    dressCode: string,
    rehearsals: Gig[],
}

interface Fee {
    amount: number
    currencySymbol: string,
}

interface Repertoire {
    composer: string
    title: string,
}

export interface Gig {
    endDate: Date,
    fee: Fee,
    gigType: GigType,
    org: Org,
    repertoire: Repertoire[]
    standRequired: boolean,
    startDate: Date,
    venue: Venue,
}

enum Collections {
    GIGS = "gigs"
}

export class LeopoldMongoClient {
    addGig = (db, gig: Gig): void => {
        db.collection(Collections.GIGS).insertOne(gig, (err, res) => {
            err ? console.error(err) : console.log(`Successfully created entry id: ${res.ops[0]._id}`);
        })
    }
}
