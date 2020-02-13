import {MongoMemoryServer} from 'mongodb-memory-server';
import * as mongodb from 'mongodb';
import {LeopoldMongoClientWrapper, MongoCollections} from "../../src/mongo/leopoldMongoClientWrapper";
import {Concert} from "../../src/concert"
import {makeTestConcert} from "../testHelpers"
import {Gig} from "../../src/gig";


// @ts-ignore
global.console = {
    log: jest.fn(),
    error: jest.fn()
};

describe('Leopold Mongo Client Wrapper', () => {
    let leopoldMongoClientWrapper: LeopoldMongoClientWrapper;
    const testDB: string = "unit-test";
    let gigsCollection: any;
    let mongod: MongoMemoryServer;

    beforeAll(async (done) => {
        mongod = new MongoMemoryServer();
        const mongoUri = await mongod.getUri();
        leopoldMongoClientWrapper = new LeopoldMongoClientWrapper(mongoUri);
        await leopoldMongoClientWrapper.connectToDB(testDB);
        gigsCollection = leopoldMongoClientWrapper.db.collection(MongoCollections.GIGS);
        done();
    });

    describe('ss100: DB insertions', () => {
        it('ss100.T20: add multiple gigs to the db', async () => {
            const dressCode = "ss100.T15";
            const numberOfGigs = 2;
            const gigsToAdd: any[] = [];
            for (let i: number = 0; i < numberOfGigs; i++) {
                gigsToAdd.push(makeTestConcert(dressCode));
            }
            leopoldMongoClientWrapper.addGigs(gigsToAdd);
            const gigsAdded = await gigsCollection.find({dressCode}).toArray();
            const expectedLogMessage = `Successfully entered ${gigsToAdd.length} gigs.`;
            expect(global.console.log).toHaveBeenCalledWith(expectedLogMessage);
            expect(gigsAdded.length).toEqual(numberOfGigs);

        });
        it('ss100.T20 log an error if there is a problem adding multiple gigs', (done) => {
            const dressCode = "ss100.T25";
            const gigToAdd: Concert | Gig = makeTestConcert(dressCode);

            leopoldMongoClientWrapper.addGigs([gigToAdd]);
            leopoldMongoClientWrapper.addGigs([gigToAdd]);

            const callback = (doc) => {
                gigsCollection.insertOne({_id: doc._id}, (err) => {
                    if (err) console.log(err);
                });
                const expectedLogMessage = new mongodb.MongoError(`E11000 duplicate key error dup key: { : ObjectId('${doc._id}') }`);
                expect(global.console.error).toHaveBeenCalledWith(expectedLogMessage);
                done();
            };

            gigsCollection.findOne({dressCode}, (err, doc) => {
                if (err) console.log(err);
                callback(doc);
            });
        });
    });

    afterAll(async (done) => {
        await leopoldMongoClientWrapper.db.dropCollection(MongoCollections.GIGS);
        await leopoldMongoClientWrapper.dbConnection.close();
        leopoldMongoClientWrapper = null;
        mongod = null;
        done();
    });
});
