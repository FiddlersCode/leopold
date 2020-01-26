import {MongoMemoryServer} from 'mongodb-memory-server';
import {LeopoldMongoClientWrapper} from "../../src/mongo/leopoldMongoClientWrapper";
import {makeTestConcert} from "../testHelpers"
import {Gig} from "../../src/mongo/gig";
import {Concert} from "../../src/mongo/concert";

describe('Leopold Mongo Client Wrapper', () => {
    let leopoldMongoClientWrapper: LeopoldMongoClientWrapper;
    const testDB = "unit-test";
    let gigs: any;

    beforeAll(async () => {
        const mongod = new MongoMemoryServer();
        process.env.MONGO_URI = await mongod.getUri();
        leopoldMongoClientWrapper = new LeopoldMongoClientWrapper(process.env.MONGO_URI);
        await leopoldMongoClientWrapper.connectToDB(testDB);
        gigs = leopoldMongoClientWrapper.dbConnection.collection("gigs");
    });

    describe('DB queries', () => {
        it("ss100.T10 gets all concerts", async () => {
            const dressCodes = ["ss100.T10.10", "ss100.T10.20"];
            const gigsToInsert: Gig[] | Concert[] = [
                makeTestConcert(dressCodes[0]), makeTestConcert(dressCodes[1])
            ];
            leopoldMongoClientWrapper.addGigs(gigsToInsert);

            const gigs: Gig[] | Concert[] = await leopoldMongoClientWrapper.getGigs();
            gigs.forEach((concert: Concert, i: number) => {
                expect(concert.dressCode).toEqual(dressCodes[i]);
            })
        });
        it("ss100.T20 gets all concerts for a specific organisation", async () => {
            const dressCode = "ss100.T20";
            const gigsToInsert: Gig[] = [makeTestConcert(dressCode)];
            leopoldMongoClientWrapper.addGigs(gigsToInsert);

            const testOrg = "Cambridge Philharmonic";
            const concerts = await leopoldMongoClientWrapper.getGigs({org: testOrg});
            concerts.forEach((concert) => {
                expect(concert.org).toEqual(testOrg);
            })
        });

        it("ss100.T30 gets all concerts for a specific month", async () => {
            const dressCode = "ss100.T30";
            const gigsToInsert: Concert[] | Gig[] = [
                makeTestConcert(dressCode), makeTestConcert(dressCode)
            ];
            leopoldMongoClientWrapper.addGigs(gigsToInsert);

            const month = {
                jsMonth: 0,
                mongoMonth: 1
            };
            const filter = {
                "$expr": {
                    "$eq": [
                        {"$month": "$startDate"}, month.mongoMonth,
                    ]
                },
                "$and": [{
                    dressCode: dressCode
                }]
            };
            const concerts = await leopoldMongoClientWrapper.getGigs(filter);
            expect(concerts.length).toBe(2);
            concerts.forEach((concert) => {
                expect(concert.startDate.getMonth()).toEqual(month.jsMonth);
            })
        });
    });

    afterAll(async (done) => {
        await leopoldMongoClientWrapper.dbConnection.dropCollection("gigs");
        await leopoldMongoClientWrapper.close();
        leopoldMongoClientWrapper = null;
        done();
    });
});
