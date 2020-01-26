import {MongoMemoryServer} from 'mongodb-memory-server';
import * as mongodb from 'mongodb';
import {LeopoldMongoClientWrapper} from "../../src/mongo/leopoldMongoClientWrapper";
import {Concert} from "../../src/mongo/concert"
import {makeTestConcert} from "../testHelpers"
import {Gig} from "../../src/mongo/gig";


// @ts-ignore
global.console = {
    log: jest.fn(),
    error: jest.fn()
};

describe('Leopold Mongo Client Wrapper', () => {
    let leopoldMongoClientWrapper: LeopoldMongoClientWrapper;
    const testDB: string = "unit-test";
    let gigsCollection: any;

    beforeAll(async () => {
        const mongod = new MongoMemoryServer();
        process.env.MONGO_URI = await mongod.getUri();
        leopoldMongoClientWrapper = new LeopoldMongoClientWrapper(
            process.env.MONGO_URI,
            { useUnifiedTopology: true }
        );
        await leopoldMongoClientWrapper.connectToDB(testDB);
        gigsCollection = leopoldMongoClientWrapper.dbConnection.collection("gigs");
    });

    describe('DB Connections', () => {
        it('ss100.T10: open database connection', () => {
            const expectedLogMessage: string = `${testDB} connection open.`;
            expect(global.console.log).toHaveBeenCalledWith(expectedLogMessage)
        });
    });
    describe('DB insertions', () => {

        it('ss100.T10: add a gig to the db', (done) => {
            const dressCode = "ss100.T10";
            const concertToAdd: Concert | Gig = makeTestConcert(dressCode);

            leopoldMongoClientWrapper.addGig(concertToAdd);
            const gigs = leopoldMongoClientWrapper.dbConnection.collection("gigs");

            const callback = (doc) => {
                const expectedLogMessage = `Successfully created entry id: ${doc._id}`;
                const expectedLogMessage1 = "unit-test connection open.";
                expect(global.console.log).toHaveBeenCalledWith(expectedLogMessage1);
                expect(global.console.log).toHaveBeenCalledWith(expectedLogMessage);
                expect(doc).toEqual(concertToAdd);
                done();
            };

            gigs.findOne({dressCode}, (err, doc) => {
                if (err) console.log(err);
                callback(doc);
            });
        });
        it('ss100.T15: add multiple gigs to the db', async () => {
            const dressCode = "ss100.T15";
            const numberOfGigs = 2;
            const gigsToAdd: any[] = [];
            for (let i: number = 0; i < numberOfGigs; i++) {
                gigsToAdd.push(makeTestConcert(dressCode));
                gigsToAdd.push(makeTestConcert(dressCode));
            }
            leopoldMongoClientWrapper.addGigs(gigsToAdd);
            const gigsAdded = await gigsCollection.find({dressCode}).toArray();
            expect(gigsToAdd.length).toEqual(gigsAdded.length);

            const expectedLogMessage = `Successfully entered ${gigsToAdd.length} gigs.`;
            expect(global.console.log).toHaveBeenCalledWith(expectedLogMessage);
        });
        it('ss100.T20 log an error if there is a problem adding one gig', (done) => {
            const dressCode = "ss100.T20";
            const gigToAdd: Concert | Gig = makeTestConcert(dressCode);

            leopoldMongoClientWrapper.addGig(gigToAdd);
            const gigs = leopoldMongoClientWrapper.dbConnection.collection("gigs");
            leopoldMongoClientWrapper.addGig(gigToAdd);

            const callback = (doc) => {
                gigs.insertOne({_id: doc._id}, (err) => {
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
        it('ss100.T25 log an error if there is a problem adding multiple gigs', (done) => {
            const dressCode = "ss100.T25";
            const gigToAdd: Concert | Gig = makeTestConcert(dressCode);

            leopoldMongoClientWrapper.addGigs([gigToAdd]);
            const gigs = leopoldMongoClientWrapper.dbConnection.collection("gigs");
            leopoldMongoClientWrapper.addGigs([gigToAdd]);

            const callback = (doc) => {
                gigs.insertOne({_id: doc._id}, (err) => {
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
    });

    afterAll(async (done) => {
        await leopoldMongoClientWrapper.dbConnection.collection.drop("gigs");
        await leopoldMongoClientWrapper.dbConnection.close();
        leopoldMongoClientWrapper = null;
        done();
    });
});
