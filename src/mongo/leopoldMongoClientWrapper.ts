import * as mongodb from 'mongodb';
import {Gig} from "./gig";

const MongoClient = mongodb.MongoClient;

enum MongoCollections {
    GIGS = "gigs"
}

export class LeopoldMongoClientWrapper {
    public dbConnection: any;

    connectToDB = async (database: string) => {
        const connection = await MongoClient.connect(process.env.MONGO_URI);
        this.dbConnection = connection.db(database);
        console.log(`${this.dbConnection.s.namespace} connection open.`);
    };

    close = async () => {
        await this.dbConnection.close();
        console.log(`${this.dbConnection} connection closed.`);
    };

    addGig = (db, gig: Gig): void => {
        db.collection(MongoCollections.GIGS).insertOne(gig, (err, res) => {
            err ? console.error(err) : console.log(`Successfully created entry id: ${res.ops[0]._id}`);
        })
    }
}
