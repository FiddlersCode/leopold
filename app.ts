import {LeopoldMongoClientWrapper} from "./src/mongo/leopoldMongoClientWrapper";
const mongoClient = new LeopoldMongoClientWrapper();

const startServices = async() => {
    if (process.env.NODE_ENV === "production") {
        process.env.MONGO_URI = "mongodb://192.168.0.34:27017/leopold"
    }
    await mongoClient.connectToDB("leopold");
};

startServices().catch(e => {
    console.error(e);
    process.exit(1);
});

const endServices = async () => {
    await mongoClient.close();
};

process.on('SIGTERM', () => {
    endServices();
});
