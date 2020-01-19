import {MongoMemoryServer} from 'mongodb-memory-server';
import * as mongodb from 'mongodb';
import {LeopoldMongoClientWrapper} from "../../src/mongo/leopoldMongoClientWrapper";
import {Concert} from "../../src/mongo/concert"
import {makeTestConcert} from "../testHelpers"


// @ts-ignore
global.console = {
    log: jest.fn(),
    error: jest.fn()
};

describe('Leopold Mongo Client Wrapper', () => {
    let leopoldMongoClientWrapper: LeopoldMongoClientWrapper;
    const testDB = "unit-test";

    beforeAll(async () => {
        leopoldMongoClientWrapper = new LeopoldMongoClientWrapper();
        const mongod = new MongoMemoryServer();
        process.env.MONGO_URI = await mongod.getUri();
        await leopoldMongoClientWrapper.connectToDB(testDB);
    });

    describe('DB Connections', () => {
        it('ss100.T10: open database connection', () => {
            const expectedLogMessage: string = `${testDB} connection open.`;
            expect(global.console.log).toHaveBeenCalledWith(expectedLogMessage)
        });
    });
    it('ss100.T10: add a new gig to the db', (done) => {
        const dressCode = `${Date.now()} ss100.T10 dress code`;
        const gigToAdd: Concert = makeTestConcert(dressCode);

        leopoldMongoClientWrapper.addGig(leopoldMongoClientWrapper.dbConnection, gigToAdd);
        const gigs = leopoldMongoClientWrapper.dbConnection.collection("gigs");

        const callback = (doc) => {
            const expectedLogMessage = `Successfully created entry id: ${doc._id}`;
            const expectedLogMessage1 = "unit-test connection open.";
            expect(global.console.log).toHaveBeenCalledWith(expectedLogMessage1);
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

        leopoldMongoClientWrapper.addGig(leopoldMongoClientWrapper.dbConnection, gigToAdd);
        const gigs = leopoldMongoClientWrapper.dbConnection.collection("gigs");
        leopoldMongoClientWrapper.addGig(leopoldMongoClientWrapper.dbConnection, gigToAdd);

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
        await leopoldMongoClientWrapper.dbConnection.collection.drop("gigs");
        await leopoldMongoClientWrapper.dbConnection.close();
        leopoldMongoClientWrapper = null;
        done();
    });
});
