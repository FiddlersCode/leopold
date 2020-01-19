import {MongoMemoryServer} from 'mongodb-memory-server';
import {LeopoldMongoClientWrapper} from "../../src/mongo/leopoldMongoClientWrapper";
import {Concert} from "../../src/mongo/concert"
import {makeTestConcert} from "../testHelpers"

// @ts-ignore
global.console = {
    log: jest.fn(),
    error: jest.fn()
};

describe('Leopold Mongo Client', () => {
    let leopoldMongoClientWrapper: LeopoldMongoClientWrapper;
    const testDB = "unit-test";

    beforeAll(async () => {
        leopoldMongoClientWrapper = new LeopoldMongoClientWrapper();
        const mongod = new MongoMemoryServer();
        process.env.MONGO_URI = await mongod.getUri();
        await leopoldMongoClientWrapper.connectToDB(testDB);
    });

    it('ss100.T05: connect to the database', () => {
        const expectedLogMessage: string = `${testDB} connection open.`;
        expect(global.console.log).toHaveBeenCalledWith(expectedLogMessage)
    });
    it('ss100.T10: add a new gig to the dbConnection', (done) => {
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
    afterAll(async (done) => {
        await leopoldMongoClientWrapper.dbConnection.collection.drop("gigs");
        await leopoldMongoClientWrapper.close();
        leopoldMongoClientWrapper = null;
        done();
    });
});
