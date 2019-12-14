module.exports = {
    env: {
        es6: true,
        node: true,
    },
    extends: [
        'airbnb-base',
        "plugin:jest/recommended",
        "plugin:jest/style",
        "plugin:import/errors",
        "plugin:import/warnings",
        "plugin:import/typescript"
    ],
    globals: {
        Atomics: 'readonly',
        SharedArrayBuffer: 'readonly',
    },
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 2018,
        sourceType: 'module',
    },
    plugins: [
        '@typescript-eslint',
        'jest',
    ],
    rules: {
        "import/no-unresolved": "error",
        "jest/no-disabled-tests": "warn",
        "jest/no-focused-tests": "error",
        "jest/no-identical-title": "error",
        "jest/prefer-to-have-length": "warn",
        "jest/valid-expect": "error"
    },
    settings: {
        "import/parsers": {
            "@typescript-eslint/parser": [".ts", ".tsx"]
        },
        "import/resolver": {
            // use <root>/tsconfig.json
            "typescript": {
                "alwaysTryTypes": true
            },


            //     // use <root>/path/to/folder/tsconfig.json
            //     "typescript": {
            //         "directory": "./path/to/folder"
            //     },
            //
            //     // Multiple tsconfigs (Useful for monorepos)
            //
            //     // use a glob pattern
            //     "typescript": {
            //         "directory": "./packages/*/tsconfig.json"
            //     },
            //
            //     // use an array
            //     "typescript": {
            //         "directory": [
            //             "./packages/module-a/tsconfig.json",
            //             "./packages/module-b/tsconfig.json"
            //         ]
            //     },
            //
            //     // use an array of glob patterns
            //     "typescript": {
            //         "directory": [
            //             "./packages/*/tsconfig.json",
            //             "./other-packages/*/tsconfig.json"
            //         ]
            //     }
        },
        "import/extensions": [
            ".js",
            ".ts"
        ]
    }
};
