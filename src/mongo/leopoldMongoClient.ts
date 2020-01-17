import {Gig} from "./gig";

enum MongoCollections {
    GIGS = "gigs"
}

export class LeopoldMongoClient {
    addGig = (db, gig: Gig): void => {
        db.collection(MongoCollections.GIGS).insertOne(gig, (err, res) => {
            err ? console.error(err) : console.log(`Successfully created entry id: ${res.ops[0]._id}`);
        })
    }
}
