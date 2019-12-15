'use strict';

import * as express from 'express';

// Constants
const PORT: number = 8080;
const HOST: string = '0.0.0.0';

// App
const app = express();
app.get('/', (req, res) => {
    res.send('Hello world\n');
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
