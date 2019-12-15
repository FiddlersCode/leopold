// eslint-disable-next-line import/extensions
import Program from './helloWorld';

describe('hello world', () => {
  it('returns hello world', () => {
    const expected = 'potato';
    const actual = Program.sayHi();
    expect(expected).toBe(actual);
  });
});
