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
};

export const endServices = async () => {
    server.close();
    console.log("Web server closed.");
};
