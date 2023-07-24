const express = require('express');
const Test = require('./modules/test.controller');

const app = express();
const port = 3000;

app.get('/', (req, res) => {
    const result = Test.solution();
    res.json(result);
});

app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
});
