import * as mongodb from 'mongodb';
import {Gig} from "../gig";
import {Concert} from "../concert";
import {Db} from "mongodb";

const MongoClient = mongodb.MongoClient;


export enum MongoCollections {
    GIGS = "gigs"
}

/** Class representing a wrapper around the database client.
 * Extends parent methods from the base MongoClient.
 * @class LeopoldMongoClientWrapper
 */

export class LeopoldMongoClientWrapper {
    public dbConnection: any;
    public db: Db;
    private readonly mongoURI: string;

    constructor(mongoURI) {
        this.mongoURI = mongoURI
    }

    /**
     * Connect to the database.
     * @param {string} database - the name of the database you wish to connect to.
     */
    connectToDB = async (database: string): Promise<void> => {
        this.dbConnection = await MongoClient.connect(this.mongoURI);
        this.db = this.dbConnection.db(database);
        console.log(`${this.dbConnection.s.namespace} connection open.`);
    };

    /**
     * Add multiple gigs to the database.
     * @param {Gig[] | Concert[]} gigs - the gigs you wish to add to the database. Can be a single-item array.
     */
    addGigs = (gigs: Gig[] | Concert[]): void => {
        this.db.collection(MongoCollections.GIGS).insertMany(gigs, (err, res) => {
            err ? console.error(err) : console.log(`Successfully entered ${res.insertedCount} gigs.`);
        })
    };

    /**
     * Retrieve a list of gigs from the database.
     * @param {object} filter - any filters on the query
     * (see tests/unit/leopoldMongoClientWrapperQueries.spec.ts for examples).
     * @return {Gig[] | Concert[]} the gigs you have requested.

     */
    getGigs = (filter: object = {}) => {
        return this.db.collection(MongoCollections.GIGS).find(filter).toArray();
    }
}
