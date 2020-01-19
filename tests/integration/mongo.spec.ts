import {LeopoldMongoClient} from "../../src/mongo/leopoldMongoClient";
import {Concert} from "../../src/mongo/concert"
import {makeTestConcert} from "../testHelpers"

// @ts-ignore
global.console = {
    log: jest.fn(),
    error: jest.fn()
};

describe('Mongo Client Acceptance Tests', () => {
    let leopoldMongoClient: LeopoldMongoClient;
    const dbName = "integration_test";
    const collectionName = "gigs";

    beforeAll(async () => {
        process.env.MONGO_URI = `mongodb://localhost:27017/${dbName}`;
        leopoldMongoClient = new LeopoldMongoClient();
        await leopoldMongoClient.connect(dbName);
    });

    it('ss100.T10: add a new gig to the dbConnection', (done) => {
        const dressCode = `${Date.now()} ss100.T10 dress code`;
        const gigToAdd: Concert = makeTestConcert(dressCode);

        leopoldMongoClient.addGig(leopoldMongoClient.dbConnection, gigToAdd);
        const gigs = leopoldMongoClient.dbConnection.collection(collectionName);

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
        leopoldMongoClient.dbConnection.dropCollection(collectionName, (err, res) => {
            if (err) throw err;
            if (res) console.log("Deleted collection.");
            leopoldMongoClient = null;
        });
        done();
    });
});
