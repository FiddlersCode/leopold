import {LeopoldMongoClientWrapper} from "./mongo/leopoldMongoClientWrapper";

const mongoClient = new LeopoldMongoClientWrapper(process.env.MONGO_URI);
import * as express from 'express';
let server;

const startWebApp = () => {
    const app = express();
    app.get('/healthcheck', (req, res) => {
        res.send('Service is healthy!\n');
    });

    server = app.listen(parseInt(process.env.PORT), process.env.HOST);
    console.log(`Running on http://${process.env.HOST}:${process.env.PORT}`);
};


export const startServices = async () => {
    startWebApp();
    await mongoClient.connectToDB("leopold");
};

export const endServices = async () => {
    await mongoClient.close();
    console.log("Database connection closed.");
    server.close();
    console.log("Web server closed.");
};
