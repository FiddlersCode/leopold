import * as mongodb from 'mongodb';
const MongoClient = mongodb.MongoClient;

import {Gig} from "./gig";

enum MongoCollections {
    GIGS = "gigs"
}

export class LeopoldMongoClient{
    public dbConnection: any;

    connect = async (database: string) => {
        const connection = await MongoClient.connect(
            process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        this.dbConnection = connection.db(database);
    };

    addGig = (db, gig: Gig): void => {
        db.collection(MongoCollections.GIGS).insertOne(gig, (err, res) => {
            err ? console.error(err) : console.log(`Successfully created entry id: ${res.ops[0]._id}`);
        })
    }
}
