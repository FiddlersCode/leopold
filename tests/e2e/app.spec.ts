import * as Axios from 'axios';
import {startServices} from "../../src/app";
// @ts-ignore
global.console = {
    log: jest.fn(),
    error: jest.fn()
};

describe('App entrypoint', () => {

    beforeAll(async () => {

    });

    it('ss100.T10: start services', () => {
        startServices();

    });

    afterAll(async (done) => {
    });
});
