import * as mongodb from 'mongodb';
import {Gig} from "./gig";
import {Concert} from "./concert";

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

    addGig = (gig: Gig | Concert): void => {
        this.dbConnection.collection(MongoCollections.GIGS).insertOne(gig, (err, res) => {
            err ? console.error(err) : console.log(`Successfully created entry id: ${res.ops[0]._id}`);
        })
    };

    addGigs = (gigs: Gig[] | Concert[]): void => {
        this.dbConnection.collection(MongoCollections.GIGS).insertMany(gigs, (err, res) => {
            err ? console.error(err) : console.log(`Successfully entered ${res.insertedCount} gigs.`);
        })
    };

    getGigs = (filter: object = {}): Gig[] | Concert[] => {
        return this.dbConnection.collection(MongoCollections.GIGS).find(filter).toArray();
    }
}
