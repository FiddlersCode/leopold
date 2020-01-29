const axios = require('axios').default;
import {endServices, startServices} from "../../src/services";
import {routes} from "../../routes";
import {config} from "../../config";

// @ts-ignore
global.console = {
    log: jest.fn(),
    error: jest.fn()
};

describe('Services', () => {
    let response;
    describe('Local mode', () => {
        beforeAll((async () => {
            await startServices();
            response = await axios.get(`http://${process.env.HOST}:${process.env.PORT}/${routes.healthcheck}`);

        }));

        it('ss100.T10: starts the web server', async () => {
            expect(response.status).toBe(200);
            expect(response.data).toEqual("Service is healthy!\n");
            const expectedLogMessage = `Running on http://${process.env.HOST}:${process.env.PORT}`;
            expect(global.console.log).toHaveBeenCalledWith(expectedLogMessage);
        });

        it('ss100.T20: closes the connections', async () => {
            await endServices();
            try {
                await axios.get(`http://${process.env.HOST}:${process.env.PORT}/${routes.healthcheck}`)
            } catch (e) {
                if (e) console.log(e);
                expect(e.message).toEqual('connect ECONNREFUSED 127.0.0.1:8000');
            }
        });
    });

    describe("Production mode", () => {
        it('ss100.T10: sets the production mode', async () => {
            process.env.NODE_ENV = "production";
            await startServices();
            expect(process.env.MONGO_URI).toBe(config.production.MONGO_URI);
            expect(process.env.PORT).toBe(config.production.PORT);
            expect(process.env.HOST).toBe(config.production.HOST);
        });
    })
});
