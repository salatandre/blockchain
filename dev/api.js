const express = require ('express');
const app = express ();
const bodyParser = require('body-parser');
const Blockchain = require('./blockchain');
//	uuid creates an unique random string (we need it for our network node address)
const uuid = require('uuid/v1');

const nodeAddress = uuid().split('-').join('');	

const coin = new Blockchain();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//	Get entire blockchain
app.get('/blockchain', function(req, res) {
	res.send(coin);
});

//	Create a new transaction
app.post('/transaction', function(req, res) {
	const blockIndex = coin.createNewTransaction(req.body.amount, req.body.sender, req.body.recipient);
	res.json({ note : `Transaction will be added in block ${blockIndex}.`});
});

//	Create/mine a new block
app.get('/mine', function(req, res) {

	const lastBlock = coin.getLastBlock();
	const previousBlockHash = lastBlock['hash'];
	const currentBlockData = {
		transactions : coin.pendingTransactions,
		index : lastBlock['index'] + 1
	};

	const nonce = coin.proofOfWork(previousBlockHash, currentBlockData);
	const blockHash = coin.hashBlock(previousBlockHash, currentBlockData, nonce);

	// 12.5 is a random mining reward
	coin.createNewTransaction(12.5, "00", nodeAddress);

	const newBlock = coin.createNewBlock(nonce, previousBlockHash, blockHash);

	res.json({
		note : "New block mined succesfully",
		block : newBlock
	})
});

app.listen(3000, function(){
	console.log('Listening on port 3000...');
});

