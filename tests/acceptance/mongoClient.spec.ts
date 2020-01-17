import {MongoMemoryServer} from 'mongodb-memory-server';
import * as mongodb from 'mongodb';
import {LeopoldMongoClient, Concert} from "../../src/mongo/leopoldMongoClient";
import {makeTestConcert} from "./testHelpers"

const MongoClient = mongodb.MongoClient;

// @ts-ignore
global.console = {
    log: jest.fn(),
    error: jest.fn()
};

describe('Leopold Mongo Client', () => {
    let connection;
    let db;
    let leopoldMongoClient: LeopoldMongoClient;

    beforeAll(async () => {
        leopoldMongoClient = new LeopoldMongoClient();
        const mongod = new MongoMemoryServer();
        const uri = await mongod.getUri();
        connection = await MongoClient.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        db = await connection.db();
    });

    it('ss100.T10: add a new gig to the database', (done) => {
        const dressCode = "ss100.T10 dress code";
        const gigToAdd: Concert = makeTestConcert(dressCode);

        leopoldMongoClient.addGig(db, gigToAdd);
        const gigs = db.collection("gigs");

        const callback = (doc) => {
            const expectedLogMessage = `Successfully created entry id: ${doc._id}`;
            expect(global.console.log).toHaveBeenCalledWith(expectedLogMessage);
            expect(doc).toEqual(gigToAdd);
            done();
        };

        gigs.findOne({dressCode}, (err, doc) => {
            if (err) console.log(err);
            callback(doc);
        });
    });
    it('ss100.T20 log an error if there is a problem', (done) => {
        const dressCode = "ss100.T20 dress code";
        const gigToAdd: Concert = makeTestConcert(dressCode);

        leopoldMongoClient.addGig(db, gigToAdd);
        const gigs = db.collection("gigs");
        leopoldMongoClient.addGig(db, gigToAdd);

        const callback = (doc) => {
            gigs.insertOne({_id: doc._id}, (err, res) => {
                if (err) console.log(err);
            });
            const expectedLogMessage = new mongodb.MongoError(`E11000 duplicate key error dup key: { : ObjectId('${doc._id}') }`);
            expect(global.console.error).toHaveBeenCalledWith(expectedLogMessage);
            done();
        };

        gigs.findOne({dressCode}, (err, doc) => {
            if (err) console.log(err);
            callback(doc);
        });
    });
    afterAll(async (done) => {
        db.collection.drop("gigs");
        await connection.close();
        leopoldMongoClient = null;
        db = null;
        done();
    });
});
