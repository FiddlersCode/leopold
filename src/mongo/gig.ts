import {Org} from "./org";
import {Venue} from "./venue";
import {Fee} from "./fee";
import {Repertoire} from "./repertoire"

export enum GigType {
    Rehearsal = "Rehearsal",
    Concert = "Concert",
    Tuition = "Tuition",
    Other = "Other",
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
