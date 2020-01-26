const axios = require('axios').default;
import {endServices, startServices} from "../../src/services";
import {routes} from "../../routes";

// @ts-ignore
global.console = {
    log: jest.fn(),
    error: jest.fn()
};

describe('Services', () => {
    let response;
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
