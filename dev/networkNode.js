const express = require ('express');
const app = express ();
const bodyParser = require('body-parser');
const Blockchain = require('./blockchain');
//	uuid creates an unique random string (we need it for our network node address)
const uuid = require('uuid/v1');
const port = process.argv[2];
const rp = require('request-promise');

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

//	Register a node and broadcast it to the entire network
app.post('/register-and-broadcast-node', function(req, res){
	const newNodeUrl = req.body.newNodeUrl;
	if ( coin.networkNodes.indexOf(newNodeUrl) == -1 ) 
		coin.networkNodes.push(newNodeUrl);


	const registerNodesPromises = [];
	//	broadcasting...
	coin.networkNodes.forEach(networkNodeUrl => {
		const requestOptions = {
			uri : networkNodesUrl + '/register-node',
			method : 'POST',
			body : { newNodeUrl: newNodeUrl },
			json : true
		};

		registerNodesPromises.push(rp(requestOptions));
	});
	Promise.all(regNodesPromises)
	.then(data => {
		const bulkRegisterOptions = {
			uri : newNodeUrl + '/register-nodes-bulk',
			method : 'POST',
			body : { allNetworkNodes : [ ...coin.networkNodes, coin.currentNodeUrl ] },
			json : true
		};
		return rp(bulkRegisterOptions);
	})
	.then (data => {
		res.json({note : 'New node registered with Network successfully'})
	});
});

//	Register a node with the network
app.post('/register-node', function(req, res){
	const newNodeUrl = rec.body.newNodeUrl;
	const nodeNotAlreadyPresent = coin.networkNodes.indexOf(newNodeUrl) == -1 ;
	const notCurrentNode = coin.currentNodeUrl !== newNodeUrl;
	if (nodeNotAlreadyPresent && notCurrentNode) 
		coin.networkNodes.push(newNodeUrl);
			res.json({
				note : 'New Node register successfully.'
			});
});

//	Register multiple nodes at once
app.post('register-nodes-bulk', function(req, res){

})

app.listen(port, function(){
	console.log(`Listening on port ${port}`);
});

