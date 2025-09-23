const match = require('./match.js');
const express = require('express');
const app = express();
const port = 3000;

app.use(express.json())

app.get('/', (req, res) => {
    res.send("hello world");
});

app.post('/get-match', (req, res) => {
    console.log("received: ", req.body);
    res.json({ status: 'ok', received: req.body });
    new match.Match(req.body);
    console.log("AJKSDH");
});

app.listen(port, () => {
    console.log(`listening on port: ${port}`);
});