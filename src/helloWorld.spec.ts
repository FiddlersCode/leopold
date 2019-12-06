import {Program} from "./helloWorld"
describe("hello world", () => {
    it('returns hello world', () => {
        const expected = "hello world";
        const actual =  Program.sayHi();
        expect(expected).toBe(actual);
    });
});
