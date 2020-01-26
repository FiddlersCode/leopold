import {LeopoldMongoClientWrapper} from "./mongo/leopoldMongoClientWrapper";
const mongoClient = new LeopoldMongoClientWrapper();
import * as express from 'express';

const startWebApp = () => {
    const app = express();
    const port: number = parseInt(process.env.PORT) || 8080;
    app.get('/healthcheck', (req, res) => {
        res.send('Service is healthy!\n');
    });

    app.listen(port, process.env.HOST);
    console.log(`Running on http://${process.env.HOST}:${process.env.PORT}`);
};



export const startServices = async() => {
    if (process.env.NODE_ENV === "production") {
        process.env.MONGO_URI = "mongodb://192.168.0.34:27017/leopold";
        process.env.PORT = '8080';
        process.env.HOST = "192.168.0.34"
    }
    startWebApp();
    await mongoClient.connectToDB("leopold");
};

startServices().catch(e => {
    console.error(e);
    process.exit(1);
});

const endServices = async () => {
    await mongoClient.dbConnection.close();
};

process.on('SIGTERM', async () => {
    await endServices();
});
