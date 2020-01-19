import {MongoMemoryServer} from 'mongodb-memory-server';
import {LeopoldMongoClient} from "../../src/mongo/leopoldMongoClient";
import {Concert} from "../../src/mongo/concert"
import {makeTestConcert} from "../testHelpers"

// @ts-ignore
global.console = {
    log: jest.fn(),
    error: jest.fn()
};

describe('Leopold Mongo Client', () => {
    let leopoldMongoClient: LeopoldMongoClient;

    beforeAll(async () => {
        leopoldMongoClient = new LeopoldMongoClient();
        const mongod = new MongoMemoryServer();
        process.env.MONGO_URI = await mongod.getUri();
        await leopoldMongoClient.connect("unit-test");
    });

    it('ss100.T10: add a new gig to the dbConnection', (done) => {
        const dressCode = `${Date.now()} ss100.T10 dress code`;
        const gigToAdd: Concert = makeTestConcert(dressCode);

        leopoldMongoClient.addGig(leopoldMongoClient.dbConnection, gigToAdd);
        const gigs = leopoldMongoClient.dbConnection.collection("gigs");

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
    afterAll(async (done) => {
        leopoldMongoClient.dbConnection.collection.drop("gigs");
        leopoldMongoClient = null;
        done();
    });
});
