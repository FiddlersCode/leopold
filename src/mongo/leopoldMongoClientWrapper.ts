import * as mongodb from 'mongodb';
import {Gig} from "./gig";
import {Concert} from "./concert";

const MongoClient = mongodb.MongoClient;


enum MongoCollections {
    GIGS = "gigs"
}

/** Class representing a wrapper around the database client.
 * Extends parent methods from the base MongoClient.
 * @class LeopoldMongoClientWrapper
 */

export class LeopoldMongoClientWrapper extends MongoClient {
    public dbConnection: any;

    /**
     * Connect to the database.
     * @param {string} database - the name of the database you wish to connect to.
     */
    connectToDB = async (database: string): Promise<void> => {
        const connection = await MongoClient.connect(process.env.MONGO_URI);
        this.dbConnection = connection.db(database);
        console.log(`${this.dbConnection.s.namespace} connection open.`);
    };

    /**
     * Add a gig to the database.
     * @param {Gig | Concert} gig - the gig you wish to add to the database.
     */
    addGig = (gig: Gig | Concert): void => {
        this.dbConnection.collection(MongoCollections.GIGS).insertOne(gig, (err, res) => {
            err ? console.error(err) : console.log(`Successfully created entry id: ${res.ops[0]._id}`);
        })
    };

    /**
     * Add multiple gigs to the database.
     * @param {Gig[] | Concert[]} gigs - the gigs you wish to add to the database.
     */
    addGigs = (gigs: Gig[] | Concert[]): void => {
        this.dbConnection.collection(MongoCollections.GIGS).insertMany(gigs, (err, res) => {
            err ? console.error(err) : console.log(`Successfully entered ${res.insertedCount} gigs.`);
        })
    };

    /**
     * Retrieve a list of gigs from the database.
     * @param {object} filter - any filters on the query
     * (see tests/unit/leopoldMongoClientWrapperQueries.spec.ts for examples).
     * @return {Gig[] | Concert[]} the gigs you have requested.

     */
    getGigs = (filter: object = {}): Gig[] | Concert[] => {
        return this.dbConnection.collection(MongoCollections.GIGS).find(filter).toArray();
    }
}
