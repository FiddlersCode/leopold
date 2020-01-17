import {Gig} from "./gig";

export interface Concert extends Gig {
    dressCode: string,
    rehearsals: Gig[],
}
