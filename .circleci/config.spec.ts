import * as  yaml from 'js-yaml';
import * as fs from 'fs';
import * as path from 'path';

describe('Yaml validator', () => {
    it('validates the config.yml', () => {
        const yamlFileName = ".circleci/config.yml";
        const actual = () => yaml.safeLoad(fs.readFileSync(path.resolve(yamlFileName), 'utf8'));
        expect(() => actual()).not.toThrow();
    });
});
