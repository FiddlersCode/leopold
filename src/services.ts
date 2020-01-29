import * as express from 'express';
import {config} from '../config'

let server;

const startWebApp = () => {
    const app = express();

    app.get('/healthcheck', (req, res) => {
        res.send('Service is healthy!\n');
    });
    server = app.listen(parseInt(process.env.PORT), process.env.HOST);
    console.log(`Running on http://${process.env.HOST}:${process.env.PORT}`);

};


const setProdConfig = () => {
    process.env.PORT = config.production.PORT;
    process.env.HOST = config.production.HOST
};

export const startServices = async () => {
    if (process.env.NODE_ENV === "production") {
        setProdConfig();
    }
    startWebApp();
};

export const endServices = async () => {
    server.close();
    console.log("Web server closed.");
};
