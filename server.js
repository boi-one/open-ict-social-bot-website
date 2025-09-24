const match = require('./match.js');
const express = require('express');
const app = express();
const port = 3000;

app.use(express.json())

app.get('/', (req, res) => {
    res.send("hello world");
});

app.post('/create-match', (req, res) => {
    console.log("received: ", req.body);
    newestMatch = new match.Match(req.body);
    res.send({customURL:`http://localhost/get-match?match=${String(newestMatch.id)}`}); //FIX NaN!!!!!!!!!!!!!!!!!!!!!!!!
});

app.post('/get-match', (req, res) => {
    console.log("match geklikt ", req.query.match);
}); 

app.listen(port, () => {
    console.log(`listening on port: ${port}`);
});