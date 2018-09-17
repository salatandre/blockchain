const express = require ('express');
const app = express ();
const bodyParser = require('body-parser');
const Blockchain = require('./blockchain');

const coin = new Blockchain();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/blockchain', function(req, res) {
	res.send(coin);
});

app.post('/transaction', function(req, res) {
	const blockIndex = coin.createNewTransaction(req.body.amount, req.body.sender, req.body.recipient);
	res.json({ note : `Transaction will be added in block ${blockIndex}.`});
});

//	Create a new block
app.get('/mine', function(req, res) {

});

app.listen(3000, function(){
	console.log('Listening on port 3000...');
});

