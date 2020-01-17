import {ContactPerson} from "./contactPerson";

export interface Org {
    name: string,
    fixer: ContactPerson,
    treasurer?: ContactPerson,
}
